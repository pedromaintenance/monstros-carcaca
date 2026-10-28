"""Ciclo XX: a expansão de Grama-Cortada não cria eventos, leis ou lugares novos."""
import json, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def get(path):return json.loads((ROOT/path).read_text(encoding="utf8"))

class GramaCortadaXX(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.d=get("data/worldbuilding/grama-cortada-cotidiano-ciclo20.json")
        cls.creatures=get("dist/carcaca/creatures.json")

    def test_values_and_separation(self):
        d=self.d
        self.assertEqual(d["territorio"],"Condado de Grama-Cortada")
        self.assertEqual(d["protagonista_cultural_documentado"],"Menelau Folha-Seca")
        self.assertEqual(d["contagens"],{"fatos":12,"dominios_da_vida":9,
           "circuitos_economicos":5,"formas_de_convivencia":4,"conflitos_internos":5,
           "celebracoes_possiveis":4,"generos_da_memoria":4,"vinhetas":4,"decisoes":8})
        self.assertFalse(d["aprovacao_autoral"])
        self.assertFalse(d["aplicar_ao_canon_automaticamente"])
        self.assertIsNone(d["referencia_id_regiao"])
        self.assertIsNone(d["referencia_id_lugar"])
        self.assertIsNone(d["populacao_confirmada"])
        self.assertEqual(len(self.creatures),7)

    def test_no_cultural_event_becomes_history(self):
        cats=("dominios_da_vida","circuitos_economicos","formas_de_convivencia",
              "conflitos_internos","celebracoes_possiveis","generos_da_memoria","vinhetas")
        entries=[x for cat in cats for x in self.d[cat]]
        self.assertEqual(len(entries),35)
        self.assertEqual(len({x["id"] for x in entries}),35)
        for entry in entries:
            self.assertFalse(entry["ocorreu"])
            self.assertFalse(entry["instituicao_confirmada"])
            self.assertTrue(all(p in (18,19) for p in entry["fonte_contexto_paginas"]))
            self.assertEqual(entry["estado"],"exploracao_cultural_nao_canonica")

    def test_manuscript_and_open_questions(self):
        self.assertEqual(len(self.d["fatos_documentados"]),12)
        self.assertTrue(all(x["pagina_manuscrito"] in (18,19) and
            not x["reformulacao_aprovada"] for x in self.d["fatos_documentados"]))
        self.assertEqual(len(self.d["decisoes_para_autor"]),8)
        self.assertTrue(all(x["opcao_escolhida"] is None for x in self.d["decisoes_para_autor"]))

if __name__=="__main__":unittest.main()
