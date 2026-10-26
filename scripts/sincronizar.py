#!/usr/bin/env python3
"""Sincroniza bestiários CC-BY 4.0 para um formato independente dos jogos.
Requer Python 3.11+ e requests. Execute: python scripts/sincronizar.py.
Não copia conteúdo OGL ou proprietário sem uma revisão específica da licença.
"""
from __future__ import annotations

import json
import re
import unicodedata
from collections import defaultdict
from datetime import datetime, timezone
from fractions import Fraction
from pathlib import Path
from urllib.parse import quote

import requests

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
GH = "https://raw.githubusercontent.com"
API = "https://api.github.com"
OPEN5E_REF = "staging"
USER_AGENT = "monstros-carcaca/1.0 (CC-BY content synchronization)"
S = requests.Session()
S.headers.update({"User-Agent": USER_AGENT, "Accept": "application/vnd.github+json"})
import os
if os.environ.get("GITHUB_TOKEN"):
    S.headers["Authorization"] = "Bearer " + os.environ["GITHUB_TOKEN"]

CREATURE_FIELDS = [
    "ability_score_strength", "ability_score_dexterity", "ability_score_constitution",
    "ability_score_intelligence", "ability_score_wisdom", "ability_score_charisma",
]
EDITION = {"srd-2014": "2014", "srd-2024": "2024", "bfrd": "2014"}
TYPE_PT = {
    "aberration": "aberração", "beast": "besta", "celestial": "celestial",
    "construct": "constructo", "dragon": "dragão", "elemental": "elemental",
    "fey": "feérico", "fiend": "ínfero", "giant": "gigante",
    "humanoid": "humanoide", "monstrosity": "monstruosidade",
    "ooze": "limo", "plant": "planta", "undead": "morto-vivo",
}
ATTR = {"str": "strength", "dex": "dexterity", "con": "constitution",
        "int": "intelligence", "wis": "wisdom", "cha": "charisma"}

def get_json(url):
    response = S.get(url, timeout=90)
    response.raise_for_status()
    return response.json()

def get_text(url):
    response = S.get(url, timeout=90)
    response.raise_for_status()
    return response.text

def raw(repo, ref, path):
    return f"{GH}/{repo}/{ref}/{quote(path, safe='/')}"

def slug(value):
    clean = unicodedata.normalize("NFKD", str(value)).encode("ascii", "ignore").decode()
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", clean.lower())).strip("-")

def number(value):
    if value is None or value == "":
        return None
    try:
        return float(Fraction(str(value).strip()))
    except (ValueError, ZeroDivisionError):
        return None

def ident(source_key, edition, external_id):
    return f"{source_key}:{edition}:{slug(external_id)}"

def datum(key, name, edition, source, license_name):
    return {
        "id": ident(source, edition, key),
        "schema_version": "1.0",
        "key": slug(name), "name": name, "names": {"en": name},
        "edition": edition, "system": "dnd5e-compatible",
        "source": {"id": source, "original_id": str(key),
                   "license": license_name, "url": "", "attribution": ""},
        "classification": {"type": None, "type_pt": None, "subtype": None,
                           "size": None, "alignment": None,
                           "environments": [], "tags": []},
        "challenge": {"rating": None, "value": None, "xp": None},
        "stats": {"armor_class": None, "hit_points": None, "hit_dice": None,
                  "abilities": {}, "speed": {}, "saving_throws": {},
                  "skills": {}, "senses": None, "languages": None},
        "features": {"traits": [], "actions": [], "reactions": [],
                     "bonus_actions": [], "legendary_actions": []},
        "lore": {"description": None, "description_format": None},
        "carcaca": {"canon": False, "regions": [], "factions": [], "role": None},
        "games": {},
    }

def v2_items(docdir, filename):
    url = raw("open5e/open5e-api", OPEN5E_REF, f"{docdir}/{filename}.json")
    try:
        return get_json(url)
    except requests.HTTPError as err:
        if err.response is not None and err.response.status_code == 404:
            return []
        raise

