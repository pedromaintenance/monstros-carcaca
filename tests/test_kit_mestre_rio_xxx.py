"""Ciclo XXX — relações entre fonte, evidência, cenas e consequências."""
import json,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def get(p):return json.loads((ROOT/p).read_text(encoding="utf8"))
class TestKitMestreXXX(unittest.TestCase):
    def test_integridade(self):
        d=get("data/mesa/rio-ancestral-kit-mestre-ciclo30.json")
        self.assertEqual(d["contagens"],{"fatos":6,"referencias":16,"procedimentos":6,
            "evidencias":12,"cenas":8,"consequencias":6,"guardas":4,
            "perguntas_abertas":8})
        for k in ("aprovacao_autoral","mutacao_canonica","modificacao_regras_dw",
                  "revolta_drakport_ocorreu","rito_lunar_definido"):
            self.assertIs(d[k],False)
        self.assertEqual(d["eventos_ocorridos"],[])
        self.assertEqual(d["resultados_sessoes"],[])
        page_set={p["pagina"] for p in get(d["fonte_manuscrito"])["paginas"]}
        for f in d["fatos_base"]:
            self.assertIn(f["pagina"],page_set)
            self.assertIn(f["pagina"],(4,7,11,22))
            self.assertIs(f["aplicou_novo_canon"],False)
        refs=d["referencias_rastreaveis"]
        self.assertEqual(len({r["id"] for r in refs}),16)
        for r in refs:
            self.assertIn(r["id"],{x["id"] for x in get(r["arquivo"])[r["colecao"]]})
        linked={r["id"] for r in refs}
        procs={x["id"] for x in d["procedimentos"]}
        evidences={x["id"] for x in d["evidencias"]}
        consequences={x["id"] for x in d["consequencias"]}
        all_entries=[*d["fatos_base"],*d["procedimentos"],*d["evidencias"],
                     *d["cenas"],*d["consequencias"],*d["guardas"],*d["perguntas_abertas"]]
        self.assertEqual(len({x["id"] for x in all_entries}),len(all_entries))
        for cat in ("procedimentos","evidencias","consequencias","guardas"):
            for x in d[cat]:self.assertIn(x["referencia_id"],linked)
        for x in d["cenas"]:
            self.assertIn(x["procedimento_id"],procs)
            self.assertIn(x["consequencia_id"],consequences)
            self.assertEqual(len(x["evidencias_sugeridas"]),2)
            self.assertTrue(set(x["evidencias_sugeridas"])<=evidences)
            self.assertFalse(x["ocorreu"])
            self.assertFalse(x["desfecho_fixo"])
        for x in d["evidencias"]:
            self.assertFalse(x["aconteceu_em_campanha"])
            if x["tipo"]=="documentado":self.assertIn(x["pagina"],page_set)
            else:self.assertIsNone(x["pagina"])
        self.assertTrue(all(not x["gatilho_disparado"] and not x["efeito_aplicado"]
                            for x in d["consequencias"]))
        self.assertEqual(len(get("dist/carcaca/creatures.json")),7)
        self.assertFalse(get("data/worldbuilding/rio-drakport-ciclo28.json")["revolta_drakport_ocorreu"])
        self.assertIsNone(get("data/worldbuilding/templo-lua-severina-ciclo29.json")["divindade_titular_confirmada"])
    def test_export(self):
        d=get("data/mesa/rio-ancestral-kit-mestre-ciclo30.json")
        self.assertEqual(d,get("dist/carcaca/river-gm-toolkit.json"))
        ix=get("dist/carcaca/river-gm-toolkit-indexes.json")
        self.assertEqual(sum(len(v) for v in ix["by_tipo_evidencia"].values()),12)
        self.assertEqual(sum(len(v) for v in ix["by_referencia"].values()),28)
        self.assertEqual(len(ix["by_cena"]),8)
        self.assertIn("11",ix["by_pagina"])
if __name__=="__main__":unittest.main()
