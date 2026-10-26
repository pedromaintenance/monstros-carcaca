#!/usr/bin/env python3
"""Validação de integridade de snapshots e índices."""
import json
from collections import Counter
from pathlib import Path

root = Path(__file__).resolve().parents[1] / "dist"
manifest = json.loads((root / "manifest.json").read_text(encoding="utf8"))
catalog = json.loads((root / "catalog.json").read_text(encoding="utf8"))
indexes = json.loads((root / "indexes.json").read_text(encoding="utf8"))
assert manifest["schema_version"] == "1.0"
assert manifest["total"] == len(catalog)
ids = [x["id"] for x in catalog]
assert len(set(ids)) == len(ids), "IDs duplicados"
assert all(x["license"] == "CC-BY-4.0" for x in catalog)
assert sum(len(v) for v in indexes["by_source"].values()) == len(catalog)
assert sum(len(v) for v in indexes["by_type"].values()) == len(catalog)
for source, filename in manifest["files"].items():
    rows = json.loads((root / filename).read_text(encoding="utf8"))
    assert all(row["source"]["id"] == source for row in rows)
    assert all(row["schema_version"] == "1.0" for row in rows)
    assert Counter(x["id"] for x in rows).most_common(1)[0][1] == 1
print("OK:", len(catalog), "variantes em", len(manifest["files"]), "arquivos de fonte.")
