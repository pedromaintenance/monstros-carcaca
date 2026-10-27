#!/usr/bin/env python3
"""Gera dist/carcaca de forma determinística sem misturar fontes ou alterar curadoria.
Uso: python scripts/gerar_indices_curadoria.py [--check]
"""
from __future__ import annotations
import argparse
import json
import gzip
import re
import unicodedata
from collections import defaultdict
from pathlib import Path
try:
    from scripts.hack_movimentos_gerais import compilar_movimentos_gerais, indexar_movimentos_gerais
except ModuleNotFoundError:
    from hack_movimentos_gerais import compilar_movimentos_gerais, indexar_movimentos_gerais

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "dist" / "carcaca"

def load(path):
    return json.loads((ROOT / path).read_text(encoding="utf-8"))

def collect(folder):
    result = []
    for path in sorted((ROOT / folder).glob("*.json")):
        data = load(path.relative_to(ROOT))
        if isinstance(data, list):
            result.extend(data)
        else:
            result.append(data)
    return sorted(result, key=lambda item: item["id"])

def norm(value):
    return re.sub(r"\s+", " ", unicodedata.normalize("NFKD", str(value or ""))
                  .encode("ascii", "ignore").decode().lower()).strip()

def add(index, key, value):
    if key is not None and key != "":
        index[str(key)].add(value)


def build_regional_dossiers(regions, guides, places, settlements, creatures, fronts,
                            dynamics, flows, dependencies, material_balances,
                            pressures, support_profiles, infrastructure_profiles,
                            scenarios):
    """Indexação factual. Referências vazias NÃO significam ausência de habitantes."""
    dossiers=[]
    settlement_region={s["id"]:s["regiao_id"] for s in settlements}
    for guide in sorted(guides,key=lambda row:row["regiao_id"]):
        rid=guide["regiao_id"]
        local_settlements={sid for sid,region in settlement_region.items() if region==rid}
        creature_records=[c for c in creatures
                          if any(occ["regiao_id"]==rid for occ in c["ocorrencias"])]
        def ids(collection,pred):
            return sorted(x["id"] for x in collection if pred(x))
        local_flows=[{"id":f["id"],"estado_evidencia":f["status"]}
                     for f in flows if f.get("origem_assentamento_id") in local_settlements
                     or f.get("destino_assentamento_id") in local_settlements]
        relations=[]
        for d in dynamics:
            roles=[]
            if d["origem_regiao_id"]==rid:roles.append("origem")
            if d["destino_regiao_id"]==rid:roles.append("destino")
            if roles:
                relations.append({"id":d["id"],"tipo":d["tipo"],
                                  "papeis_regionais":roles,
                                  "escala":d["escala"],
                                  "estado_evidencia":d["estado_evidencia"],
                                  "evento_campanha_id":d["evento_campanha_id"]})
        relations=sorted(relations,key=lambda d:d["id"])
        creatures_index=sorted(
          [{"id":c["id"],"estado_curadoria":c["estado"]}
           for c in creature_records],key=lambda x:x["id"]
        )
        factions_related=sorted({
            f["id"] for c in creature_records for f in c.get("faccoes",[])
        })
        dossier={
          "id":guide["id"],"regiao_id":rid,
          "nome_regiao":next(r["nome"] for r in regions if r["id"]==rid),
          "estado":guide["estado"],"fonte_guia":guide["fonte"],
          "contexto":guide["contexto"],
          "fatos_documentados":guide["fatos_documentados"],
          "lacunas":guide["lacunas"],
          "perguntas":guide["perguntas"],
          "inventario":{
            "lugares":ids(places,lambda x:x["regiao_id"]==rid),
            "assentamentos":sorted(local_settlements),
            "criaturas":creatures_index,
            "frentes_propostas":ids(fronts,lambda x:rid in x["regioes"]),
            "povos_vinculados_a_assentamentos":sorted({
              h["povo_id"] for st in settlements if st["id"] in local_settlements
              for h in st["habitantes"]
            }),
            "faccoes_por_associacao_a_criaturas":factions_related,
            "fluxos":sorted(local_flows,key=lambda f:f["id"]),
            "dependencias_materiais":ids(
               dependencies,lambda x:x["assentamento_id"] in local_settlements),
            "balancos_nao_quantificados":ids(
               material_balances,lambda x:x["assentamento_id"] in local_settlements),
            "pressoes_ecologicas_hipoteticas":ids(
               pressures,lambda x:x["assentamento_id"] in local_settlements),
            "perfis_suporte":ids(
               support_profiles,lambda x:x["assentamento_id"] in local_settlements),
            "perfis_infraestrutura":ids(
               infrastructure_profiles,lambda x:x["assentamento_id"] in local_settlements),
            "cenarios_dw_nao_executados":ids(
               scenarios,lambda x:bool(set(x["assentamentos"]) & local_settlements)),
            "dinamicas_territoriais":relations
          },
          "politica_interpretacao":{
            "vazios_significam":"nenhum_registro_curado_no_escopo",
            "nao_significam":"ausencia_real_de_pessoas_ou_recursos",
            "fluxos":"preservar_estado_de_evidencia",
            "frentes":"pressagios_nao_acontecidos",
            "pressoes":"riscos_hipoteticos",
            "dinamicas":"papeis_regionais_nao_confirmam_alvos_individuais",
            "faccoes":"associacao_a_criaturas_nao_comprova_dominio_territorial",
            "mutacao_canonica":False,
            "efeitos_dw_automaticos":False
          }
        }
        dossiers.append(dossier)
    indexes={k:defaultdict(set) for k in ("by_regiao","by_dinamica",
             "by_lugar","by_assentamento","by_pergunta_tema","by_ausencia_assentamento_curado")}
    for dossier in dossiers:
        did=dossier["id"]
        add(indexes["by_regiao"],dossier["regiao_id"],did)
        inv=dossier["inventario"]
        for key,inventory in (("by_lugar",inv["lugares"]),
                              ("by_assentamento",inv["assentamentos"])):
            for identifier in inventory:add(indexes[key],identifier,did)
        for relation in inv["dinamicas_territoriais"]:
            add(indexes["by_dinamica"],relation["id"],did)
        for question in dossier["perguntas"]:
            add(indexes["by_pergunta_tema"],question["tema"],did)
        if not inv["assentamentos"]:
            add(indexes["by_ausencia_assentamento_curado"],"sim",did)
    indexes={key:{name:sorted(ids) for name,ids in sorted(index.items())}
             for key,index in indexes.items()}
    return dossiers,indexes


