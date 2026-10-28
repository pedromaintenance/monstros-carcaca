"""Testes de integração com os dados reais do ciclo XII."""
from pathlib import Path
import json
import unittest

ROOT=Path(__file__).resolve().parents[1]

def load(path):
    return json.loads((ROOT/path).read_text(encoding="utf-8"))

class EcologiaMonstruosaXII(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data=load("data/propostas/eldroth-ecologia-monstruosa-dw.json")
        cls.xi=load("data/propostas/ironwood-eldroth-resistencia-hack.json")
        cls.taxonomia={x["id"] for x in load("data/taxonomia_carcaca.json")["tipos"]}
        cls.curadas=load("dist/carcaca/creatures.json")

    def test_contagens_e_identidades(self):
        grupos={"criaturas":8,"encontros":6,"pressoes":4,"frentes":2}
        self.assertEqual(self.data["contagens"],grupos)
        registros=[x for cat in grupos for x in self.data[cat]]
        self.assertEqual(len({x["id"] for x in registros}),20)
        self.assertFalse(self.data["aprovacao_autoral"])
        self.assertFalse(self.data["efeito_automatico_no_canon"])

    def test_criaturas_sem_ocorrencias_e_sem_fichas_mecanicas_inventadas(self):
        cenas={x["id"] for x in self.xi["cenas"]}
        lugares={x["id"] for x in self.xi["lugares"]}
        for c in self.data["criaturas"]:
            self.assertIn(c["tipo_carcaca_proposto"],self.taxonomia)
            self.assertIn(c["vinculo_cena_anterior"],cenas)
            self.assertIn(c["localizacao_proposta"]["local_proposto_id"],lugares)
            self.assertFalse(c["ocorrencia_confirmada"])
            self.assertEqual(len(c["dungeon_world"]["movimentos"]),3)
            self.assertTrue(c["dungeon_world"]["instinto"])
            self.assertTrue(all(c["dungeon_world"]["estatisticas"][k] is None
                                for k in ("pv","armadura","dano","nd_dnd")))
            if c["localizacao_proposta"]["escopo"]=="ironwood":
                self.assertIsNone(c["localizacao_proposta"]["regiao_canonica_de_referencia"])

    def test_encontros_pressoes_frentes_nao_ocorreram(self):
        ids={x["id"] for x in self.data["criaturas"]}
        encontros={x["id"] for x in self.data["encontros"]}
        for kind in ("encontros","pressoes","frentes"):
            for row in self.data[kind]:
                self.assertFalse(row["ocorreu"])
                self.assertTrue(set(row["criaturas_ids"]).issubset(ids))
        for e in self.data["encontros"]:
            self.assertEqual(len(e["escolhas_sem_combater"]),3)
        for frente in self.data["frentes"]:
            self.assertEqual(frente["pressagios_realizados"],[])
            self.assertTrue(set(frente["encontros_ids"]).issubset(encontros))

    def test_catalogo_canonico_permanece_separado(self):
        propostas={x["id"] for x in self.data["criaturas"]}
        existentes={x["id"] for x in self.curadas}
        self.assertEqual(len(existentes),7)
        self.assertTrue(propostas.isdisjoint(existentes))

if __name__=="__main__":
    unittest.main()
