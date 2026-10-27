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

def build():
    creatures = collect("curadoria/criaturas")
    regions = sorted(load("data/regioes_carcaca.json")["regioes"], key=lambda x:x["id"])
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
    dependencies=sorted(load("data/dependencias_materiais_costa_sul.json")["dependencias"],key=lambda r:r["id"])
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
    files = {
        "creatures":"creatures.json", "catalog":"catalog.json", "indexes":"indexes.json",
        "regions":"regions.json", "places":"places.json", "factions":"factions.json",
        "types":"types.json", "fronts":"fronts.json", "settlements":"settlements.json",
        "settlement_labels":"settlement-labels.json",
        "settlement_indexes":"settlement-indexes.json",
        "peoples":"peoples.json", "flows":"flows.json",
        "settlement_scenarios":"settlement-scenarios.json",
        "material_dependencies":"material-dependencies.json",
        "material_dependency_indexes":"material-dependency-indexes.json"
    }
    manifest = {
        "schema_version":"0.1.0", "descricao":"Atlas autoral de criaturas; independente do acervo de fichas D&D em dist/creatures.",
        "total_criaturas":len(creatures), "total_regioes":len(regions),
        "total_lugares":len(places), "total_faccoes":len(factions),
        "total_frentes":len(fronts), "total_assentamentos":len(settlements),
        "total_rotulos_assentamentos":len(settlement_labels), "total_povos":len(peoples),
        "total_fluxos":len(flows), "total_cenarios_assentamentos":len(scenarios),
        "total_dependencias_materiais":len(dependencies),
        "arquivos":files, "estado":"curadoria_em_andamento",
        "nota":"Registros podem ser propostas. Não substituir estatísticas nem cânone de nenhum jogo automaticamente."
    }
    return {
        "manifest.json":manifest,files["creatures"]:creatures,files["catalog"]:catalog,
        files["indexes"]:indexes,files["regions"]:regions,files["places"]:places,
        files["factions"]:factions,files["types"]:types,files["fronts"]:fronts,
        files["settlements"]:settlements,
        files["settlement_labels"]:settlement_labels,
        files["settlement_indexes"]:settlement_indexes,
        files["peoples"]:peoples,files["flows"]:flows,
        files["settlement_scenarios"]:scenarios,
        files["material_dependencies"]:dependencies,
        files["material_dependency_indexes"]:dependency_indexes
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