def build_research_backlog(regional_guides, priorities):
    """16 perguntas de origem + metadados opcionais de 8 prioridades; sem resolver questões."""
    priority_map={row["pergunta_id"]:row for row in priorities}
    rows=[]
    for guide in regional_guides:
        for question in guide["perguntas"]:
            qid=question["id"]
            priority=priority_map.get(qid)
            rows.append({
                "id":"pendencia:"+qid.split(":",1)[1],
                "pergunta_id":qid,
                "regiao_id":guide["regiao_id"],
                "dossie_id":guide["id"],
                "tema":question["tema"],
                "pergunta":question["pergunta"],
                "estado":"aguarda_nova_fonte" if priority else "aguarda_priorizacao",
                "ordem_editorial":priority["ordem_editorial"] if priority else None,
                "faixa_prioridade":priority["faixa_prioridade"] if priority else None,
                "depende_de_perguntas":list(priority["depende_de_perguntas"]) if priority else [],
                "evidencias_necessarias":list(priority["evidencias_necessarias"]) if priority else [],
                "justificativa_editorial":priority["justificativa_editorial"] if priority else None,
                "artefatos_potenciais":list(priority["artefatos_potenciais"]) if priority else [],
                "fonte_base":priority["fonte_base"] if priority else guide["fonte"],
                "resposta_confirmada":None,
                "evidencia_nova":None,
                "mutacao_canonica":False,
                "efeitos_dw_automaticos":False
            })
    rows.sort(key=lambda x:(x["ordem_editorial"] is None,
                             x["ordem_editorial"] if x["ordem_editorial"] is not None else 999,
                             x["id"]))
    indexes={key:defaultdict(set) for key in
             ("by_regiao","by_tema","by_estado","by_faixa_prioridade",
              "by_dependencia","by_artefato_potencial","by_dossie")}
    for row in rows:
        for key,value in (("by_regiao",row["regiao_id"]),("by_tema",row["tema"]),
                          ("by_estado",row["estado"]),("by_dossie",row["dossie_id"]),
                          ("by_faixa_prioridade",row["faixa_prioridade"])):
            add(indexes[key],value,row["id"])
        for qid in row["depende_de_perguntas"]:
            add(indexes["by_dependencia"],qid,row["id"])
        for artifact in row["artefatos_potenciais"]:
            add(indexes["by_artefato_potencial"],artifact,row["id"])
    indexes={key:{name:sorted(ids) for name,ids in sorted(group.items())}
             for key,group in indexes.items()}
    return rows,indexes


def build_lore_indexes(entries):
    """Fonte em revisão: referências páginas/tokens, sem impacto no atlas canônico."""
    groups={k:defaultdict(set) for k in ("by_tipo","by_pagina","by_token","by_estado")}
    for e in entries:
        for field,value in (("by_tipo",e["tipo"]),("by_estado",e["evidencia"])):
            add(groups[field],value,e["id"])
        for page in e["paginas"]:
            add(groups["by_pagina"],str(page),e["id"])
        searchable=" ".join([e["nome"],e["descricao"],*e["aliases"]])
        for token in set(re.findall(r"[a-z0-9]+",norm(searchable))):
            if len(token)>=3:add(groups["by_token"],token,e["id"])
    return {name:{key:sorted(values) for key,values in sorted(group.items())}
            for name,group in groups.items()}

