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
    povoamento_proposto=load("data/propostas/povoamento-regional-hack-carcaca.json")
    caatinga_rede_social=load("data/propostas/caatinga-rede-social-hack.json")
    fronteira=load("data/propostas/fronteira-caatinga-costa-sul-hack.json")
    costa_sul=load("data/propostas/portomonte-ilhas-costa-sul-hack.json")
    mar_sangue=load("data/propostas/mar-sangue-ecologia-politica-hack.json")
    diplomacia_mar=load("data/propostas/mar-sangue-diplomacia-hack.json")
    economia_mar=load("data/propostas/mar-sangue-economia-hack.json")
    costa_mar=load("data/propostas/costa-sul-pressao-mar-sangue-hack.json")
    rio_garganta=load("data/propostas/garganta-rio-ancestral-social-hack.json")
    thargrid=load("data/propostas/thargrid-resistencia-cotidiano-hack.json")
    floresta=load("data/propostas/ironwood-eldroth-resistencia-hack.json")
    atlas_cultural_xiv=load("data/worldbuilding/eldroth-ironwood-vandar-ciclo14.json")
    preconquista_xv=load("data/worldbuilding/eldroth-preconquista-ciclo15.json")
    ocupacao_xvi=load("data/worldbuilding/eldroth-ocupacao-sylara-ciclo16.json")
    vandar_xvii=load("data/worldbuilding/vandar-politica-dos-mortos-ciclo17.json")
    ironwood_xviii=load("data/worldbuilding/ironwood-sociedade-resistencia-ciclo18.json")
    revisao_xix=load("data/worldbuilding/revisao-autoral-atlas-ciclo19.json")
    grama_xx=load("data/worldbuilding/grama-cortada-cotidiano-ciclo20.json")
    gnomos_xxi=load("data/worldbuilding/culturas-gnomicas-ciclo21.json")
    categorias_xxi=("tradicoes","eixos_sociais","eticas_do_conhecimento",
                    "redes_de_troca","conflitos_internos","costumes_possiveis","vinhetas")
    registros_xxi=[{**entry,"categoria_indice":cat}
        for cat in categorias_xxi for entry in gnomos_xxi[cat]]
    if len(registros_xxi)!=39:
        raise ValueError("Ciclo XXI: 39 propostas, sem contar fatos e perguntas.")
    def indexar_gnomos(extract):
        groups=defaultdict(set)
        for entry in registros_xxi:
            vals=extract(entry)
            for key in (vals if isinstance(vals,list) else [vals]):
                if key is not None and key!="":
                    groups[str(key)].add(entry["id"])
        return {key:sorted(values) for key,values in sorted(groups.items())}
    indices_gnomos_xxi={
        "by_categoria":indexar_gnomos(lambda x:x["categoria_indice"]),
        "by_tradicao":indexar_gnomos(lambda x:
            x.get("tradicao_id") or x.get("tradicoes_relacionadas",[])),
        "by_estado":indexar_gnomos(lambda x:x["estado"]),
        "by_pagina_manuscrito":indexar_gnomos(lambda x:
            [str(p) for p in (x.get("fonte_paginas") or [])]),
        "by_tema":indexar_gnomos(lambda x:x.get("nome_editorial") or x.get("nome")),
        "by_slug":indexar_gnomos(lambda x:x["id"].rsplit(":",1)[-1])
    }
    categorias_xx=("dominios_da_vida","circuitos_economicos","formas_de_convivencia",
                  "conflitos_internos","celebracoes_possiveis","generos_da_memoria","vinhetas")
    registros_xx=[{**entry,"categoria_indice":cat}
        for cat in categorias_xx for entry in grama_xx[cat]]
    if len(registros_xx)!=35:
        raise ValueError("Ciclo XX: esperado 35 propostas culturais.")
    def indexar_grama(extract):
        mapping=defaultdict(set)
        for entry in registros_xx:
            vals=extract(entry)
            for key in (vals if isinstance(vals,list) else [vals]):
                if key is not None and key!="":
                    mapping[str(key)].add(entry["id"])
        return {key:sorted(mapping[key]) for key in sorted(mapping)}
    indices_grama_xx={
        "by_categoria":indexar_grama(lambda x:x["categoria_indice"]),
        "by_pagina_manuscrito":indexar_grama(
           lambda x:[str(p) for p in x["fonte_contexto_paginas"]]),
        "by_estado":indexar_grama(lambda x:x["estado"]),
        "by_inicial_nome":indexar_grama(lambda x:x["nome_editorial"][0].upper()),
        "by_slug":indexar_grama(lambda x:x["id"].rsplit(":",1)[-1])
    }
    review_entries=[{**e,"categoria_indice":cat}
        for cat in ("dossies","candidatos","decisoes","guardas")
        for e in revisao_xix[cat]]
    if len(review_entries)!=138:
        raise ValueError("Ciclo XIX precisa de 5 dossiês, 103 candidatos, 20 decisões e 10 guardas.")
    def indexar_revisao(extract):
        groups=defaultdict(set)
        for entry in review_entries:
            raw=extract(entry)
            for x in (raw if isinstance(raw,list) else [raw]):
                if x is not None and x!="":
                    groups[str(x)].add(entry["id"])
        return {key:sorted(values) for key,values in sorted(groups.items())}
    indices_revisao_xix={
        "by_categoria":indexar_revisao(lambda x:x["categoria_indice"]),
        "by_ciclo":indexar_revisao(lambda x:x.get("ciclo")),
        "by_classe":indexar_revisao(lambda x:x.get("tipo")),
        "by_dominio":indexar_revisao(lambda x:x.get("dominio")),
        "by_prioridade":indexar_revisao(lambda x:x.get("prioridade")),
        "by_estado":indexar_revisao(lambda x:x.get("estado",x.get("status"))),
        "by_origem_id":indexar_revisao(lambda x:(
            [x["referencia"]["id"]] if x.get("referencia") else
            [r["id"] for r in x.get("origens",[])])),
        "by_pre_requisito":indexar_revisao(lambda x:x.get("pre_requisitos",[])),
        "by_arquivo_fonte":indexar_revisao(lambda x:(
            x.get("arquivo") or (x["referencia"]["arquivo"] if x.get("referencia") else None)))
    }
    categorias_xviii=("eixos_sociais","modelos_de_governanca","relacoes_diplomaticas",
                     "circuitos_de_cuidado","dilemas","vinhetas")
    registros_xviii=[{**entry,"categoria_indice":cat}
        for cat in categorias_xviii for entry in ironwood_xviii[cat]]
    if len(registros_xviii)!=27:
        raise ValueError("Ciclo XVIII exige 27 registros exploratórios.")
    def indexar_ironwood(extract):
        groups=defaultdict(set)
        for entry in registros_xviii:
            vals=extract(entry)
            for val in (vals if isinstance(vals,list) else [vals]):
                if val is not None and val!="":
                    groups[str(val)].add(entry["id"])
        return {k:sorted(v) for k,v in sorted(groups.items())}
    indexes_ironwood_xviii={
        "by_categoria":indexar_ironwood(lambda x:x["categoria_indice"]),
        "by_tema":indexar_ironwood(lambda x:x.get("tema_social")),
        "by_eixo":indexar_ironwood(lambda x:x.get("eixo_id")),
        "by_modelo":indexar_ironwood(lambda x:x.get("modelo_id")),
        "by_pagina_manuscrito":indexar_ironwood(lambda x:[
            str(src["pagina"]) for src in (x.get("fontes_contextuais") or
                ([x["fonte_contextual"]] if x.get("fonte_contextual") else []))]),
        "by_estado":indexar_ironwood(lambda x:x.get("estado"))
    }
    categorias_xvii=("fases","tecidos_urbanos","modalidades_de_prova","situacoes_de_morte",
        "papeis_sociais","modelos_do_dominio","vinhetas")
    registros_xvii=[{**entry,"categoria_indice":cat}
        for cat in categorias_xvii for entry in vandar_xvii[cat]]
    if len(registros_xvii)!=33:
        raise ValueError("Ciclo XVII exige 33 registros de consulta de Vandar.")
    def indexar_vandar(extract):
        groups=defaultdict(set)
        for entry in registros_xvii:
            v=extract(entry)
            for x in (v if isinstance(v,list) else [v]):
                if x is not None and x!="":
                    groups[str(x)].add(entry["id"])
        return {k:sorted(v) for k,v in sorted(groups.items())}
    indexes_vandar_xvii={
        "by_categoria":indexar_vandar(lambda x:x["categoria_indice"]),
        "by_dominio":indexar_vandar(lambda x:x.get("dominio",x.get("campo_de_interesse"))),
        "by_modalidade":indexar_vandar(lambda x:x.get("modalidade")),
        "by_distincao_juridica":indexar_vandar(lambda x:x.get("distincao_juridica_proposta")),
        "by_tecido_urbano":indexar_vandar(lambda x:x.get("tecido_urbano_id")),
        "by_pagina_manuscrito":indexar_vandar(lambda x:[
            str(p["pagina"]) for p in ([x["fonte_contextual"]] if x.get("fonte_contextual")
              else ([x["evidencia"]] if x.get("evidencia") else
              ([x["evidencia_comum"]] if x.get("evidencia_comum") else [])))]),
        "by_estado":indexar_vandar(lambda x:x.get("estado"))
    }
    categorias_xvi=("mecanismos","posicoes_sociais","modelos_de_regime","dilemas","vinhetas")
    entidades_xvi=[{**entry,"categoria_indice":cat}
       for cat in categorias_xvi for entry in ocupacao_xvi[cat]]
    if len(entidades_xvi)!=25:
        raise ValueError("Ciclo XVI exige 25 entidades narrativas (8+6+3+4+4).")
    def indexar_xvi(extract):
        terms=defaultdict(set)
        for entry in entidades_xvi:
            values=extract(entry)
            for val in (values if isinstance(values,list) else [values]):
                if val is not None and val!="":
                    terms[str(val)].add(entry["id"])
        return {k:sorted(v) for k,v in sorted(terms.items())}
    indices_ocupacao_xvi={
        "by_categoria":indexar_xvi(lambda e:e["categoria_indice"]),
        "by_dominio":indexar_xvi(lambda e:e.get("dominio",e.get("campo_social",e.get("tema")))),
        "by_pratica_xv":indexar_xvi(lambda e:e.get("pratica_xv_id")),
        "by_mecanismo":indexar_xvi(lambda e:e.get("mecanismo_id")),
        "by_posicao":indexar_xvi(lambda e:e.get("posicao_id")),
        "by_pagina_manuscrito":indexar_xvi(lambda e:[
           str(p["pagina"]) for p in (e.get("fontes_contextuais") or
             ([e["fonte_contextual"]] if e.get("fonte_contextual") else []))]),
        "by_estado":indexar_xvi(lambda e:e.get("estado"))
    }
    categorias_xv=("fases","praticas","pactos","ciclos_materiais","vinhetas")
    entidades_xv=[{**item,"categoria_indice":categoria}
        for categoria in categorias_xv for item in preconquista_xv[categoria]]
    if len(entidades_xv)!=24:
        raise ValueError("Ciclo XV exige 24 registros de mundo (4+8+4+4+4).")
    def indexar_preconquista(extrair):
        idx=defaultdict(set)
        for item in entidades_xv:
            val=extrair(item)
            for key in (val if isinstance(val,list) else [val]):
                if key is not None and key!="":
                    idx[str(key)].add(item["id"])
        return {key:sorted(ids) for key,ids in sorted(idx.items())}
    indices_preconquista_xv={
        "by_categoria":indexar_preconquista(lambda x:x["categoria_indice"]),
        "by_fase":indexar_preconquista(lambda x:x.get("fase_de_inspiracao",x.get("chave"))),
        "by_pagina_manuscrito":indexar_preconquista(lambda x:[
            str(pg) for src in (x.get("fontes_ancora") or x.get("fonte_contextual") or [])
            for pg in ([src["pagina"]] if "pagina" in src else src.get("paginas",[]))]),
        "by_ambito_social":indexar_preconquista(lambda x:x.get("abrangencia_hipotetica")),
        "by_pratica_referida":indexar_preconquista(lambda x:x.get("praticas_associadas",[])),
        "by_eixo_xiv":indexar_preconquista(lambda x:x.get("eixos_xiv",[])),
        "by_tarefa_material":indexar_preconquista(lambda x:x.get("tarefas_hipoteticas",[])),
        "by_status":indexar_preconquista(lambda x:x.get("estado"))
    }
    eixos_xiv=atlas_cultural_xiv["eixos"]
    if len(eixos_xiv)!=14:
        raise ValueError("Worldbuilding XIV exige 14 eixos históricos-culturais.")
    def indexar_xiv(extrair):
        grupos=defaultdict(set)
        for eixo in eixos_xiv:
            for item in extrair(eixo):
                if item is not None and item!="":
                    grupos[str(item)].add(eixo["id"])
        return {k:sorted(v) for k,v in sorted(grupos.items())}
    indices_culturais_xiv={
        "by_area":indexar_xiv(lambda x:[x["area_id"]]),
        "by_efeito":indexar_xiv(lambda x:x["efeitos_na_ambientacao"]),
        "by_fonte_factual":indexar_xiv(lambda x:[y["fonte"] for y in x["fatos_textuais"]]),
        "by_fonte_manuscrito":indexar_xiv(lambda x:[y["fonte"] for y in x["camada_manuscrito"]]),
        "by_pagina_manuscrito":indexar_xiv(lambda x:[str(p) for y in x["camada_manuscrito"] for p in y["paginas"]])
    }
    ecologia_xii=load("data/propostas/eldroth-ecologia-monstruosa-dw.json")
    fichas_xiii=load("data/propostas/eldroth-fichas-dw-ciclo13.json")
    registros_xiii=fichas_xiii["fichas"]
    if len(registros_xiii)!=8:
        raise ValueError("Ciclo XIII requer oito fichas DW.")
    def indices_fichas(campo):
        grupos=defaultdict(set)
        for ficha in registros_xiii:
            valor=campo(ficha)
            for item in (valor if isinstance(valor,list) else [valor]):
                if item is not None and item!="":
                    grupos[str(item)].add(ficha["id"])
        return {k:sorted(v) for k,v in sorted(grupos.items())}
    indexes_fichas_xiii={
        "by_tipo_carcaca_proposto":indices_fichas(lambda f:f["tipo_carcaca_proposto"]),
        "by_organizacao":indices_fichas(lambda f:f["organizacao"]["proposta_dw"]),
        "by_modo":indices_fichas(lambda f:f["modo"]),
        "by_porte":indices_fichas(lambda f:f["decisoes"]["porte"]),
        "by_defesa":indices_fichas(lambda f:f["decisoes"]["defesa"]),
        "by_alcance":indices_fichas(lambda f:(f["ficha_dw"]["ataque"] or {}).get("alcances",[])),
        "by_tag_dw":indices_fichas(lambda f:f["ficha_dw"]["tags"]),
        "by_origem_xii":indices_fichas(lambda f:f["criatura_origem_id"]),
        "by_pv":indices_fichas(lambda f:f["ficha_dw"]["pv"])
    }
    cats_xii=("criaturas","encontros","pressoes","frentes")
    entidades_xii=[{**item,"categoria_indice":categoria}
                   for categoria in cats_xii for item in ecologia_xii[categoria]]
    if len(entidades_xii)!=20:
        raise ValueError("Ecologia Monstruosa XII deve conter 20 propostas.")
    def indice_ecologia_xii(extrair):
        grupos=defaultdict(set)
        for item in entidades_xii:
            valor=extrair(item)
            for chave in (valor if isinstance(valor,list) else [valor]):
                if chave is not None and chave!="":
                    grupos[str(chave)].add(item["id"])
        return {k:sorted(v) for k,v in sorted(grupos.items())}
    indices_xii={
        "by_categoria":indice_ecologia_xii(lambda r:r["categoria_indice"]),
        "by_tipo_carcaca_proposto":indice_ecologia_xii(lambda r:r.get("tipo_carcaca_proposto")),
        "by_escopo":indice_ecologia_xii(lambda r:r.get("escopo",r.get("localizacao_proposta",{}).get("escopo"))),
        "by_cena_anterior":indice_ecologia_xii(lambda r:r.get("cena_anterior_id",r.get("vinculo_cena_anterior"))),
        "by_criatura":indice_ecologia_xii(lambda r:r.get("criaturas_ids",[])),
        "by_encontro":indice_ecologia_xii(lambda r:r.get("encontros_ids",[])),
        "by_lugar_proposto":indice_ecologia_xii(lambda r:r.get("localizacao_proposta",{}).get("local_proposto_id")),
        "by_organizacao_dw":indice_ecologia_xii(lambda r:r.get("dungeon_world",{}).get("organizacao_tag_proposta"))
    }
    categorias_floresta=("lugares","coletivos","pessoas","dilemas","fluxos","acordos","cenas","arcos")
    linhas_floresta=[{**entidade,"categoria":categoria}
                     for categoria in categorias_floresta for entidade in floresta[categoria]]
    if len(linhas_floresta)!=40:
        raise ValueError("Povoamento XI exige 40 propostas.")
    def indice_floresta(campo):
        grupos=defaultdict(set)
        for entidade in linhas_floresta:
            valores=entidade.get(campo,[])
            for valor in (valores if isinstance(valores,list) else [valores]):
                if valor is not None and valor!="":
                    grupos[str(valor)].add(entidade["id"])
        return {k:sorted(v) for k,v in sorted(grupos.items())}
    indices_floresta={
        "by_categoria":indice_floresta("categoria"),
        "by_povo":indice_floresta("povo"),
        "by_ambiente":indice_floresta("ambiente"),
        "by_funcao":indice_floresta("funcao"),
        "by_setor":indice_floresta("setor"),
        "by_movimento_hack":indice_floresta("movimentos_inspiradores"),
        "by_semente_anterior":indice_floresta("vinculos"),
        "by_cena_local":indice_floresta("local_id"),
        "by_origem":indice_floresta("origem"),
        "by_destino":indice_floresta("destino"),
        "by_personagem_reutilizado":indice_floresta("reutiliza")
    }
    cats_thargrid=("lugares","coletivos","pessoas","dilemas","fluxos","acordos","cenas","arcos")
    rows_thargrid=[{**x,"categoria":cat} for cat in cats_thargrid for x in thargrid[cat]]
    def idx_thargrid(field):
        mapping=defaultdict(set)
        for item in rows_thargrid:
            val=item.get(field,[])
            for entry in (val if isinstance(val,list) else [val]):
                if entry is not None and entry!="":
                    mapping[str(entry)].add(item["id"])
        return {k:sorted(v) for k,v in sorted(mapping.items())}
    indexes_thargrid={
        "by_categoria":idx_thargrid("categoria"),
        "by_povo":idx_thargrid("povo"),
        "by_tradicao":idx_thargrid("tradicao"),
        "by_setor":idx_thargrid("setor"),
        "by_ambiente":idx_thargrid("ambiente"),
        "by_movimento_hack":idx_thargrid("movimentos_inspiradores"),
        "by_semente_anterior":idx_thargrid("vinculos"),
        "by_local_de_cena":idx_thargrid("local_id"),
        "by_origem":idx_thargrid("origem"),
        "by_destino":idx_thargrid("destino")
    }
    if len(rows_thargrid)!=46:
        raise ValueError("Thargrid precisa conter 46 elementos.")
    categorias_rio=("lugares","oficios","pessoas","circuitos","memorias","acordos","cenas","arcos")
    entidades_rio=[
        {**elemento,"categoria":categoria}
        for categoria in categorias_rio for elemento in rio_garganta[categoria]
    ]
    def indexar_rio(campo):
        mapping=defaultdict(set)
        for elemento in entidades_rio:
            v=elemento.get(campo,[])
            valores=v if isinstance(v,list) else [v]
            for value in valores:
                if value is not None and value!="":
                    mapping[str(value)].add(elemento["id"])
        return {k:sorted(v) for k,v in sorted(mapping.items())}
    indices_rio={
        "by_categoria":indexar_rio("categoria"),
        "by_area_proposta":indexar_rio("area"),
        "by_setor":indexar_rio("setor"),
        "by_movimento_hack":indexar_rio("movimentos_inspiradores"),
        "by_semente_anterior":indexar_rio("vinculos"),
        "by_ancora_canonica":indexar_rio("ancora"),
        "by_cena_local":indexar_rio("local_id"),
        "by_origem":indexar_rio("origem"),
        "by_destino":indexar_rio("destino")
    }
    if len(entidades_rio)!=43 or len(indices_rio["by_categoria"])!=8:
        raise ValueError("Garganta e Rio IX: esperadas 43 propostas em 8 categorias")
    categorias_costa_mar=("nucleos","oficios","pessoas","impactos","fluxos","acordos","cenas","arcos")
    entidades_costa_mar=[
        {**elemento,"categoria":categoria}
        for categoria in categorias_costa_mar for elemento in costa_mar[categoria]
    ]
    def indexar_costa_mar(chave):
        mapping=defaultdict(set)
        for x in entidades_costa_mar:
            raw=x.get(chave,[])
            values=raw if isinstance(raw,list) else [raw]
            for value in values:
                if value:mapping[str(value)].add(x["id"])
        return {k:sorted(v) for k,v in sorted(mapping.items())}
    indices_costa_mar={
        "by_categoria":indexar_costa_mar("categoria"),
        "by_territorio":indexar_costa_mar("territorio"),
        "by_setor":indexar_costa_mar("setor"),
        "by_papel":indexar_costa_mar("papel"),
        "by_movimento_hack":indexar_costa_mar("movimentos_inspiradores"),
        "by_referencia":indexar_costa_mar("referencias"),
        "by_personagem_reutilizado":indexar_costa_mar("reutiliza"),
        "by_origem":indexar_costa_mar("origem"),
        "by_destino":indexar_costa_mar("destino")
    }
    if len(entidades_costa_mar)!=45 or len(indices_costa_mar["by_categoria"])!=8:
        raise ValueError("Costa sob pressão: 45 entidades em oito categorias")
    categorias_economia=("polos","oficios","pessoas","fluxos","tributos","clandestinas","cenas","arcos")
    entidades_economia=[
        {**elemento,"categoria":categoria}
        for categoria in categorias_economia for elemento in economia_mar[categoria]
    ]
    def indexar_economia(campo):
        mapping=defaultdict(set)
        for entidade in entidades_economia:
            valor=entidade.get(campo,[])
            valores=valor if isinstance(valor,list) else [valor]
            for item in valores:
                if item: mapping[str(item)].add(entidade["id"])
        return {key:sorted(vals) for key,vals in sorted(mapping.items())}
    indices_economia={
        "by_categoria":indexar_economia("categoria"),
        "by_setor":indexar_economia("setor"),
        "by_povo":indexar_economia("povo"),
        "by_aguas":indexar_economia("aguas"),
        "by_abuso":indexar_economia("abuso"),
        "by_movimento_hack":indexar_economia("movimentos_inspiradores"),
        "by_referencia":indexar_economia("referencias"),
        "by_origem":indexar_economia("origem"),
        "by_destino":indexar_economia("destino")
    }
    if len(entidades_economia)!=44 or len(indices_economia["by_categoria"])!=8:
        raise ValueError("Economia marinha exige 44 propostas em oito categorias")
    categorias_diplomacia=("polos","casas","pessoas","disputas","tratados","cenas","missoes","arcos")
    entidades_diplomacia=[
       {**item,"categoria":categoria}
       for categoria in categorias_diplomacia for item in diplomacia_mar[categoria]
    ]
    def indexar_diplomacia(chave):
        mapping=defaultdict(set)
        for item in entidades_diplomacia:
            raw=item.get(chave,[])
            items=raw if isinstance(raw,list) else [raw]
            for key in items:
                if key: mapping[str(key)].add(item["id"])
        return {k:sorted(v) for k,v in sorted(mapping.items())}
    indices_diplomacia={
        "by_categoria":indexar_diplomacia("categoria"),
        "by_aguas":indexar_diplomacia("aguas"),
        "by_povo":indexar_diplomacia("povo"),
        "by_bloco":indexar_diplomacia("bloco"),
        "by_movimento_hack":indexar_diplomacia("movimentos_inspiradores"),
        "by_referencia":indexar_diplomacia("referencias"),
        "by_personagem_reutilizado":indexar_diplomacia("reutiliza")
    }
    if len(entidades_diplomacia)!=41 or len(indices_diplomacia["by_categoria"])!=8:
        raise ValueError("Diplomacia marinha exige 41 propostas em oito categorias")
    tipos_mar=("zonas","coletivos","pessoas","pactos","fenomenos","cenas","tramas")
    entidades_mar=[
       {**entry,"categoria":tipo}
       for tipo in tipos_mar for entry in mar_sangue[tipo]
    ]
    def indexar_mar(campo):
        idx=defaultdict(set)
        for x in entidades_mar:
            val=x.get(campo,[])
            values=val if isinstance(val,list) else [val]
            for v in values:
                if v:idx[str(v)].add(x["id"])
        return {k:sorted(v) for k,v in sorted(idx.items())}
    indice_mar_sangue={
       "by_categoria":indexar_mar("categoria"),
       "by_povo":indexar_mar("povo"),
       "by_aguas":indexar_mar("aguas"),
       "by_movimento_hack":indexar_mar("referencias_hack"),
       "by_ligacao":indexar_mar("ligacoes")
    }
    if len(entidades_mar)!=36 or len(indice_mar_sangue["by_categoria"])!=7:
        raise ValueError("Mar de Sangue deve possuir 36 propostas em sete categorias")
    categorias_costa=("espacos","redes","pessoas","praticas","circulacoes","cenas","tramas")
    entidades_costa=[
        {**entry,"categoria":categoria}
        for categoria in categorias_costa for entry in costa_sul[categoria]
    ]
    def indexar_costa(campo):
        mapping=defaultdict(set)
        for item in entidades_costa:
            vals=item.get(campo,[])
            vals=vals if isinstance(vals,list) else [vals]
            for val in vals:
                if val: mapping[str(val)].add(item["id"])
        return {key:sorted(value) for key,value in sorted(mapping.items())}
    indices_costa={
        "by_categoria":indexar_costa("categoria"),
        "by_movimento_hack":indexar_costa("movimentos_inspiradores"),
        "by_referencia":indexar_costa("referencias"),
        "by_escopo":indexar_costa("escopo"),
        "by_local_de_cena":indexar_costa("local_id")
    }
    if len(entidades_costa)!=33 or len(indices_costa["by_categoria"])!=7:
        raise ValueError("Costa Sul: 33 entidades em sete categorias esperadas")
    tipos_fronteira=("encontros","pessoas","acordos","fluxos","cenas","tramas")
    elementos_fronteira=[
      {"tipo":tipo,**elemento}
      for tipo in tipos_fronteira for elemento in fronteira[tipo]
    ]
    def indexar_fronteira(chave):
        mapping=defaultdict(set)
        for elemento in elementos_fronteira:
            val=elemento.get(chave,[])
            vals=val if isinstance(val,list) else [val]
            for v in vals:
                if v: mapping[v].add(elemento["id"])
        return {k:sorted(v) for k,v in sorted(mapping.items())}
    indice_fronteira={
      "by_tipo":indexar_fronteira("tipo"),
      "by_movimento_hack":indexar_fronteira("movimentos_inspiradores"),
      "by_ancora_regional":indexar_fronteira("ancora_regional"),
      "by_encontro":indexar_fronteira("encontro_id")
    }
    if len(elementos_fronteira)!=34 or len(indice_fronteira["by_tipo"])!=6:
        raise ValueError("Fronteira: esperados 34 elementos em seis categorias")
    caatinga_entidades=[
        {**elemento,"tipo":tipo,"subtipo_social":elemento.get("tipo")}
        for tipo in ("comunidades","coletivos","pessoas","pontos_agua","rotas","conflitos","cenas")
        for elemento in caatinga_rede_social[tipo]
    ]
    def indexar_rede_caat(chave):
        mapping=defaultdict(set)
        for entidade in caatinga_entidades:
            val=entidade.get(chave,[])
            vals=val if isinstance(val,list) else [val]
            for v in vals:
                if v: mapping[v].add(entidade["id"])
        return {k:sorted(v) for k,v in sorted(mapping.items())}
    caatinga_rede_indices={
      "by_tipo":indexar_rede_caat("tipo"),
      "by_tema":indexar_rede_caat("tags"),
      "by_movimento_hack":indexar_rede_caat("movimentos_inspiradores"),
      "by_comunidade":indexar_rede_caat("comunidade_id")
    }
    if len(caatinga_rede_indices["by_tipo"])!=7:
        raise ValueError("Índice da Caatinga deve preservar sete categorias, mesmo quando um coletivo possui subtipo")
    sementes_povoamento=povoamento_proposto["sementes"]
    areas_povoamento=povoamento_proposto["areas"]
    def index_povoamento(rows,key):
        mapping=defaultdict(set)
        for row in rows:
            values=row[key] if isinstance(row[key],list) else [row[key]]
            for value in values:
                if value: mapping[value].add(row["id"])
        return {k:sorted(v) for k,v in sorted(mapping.items())}
    indices_povoamento={
       "by_area":index_povoamento(sementes_povoamento,"area_id"),
       "by_tema":index_povoamento(sementes_povoamento,"temas"),
       "by_movimento_hack":index_povoamento(sementes_povoamento,"movimentos_inspiradores")
    }
    if len(sementes_povoamento)!=16 or len(areas_povoamento)!=8:
        raise ValueError("Povoamento exploratório: oito áreas e dezesseis núcleos esperados")
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
    bruxo_docx=json.loads(gzip.decompress((ROOT/"data/lore/hack-carcaca-dw-bruxo-integrais.json.gz").read_bytes()).decode("utf-8"))["movimentos"]
    necromante_docx=json.loads(gzip.decompress((ROOT/"data/lore/hack-carcaca-dw-necromante-integrais.json.gz").read_bytes()).decode("utf-8"))["movimentos"]
    artifice_docx=json.loads(gzip.decompress((ROOT/"data/lore/hack-carcaca-dw-artifice-integrais.json.gz").read_bytes()).decode("utf-8"))["movimentos"]
    mercenario_docx=json.loads(gzip.decompress((ROOT/"data/lore/hack-carcaca-dw-mercenario-integrais.json.gz").read_bytes()).decode("utf-8"))["movimentos"]
    escriba_yokai_docx=load("data/lore/hack-carcaca-dw-escriba-yokai-integrais.json")["movimentos"]
    nobre_docx=load("data/lore/hack-carcaca-dw-nobre-integrais.json")["movimentos"]
    arqueologo_docx=load("data/lore/hack-carcaca-dw-arqueologo-integrais.json")["movimentos"]
    dependencias_classes=classes_docx["dependencias_exatas_candidatas"]
    dependencias_pendentes=classes_docx["dependencias_nao_resolvidas"]
    try:
        from scripts.hack_movimentos_personagem import build_people_indexes,build_class_indexes,build_warrior_indexes,build_barbarian_indexes,build_hunter_indexes,build_rogue_indexes,build_bard_indexes,build_martial_artist_indexes,build_paladin_indexes,build_cleric_indexes,build_druid_indexes,build_mage_indexes,build_sorcerer_indexes,build_warlock_indexes,build_necromancer_indexes,build_artificer_indexes,build_mercenary_indexes,build_final_class_indexes
    except ModuleNotFoundError:
        from hack_movimentos_personagem import build_people_indexes,build_class_indexes,build_warrior_indexes,build_barbarian_indexes,build_hunter_indexes,build_rogue_indexes,build_bard_indexes,build_martial_artist_indexes,build_paladin_indexes,build_cleric_indexes,build_druid_indexes,build_mage_indexes,build_sorcerer_indexes,build_warlock_indexes,build_necromancer_indexes,build_artificer_indexes,build_mercenary_indexes,build_final_class_indexes
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
    bruxo_por_id={m["id"]:m for m in bruxo_docx}
    necromante_por_id={m["id"]:m for m in necromante_docx}
    artifice_por_id={m["id"]:m for m in artifice_docx}
    mercenario_por_id={m["id"]:m for m in mercenario_docx}
    escriba_yokai_por_id={m["id"]:m for m in escriba_yokai_docx}
    nobre_por_id={m["id"]:m for m in nobre_docx}
    arqueologo_por_id={m["id"]:m for m in arqueologo_docx}
    integral_por_id={**guerreiro_por_id,**barbaro_por_id,**cacador_por_id,**ladino_por_id,**bardo_por_id,**artista_marcial_por_id,**paladino_por_id,**clerigo_por_id,**druida_por_id,**mago_por_id,**feiticeiro_por_id,**bruxo_por_id,**necromante_por_id,**artifice_por_id,**mercenario_por_id,**escriba_yokai_por_id,**nobre_por_id,**arqueologo_por_id}
    if (len(integral_por_id)!=632 or len(movimentos_classes)!=632 or
        set(integral_por_id)!={m["id"] for m in movimentos_classes} or
        len({m["grupo"] for m in movimentos_classes})!=18):
        raise ValueError("Cobertura integral das 18 classes falhou: IDs faltantes, duplicados ou não inventariados")
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
    indice_bruxo_docx=build_warlock_indexes(bruxo_docx)
    indice_necromante_docx=build_necromancer_indexes(necromante_docx)
    indice_artifice_docx=build_artificer_indexes(artifice_docx)
    indice_mercenario_docx=build_mercenary_indexes(mercenario_docx)
    indice_escriba_yokai_docx=build_final_class_indexes(escriba_yokai_docx)
    indice_nobre_docx=build_final_class_indexes(nobre_docx)
    indice_arqueologo_docx=build_final_class_indexes(arqueologo_docx)
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
        "hack_warlock_movements":"hack-warlock-movements.json",
        "hack_warlock_movement_indexes":"hack-warlock-movement-indexes.json",
        "hack_necromancer_movements":"hack-necromancer-movements.json",
        "hack_necromancer_movement_indexes":"hack-necromancer-movement-indexes.json",
        "hack_artificer_movements":"hack-artificer-movements.json",
        "hack_artificer_movement_indexes":"hack-artificer-movement-indexes.json",
        "hack_mercenary_movements":"hack-mercenary-movements.json",
        "hack_mercenary_movement_indexes":"hack-mercenary-movement-indexes.json",
        "gnomish_cultures":"gnomish-cultures.json",
        "gnomish_cultures_indexes":"gnomish-cultures-indexes.json",
        "grama_cortada_daily_life":"grama-cortada-daily-life.json",
        "grama_cortada_daily_life_indexes":"grama-cortada-daily-life-indexes.json",
        "atlas_authorial_review":"atlas-authorial-review.json",
        "atlas_authorial_review_indexes":"atlas-authorial-review-indexes.json",
        "ironwood_civil_society":"ironwood-civil-society.json",
        "ironwood_civil_society_indexes":"ironwood-civil-society-indexes.json",
        "vandar_memory_and_dead":"vandar-memory-and-dead.json",
        "vandar_memory_and_dead_indexes":"vandar-memory-and-dead-indexes.json",
        "eldroth_sylara_occupation":"eldroth-sylara-occupation.json",
        "eldroth_sylara_occupation_indexes":"eldroth-sylara-occupation-indexes.json",
        "eldroth_preconquest":"eldroth-preconquest.json",
        "eldroth_preconquest_indexes":"eldroth-preconquest-indexes.json",
        "eldroth_cultural_atlas":"eldroth-cultural-atlas.json",
        "eldroth_cultural_atlas_indexes":"eldroth-cultural-atlas-indexes.json",
        "eldroth_dw_statblocks":"eldroth-dw-statblocks.json",
        "eldroth_dw_statblock_indexes":"eldroth-dw-statblock-indexes.json",
        "eldroth_monster_ecology":"eldroth-monster-ecology.json",
        "eldroth_monster_ecology_indexes":"eldroth-monster-ecology-indexes.json",
        "ironwood_eldroth_resistance":"ironwood-eldroth-resistance.json",
        "ironwood_eldroth_resistance_indexes":"ironwood-eldroth-resistance-indexes.json",
        "thargrid_social_resistance":"thargrid-social-resistance.json",
        "thargrid_social_resistance_indexes":"thargrid-social-resistance-indexes.json",
        "garganta_river_social":"garganta-river-social.json",
        "garganta_river_social_indexes":"garganta-river-social-indexes.json",
        "costa_sul_sea_pressure":"costa-sul-sea-pressure.json",
        "costa_sul_sea_pressure_indexes":"costa-sul-sea-pressure-indexes.json",
        "mar_sangue_economy":"mar-sangue-economy.json",
        "mar_sangue_economy_indexes":"mar-sangue-economy-indexes.json",
        "mar_sangue_diplomacy":"mar-sangue-diplomacy.json",
        "mar_sangue_diplomacy_indexes":"mar-sangue-diplomacy-indexes.json",
        "mar_sangue_social_ecology":"mar-sangue-social-ecology.json",
        "mar_sangue_social_ecology_indexes":"mar-sangue-social-ecology-indexes.json",
        "costa_sul_social_fabric":"costa-sul-social-fabric.json",
        "costa_sul_social_fabric_indexes":"costa-sul-social-fabric-indexes.json",
        "frontier_caatinga_costa_sul":"frontier-caatinga-costa-sul.json",
        "frontier_caatinga_costa_sul_indexes":"frontier-caatinga-costa-sul-indexes.json",
        "caatinga_social_network":"caatinga-social-network.json",
        "caatinga_social_indexes":"caatinga-social-indexes.json",
        "regional_population_proposals":"regional-population-proposals.json",
        "regional_population_proposal_indexes":"regional-population-proposal-indexes.json",
        "hack_yokai_scribe_movements":"hack-yokai-scribe-movements.json",
        "hack_yokai_scribe_movement_indexes":"hack-yokai-scribe-movement-indexes.json",
        "hack_noble_movements":"hack-noble-movements.json",
        "hack_noble_movement_indexes":"hack-noble-movement-indexes.json",
        "hack_archaeologist_movements":"hack-archaeologist-movements.json",
        "hack_archaeologist_movement_indexes":"hack-archaeologist-movement-indexes.json",
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
        "total_movimentos_bruxo_integrais":len(bruxo_docx),
        "total_opcoes_bruxo":sum(len(m["opcoes"]) for m in bruxo_docx),
        "total_requer_bruxo":sum(bool(m["requisito_literal"]) for m in bruxo_docx),
        "total_movimentos_necromante_integrais":len(necromante_docx),
        "total_opcoes_necromante":sum(len(m["opcoes"]) for m in necromante_docx),
        "total_requer_necromante":sum(bool(m["requisito_literal"]) for m in necromante_docx),
        "total_requer_compostos_necromante":sum((m["requisito_estruturado"] or {}).get("tipo")=="todos" for m in necromante_docx),
        "total_movimentos_artifice_integrais":len(artifice_docx),
        "total_opcoes_artifice":sum(len(m["opcoes"]) for m in artifice_docx),
        "total_requer_artifice":sum(bool(m["requisito_literal"]) for m in artifice_docx),
        "total_movimentos_mercenario_integrais":len(mercenario_docx),
        "total_opcoes_mercenario":sum(len(m["opcoes"]) for m in mercenario_docx),
        "total_requer_mercenario":sum(bool(m["requisito_literal"]) for m in mercenario_docx),
        "total_movimentos_escriba_yokai_integrais":len(escriba_yokai_docx),
        "total_movimentos_nobre_integrais":len(nobre_docx),
        "total_movimentos_arqueologo_integrais":len(arqueologo_docx),
        "total_movimentos_classe_integrais":len(integral_por_id),
        "total_grupos_classe_integrais":len({m["grupo"] for m in movimentos_classes}),
        "total_movimentos_classe_pendentes":len(movimentos_classes)-len(integral_por_id),
        "total_areas_povoamento_propostas":len(areas_povoamento),
        "total_nucleos_povoamento_propostos":len(sementes_povoamento),
        "total_fatos_gnomos_xxi":len(gnomos_xxi["fatos_documentados"]),
        "total_registros_gnomos_xxi":len(registros_xxi),
        "total_decisoes_gnomos_xxi":len(gnomos_xxi["decisoes_para_autor"]),
        "total_fatos_grama_cortada_xx":len(grama_xx["fatos_documentados"]),
        "total_propostas_grama_cortada_xx":len(registros_xx),
        "total_decisoes_grama_cortada_xx":len(grama_xx["decisoes_para_autor"]),
        "total_candidatos_revisao_xix":len(revisao_xix["candidatos"]),
        "total_decisoes_revisao_xix":len(revisao_xix["decisoes"]),
        "total_guardas_revisao_xix":len(revisao_xix["guardas"]),
        "total_canonizacoes_revisao_xix":revisao_xix["contagens"]["mudancas_canonicas"],
        "total_eixos_ironwood_xviii":len(ironwood_xviii["eixos_sociais"]),
        "total_modelos_ironwood_xviii":len(ironwood_xviii["modelos_de_governanca"]),
        "total_relacoes_ironwood_xviii":len(ironwood_xviii["relacoes_diplomaticas"]),
        "total_circuitos_ironwood_xviii":len(ironwood_xviii["circuitos_de_cuidado"]),
        "total_dilemas_ironwood_xviii":len(ironwood_xviii["dilemas"]),
        "total_vinhetas_ironwood_xviii":len(ironwood_xviii["vinhetas"]),
        "total_fases_vandar_xvii":len(vandar_xvii["fases"]),
        "total_tecidos_urbanos_vandar_xvii_propostos":len(vandar_xvii["tecidos_urbanos"]),
        "total_modalidades_prova_vandar_xvii":len(vandar_xvii["modalidades_de_prova"]),
        "total_situacoes_morte_vandar_xvii":len(vandar_xvii["situacoes_de_morte"]),
        "total_papeis_sociais_vandar_xvii":len(vandar_xvii["papeis_sociais"]),
        "total_vinhetas_vandar_xvii":len(vandar_xvii["vinhetas"]),
        "total_mecanismos_worldbuilding_xvi_propostos":len(ocupacao_xvi["mecanismos"]),
        "total_posicoes_sociais_worldbuilding_xvi":len(ocupacao_xvi["posicoes_sociais"]),
        "total_modelos_regime_worldbuilding_xvi":len(ocupacao_xvi["modelos_de_regime"]),
        "total_dilemas_worldbuilding_xvi":len(ocupacao_xvi["dilemas"]),
        "total_vinhetas_worldbuilding_xvi":len(ocupacao_xvi["vinhetas"]),
        "total_fases_worldbuilding_xv":len(preconquista_xv["fases"]),
        "total_praticas_worldbuilding_xv_propostas":len(preconquista_xv["praticas"]),
        "total_pactos_worldbuilding_xv_propostos":len(preconquista_xv["pactos"]),
        "total_ciclos_materiais_worldbuilding_xv_propostos":len(preconquista_xv["ciclos_materiais"]),
        "total_vinhetas_worldbuilding_xv_propostas":len(preconquista_xv["vinhetas"]),
        "total_areas_worldbuilding_xiv":len(atlas_cultural_xiv["areas"]),
        "total_marcos_worldbuilding_xiv":len(atlas_cultural_xiv["marcos"]),
        "total_eixos_worldbuilding_xiv":len(eixos_xiv),
        "total_alternativas_worldbuilding_xiv":sum(len(x["decisoes_autorais_pendentes"]) for x in eixos_xiv),
        "total_fichas_dw_eldroth_xiii_propostas":len(registros_xiii),
        "total_fichas_dw_eldroth_xiii_numericas":sum(f["modo"]=="estatizado" for f in registros_xiii),
        "total_fichas_dw_eldroth_xiii_sem_stats":sum(f["modo"]=="sem_estatisticas" for f in registros_xiii),
        "total_entidades_ecologia_monstruosa_xii_propostas":len(entidades_xii),
        "total_criaturas_ecologia_monstruosa_xii_propostas":len(ecologia_xii["criaturas"]),
        "total_encontros_ecologia_monstruosa_xii_propostos":len(ecologia_xii["encontros"]),
        "total_pressoes_ecologia_monstruosa_xii_propostas":len(ecologia_xii["pressoes"]),
        "total_frentes_ecologia_monstruosa_xii_propostas":len(ecologia_xii["frentes"]),
        "total_entidades_ironwood_eldroth_propostas":len(linhas_floresta),
        "total_lugares_ironwood_eldroth_propostos":len(floresta["lugares"]),
        "total_pessoas_ironwood_eldroth_propostas":len(floresta["pessoas"]),
        "total_cenas_ironwood_eldroth_propostas":len(floresta["cenas"]),
        "total_entidades_thargrid_propostas":len(rows_thargrid),
        "total_lugares_thargrid_propostos":len(thargrid["lugares"]),
        "total_pessoas_thargrid_propostas":len(thargrid["pessoas"]),
        "total_cenas_thargrid_propostas":len(thargrid["cenas"]),
        "total_entidades_garganta_rio_propostas":len(entidades_rio),
        "total_lugares_garganta_rio_propostos":len(rio_garganta["lugares"]),
        "total_cenas_garganta_rio_propostas":len(rio_garganta["cenas"]),
        "total_personagens_garganta_rio_propostos":len(rio_garganta["pessoas"]),
        "total_entidades_costa_sul_pressao_propostas":len(entidades_costa_mar),
        "total_impactos_costa_sul_propostos":len(costa_mar["impactos"]),
        "total_acordos_costa_sul_propostos":len(costa_mar["acordos"]),
        "total_fluxos_costa_sul_propostos":len(costa_mar["fluxos"]),
        "total_entidades_economia_mar_propostas":len(entidades_economia),
        "total_oficios_economia_mar_propostos":len(economia_mar["oficios"]),
        "total_fluxos_economia_mar_propostos":len(economia_mar["fluxos"]),
        "total_tributos_economia_mar_propostos":len(economia_mar["tributos"]),
        "total_entidades_diplomacia_mar_propostas":len(entidades_diplomacia),
        "total_polos_diplomacia_mar_propostos":len(diplomacia_mar["polos"]),
        "total_tratados_diplomacia_mar_propostos":len(diplomacia_mar["tratados"]),
        "total_disputas_diplomacia_mar_propostas":len(diplomacia_mar["disputas"]),
        "total_entidades_mar_sangue_propostas":len(entidades_mar),
        "total_coletivos_mar_sangue_propostos":len(mar_sangue["coletivos"]),
        "total_pessoas_mar_sangue_propostas":len(mar_sangue["pessoas"]),
        "total_entidades_costa_sul_propostas":len(entidades_costa),
        "total_espacos_costa_sul_propostos":len(costa_sul["espacos"]),
        "total_redes_insulares_propostas":len(costa_sul["redes"]),
        "total_pessoas_costa_sul_propostas":len(costa_sul["pessoas"]),
        "total_entidades_fronteira_propostas":len(elementos_fronteira),
        "total_encontros_fronteira_propostos":len(fronteira["encontros"]),
        "total_pessoas_fronteira_propostas":len(fronteira["pessoas"]),
        "total_entidades_caatinga_propostas":len(caatinga_entidades),
        "total_comunidades_caatinga_propostas":len(caatinga_rede_social["comunidades"]),
        "total_npcs_caatinga_propostos":len(caatinga_rede_social["pessoas"]),
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
           files["hack_warlock_movements"]:bruxo_docx,
           files["hack_warlock_movement_indexes"]:indice_bruxo_docx,
           files["hack_necromancer_movements"]:necromante_docx,
           files["hack_necromancer_movement_indexes"]:indice_necromante_docx,
           files["hack_artificer_movements"]:artifice_docx,
           files["hack_artificer_movement_indexes"]:indice_artifice_docx,
           files["hack_mercenary_movements"]:mercenario_docx,
           files["hack_mercenary_movement_indexes"]:indice_mercenario_docx,
           files["gnomish_cultures"]:gnomos_xxi,
           files["gnomish_cultures_indexes"]:indices_gnomos_xxi,
           files["grama_cortada_daily_life"]:grama_xx,
           files["grama_cortada_daily_life_indexes"]:indices_grama_xx,
           files["atlas_authorial_review"]:revisao_xix,
           files["atlas_authorial_review_indexes"]:indices_revisao_xix,
           files["ironwood_civil_society"]:ironwood_xviii,
           files["ironwood_civil_society_indexes"]:indexes_ironwood_xviii,
           files["vandar_memory_and_dead"]:vandar_xvii,
           files["vandar_memory_and_dead_indexes"]:indexes_vandar_xvii,
           files["eldroth_sylara_occupation"]:ocupacao_xvi,
           files["eldroth_sylara_occupation_indexes"]:indices_ocupacao_xvi,
           files["eldroth_preconquest"]:preconquista_xv,
           files["eldroth_preconquest_indexes"]:indices_preconquista_xv,
           files["eldroth_cultural_atlas"]:atlas_cultural_xiv,
           files["eldroth_cultural_atlas_indexes"]:indices_culturais_xiv,
           files["eldroth_dw_statblocks"]:fichas_xiii,
           files["eldroth_dw_statblock_indexes"]:indexes_fichas_xiii,
           files["eldroth_monster_ecology"]:ecologia_xii,
           files["eldroth_monster_ecology_indexes"]:indices_xii,
           files["ironwood_eldroth_resistance"]:floresta,
           files["ironwood_eldroth_resistance_indexes"]:indices_floresta,
           files["thargrid_social_resistance"]:thargrid,
           files["thargrid_social_resistance_indexes"]:indexes_thargrid,
           files["garganta_river_social"]:rio_garganta,
           files["garganta_river_social_indexes"]:indices_rio,
           files["costa_sul_sea_pressure"]:costa_mar,
           files["costa_sul_sea_pressure_indexes"]:indices_costa_mar,
           files["mar_sangue_economy"]:economia_mar,
           files["mar_sangue_economy_indexes"]:indices_economia,
           files["mar_sangue_diplomacy"]:diplomacia_mar,
           files["mar_sangue_diplomacy_indexes"]:indices_diplomacia,
           files["mar_sangue_social_ecology"]:mar_sangue,
           files["mar_sangue_social_ecology_indexes"]:indice_mar_sangue,
           files["costa_sul_social_fabric"]:costa_sul,
           files["costa_sul_social_fabric_indexes"]:indices_costa,
           files["frontier_caatinga_costa_sul"]:fronteira,
           files["frontier_caatinga_costa_sul_indexes"]:indice_fronteira,
           files["caatinga_social_network"]:caatinga_rede_social,
           files["caatinga_social_indexes"]:caatinga_rede_indices,
           files["regional_population_proposals"]:povoamento_proposto,
           files["regional_population_proposal_indexes"]:indices_povoamento,
           files["hack_yokai_scribe_movements"]:escriba_yokai_docx,
           files["hack_yokai_scribe_movement_indexes"]:indice_escriba_yokai_docx,
           files["hack_noble_movements"]:nobre_docx,
           files["hack_noble_movement_indexes"]:indice_nobre_docx,
           files["hack_archaeologist_movements"]:arqueologo_docx,
           files["hack_archaeologist_movement_indexes"]:indice_arqueologo_docx,
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
