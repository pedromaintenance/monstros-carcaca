#!/usr/bin/env python3
"""Gera dist/carcaca de forma determinística sem misturar fontes ou alterar curadoria.
Uso: python scripts/gerar_indices_curadoria.py [--check]
"""
from __future__ import annotations
import argparse
import json
import re
import unicodedata
from collections import defaultdict
from pathlib import Path

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
    lore_indexes=build_lore_indexes(lore_entries)
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
        "lore_index_indexes":"lore-indexes.json",
        "lore_chronology":"lore-chronology.json",
        "lore_review_notes":"lore-review-notes.json",
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
        "total_paginas_lore_manuscrito":len(lore_source["paginas"]),
        "total_eventos_cronologia_manuscrito":len(lore_timeline["eventos"]),
        "total_incognitas_manuscrito":len(lore_timeline["questoes_abertas"]),
        "total_pontos_revisao_manuscrito":len(lore_reviews["revisoes"]),
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
        files["lore_index_indexes"]:lore_indexes,
        files["lore_chronology"]:lore_timeline,
        files["lore_review_notes"]:lore_reviews,
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
