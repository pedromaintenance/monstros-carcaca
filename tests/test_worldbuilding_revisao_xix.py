"""Ciclo XIX: inventário autoral não é aprovação, com referências e dependências reais."""
import json, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def read(path):return json.loads((ROOT/path).read_text(encoding="utf-8"))

class RevisaoAtlasXIX(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data=read("data/worldbuilding/revisao-autoral-atlas-ciclo19.json")
        cls.sources={
            "XIV":read("data/worldbuilding/eldroth-ironwood-vandar-ciclo14.json"),
            "XV":read("data/worldbuilding/eldroth-preconquista-ciclo15.json"),
            "XVI":read("data/worldbuilding/eldroth-ocupacao-sylara-ciclo16.json"),
            "XVII":read("data/worldbuilding/vandar-politica-dos-mortos-ciclo17.json"),
            "XVIII":read("data/worldbuilding/ironwood-sociedade-resistencia-ciclo18.json")
        }
        cls.canon=read("dist/carcaca/creatures.json")

    def test_counts_without_approval(self):
        d=self.data
        self.assertEqual(d["contagens"]["candidatos"],103)
        self.assertEqual(d["contagens"]["candidatos_por_ciclo"],
            {"XIV":42,"XV":28,"XVI":11,"XVII":11,"XVIII":11})
        self.assertEqual(len(d["decisoes"]),20)
        self.assertEqual(len(d["guardas"]),10)
        self.assertFalse(d["aprovacao_autoral"])
        self.assertFalse(d["mutacao_canonica_automatica"])
        self.assertEqual(d["contagens"]["mudancas_canonicas"],0)
        self.assertEqual(len(self.canon),7)

    def test_references_point_to_real_dossiers(self):
        p={x["ciclo"]:x["arquivo"] for x in self.data["dossies"]}
        for item in self.data["candidatos"]:
            src=item["referencia"]
            cy=item["ciclo"]
            with self.subTest(candidate=item["id"]):
                self.assertEqual(src["arquivo"],p[cy])
                referenced=next(x for x in self.sources[cy][src["colecao"]]
                    if x["id"]==src["id"])
                self.assertFalse(item["homologado"])
                self.assertEqual(item["estado"],"nao_aprovado")
                ix=item["indice_opcao"]
                if ix is not None:
                    choices=(referenced["decisoes_autorais_pendentes"] if cy=="XIV"
                        else referenced["alternativas"])
                    self.assertLess(ix,len(choices))

    def test_decisions_have_no_implicit_choice(self):
        items=self.data["decisoes"]
        ids={d["id"] for d in items}
        self.assertEqual(len(ids),len(items))
        for d in items:
            self.assertIsNone(d["escolha_aprovada"])
            self.assertFalse(d["aprovacao_autoral"])
            self.assertFalse(d["publicar_canon"])
            self.assertEqual(d["estado"],"pendente")
            self.assertTrue(set(d["pre_requisitos"]).issubset(ids))
        self.assertFalse(self.data["protocolo"]["silencio_autoriza"])
        self.assertTrue(self.data["protocolo"]["aprovacao_explicita_necessaria"])

    def test_lacunas_and_continuity(self):
        self.assertEqual(len(self.data["lacunas"]),5)
        self.assertTrue(all(x["valor"] is None for x in self.data["lacunas"]))
        self.assertTrue(all(not x["nova_aprovacao"] for x in self.data["guardas"]))
        sources=[a["id"] for a in self.data["candidatos"]]
        self.assertEqual(len(sources),len(set(sources)))

if __name__=="__main__":unittest.main()