def open5e_records(docdir):
    documents = v2_items(docdir, "Document")
    if not documents:
        return [], None
    document = documents[0]
    fields = document["fields"]
    licenses = fields.get("licenses", [])
    if "cc-by-40" not in licenses:
        return [], {"id": document["pk"], "name": fields.get("name"),
                    "license": licenses, "status": "cataloged-only",
                    "reason": "Licença OGL: revisão de Section 15 e Product Identity pendente"}
    key = document["pk"]
    source_key = "open5e-" + key
    edition = EDITION.get(key, "2014" if fields.get("gamesystem") == "5e-2014" else "2024")
    source_url = fields.get("permalink") or f"https://open5e.com/"
    creator = fields.get("author") or fields.get("publisher") or "Open5e"
    source_record = {
        "id": source_key, "name": fields.get("name"),
        "license": "CC-BY-4.0", "status": "imported",
        "url": source_url, "provider": "open5e/open5e-api",
        "attribution": creator, "edition": edition,
    }
    raw_creatures = v2_items(docdir, "Creature")
    result = []
    lookup = {}
    for entry in raw_creatures:
        f = entry["fields"]
        name = f.get("name")
        if not name:
            continue
        m = datum(entry["pk"], name, edition, source_key, "CC-BY-4.0")
        m["source"]["url"] = source_url
        m["source"]["attribution"] = creator
        c = m["classification"]
        c["type"] = str(f.get("type") or "").lower() or None
        c["type_pt"] = TYPE_PT.get(c["type"])
        c["size"] = f.get("size")
        c["subtype"] = f.get("subcategory")
        c["alignment"] = f.get("alignment")
        c["environments"] = f.get("environments") or []
        m["challenge"]["rating"] = str(f.get("challenge_rating")) if f.get("challenge_rating") is not None else None
        m["challenge"]["value"] = number(f.get("challenge_rating"))
        m["challenge"]["xp"] = f.get("experience_points_integer")
        stats = m["stats"]
        stats["armor_class"] = f.get("armor_class")
        stats["hit_points"] = f.get("hit_points")
        stats["hit_dice"] = f.get("hit_dice")
        stats["abilities"] = {name: f.get("ability_score_" + name) for name in ATTR.values()}
        stats["speed"] = {k: f[k] for k in ["walk", "fly", "swim", "climb", "burrow"] if f.get(k) is not None}
        stats["speed_unit"] = fields.get("distance_unit", "feet")
        stats["saving_throws"] = {k: f["saving_throw_" + k] for k in ATTR.values() if f.get("saving_throw_" + k) is not None}
        stats["skills"] = {k.removeprefix("skill_bonus_"): v for k, v in f.items() if k.startswith("skill_bonus_") and v is not None}
        stats["senses"] = {k: f[k] for k in ["darkvision_range", "blindsight_range", "tremorsense_range", "truesight_range", "passive_perception"] if f.get(k) is not None}
        stats["languages"] = f.get("languages_desc") or f.get("languages")
        m["lore"]["description"] = f.get("desc")
        m["lore"]["description_format"] = "markdown" if f.get("desc") else None
        result.append(m)
        lookup[entry["pk"]] = m

    categories = {"ACTION": "actions", "REACTION": "reactions",
                  "BONUS_ACTION": "bonus_actions", "LEGENDARY_ACTION": "legendary_actions"}
    action_lookup = {}
    for item in v2_items(docdir, "CreatureAction"):
        f = item["fields"]
        monster = lookup.get(f.get("parent"))
        if monster is None:
            continue
        action = {"name": f.get("name"), "description": f.get("desc"), "attacks": [],
                  "uses": f.get("uses_param"), "legendary_cost": f.get("legendary_action_cost")}
        category = categories.get(str(f.get("action_type") or "").upper(), "actions")
        monster["features"][category].append(action)
        action_lookup[item["pk"]] = action
    for item in v2_items(docdir, "CreatureActionAttack"):
        f = item["fields"]
        parent = action_lookup.get(f.get("parent"))
        if parent:
            parent["attacks"].append({k: v for k, v in f.items() if k != "parent" and v is not None})
    for item in v2_items(docdir, "CreatureTrait"):
        f = item["fields"]
        monster = lookup.get(f.get("parent"))
        if monster:
            monster["features"]["traits"].append({"name": f.get("name"),
                                                   "description": f.get("desc")})
    return result, source_record

