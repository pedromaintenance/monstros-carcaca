"""Teste de integração real dos índices regionais gerados."""
import unittest
from scripts.gerar_indices_curadoria import build


class RegionalDossiers(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.artifacts=build()
        cls.rows={r["regiao_id"]:r for r in cls.artifacts["regional-dossiers.json"]}

    def test_coverage(self):
        self.assertEqual(len(self.rows),4)
        self.assertEqual(sum(len(d["perguntas"]) for d in self.rows.values()),16)
        self.assertEqual(self.artifacts["manifest.json"]["total_dossies_regionais"],4)

    def test_caatinga_empty_is_unknown_not_deserted(self):
        ca=self.rows["regiao:caatinga"]
        self.assertEqual(ca["inventario"]["lugares"],[])
        self.assertEqual(ca["inventario"]["assentamentos"],[])
        self.assertEqual(ca["politica_interpretacao"]["vazios_significam"],
                         "nenhum_registro_curado_no_escopo")
        self.assertFalse(ca["politica_interpretacao"]["mutacao_canonica"])

    def test_eldroth_coast_refugees_keep_roles(self):
        id="dinamica:refugiados-eldroth-maiores-assentamentos"
        eld=self.rows["regiao:eldroth"]
        coast=self.rows["regiao:costa-sul"]
        eld_ref=[d for d in eld["inventario"]["dinamicas_territoriais"] if d["id"]==id]
        coast_ref=[d for d in coast["inventario"]["dinamicas_territoriais"] if d["id"]==id]
        self.assertEqual(eld_ref[0]["papeis_regionais"],["origem"])
        self.assertEqual(coast_ref[0]["papeis_regionais"],["destino"])
        self.assertIsNone(eld_ref[0]["evento_campanha_id"])
        self.assertNotIn("regiao:eldroth",
                         [s["regiao_id"] for s in self.artifacts["settlements.json"]])

    def test_foz_fronts_and_creatures_are_not_settlements(self):
        foz=self.rows["regiao:foz-rio-ancestral"]["inventario"]
        self.assertEqual(len(foz["criaturas"]),7)
        self.assertEqual(len(foz["frentes_propostas"]),1)
        self.assertEqual(len(foz["assentamentos"]),0)
        self.assertEqual(len(foz["pressoes_ecologicas_hipoteticas"]),0)

    def test_coast_material_records_are_local(self):
        coast=self.rows["regiao:costa-sul"]["inventario"]
        self.assertEqual(len(coast["assentamentos"]),3)
        self.assertEqual(len(coast["perfis_infraestrutura"]),3)
        self.assertEqual(len(coast["dependencias_materiais"]),5)
        self.assertEqual(len(coast["pressoes_ecologicas_hipoteticas"]),4)
        self.assertEqual(len(coast["fluxos"]),4)
        self.assertEqual(
            len({x["id"] for x in coast["dinamicas_territoriais"]}),
            len(coast["dinamicas_territoriais"]))

if __name__=="__main__":
    unittest.main()
