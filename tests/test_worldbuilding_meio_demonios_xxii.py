"""Ciclo XXII: meio-demônios sem determinismo genealógico nem canonizações."""
import json, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def load(path):return json.loads((ROOT/path).read_text(encoding="utf-8"))
class MeioDemoniosXXII(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.data=load("data/worldbuilding/meio-demonios-sociedades-ciclo22.json")
  cls.creatures=load("dist/carcaca/creatures.json")
 def test_counts_and_no_universal_nation(self):
  d=self.data
  self.assertEqual(d["contagens"],{
   "fatos":14,"eixos_sociais":11,"contextos_de_convivencia":6,
   "circuitos_civis":6,"tensoes":6,"costumes_candidatos":4,"vinhetas":4,"perguntas":9})
  self.assertFalse(d["aprovacao_autoral"])
  self.assertFalse(d["efeito_canonico_automatico"])
  self.assertEqual(d["povo"],"Meio-Demônios")
  self.assertIsNone(d["patria_unica_documentada"])
  self.assertIsNone(d["governo_comum_documentado"])
  self.assertIsNone(d["aparencia_uniforme_documentada"])
  self.assertEqual(len(self.creatures),7)
 def test_distinct_source_and_proposals(self):
  d=self.data
  all_proposals=[x for cat in ("eixos_sociais","contextos_de_convivencia","circuitos_civis","tensoes","costumes_candidatos","vinhetas") for x in d[cat]]
  self.assertEqual(len(all_proposals),37)
  self.assertTrue(all(x["pagina"] in (9,21) and x["novo_canon"] is False for x in d["fatos_documentados"]))
  self.assertTrue(all(not x["ocorreu"] and not x["lei_confirmada"] for x in d["eixos_sociais"]))
  self.assertTrue(all(not x["comunidade_canonica_nova"] and x["geografia_exata"] is None for x in d["contextos_de_convivencia"]))
  self.assertTrue(all(not x["instituicao_confirmada"] for x in d["circuitos_civis"]))
  self.assertTrue(all(not x["aconteceu"] and not x["desfecho_aprovado"] for x in d["tensoes"]))
  self.assertTrue(all(not x["ritual_confirmado"] for x in d["costumes_candidatos"]))
  self.assertTrue(all(not x["ocorreu"] and not x["npc_canonico_criado"] for x in d["vinhetas"]))
  self.assertEqual(len({x["id"] for x in all_proposals+d["fatos_documentados"]+d["perguntas_para_autor"]}),60)
 def test_open_questions_and_cosmology(self):
  d=self.data
  self.assertTrue(all(x["resposta_aprovada"] is None for x in d["perguntas_para_autor"]))
  self.assertIn("tieflings",d["referencia_cosmologica"])
  self.assertIn("cambions",d["referencia_cosmologica"])
  self.assertIn("983 EC",d["marco_cronologico_documentado"])
  self.assertIn("não equivale",d["marco_cronologico_documentado"])
if __name__=="__main__":unittest.main()
