#!/usr/bin/env python3
"""Auditoria sem rede da curadoria autoral; não modifica dist ou arquivos canônicos."""
from __future__ import annotations

import json
from pathlib import Path

from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]

def load(path):
    return json.loads((ROOT / path).read_text(encoding="utf8"))

def unique(items, label):
    keys = [x["id"] for x in items]
    assert len(keys) == len(set(keys)), f"IDs duplicados em {label}"
    return set(keys)

def require(condition, message):
    if not condition:
        raise AssertionError(message)

def run():
    types = load("data/taxonomia_carcaca.json")
    sources = load("data/fontes_projeto.json")
    regions = load("data/regioes_carcaca.json")["regioes"]
    factions = load("data/faccoes_carcaca.json")["faccoes"]
    places = load("data/lugares_carcaca.json")["lugares"]
    creatures = load("curadoria/criaturas/arquivo-dos-mortos-afogados.json")
    fronts = [load("curadoria/frentes/disputa-pela-lanca.json")]
    steadings = load("curadoria/assentamentos/portomonte.json")
    schema = load("schemas/criatura-carcaca.schema.json")
    Draft202012Validator.check_schema(schema)
    validator = Draft202012Validator(schema)

    allowed = unique(types["tipos"], "tipos")
    region_ids = unique(regions, "regioes")
    faction_ids = unique(factions, "faccoes")
    place_ids = unique(places, "lugares")
    creature_ids = unique(creatures, "criaturas")
    unique(steadings, "assentamentos")
    unique(fronts, "frentes")

    for region in regions:
        for place_id in region["lugares"]:
            require(place_id in place_ids, f"Lugar não definido: {place_id}")
    for place in places:
        require(place["regiao_id"] in region_ids, f"Região do lugar desconhecida: {place['id']}")
        require(place["fonte"] in sources, f"Fonte do lugar desconhecida: {place['id']}")
    for faction in factions:
        require(faction["fonte"] in sources, f"Fonte da facção desconhecida: {faction['id']}")

    for creature in creatures:
        errs = list(validator.iter_errors(creature))
        require(not errs, f"Schema inválido em {creature['id']}: {errs[:1]}")
        require(creature["tipo_carcaca"] in allowed, f"Tipo Carcaça desconhecido: {creature['id']}")
        require(creature["tipo_dnd_referencia"]["original"], f"Tipo D&D ausente: {creature['id']}")
        for ref in creature["proveniencia"]["fontes"]:
            require(ref in sources, f"Fonte inexistente: {ref}")
        for x in creature["ocorrencias"]:
            require(x["regiao_id"] in region_ids, f"Região inexistente: {creature['id']}")
            require(x.get("lugar_id") in place_ids, f"Lugar inexistente: {creature['id']}")
        for x in creature.get("faccoes", []):
            require(x["id"] in faction_ids, f"Facção inexistente: {creature['id']}")
        for x in creature.get("relacoes", []):
            require(x["alvo_id"] in faction_ids | place_ids | creature_ids,
                    f"Alvo não cadastrado: {x['alvo_id']}")
        dw = creature["dungeon_world"]
        require(dw["instinto"] and len(dw["movimentos"]) >= 2, f"Falta instinto/movimentos DW: {creature['id']}")
        require(dw["estatisticas"]["estado"] == "nao_calculadas",
                f"Valores DW exigem ficha revisada: {creature['id']}")
        for key in ("pv", "armadura", "dano"):
            require(dw["estatisticas"][key] is None,
                    f"Conversão numérica automática proibida: {creature['id']}")

    for front in fronts:
        require(set(front["regioes"]) <= region_ids, "Frente sem região conhecida")
        require(set(front["elenco"]) <= creature_ids, "Elenco sem criatura registrada")
        require(2 <= len(front["perigos"]) <= 3, "Frente piloto deve ter 2-3 perigos")
        require(1 <= len(front["perguntas_em_aberto"]) <= 3, "Frente sem perguntas em aberto")
        for danger in front["perigos"]:
            require(set(danger["criaturas"]) <= creature_ids, "Perigo não referencia criatura")
            require(1 <= len(danger["pressagios_propostos"]) <= 5, "Presságios fora do modelo DW")
            require(danger["desastre_iminente_proposto"], "Perigo sem desastre iminente")
    for steading in steadings:
        require(steading["regiao_id"] in region_ids, "Assentamento sem região")
        require(steading["fonte"] in sources, "Assentamento sem fonte")
        require(steading["tipo_dw"]["classificacao"] is None or steading["tipo_dw"]["estado"] == "revisado",
                "Assentamento não deve inferir classificação DW")

    print(f"Curadoria válida: {len(creatures)} criaturas, {len(regions)} regiões, "
          f"{len(places)} lugares, {len(factions)} facções, {len(fronts)} frente, "
          f"{len(steadings)} assentamento(s).")

if __name__ == "__main__":
    run()
