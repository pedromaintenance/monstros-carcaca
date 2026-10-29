"""XXVI: integridade de matriz editorial, ordem acíclica e nenhuma canonização."""
import json,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def get(p):return json.loads((ROOT/p).read_text(encoding="utf8"))
class TestPortomonteXXVI(unittest.TestCase):
    def test_matriz_e_dependencias(self):
        d=get("data/worldbuilding/revisao-autoral-portomonte-ciclo26.json")
        old=get(d["fonte_matriz"])
        self.assertEqual(d["contagens"],{"etapas":4,"decisoes":12,"opcoes":38,
           "guardas":12,"impactos":10,"pendentes":12,"aprovadas":0,"impactos_aplicados":0})
        self.assertFalse(d["aprovacao_autoral"])
        self.assertFalse(d["mutacao_canonica_automatica"])
        self.assertIsNone(d["modelo_governo_aprovado"])
        self.assertIsNone(d["agua_potavel_aprovada"])
        self.assertIsNone(d["operacao_ritual_aprovada"])
        self.assertFalse(any(d[k] for k in ("alterou_atlas","alterou_criaturas","alterou_regras_dw")))
        rows=d["decisoes"]
        ids={r["id"] for r in rows}
        self.assertEqual(len(ids),12)
        questions={q["id"] for q in old["perguntas_para_autor"]}
        refs={x["id"] for cat in ("modelos_de_governo","etapas_de_trabalho",
          "relacoes_sociais","garantias_civis","dilemas","vinhetas") for x in old[cat]}
        option_ids=[x["id"] for q in rows for x in q["opcoes"]]
        self.assertEqual(len(set(option_ids)),38)
        self.assertEqual(len(option_ids),38)
        for r in rows:
            self.assertIn(r["origem_pergunta_id"],questions)
            self.assertTrue(set(r["referencias_de_proposta"])<=refs)
            self.assertTrue(set(r["depende_de"])<=ids)
            self.assertNotIn(r["id"],r["depende_de"])
            self.assertIsNone(r["opcao_escolhida_id"])
            self.assertIsNone(r["texto_autoral_aprovado"])
            self.assertIsNone(r["fonte_da_aprovacao"])
            self.assertIsNone(r["data_da_aprovacao"])
            self.assertFalse(r["canon_aplicado"])
            self.assertFalse(r["aprovacao_autoral"])
            for o in r["opcoes"]:
                if o["modelo_xxv_id"] is not None:
                    self.assertIn(o["modelo_xxv_id"],refs)
                self.assertFalse(o["aprovacao_autoral"])
                self.assertFalse(o["canon_aplicado"])
        byid={r["id"]:r for r in rows}
        def visit(cur,active,done):
            self.assertNotIn(cur,active,"Ciclo XXVI: ciclo de dependências.")
            if cur in done:return
            for parent in byid[cur]["depende_de"]:visit(parent,active|{cur},done)
            done.add(cur)
        visited=set()
        for id in ids:visit(id,set(),visited)
        for stage in d["etapas_de_revisao"]:
            self.assertTrue(set(stage["decisoes"])<=ids)
            self.assertFalse(stage["concluida"])
        for impact in d["impactos_condicionais"]:
            self.assertTrue(set(impact["depende_de"])<=ids)
            self.assertTrue((ROOT/impact["arquivo_alvo_condicional"]).is_file())
            self.assertFalse(impact["aplicado"])
            self.assertFalse(impact["aprovacao_autoral"])
        self.assertEqual(len(get("dist/carcaca/creatures.json")),7)
    def test_exportacao_e_indices(self):
        d=get("data/worldbuilding/revisao-autoral-portomonte-ciclo26.json")
        self.assertEqual(d,get("dist/carcaca/portomonte-authorial-review.json"))
        ix=get("dist/carcaca/portomonte-authorial-review-indexes.json")
        self.assertEqual(sum(map(len,ix["by_prioridade"].values())),12)
        self.assertEqual(sum(map(len,ix["by_pergunta"].values())),12)
        self.assertEqual(sum(map(len,ix["by_depende_de"].values())),
          sum(map(lambda q:len(q["depende_de"]),d["decisoes"])))
        self.assertEqual(sum(map(len,ix["by_decisao"].values())),38)
if __name__=="__main__":unittest.main()
