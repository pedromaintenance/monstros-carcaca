"""Ciclo XXVII: fontes, regiões e hipóteses de Shadar/Gualápolis."""
import json,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def get(p):return json.loads((ROOT/p).read_text(encoding="utf8"))
CATS=("vida_sob_a_corte","memoria_submersa","rio_e_trabalho","pactos_de_frente","dilemas_civis","vinhetas")
class TestShadarGualapolisXXVII(unittest.TestCase):
    def test_integridade(self):
        d=get("data/worldbuilding/foz-shadar-memoria-ciclo27.json")
        self.assertEqual(d["contagens"],{"fatos":12,"referencias":12,"propostas":36,"perguntas":10,
            "vida_sob_a_corte":8,"memoria_submersa":7,"rio_e_trabalho":6,"pactos_de_frente":6,
            "dilemas_civis":5,"vinhetas":4})
        self.assertIsNone(d["regiao_normalizada_shadar"])
        self.assertIsNone(d["geometria_exata_gualapolis_boca_shadar"])
        self.assertTrue(all(d[k] is False for k in ("aprovacao_autoral","efeito_canonico_automatico",
            "alteracao_atlas_factual","alteracao_criaturas","alteracao_regras_dw")))
        self.assertTrue(all(d[k] is None for k in ("populacao_sobrevivente_gualapolis_confirmada",
            "tratados_especificos_confirmados","acesso_publico_arquivo_confirmado",
            "cronologia_individual_afogamento_confirmada")))
        valid_pages={p["pagina"] for p in get(d["fonte_manuscrito"])["paginas"]}
        self.assertTrue(all(f["pagina"] in valid_pages and f["pagina"] in (4,5,6,9,10)
            and f["canon_adicionado"] is False for f in d["fatos_documentados"]))
        refs=d["referencias_rastreaveis"]
        self.assertEqual(len({r["id"] for r in refs}),12)
        for r in refs:
            self.assertIn(r["id"],{x["id"] for x in get(r["arquivo"])[r["colecao"]]})
        rows=[x for cat in CATS for x in d[cat]]
        self.assertEqual(len(rows),36)
        self.assertEqual(len({x["id"] for x in rows}),36)
        self.assertTrue(set(x["referencia_id"] for x in rows)<={r["id"] for r in refs})
        self.assertTrue(all(x["estado"]=="proposta_cultural_nao_canonica"
            and not x["ocorreu"] and not x["aprovacao_autoral"]
            and not x["situacao_documentada"] and not x["canon_aplicado"] for x in rows))
        self.assertTrue(all(x["resposta_aprovada"] is None for x in d["perguntas_para_autor"]))
        self.assertEqual(len(get("dist/carcaca/creatures.json")),7)
    def test_exportacao(self):
        d=get("data/worldbuilding/foz-shadar-memoria-ciclo27.json")
        self.assertEqual(d,get("dist/carcaca/foz-shadar-memory.json"))
        ix=get("dist/carcaca/foz-shadar-memory-indexes.json")
        for name in ("by_categoria","by_escopo","by_referencia","by_estado"):
            self.assertEqual(sum(len(v) for v in ix[name].values()),36)
        self.assertIn("area-proposta:shadar",ix["by_referencia"])
if __name__=="__main__":unittest.main()
