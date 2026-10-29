"""Ciclo XXVIII — Drakport, rio, tributação, agência e fontes."""
import json, unittest
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
def load(path):
    return json.loads((ROOT/path).read_text(encoding="utf-8"))
CATS=("trabalho_cotidiano","servidao_e_agencia","tributos_e_passagens",
      "informacao_e_ritos","redes_de_resistencia","vinhetas")
class TestRioDrakportXXVIII(unittest.TestCase):
    def test_integridade(self):
        d=load("data/worldbuilding/rio-drakport-ciclo28.json")
        self.assertEqual(d["contagens"],{"fatos":12,"referencias":14,"propostas":40,
            "perguntas":10,"trabalho_cotidiano":10,"servidao_e_agencia":8,
            "tributos_e_passagens":7,"informacao_e_ritos":6,
            "redes_de_resistencia":5,"vinhetas":4})
        self.assertFalse(d["revolta_drakport_ocorreu"])
        self.assertFalse(d["balanco_de_pessoas_como_recurso"])
        self.assertIsNone(d["regiao_normalizada_drakport"])
        self.assertIsNone(d["regiao_normalizada_rio_medio"])
        self.assertIsNone(d["participacao_ironwood_na_revolta_confirmada"])
        self.assertTrue(all(d[k] is False for k in ("aprovacao_autoral",
            "efeito_canonico_automatico","alteracao_criaturas",
            "alteracao_atlas_factual","alteracao_regras_dw")))
        pages={p["pagina"] for p in load(d["fonte_manuscrito"])["paginas"]}
        self.assertTrue(all(f["pagina"] in pages and f["pagina"] in (4,7,9,11)
            and not f["novo_canon"] for f in d["fatos_documentados"]))
        refs=d["referencias_rastreaveis"]
        self.assertEqual(len({r["id"] for r in refs}),14)
        for r in refs:
            self.assertIn(r["id"],{e["id"] for e in load(r["arquivo"])[r["colecao"]]})
        proposals=[p for cat in CATS for p in d[cat]]
        self.assertEqual(len(proposals),40)
        self.assertEqual(len({p["id"] for p in proposals}),40)
        self.assertTrue({p["referencia_id"] for p in proposals}<={r["id"] for r in refs})
        self.assertTrue(all(p["escopo"] in d["escopos"]
            and p["estado"]=="proposta_cultural_nao_canonica"
            and not p["ocorreu"] and not p["situacao_documentada"]
            and not p["aprovacao_autoral"] and not p["canon_aplicado"] for p in proposals))
        self.assertEqual(len({q["id"] for q in d["perguntas_para_autor"]}),10)
        self.assertTrue(all(q["resposta_aprovada"] is None for q in d["perguntas_para_autor"]))
        self.assertEqual(len(load("dist/carcaca/creatures.json")),7)
    def test_export(self):
        d=load("data/worldbuilding/rio-drakport-ciclo28.json")
        self.assertEqual(d,load("dist/carcaca/river-drakport-social.json"))
        ix=load("dist/carcaca/river-drakport-social-indexes.json")
        for field in ("by_categoria","by_escopo","by_referencia","by_estado"):
            self.assertEqual(sum(len(v) for v in ix[field].values()),40)
        self.assertIn("11",ix["by_pagina"])
        self.assertEqual(len(ix["by_pagina"]["11"]),1)
if __name__=="__main__":
    unittest.main()
