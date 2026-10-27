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

    def test_research_backlog_is_generated_from_all_guide_questions(self):
        queue=self.artifacts["research-backlog.json"]
        self.assertEqual(len(queue),16)
        self.assertEqual(len({x["pergunta_id"] for x in queue}),16)
        self.assertEqual(len([x for x in queue if x["ordem_editorial"] is not None]),8)
        self.assertEqual(len([x for x in queue if x["ordem_editorial"] is None]),8)
        self.assertEqual(sum(len(x["depende_de_perguntas"]) for x in queue),4)
        self.assertTrue(all(x["resposta_confirmada"] is None and x["evidencia_nova"] is None
                            and not x["mutacao_canonica"] and not x["efeitos_dw_automaticos"]
                            for x in queue))
        self.assertEqual(self.artifacts["manifest.json"]["total_pendencias_curadoria"],16)

    def test_research_backlog_order_and_precedence_are_editorial(self):
        rows=self.artifacts["research-backlog.json"]
        order={x["pergunta_id"]:x["ordem_editorial"] for x in rows}
        self.assertEqual(sorted(o for o in order.values() if o is not None),list(range(1,9)))
        for x in rows:
            for required in x["depende_de_perguntas"]:
                self.assertLess(order[required],x["ordem_editorial"])
        self.assertEqual(rows[0]["pergunta_id"],"pergunta:caatinga-habitacao")
        self.assertEqual(rows[7]["pergunta_id"],"pergunta:costa-sul-migracao")

    def test_research_backlog_has_all_four_regions(self):
        queue=self.artifacts["research-backlog.json"]
        self.assertEqual(
            {reg:len([x for x in queue if x["regiao_id"]==reg])
             for reg in self.rows},
            {reg:4 for reg in self.rows})
        self.assertEqual(
            {reg:len([x for x in queue if x["regiao_id"]==reg and x["ordem_editorial"] is not None])
             for reg in self.rows},
            {reg:2 for reg in self.rows})

    def test_manuscript_is_indexed_without_promoting_canon(self):
        compiled=self.artifacts
        self.assertEqual(compiled["manifest.json"]["total_entradas_lore_manuscrito"],157)
        self.assertEqual(compiled["manifest.json"]["total_paginas_lore_manuscrito"],24)
        self.assertEqual(compiled["manifest.json"]["total_eventos_cronologia_manuscrito"],18)
        self.assertEqual(compiled["manifest.json"]["total_incognitas_manuscrito"],7)
        self.assertEqual(compiled["manifest.json"]["total_pontos_revisao_manuscrito"],7)
        index=compiled["lore-index.json"]
        self.assertEqual(len(index),157)
        self.assertTrue(all(x["integracao"]=="referencia_sem_mutar_canonico"
                            and x["paginas"] for x in index))
        self.assertEqual({x["tipo"] for x in index},
                         {"geografia","regiao","lugar","plano","povo","faccao","personagem","divindade","conceito"})
        self.assertEqual(len(compiled["lore-review-notes.json"]["revisoes"]),7)

    def test_manuscript_search_keys_and_history_are_distinct(self):
        index=self.artifacts["lore-indexes.json"]
        self.assertIn("povo",index["by_tipo"])
        self.assertIn("14",index["by_pagina"])
        self.assertIn("kuo",index["by_token"])
        self.assertEqual(sorted(set(self.artifacts["lore-indexes.json"]["by_tipo"]["povo"])),
                         self.artifacts["lore-indexes.json"]["by_tipo"]["povo"])
        events=self.artifacts["lore-chronology.json"]["eventos"]
        self.assertTrue(all(e["uso"]=="nao_promover_para_timeline_canonica_sem_revisao" for e in events))
        self.assertEqual(len(self.artifacts["settlements.json"]),3)
        self.assertEqual(len(self.artifacts["creatures.json"]),7)

    def test_second_pass_mechanics_remain_separate_from_lore(self):
        ix=self.artifacts["hack-mechanics-index.json"]
        self.assertEqual(len(ix["paginas_indice"]),155)
        self.assertEqual(ix["paginas_sem_texto_extraivel"],[91])
        self.assertTrue(ix["nao_usar_como_fato_de_ambientacao"])
        self.assertEqual(self.artifacts["manifest.json"]["total_paginas_mecanicas_extraidas"],155)
        self.assertEqual(self.artifacts["manifest.json"]["total_rotulos_mecanicas_detectados"],
                         sum(len(p["rotulos_detectados"]) for p in ix["paginas_indice"]))
        self.assertEqual(self.artifacts["manifest.json"]["total_entradas_lore_manuscrito"],157)
        self.assertTrue(any("REQUER:" in line
                            for page in ix["paginas_indice"]
                            for line in page["mencoes_requer_na_pagina"]))
        self.assertEqual(len(self.artifacts["creatures.json"]),7)
        self.assertEqual(len(self.artifacts["settlements.json"]),3)

    def test_fourth_audit_full_movements_and_docx_tables(self):
        art=self.artifacts
        self.assertEqual(art["manifest.json"]["total_movimentos_integrais_piloto"],12)
        self.assertEqual(art["manifest.json"]["total_opcoes_movimentos_piloto"],4)
        self.assertEqual(art["manifest.json"]["total_tabelas_docx_inventariadas"],33)
        self.assertEqual(art["manifest.json"]["total_quadros_movimentos_gerais"],21)
        moves=art["hack-complete-pilot-movements.json"]
        tables=art["hack-docx-tables.json"]
        self.assertEqual(len(moves),12)
        self.assertEqual({m["grupo"] for m in moves},{"HUMANOS","ORCS DA CAATINGA"})
        self.assertTrue(all(m["texto_integral_conferido"] and not m["aplicacao_canonica"]
                            for m in moves))
        loot=[m for m in moves if m["titulo"]=="SAQUEADOR DA CAATINGA"][0]
        self.assertEqual([o["paragrafo_docx"] for o in loot["opcoes"]],[838,839,840,841])
        self.assertEqual(len(tables),33)
        self.assertEqual(sum(t["tipo"]=="quadro_movimento_geral" for t in tables),21)
        self.assertIn("tabela-docx:14",art["hack-docx-table-indexes.json"]["by_tipo"]["quadro_movimento_geral"])
        self.assertEqual(art["hack-complete-pilot-movement-indexes.json"]["by_grupo"]["HUMANOS"].__len__(),6)
        preliminary=[m for m in moves if m["revisao_preliminar_id"]]
        self.assertGreaterEqual(len(preliminary),2)
        self.assertEqual(len(art["creatures.json"]),7)
        self.assertEqual(len(art["settlements.json"]),3)

    def test_third_audit_relationships_and_movements(self):
        out=self.artifacts
        self.assertEqual(out["manifest.json"]["total_relacoes_lore_manuscrito"],26)
        self.assertEqual(out["manifest.json"]["total_movimentos_titulos_verificados"],41)
        self.assertEqual(out["manifest.json"]["total_movimentos_com_requisito_literal"],26)
        rel=out["lore-relations.json"]
        movs=out["hack-selected-movements.json"]
        self.assertEqual(len(rel),26)
        self.assertEqual(len(movs),41)
        self.assertTrue(all(not x["aplicacao_canonica"] for x in rel+movs))
        self.assertEqual(
            [x for x in movs if x["titulo"]=="NENHUM MUNDO É LONGE DEMAIS"][0]["requisito_literal"],
            "Caminhante dos Horizontes e Marca do Caçador")
        self.assertEqual(
            [x for x in movs if x["titulo"]=="A CANÇÃO QUE FEZ O MUNDO"][0]["requisito_literal"],
            "Arte Arcana e dois outros Movimentos de Bardo")
        self.assertTrue(all(x["efeito_revisado"] is False for x in movs))
        self.assertTrue(out["hack-mechanics-index.json"]["conferencia_pagina_91"]["confirmada_em_renderizacao_docx"])
        self.assertFalse(out["hack-mechanics-index.json"]["conferencia_pagina_91"]["possui_texto"])
        self.assertEqual(len(out["creatures.json"]),7)
        self.assertEqual(len(out["settlements.json"]),3)

    def test_manuscript_atlas_bridges_preserve_granularity(self):
        links=self.artifacts["lore-atlas-links.json"]
        self.assertEqual(len(links),14)
        self.assertEqual(self.artifacts["manifest.json"]["total_pontes_lore_atlas"],14)
        self.assertTrue(all(not x["aplicar_automaticamente"]
                            and x["status"]=="pendente_revisao_autoral" for x in links))
        ids={e["id"]:e for e in self.artifacts["lore-index.json"]}
        for bridge in links:
            self.assertIn(bridge["pagina"],ids[bridge["entrada_lore_id"]]["paginas"])
        partially=[x for x in links if x["pergunta_curadoria_id"]=="pergunta:costa-sul-migracao"]
        self.assertEqual(len(partially),1)
        self.assertEqual(partially[0]["parecer"],"resposta_parcial_para_grupo")

if __name__=="__main__":
    unittest.main()
