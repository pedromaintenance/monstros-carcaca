"""Teste integrado das oito fichas DW propostas e seus cálculos reprodutíveis."""
import json
from pathlib import Path
import unittest
from scripts.calcular_monstros_dw import calcular_ficha

ROOT = Path(__file__).resolve().parents[1]
def load(path):
    return json.loads((ROOT / path).read_text(encoding="utf-8"))

class FichasDungeonWorldXIII(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = load("data/propostas/eldroth-fichas-dw-ciclo13.json")
        cls.xii = load("data/propostas/eldroth-ecologia-monstruosa-dw.json")
        cls.canon = load("dist/carcaca/creatures.json")

    def test_oito_fichas_com_um_ser_sem_combater(self):
        fichas = self.data["fichas"]
        self.assertEqual(len(fichas), 8)
        self.assertEqual([f["ordem_de_revisao"] for f in fichas], list(range(1, 9)))
        self.assertEqual(sum(f["modo"] == "estatizado" for f in fichas), 7)
        self.assertEqual(sum(f["modo"] == "sem_estatisticas" for f in fichas), 1)
        self.assertFalse(self.data["aprovacao_autoral"])
        self.assertFalse(self.data["efetiva_canon"])

    def test_numeros_podem_ser_recalculados(self):
        expected = {
            "coruja-do-eco-emprestado": (12, 0, "d8-2"),
            "besouros-da-casca-riscada": (3, 1, "d4-2"),
            "cardos-que-bebem-cinza": (6, 0, "d4"),
            "micelio-das-vozes-partidas": (None, None, None),
            "cervo-de-galhos-invertidos": (16, 1, "d10+3"),
            "escrivao-da-folha-lacrada": (12, 0, "d8"),
            "andarilho-de-sepultura-negada": (16, 0, "d8"),
            "cao-de-esporos-do-limiar": (6, 1, "d8"),
        }
        for ficha in self.data["fichas"]:
            with self.subTest(ficha=ficha["nome"]):
                calculated = calcular_ficha(ficha["organizacao"]["proposta_dw"],
                                          ficha["modo"], ficha["decisoes"])
                self.assertEqual(calculated, ficha["ficha_dw"])
                slug = ficha["id"].removeprefix("ecologia-xiii:ficha:")
                stats = ficha["ficha_dw"]
                self.assertEqual((stats["pv"], stats["armadura"],
                                  stats["dano"]["expressao"] if stats["dano"] else None),
                                 expected[slug])

    def test_invento_novo_nao_altera_origem(self):
        origens = {c["id"]: c for c in self.xii["criaturas"]}
        self.assertEqual(set(origens), {f["criatura_origem_id"] for f in self.data["fichas"]})
        for f in self.data["fichas"]:
            origem = origens[f["criatura_origem_id"]]
            self.assertEqual(f["instinto"], origem["dungeon_world"]["instinto"])
            self.assertEqual([m["nome"] for m in f["movimentos"]],
                             [m["nome"] for m in origem["dungeon_world"]["movimentos"]])
            self.assertFalse(f["ocorrencia_confirmada"])
            self.assertFalse(f["aprovacao_autoral"])
        self.assertEqual(len(self.canon), 7)
        self.assertTrue({f["criatura_origem_id"] for f in self.data["fichas"]}.isdisjoint(
            {c["id"] for c in self.canon}))

    def test_monstro_sem_combate_e_declarado_sem_stats(self):
        m = next(f for f in self.data["fichas"] if f["modo"] == "sem_estatisticas")
        self.assertIn("Micélio", m["nome"])
        self.assertIsNone(m["ficha_dw"]["pv"])
        self.assertIsNone(m["ficha_dw"]["dano"])
        self.assertIsNone(m["ficha_dw"]["armadura"])

    def test_exemplos_independentes_do_calculo(self):
        base = {"porte":"grande", "defesa":"escamas", "destaques":["forca","magia"],
                "ataque":{"nome":"Garras", "opcoes":["distancia"]},
                "tracos":["nao_biologico","ardiloso"],
                "justificativa":"Teste de fórmula"}
        res = calcular_ficha("grupo","estatizado",base)
        self.assertEqual(res["pv"],14)
        self.assertEqual(res["armadura"],2)
        self.assertEqual(res["dano"]["expressao"],"d6+3")
        self.assertIn("perto",res["ataque"]["alcances"])
        self.assertIn("magico",res["tags"])
        with self.assertRaises(ValueError):
            calcular_ficha("grupo","sem_estatisticas",base)
        with self.assertRaises(ValueError):
            calcular_ficha("grupo","estatizado",{**base,"destaques":["magia","magia"]})

if __name__ == "__main__":
    unittest.main()
