"""Ciclo XXI: gnomos de rocha, floresta e profundezas sem povo homogêneo."""
import json
import unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def load(path):return json.loads((ROOT/path).read_text(encoding="utf-8"))

class GnomosXXI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.doc=load("data/worldbuilding/culturas-gnomicas-ciclo21.json")
        cls.creatures=load("dist/carcaca/creatures.json")

    def test_counts_and_no_promotions(self):
        d=self.doc
        self.assertEqual(d["contagens"],{
            "fatos_documentados":14,"tradicoes":3,"eixos_sociais":12,
            "eticas_do_conhecimento":6,"redes_de_troca":5,
            "conflitos_internos":5,"costumes_possiveis":4,"vinhetas":4,
            "decisoes_para_autor":9})
        self.assertFalse(d["aprovacao_autoral"])
        self.assertFalse(d["aplicar_ao_canon_automaticamente"])
        self.assertIsNone(d["capital_gnomica_confirmada"])
        self.assertIsNone(d["governo_comum_confirmado"])
        self.assertIsNone(d["populacao_total_confirmada"])
        self.assertEqual(len(self.creatures),7)

    def test_distinct_traditions_and_knowledge(self):
        d=self.doc
        ids={t["id"] for t in d["tradicoes"]}
        self.assertEqual(ids,{"worldbuilding-xxi:tradicao:rochas",
                              "worldbuilding-xxi:tradicao:florestas",
                              "worldbuilding-xxi:tradicao:profundezas"})
        self.assertTrue(all(not t["governo_unificado_confirmado"]
            and t["populacao_confirmada"] is None for t in d["tradicoes"]))
        self.assertTrue(all(x["tradicao_id"] in ids and
            not x["norma_em_vigor"] and not x["ocorreu"] for x in d["eixos_sociais"]))
        self.assertTrue(all(x["direito_codificado_confirmado"] is False and
            x["instituicao_cientifica_confirmada"] is False for x in d["eticas_do_conhecimento"]))
        self.assertTrue(all(set(x["tradicoes_relacionadas"]).issubset(ids) and
            x["acordo_novo_assinado"] is False and
            x["volume_comercial_confirmado"] is None for x in d["redes_de_troca"]))

    def test_no_new_ritual_or_campaign_event(self):
        d=self.doc
        self.assertTrue(all(not x["existe_historicamente"] and
            not x["ritual_confirmado"] for x in d["costumes_possiveis"]))
        self.assertTrue(all(not x["ocorreu"] and
            not x["personagem_canonico_introduzido"] for x in d["vinhetas"]))
        self.assertEqual(len(d["decisoes_para_autor"]),9)
        self.assertTrue(all(x["resposta_aprovada"] is None for x in d["decisoes_para_autor"]))
        total=d["fatos_documentados"]+d["tradicoes"]+d["eixos_sociais"]+d["eticas_do_conhecimento"]+d["redes_de_troca"]+d["conflitos_internos"]+d["costumes_possiveis"]+d["vinhetas"]+d["decisoes_para_autor"]
        self.assertEqual(len(total),62)
        self.assertEqual(len({x["id"] for x in total}),62)

if __name__=="__main__":unittest.main()
