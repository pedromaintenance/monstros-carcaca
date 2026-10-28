"""Ciclo XVIII: validar worldbuilding de Ironwood sem adicionar comandos, lugares ou eventos."""
import json
import unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def load(path): return json.loads((ROOT/path).read_text(encoding="utf-8"))

class IronwoodXVIII(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.d=load("data/worldbuilding/ironwood-sociedade-resistencia-ciclo18.json")
        cls.places=load("data/lugares_carcaca.json")
        cls.regions=load("data/regioes_carcaca.json")
        cls.creatures=load("dist/carcaca/creatures.json")
    def test_count_and_identity(self):
        d=self.d
        self.assertEqual(d["contagens"],{"eixos":8,"modelos_governanca":3,
            "relacoes_diplomaticas":4,"circuitos_de_cuidado":4,"dilemas":4,"vinhetas":4,"decisoes":8})
        self.assertFalse(d["aprovacao_autoral"])
        self.assertFalse(d["efeito_canonico_automatico"])
        self.assertEqual(d["lideranca_militar_documentada"],"Elara Stormoak")
        self.assertIsNone(d["id_lugar_geografico"])
        self.assertIsNone(d["id_regiao_geografica"])
        self.assertEqual(len(self.creatures),7)
    def test_no_routed_map_invented(self):
        self.assertNotIn("lugar:ironwood",{x["id"] for x in self.places["lugares"]})
        self.assertNotIn("regiao:ironwood",{x["id"] for x in self.regions["regioes"]})
        for c in self.d["circuitos_de_cuidado"]:
            self.assertIsNone(c["volume_confirmado"])
            self.assertIsNone(c["local_confirmado"])
            self.assertFalse(c["rota_operacional_confirmada"])
    def test_decisions_not_governments(self):
        self.assertEqual(len(self.d["modelos_de_governanca"]),3)
        self.assertTrue(all(not x["instituicao_confirmada"]
            and x["autoridade_civil_confirmada"] is None for x in self.d["modelos_de_governanca"]))
        self.assertTrue(all(not x["tratado_assinado"]
            and not x["subordinacao_confirmada"]
            and x["fluxo_quantificado"] is None for x in self.d["relacoes_diplomaticas"]))
        self.assertTrue(all(not x["instituicao_documentada"] for x in self.d["eixos_sociais"]))
    def test_no_historical_events(self):
        axes={x["id"] for x in self.d["eixos_sociais"]}
        models={x["id"] for x in self.d["modelos_de_governanca"]}
        self.assertTrue(all(x["eixo_id"] in axes and x["modelo_id"] in models
            and not x["ocorreu"] for x in self.d["dilemas"]))
        self.assertTrue(all(x["eixo_id"] in axes and not x["ocorreu"]
            and not x["personagem_canonico_criado"] for x in self.d["vinhetas"]))
        self.assertEqual(len(self.d["decisoes_para_autor"]),8)
        self.assertTrue(all(q["estado"]=="pendente_de_aprovacao_autoral"
            for q in self.d["decisoes_para_autor"]))

if __name__=="__main__": unittest.main()
