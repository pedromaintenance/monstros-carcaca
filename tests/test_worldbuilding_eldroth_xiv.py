"""Teste sobre as fontes e os eixos do atlas histórico-cultural XIV."""
import json
from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]
def read(name):
    return json.loads((ROOT/name).read_text(encoding="utf-8"))

class AtlasCulturalXIV(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data=read("data/worldbuilding/eldroth-ironwood-vandar-ciclo14.json")
        cls.places=read("data/lugares_carcaca.json")["lugares"]
        cls.pages=read("fontes/autoria/hack-carcaca-dw-capitulo-i.paginas.json")["paginas"]

    def test_estrutura_autoral(self):
        d=self.data
        self.assertEqual(d["resumo"],{"areas":3,"marcos":6,"eixos":14,"alternativas":42})
        self.assertFalse(d["aprovacao_autoral"])
        self.assertFalse(d["efeito_automatico_no_canon"])
        self.assertEqual(len({e["id"] for e in d["eixos"]}),14)
        self.assertEqual(sum(len(e["decisoes_autorais_pendentes"]) for e in d["eixos"]),42)
        self.assertTrue(all(x["estado"]=="alternativa_nao_adotada"
                            for e in d["eixos"] for x in e["decisoes_autorais_pendentes"]))

    def test_fronteiras_geograficas(self):
        areas={x["id"]:x for x in self.data["areas"]}
        self.assertIsNone(areas["worldbuilding-xiv:area:ironwood"]["referencia_atlas"])
        self.assertIsNone(areas["worldbuilding-xiv:area:ironwood"]["lugar_atlas"])
        place_ids={x["id"] for x in self.places}
        for key in ("eldroth","vandar"):
            a=areas["worldbuilding-xiv:area:"+key]
            self.assertEqual(a["referencia_atlas"],"regiao:eldroth")
            self.assertIn(a["lugar_atlas"],place_ids)

    def test_cronologia_nao_inventa_datas(self):
        anos=[x["ano_ec"] for x in self.data["marcos"]]
        self.assertEqual(anos,[501,666,875,910,912,None])
        self.assertEqual(self.data["marcos"][-1]["estado"],"sem_data_confirmada")

    def test_cada_eixo_tem_fontes_e_revisao(self):
        pages={x["pagina"] for x in self.pages}
        areas={a["id"] for a in self.data["areas"]}
        for e in self.data["eixos"]:
            with self.subTest(eixo=e["id"]):
                self.assertIn(e["area_id"],areas)
                self.assertTrue(e["fatos_textuais"])
                self.assertTrue(e["camada_manuscrito"])
                self.assertTrue(all(x["fonte"]=="ambientacao" for x in e["fatos_textuais"]))
                self.assertTrue(all(x["status"]=="afirmado_no_rascunho_sem_promocao"
                                and set(x["paginas"]).issubset(pages) for x in e["camada_manuscrito"]))
                self.assertGreaterEqual(len(e["perguntas_abertas"]),2)
                self.assertEqual(len(e["decisoes_autorais_pendentes"]),3)

if __name__=="__main__":
    unittest.main()