def build():
    creatures = collect("curadoria/criaturas")
    regions = sorted(load("data/regioes_carcaca.json")["regioes"], key=lambda x:x["id"])
    territorial_labels=sorted(load("data/rotulos_territoriais_carcaca.json")["rotulos"],key=lambda x:x["id"])
    territorial_dynamics=sorted(load("data/dinamicas_territoriais_alem_sul.json")["dinamicas"],key=lambda x:x["id"])
    territorial_indexes={k:defaultdict(set) for k in (
        "by_origem_regiao","by_destino_regiao","by_rotulo_territorial","by_tipo",
        "by_dimensao_potencial","by_assentamento_alvo")}
    for d in territorial_dynamics:
        for key,v in (("by_origem_regiao",d["origem_regiao_id"]),
                      ("by_destino_regiao",d["destino_regiao_id"]),
                      ("by_tipo",d["tipo"]),
                      ("by_assentamento_alvo",d["assentamento_alvo_id"])):
            add(territorial_indexes[key],v,d["id"])
        for tag in d["rotulos_territoriais"]:
            add(territorial_indexes["by_rotulo_territorial"],tag,d["id"])
        for dim in d["dimensoes_possivelmente_afetadas"]:
            add(territorial_indexes["by_dimensao_potencial"],dim,d["id"])
    territorial_indexes={
        name:{key:sorted(ids) for key,ids in sorted(group.items())}
        for name,group in territorial_indexes.items()
    }
    places = sorted(load("data/lugares_carcaca.json")["lugares"], key=lambda x:x["id"])
    factions = sorted(load("data/faccoes_carcaca.json")["faccoes"], key=lambda x:x["id"])
    types = sorted(load("data/taxonomia_carcaca.json")["tipos"], key=lambda x:x["id"])
    fronts = collect("curadoria/frentes")
    settlements = collect("curadoria/assentamentos")
    settlement_labels = sorted(load("data/rotulos_assentamentos_carcaca.json")["rotulos"],key=lambda r:r["id"])
    peoples = sorted(load("data/povos_carcaca.json")["povos"],key=lambda r:r["id"])
    flows = sorted(load("data/fluxos_costa_sul.json")["fluxos"],key=lambda r:r["id"])
    scenarios = []
    for path in sorted((ROOT / "cenarios/assentamentos").glob("*.json")):
        pack=load(path.relative_to(ROOT))
        scenarios.extend(pack["cenarios"])
    scenarios=sorted(scenarios,key=lambda r:r["id"])
    regional_guides=load("data/guias_dossies_regionais.json")["guias"]
    lore_source=load("fontes/autoria/hack-carcaca-dw-capitulo-i.paginas.json")
    lore_entries=sorted(load("data/lore/hack-carcaca-dw-indice-tematico.json")["entradas"],key=lambda x:x["id"])
    lore_timeline=load("data/lore/hack-carcaca-dw-cronologia.json")
    lore_reviews=load("data/lore/hack-carcaca-dw-pontos-de-revisao.json")
    lore_crosswalk=sorted(load("data/lore/hack-carcaca-dw-pontes-atlas.json")["pontes"],key=lambda x:x["id"])
    lore_crosswalk_index={k:defaultdict(set) for k in ("by_regiao","by_pergunta","by_entrada","by_parecer")}
    for link in lore_crosswalk:
        for kind,value in (("by_regiao",link["regiao_atlas_id"]),
                           ("by_pergunta",link["pergunta_curadoria_id"]),
                           ("by_entrada",link["entrada_lore_id"]),
                           ("by_parecer",link["parecer"])):
            add(lore_crosswalk_index[kind],value,link["id"])
    lore_crosswalk_index={
        name:{value:sorted(ids) for value,ids in sorted(group.items())}
        for name,group in lore_crosswalk_index.items()
    }
    lore_indexes=build_lore_indexes(lore_entries)
    mechanics_index=load("data/lore/hack-carcaca-dw-indice-mecanicas.json")
    lore_relations=sorted(load("data/lore/hack-carcaca-dw-relacoes.json")["relacoes"],key=lambda x:x["id"])
    selected_moves=sorted(load("data/lore/hack-carcaca-dw-movimentos-selecionados.json")["movimentos"],key=lambda x:x["paragrafo_docx"])
    complete_pilot_moves=sorted(
        load("data/lore/hack-carcaca-dw-movimentos-integrais-piloto.json")["movimentos"],
        key=lambda x:x["paragrafo_docx"])
    docx_tables=sorted(load("data/lore/hack-carcaca-dw-tabelas-docx.json")["tabelas"],
                       key=lambda x:x["tabela_docx_indice"])
    povos_docx=load("data/lore/hack-carcaca-dw-movimentos-povos-integrais.json")["movimentos"]
    classes_docx=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")
    movimentos_classes=classes_docx["movimentos"]
    guerreiro_docx=load("data/lore/hack-carcaca-dw-guerreiro-integrais.json")["movimentos"]
    barbaro_docx=load("data/lore/hack-carcaca-dw-barbaro-integrais.json")["movimentos"]
    cacador_docx=load("data/lore/hack-carcaca-dw-cacador-integrais.json")["movimentos"]
    ladino_docx=load("data/lore/hack-carcaca-dw-ladino-integrais.json")["movimentos"]
    bardo_docx=load("data/lore/hack-carcaca-dw-bardo-integrais.json")["movimentos"]
    artista_marcial_docx=load("data/lore/hack-carcaca-dw-artista-marcial-integrais.json")["movimentos"]
    paladino_docx=json.loads(gzip.decompress((ROOT/"data/lore/hack-carcaca-dw-paladino-integrais.json.gz").read_bytes()).decode("utf-8"))["movimentos"]
    clerigo_docx=json.loads(gzip.decompress((ROOT/"data/lore/hack-carcaca-dw-clerigo-integrais.json.gz").read_bytes()).decode("utf-8"))["movimentos"]
    druida_docx=load("data/lore/hack-carcaca-dw-druida-integrais.json")["movimentos"]
    mago_docx=json.loads(gzip.decompress((ROOT/"data/lore/hack-carcaca-dw-mago-integrais.json.gz").read_bytes()).decode("utf-8"))["movimentos"]
    feiticeiro_docx=json.loads(gzip.decompress((ROOT/"data/lore/hack-carcaca-dw-feiticeiro-integrais.json.gz").read_bytes()).decode("utf-8"))["movimentos"]
    dependencias_classes=classes_docx["dependencias_exatas_candidatas"]
    dependencias_pendentes=classes_docx["dependencias_nao_resolvidas"]
    try:
        from scripts.hack_movimentos_personagem import build_people_indexes,build_class_indexes,build_warrior_indexes,build_barbarian_indexes,build_hunter_indexes,build_rogue_indexes,build_bard_indexes,build_martial_artist_indexes,build_paladin_indexes,build_cleric_indexes,build_druid_indexes,build_mage_indexes,build_sorcerer_indexes
    except ModuleNotFoundError:
        from hack_movimentos_personagem import build_people_indexes,build_class_indexes,build_warrior_indexes,build_barbarian_indexes,build_hunter_indexes,build_rogue_indexes,build_bard_indexes,build_martial_artist_indexes,build_paladin_indexes,build_cleric_indexes,build_druid_indexes,build_mage_indexes,build_sorcerer_indexes
    regras_nucleo=load("data/lore/hack-carcaca-dw-regras-nucleo.json")
    quadros_integrais=load("data/lore/hack-carcaca-dw-quadros-integrais.json")
    movimentos_gerais=compilar_movimentos_gerais(quadros_integrais,docx_tables)
    indices_movimentos_gerais=indexar_movimentos_gerais(movimentos_gerais)
    quadro_por_tabela={m["tabela_docx_indice"]:m["quadro_id"] for m in movimentos_gerais}
    docx_tables=[{**t,**({"quadro_integral_id":quadro_por_tabela[t["tabela_docx_indice"]],
                         "texto_integral_extraido":True}
                        if t["tabela_docx_indice"] in quadro_por_tabela else {})}
                 for t in docx_tables]
    reviewed_paragraphs={x["paragrafo_docx"]:x["id"] for x in selected_moves}
    complete_pilot_moves=[
        {**x,"revisao_preliminar_id":reviewed_paragraphs.get(x["paragrafo_docx"])}
        for x in complete_pilot_moves]
    piloto_por_paragrafo={x["paragrafo_docx"]:x["id"] for x in complete_pilot_moves}
    povos_docx=[{**x,"piloto_integral_id":piloto_por_paragrafo.get(x["paragrafo_docx"]),
                 "revisao_preliminar_id":reviewed_paragraphs.get(x["paragrafo_docx"])}
                for x in povos_docx]
    guerreiro_por_id={m["id"]:m for m in guerreiro_docx}
    barbaro_por_id={m["id"]:m for m in barbaro_docx}
    cacador_por_id={m["id"]:m for m in cacador_docx}
    ladino_por_id={m["id"]:m for m in ladino_docx}
    bardo_por_id={m["id"]:m for m in bardo_docx}
    artista_marcial_por_id={m["id"]:m for m in artista_marcial_docx}
    paladino_por_id={m["id"]:m for m in paladino_docx}
    clerigo_por_id={m["id"]:m for m in clerigo_docx}
    druida_por_id={m["id"]:m for m in druida_docx}
    mago_por_id={m["id"]:m for m in mago_docx}
    feiticeiro_por_id={m["id"]:m for m in feiticeiro_docx}
    integral_por_id={**guerreiro_por_id,**barbaro_por_id,**cacador_por_id,**ladino_por_id,**bardo_por_id,**artista_marcial_por_id,**paladino_por_id,**clerigo_por_id,**druida_por_id,**mago_por_id,**feiticeiro_por_id}
    classes_docx_piloto=[{**x,"revisao_preliminar_id":reviewed_paragraphs.get(x["paragrafo_docx"]),
                         "texto_integral_id":x["id"] if x["id"] in integral_por_id else None,
                         "texto_integral_disponivel":x["id"] in integral_por_id}
                        for x in movimentos_classes]
    indice_guerreiro_docx=build_warrior_indexes(guerreiro_docx)
    indice_barbaro_docx=build_barbarian_indexes(barbaro_docx)
    indice_cacador_docx=build_hunter_indexes(cacador_docx)
    indice_ladino_docx=build_rogue_indexes(ladino_docx)
    indice_bardo_docx=build_bard_indexes(bardo_docx)
    indice_artista_marcial_docx=build_martial_artist_indexes(artista_marcial_docx)
    indice_paladino_docx=build_paladin_indexes(paladino_docx)
    indice_clerigo_docx=build_cleric_indexes(clerigo_docx)
    indice_druida_docx=build_druid_indexes(druida_docx)
    indice_mago_docx=build_mage_indexes(mago_docx)
    indice_feiticeiro_docx=build_sorcerer_indexes(feiticeiro_docx)
    indice_povos_docx=build_people_indexes(povos_docx)
    indice_classes_docx=build_class_indexes(classes_docx_piloto,dependencias_classes,dependencias_pendentes)
    complete_move_indexes={k:defaultdict(set) for k in ("by_grupo","by_marcador","by_preliminar")}
    for item in complete_pilot_moves:
        for k,key in (("by_grupo",item["grupo"]),("by_marcador",item["marcador_original"]),
                      ("by_preliminar",item["revisao_preliminar_id"])):
            add(complete_move_indexes[k],key,item["id"])
    complete_move_indexes={
        k:{key:sorted(ids) for key,ids in sorted(v.items())}
        for k,v in complete_move_indexes.items()}
    docx_table_indexes={k:defaultdict(set) for k in ("by_tipo",)}
    for item in docx_tables:
        add(docx_table_indexes["by_tipo"],item["tipo"],item["id"])
    docx_table_indexes={
        k:{key:sorted(ids) for key,ids in sorted(v.items())}
        for k,v in docx_table_indexes.items()}
    lore_relation_index={k:defaultdict(set) for k in ("by_entidade","by_tipo","by_pagina")}
    for relation in lore_relations:
        for k,key in (("by_entidade",relation["origem_id"]),
                      ("by_entidade",relation["destino_id"]),
                      ("by_tipo",relation["tipo"]),
                      ("by_pagina",relation["pagina"])):
            add(lore_relation_index[k],key,relation["id"])
    lore_relation_index={k:{key:sorted(ids) for key,ids in sorted(v.items())}
                         for k,v in lore_relation_index.items()}
    moves_index={k:defaultdict(set) for k in ("by_grupo","by_categoria","by_requisito","by_pagina_candidata")}
    for item in selected_moves:
        for k,key in (("by_grupo",item["grupo"]),("by_categoria",item["categoria"]),
                      ("by_requisito",item["requisito_literal"])):
            add(moves_index[k],key,item["id"])
        for page in item["paginas_candidatas"]:
            add(moves_index["by_pagina_candidata"],page,item["id"])
    moves_index={k:{key:sorted(ids) for key,ids in sorted(v.items())}
                 for k,v in moves_index.items()}
    research_priorities=load("data/prioridades_curadoria_m3.json")["prioridades"]
    dependencies=sorted(load("data/dependencias_materiais_costa_sul.json")["dependencias"],key=lambda r:r["id"])
    material_balances=sorted(load("data/balancos_materiais_costa_sul.json")["balancos"],key=lambda r:r["id"])
    ecological_pressures=sorted(load("data/pressoes_ecologicas_costa_sul.json")["pressoes"],key=lambda r:r["id"])
    support_profiles=sorted(load("data/capacidade_suporte_costa_sul.json")["perfis"],key=lambda r:r["id"])
    infrastructure_profiles=sorted(load("data/infraestrutura_assentamentos_costa_sul.json")["perfis"],key=lambda r:r["id"])
    infrastructure_indexes={k:defaultdict(set) for k in
                            ("by_assentamento","by_natureza","by_setor_documentado","by_setor_sem_dados","by_dependencia")}
    for infrastructure in infrastructure_profiles:
        item_id=infrastructure["id"]
        add(infrastructure_indexes["by_assentamento"],infrastructure["assentamento_id"],item_id)
        add(infrastructure_indexes["by_natureza"],infrastructure["natureza"],item_id)
        for sector in infrastructure["setores"]:
            field="by_setor_documentado" if sector["estado"]=="evidencia_parcial" else "by_setor_sem_dados"
            add(infrastructure_indexes[field],sector["id"],item_id)
            for did in sector["dependencias_relacionadas"]:
                add(infrastructure_indexes["by_dependencia"],did,item_id)
    infrastructure_indexes={
        name:{key:sorted(ids) for key,ids in sorted(group.items())}
        for name,group in infrastructure_indexes.items()
    }
    support_index={k:defaultdict(set) for k in ("by_assentamento","by_natureza","by_mobilidade_sazonal")}
    for p in support_profiles:
        sid=p["id"]
        for name,key in (("by_assentamento",p["assentamento_id"]),
                         ("by_natureza",p["natureza_territorial"]),
                         ("by_mobilidade_sazonal",p["demografia"]["mobilidade_sazonal"])):
            add(support_index[name],key,sid)
    support_index={name:{key:sorted(ids) for key,ids in sorted(group.items())}
                   for name,group in support_index.items()}
    balance_index={k:defaultdict(set) for k in ("by_assentamento","by_recurso","by_tipo","by_sazonalidade")}
    for b in material_balances:
        for key,value in (("by_assentamento",b["assentamento_id"]),
                          ("by_recurso",b["recurso_id"]),("by_tipo",b["tipo_recurso"]),
                          ("by_sazonalidade",b["sazonalidade"]["tipo"])):
            add(balance_index[key],value,b["id"])
    balance_index={name:{key:sorted(ids) for key,ids in sorted(group.items())}
                   for name,group in balance_index.items()}
    pressure_index={k:defaultdict(set) for k in ("by_assentamento","by_dependencia","by_tipo")}
    for p in ecological_pressures:
        add(pressure_index["by_assentamento"],p["assentamento_id"],p["id"])
        add(pressure_index["by_tipo"],p["tipo"],p["id"])
        for did in p["dependencias_ids"]:
            add(pressure_index["by_dependencia"],did,p["id"])
    pressure_index={name:{key:sorted(ids) for key,ids in sorted(group.items())}
                    for name,group in pressure_index.items()}
    dependency_indexes={k:defaultdict(set) for k in
                        ("by_assentamento","by_fluxo","by_tipo","by_dependencia_predecessora")}
    for dep in dependencies:
        did=dep["id"]
        for key,val in (("by_assentamento",dep["assentamento_id"]),
                        ("by_fluxo",dep["fluxo_id"]),("by_tipo",dep["tipo"]),
                        ("by_dependencia_predecessora",dep["depende_de_id"])):
            add(dependency_indexes[key],val,did)
    dependency_indexes={
        name:{key:sorted(ids) for key,ids in sorted(group.items())}
        for name,group in dependency_indexes.items()
    }
    settlement_indexes = {k:defaultdict(set) for k in
                          ("by_regiao","by_lugar","by_natureza","by_rotulo_carcaca","by_povo")}
    for st in settlements:
        sid=st["id"]
        for idx,val in (("by_regiao",st["regiao_id"]),("by_lugar",st["lugar_id"]),
                        ("by_natureza",st["natureza"])):
            add(settlement_indexes[idx],val,sid)
        for tag in st.get("rotulos_carcaca",[]):
            add(settlement_indexes["by_rotulo_carcaca"],tag["id"],sid)
        for inhabitant in st.get("habitantes",[]):
            add(settlement_indexes["by_povo"],inhabitant["povo_id"],sid)
    settlement_indexes = {
        name:{key:sorted(ids) for key,ids in sorted(group.items())}
        for name,group in settlement_indexes.items()
    }
    indexed = {k: defaultdict(set) for k in ("by_tipo_carcaca", "by_tipo_dnd",
               "by_regiao", "by_lugar", "by_faccao", "by_estado", "by_nome")}
    catalog = []
    for c in creatures:
        cid = c["id"]
        ref = c["tipo_dnd_referencia"]
        region_ids = sorted({o["regiao_id"] for o in c["ocorrencias"]})
        place_ids = sorted({o["lugar_id"] for o in c["ocorrencias"] if o.get("lugar_id")})
        faction_ids = sorted({f["id"] for f in c.get("faccoes", [])})
        row = {"id":cid, "nome":c["nome"], "nome_normalizado":norm(c["nome"]),
               "categoria":c["categoria"], "estado":c["estado"],
               "tipo_carcaca":c["tipo_carcaca"],
               "tipo_dnd":ref.get("equivalente_padrao") or ref.get("tipo") or ref.get("original"),
               "tipo_dnd_original":ref["original"], "regioes":region_ids,
               "lugares":place_ids, "faccoes":faction_ids,
               "instinto_dw":c["dungeon_world"]["instinto"],
               "nd_dnd":c.get("dnd5e", {}).get("nd"),
               "fontes":c["proveniencia"]["fontes"]}
        catalog.append(row)
        for key, v in [("by_tipo_carcaca",row["tipo_carcaca"]),
                       ("by_tipo_dnd",row["tipo_dnd"]),("by_estado",row["estado"]),
                       ("by_nome",row["nome_normalizado"])]:
            add(indexed[key],v,cid)
        for key, values in [("by_regiao",region_ids),("by_lugar",place_ids),
                            ("by_faccao",faction_ids)]:
            for v in values:
                add(indexed[key],v,cid)
    indexes = {name:{key:sorted(ids) for key,ids in sorted(group.items())}
               for name, group in indexed.items()}
    regional_dossiers,regional_dossier_indexes=build_regional_dossiers(
        regions, regional_guides, places, settlements, creatures, fronts,
        territorial_dynamics, flows, dependencies, material_balances,
        ecological_pressures, support_profiles, infrastructure_profiles, scenarios)
    research_backlog,research_backlog_indexes=build_research_backlog(
        regional_guides,research_priorities)
    files = {
        "creatures":"creatures.json", "catalog":"catalog.json", "indexes":"indexes.json",
        "regions":"regions.json", "places":"places.json", "factions":"factions.json",
        "regional_dossiers":"regional-dossiers.json",
        "regional_dossier_indexes":"regional-dossier-indexes.json",
        "lore_index":"lore-index.json",
        "hack_mechanics_index":"hack-mechanics-index.json",
        "lore_relations":"lore-relations.json",
        "lore_relation_indexes":"lore-relation-indexes.json",
        "hack_selected_movements":"hack-selected-movements.json",
        "hack_selected_movement_indexes":"hack-selected-movement-indexes.json",
        "hack_complete_pilot_movements":"hack-complete-pilot-movements.json",
        "hack_complete_pilot_movement_indexes":"hack-complete-pilot-movement-indexes.json",
        "hack_docx_tables":"hack-docx-tables.json",
        "hack_docx_table_indexes":"hack-docx-table-indexes.json",
        "hack_general_movements":"hack-general-movements.json",
        "hack_general_movement_indexes":"hack-general-movement-indexes.json",
        "hack_core_rules":"hack-core-rules.json",
        "hack_people_movements":"hack-people-movements.json",
        "hack_people_movement_indexes":"hack-people-movement-indexes.json",
        "hack_class_movement_inventory":"hack-class-movement-inventory.json",
        "hack_class_movement_indexes":"hack-class-movement-indexes.json",
        "hack_class_requirement_candidates":"hack-class-requirement-candidates.json",
        "hack_class_requirement_pending":"hack-class-requirement-pending.json",
        "hack_warrior_movements":"hack-warrior-movements.json",
        "hack_warrior_movement_indexes":"hack-warrior-movement-indexes.json",
        "hack_barbarian_movements":"hack-barbarian-movements.json",
        "hack_barbarian_movement_indexes":"hack-barbarian-movement-indexes.json",
        "hack_hunter_movements":"hack-hunter-movements.json",
        "hack_hunter_movement_indexes":"hack-hunter-movement-indexes.json",
        "hack_rogue_movements":"hack-rogue-movements.json",
        "hack_rogue_movement_indexes":"hack-rogue-movement-indexes.json",
        "hack_bard_movements":"hack-bard-movements.json",
        "hack_bard_movement_indexes":"hack-bard-movement-indexes.json",
        "hack_martial_artist_movements":"hack-martial-artist-movements.json",
        "hack_martial_artist_movement_indexes":"hack-martial-artist-movement-indexes.json",
        "hack_paladin_movements":"hack-paladin-movements.json",
        "hack_paladin_movement_indexes":"hack-paladin-movement-indexes.json",
        "hack_cleric_movements":"hack-cleric-movements.json",
        "hack_cleric_movement_indexes":"hack-cleric-movement-indexes.json",
        "hack_druid_movements":"hack-druid-movements.json",
        "hack_druid_movement_indexes":"hack-druid-movement-indexes.json",
        "hack_mage_movements":"hack-mage-movements.json",
        "hack_mage_movement_indexes":"hack-mage-movement-indexes.json",
        "hack_sorcerer_movements":"hack-sorcerer-movements.json",
        "hack_sorcerer_movement_indexes":"hack-sorcerer-movement-indexes.json",
        "lore_index_indexes":"lore-indexes.json",
        "lore_chronology":"lore-chronology.json",
        "lore_review_notes":"lore-review-notes.json",
        "lore_atlas_links":"lore-atlas-links.json",
        "lore_atlas_link_indexes":"lore-atlas-link-indexes.json",
        "research_backlog":"research-backlog.json",
        "research_backlog_indexes":"research-backlog-indexes.json",
        "types":"types.json", "fronts":"fronts.json", "settlements":"settlements.json",
        "settlement_labels":"settlement-labels.json",
        "settlement_indexes":"settlement-indexes.json",
        "peoples":"peoples.json", "flows":"flows.json",
        "settlement_scenarios":"settlement-scenarios.json",
        "material_dependencies":"material-dependencies.json",
        "material_dependency_indexes":"material-dependency-indexes.json",
        "material_balances":"material-balances.json",
        "material_balance_indexes":"material-balance-indexes.json",
        "ecological_pressures":"ecological-pressures.json",
        "ecological_pressure_indexes":"ecological-pressure-indexes.json",
        "support_profiles":"support-profiles.json",
        "support_indexes":"support-indexes.json",
        "territorial_labels":"territorial-labels.json",
        "territorial_dynamics":"territorial-dynamics.json",
        "territorial_indexes":"territorial-indexes.json",
        "infrastructure_profiles":"infrastructure-profiles.json",
        "infrastructure_indexes":"infrastructure-indexes.json"
    }
    manifest = {
        "schema_version":"0.1.0", "descricao":"Atlas autoral de criaturas; independente do acervo de fichas D&D em dist/creatures.",
        "total_criaturas":len(creatures), "total_regioes":len(regions),
        "total_dossies_regionais":len(regional_dossiers),
        "total_entradas_lore_manuscrito":len(lore_entries),
        "total_paginas_mecanicas_extraidas":mechanics_index["paginas_com_texto"],
        "total_relacoes_lore_manuscrito":len(lore_relations),
        "total_movimentos_titulos_verificados":len(selected_moves),
        "total_movimentos_com_requisito_literal":sum(m["requisito_literal"] is not None for m in selected_moves),
        "total_movimentos_integrais_piloto":len(complete_pilot_moves),
        "total_opcoes_movimentos_piloto":sum(len(x["opcoes"]) for x in complete_pilot_moves),
        "total_tabelas_docx_inventariadas":len(docx_tables),
        "total_quadros_movimentos_gerais":sum(x["tipo"]=="quadro_movimento_geral" for x in docx_tables),
        "total_unidades_regras_gerais_integrais":len(movimentos_gerais),
        "total_blocos_quadros_gerais":sum(len(q["blocos"]) for q in quadros_integrais["quadros"]),
        "total_movimentos_povos_docx":len(povos_docx),
        "total_grupos_povos_docx":len({x["grupo"] for x in povos_docx}),
        "total_opcoes_movimentos_povos_docx":sum(len(x["opcoes"]) for x in povos_docx),
        "total_titulos_movimentos_classes_docx":len(classes_docx_piloto),
        "total_movimentos_classes_com_requer":sum(x["requisito_literal"] is not None for x in classes_docx_piloto),
        "total_dependencias_candidatas":len(dependencias_classes),
        "total_dependencias_pendentes":len(dependencias_pendentes),
        "total_movimentos_guerreiro_integrais":len(guerreiro_docx),
        "total_opcoes_guerreiro":sum(len(m["opcoes"]) for m in guerreiro_docx),
        "total_requer_guerreiro":sum(bool(m["requisito_literal"]) for m in guerreiro_docx),
        "total_movimentos_barbaro_integrais":len(barbaro_docx),
        "total_opcoes_barbaro":sum(len(m["opcoes"]) for m in barbaro_docx),
        "total_requer_barbaro":sum(bool(m["requisito_literal"]) for m in barbaro_docx),
        "total_movimentos_cacador_integrais":len(cacador_docx),
        "total_opcoes_cacador":sum(len(m["opcoes"]) for m in cacador_docx),
        "total_requer_cacador":sum(bool(m["requisito_literal"]) for m in cacador_docx),
        "total_movimentos_paladino_integrais":len(paladino_docx),
        "total_opcoes_paladino":sum(len(m["opcoes"]) for m in paladino_docx),
        "total_requer_paladino":sum(bool(m["requisito_literal"]) for m in paladino_docx),
        "total_concessoes_livres_paladino":sum(len(m["concessoes_gratuitas_literais"]) for m in paladino_docx),
        "total_movimentos_clerigo_integrais":len(clerigo_docx),
        "total_opcoes_clerigo":sum(len(m["opcoes"]) for m in clerigo_docx),
        "total_requer_clerigo":sum(bool(m["requisito_literal"]) for m in clerigo_docx),
        "total_movimentos_druida_integrais":len(druida_docx),
        "total_opcoes_druida":sum(len(m["opcoes"]) for m in druida_docx),
        "total_requer_druida":sum(bool(m["requisito_literal"]) for m in druida_docx),
        "total_movimentos_mago_integrais":len(mago_docx),
        "total_opcoes_mago":sum(len(m["opcoes"]) for m in mago_docx),
        "total_requer_mago":sum(bool(m["requisito_literal"]) for m in mago_docx),
        "total_movimentos_feiticeiro_integrais":len(feiticeiro_docx),
        "total_opcoes_feiticeiro":sum(len(m["opcoes"]) for m in feiticeiro_docx),
        "total_requer_feiticeiro":sum(bool(m["requisito_literal"]) for m in feiticeiro_docx),
        "total_movimentos_ladino_integrais":len(ladino_docx),
        "total_opcoes_ladino":sum(len(m["opcoes"]) for m in ladino_docx),
        "total_requer_ladino":sum(bool(m["requisito_literal"]) for m in ladino_docx),
        "total_movimentos_bardo_integrais":len(bardo_docx),
        "total_opcoes_bardo":sum(len(m["opcoes"]) for m in bardo_docx),
        "total_requer_bardo":sum(bool(m["requisito_literal"]) for m in bardo_docx),
        "total_movimentos_artista_marcial_integrais":len(artista_marcial_docx),
        "total_opcoes_artista_marcial":sum(len(m["opcoes"]) for m in artista_marcial_docx),
        "total_requer_artista_marcial":sum(bool(m["requisito_literal"]) for m in artista_marcial_docx),
        "total_rotulos_mecanicas_detectados":sum(len(p["rotulos_detectados"]) for p in mechanics_index["paginas_indice"]),
        "total_paginas_lore_manuscrito":len(lore_source["paginas"]),
        "total_eventos_cronologia_manuscrito":len(lore_timeline["eventos"]),
        "total_incognitas_manuscrito":len(lore_timeline["questoes_abertas"]),
        "total_pontos_revisao_manuscrito":len(lore_reviews["revisoes"]),
        "total_pontes_lore_atlas":len(lore_crosswalk),
        "total_pendencias_curadoria":len(research_backlog),
        "total_pendencias_priorizadas":sum(x["ordem_editorial"] is not None
                                           for x in research_backlog),
        "total_perguntas_regionais":sum(len(x["perguntas"]) for x in regional_dossiers),
        "total_lugares":len(places), "total_faccoes":len(factions),
        "total_frentes":len(fronts), "total_assentamentos":len(settlements),
        "total_rotulos_assentamentos":len(settlement_labels), "total_povos":len(peoples),
        "total_fluxos":len(flows), "total_cenarios_assentamentos":len(scenarios),
        "total_dependencias_materiais":len(dependencies),
        "total_balancos_materiais":len(material_balances),
        "total_pressoes_ecologicas":len(ecological_pressures),
        "total_perfis_suporte":len(support_profiles),
        "total_rotulos_territoriais":len(territorial_labels),
        "total_dinamicas_territoriais":len(territorial_dynamics),
        "total_perfis_infraestrutura":len(infrastructure_profiles),
        "total_setores_infraestrutura":sum(len(x["setores"]) for x in infrastructure_profiles),
        "arquivos":files, "estado":"curadoria_em_andamento",
        "nota":"Registros podem ser propostas. Não substituir estatísticas nem cânone de nenhum jogo automaticamente."
    }
    return {
        "manifest.json":manifest,files["creatures"]:creatures,files["catalog"]:catalog,
        files["regional_dossiers"]:regional_dossiers,
        files["regional_dossier_indexes"]:regional_dossier_indexes,
        files["lore_index"]:lore_entries,
        files["hack_mechanics_index"]:mechanics_index,
        files["lore_relations"]:lore_relations,
        files["lore_relation_indexes"]:lore_relation_index,
        files["hack_selected_movements"]:selected_moves,
        files["hack_selected_movement_indexes"]:moves_index,
        files["hack_complete_pilot_movements"]:complete_pilot_moves,
        files["hack_complete_pilot_movement_indexes"]:complete_move_indexes,
        files["hack_docx_tables"]:docx_tables,
        files["hack_docx_table_indexes"]:docx_table_indexes,
         files["hack_general_movements"]:movimentos_gerais,
         files["hack_general_movement_indexes"]:indices_movimentos_gerais,
         files["hack_core_rules"]:regras_nucleo,
         files["hack_people_movements"]:povos_docx,
         files["hack_people_movement_indexes"]:indice_povos_docx,
         files["hack_class_movement_inventory"]:classes_docx_piloto,
         files["hack_class_movement_indexes"]:indice_classes_docx,
         files["hack_class_requirement_candidates"]:dependencias_classes,
         files["hack_class_requirement_pending"]:dependencias_pendentes,
         files["hack_warrior_movements"]:guerreiro_docx,
         files["hack_warrior_movement_indexes"]:indice_guerreiro_docx,
          files["hack_barbarian_movements"]:barbaro_docx,
          files["hack_barbarian_movement_indexes"]:indice_barbaro_docx,
           files["hack_hunter_movements"]:cacador_docx,
           files["hack_hunter_movement_indexes"]:indice_cacador_docx,
           files["hack_rogue_movements"]:ladino_docx,
           files["hack_rogue_movement_indexes"]:indice_ladino_docx,
           files["hack_bard_movements"]:bardo_docx,
           files["hack_bard_movement_indexes"]:indice_bardo_docx,
           files["hack_martial_artist_movements"]:artista_marcial_docx,
           files["hack_martial_artist_movement_indexes"]:indice_artista_marcial_docx,
           files["hack_paladin_movements"]:paladino_docx,
           files["hack_paladin_movement_indexes"]:indice_paladino_docx,
           files["hack_cleric_movements"]:clerigo_docx,
           files["hack_cleric_movement_indexes"]:indice_clerigo_docx,
           files["hack_druid_movements"]:druida_docx,
           files["hack_druid_movement_indexes"]:indice_druida_docx,
           files["hack_mage_movements"]:mago_docx,
           files["hack_mage_movement_indexes"]:indice_mago_docx,
           files["hack_sorcerer_movements"]:feiticeiro_docx,
           files["hack_sorcerer_movement_indexes"]:indice_feiticeiro_docx,
        files["lore_index_indexes"]:lore_indexes,
        files["lore_chronology"]:lore_timeline,
        files["lore_review_notes"]:lore_reviews,
        files["lore_atlas_links"]:lore_crosswalk,
        files["lore_atlas_link_indexes"]:lore_crosswalk_index,
        files["research_backlog"]:research_backlog,
        files["research_backlog_indexes"]:research_backlog_indexes,
        files["indexes"]:indexes,files["regions"]:regions,files["places"]:places,
        files["factions"]:factions,files["types"]:types,files["fronts"]:fronts,
        files["settlements"]:settlements,
        files["settlement_labels"]:settlement_labels,
        files["settlement_indexes"]:settlement_indexes,
        files["peoples"]:peoples,files["flows"]:flows,
        files["settlement_scenarios"]:scenarios,
        files["material_dependencies"]:dependencies,
        files["material_dependency_indexes"]:dependency_indexes,
        files["material_balances"]:material_balances,
        files["material_balance_indexes"]:balance_index,
        files["ecological_pressures"]:ecological_pressures,
        files["ecological_pressure_indexes"]:pressure_index,
        files["support_profiles"]:support_profiles,
        files["support_indexes"]:support_index,
        files["territorial_labels"]:territorial_labels,
        files["territorial_dynamics"]:territorial_dynamics,
        files["territorial_indexes"]:territorial_indexes,
        files["infrastructure_profiles"]:infrastructure_profiles,
        files["infrastructure_indexes"]:infrastructure_indexes
    }

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true",
                        help="Somente comparar os artefatos publicados aos dados curados.")
    args = parser.parse_args()
    output = build()
    stale = []
    if not args.check:
        OUT.mkdir(parents=True, exist_ok=True)
    for filename, content in output.items():
        expected = json.dumps(content, indent=2, ensure_ascii=False) + "\n"
        path = OUT / filename
        if args.check:
            if not path.exists() or path.read_text(encoding="utf-8") != expected:
                stale.append(filename)
        else:
            path.write_text(expected, encoding="utf-8")
    if stale:
        raise SystemExit("Índices desatualizados/ausentes: " + ", ".join(stale))
    print("Índices Carcaça", "verificados" if args.check else "gerados",
          f"({len(output['creatures.json'])} criaturas, {len(output)} JSON).")

if __name__ == "__main__":
    main()
