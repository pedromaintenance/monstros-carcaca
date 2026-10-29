"""Ciclo XXIII: região habitada, proveniência e revisão futura sem reescrever o atlas."""
import json, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def read(path):return json.loads((ROOT/path).read_text(encoding="utf8"))

class CaatingaCivilXXIII(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data=read("data/worldbuilding/caatinga-vida-civil-ciclo23.json")
        cls.old=read("data/propostas/caatinga-rede-social-hack.json")
        cls.regions=read("data/regioes_carcaca.json")["regioes"]
        cls.creatures=read("dist/carcaca/creatures.json")
    def test_coverage_and_status(self):
        d=self.data
        self.assertEqual(d["contagens"],{
            "fatos":12,"dominios_sociais":12,"circuitos_materiais":6,"etica_da_agua":6,
            "mobilidades":6,"relacoes_regionais":5,"vinhetas":5,
            "referencias_existentes":12,"perguntas":10})
        self.assertFalse(d["aprovacao_autoral"])
        self.assertFalse(d["efeito_canonico_automatico"])
        self.assertEqual(d["regiao_id"],"regiao:caatinga")
        self.assertEqual(d["regiao_vizinha_id"],"regiao:costa-sul")
        self.assertEqual(d["lugares_canonicos_adicionados"],0)
        self.assertEqual(len(self.creatures),7)
        self.assertEqual(next(x for x in self.regions if x["id"]=="regiao:caatinga")["lugares"],[])
        self.assertIsNone(d["fronteira_exata_documentada"])
        self.assertIsNone(d["agua_potavel_confirmada"])
    def test_proposals_are_not_events_or_laws(self):
        d=self.data
        categories=("dominios_sociais","circuitos_materiais","etica_da_agua",
                    "mobilidades","relacoes_regionais","vinhetas")
        proposals=[x for cat in categories for x in d[cat]]
        self.assertEqual(len(proposals),40)
        self.assertEqual(len({x["id"] for x in proposals}),40)
        self.assertTrue(all(x["estado"]=="proposta_cultural_sem_canon"
            and not x["ocorreu"] and not x["situacao_documentada"] and
            not x["aprovacao_autoral"] for x in proposals))
        self.assertEqual(len(d["perguntas_para_autor"]),10)
        self.assertTrue(all(x["resposta_aprovada"] is None for x in d["perguntas_para_autor"]))
        self.assertTrue(all(x["pagina_manuscrito"] in (5,9,12)
            and x["canon_novo"] is False for x in d["fatos_documentados"]))
    def test_existing_comunidades_remain_proposed(self):
        d=self.data
        refs={x["id"]:x for x in d["referencias_a_propostas_e_dados_existentes"]}
        self.assertEqual(len(refs),12)
        for item in self.old["comunidades"]:
            self.assertIn(item["id"],refs)
            self.assertEqual(refs[item["id"]]["arquivo"],"data/propostas/caatinga-rede-social-hack.json")
        for cat in ("circuitos_materiais","etica_da_agua","mobilidades","relacoes_regionais","vinhetas"):
            for item in d[cat]:
                self.assertIn(item["referencia_preexistente"],refs)
    def test_historical_precision(self):
        d=self.data
        facts={x["id"]:x["afirmacao_de_fonte"] for x in d["fatos_documentados"]}
        self.assertIn("351 EC",facts["worldbuilding-xxiii:fato:antiga-alianca"])
        self.assertTrue(any("Portomonte" in x["limite_de_inferencia"]
            for x in d["fatos_documentados"]))
        self.assertTrue(any("potável" in x["limite_de_inferencia"] or
            "potável" in x["afirmacao_de_fonte"] for x in d["fatos_documentados"]))
if __name__=="__main__":unittest.main()
