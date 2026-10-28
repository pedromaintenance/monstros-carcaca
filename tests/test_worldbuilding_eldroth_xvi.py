"""Ciclo XVI: teste de integridade histórica e de limites editoriais do atlas."""
import json
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
def read(name):
    return json.loads((ROOT/name).read_text(encoding="utf-8"))

class OcupacaoEldrothXVI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.d=read("data/worldbuilding/eldroth-ocupacao-sylara-ciclo16.json")
        cls.prior=read("data/worldbuilding/eldroth-preconquista-ciclo15.json")
        cls.manuscript=read("fontes/autoria/hack-carcaca-dw-capitulo-i.paginas.json")
        cls.canon=read("dist/carcaca/creatures.json")

    def test_facts_not_promoted_and_scope_is_real(self):
        d=self.d
        self.assertFalse(d["aprovacao_autoral"])
        self.assertFalse(d["aplicar_ao_canon_automaticamente"])
        self.assertEqual(d["resumo"],{"mecanismos":8,"posicoes_sociais":6,
            "modelos_de_regime":3,"dilemas":4,"vinhetas":4,"politicas_confirmadas":0})
        self.assertEqual(d["regiao_id"],"regiao:eldroth")
        self.assertEqual(d["lugar_id"],"lugar:eldroth")
        self.assertEqual(len(self.canon),7)

    def test_every_earlier_practice_has_one_possible_pressure(self):
        src={x["id"] for x in self.prior["praticas"]}
        links=[x["pratica_xv_id"] for x in self.d["mecanismos"]]
        self.assertEqual(set(links),src)
        self.assertEqual(len(set(links)),len(links))
        pages={x["pagina"] for x in self.manuscript["paginas"]}
        for m in self.d["mecanismos"]:
            with self.subTest(mecanismo=m["id"]):
                self.assertFalse(m["politica_sylara_confirmada"])
                self.assertFalse(m["ocorreu"])
                self.assertIsNone(m["orgao_administrativo_confirmado"])
                self.assertIsNone(m["quantidade_confirmada"])
                self.assertTrue(m["consequencia_material_proposta"])
                self.assertTrue({x["pagina"] for x in m["fontes_contextuais"]}.issubset(pages))

    def test_three_governance_models_are_not_historical(self):
        self.assertEqual(len(self.d["modelos_de_regime"]),3)
        for alt in self.d["modelos_de_regime"]:
            self.assertEqual(alt["estado"],"alternativa_nao_adotada")
            self.assertFalse(alt["orgao_ou_politica_historica_confirmada"])

    def test_social_roles_are_not_npcs(self):
        self.assertEqual(len(self.d["posicoes_sociais"]),6)
        for role in self.d["posicoes_sociais"]:
            self.assertFalse(role["pessoa_especifica_confirmada"])
            self.assertIsNone(role["quantidade_confirmada"])

    def test_dilemmas_and_vignettes_do_not_change_campaign(self):
        mechanisms={x["id"] for x in self.d["mecanismos"]}
        roles={x["id"] for x in self.d["posicoes_sociais"]}
        for item in self.d["dilemas"]:
            self.assertFalse(item["ocorreu"])
            self.assertFalse(item["efeito_na_cronologia"])
            self.assertIn(item["mecanismo_id"],mechanisms)
            self.assertIn(item["posicao_id"],roles)
        for item in self.d["vinhetas"]:
            self.assertFalse(item["ocorreu"])
            self.assertFalse(item["novo_lugar_confirmado"])
            self.assertFalse(item["personagem_canonico_novo"])
            self.assertIn(item["mecanismo_id"],mechanisms)
        self.assertEqual(len(self.d["decisoes_para_autor"]),5)
        self.assertTrue(all(q["estado"]=="pendente" for q in self.d["decisoes_para_autor"]))

if __name__=="__main__":
    unittest.main()
