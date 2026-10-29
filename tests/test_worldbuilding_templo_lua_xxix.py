"""XXIX — Templo da Lua, rastreabilidade, cenários e limites políticos."""
import json, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def get(p): return json.loads((ROOT/p).read_text(encoding="utf-8"))
CATS=("modelos_do_rito","interfaces_civis","provas_e_incerteza",
      "economia_e_movimento","tensoes_de_poder","vinhetas")
class TestTemploLuaXXIX(unittest.TestCase):
    def test_integridade(self):
        d=get("data/worldbuilding/templo-lua-severina-ciclo29.json")
        self.assertEqual(d["contagens"],{"fatos":12,"referencias":14,"propostas":36,
            "perguntas":12,"modelos_do_rito":4,"interfaces_civis":8,
            "provas_e_incerteza":8,"economia_e_movimento":6,
            "tensoes_de_poder":6,"vinhetas":4})
        nulls=("localizacao_exata_ilha","divindade_titular_confirmada",
            "mecanismo_ritual_confirmado","alcance_ritual_confirmado",
            "calendario_lunar_ritual_confirmado","pessoal_de_culto_confirmado",
            "capacidade_hidraulica_quantificada","instituicao_fiscal_do_templo_confirmada")
        self.assertTrue(all(d[k] is None for k in nulls))
        self.assertTrue(all(d[k] is False for k in (
            "revolta_drakport_ocorreu","aprovacao_autoral","efeito_canonico_automatico",
            "alteracao_atlas_factual","alteracao_criaturas","alteracao_regras_dw")))
        pages={p["pagina"] for p in get(d["fonte_manuscrito"])["paginas"]}
        self.assertEqual(len({f["id"] for f in d["fatos_documentados"]}),12)
        for f in d["fatos_documentados"]:
            self.assertIn(f["pagina"],pages)
            self.assertIn(f["pagina"],{4,7,9,11,22})
            self.assertFalse(f["novo_canon"])
        refs=d["referencias_rastreaveis"]
        self.assertEqual(len({r["id"] for r in refs}),14)
        for r in refs:
            self.assertIn(r["id"],{x["id"] for x in get(r["arquivo"])[r["colecao"]]})
        rows=[x for cat in CATS for x in d[cat]]
        self.assertEqual(len(rows),36)
        self.assertEqual(len({x["id"] for x in rows}),36)
        self.assertTrue({x["referencia_id"] for x in rows}<={r["id"] for r in refs})
        for x in rows:
            self.assertIn(x["escopo"],d["escopos"])
            self.assertEqual(x["estatuto"],"alternativa_nao_adotada")
            self.assertFalse(any(x[k] for k in (
                "ocorreu","situacao_documentada","aprovacao_autoral",
                "efeito_mecanico","canon_aplicado")))
        self.assertEqual(len({q["id"] for q in d["perguntas_para_autor"]}),12)
        self.assertTrue(all(q["resposta_aprovada"] is None for q in d["perguntas_para_autor"]))
        self.assertEqual(len(get("dist/carcaca/creatures.json")),7)
        self.assertFalse(get("data/worldbuilding/rio-drakport-ciclo28.json")["revolta_drakport_ocorreu"])
    def test_export(self):
        d=get("data/worldbuilding/templo-lua-severina-ciclo29.json")
        self.assertEqual(d,get("dist/carcaca/moon-temple-severina.json"))
        ix=get("dist/carcaca/moon-temple-severina-indexes.json")
        for field in ("by_categoria","by_escopo","by_referencia","by_estatuto"):
            self.assertEqual(sum(len(v) for v in ix[field].values()),36)
        self.assertIn("22",ix["by_pagina"])
        self.assertEqual(len(ix["by_pagina"]["22"]),1)
if __name__=="__main__": unittest.main()
