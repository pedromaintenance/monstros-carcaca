"""Testes de proveniência e exportação do Ciclo XXIV."""
import json, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def load(p):return json.loads((ROOT/p).read_text(encoding="utf-8"))
CATS=("vida_domestica","trabalhos","saberes","circulacao","tensoes_civis","vinhetas")
class CostaSulXXIV(unittest.TestCase):
    def test_referencias_e_estado(self):
        d=load("data/worldbuilding/costa-sul-vida-civil-ciclo24.json")
        self.assertEqual(d["contagens"]["propostas"],36)
        self.assertFalse(d["aprovacao_autoral"])
        self.assertFalse(d["efeito_canonico_automatico"])
        self.assertEqual(d["lugares_canonicos_adicionados"],0)
        self.assertIsNone(d["agua_potavel_domestica_confirmada"])
        refs=d["referencias_existentes"]
        self.assertEqual(len(refs),13)
        for r in refs:self.assertIn(r["id"],{i["id"] for i in load(r["arquivo"])[r["colecao"]]})
        props=[v for cat in CATS for v in d[cat]]
        self.assertEqual(len(props),36)
        self.assertEqual(len({p["id"] for p in props}),36)
        self.assertTrue(all(not p["ocorreu"] and not p["aprovacao_autoral"]
            and not p["situacao_documentada"] for p in props))
        self.assertTrue(all(q["resposta_aprovada"] is None for q in d["perguntas_para_autor"]))
        self.assertEqual(len(load("dist/carcaca/creatures.json")),7)
    def test_determinismo(self):
        self.assertEqual(load("data/worldbuilding/costa-sul-vida-civil-ciclo24.json"),
                         load("dist/carcaca/costa-sul-civil-life.json"))
        ix=load("dist/carcaca/costa-sul-civil-life-indexes.json")
        self.assertEqual(sum(len(v) for v in ix["by_categoria"].values()),36)
        self.assertIn("costa-sul:espaco:altares",ix["by_referencia"])
if __name__=="__main__":unittest.main()
