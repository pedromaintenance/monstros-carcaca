"""Ciclo XVII: Vandar permanece lugar de memória, sem eventos adicionados."""
import json
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
def load(path):
    return json.loads((ROOT/path).read_text(encoding="utf-8"))

class WorldbuildingVandarXVII(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.d=load("data/worldbuilding/vandar-politica-dos-mortos-ciclo17.json")
        cls.region=load("data/regioes_carcaca.json")
        cls.places=load("data/lugares_carcaca.json")
        cls.canon=load("dist/carcaca/creatures.json")

    def test_nothing_promoted(self):
        d=self.d
        self.assertFalse(d["aprovacao_autoral"])
        self.assertFalse(d["efeito_canonico_automatico"])
        self.assertEqual(d["lugar_id"],"lugar:vandar")
        self.assertEqual(d["governante_atual_documentado"],"Lorde Damaris Blackthorn")
        self.assertTrue(all(v is None for v in d["linha_do_tempo"].values()))
        self.assertEqual(len(self.canon),7)

    def test_counts_and_ids(self):
        d=self.d
        count={"fases":3,"tecidos_urbanos":8,"modalidades_de_prova":5,
          "situacoes_de_morte":4,"papeis_sociais":6,"modelos_do_dominio":3,
          "vinhetas":4,"decisoes_pendentes":8}
        self.assertEqual(d["resumo"],count)
        groups=["fases","tecidos_urbanos","modalidades_de_prova",
          "situacoes_de_morte","papeis_sociais","modelos_do_dominio",
          "vinhetas","decisoes_para_autor"]
        ids=[item["id"] for group in groups for item in d[group]]
        self.assertEqual(len(ids),41)
        self.assertEqual(len(set(ids)),41)

    def test_nothing_too_specific(self):
        for urban in self.d["tecidos_urbanos"]:
            self.assertFalse(urban["instituicao_urbana_confirmada"])
            self.assertIsNone(urban["edificio_confirmado"])
            self.assertIsNone(urban["nome_de_morador_confirmado"])
            self.assertIsNone(urban["quantidade_confirmada"])
        for p in self.d["modalidades_de_prova"]:
            self.assertFalse(p["arquivo_ou_rito_efetivamente_descoberto"])
            self.assertFalse(p["prova_conclusiva"])
        for p in self.d["papeis_sociais"]:
            self.assertFalse(p["personagem_confirmado"])
            self.assertIsNone(p["onde_mora_confirmado"])

    def test_necromancy_does_not_prove_identity(self):
        for status in self.d["situacoes_de_morte"]:
            self.assertFalse(status["regimento_aprovado"])
            self.assertFalse(status["caso_real_atestado"])
        for model in self.d["modelos_do_dominio"]:
            self.assertEqual(model["estado"],"alternativa_nao_adotada")
            self.assertFalse(model["configuracao_confirmada"])

    def test_no_historical_scene(self):
        urban_ids={x["id"] for x in self.d["tecidos_urbanos"]}
        for v in self.d["vinhetas"]:
            self.assertIn(v["tecido_urbano_id"],urban_ids)
            self.assertFalse(v["ocorreu"])
            self.assertFalse(v["novo_objeto_historico_confirmado"])
            self.assertFalse(v["novo_personagem_confirmado"])
        for q in self.d["decisoes_para_autor"]:
            self.assertEqual(q["estado"],"pendente_de_aprovacao_autoral")

if __name__=="__main__":
    unittest.main()
