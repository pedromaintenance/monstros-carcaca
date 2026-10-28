"""Ciclo XV: worldbuilding rastreável sem preencher a história à força."""
import json
import unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def read(name):
    return json.loads((ROOT/name).read_text(encoding="utf-8"))

class EldrothXV(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.d=read("data/worldbuilding/eldroth-preconquista-ciclo15.json")
        cls.xiv=read("data/worldbuilding/eldroth-ironwood-vandar-ciclo14.json")
        cls.source=read("fontes/autoria/hack-carcaca-dw-capitulo-i.paginas.json")
        cls.places=read("data/lugares_carcaca.json")
        cls.curated=read("dist/carcaca/creatures.json")

    def test_estrutura_e_fontes(self):
        d=self.d
        self.assertEqual(d["contagens"],{
          "fases":4,"praticas":8,"pactos":4,"ciclos_materiais":4,
          "vinhetas":4,"alternativas_em_aberto":24})
        self.assertFalse(d["aprovacao_autoral"])
        self.assertFalse(d["aplicar_ao_canon_automaticamente"])
        self.assertEqual(d["referencia_regional"],"regiao:eldroth")
        self.assertIn(d["referencia_lugar"],{p["id"] for p in self.places["lugares"]})
        self.assertEqual(len(self.curated),7)

    def test_intervals_sem_data_de_fundacao(self):
        self.assertEqual([(x["inicio_ec"],x["fim_ec"]) for x in self.d["fases"]],
                         [(None,500),(501,665),(666,874),(875,875)])
        self.assertFalse(self.d["fases"][0]["marco_acontecido"])
        self.assertTrue(all(x["paginas"] for x in self.d["fases"]))

    def test_todos_os_costumes_sao_opcionais(self):
        pages={p["pagina"] for p in self.source["paginas"]}
        old={x["id"] for x in self.xiv["eixos"]}
        practices=self.d["praticas"]
        pids={x["id"] for x in practices}
        self.assertEqual(len(pids),8)
        for p in practices:
            with self.subTest(p=p["nome_editorial"]):
                self.assertFalse(p["existencia_historica_confirmada"])
                self.assertFalse(p["ritual_observado"])
                self.assertTrue(set(p["eixos_xiv"]).issubset(old))
                self.assertEqual(len(p["alternativas"]),3)
                self.assertTrue(all(a["estado"]=="nao_escolhida" for a in p["alternativas"]))
                self.assertTrue(set(a["pagina"] for a in p["fontes_ancora"]).issubset(pages))
                self.assertTrue(p["vida_cotidiana"] and p["tensao_interna"])
        for pack in ("pactos","ciclos_materiais","vinhetas"):
            for e in self.d[pack]:
                self.assertTrue(set(e["praticas_associadas"]).issubset(pids))

    def test_nenhum_pacto_foi_assinado_nem_circulacao_confirmada(self):
        for p in self.d["pactos"]:
            self.assertFalse(p["vigente"])
            self.assertFalse(p["assinado"])
            self.assertFalse(p["aplicado_a_lugar_especifico"])
        for c in self.d["ciclos_materiais"]:
            self.assertIsNone(c["volume_confirmado"])
            self.assertIsNone(c["periodicidade_confirmada"])
            self.assertIsNone(c["localizacao_confirmada"])
            self.assertFalse(c["fluxo_logistico_confirmado"])

    def test_vinhetas_e_decisoes_nao_sao_eventos(self):
        for v in self.d["vinhetas"]:
            self.assertFalse(v["ocorreu"])
            self.assertFalse(v["lugar_historico_confirmado"])
            self.assertFalse(v["personagem_canonico_novo"])
        self.assertEqual(len(self.d["questoes_de_revisao_autoral"]),5)
        self.assertTrue(all(x["estado"]=="pendente" for x in self.d["questoes_de_revisao_autoral"]))

if __name__=="__main__":
    unittest.main()
