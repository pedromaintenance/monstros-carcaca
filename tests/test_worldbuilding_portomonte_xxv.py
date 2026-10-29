"""Ciclo XXV: rastreabilidade, alternativas exclusivas não adotadas e ausência de mutação."""
import json, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def load(p):return json.loads((ROOT/p).read_text(encoding="utf8"))
CATS=("modelos_de_governo","etapas_de_trabalho","relacoes_sociais",
      "garantias_civis","dilemas","vinhetas")
class TestPortomonteXXV(unittest.TestCase):
    def test_integridade(self):
        d=load("data/worldbuilding/portomonte-templo-governo-ciclo25.json")
        self.assertEqual(d["contagens"],{"fatos":8,"referencias":12,"perguntas":12,
            "modelos_de_governo":4,"etapas_de_trabalho":8,"relacoes_sociais":8,
            "garantias_civis":6,"dilemas":6,"vinhetas":4})
        self.assertIsNone(d["modelo_de_governo_adotado"])
        self.assertIsNone(d["agua_domestica_potavel_confirmada"])
        self.assertFalse(d["efeito_canonico_automatico"])
        rows=[r for cat in CATS for r in d[cat]]
        self.assertEqual(len(rows),36)
        self.assertEqual(len(set(x["id"] for x in rows)),36)
        self.assertTrue(all(not x["aprovacao_autoral"] and not x["ocorreu"]
          and not x["situacao_documentada"] and not x["efeito_mecanico"]
          and x["estatuto"]=="alternativa_nao_adotada" for x in rows))
        refs=d["referencias_rastreaveis"]
        self.assertEqual(len(refs),12)
        self.assertEqual(len({r["id"] for r in refs}),12)
        for ref in refs:
            self.assertIn(ref["id"],{x["id"] for x in load(ref["arquivo"])[ref["colecao"]]})
        self.assertTrue(set(x["referencia_id"] for x in rows)<={r["id"] for r in refs})
        self.assertTrue(all(q["resposta_aprovada"] is None for q in d["perguntas_para_autor"]))
        self.assertEqual(len(load("dist/carcaca/creatures.json")),7)
    def test_exportacao_deterministica(self):
        d=load("data/worldbuilding/portomonte-templo-governo-ciclo25.json")
        self.assertEqual(d,load("dist/carcaca/portomonte-temple-civic.json"))
        ix=load("dist/carcaca/portomonte-temple-civic-indexes.json")
        self.assertEqual(sum(len(ids) for ids in ix["by_categoria"].values()),36)
        self.assertEqual(sum(len(ids) for ids in ix["by_referencia"].values()),36)
        self.assertIn("dependencia:portomonte-purificacao",ix["by_referencia"])
if __name__=="__main__":unittest.main()