def dnd5eapi_records(edition):
    url = raw("5e-bits/5e-database", "main", f"src/{edition}/en/5e-SRD-Monsters.json")
    original = get_json(url)
    result = []
    source_key = f"5ebits-srd-{edition}"
    for f in original:
        name = f.get("name")
        if not name:
            continue
        m = datum(f.get("index") or name, name, edition, source_key, "CC-BY-4.0")
        m["source"]["url"] = "https://www.dndbeyond.com/srd"
        m["source"]["attribution"] = "Wizards of the Coast; 5e-bits/5e-database"
        c = m["classification"]
        c["type"] = str(f.get("type") or "").lower() or None
        c["type_pt"] = TYPE_PT.get(c["type"])
        c["subtype"] = f.get("subtype")
        c["size"] = f.get("size")
        c["alignment"] = f.get("alignment")
        m["challenge"]["rating"] = str(f.get("challenge_rating")) if f.get("challenge_rating") is not None else None
        m["challenge"]["value"] = number(f.get("challenge_rating"))
        m["challenge"]["xp"] = f.get("xp")
        stats = m["stats"]
        ac = f.get("armor_class")
        stats["armor_class"] = ac[0].get("value") if isinstance(ac, list) and ac and isinstance(ac[0], dict) else ac
        stats["hit_points"] = f.get("hit_points")
        stats["hit_dice"] = f.get("hit_dice")
        stats["abilities"] = {k: f.get(k) for k in ATTR.values()}
        stats["speed"] = f.get("speed") or {}
        stats["speed_unit"] = "as-published"
        stats["saving_throws"] = {x["proficiency"].get("index", x["proficiency"].get("name")): x["value"]
                                  for x in (f.get("proficiencies") or []) if "saving-throw" in str(x.get("proficiency", {}).get("index", ""))}
        stats["skills"] = {x["proficiency"].get("index", x["proficiency"].get("name")): x["value"]
                           for x in (f.get("proficiencies") or []) if "skill-" in str(x.get("proficiency", {}).get("index", ""))}
        stats["senses"] = f.get("senses")
        stats["languages"] = f.get("languages")
        for target, src in [("traits", "special_abilities"), ("actions", "actions"),
                            ("reactions", "reactions"), ("bonus_actions", "bonus_actions"),
                            ("legendary_actions", "legendary_actions")]:
            m["features"][target] = f.get(src) or []
        result.append(m)
    return result, {
        "id": source_key, "name": "Wizards of the Coast SRD via 5e-bits",
        "license": "CC-BY-4.0", "status": "imported", "edition": edition,
        "url": "https://www.dndbeyond.com/srd",
        "provider": "5e-bits/5e-database", "attribution": "Wizards of the Coast",
    }

def your5e_records():
    """Importa notas e descrições autorais CC-BY; estatísticas MD ficam no texto, sem adivinhar campos."""
    tree = get_json(f"{API}/repos/your5e/monsters/git/trees/main?recursive=1")
    paths = sorted(item["path"] for item in tree["tree"]
                   if item["path"].startswith("Monsters/") and item["path"].endswith(".md"))
    out = []
    for i, path in enumerate(paths):
        raw_md = get_text(raw("your5e/monsters", "main", path))
        name = Path(path).stem
        m = datum(path, name, "2024", "your5e-2024", "CC-BY-4.0")
        m["source"]["url"] = f"https://github.com/your5e/monsters/blob/main/{quote(path, safe='/')}"
        m["source"]["attribution"] = "Mark Norman Francis (texto); Loupon (arte); Wizards of the Coast (SRD)"
        m["lore"]["description"] = raw_md
        m["lore"]["description_format"] = "markdown-statblock"
        m["classification"]["tags"] = ["statblock-markdown", "not-yet-structured"]
        # Este formato mantém o texto original sem fingir uma leitura estruturada.
        out.append(m)
    return out, {
        "id": "your5e-2024", "name": "5th Edition Monsters by your5e",
        "license": "CC-BY-4.0", "status": "imported", "edition": "2024",
        "provider": "your5e/monsters", "url": "https://github.com/your5e/monsters",
        "attribution": "Mark Norman Francis (texto); Loupon (arte); Wizards of the Coast (SRD 5.2.1)"
    }

def validate(records):
    ids = [m["id"] for m in records]
    if len(set(ids)) != len(ids):
        duplicates = [k for k in set(ids) if ids.count(k) > 1]
        raise ValueError(f"IDs duplicados: {duplicates[:10]}")
    for m in records:
        if not m["name"] or not m["source"]["license"]:
            raise ValueError("Registro sem nome/licença: " + m["id"])
        if m["source"]["license"] != "CC-BY-4.0":
            raise ValueError("Fonte não autorizada: " + m["id"])

def write(path, value):
    dest = DIST / path
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf8")

def build():
    source_sets = []
    source_meta = []
    # Fontes abertas e com redistribuição permitida
    for edition in ("2014", "2024"):
        source_sets.append(dnd5eapi_records(edition))
    tree = get_json(f"{API}/repos/open5e/open5e-api/git/trees/{OPEN5E_REF}?recursive=1")
    dirs = sorted({item["path"].rsplit("/", 1)[0] for item in tree["tree"]
                   if item["path"].startswith("data/v2/") and item["path"].endswith("/Creature.json")})
    for directory in dirs:
        source_sets.append(open5e_records(directory))
    source_sets.append(your5e_records())

    all_records = []
    for creatures, source in source_sets:
        if source:
            source_meta.append({**source, "count": len(creatures)})
        if not creatures:
            continue
        validate(creatures)
        source_id = source["id"]
        creatures.sort(key=lambda m: m["id"])
        write(f"creatures/{source_id}.json", creatures)
        all_records.extend(creatures)
    validate(all_records)
    by_type, by_cr, by_edition, by_source, by_name = (defaultdict(list) for _ in range(5))
    minimal = []
    for m in sorted(all_records, key=lambda x: x["id"]):
        key = m["id"]
        c = m["classification"]
        by_type[c["type"] or "unknown"].append(key)
        by_cr[str(m["challenge"]["value"]) if m["challenge"]["value"] is not None else "unknown"].append(key)
        by_edition[m["edition"]].append(key)
        by_source[m["source"]["id"]].append(key)
        by_name[m["key"]].append(key)
        minimal.append({"id": key, "key": m["key"], "name": m["name"],
                        "edition": m["edition"], "source_id": m["source"]["id"],
                        "type": c["type"], "cr": m["challenge"]["value"],
                        "size": c["size"], "license": m["source"]["license"]})
    manifest = {
        "schema_version": "1.0", "generated_at": datetime.now(timezone.utc).isoformat(),
        "total": len(minimal), "sources": source_meta,
        "files": {x["id"]: f"creatures/{x['id']}.json"
                  for x in source_meta if x["status"] == "imported" and x["count"]},
        "catalog": "catalog.json", "indexes": "indexes.json",
        "consumption": "relative paths from dist/",
    }
    for s in [
        {"id": "5etools", "status": "reference-only", "license": "not-cleared",
         "url": "https://5e.tools", "reason": "Não espelhar livros proprietários"},
        {"id": "open5e-ogl", "status": "cataloged-only", "license": "OGL-1.0a",
         "url": "https://open5e.com", "reason": "Aguardando auditoria OGC, avisos OGL e Product Identity"},
    ]:
        source_meta.append(s)
    write("manifest.json", manifest)
    write("catalog.json", minimal)
    write("indexes.json", {
        "by_type": by_type, "by_cr": by_cr,
        "by_edition": by_edition, "by_source": by_source, "by_name": by_name,
    })
    print(f"Importação concluída: {len(all_records)} variantes, {len(source_meta)} fontes")
    if len(all_records) < 500:
        raise RuntimeError("Importação incompleta: abaixo do mínimo esperado de 500 variantes")

if __name__ == "__main__":
    build()
