import test from "node:test";
import assert from "node:assert/strict";
import {createCarcacaAtlas, previewSettlementScenario,previewMaterialInterruption,
        previewClassRequirements} from "../src/carcaca-client.mjs";
import {createCampaignLedger,recordCampaignEvent,getCampaignEvents} from "../src/carcaca-campaign-state.mjs";
import {previewMaterialBalance,BALANCE_FIELDS} from "../src/carcaca-material-balance.mjs";
import {previewSupportCapacity,previewPopulationFlow,SUPPORT_LIMITS} from "../src/carcaca-support-capacity.mjs";
import {auditInfrastructure,previewInfrastructureIssue} from "../src/carcaca-infrastructure.mjs";
import {previewTerritorialImpact} from "../src/carcaca-territorial.mjs";
import {reviewRegionalDossier} from "../src/carcaca-regional.mjs";
import {reviewResearchBacklog} from "../src/carcaca-research.mjs";

const fixtures={
  "manifest.json":{arquivos:{catalog:"catalog.json",creatures:"creatures.json",
    indexes:"indexes.json",regions:"regions.json",fronts:"fronts.json",
    settlements:"settlements.json",settlement_labels:"settlement-labels.json",
    settlement_indexes:"settlement-indexes.json",peoples:"peoples.json",
    flows:"flows.json",settlement_scenarios:"settlement-scenarios.json",
    material_dependencies:"material-dependencies.json",
    material_dependency_indexes:"material-dependency-indexes.json",
    material_balances:"material-balances.json",material_balance_indexes:"material-balance-indexes.json",
    ecological_pressures:"ecological-pressures.json",ecological_pressure_indexes:"ecological-pressure-indexes.json",
    support_profiles:"support-profiles.json",support_indexes:"support-indexes.json",
    infrastructure_profiles:"infrastructure-profiles.json",
    infrastructure_indexes:"infrastructure-indexes.json",
    territorial_labels:"territorial-labels.json",
    territorial_dynamics:"territorial-dynamics.json",
    territorial_indexes:"territorial-indexes.json",
    regional_dossiers:"regional-dossiers.json",
    regional_dossier_indexes:"regional-dossier-indexes.json",
    research_backlog:"research-backlog.json",
    research_backlog_indexes:"research-backlog-indexes.json",
    lore_index:"lore-index.json",lore_index_indexes:"lore-indexes.json",
    lore_chronology:"lore-chronology.json",lore_review_notes:"lore-review-notes.json",
    lore_atlas_links:"lore-atlas-links.json",
    lore_atlas_link_indexes:"lore-atlas-link-indexes.json",
    hack_mechanics_index:"hack-mechanics-index.json",
    lore_relations:"lore-relations.json",
    lore_relation_indexes:"lore-relation-indexes.json",
    hack_selected_movements:"hack-selected-movements.json",
    hack_selected_movement_indexes:"hack-selected-movement-indexes.json",
    hack_complete_pilot_movements:"hack-complete-pilot-movements.json",
    hack_complete_pilot_movement_indexes:"hack-complete-pilot-movement-indexes.json",
    hack_docx_tables:"hack-docx-tables.json",
    hack_docx_table_indexes:"hack-docx-table-indexes.json",
    hack_general_movements:"hack-general-movements.json",
    hack_general_movement_indexes:"hack-general-movement-indexes.json",
    hack_core_rules:"hack-core-rules.json",
    hack_people_movements:"hack-people-movements.json",
    hack_people_movement_indexes:"hack-people-movement-indexes.json",
    hack_class_movement_inventory:"hack-class-movement-inventory.json",
    hack_class_movement_indexes:"hack-class-movement-indexes.json",
    hack_class_requirement_candidates:"hack-class-requirement-candidates.json",
    hack_class_requirement_pending:"hack-class-requirement-pending.json",
    hack_warrior_movements:"hack-warrior-movements.json",
    hack_warrior_movement_indexes:"hack-warrior-movement-indexes.json",
    hack_barbarian_movements:"hack-barbarian-movements.json",
    hack_barbarian_movement_indexes:"hack-barbarian-movement-indexes.json",
    hack_hunter_movements:"hack-hunter-movements.json",
    hack_hunter_movement_indexes:"hack-hunter-movement-indexes.json",
    hack_rogue_movements:"hack-rogue-movements.json",
    hack_rogue_movement_indexes:"hack-rogue-movement-indexes.json",
    hack_bard_movements:"hack-bard-movements.json",
    hack_bard_movement_indexes:"hack-bard-movement-indexes.json",
    hack_martial_artist_movements:"hack-martial-artist-movements.json",
    hack_martial_artist_movement_indexes:"hack-martial-artist-movement-indexes.json",
    hack_paladin_movements:"hack-paladin-movements.json",
    hack_paladin_movement_indexes:"hack-paladin-movement-indexes.json",
    hack_cleric_movements:"hack-cleric-movements.json",
    hack_cleric_movement_indexes:"hack-cleric-movement-indexes.json",
    hack_druid_movements:"hack-druid-movements.json",
    hack_druid_movement_indexes:"hack-druid-movement-indexes.json",
    hack_mage_movements:"hack-mage-movements.json",
    hack_mage_movement_indexes:"hack-mage-movement-indexes.json",
    hack_sorcerer_movements:"hack-sorcerer-movements.json",
    hack_sorcerer_movement_indexes:"hack-sorcerer-movement-indexes.json",
    hack_warlock_movements:"hack-warlock-movements.json",
    hack_warlock_movement_indexes:"hack-warlock-movement-indexes.json",
    hack_necromancer_movements:"hack-necromancer-movements.json",
    hack_necromancer_movement_indexes:"hack-necromancer-movement-indexes.json",
    hack_artificer_movements:"hack-artificer-movements.json",
    hack_artificer_movement_indexes:"hack-artificer-movement-indexes.json",
    hack_mercenary_movements:"hack-mercenary-movements.json",
    hack_mercenary_movement_indexes:"hack-mercenary-movement-indexes.json",
    portomonte_temple_civic:"portomonte-temple-civic.json",
    portomonte_temple_civic_indexes:"portomonte-temple-civic-indexes.json",
    costa_sul_civil_life:"costa-sul-civil-life.json",
    costa_sul_civil_life_indexes:"costa-sul-civil-life-indexes.json",
    caatinga_civil_life:"caatinga-civil-life.json",
    caatinga_civil_life_indexes:"caatinga-civil-life-indexes.json",
    half_demon_societies:"half-demon-societies.json",
    half_demon_societies_indexes:"half-demon-societies-indexes.json",
    gnomish_cultures:"gnomish-cultures.json",
    gnomish_cultures_indexes:"gnomish-cultures-indexes.json",
    grama_cortada_daily_life:"grama-cortada-daily-life.json",
    grama_cortada_daily_life_indexes:"grama-cortada-daily-life-indexes.json",
    atlas_authorial_review:"atlas-authorial-review.json",
    atlas_authorial_review_indexes:"atlas-authorial-review-indexes.json",
    ironwood_civil_society:"ironwood-civil-society.json",
    ironwood_civil_society_indexes:"ironwood-civil-society-indexes.json",
    vandar_memory_and_dead:"vandar-memory-and-dead.json",
    vandar_memory_and_dead_indexes:"vandar-memory-and-dead-indexes.json",
    eldroth_sylara_occupation:"eldroth-sylara-occupation.json",
    eldroth_sylara_occupation_indexes:"eldroth-sylara-occupation-indexes.json",
    eldroth_preconquest:"eldroth-preconquest.json",
    eldroth_preconquest_indexes:"eldroth-preconquest-indexes.json",
    eldroth_cultural_atlas:"eldroth-cultural-atlas.json",
    eldroth_cultural_atlas_indexes:"eldroth-cultural-atlas-indexes.json",
    eldroth_dw_statblocks:"eldroth-dw-statblocks.json",
    eldroth_dw_statblock_indexes:"eldroth-dw-statblock-indexes.json",
    eldroth_monster_ecology:"eldroth-monster-ecology.json",
    eldroth_monster_ecology_indexes:"eldroth-monster-ecology-indexes.json",
    ironwood_eldroth_resistance:"ironwood-eldroth-resistance.json",
    ironwood_eldroth_resistance_indexes:"ironwood-eldroth-resistance-indexes.json",
    thargrid_social_resistance:"thargrid-social-resistance.json",
    thargrid_social_resistance_indexes:"thargrid-social-resistance-indexes.json",
    garganta_river_social:"garganta-river-social.json",
    garganta_river_social_indexes:"garganta-river-social-indexes.json",
    costa_sul_sea_pressure:"costa-sul-sea-pressure.json",
    costa_sul_sea_pressure_indexes:"costa-sul-sea-pressure-indexes.json",
    mar_sangue_economy:"mar-sangue-economy.json",
    mar_sangue_economy_indexes:"mar-sangue-economy-indexes.json",
    mar_sangue_diplomacy:"mar-sangue-diplomacy.json",
    mar_sangue_diplomacy_indexes:"mar-sangue-diplomacy-indexes.json",
    mar_sangue_social_ecology:"mar-sangue-social-ecology.json",
    mar_sangue_social_ecology_indexes:"mar-sangue-social-ecology-indexes.json",
    costa_sul_social_fabric:"costa-sul-social-fabric.json",
    costa_sul_social_fabric_indexes:"costa-sul-social-fabric-indexes.json",
    frontier_caatinga_costa_sul:"frontier-caatinga-costa-sul.json",
    frontier_caatinga_costa_sul_indexes:"frontier-caatinga-costa-sul-indexes.json",
    caatinga_social_network:"caatinga-social-network.json",
    caatinga_social_indexes:"caatinga-social-indexes.json",
    regional_population_proposals:"regional-population-proposals.json",
    regional_population_proposal_indexes:"regional-population-proposal-indexes.json",
    hack_yokai_scribe_movements:"hack-yokai-scribe-movements.json",
    hack_yokai_scribe_movement_indexes:"hack-yokai-scribe-movement-indexes.json",
    hack_noble_movements:"hack-noble-movements.json",
    hack_noble_movement_indexes:"hack-noble-movement-indexes.json",
    hack_archaeologist_movements:"hack-archaeologist-movements.json",
    hack_archaeologist_movement_indexes:"hack-archaeologist-movement-indexes.json"}},
  "catalog.json":[
    {id:"carcaca:criatura:joro",nome:"Jorō",tipo_carcaca:"yokai",tipo_dnd:"fey",
     regioes:["regiao:foz"],lugares:["lugar:arquivo"],faccoes:["faccao:yokai"],
     estado:"rascunho",nd_dnd:14},
    {id:"carcaca:criatura:kappa",nome:"Kappa",tipo_carcaca:"yokai",tipo_dnd:"fey",
     regioes:["regiao:foz"],lugares:["lugar:arquivo"],faccoes:[],
     estado:"rascunho",nd_dnd:null},
    {id:"carcaca:criatura:urso",nome:"Urso",tipo_carcaca:"fauna",tipo_dnd:"beast",
     regioes:["regiao:norte"],lugares:[],faccoes:[],estado:"rascunho",nd_dnd:2}
  ],
  "creatures.json":[{id:"carcaca:criatura:joro",dungeon_world:{instinto:"Testar visitantes"}}],
  "regions.json":[{id:"regiao:caatinga",lugares:[]},{id:"regiao:costa-sul",lugares:[]},{id:"regiao:eldroth",lugares:[]}],
  "lore-relations.json":[
    {id:"relacao-hack:kuotoa-daegon",origem_id:"lore-hack:kuo-toa",
     destino_id:"lore-hack:daegon",tipo:"culto",pagina:5,
     estado:"afirmado_no_manuscrito",aplicacao_canonica:false},
    {id:"relacao-hack:tortles-ilhas",origem_id:"lore-hack:tortles",
     destino_id:"lore-hack:ilhas-monasticas",tipo:"habitat_insular",pagina:14,
     estado:"afirmado_no_manuscrito",aplicacao_canonica:false}
  ],
  "lore-relation-indexes.json":{by_tipo:{culto:["relacao-hack:kuotoa-daegon"]}},
  "hack-complete-pilot-movements.json":[
    {id:"movimento-integral:paragrafo-829",titulo:"PORTOMONTENSE",grupo:"HUMANOS",
     categoria:"povo",marcador_original:"Cultura",paragrafo_docx:829,
     texto_original:"Quando dispuser de algumas horas, consegue produzir água potável para um pequeno grupo",
     opcoes:[],revisao_preliminar_id:"movimento-revisado:paragrafo-829",
     texto_integral_conferido:true,aplicacao_canonica:false},
    {id:"movimento-integral:paragrafo-837",titulo:"SAQUEADOR DA CAATINGA",grupo:"ORCS DA CAATINGA",
     categoria:"povo",marcador_original:"Cultura",paragrafo_docx:837,
     texto_original:"role+DES. 10+: escolha 2. 7–9: escolha 1.",
     opcoes:[{paragrafo_docx:838,texto:"Você encontra algo útil."},
             {paragrafo_docx:839,texto:"Você identifica a saída."},
             {paragrafo_docx:840,texto:"Não é percebido."},
             {paragrafo_docx:841,texto:"Não abandona nada."}],
     revisao_preliminar_id:null,texto_integral_conferido:true,aplicacao_canonica:false}
  ],
  "hack-complete-pilot-movement-indexes.json":{by_grupo:{
     "HUMANOS":["movimento-integral:paragrafo-829"],
     "ORCS DA CAATINGA":["movimento-integral:paragrafo-837"]}},
  "hack-people-movements.json":[
    {id:"movimento-povo:paragrafo-849",paragrafo_docx:849,grupo:"ANÕES DE THARGRID",
     titulo:"ENGENHEIRO SOB A MONTANHA",marcador_original:"Cultura",aplicacao_canonica:false,
     texto_original:"Quando estudar uma ponte, pergunte.\\nOnde está seu ponto de maior tensão?\\nQuando viajar, tenha vantagem.",
     opcoes:[{paragrafo_docx:850,texto:"Onde está seu ponto de maior tensão?"}]},
    {id:"movimento-povo:paragrafo-827",paragrafo_docx:827,grupo:"HUMANOS",
     titulo:"FILHO DO RIO ANCESTRAL",marcador_original:"Cultura",aplicacao_canonica:false,
     texto_original:"Quando negociar ao longo do Rio, encontre um comerciante.",opcoes:[]}
  ],
  "hack-people-movement-indexes.json":{by_grupo:{"HUMANOS":["movimento-povo:paragrafo-827"],
     "ANÕES DE THARGRID":["movimento-povo:paragrafo-849"]}},
  "portomonte-temple-civic.json":{"regiao_id":"regiao:costa-sul","assentamento_id":"assentamento:portomonte","modelo_de_governo_adotado":null,"agua_domestica_potavel_confirmada":null,"aprovacao_autoral":false,"efeito_canonico_automatico":false,"contagens":{"fatos":8,"referencias":12,"perguntas":12,"modelos_de_governo":4,"etapas_de_trabalho":8,"relacoes_sociais":8,"garantias_civis":6,"dilemas":6,"vinhetas":4},"modelos_de_governo":[{"id":"worldbuilding-xxv:modelos_de_governo:templo-consultivo","nome_editorial":"Templo com voz, não trono","hipotese_condicional":"Um conselho civil consulta o templo sem delegar governo","contradicao_material":"Poder religioso e poder civil não são equivalentes","pergunta_critica":"Quem tem direito ao voto?","referencia_id":"xxiv:trabalhos:templo","pagina_contextual":5,"estatuto":"alternativa_nao_adotada","aprovacao_autoral":false,"ocorreu":false,"efeito_mecanico":false}],"etapas_de_trabalho":[{"id":"worldbuilding-xxv:etapas_de_trabalho:destinacao","nome_editorial":"Água agrícola não é água de beber","hipotese_condicional":"Separar usos","contradicao_material":"Risco público","pergunta_critica":"Potável?","referencia_id":"balanco:portomonte-agua-purificada","pagina_contextual":5}],"relacoes_sociais":[],"garantias_civis":[],"dilemas":[],"vinhetas":[],"fatos_documentados":[{"id":"worldbuilding-xxv:fato:02","novo_canon":false}],"perguntas_para_autor":[{"id":"worldbuilding-xxv:pergunta:autoridade","resposta_aprovada":null}]},
  "portomonte-temple-civic-indexes.json":{"by_categoria":{"modelos_de_governo":["worldbuilding-xxv:modelos_de_governo:templo-consultivo"]},"by_referencia":{"xxiv:trabalhos:templo":["worldbuilding-xxv:modelos_de_governo:templo-consultivo"]},"by_pagina":{"5":["worldbuilding-xxv:modelos_de_governo:templo-consultivo"]}},
  "costa-sul-civil-life.json":{"aprovacao_autoral":false,"efeito_canonico_automatico":false,"regiao_id":"regiao:costa-sul","contagens":{"propostas":36},"vida_domestica":[{"id":"xxiv:vida_domestica:cozinha","nome":"A cozinha que sustenta o porto","hipotese":"Tarefas domésticas compartilhadas","contradicao":"Trabalho invisível","pagina_contextual":5,"escopo":"portomonte","referencia_preexistente":"costa-sul:espaco:varal","ocorreu":false}],"trabalhos":[],"saberes":[],"circulacao":[],"tensoes_civis":[],"vinhetas":[],"fatos_documentados":[{"id":"xxiv:fato:1","canon_novo":false}],"perguntas_para_autor":[{"id":"xxiv:pergunta:1","resposta_aprovada":null}]},
  "costa-sul-civil-life-indexes.json":{"by_categoria":{"vida_domestica":["xxiv:vida_domestica:cozinha"]},"by_referencia":{"costa-sul:espaco:varal":["xxiv:vida_domestica:cozinha"]}},
  "caatinga-civil-life.json":{"aprovacao_autoral":false,"efeito_canonico_automatico":false,"regiao_id":"regiao:caatinga","lugares_canonicos_adicionados":0,"fronteira_exata_documentada":null,"agua_potavel_confirmada":null,"contagens":{"fatos":12,"dominios_sociais":12,"circuitos_materiais":6,"etica_da_agua":6,"mobilidades":6,"relacoes_regionais":5,"vinhetas":5,"referencias_existentes":12,"perguntas":10},"dominios_sociais":[{"id":"worldbuilding-xxiii:dominios_sociais:familias-e-clas","nome_editorial":"Clã e convivência","situacao_documentada":false,"ocorreu":false,"aprovacao_autoral":false,"estado":"proposta_cultural_sem_canon","pagina_contextual":12,"hipotese_social":"Famílias plurais","situacao_experimental":"Trabalho comunitário","contradicao":"Prestígio informal"}],"circuitos_materiais":[{"id":"worldbuilding-xxiii:circuitos_materiais:reparo","nome_editorial":"A oficina da água","situacao_documentada":false,"ocorreu":false,"aprovacao_autoral":false,"estado":"proposta_cultural_sem_canon","pagina_contextual":5,"producao_ou_troca_hipotetica":"Reparo de recipiente","situacao_experimental":"Trabalho invisível","referencia_preexistente":"caatinga:comunidade:poco-sem-bandeira"}],"etica_da_agua":[{"id":"worldbuilding-xxiii:etica_da_agua:necessidade","nome_editorial":"Água de todos","situacao_documentada":false,"ocorreu":false,"aprovacao_autoral":false,"estado":"proposta_cultural_sem_canon","pagina_contextual":5,"regra_para_investigar":"Primeira medida","pergunta_de_justica":"Quem bebe?","referencia_preexistente":"caatinga:comunidade:poco-sem-bandeira"}],"mobilidades":[{"id":"worldbuilding-xxiii:mobilidades:exilio","nome_editorial":"Migrar sem expulsão","situacao_documentada":false,"ocorreu":false,"aprovacao_autoral":false,"estado":"proposta_cultural_sem_canon","pagina_contextual":12,"contexto_hipotetico":"Diferentes motivos de saída","situacao_experimental":"Voltar ao lar","referencia_preexistente":"regiao:caatinga"}],"relacoes_regionais":[{"id":"worldbuilding-xxiii:relacoes_regionais:orcs-humanos","nome_editorial":"Aliança histórica","situacao_documentada":false,"ocorreu":false,"aprovacao_autoral":false,"estado":"proposta_cultural_sem_canon","pagina_contextual":5,"interpretacao_social":"Orcs e humanos se aliaram em 351 EC","tensao":"Aliança não equivale a tratado","referencia_preexistente":"regiao:caatinga"}],"vinhetas":[{"id":"worldbuilding-xxiii:vinhetas:cantaro","nome_editorial":"A sombra do cântaro","situacao_documentada":false,"ocorreu":false,"aprovacao_autoral":false,"estado":"proposta_cultural_sem_canon","pagina_contextual":5,"cena_hipotetica":"O cantaro não chega com água","tema":"Justiça da partilha","referencia_preexistente":"caatinga:comunidade:poco-sem-bandeira"}],"fatos_documentados":[{"id":"worldbuilding-xxiii:fato:antiga-alianca","pagina_manuscrito":9,"afirmacao_de_fonte":"Aliança de 351 EC","estado":"fonte_autoral_em_revisao","canon_novo":false}],"perguntas_para_autor":[{"id":"worldbuilding-xxiii:pergunta:agua","pergunta_autoral":"Quais fontes de água?","estado":"pendente_de_autoria","resposta_aprovada":null}]},
  "caatinga-civil-life-indexes.json":{"by_categoria":{"etica_da_agua":["worldbuilding-xxiii:etica_da_agua:necessidade"]},"by_estado":{"proposta_cultural_sem_canon":["worldbuilding-xxiii:etica_da_agua:necessidade"]},"by_referencia_preexistente":{"caatinga:comunidade:poco-sem-bandeira":["worldbuilding-xxiii:circuitos_materiais:reparo","worldbuilding-xxiii:etica_da_agua:necessidade","worldbuilding-xxiii:vinhetas:cantaro"]},"by_pagina_contextual":{"5":["worldbuilding-xxiii:etica_da_agua:necessidade"]},"by_nome":{"Água de todos":["worldbuilding-xxiii:etica_da_agua:necessidade"]},"by_slug":{"necessidade":["worldbuilding-xxiii:etica_da_agua:necessidade"]}},
  "half-demon-societies.json":{"aprovacao_autoral":false,"efeito_canonico_automatico":false,"povo":"Meio-Demônios","patria_unica_documentada":null,"governo_comum_documentado":null,"aparencia_uniforme_documentada":null,"contagens":{"fatos":14,"eixos_sociais":11,"contextos_de_convivencia":6,"circuitos_civis":6,"tensoes":6,"costumes_candidatos":4,"vinhetas":4,"perguntas":9},"eixos_sociais":[{"id":"worldbuilding-xxii:eixo:infancia-e-tracos","nome_editorial":"Uma criança não é presságio","hipotese_social":"Sinais de ascendência","detalhe_cotidiano":"Uma criança com chifres","pergunta_etica":"Consentimento","lei_confirmada":false,"ocorreu":false}],"contextos_de_convivencia":[{"id":"worldbuilding-xxii:contexto:assentamentos-do-abismo","nome_editorial":"Viver perto do Abismo","configuracao_hipotetica":"Cidades com diversidade","geografia_exata":null,"comunidade_canonica_nova":false}],"circuitos_civis":[{"id":"worldbuilding-xxii:circuito:vestuario-adaptado","nome_editorial":"Vestuário adaptado","arranjo_possivel":"Capacete para chifres","instituicao_confirmada":false}],"tensoes":[{"id":"worldbuilding-xxii:tensao:parentes-sem-divida","nome_editorial":"Pacto não assinado","situacao_condicional":"Sem consentimento","aconteceu":false,"desfecho_aprovado":false}],"costumes_candidatos":[{"id":"worldbuilding-xxii:costume:nome-escolhido","nome_editorial":"O dia de dizer o nome","pratica_possivel":"Identidade escolhida","ritual_confirmado":false,"aconteceu":false}],"vinhetas":[{"id":"worldbuilding-xxii:vinheta:album-sem-nome","nome_editorial":"O álbum incompleto","cena_condicional":"Uma avó sem genealogia completa","ocorreu":false,"npc_canonico_criado":false}],"fatos_documentados":[{"id":"worldbuilding-xxii:fato:01","pagina":21,"afirmacao_de_fonte":"Mistura de ascendências","novo_canon":false}],"perguntas_para_autor":[{"id":"worldbuilding-xxii:pergunta:geografia","pergunta_autoral":"Onde vivem?","resposta_aprovada":null,"estado":"pendente"}]},
  "half-demon-societies-indexes.json":{"by_categoria":{"eixos_sociais":["worldbuilding-xxii:eixo:infancia-e-tracos"]},"by_estado":{"proposta_nao_canonica":["worldbuilding-xxii:eixo:infancia-e-tracos"]},"by_nome":{"Uma criança não é presságio":["worldbuilding-xxii:eixo:infancia-e-tracos"]},"by_slug":{"infancia-e-tracos":["worldbuilding-xxii:eixo:infancia-e-tracos"]},"by_inicial":{"U":["worldbuilding-xxii:eixo:infancia-e-tracos"]}},
  "gnomish-cultures.json":{"aprovacao_autoral":false,"aplicar_ao_canon_automaticamente":false,"capital_gnomica_confirmada":null,"governo_comum_confirmado":null,"populacao_total_confirmada":null,"contagens":{"fatos_documentados":14,"tradicoes":3,"eixos_sociais":12,"eticas_do_conhecimento":6,"redes_de_troca":5,"conflitos_internos":5,"costumes_possiveis":4,"vinhetas":4,"decisoes_para_autor":9},"tradicoes":[{"id":"worldbuilding-xxi:tradicao:rochas","nome":"Gnomos das Rochas","ambiente_documentado":"Oficinas","fonte_paginas":[20],"governo_unificado_confirmado":false},{"id":"worldbuilding-xxi:tradicao:florestas","nome":"Gnomos da Floresta","ambiente_documentado":"Bosques ocultos","fonte_paginas":[20],"governo_unificado_confirmado":false},{"id":"worldbuilding-xxi:tradicao:profundezas","nome":"Svirfneblin","ambiente_documentado":"Profundezas","fonte_paginas":[20],"governo_unificado_confirmado":false}],"eixos_sociais":[{"id":"worldbuilding-xxi:eixo:rochas:autoria","nome_editorial":"A assinatura na engrenagem","tradicao_id":"worldbuilding-xxi:tradicao:rochas","hipotese_cultural":"Trabalho de oficina","pergunta_politica":"Quem merece crédito?","norma_em_vigor":false,"ocorreu":false},{"id":"worldbuilding-xxi:eixo:florestas:reciprocidade","nome_editorial":"O segredo que não se dá de presente","tradicao_id":"worldbuilding-xxi:tradicao:florestas","hipotese_cultural":"Mapas de bosques","pergunta_politica":"Quem pode revelar?","norma_em_vigor":false,"ocorreu":false}],"eticas_do_conhecimento":[{"id":"worldbuilding-xxi:etica:mapa-duplo","nome_editorial":"Cartografia de camadas","hipotese_de_conhecimento":"Mapa incompleto","dilema_de_responsabilidade":"Sem consentimento?","fonte_paginas":[19,20],"instituicao_cientifica_confirmada":false}],"redes_de_troca":[{"id":"worldbuilding-xxi:troca:mapas-e-comunidades","nome_editorial":"Cartógrafos e comunidades escondidas","tradicoes_relacionadas":["worldbuilding-xxi:tradicao:rochas","worldbuilding-xxi:tradicao:florestas"],"condicao_hipotetica":"Mapas incompletos","pergunta_etica":"Privacidade","acordo_novo_assinado":false}],"conflitos_internos":[{"id":"worldbuilding-xxi:conflito:nome-publico","nome_editorial":"Nome e reputação","tradicao_id":"worldbuilding-xxi:tradicao:rochas","situacao_condicional":"Vários nomes","pergunta_etica":"Quem controla?","aconteceu":false}],"costumes_possiveis":[{"id":"worldbuilding-xxi:costume:jogo-do-ardil","nome_editorial":"Rir do poderoso","tradicao_id":"worldbuilding-xxi:tradicao:rochas","pratica_possivel":"Garl Glittergold","risco_social":"Desconforto","existe_historicamente":false,"ritual_confirmado":false}],"vinhetas":[{"id":"worldbuilding-xxi:vinheta:o-caminho","nome_editorial":"Mapa que termina em branco","tradicao_id":"worldbuilding-xxi:tradicao:florestas","cena_condicional":"O mapa acaba","tema":"Privacidade","ocorreu":false}],"fatos_documentados":[{"id":"worldbuilding-xxi:fato:01","pagina":19,"afirmacao_de_fonte":"Gnomos dispersos","novo_canon":false}],"decisoes_para_autor":[{"id":"worldbuilding-xxi:decisao:nomes","pergunta_autoral":"Nomes múltiplos?","resposta_aprovada":null,"estado":"pendente_de_autoria"}]},
  "gnomish-cultures-indexes.json":{"by_categoria":{"tradicoes":["worldbuilding-xxi:tradicao:rochas","worldbuilding-xxi:tradicao:florestas","worldbuilding-xxi:tradicao:profundezas"]},"by_tradicao":{"worldbuilding-xxi:tradicao:florestas":["worldbuilding-xxi:eixo:florestas:reciprocidade","worldbuilding-xxi:troca:mapas-e-comunidades","worldbuilding-xxi:vinheta:o-caminho"]},"by_estado":{"eixo_social_proposto":["worldbuilding-xxi:eixo:florestas:reciprocidade","worldbuilding-xxi:eixo:rochas:autoria"]},"by_pagina_manuscrito":{"20":["worldbuilding-xxi:tradicao:rochas","worldbuilding-xxi:tradicao:florestas","worldbuilding-xxi:tradicao:profundezas","worldbuilding-xxi:etica:mapa-duplo"]},"by_tema":{"Gnomos das Rochas":["worldbuilding-xxi:tradicao:rochas"]},"by_slug":{"florestas":["worldbuilding-xxi:tradicao:florestas"]}},
  "grama-cortada-daily-life.json":{"aprovacao_autoral":false,"aplicar_ao_canon_automaticamente":false,"referencia_id_regiao":null,"referencia_id_lugar":null,"populacao_confirmada":null,"protagonista_cultural_documentado":"Menelau Folha-Seca","contagens":{"fatos":12,"dominios_da_vida":9,"circuitos_economicos":5,"formas_de_convivencia":4,"conflitos_internos":5,"celebracoes_possiveis":4,"generos_da_memoria":4,"vinhetas":4,"decisoes":8},"dominios_da_vida":[{"estado":"exploracao_cultural_nao_canonica","ocorreu":false,"instituicao_confirmada":false,"fonte_contexto_paginas":[18,19],"id":"worldbuilding-xx:dominios_da_vida:memoria-e-verdade","nome_editorial":"Memória da família","hipotese_social":"Histórias de parentes","contradicao":"Reputação herdada","detalhe_de_cotidiano":"Histórias à mesa","possibilidade_narrativa":"Duas versões"}],"circuitos_economicos":[{"estado":"exploracao_cultural_nao_canonica","ocorreu":false,"instituicao_confirmada":false,"fonte_contexto_paginas":[19],"id":"worldbuilding-xx:circuitos_economicos:hortas-e-despensas","nome_editorial":"Hortas e despensas","hipotese_social":"Raízes e cereais","contradicao":"Desigualdade de estoques","detalhe_de_cotidiano":"Colheita compartilhada","possibilidade_narrativa":"Uma festa sem alimento"}],"formas_de_convivencia":[{"estado":"exploracao_cultural_nao_canonica","ocorreu":false,"instituicao_confirmada":false,"fonte_contexto_paginas":[19],"id":"worldbuilding-xx:formas_de_convivencia:recusa-com-respeito","nome_editorial":"Fechar a porta","hipotese_social":"Privacidade","contradicao":"Pressão comunitária","detalhe_de_cotidiano":"O hóspede","possibilidade_narrativa":"Visita surpresa"}],"conflitos_internos":[{"estado":"exploracao_cultural_nao_canonica","ocorreu":false,"instituicao_confirmada":false,"fonte_contexto_paginas":[19],"id":"worldbuilding-xx:conflitos_internos:abundancia-desigual","nome_editorial":"Desigualdade de despensas","hipotese_social":"Casa pobre","contradicao":"Distribuição","detalhe_de_cotidiano":"Desigualdade","possibilidade_narrativa":"Estoques insuficientes"}],"celebracoes_possiveis":[{"estado":"exploracao_cultural_nao_canonica","ocorreu":false,"instituicao_confirmada":false,"fonte_contexto_paginas":[19],"id":"worldbuilding-xx:celebracoes_possiveis:primeira-semente","nome_editorial":"A primeira semente","hipotese_social":"Reunião de cultivo","contradicao":"Exclusão de famílias","detalhe_de_cotidiano":"Uma semente","possibilidade_narrativa":"Mutirão"}],"generos_da_memoria":[{"estado":"exploracao_cultural_nao_canonica","ocorreu":false,"instituicao_confirmada":false,"fonte_contexto_paginas":[18,19],"id":"worldbuilding-xx:generos_da_memoria:historia-de-familia","nome_editorial":"Histórias de família","hipotese_social":"Tradição oral","contradicao":"Mentiras","detalhe_de_cotidiano":"Avó narra","possibilidade_narrativa":"Versão errada"}],"vinhetas":[{"estado":"exploracao_cultural_nao_canonica","ocorreu":false,"instituicao_confirmada":false,"fonte_contexto_paginas":[19],"id":"worldbuilding-xx:vinhetas:o-bardo-que-nao-chegou","nome_editorial":"O bardo que não chegou","hipotese_social":"Menelau poderia vir","contradicao":"Expectativas","detalhe_de_cotidiano":"Casa arrumada","possibilidade_narrativa":"Um encontro que não aconteceu"}],"decisoes_para_autor":[{"id":"worldbuilding-xx:decisao:territorio","pergunta":"Onde fica o Condado?","estado":"pendente_de_autoria","opcao_escolhida":null}],"fatos_documentados":[{"id":"worldbuilding-xx:fato:01","pagina_manuscrito":18,"afirmacao_de_fonte":"Condado sem rei","estado":"manuscrito_em_revisao","reformulacao_aprovada":false}]},
  "grama-cortada-daily-life-indexes.json":{"by_categoria":{"dominios_da_vida":["worldbuilding-xx:dominios_da_vida:memoria-e-verdade"]},"by_pagina_manuscrito":{"18":["worldbuilding-xx:dominios_da_vida:memoria-e-verdade","worldbuilding-xx:generos_da_memoria:historia-de-familia"]},"by_estado":{"exploracao_cultural_nao_canonica":["worldbuilding-xx:dominios_da_vida:memoria-e-verdade"]},"by_inicial_nome":{"M":["worldbuilding-xx:dominios_da_vida:memoria-e-verdade"]},"by_slug":{"memoria-e-verdade":["worldbuilding-xx:dominios_da_vida:memoria-e-verdade"]}},
  "atlas-authorial-review.json":{"aprovacao_autoral":false,"mutacao_canonica_automatica":false,"contagens":{"dossies":5,"candidatos":103,"decisoes":20,"aprovados":0,"mudancas_canonicas":0},"dossies":[{"id":"worldbuilding-xix:dossie:xiv","ciclo":"XIV","estado":"em_revisao"}],"candidatos":[{"id":"worldbuilding-xix:candidato:001","ciclo":"XIV","tipo":"alternativa","nome":"Mediação do bosque","referencia":{"arquivo":"a","colecao":"eixos","id":"worldbuilding-xiv:eixo:sagrado-druidico"},"estado":"nao_aprovado","homologado":false},{"id":"worldbuilding-xix:candidato:002","ciclo":"XV","tipo":"pacto","nome":"Abrigo sem Vassalagem","referencia":{"arquivo":"b","colecao":"pactos","id":"worldbuilding-xv:pacto:acolhimento-sem-vassalagem"},"estado":"nao_aprovado","homologado":false}],"decisoes":[{"id":"worldbuilding-xix:decisao:autoridade-druida","dominio":"eldroth","prioridade":"alta","pergunta":"Druidas tinham poder de veto?","risco_de_canonizacao":"Sem órgão confirmado","origens":[{"id":"worldbuilding-xv:revisao:autoridade-druidica"}],"pre_requisitos":[],"escolha_aprovada":null,"aprovacao_autoral":false,"publicar_canon":false,"estado":"pendente"},{"id":"worldbuilding-xix:decisao:refugio-feerico","dominio":"eldroth","prioridade":"alta","pergunta":"Refugiados teriam direitos?","risco_de_canonizacao":"Sem dever herdado","origens":[{"id":"worldbuilding-xv:revisao:refugio-feerico"}],"pre_requisitos":["worldbuilding-xix:decisao:autoridade-druida"],"escolha_aprovada":null,"aprovacao_autoral":false,"publicar_canon":false,"estado":"pendente"}],"guardas":[{"id":"worldbuilding-xix:guarda:01","afirmacao":"Fadas refugiadas não são Corte","nova_aprovacao":false}]},
  "atlas-authorial-review-indexes.json":{"by_categoria":{"candidatos":["worldbuilding-xix:candidato:001","worldbuilding-xix:candidato:002"],"decisoes":["worldbuilding-xix:decisao:autoridade-druida","worldbuilding-xix:decisao:refugio-feerico"]},"by_ciclo":{"XIV":["worldbuilding-xix:candidato:001"],"XV":["worldbuilding-xix:candidato:002"]},"by_classe":{"alternativa":["worldbuilding-xix:candidato:001"],"pacto":["worldbuilding-xix:candidato:002"]},"by_dominio":{"eldroth":["worldbuilding-xix:decisao:autoridade-druida","worldbuilding-xix:decisao:refugio-feerico"]},"by_prioridade":{"alta":["worldbuilding-xix:decisao:autoridade-druida","worldbuilding-xix:decisao:refugio-feerico"]},"by_estado":{"pendente":["worldbuilding-xix:decisao:autoridade-druida","worldbuilding-xix:decisao:refugio-feerico"],"nao_aprovado":["worldbuilding-xix:candidato:001","worldbuilding-xix:candidato:002"]},"by_origem_id":{"worldbuilding-xv:revisao:autoridade-druidica":["worldbuilding-xix:decisao:autoridade-druida"]},"by_pre_requisito":{"worldbuilding-xix:decisao:autoridade-druida":["worldbuilding-xix:decisao:refugio-feerico"]},"by_arquivo_fonte":{}},
  "ironwood-civil-society.json":{"aprovacao_autoral":false,"efeito_canonico_automatico":false,"id_lugar_geografico":null,"id_regiao_geografica":null,"lideranca_militar_documentada":"Elara Stormoak","eixos_sociais":[{"id":"worldbuilding-xviii:eixo:infancia","nome_editorial":"Aprender trilhas sem nascer soldado","tema_social":"educacao","base_documental_e_limite":"Crianças aprendem caminhos","tensao_social":"Recrutamento precoce","pergunta_autoral":"Quem educa?","fonte_contextual":{"pagina":18},"instituicao_documentada":false}],"modelos_de_governanca":[{"id":"worldbuilding-xviii:modelo:comando-consultivo","nome_editorial":"Comando consultivo","modelo_hipotetico":"Elara chefia a defesa","estado":"modelo_alternativo_nao_adotado","instituicao_confirmada":false,"fontes_contextuais":[{"pagina":7},{"pagina":18}]}],"relacoes_diplomaticas":[{"id":"worldbuilding-xviii:relacao:thargrid","nome_editorial":"Thargrid: reciprocidade sem subordinação","modelo_de_cooperacao_proposto":"Autonomia","pergunta_politica":"Quais acordos?","tratado_assinado":false,"fontes_contextuais":[{"pagina":6},{"pagina":7}]}],"circuitos_de_cuidado":[{"id":"worldbuilding-xviii:circuito:educacao","nome_editorial":"Educar sem recrutar","trabalho_possivel":"Educação","eixo_id":"worldbuilding-xviii:eixo:infancia","volume_confirmado":null}],"dilemas":[{"id":"worldbuilding-xviii:dilema:crianca-cartografa","nome_editorial":"A criança que conhece os caminhos","cena_condicional":"A criança é convidada","pergunta_etica":"Consentiu?","eixo_id":"worldbuilding-xviii:eixo:infancia","modelo_id":"worldbuilding-xviii:modelo:comando-consultivo","ocorreu":false}],"vinhetas":[{"id":"worldbuilding-xviii:vinheta:trilha","nome_editorial":"A aula sem mapa","cena_condicional":"Uma criança observa a floresta","eixo_id":"worldbuilding-xviii:eixo:infancia","ocorreu":false}],"decisoes_para_autor":[{"id":"worldbuilding-xviii:decisao:infancia","pergunta":"Direitos das crianças?","estado":"pendente_de_aprovacao_autoral"}]},
  "ironwood-civil-society-indexes.json":{"by_categoria":{"eixos_sociais":["worldbuilding-xviii:eixo:infancia"]},"by_tema":{"educacao":["worldbuilding-xviii:eixo:infancia"]},"by_eixo":{"worldbuilding-xviii:eixo:infancia":["worldbuilding-xviii:circuito:educacao","worldbuilding-xviii:dilema:crianca-cartografa","worldbuilding-xviii:vinheta:trilha"]},"by_modelo":{"worldbuilding-xviii:modelo:comando-consultivo":["worldbuilding-xviii:dilema:crianca-cartografa"]},"by_pagina_manuscrito":{"18":["worldbuilding-xviii:eixo:infancia","worldbuilding-xviii:modelo:comando-consultivo"]},"by_estado":{}},
  "vandar-memory-and-dead.json":{"aprovacao_autoral":false,"efeito_canonico_automatico":false,"linha_do_tempo":{"fundacao_ec":null,"queda_ec":null,"comeco_dominio_damaris_ec":null,"numero_de_mortos":null,"numero_de_sobreviventes":null},"resumo":{"fases":3,"tecidos_urbanos":8,"modalidades_de_prova":5,"situacoes_de_morte":4,"papeis_sociais":6,"modelos_do_dominio":3,"vinhetas":4,"decisoes_pendentes":8},"fases":[{"id":"worldbuilding-xvii:fase:anterior-a-ruina","nome":"Vandar próspera","estatuto":"fase_documentada_sem_data","evidencia":{"pagina":5,"sintese":"Cidade próspera"}}],"tecidos_urbanos":[{"id":"worldbuilding-xvii:tecido:moradia-e-bairros","nome_editorial":"A cidade onde se morava","dominio":"habitação_e_vizinhança","pergunta_historica":"Quem tinha moradia?","desdobramento_possivel":"A vida doméstica desapareceu","fonte_contextual":{"pagina":5},"instituicao_urbana_confirmada":false}],"modalidades_de_prova":[{"id":"worldbuilding-xvii:prova:prova-por-testemunho","nome_editorial":"A voz de quem lembra","modalidade":"testemunho_oral","utilizacao_possivel":"Identificar pessoas","fonte_contextual":{"pagina":5},"arquivo_ou_rito_efetivamente_descoberto":false}],"situacoes_de_morte":[{"id":"worldbuilding-xvii:situacao:ausencia","nome_editorial":"Desaparecido","distincao_juridica_proposta":"sem_corpo_confirmado","cautela":"Sem corpo não há prova","fonte_contextual":{"pagina":5},"regimento_aprovado":false}],"papeis_sociais":[{"id":"worldbuilding-xvii:papel:descendente","nome_editorial":"Descendente possível","campo_de_interesse":"reivindicacao_familiar","motivacao_hipotetica":"Memória e casa","personagem_confirmado":false}],"modelos_do_dominio":[{"id":"worldbuilding-xvii:modelo:quartel-de-ruinas","nome_editorial":"Ruínas militarizadas","hipotese_de_poder":"Somente militares","evidencia_comum":{"pagina":5},"configuracao_confirmada":false,"estado":"alternativa_nao_adotada"}],"vinhetas":[{"id":"worldbuilding-xvii:vinheta:chave-sem-casa","nome_editorial":"Chave sem casa","abertura_condicional":"Uma chave que não abre porta","tecido_urbano_id":"worldbuilding-xvii:tecido:moradia-e-bairros","ocorreu":false}],"decisoes_para_autor":[{"id":"worldbuilding-xvii:decisao:queda","estado":"pendente_de_aprovacao_autoral","pergunta":"Quando?"}]},
  "vandar-memory-and-dead-indexes.json":{"by_categoria":{"tecidos_urbanos":["worldbuilding-xvii:tecido:moradia-e-bairros"]},"by_dominio":{"habitação_e_vizinhança":["worldbuilding-xvii:tecido:moradia-e-bairros"]},"by_modalidade":{"testemunho_oral":["worldbuilding-xvii:prova:prova-por-testemunho"]},"by_distincao_juridica":{"sem_corpo_confirmado":["worldbuilding-xvii:situacao:ausencia"]},"by_tecido_urbano":{"worldbuilding-xvii:tecido:moradia-e-bairros":["worldbuilding-xvii:vinheta:chave-sem-casa"]},"by_pagina_manuscrito":{"5":["worldbuilding-xvii:tecido:moradia-e-bairros"]},"by_estado":{}},
  "eldroth-sylara-occupation.json":{"aprovacao_autoral":false,"aplicar_ao_canon_automaticamente":false,"resumo":{"mecanismos":8,"posicoes_sociais":6,"modelos_de_regime":3,"dilemas":4,"vinhetas":4,"politicas_confirmadas":0},"mecanismos":[{"id":"worldbuilding-xvi:mecanismo:agua-licenciada","nome_editorial":"A nascente que exige licença","pratica_xv_id":"worldbuilding-xv:pratica:roda-das-nascentes","dominio":"agua_e_trabalho","conversao_proposta":"Permissão revogável para pegar água","consequencia_material_proposta":"Famílias podem perder acesso à água","fontes_contextuais":[{"pagina":17},{"pagina":5}],"politica_sylara_confirmada":false,"ocorreu":false},{"id":"worldbuilding-xvi:mecanismo:criatura-informante","nome_editorial":"A floresta que fala sob coação","pratica_xv_id":"worldbuilding-xv:pratica:acordos-com-os-silenciosos","dominio":"ecologia","conversao_proposta":"Criatura usada como informante","fontes_contextuais":[{"pagina":17},{"pagina":5}],"politica_sylara_confirmada":false,"ocorreu":false}],"posicoes_sociais":[{"id":"worldbuilding-xvi:posicao:druida-que-ficou","nome_editorial":"Druida que permaneceu","campo_social":"mediacao","rotina_possivel":"Protege a mata","fonte_contextual":{"pagina":17},"pessoa_especifica_confirmada":false}],"modelos_de_regime":[{"id":"worldbuilding-xvi:modelo:intermediarios","nome_editorial":"Senhorios e intermediários","hipotese_de_regime":"Possível delegação","fontes_contextuais":[{"pagina":5}],"estado":"alternativa_nao_adotada"}],"dilemas":[{"id":"worldbuilding-xvi:dilema:ave-culpada","nome_editorial":"Quem falou pela floresta?","tema":"ecologia_e_testemunho","situacao_hipotetica":"Sinal animal mal interpretado","mecanismo_id":"worldbuilding-xvi:mecanismo:criatura-informante","posicao_id":"worldbuilding-xvi:posicao:druida-que-ficou","ocorreu":false}],"vinhetas":[{"id":"worldbuilding-xvi:vinheta:som-no-escuro","nome_editorial":"Um som nas árvores","cena_condicional":"Vizinhos discordam","mecanismo_id":"worldbuilding-xvi:mecanismo:criatura-informante","ocorreu":false}],"decisoes_para_autor":[{"id":"worldbuilding-xvi:questao:governanca","estado":"pendente","pergunta":"Qual governo?"}]},
  "eldroth-sylara-occupation-indexes.json":{"by_categoria":{"mecanismos":["worldbuilding-xvi:mecanismo:agua-licenciada","worldbuilding-xvi:mecanismo:criatura-informante"],"posicoes_sociais":["worldbuilding-xvi:posicao:druida-que-ficou"]},"by_dominio":{"ecologia":["worldbuilding-xvi:mecanismo:criatura-informante"]},"by_pratica_xv":{"worldbuilding-xv:pratica:roda-das-nascentes":["worldbuilding-xvi:mecanismo:agua-licenciada"]},"by_pagina_manuscrito":{"17":["worldbuilding-xvi:mecanismo:agua-licenciada","worldbuilding-xvi:mecanismo:criatura-informante","worldbuilding-xvi:posicao:druida-que-ficou"]},"by_mecanismo":{"worldbuilding-xvi:mecanismo:criatura-informante":["worldbuilding-xvi:dilema:ave-culpada","worldbuilding-xvi:vinheta:som-no-escuro"]},"by_posicao":{"worldbuilding-xvi:posicao:druida-que-ficou":["worldbuilding-xvi:dilema:ave-culpada"]},"by_estado":{}},
  "eldroth-preconquest.json":{"estado":"reconstrucao_historico_cultural_proposta","aprovacao_autoral":false,"aplicar_ao_canon_automaticamente":false,"fases":[{"id":"worldbuilding-xv:fase:antes-501","chave":"antes_501","titulo":"Antes da chegada de fadas","paginas":[17]}],"praticas":[{"id":"worldbuilding-xv:pratica:roda-das-nascentes","nome_editorial":"Roda das Nascentes sem Dono","fase_de_inspiracao":"antes_501","eixos_xiv":["worldbuilding-xiv:eixo:sagrado-druidico"],"fontes_ancora":[{"origem":"manuscrito_hack_capitulo_i","pagina":17}],"mecanismo_social_proposto":"Mediação nas nascentes","vida_cotidiana":"Pessoas transportam água e observam o bosque","tensao_interna":"Repartição injusta","alternativas":[{"estado":"nao_escolhida"}],"estado":"proposta_nao_canonica","existencia_historica_confirmada":false},{"id":"worldbuilding-xv:pratica:mesa-da-hospitalidade","nome_editorial":"A Mesa Onde a Floresta Não Cobra Sangue","fase_de_inspiracao":"refugio_501_665","eixos_xiv":["worldbuilding-xiv:eixo:ondas-feericas"],"fontes_ancora":[{"origem":"manuscrito_hack_capitulo_i","pagina":16}],"mecanismo_social_proposto":"Hospitalidade sem vassalagem","vida_cotidiana":"Dar uma tigela a quem foge","tensao_interna":"Recursos de abrigo","alternativas":[{"estado":"nao_escolhida"}],"estado":"proposta_nao_canonica","existencia_historica_confirmada":false}],"pactos":[{"id":"worldbuilding-xv:pacto:acolhimento-sem-vassalagem","nome_editorial":"Abrigo sem Vassalagem","praticas_associadas":["worldbuilding-xv:pratica:mesa-da-hospitalidade"],"fonte_contextual":[{"origem":"manuscrito_hack_capitulo_i","pagina":16}],"objeto_ou_interesse":"Proteger refugiados","vigente":false,"assinado":false}],"ciclos_materiais":[{"id":"worldbuilding-xv:ciclo-material:água-e-reparo","nome_editorial":"Cuidar da nascente","tarefas_hipoteticas":["transportar_agua"],"praticas_associadas":["worldbuilding-xv:pratica:roda-das-nascentes"],"fonte_contextual":[{"origem":"manuscrito_hack_capitulo_i","pagina":17}],"tensao_social":"Quem cuida de nascentes","volume_confirmado":null}],"vinhetas":[{"id":"worldbuilding-xv:vinheta:primeira-hospitalidade","nome":"A primeira tigela","fase_de_inspiracao":"refugio_501_665","praticas_associadas":["worldbuilding-xv:pratica:mesa-da-hospitalidade"],"abertura_condicional":"Uma família chega e pede comida","ocorreu":false}],"questoes_de_revisao_autoral":[{"id":"worldbuilding-xv:revisao:autoridade-druidica","pergunta":"Quem mediava?","estado":"pendente"}]},
  "eldroth-preconquest-indexes.json":{"by_categoria":{"praticas":["worldbuilding-xv:pratica:roda-das-nascentes","worldbuilding-xv:pratica:mesa-da-hospitalidade"]},"by_fase":{"antes_501":["worldbuilding-xv:pratica:roda-das-nascentes"]},"by_pagina_manuscrito":{"17":["worldbuilding-xv:pratica:roda-das-nascentes"]},"by_ambito_social":{},"by_pratica_referida":{},"by_eixo_xiv":{},"by_tarefa_material":{},"by_status":{}},
  "eldroth-cultural-atlas.json":{"estado":"dossie_de_worldbuilding_em_revisao","aprovacao_autoral":false,"efeito_automatico_no_canon":false,"resumo":{"areas":3,"marcos":6,"eixos":14,"alternativas":42},"areas":[{"id":"worldbuilding-xiv:area:eldroth","nome":"Eldroth","referencia_atlas":"regiao:eldroth"},{"id":"worldbuilding-xiv:area:ironwood","nome":"Ironwood","referencia_atlas":null}],"marcos":[{"ano_ec":501,"evento":"Feéricos refugiados"},{"ano_ec":null,"evento":"Queda de Vandar sem data"}],"eixos":[{"id":"worldbuilding-xiv:eixo:ondas-feericas","area_id":"worldbuilding-xiv:area:eldroth","tema":"Migração feérica e colonialismo","fatos_textuais":[{"fonte":"ambientacao","afirmacao":"Fadas chegam em 501 EC"}],"camada_manuscrito":[{"fonte":"hack-capitulo-i","paginas":[17],"afirmacao":"Refúgio anterior à conquista"}],"leitura_editorial":"O refúgio não é domínio","perguntas_abertas":["Quem acolhia?","Quem decide?"],"efeitos_na_ambientacao":["historia de familias"],"decisoes_autorais_pendentes":[{"opcao":"Alternativa sem aprovação","estado":"alternativa_nao_adotada"}]},{"id":"worldbuilding-xiv:eixo:ironwood-cultura","area_id":"worldbuilding-xiv:area:ironwood","tema":"Vida civil de Ironwood","fatos_textuais":[{"fonte":"ambientacao","afirmacao":"A fortaleza resiste"}],"camada_manuscrito":[{"fonte":"hack-capitulo-i","paginas":[18],"afirmacao":"Rangers organizam a informação"}],"leitura_editorial":"Segurança exige deveres","perguntas_abertas":["Quem controla?","Quem trabalha?"],"efeitos_na_ambientacao":["etica da guerrilha"],"decisoes_autorais_pendentes":[{"opcao":"Alternativa sem aprovação","estado":"alternativa_nao_adotada"}]}]},
  "eldroth-cultural-atlas-indexes.json":{"by_area":{"worldbuilding-xiv:area:eldroth":["worldbuilding-xiv:eixo:ondas-feericas"],"worldbuilding-xiv:area:ironwood":["worldbuilding-xiv:eixo:ironwood-cultura"]},"by_pagina_manuscrito":{"17":["worldbuilding-xiv:eixo:ondas-feericas"],"18":["worldbuilding-xiv:eixo:ironwood-cultura"]}},
  "eldroth-dw-statblocks.json":{"aprovacao_autoral":false,"efetiva_canon":false,"resumo":{"fichas":8,"com_pv":7,"sem_pv_por_ficcao":1,"statblocks_aprovados":0},"fichas":[{"id":"ecologia-xiii:ficha:coruja-do-eco-emprestado","nome":"Coruja do Eco Emprestado","tipo_carcaca_proposto":"fera_sobrenatural","modo":"estatizado","instinto":"Conservar o último som ouvido.","criatura_origem_id":"ecologia-xii:criatura:coruja-do-eco-emprestado","organizacao":{"proposta_dw":"solitario"},"decisoes":{"porte":"miudo","justificativa":"Pequena ave."},"ficha_dw":{"pv":12,"dano":{"expressao":"d8-2"},"tags":["solitario","miudo","magico"]},"aprovacao_autoral":false,"ocorrencia_confirmada":false},{"id":"ecologia-xiii:ficha:micelio-das-vozes-partidas","nome":"Micélio das Vozes Partidas","tipo_carcaca_proposto":"flora","modo":"sem_estatisticas","instinto":"Distribuir sinais de perturbação.","criatura_origem_id":"ecologia-xii:criatura:micelio-das-vozes-partidas","organizacao":{"proposta_dw":"horda"},"decisoes":{"porte":null,"justificativa":"Sem corpo combatente."},"ficha_dw":{"pv":null,"dano":null,"tags":["horda","sem_estatisticas"]},"aprovacao_autoral":false,"ocorrencia_confirmada":false}]},
  "eldroth-dw-statblock-indexes.json":{"by_modo":{"estatizado":["ecologia-xiii:ficha:coruja-do-eco-emprestado"],"sem_estatisticas":["ecologia-xiii:ficha:micelio-das-vozes-partidas"]}},
  "eldroth-monster-ecology.json":{"estado":"propostas_narrativas_nao_canonicas","aprovacao_autoral":false,"efeito_automatico_no_canon":false,"criaturas":[{"id":"ecologia-xii:criatura:coruja-do-eco-emprestado","nome":"Coruja do Eco Emprestado","tipo_carcaca_proposto":"fera_sobrenatural","localizacao_proposta":{"escopo":"eldroth"},"dungeon_world":{"instinto":"Conservar para si o último som ouvido."},"vinculo_cena_anterior":"ironwood-eldroth:cena:passaro-sem-canto","ocorrencia_confirmada":false},{"id":"ecologia-xii:criatura:besouros-da-casca-riscada","nome":"Besouros da Casca Riscada","tipo_carcaca_proposto":"fauna","localizacao_proposta":{"escopo":"ironwood"},"dungeon_world":{"instinto":"Decompor madeira morta."},"vinculo_cena_anterior":"ironwood-eldroth:cena:aprendiz-do-mapa","ocorrencia_confirmada":false}],"encontros":[{"id":"ecologia-xii:encontro:canto-sem-ave","nome":"Um Canto sem Ave","escopo":"eldroth","criaturas_ids":["ecologia-xii:criatura:coruja-do-eco-emprestado"],"cena_anterior_id":"ironwood-eldroth:cena:passaro-sem-canto","abertura_condicional":"Quando o canto é ouvido sem aves.","ocorreu":false}],"pressoes":[{"id":"ecologia-xii:pressao:rastreio-pelo-medo","nome":"A Floresta que Parece Denunciar","escopo":"eldroth","criaturas_ids":["ecologia-xii:criatura:coruja-do-eco-emprestado"],"origem_possivel":"Sons sem fonte.","ocorreu":false,"medicao":null}],"frentes":[{"id":"ecologia-xii:frente:o-bosque-que-informa","nome":"O Bosque que Informa sem Consentimento","escopo":"eldroth","criaturas_ids":["ecologia-xii:criatura:coruja-do-eco-emprestado"],"encontros_ids":["ecologia-xii:encontro:canto-sem-ave"],"impulso_dw_proposto":"Transformar sinal em suspeita.","ocorreu":false,"pressagios_realizados":[]}]},
  "eldroth-monster-ecology-indexes.json":{"by_categoria":{"criaturas":["ecologia-xii:criatura:coruja-do-eco-emprestado","ecologia-xii:criatura:besouros-da-casca-riscada"],"encontros":["ecologia-xii:encontro:canto-sem-ave"],"pressoes":["ecologia-xii:pressao:rastreio-pelo-medo"],"frentes":["ecologia-xii:frente:o-bosque-que-informa"]},"by_tipo_carcaca_proposto":{"fauna":["ecologia-xii:criatura:besouros-da-casca-riscada"]}},
  "ironwood-eldroth-resistance.json":{"estado":"propostas_narrativas_nao_canonicas","aprovacao_autoral":false,"efeito_automatico_no_canon":false,"lugares":[{"id":"ironwood-eldroth:lugar:pouso-das-bainhas","nome":"Pouso das Bainhas Viradas","ambiente":"fortaleza_florestal","rotina_cotidiana":"Abrigo hipotético.","tensao_social":"Controle de fronteiras.","vinculos":["povoamento-proposto:escola-do-caminho-verde"],"movimentos_inspiradores":["movimento-povo:paragrafo-1005"],"estado":"proposta_nao_canonica","local_confirmado":false}],"coletivos":[{"id":"ironwood-eldroth:coletivo:guardioes-do-retorno","nome":"Guardiões do Retorno Consentido","funcao":"acolhimento","rotina_cotidiana":"Acolhimento coletivo.","tensao_social":"Coerção.","vinculos":["povoamento-proposto:escola-do-caminho-verde"],"movimentos_inspiradores":["movimento-povo:paragrafo-1006"],"estado":"proposta_nao_canonica","instituicao_confirmada":false}],"pessoas":[{"id":"ironwood-eldroth:pessoa:vaelis","nome":"Vaelis das Folhas Cifradas","povo":"elfa_da_floresta","reutiliza":"thargrid-social:pessoa:vaelis","rotina_cotidiana":"Mensageira.","tensao_social":"Identidades.","vinculos":["povoamento-proposto:escola-do-caminho-verde"],"movimentos_inspiradores":["movimento-povo:paragrafo-1003"],"estado":"proposta_nao_canonica","localizacao_atual_confirmada":false}],"dilemas":[{"id":"ironwood-eldroth:dilema:queimar-ou-curar","nome":"A Árvore que Pode Ouvir","rotina_cotidiana":"Árvore suspeita.","tensao_social":"Dano ambiental.","vinculos":["povoamento-proposto:correio-dos-esporos"],"movimentos_inspiradores":["movimento-povo:paragrafo-1002"],"estado":"proposta_nao_canonica","ocorreu":false,"opcoes":["Isolar","Investigar","Esperar"]}],"fluxos":[{"id":"ironwood-eldroth:fluxo:resgate-e-pouso","nome":"Aviso sem Rastro","setor":"informacao","rotina_cotidiana":"Alerta.","tensao_social":"Rota secreta.","vinculos":["povoamento-proposto:escola-do-caminho-verde"],"movimentos_inspiradores":["movimento-povo:paragrafo-1003"],"estado":"proposta_nao_canonica","efetivado":false,"quantidade_confirmada":false,"rota_operacional":false}],"acordos":[{"id":"ironwood-eldroth:acordo:refugio-sem-obediencia","nome":"Abrigo não É Juramento","rotina_cotidiana":"Proposta.","tensao_social":"Coerção.","vinculos":["povoamento-proposto:escola-do-caminho-verde"],"movimentos_inspiradores":["movimento-povo:paragrafo-1006"],"estado":"proposta_nao_canonica","vigente":false}],"cenas":[{"id":"ironwood-eldroth:cena:selo-na-capa","nome":"A Capa que Tinha um Selo","rotina_cotidiana":"Encontro.","tensao_social":"Suspeita.","vinculos":["povoamento-proposto:escola-do-caminho-verde"],"movimentos_inspiradores":["movimento-povo:paragrafo-1005"],"estado":"proposta_nao_canonica","ocorreu":false}],"arcos":[{"id":"ironwood-eldroth:arco:direito-ao-retorno","nome":"Voltar Não É Entregar","rotina_cotidiana":"Proteção.","tensao_social":"Liberdade.","vinculos":["povoamento-proposto:escola-do-caminho-verde"],"movimentos_inspiradores":["movimento-povo:paragrafo-1006"],"estado":"proposta_nao_canonica","resultado_confirmado":false}]},
  "ironwood-eldroth-resistance-indexes.json":{"by_categoria":{"lugares":["ironwood-eldroth:lugar:pouso-das-bainhas"],"coletivos":["ironwood-eldroth:coletivo:guardioes-do-retorno"],"pessoas":["ironwood-eldroth:pessoa:vaelis"],"dilemas":["ironwood-eldroth:dilema:queimar-ou-curar"],"fluxos":["ironwood-eldroth:fluxo:resgate-e-pouso"],"acordos":["ironwood-eldroth:acordo:refugio-sem-obediencia"],"cenas":["ironwood-eldroth:cena:selo-na-capa"],"arcos":["ironwood-eldroth:arco:direito-ao-retorno"]},"by_povo":{"elfa_da_floresta":["ironwood-eldroth:pessoa:vaelis"]},"by_ambiente":{"fortaleza_florestal":["ironwood-eldroth:lugar:pouso-das-bainhas"]}},
  "thargrid-social-resistance.json":{"estado":"propostas_narrativas_nao_canonicas","aprovacao_autoral":false,"efeito_automatico_no_canon":false,"lugares":[{"id":"thargrid-social:lugar:patio-da-metade","nome":"Pátio da Metade de Pedra","rotina_cotidiana":"Trabalho comum sob a montanha.","tensao_social":"A tradição exige escolha entre defesa e acolhimento.","vinculos":["povoamento-proposto:conselho-dos-juramentos"],"movimentos_inspiradores":["movimento-povo:paragrafo-884"],"estado":"proposta_nao_canonica","ambiente":"subterraneo","local_confirmado":false}],"coletivos":[{"id":"thargrid-social:coletivo:peso-e-passagem","nome":"Artífices do Peso Justo","rotina_cotidiana":"Trabalho comum sob a montanha.","tensao_social":"A tradição exige escolha entre defesa e acolhimento.","vinculos":["povoamento-proposto:conselho-dos-juramentos"],"movimentos_inspiradores":["movimento-povo:paragrafo-884"],"estado":"proposta_nao_canonica","tradicao":"anões_e_gigantes_de_pedra","instituicao_confirmada":false}],"pessoas":[{"id":"thargrid-social:pessoa:serak","nome":"Serak do Juramento Verificável","rotina_cotidiana":"Trabalho comum sob a montanha.","tensao_social":"A tradição exige escolha entre defesa e acolhimento.","vinculos":["povoamento-proposto:conselho-dos-juramentos"],"movimentos_inspiradores":["movimento-povo:paragrafo-884"],"estado":"proposta_nao_canonica","povo":"draconato","localizacao_atual_confirmada":false}],"dilemas":[{"id":"thargrid-social:dilema:ordenamento-e-cidadania","nome":"Ordenamento Não É Constituição","rotina_cotidiana":"Trabalho comum sob a montanha.","tensao_social":"A tradição exige escolha entre defesa e acolhimento.","vinculos":["povoamento-proposto:conselho-dos-juramentos"],"movimentos_inspiradores":["movimento-povo:paragrafo-884"],"estado":"proposta_nao_canonica","ocorreu":false,"opcoes":["Ouvir","Mediar","Contestar"]}],"fluxos":[{"id":"thargrid-social:fluxo:mineral-e-muralhas","nome":"Da Pedra à Muralha","rotina_cotidiana":"Trabalho comum sob a montanha.","tensao_social":"A tradição exige escolha entre defesa e acolhimento.","vinculos":["povoamento-proposto:conselho-dos-juramentos"],"movimentos_inspiradores":["movimento-povo:paragrafo-884"],"estado":"proposta_nao_canonica","setor":"construcao","efetivado":false,"quantidade_confirmada":false}],"acordos":[{"id":"thargrid-social:acordo:ordem-sem-trono","nome":"Ordenamento sem Soberania Alheia","rotina_cotidiana":"Trabalho comum sob a montanha.","tensao_social":"A tradição exige escolha entre defesa e acolhimento.","vinculos":["povoamento-proposto:conselho-dos-juramentos"],"movimentos_inspiradores":["movimento-povo:paragrafo-884"],"estado":"proposta_nao_canonica","vigente":false}],"cenas":[{"id":"thargrid-social:cena:quem-manda-no-vale","nome":"Quem Manda no Vale?","rotina_cotidiana":"Trabalho comum sob a montanha.","tensao_social":"A tradição exige escolha entre defesa e acolhimento.","vinculos":["povoamento-proposto:conselho-dos-juramentos"],"movimentos_inspiradores":["movimento-povo:paragrafo-884"],"estado":"proposta_nao_canonica","local_id":"thargrid-social:lugar:patio-da-metade","elenco":["thargrid-social:pessoa:serak"],"escolhas":["Investigar","Dialogar","Recusar"]}],"arcos":[{"id":"thargrid-social:arco:politica-de-escala","nome":"A Montanha Não Tem o Tamanho de Um Só Povo","rotina_cotidiana":"Trabalho comum sob a montanha.","tensao_social":"A tradição exige escolha entre defesa e acolhimento.","vinculos":["povoamento-proposto:conselho-dos-juramentos"],"movimentos_inspiradores":["movimento-povo:paragrafo-884"],"estado":"proposta_nao_canonica","cenas":["thargrid-social:cena:quem-manda-no-vale"]}]},
  "thargrid-social-resistance-indexes.json":{"by_categoria":{"lugares":["thargrid-social:lugar:patio-da-metade"],"coletivos":["thargrid-social:coletivo:peso-e-passagem"],"pessoas":["thargrid-social:pessoa:serak"],"dilemas":["thargrid-social:dilema:ordenamento-e-cidadania"],"fluxos":["thargrid-social:fluxo:mineral-e-muralhas"],"acordos":["thargrid-social:acordo:ordem-sem-trono"],"cenas":["thargrid-social:cena:quem-manda-no-vale"],"arcos":["thargrid-social:arco:politica-de-escala"]},"by_povo":{"draconato":["thargrid-social:pessoa:serak"]},"by_tradicao":{"anões_e_gigantes_de_pedra":["thargrid-social:coletivo:peso-e-passagem"]},"by_setor":{"construcao":["thargrid-social:fluxo:mineral-e-muralhas"]},"by_ambiente":{"subterraneo":["thargrid-social:lugar:patio-da-metade"]},"by_movimento_hack":{"movimento-povo:paragrafo-884":["thargrid-social:pessoa:serak"]},"by_semente_anterior":{"povoamento-proposto:conselho-dos-juramentos":["thargrid-social:pessoa:serak"]},"by_local_de_cena":{"thargrid-social:lugar:patio-da-metade":["thargrid-social:cena:quem-manda-no-vale"]},"by_origem":{},"by_destino":{}},
  "garganta-river-social.json":{"estado":"propostas_narrativas_nao_canonicas","aprovacao_autoral":false,"efeito_automatico_no_canon":false,"lugares":[{"id":"rio-garganta:lugar:portas","nome":"Portas de Nome Raspado","vida":"Trabalho sob o controle das autoridades.","conflito":"Obrigações e memórias entram em disputa.","vinculos":["povoamento-proposto:cartorio-das-portas-raspadas"],"movimentos_inspiradores":["movimento-povo:paragrafo-828"],"estado":"proposta_nao_canonica","area":"area-proposta:garganta","ancora":"Garganta ocupada","local_confirmado":false}],"oficios":[{"id":"rio-garganta:oficio:escrita","nome":"Intérpretes de Portas","vida":"Trabalho sob o controle das autoridades.","conflito":"Obrigações e memórias entram em disputa.","vinculos":["povoamento-proposto:cartorio-das-portas-raspadas"],"movimentos_inspiradores":["movimento-povo:paragrafo-828"],"estado":"proposta_nao_canonica","setor":"burocracia","instituicao_confirmada":false}],"pessoas":[{"id":"rio-garganta:pessoa:marxinus","nome":"Marxinus","vida":"Trabalho sob o controle das autoridades.","conflito":"Obrigações e memórias entram em disputa.","vinculos":["povoamento-proposto:cartorio-das-portas-raspadas"],"movimentos_inspiradores":["movimento-povo:paragrafo-828"],"estado":"proposta_nao_canonica","personagem_canonico":true,"local_atual_confirmado":false}],"circuitos":[{"id":"rio-garganta:circuito:minas","nome":"Minério e Permissões","vida":"Trabalho sob o controle das autoridades.","conflito":"Obrigações e memórias entram em disputa.","vinculos":["povoamento-proposto:cartorio-das-portas-raspadas"],"movimentos_inspiradores":["movimento-povo:paragrafo-828"],"estado":"proposta_nao_canonica","efetivado":false,"quantidade_confirmada":false}],"memorias":[{"id":"rio-garganta:memoria:211","nome":"Garganta Livre, 211 EC","vida":"Trabalho sob o controle das autoridades.","conflito":"Obrigações e memórias entram em disputa.","vinculos":["povoamento-proposto:cartorio-das-portas-raspadas"],"movimentos_inspiradores":["movimento-povo:paragrafo-828"],"estado":"proposta_nao_canonica","ano_ec":211,"episodio_novo_confirmado":false}],"acordos":[{"id":"rio-garganta:acordo:nome","nome":"O Nome não é Mercadoria","vida":"Trabalho sob o controle das autoridades.","conflito":"Obrigações e memórias entram em disputa.","vinculos":["povoamento-proposto:cartorio-das-portas-raspadas"],"movimentos_inspiradores":["movimento-povo:paragrafo-828"],"estado":"proposta_nao_canonica","vigente":false}],"cenas":[{"id":"rio-garganta:cena:porta","nome":"A Porta sem Nome","vida":"Trabalho sob o controle das autoridades.","conflito":"Obrigações e memórias entram em disputa.","vinculos":["povoamento-proposto:cartorio-das-portas-raspadas"],"movimentos_inspiradores":["movimento-povo:paragrafo-828"],"estado":"proposta_nao_canonica","local_id":"rio-garganta:lugar:portas","elenco":["rio-garganta:pessoa:marxinus"],"escolhas":["Verificar","Proteger","Ouvir"]}],"arcos":[{"id":"rio-garganta:arco:nomes","nome":"Nomes Que a Corte Apagou","vida":"Trabalho sob o controle das autoridades.","conflito":"Obrigações e memórias entram em disputa.","vinculos":["povoamento-proposto:cartorio-das-portas-raspadas"],"movimentos_inspiradores":["movimento-povo:paragrafo-828"],"estado":"proposta_nao_canonica","cenas":["rio-garganta:cena:porta"]}]},
  "garganta-river-social-indexes.json":{"by_categoria":{"lugares":["rio-garganta:lugar:portas"],"oficios":["rio-garganta:oficio:escrita"],"pessoas":["rio-garganta:pessoa:marxinus"],"circuitos":["rio-garganta:circuito:minas"],"memorias":["rio-garganta:memoria:211"],"acordos":["rio-garganta:acordo:nome"],"cenas":["rio-garganta:cena:porta"],"arcos":["rio-garganta:arco:nomes"]},"by_area_proposta":{"area-proposta:garganta":["rio-garganta:lugar:portas"]},"by_setor":{"burocracia":["rio-garganta:oficio:escrita"]},"by_movimento_hack":{"movimento-povo:paragrafo-828":["rio-garganta:lugar:portas"]},"by_semente_anterior":{"povoamento-proposto:cartorio-das-portas-raspadas":["rio-garganta:lugar:portas"]},"by_ancora_canonica":{"Garganta ocupada":["rio-garganta:lugar:portas"]},"by_cena_local":{"rio-garganta:lugar:portas":["rio-garganta:cena:porta"]},"by_origem":{},"by_destino":{}},
  "costa-sul-sea-pressure.json":{"estado":"propostas_narrativas_nao_canonicas","aprovacao_autoral":false,"efeito_automatico_no_canon":false,"nucleos":[{"id":"costa-mar:nucleo:mesa-do-sal","nome":"Mesa do Sal que Não Sobra","rotina_cotidiana":"Trabalho diário e dependência da travessia.","tensao_politica":"Risco de cobrança contestada por viajantes.","referencias":["lugar:portomonte"],"movimentos_inspiradores":["movimento-povo:paragrafo-831"],"estado":"proposta_nao_canonica","territorio":"portomonte","local_confirmado":false,"estrutura_oficial":false}],"oficios":[{"id":"costa-mar:oficio:costureiros-da-travessia","nome":"Costureiros da Travessia","rotina_cotidiana":"Trabalho diário e dependência da travessia.","tensao_politica":"Risco de cobrança contestada por viajantes.","referencias":["lugar:portomonte"],"movimentos_inspiradores":["movimento-povo:paragrafo-831"],"estado":"proposta_nao_canonica","setor":"reparo","oficio_confirmado":false}],"pessoas":[{"id":"costa-mar:pessoa:gema","nome":"Gema da Falésia","rotina_cotidiana":"Trabalho diário e dependência da travessia.","tensao_politica":"Risco de cobrança contestada por viajantes.","referencias":["lugar:portomonte"],"movimentos_inspiradores":["movimento-povo:paragrafo-831"],"estado":"proposta_nao_canonica","papel":"agricultora","reutiliza":"costa-sul:pessoa:gema"}],"impactos":[{"id":"costa-mar:impacto:taxa-de-pescaria","nome":"A Taxa Sobre a Pesca Ainda Não Feita","rotina_cotidiana":"Trabalho diário e dependência da travessia.","tensao_politica":"Risco de cobrança contestada por viajantes.","referencias":["lugar:portomonte"],"movimentos_inspiradores":["movimento-povo:paragrafo-831"],"estado":"proposta_nao_canonica","ocorreu":false,"efeito_em_cadeia":["Dúvida","Custo","Debate"]}],"fluxos":[{"id":"costa-mar:fluxo:tributo-contestado","nome":"Cobrança Contestada nas Duas Águas","rotina_cotidiana":"Trabalho diário e dependência da travessia.","tensao_politica":"Risco de cobrança contestada por viajantes.","referencias":["lugar:portomonte"],"movimentos_inspiradores":["movimento-povo:paragrafo-831"],"estado":"proposta_nao_canonica","setor":"tributo","efetivado":false,"quantidade_confirmada":false}],"acordos":[{"id":"costa-mar:acordo:cobranca-com-prova","nome":"Cobrança Só Após Serviço Comprovado","rotina_cotidiana":"Trabalho diário e dependência da travessia.","tensao_politica":"Risco de cobrança contestada por viajantes.","referencias":["lugar:portomonte"],"movimentos_inspiradores":["movimento-povo:paragrafo-831"],"estado":"proposta_nao_canonica","vigente":false}],"cenas":[{"id":"costa-mar:cena:a-taxa-sem-peixe","nome":"A Taxa Sobre o Peixe que Não Veio","rotina_cotidiana":"Trabalho diário e dependência da travessia.","tensao_politica":"Risco de cobrança contestada por viajantes.","referencias":["lugar:portomonte"],"movimentos_inspiradores":["movimento-povo:paragrafo-831"],"estado":"proposta_nao_canonica","elenco":["costa-mar:pessoa:gema"],"nucleo":"costa-mar:nucleo:mesa-do-sal","escolhas":["Verificar","Negociar","Recusar"]}],"arcos":[{"id":"costa-mar:arco:direito-de-passar","nome":"Quem Pode Cobrar pelo Mar?","rotina_cotidiana":"Trabalho diário e dependência da travessia.","tensao_politica":"Risco de cobrança contestada por viajantes.","referencias":["lugar:portomonte"],"movimentos_inspiradores":["movimento-povo:paragrafo-831"],"estado":"proposta_nao_canonica","cenas":["costa-mar:cena:a-taxa-sem-peixe"]}]},
  "costa-sul-sea-pressure-indexes.json":{"by_categoria":{"nucleos":["costa-mar:nucleo:mesa-do-sal"],"oficios":["costa-mar:oficio:costureiros-da-travessia"],"pessoas":["costa-mar:pessoa:gema"],"impactos":["costa-mar:impacto:taxa-de-pescaria"],"fluxos":["costa-mar:fluxo:tributo-contestado"],"acordos":["costa-mar:acordo:cobranca-com-prova"],"cenas":["costa-mar:cena:a-taxa-sem-peixe"],"arcos":["costa-mar:arco:direito-de-passar"]},"by_territorio":{"portomonte":["costa-mar:nucleo:mesa-do-sal"]},"by_setor":{"reparo":["costa-mar:oficio:costureiros-da-travessia"]},"by_papel":{"agricultora":["costa-mar:pessoa:gema"]},"by_movimento_hack":{"movimento-povo:paragrafo-831":["costa-mar:nucleo:mesa-do-sal"]},"by_referencia":{"lugar:portomonte":["costa-mar:nucleo:mesa-do-sal"]},"by_personagem_reutilizado":{"costa-sul:pessoa:gema":["costa-mar:pessoa:gema"]},"by_origem":{},"by_destino":{}},
  "mar-sangue-economy.json":{"estado":"propostas_narrativas_nao_canonicas","aprovacao_autoral":false,"efeito_automatico_no_canon":false,"polos":[{"id":"economia-mar:polo:lastro","nome":"Pátio do Lastro de Coral","rotina":"Pessoas exercem trabalho cotidiano sob pressões políticas.","conflito":"Autoridades contestam obrigações e direitos comuns.","referencias":["diplomacia-mar:polo:velarium"],"movimentos_inspiradores":["movimento-povo:paragrafo-936"],"estado":"proposta_nao_canonica","aguas":"azuis","local_confirmado":false}],"oficios":[{"id":"economia-mar:oficio:guias","nome":"Guias da Linha Errante","rotina":"Pessoas exercem trabalho cotidiano sob pressões políticas.","conflito":"Autoridades contestam obrigações e direitos comuns.","referencias":["diplomacia-mar:polo:velarium"],"movimentos_inspiradores":["movimento-povo:paragrafo-936"],"estado":"proposta_nao_canonica","setor":"navegacao","oficio_canonico":false}],"pessoas":[{"id":"economia-mar:pessoa:maura","nome":"Maura da Última Cláusula","rotina":"Pessoas exercem trabalho cotidiano sob pressões políticas.","conflito":"Autoridades contestam obrigações e direitos comuns.","referencias":["diplomacia-mar:polo:velarium"],"movimentos_inspiradores":["movimento-povo:paragrafo-936"],"estado":"proposta_nao_canonica","povo":"abissais","reutiliza":"diplomacia-mar:pessoa:maura"}],"fluxos":[{"id":"economia-mar:fluxo:pesca","nome":"Direito de Pescar Não É Peixe","rotina":"Pessoas exercem trabalho cotidiano sob pressões políticas.","conflito":"Autoridades contestam obrigações e direitos comuns.","referencias":["diplomacia-mar:polo:velarium"],"movimentos_inspiradores":["movimento-povo:paragrafo-936"],"estado":"proposta_nao_canonica","setor":"subsistencia","efetivado":false,"quantidade_confirmada":false}],"tributos":[{"id":"economia-mar:tributo:herdado","nome":"Tarifa Herdada","rotina":"Pessoas exercem trabalho cotidiano sob pressões políticas.","conflito":"Autoridades contestam obrigações e direitos comuns.","referencias":["diplomacia-mar:polo:velarium"],"movimentos_inspiradores":["movimento-povo:paragrafo-936"],"estado":"proposta_nao_canonica","vigente":false,"abuso":"dependencia_hereditaria"}],"clandestinas":[{"id":"economia-mar:circuito:lista","nome":"Passagem Sem Lista","rotina":"Pessoas exercem trabalho cotidiano sob pressões políticas.","conflito":"Autoridades contestam obrigações e direitos comuns.","referencias":["diplomacia-mar:polo:velarium"],"movimentos_inspiradores":["movimento-povo:paragrafo-936"],"estado":"proposta_nao_canonica","ocorrencia_confirmada":false,"rota_operacional":false}],"cenas":[{"id":"economia-mar:cena:rede","nome":"A Rede Vazia Ainda Paga","rotina":"Pessoas exercem trabalho cotidiano sob pressões políticas.","conflito":"Autoridades contestam obrigações e direitos comuns.","referencias":["diplomacia-mar:polo:velarium"],"movimentos_inspiradores":["movimento-povo:paragrafo-936"],"estado":"proposta_nao_canonica","escolhas":["Investigar","Negociar","Proteger"]}],"arcos":[{"id":"economia-mar:arco:pacto","nome":"O Tributo Que Não Protege","rotina":"Pessoas exercem trabalho cotidiano sob pressões políticas.","conflito":"Autoridades contestam obrigações e direitos comuns.","referencias":["diplomacia-mar:polo:velarium"],"movimentos_inspiradores":["movimento-povo:paragrafo-936"],"estado":"proposta_nao_canonica","cenas":["economia-mar:cena:rede"]}]},
  "mar-sangue-economy-indexes.json":{"by_categoria":{"polos":["economia-mar:polo:lastro"],"oficios":["economia-mar:oficio:guias"],"pessoas":["economia-mar:pessoa:maura"],"fluxos":["economia-mar:fluxo:pesca"],"tributos":["economia-mar:tributo:herdado"],"clandestinas":["economia-mar:circuito:lista"],"cenas":["economia-mar:cena:rede"],"arcos":["economia-mar:arco:pacto"]},"by_setor":{"subsistencia":["economia-mar:fluxo:pesca"]},"by_povo":{"abissais":["economia-mar:pessoa:maura"]},"by_aguas":{"azuis":["economia-mar:polo:lastro"]},"by_abuso":{"dependencia_hereditaria":["economia-mar:tributo:herdado"]},"by_movimento_hack":{"movimento-povo:paragrafo-936":["economia-mar:pessoa:maura"]},"by_referencia":{"diplomacia-mar:polo:velarium":["economia-mar:polo:lastro"]},"by_origem":{},"by_destino":{}},
  "mar-sangue-diplomacy.json":{"estado":"propostas_narrativas_nao_canonicas","aprovacao_autoral":false,"efeito_automatico_no_canon":false,"polos":[{"id":"diplomacia-mar:polo:velarium","nome":"Velarium dos Corais Juramentados","contexto_proposto":"Proposta institucional inspirada no Hack e ainda não aprovada.","vida_ordinaria":"Representantes negociam os recursos usados no cotidiano.","questao_politica":"A obrigação de um grupo pode tornar-se dominação.","movimentos_inspiradores":["movimento-povo:paragrafo-945"],"referencias":["lugar:ilhas-costa-sul"],"estado":"proposta_nao_canonica","aguas":"azuis","cidade_confirmada":false}],"casas":[{"id":"diplomacia-mar:casa:decima","nome":"Círculo da Décima Concha","contexto_proposto":"Proposta institucional inspirada no Hack e ainda não aprovada.","vida_ordinaria":"Representantes negociam os recursos usados no cotidiano.","questao_politica":"A obrigação de um grupo pode tornar-se dominação.","movimentos_inspiradores":["movimento-povo:paragrafo-945"],"referencias":["lugar:ilhas-costa-sul"],"estado":"proposta_nao_canonica","bloco":"tributo","entidade_reconhecida":false}],"pessoas":[{"id":"diplomacia-mar:pessoa:nilku","nome":"Nilku das Marés Discutidas","contexto_proposto":"Proposta institucional inspirada no Hack e ainda não aprovada.","vida_ordinaria":"Representantes negociam os recursos usados no cotidiano.","questao_politica":"A obrigação de um grupo pode tornar-se dominação.","movimentos_inspiradores":["movimento-povo:paragrafo-945"],"referencias":["lugar:ilhas-costa-sul"],"estado":"proposta_nao_canonica","povo":"kuo-toa","reutiliza":"mar-sangue:pessoa:nilku"}],"disputas":[{"id":"diplomacia-mar:sucessao:trono-vazio","nome":"O Trono que Talvez Fique Vazio","contexto_proposto":"Proposta institucional inspirada no Hack e ainda não aprovada.","vida_ordinaria":"Representantes negociam os recursos usados no cotidiano.","questao_politica":"A obrigação de um grupo pode tornar-se dominação.","movimentos_inspiradores":["movimento-povo:paragrafo-945"],"referencias":["lugar:ilhas-costa-sul"],"estado":"proposta_nao_canonica","status_evento":"nao_ocorrido","candidatos":["diplomacia-mar:pessoa:nilku"]}],"tratados":[{"id":"diplomacia-mar:tratado:recifes-autonomos","nome":"Pacto dos Recifes sem Coroa","contexto_proposto":"Proposta institucional inspirada no Hack e ainda não aprovada.","vida_ordinaria":"Representantes negociam os recursos usados no cotidiano.","questao_politica":"A obrigação de um grupo pode tornar-se dominação.","movimentos_inspiradores":["movimento-povo:paragrafo-945"],"referencias":["lugar:ilhas-costa-sul"],"estado":"proposta_nao_canonica","vigente":false,"signatarios_propostos":["diplomacia-mar:pessoa:nilku"]}],"cenas":[{"id":"diplomacia-mar:cena:mensagem-tres-vozes","nome":"A Mensagem em Três Vozes","contexto_proposto":"Proposta institucional inspirada no Hack e ainda não aprovada.","vida_ordinaria":"Representantes negociam os recursos usados no cotidiano.","questao_politica":"A obrigação de um grupo pode tornar-se dominação.","movimentos_inspiradores":["movimento-povo:paragrafo-945"],"referencias":["lugar:ilhas-costa-sul"],"estado":"proposta_nao_canonica","elenco":["diplomacia-mar:pessoa:nilku"],"opcoes":["Ouvir","Debater","Contestar"]}],"missoes":[{"id":"diplomacia-mar:missao:buscar-versoes","nome":"A Cópia que Não Cabe no Coral","contexto_proposto":"Proposta institucional inspirada no Hack e ainda não aprovada.","vida_ordinaria":"Representantes negociam os recursos usados no cotidiano.","questao_politica":"A obrigação de um grupo pode tornar-se dominação.","movimentos_inspiradores":["movimento-povo:paragrafo-945"],"referencias":["lugar:ilhas-costa-sul"],"estado":"proposta_nao_canonica","entregavel_narrativo":"Relatório de versões"}],"arcos":[{"id":"diplomacia-mar:arco:paz-sem-coroa","nome":"A Paz que Não Pode Ter Coroa","contexto_proposto":"Proposta institucional inspirada no Hack e ainda não aprovada.","vida_ordinaria":"Representantes negociam os recursos usados no cotidiano.","questao_politica":"A obrigação de um grupo pode tornar-se dominação.","movimentos_inspiradores":["movimento-povo:paragrafo-945"],"referencias":["lugar:ilhas-costa-sul"],"estado":"proposta_nao_canonica","cenas":["diplomacia-mar:cena:mensagem-tres-vozes"]}]},
  "mar-sangue-diplomacy-indexes.json":{"by_categoria":{"polos":["diplomacia-mar:polo:velarium"],"casas":["diplomacia-mar:casa:decima"],"pessoas":["diplomacia-mar:pessoa:nilku"],"disputas":["diplomacia-mar:sucessao:trono-vazio"],"tratados":["diplomacia-mar:tratado:recifes-autonomos"],"cenas":["diplomacia-mar:cena:mensagem-tres-vozes"],"missoes":["diplomacia-mar:missao:buscar-versoes"],"arcos":["diplomacia-mar:arco:paz-sem-coroa"]},"by_aguas":{"azuis":["diplomacia-mar:polo:velarium"]},"by_povo":{"kuo-toa":["diplomacia-mar:pessoa:nilku"]},"by_bloco":{"tributo":["diplomacia-mar:casa:decima"]},"by_movimento_hack":{"movimento-povo:paragrafo-945":["diplomacia-mar:polo:velarium"]},"by_referencia":{"lugar:ilhas-costa-sul":["diplomacia-mar:polo:velarium"]},"by_personagem_reutilizado":{"mar-sangue:pessoa:nilku":["diplomacia-mar:pessoa:nilku"]}},
  "mar-sangue-social-ecology.json":{"estado":"propostas_narrativas_nao_canonicas","aprovacao_autoral":false,"efeito_automatico_no_canon":false,"zonas":[{"id":"mar-sangue:zona:santuario","nome":"Entremeios dos Santuários","rotina":"Prática cotidiana e disputa local em águas perigosas.","tensao":"Dilema político ainda não resolvido.","referencias_hack":["movimento-povo:paragrafo-913"],"ligacoes":["regiao:costa-sul"],"estado":"proposta","aguas":"vermelhas","localizacao_confirmada":false}],"coletivos":[{"id":"mar-sangue:coletivo:vigia-da-fe","nome":"Monitores da Vigília","rotina":"Prática cotidiana e disputa local em águas perigosas.","tensao":"Dilema político ainda não resolvido.","referencias_hack":["movimento-povo:paragrafo-913"],"ligacoes":["regiao:costa-sul"],"estado":"proposta","povo":"kuo-toa","instituicao_confirmada":false}],"pessoas":[{"id":"mar-sangue:pessoa:nilku","nome":"Nilku das Marés Discutidas","rotina":"Prática cotidiana e disputa local em águas perigosas.","tensao":"Dilema político ainda não resolvido.","referencias_hack":["movimento-povo:paragrafo-913"],"ligacoes":["regiao:costa-sul"],"estado":"proposta","povo":"kuo-toa","reutiliza":"fronteira:pessoa:nilku"}],"pactos":[{"id":"mar-sangue:pacto:tributo","nome":"Tributo por Passagem Segura","rotina":"Prática cotidiana e disputa local em águas perigosas.","tensao":"Dilema político ainda não resolvido.","referencias_hack":["movimento-povo:paragrafo-913"],"ligacoes":["regiao:costa-sul"],"estado":"proposta","vigente":false}],"fenomenos":[{"id":"mar-sangue:fenomeno:limite","nome":"A Linha que Não Dorme","rotina":"Prática cotidiana e disputa local em águas perigosas.","tensao":"Dilema político ainda não resolvido.","referencias_hack":["movimento-povo:paragrafo-913"],"ligacoes":["regiao:costa-sul"],"estado":"proposta","ocorrencia_individual_confirmada":false}],"cenas":[{"id":"mar-sangue:cena:testemunha","nome":"A Testemunha de Nove Anos","rotina":"Prática cotidiana e disputa local em águas perigosas.","tensao":"Dilema político ainda não resolvido.","referencias_hack":["movimento-povo:paragrafo-913"],"ligacoes":["regiao:costa-sul"],"estado":"proposta","elenco":["mar-sangue:pessoa:nilku"],"escolhas":["Ouvir","Investigar","Proteger"]}],"tramas":[{"id":"mar-sangue:trama:deus","nome":"O Deus que Alguém Precisava Ver","rotina":"Prática cotidiana e disputa local em águas perigosas.","tensao":"Dilema político ainda não resolvido.","referencias_hack":["movimento-povo:paragrafo-913"],"ligacoes":["regiao:costa-sul"],"estado":"proposta","cenas":["mar-sangue:cena:testemunha"]}]},
  "mar-sangue-social-ecology-indexes.json":{"by_categoria":{"zonas":["mar-sangue:zona:santuario"],"coletivos":["mar-sangue:coletivo:vigia-da-fe"],"pessoas":["mar-sangue:pessoa:nilku"],"pactos":["mar-sangue:pacto:tributo"],"fenomenos":["mar-sangue:fenomeno:limite"],"cenas":["mar-sangue:cena:testemunha"],"tramas":["mar-sangue:trama:deus"]},"by_povo":{"kuo-toa":["mar-sangue:coletivo:vigia-da-fe","mar-sangue:pessoa:nilku"]},"by_aguas":{"vermelhas":["mar-sangue:zona:santuario"]},"by_movimento_hack":{"movimento-povo:paragrafo-913":["mar-sangue:zona:santuario"]},"by_ligacao":{"regiao:costa-sul":["mar-sangue:zona:santuario"]}},
  "costa-sul-social-fabric.json":{"regiao_id":"regiao:costa-sul","estado":"propostas_narrativas_nao_canonicas","aprovacao_autoral":false,"efeito_automatico_no_canon":false,"espacos":[{"id":"costa-sul:espaco:pedra-molhada","nome":"Pátio da Pedra Molhada","cotidiano":"Trabalho comum em um lugar hipotético.","conflito":"Duas necessidades locais entram em disputa.","movimentos_inspiradores":["movimento-povo:paragrafo-829"],"referencias":["lugar:portomonte"],"estado":"proposta","escopo":"portomonte","localizacao_confirmada":false},{"id":"costa-sul:espaco:contas-agua","nome":"Mesa das Contas da Água","cotidiano":"Trabalho comum em um lugar hipotético.","conflito":"Duas necessidades locais entram em disputa.","movimentos_inspiradores":["movimento-povo:paragrafo-829"],"referencias":["lugar:portomonte"],"estado":"proposta","escopo":"portomonte","localizacao_confirmada":false}],"redes":[{"id":"costa-sul:rede:casco","nome":"Caderno das Palavras de Casco","cotidiano":"Trabalho comum em um lugar hipotético.","conflito":"Duas necessidades locais entram em disputa.","movimentos_inspiradores":["movimento-povo:paragrafo-829"],"referencias":["lugar:portomonte"],"estado":"proposta","escopo":"ilhas_nao_individualizadas","ilha_confirmada":false,"coabitacao_confirmada":false,"rota_confirmada":false}],"pessoas":[{"id":"costa-sul:pessoa:gema","nome":"Gema da Falésia","cotidiano":"Trabalho comum em um lugar hipotético.","conflito":"Duas necessidades locais entram em disputa.","movimentos_inspiradores":["movimento-povo:paragrafo-829"],"referencias":["lugar:portomonte"],"estado":"proposta","reutiliza":"fronteira:pessoa:gema"}],"praticas":[{"id":"costa-sul:pratica:turno","nome":"Turno do Cultivo na Pedra","cotidiano":"Trabalho comum em um lugar hipotético.","conflito":"Duas necessidades locais entram em disputa.","movimentos_inspiradores":["movimento-povo:paragrafo-829"],"referencias":["lugar:portomonte"],"estado":"proposta","participantes":["costa-sul:pessoa:gema"]}],"circulacoes":[{"id":"costa-sul:circulacao:ferragens","nome":"Ferragem de Duas Vidas","cotidiano":"Trabalho comum em um lugar hipotético.","conflito":"Duas necessidades locais entram em disputa.","movimentos_inspiradores":["movimento-povo:paragrafo-829"],"referencias":["lugar:portomonte"],"estado":"proposta","fluxo_confirmado":false}],"cenas":[{"id":"costa-sul:cena:contas","nome":"As Contas Não Bebem Água","cotidiano":"Trabalho comum em um lugar hipotético.","conflito":"Duas necessidades locais entram em disputa.","movimentos_inspiradores":["movimento-povo:paragrafo-829"],"referencias":["lugar:portomonte"],"estado":"proposta","local_id":"costa-sul:espaco:contas-agua","pessoas_ids":["costa-sul:pessoa:gema"],"escolhas":["Investigar","Negociar","Proteger"]}],"tramas":[{"id":"costa-sul:trama:medida","nome":"O Milagre e a Medida","cotidiano":"Trabalho comum em um lugar hipotético.","conflito":"Duas necessidades locais entram em disputa.","movimentos_inspiradores":["movimento-povo:paragrafo-829"],"referencias":["lugar:portomonte"],"estado":"proposta","pontos":["costa-sul:espaco:pedra-molhada"]}]},
  "costa-sul-social-fabric-indexes.json":{"by_categoria":{"espacos":["costa-sul:espaco:pedra-molhada","costa-sul:espaco:contas-agua"],"redes":["costa-sul:rede:casco"]},"by_movimento_hack":{"movimento-povo:paragrafo-829":["costa-sul:espaco:pedra-molhada"]},"by_referencia":{"lugar:portomonte":["costa-sul:espaco:pedra-molhada"]},"by_escopo":{"portomonte":["costa-sul:espaco:pedra-molhada"]},"by_local_de_cena":{"costa-sul:espaco:contas-agua":["costa-sul:cena:contas"]}},
  "frontier-caatinga-costa-sul.json":{"estado":"propostas_narrativas_nao_canonicas","regioes_envolvidas":["regiao:caatinga","regiao:costa-sul"],"aprovacao_autoral":false,"efeito_automatico_no_canon":false,"encontros":[{"id":"fronteira:encontro:boca-do-pano","nome":"Boca do Pano Pardo","ancora_regional":"regiao:caatinga","territorio_hypotetico":true,"localizacao_confirmada":false,"conceito":"Ponto de encontro temporário junto a uma caravana que muda de lugar, sem estrada, posto ou fronteira territorial fixa.","vida_cotidiana":"O tecido estendido no chão indica que se pode conversar sem exibir armas; uma pessoa traduz termos dos contratos enquanto outras consertam recipientes, sandálias e ferramentas.","conflito":"Uma guarda tenta transformar o pano de negociação em posto permanente de cobrança.","conexoes_preexistentes":["caatinga:comunidade:feira-ferragens","caatinga:pessoa:tiru"],"restricao_de_canon":"O encontro não comprova comércio direto entre Caatinga e Portomonte.","estado":"proposta"},{"id":"fronteira:encontro:varanda-da-agua","nome":"Varanda da Água Retornada","ancora_regional":"regiao:costa-sul","territorio_hypotetico":true,"localizacao_confirmada":false,"conceito":"Pátio comunitário proposto junto a lavouras da região de Portomonte, não um anexo conhecido do templo de Deméter.","vida_cotidiana":"Trabalhadores trocam conhecimento sobre plantio em pedra, restauração de ferramentas e formas de poupar água nas tarefas agrícolas.","conflito":"Um grupo de agricultores teme que um acordo com viajantes leve à distribuição indevida da água ritual reservada às lavouras.","conexoes_preexistentes":["lugar:portomonte","assentamento:portomonte","povoamento-proposto:hortas-do-sal"],"restricao_de_canon":"Purificação para lavouras não comprova água potável nem volume excedente.","estado":"proposta"}],"pessoas":[{"id":"fronteira:pessoa:nala","nome":"Nala Duas-Balas","base_regional":"regiao:caatinga","relacao_com_personagem_existente":"caatinga:pessoa:nala","papel_social":"Armeira itinerante; personagem reaproveitada do ciclo anterior.","objetivo":"Negociar ferramentas sem incentivar ataques contra quem cultiva o litoral.","medo":"Que barrar uma venda deixe os aprendizes sem recursos.","dilema_pessoal":"Aceita reparar um arado pelo preço do metal, mas receberá uma grande encomenda de armas na mesma tarde.","primeira_aparicao":"Exige que o cliente escreva o destino da compra antes de negociar.","referencias":["caatinga:comunidade:feira-ferragens"],"movimentos_inspiradores":["movimento-classe:paragrafo-2760","movimento-classe:paragrafo-2782"],"estado":"proposta"},{"id":"fronteira:pessoa:tiru","nome":"Tiru das Trilhas Curvas","base_regional":"regiao:caatinga","relacao_com_personagem_existente":"caatinga:pessoa:tiru","papel_social":"Mensageiro que evita assumir compromissos por todo um povo.","objetivo":"Proteger viajantes sem divulgar caminhos de refúgio.","medo":"Que sua informação seja transformada em rota de caça.","dilema_pessoal":"Sabe que omitir uma trilha pode deixar uma família esperando socorro.","primeira_aparicao":"Entrega um contrato onde as duas partes assinaram entendimentos diferentes.","referencias":["caatinga:comunidade:feira-ferragens","caatinga:rota:fronteira-sem-pontos"],"movimentos_inspiradores":["movimento-povo:paragrafo-831","movimento-classe:paragrafo-2782"],"estado":"proposta"}],"acordos":[{"id":"fronteira:acordo:primeira-tigela","nome":"Direito à Primeira Tigela","quem_tentaria_assinar":["fronteira:pessoa:gema","fronteira:pessoa:mara","fronteira:pessoa:borr"],"protocolo_proposto":"Um visitante pode pedir socorro básico sem precisar entregar arma, título ou identidade; qualquer provisão extra depende de negociação e capacidade real.","beneficio_se_funcionar":"Reduz decisões desesperadas e cria linguagem comum de hospitalidade.","custo_da_confianca":"Alguém precisa fornecer alimento, abrigo e recursos que não são infinitos.","conflito_de_interpretacao":"A obrigação de acolher não comprova direito a retirar água do templo de Deméter.","modo_de_fracasso":"Anfitriões podem ser pressionados a negar entrada ou impor condições humilhantes.","referencias":["caatinga:comunidade:poco-sem-bandeira","lugar:portomonte"],"movimentos_inspiradores":["movimento-povo:paragrafo-831","movimento-povo:paragrafo-898"],"estado":"proposta"}],"fluxos":[{"id":"fronteira:fluxo:ferragens","nome":"Ferragens em Dois Sentidos","origem_proposta":"caatinga:comunidade:feira-ferragens","destino_proposto":"lugar:portomonte","conteudo_hipotetico":"Ferramentas reparadas e peças com uso civil ou militar, em um comércio apenas possível.","sem_confirmacao":"Não há parceiro, preço, volume, estrada ou compra em Portomonte comprovados.","friccao":"O mesmo metal serve tanto a instrumentos de lavoura quanto a armas.","referencias":["caatinga:comunidade:feira-ferragens"],"movimentos_inspiradores":["movimento-classe:paragrafo-2760"],"transporte_registrado":false,"quantidade_registrada":false,"estado":"proposta"}],"cenas":[{"id":"fronteira:cena:duas-medidas","titulo":"Duas medidas, nenhuma resposta","encontro_id":"fronteira:encontro:varanda-da-agua","personagens_id":["fronteira:pessoa:gema","fronteira:pessoa:mara","fronteira:pessoa:tiru"],"rotina_antes_da_crise":"Gema mostra canteiros e explica quais tarefas consomem a água ritualmente purificada.","acontecimento_inesperado":"Uma pessoa de passagem pede água para beber; outro visitante afirma que a água agrícola lhe faria bem.","acoes_possiveis":"Recusar afirmar potabilidade, buscar água de outra origem, negociar hospitalidade ou investigar uma fonte segura.","consequencia_condicional":"Prometer água como bebida sem evidência pode causar dano e comprometer a confiança de quem cultiva o litoral.","referencias":["lugar:portomonte","caatinga:comunidade:poco-sem-bandeira"],"estado":"proposta"}],"tramas":[{"id":"fronteira:trama:agua-em-dois-nomes","titulo":"A água que tem dois nomes","pergunta_motriz":"Uma água usada para salvar uma lavoura também pode ser prometida para salvar uma família?","etapas_propostas":["O pedido de acolhimento chega à Boca do Pano Pardo.","Gema e Aru avaliam o que realmente sabem sobre a água disponível.","Um acordo provisório precisa ser cumprido diante de novas pessoas deslocadas."],"decisoes_para_o_mestre":["A água disponível é apropriada ao consumo? Só o jogo poderá estabelecer com evidência.","Quem responde pelo custo da hospitalidade?","Quem pode suspender o acordo sem se tornar tirano?"],"efeitos_de_mundo_condicionais":["Se surgir uma fonte segura, a cooperação pode substituir cobranças por serviços comuns.","Se a água for insuficiente, a comunidade poderá reagrupar abrigo ou negociar ajuda, sem garantia de sucesso."],"limite_de_canon":"O templo de Deméter documentadamente purifica água para agricultura; não declarar potabilidade doméstica.","estado":"proposta"}]},
  "frontier-caatinga-costa-sul-indexes.json":{"by_tipo":{"encontros":["fronteira:encontro:boca-do-pano","fronteira:encontro:varanda-da-agua"],"pessoas":["fronteira:pessoa:nala","fronteira:pessoa:tiru"],"acordos":["fronteira:acordo:primeira-tigela"],"fluxos":["fronteira:fluxo:ferragens"],"cenas":["fronteira:cena:duas-medidas"],"tramas":["fronteira:trama:agua-em-dois-nomes"]},"by_movimento_hack":{"movimento-classe:paragrafo-2760":["fronteira:pessoa:nala","fronteira:acordo:primeira-tigela"]},"by_ancora_regional":{"regiao:caatinga":["fronteira:encontro:boca-do-pano"],"regiao:costa-sul":["fronteira:encontro:varanda-da-agua"]},"by_encontro":{"fronteira:encontro:varanda-da-agua":["fronteira:cena:duas-medidas"]}},
  "caatinga-social-network.json":{"regiao_id":"regiao:caatinga","estado":"propostas_narrativas_nao_canonicas","aprovacao_autoral":false,"efeito_automatico_no_canon":false,"comunidades":[{"id":"caatinga:comunidade:poco-sem-bandeira","nome":"Poço Sem Bandeira","papel":"local_de_encontro","descricao_proposta":"Pátio de acesso compartilhado a um poço cujas regras são feitas por quem depende dele, não por um rei. É uma ampliação da semente anterior, não um novo lugar canônico.","rotina":"A água é distribuída por ordem de tarefas comunitárias; viajantes apresentam notícias, reparadores inspecionam a parede e famílias discutem exceções aos turnos.","dependencia_material_proposta":"Vasos limpos, manutenção do revestimento, vigias voluntárias e compromisso de não cobrar pela primeira medida de cada família.","problema_local":"Uma escolta armada exige controle sobre as filas como preço da segurança.","tags":["agua","hospitalidade","direito","conflito"],"conexoes":["caatinga:comunidade:feira-ferragens","caatinga:comunidade:patio-cabacas","caatinga:comunidade:pedra-nove-silencios"],"movimentos_inspiradores":["movimento-povo:paragrafo-834","movimento-povo:paragrafo-842","movimento-povo:paragrafo-843"],"estado":"proposta"},{"id":"caatinga:comunidade:feira-ferragens","nome":"Feira das Ferragens Trocadas","papel":"mercado_itinerante","descricao_proposta":"Mercado de reparos e trocas que muda de lugar conforme segurança, água e disposição das comunidades de recebê-lo. Integra a semente anterior.","rotina":"A primeira banca oferece consertos em vez de vendas; ferramentas de campo dividem espaço com fivelas, panelas e contas de viagem.","dependencia_material_proposta":"Reaproveitamento de metal, pano, alimentação conservada e confiança nas condições da próxima parada.","problema_local":"Armas encomendadas para uma incursão costeira dariam recursos à feira, mas tornariam seus clientes cúmplices da guerra.","tags":["comercio","oficios","guerra","mobilidade"],"conexoes":["caatinga:comunidade:poco-sem-bandeira","caatinga:comunidade:baixio-sementes"],"movimentos_inspiradores":["movimento-classe:paragrafo-2757","movimento-classe:paragrafo-2760","movimento-classe:paragrafo-2779"],"estado":"proposta"}],"coletivos":[{"id":"caatinga:coletivo:esteira-rachada","nome":"Clã da Esteira Rachada","tipo":"cla_orc","descricao_proposta":"Famílias que consideram o direito ao primeiro cântaro anterior a toda cobrança; incluem combatentes, mediadores e curadores.","principio_nao_negociavel":"Ninguém fica sem a primeira medida de água por não ter dinheiro.","ligacoes_propostas":["caatinga:comunidade:poco-sem-bandeira","caatinga:comunidade:patio-cabacas"],"tensao_interna":"Parte dos jovens considera que armas e controle das filas protegeriam melhor a comunidade.","movimentos_inspiradores":["movimento-povo:paragrafo-834","movimento-povo:paragrafo-843"],"estado":"proposta"}],"pessoas":[{"id":"caatinga:pessoa:aru","nome":"Velha Aru","comunidade_id":"caatinga:comunidade:poco-sem-bandeira","coletivo_id":"caatinga:coletivo:esteira-rachada","funcao":"Guardiã orc das medidas do poço","quer":"Manter o poço sem bandeira e fazer as famílias consertarem juntas o que usam.","teme":"Que uma defesa armada transforme a água em tributo.","segredo_possivel":"Aru conhece o responsável por uma cisterna lacrada, mas teme que divulgar o nome leve cobradores até lá.","primeira_aparicao":"Ao encontrar os aventureiros, oferece um cântaro e pergunta qual trabalho podem assumir, não quanto podem pagar.","movimentos_inspiradores":["movimento-povo:paragrafo-834","movimento-povo:paragrafo-843"],"estado":"proposta"},{"id":"caatinga:pessoa:nala","nome":"Nala Duas-Balas","comunidade_id":"caatinga:comunidade:feira-ferragens","coletivo_id":"caatinga:coletivo:ferrugem-andante","funcao":"Armeira e intermediária de trocas","quer":"Garantir que cada arma vendida não condene um dos povoados vizinhos.","teme":"Ter de escolher entre alimentar os aprendizes e armar saqueadores.","segredo_possivel":"Uma encomenda para uma incursão tem assinatura de uma pessoa que antes defendeu a feira.","primeira_aparicao":"Conserta uma arma sem cobrar, mas se recusa a vender a segunda peça ao mesmo cliente.","movimentos_inspiradores":["movimento-classe:paragrafo-2757","movimento-classe:paragrafo-2760"],"estado":"proposta"}],"pontos_agua":[{"id":"caatinga:agua:poco-partilhado","nome":"Poço Partilhado","comunidade_id":"caatinga:comunidade:poco-sem-bandeira","tipo_de_abastecimento_proposto":"Poço revestido mantido por trabalho e negociação entre grupos.","estado_material":"hipotetico_sem_medicao","fato_nao_comprovado":"Profundidade, vazão, segurança para consumo e duração não documentadas.","condicao_de_uso":"A primeira medida é comum; acesso posterior depende de trabalho e deliberação, sem quantidade fixa.","risco_e_politica":"O conselho pode instituir patrulhas ou cotas; nenhuma delas é consenso.","tags":["agua","direito"],"estado":"proposta"}],"rotas":[{"id":"caatinga:rota:barro-e-ferragem","nome":"Caminho da Água e da Ferragem","origem_id":"caatinga:comunidade:poco-sem-bandeira","destino_id":"caatinga:comunidade:feira-ferragens","funcao_proposta":"Manutenção de ferramentas, mensagens sobre disponibilidade de água e troca de recipientes.","condicoes_de_existencia":"A feira é itinerante, então não existe trajeto fixo nem tempo comprovado.","tensao_da_rota":"Um escoltador tenta tributar as ferramentas como se fossem armas de guerra.","quem_conhece":"Aru, Nala e Tiru","tracado_confirmado":false,"distancia_confirmada":false,"tags":["agua","comercio"],"movimentos_inspiradores":["movimento-povo:paragrafo-834","movimento-classe:paragrafo-2782"],"estado":"proposta"}],"conflitos":[{"id":"caatinga:conflito:agua-ou-tributo","titulo":"Quem é dono da primeira medida?","comunidade_ids":["caatinga:comunidade:poco-sem-bandeira","caatinga:comunidade:patio-cabacas"],"participantes":["caatinga:coletivo:esteira-rachada","caatinga:pessoa:iram","caatinga:pessoa:aru"],"disputa":"O clã reivindica água livre, a escolta reivindica compensação e as famílias precisam de proteção.","manifestacao_inicial":"Uma guarda exige criar uma fila separada para quem pode pagar escolta.","evolucoes_possiveis":["Aru convoca conselho aberto","A escolta condiciona vigias ao pagamento","Uma pessoa idosa desaparece na travessia"],"solucao_nao_prescrita":"A presença de escoltas pode salvar gente e ainda assim produzir nova dominação.","movimentos_inspiradores":["movimento-povo:paragrafo-843","movimento-classe:paragrafo-2760"],"estado":"proposta"}],"cenas":[{"id":"caatinga:cena:fila-entre-espadas","titulo":"A primeira água não é de quem grita","comunidade_id":"caatinga:comunidade:poco-sem-bandeira","situacao_de_abertura":"Uma guarda tenta cobrar pela passagem quando uma família chega com cântaros vazios.","o_que_os_personagens_podem_fazer":["Mediar a segurança","Ajudar nos reparos","Expor o contrato da guarda"],"informacao_que_muda_a_cena":"O chefe armado não sabia que o contratante pretendia expulsar os moradores.","efeito_se_ignorarem_condicional":"Se ninguém mediar, a fila pode se dividir e um confronto tornar o poço inutilizável.","tags":["agua","negociacao"],"movimentos_inspiradores":["movimento-povo:paragrafo-843","movimento-classe:paragrafo-2790"],"estado":"proposta"}]},
  "caatinga-social-indexes.json":{"by_tipo":{"comunidades":["caatinga:comunidade:poco-sem-bandeira","caatinga:comunidade:feira-ferragens"]},"by_tema":{"agua":["caatinga:comunidade:poco-sem-bandeira","caatinga:agua:poco-partilhado"]},"by_movimento_hack":{"movimento-povo:paragrafo-834":["caatinga:comunidade:poco-sem-bandeira"]},"by_comunidade":{"caatinga:comunidade:poco-sem-bandeira":["caatinga:pessoa:aru"]}},
  "regional-population-proposals.json":{"schema_version":"0.1.0","estado":"propostas_editoriais_nao_canonicas","areas":[{"id":"area-proposta:garganta","nome":"Garganta e cabeça de Golzdov","regiao_atlas_id":null,"macrorregiao":"extremo_leste","trama_predominante":"nome-e-propriedade","estado":"ancora_de_lore_para_propostas","cadastrada_como_regiao_oficial":false},{"id":"area-proposta:costa","nome":"Costa Sul e Mar de Sangue","regiao_atlas_id":"regiao:costa-sul","macrorregiao":"alem_sul","trama_predominante":"agua-e-sobrevivencia","estado":"ancora_de_lore_para_propostas","cadastrada_como_regiao_oficial":true}],"sementes":[{"id":"povoamento-proposto:cartorio-das-portas-raspadas","area_id":"area-proposta:garganta","titulo":"O Cartório das Portas Raspadas","local_proposto":"Beco hipotético nos degraus de Garganta","habitantes_propostos":"Funcionários humanos das escavações, escribas yokai dissidentes e famílias cuja propriedade foi tomada","personagem_central":"Ichi de Duas Tintas, escrivã que cobra por cópias mas nunca por um nome de nascimento","vida_cotidiana":"O balcão funciona ao nascer do sol: pedreiros identificam soleiras, idosos testemunham divisas e crianças aprendem a distinguir as marcas antigas das falsificações","conflito_vivo":"A administração de Lord Varys quer converter registros antigos em títulos de propriedade válidos apenas para a Corte","gancho_de_aventura":"Uma escritura de ocupação parece ter sido gravada sobre um nome yokai legítimo; três famílias querem que alguém leia o osso antes que ele seja destruído","decisao_sem_resposta_certa":"Revelar o nome original protege as famílias ou permite à Corte localizar uma porta até então escondida?","movimentos_inspiradores":["movimento-povo:paragrafo-828","movimento-povo:paragrafo-992","movimento-classe:paragrafo-2814"],"ancora_documentada":"Garganta é cidade-fortaleza ocupada no crânio de Golzdov, com escavações e inscrições yokai antigas","temas":["ocupacao","propriedade","magia-dos-nomes"],"possivel_conexao":["shadar","foz"],"estado":"proposta_de_povoamento","aprovacao_autoral":false,"efeito_automatico_no_canon":false},{"id":"povoamento-proposto:hortas-do-sal","area_id":"area-proposta:costa","titulo":"As Hortas do Sal Devolvido","local_proposto":"Encosta agrícola hipotética nas proximidades de Portomonte","habitantes_propostos":"Agricultores humanos, devotos de Deméter, carregadores de água e refugiados de Eldroth","personagem_central":"Dona Merina, horticultora que registra em pedras qual família cuidou de cada canteiro","vida_cotidiana":"A água destinada à agricultura é levada em turnos; crianças recolhem sal da terra e idosos repartem sementes resistentes","conflito_vivo":"Uma seca local põe vizinhos a disputar a distribuição de água ritualmente purificada para plantio","gancho_de_aventura":"A colheita de uma família cresce demais; outros acusam a família de desviar o turno da fonte do templo","decisao_sem_resposta_certa":"Um acordo coletivo é mais justo que priorizar os refugiados recém-chegados que perderam a última safra?","movimentos_inspiradores":["movimento-povo:paragrafo-829","movimento-povo:paragrafo-831","movimento-classe:paragrafo-2818"],"ancora_documentada":"Portomonte depende da purificação de água do Mar de Sangue para agricultura, inclusive sobre pedra; não há comprovação de potabilidade doméstica","temas":["agricultura","refugio","agua"],"possivel_conexao":["caatinga","rio"],"estado":"proposta_de_povoamento","aprovacao_autoral":false,"efeito_automatico_no_canon":false}],"tramas":[{"id":"nome-e-propriedade","titulo":"Quem tem direito de nomear a Carcaça?","pergunta":"Um regime que possui o território pode possuir seu nome?","pontos":["area-proposta:garganta","area-proposta:rio","area-proposta:foz","area-proposta:shadar"]},{"id":"agua-e-sobrevivencia","titulo":"Quem define o preço da água e da proteção?","pergunta":"Abastecimento, hospitalidade e comércio podem sobreviver ao cerco?","pontos":["area-proposta:caatinga","area-proposta:costa","area-proposta:rio"]},{"id":"memoria-e-resistencia","titulo":"Como preservar pessoas e histórias durante a ocupação?","pergunta":"Salvar a rede de resistência justifica deixar alguém para trás?","pontos":["area-proposta:eldroth","area-proposta:thargrid","area-proposta:foz"]}]},
  "regional-population-proposal-indexes.json":{"by_area":{"area-proposta:garganta":["povoamento-proposto:cartorio-das-portas-raspadas"],"area-proposta:costa":["povoamento-proposto:hortas-do-sal"]},"by_tema":{"ocupacao":["povoamento-proposto:cartorio-das-portas-raspadas"],"agricultura":["povoamento-proposto:hortas-do-sal"]},"by_movimento_hack":{"movimento-povo:paragrafo-828":["povoamento-proposto:cartorio-das-portas-raspadas"],"movimento-povo:paragrafo-829":["povoamento-proposto:hortas-do-sal"]}},
  "hack-yokai-scribe-movements.json":[{"id":"movimento-classe:paragrafo-2812","paragrafo_docx":2812,"grupo":"ESCRIBA YOKAI","categoria":"classe","titulo":"PALAVRA QUE DELIMITA","requisito_literal":null,"requisito_estruturado":null,"partes":[{"paragrafo_docx":2812,"tipo":"corpo","texto":"Quando inscrever corretamente um kanji Yokai para declarar uma fronteira simples, diga o que está dentro, o que está fora e segundo que princípio. Enquanto a inscrição permanecer íntegra, a realidade reconhece essa distinção em pequena escala."}],"opcoes":[],"texto_original":"Quando inscrever corretamente um kanji Yokai para declarar uma fronteira simples, diga o que está dentro, o que está fora e segundo que princípio. Enquanto a inscrição permanecer íntegra, a realidade reconhece essa distinção em pequena escala.","texto_integral_conferido":true,"estado":"transcricao_integral_sem_revisao_mecanica","aplicacao_canonica":false,"origem_inventario_id":"movimento-classe:paragrafo-2812"},{"id":"movimento-classe:paragrafo-2813","paragrafo_docx":2813,"grupo":"ESCRIBA YOKAI","categoria":"classe","titulo":"PALAVRA QUE PROÍBE","requisito_literal":null,"requisito_estruturado":null,"partes":[{"paragrafo_docx":2813,"tipo":"corpo","texto":"Quando possuir autoridade legítima sobre um lugar e escrever uma proibição em seus ossos ou estrutura, aquilo que foi proibido sente resistência sobrenatural para atravessar. Poderes maiores podem contestar sua autoridade."}],"opcoes":[],"texto_original":"Quando possuir autoridade legítima sobre um lugar e escrever uma proibição em seus ossos ou estrutura, aquilo que foi proibido sente resistência sobrenatural para atravessar. Poderes maiores podem contestar sua autoridade.","texto_integral_conferido":true,"estado":"transcricao_integral_sem_revisao_mecanica","aplicacao_canonica":false,"origem_inventario_id":"movimento-classe:paragrafo-2813"},{"id":"movimento-classe:paragrafo-2814","paragrafo_docx":2814,"grupo":"ESCRIBA YOKAI","categoria":"classe","titulo":"PALAVRA QUE APAGA","requisito_literal":null,"requisito_estruturado":null,"partes":[{"paragrafo_docx":2814,"tipo":"corpo","texto":"Quando descobrir o nome legítimo de uma coisa e tentar removê-lo de uma estrutura simbólica, diga ao Mestre o que você está tentando fazer deixar de ser reconhecido. Ele dirá o preço, autoridade e ritual necessários."}],"opcoes":[],"texto_original":"Quando descobrir o nome legítimo de uma coisa e tentar removê-lo de uma estrutura simbólica, diga ao Mestre o que você está tentando fazer deixar de ser reconhecido. Ele dirá o preço, autoridade e ritual necessários.","texto_integral_conferido":true,"estado":"transcricao_integral_sem_revisao_mecanica","aplicacao_canonica":false,"origem_inventario_id":"movimento-classe:paragrafo-2814"}],
  "hack-yokai-scribe-movement-indexes.json":{"by_titulo":{"PALAVRA QUE DELIMITA":["movimento-classe:paragrafo-2812"],"PALAVRA QUE PROÍBE":["movimento-classe:paragrafo-2813"],"PALAVRA QUE APAGA":["movimento-classe:paragrafo-2814"]},"by_grupo":{"ESCRIBA YOKAI":["movimento-classe:paragrafo-2812","movimento-classe:paragrafo-2813","movimento-classe:paragrafo-2814"]},"by_paragrafo":{"2812":["movimento-classe:paragrafo-2812"],"2813":["movimento-classe:paragrafo-2813"],"2814":["movimento-classe:paragrafo-2814"]},"by_tem_requer":{"nao":["movimento-classe:paragrafo-2812","movimento-classe:paragrafo-2813","movimento-classe:paragrafo-2814"]},"by_tem_opcoes":{"nao":["movimento-classe:paragrafo-2812","movimento-classe:paragrafo-2813","movimento-classe:paragrafo-2814"]},"by_requisito_tipo":{"nenhum":["movimento-classe:paragrafo-2812","movimento-classe:paragrafo-2813","movimento-classe:paragrafo-2814"]},"by_requisito_id":{}},
  "hack-noble-movements.json":[{"id":"movimento-classe:paragrafo-2816","paragrafo_docx":2816,"grupo":"NOBRE","categoria":"classe","titulo":"MEU NOME ABRE PORTAS","requisito_literal":null,"requisito_estruturado":null,"partes":[{"paragrafo_docx":2816,"tipo":"corpo","texto":"Quando sua linhagem, título ou cargo for reconhecido, ele conta como influência para Negociar sempre que puder realisticamente conceder prestígio, acesso, proteção ou punição."}],"opcoes":[],"texto_original":"Quando sua linhagem, título ou cargo for reconhecido, ele conta como influência para Negociar sempre que puder realisticamente conceder prestígio, acesso, proteção ou punição.","texto_integral_conferido":true,"estado":"transcricao_integral_sem_revisao_mecanica","aplicacao_canonica":false,"origem_inventario_id":"movimento-classe:paragrafo-2816"},{"id":"movimento-classe:paragrafo-2817","paragrafo_docx":2817,"grupo":"NOBRE","categoria":"classe","titulo":"PROTOCOLO","requisito_literal":null,"requisito_estruturado":null,"partes":[{"paragrafo_docx":2817,"tipo":"corpo","texto":"Quando entrar numa corte, conselho ou ambiente diplomático, pergunte:\n“Que regra não escrita ninguém aqui ousa quebrar?”"}],"opcoes":[],"texto_original":"Quando entrar numa corte, conselho ou ambiente diplomático, pergunte:\n“Que regra não escrita ninguém aqui ousa quebrar?”","texto_integral_conferido":true,"estado":"transcricao_integral_sem_revisao_mecanica","aplicacao_canonica":false,"origem_inventario_id":"movimento-classe:paragrafo-2817"},{"id":"movimento-classe:paragrafo-2818","paragrafo_docx":2818,"grupo":"NOBRE","categoria":"classe","titulo":"FAVOR POLÍTICO","requisito_literal":null,"requisito_estruturado":null,"partes":[{"paragrafo_docx":2818,"tipo":"corpo","texto":"Quando prestar um serviço significativo a uma pessoa poderosa e ela reconhecer publicamente a dívida, receba Domínio 1 sobre o Favor. Gaste para solicitar acesso, proteção, informação ou apresentação plausível."}],"opcoes":[],"texto_original":"Quando prestar um serviço significativo a uma pessoa poderosa e ela reconhecer publicamente a dívida, receba Domínio 1 sobre o Favor. Gaste para solicitar acesso, proteção, informação ou apresentação plausível.","texto_integral_conferido":true,"estado":"transcricao_integral_sem_revisao_mecanica","aplicacao_canonica":false,"origem_inventario_id":"movimento-classe:paragrafo-2818"}],
  "hack-noble-movement-indexes.json":{"by_titulo":{"MEU NOME ABRE PORTAS":["movimento-classe:paragrafo-2816"],"PROTOCOLO":["movimento-classe:paragrafo-2817"],"FAVOR POLÍTICO":["movimento-classe:paragrafo-2818"]},"by_grupo":{"NOBRE":["movimento-classe:paragrafo-2816","movimento-classe:paragrafo-2817","movimento-classe:paragrafo-2818"]},"by_paragrafo":{"2816":["movimento-classe:paragrafo-2816"],"2817":["movimento-classe:paragrafo-2817"],"2818":["movimento-classe:paragrafo-2818"]},"by_tem_requer":{"nao":["movimento-classe:paragrafo-2816","movimento-classe:paragrafo-2817","movimento-classe:paragrafo-2818"]},"by_tem_opcoes":{"nao":["movimento-classe:paragrafo-2816","movimento-classe:paragrafo-2817","movimento-classe:paragrafo-2818"]},"by_requisito_tipo":{"nenhum":["movimento-classe:paragrafo-2816","movimento-classe:paragrafo-2817","movimento-classe:paragrafo-2818"]},"by_requisito_id":{}},
  "hack-archaeologist-movements.json":[{"id":"movimento-classe:paragrafo-2820","paragrafo_docx":2820,"grupo":"ARQUEÓLOGO","categoria":"classe","titulo":"CAMADAS","requisito_literal":null,"requisito_estruturado":null,"partes":[{"paragrafo_docx":2820,"tipo":"corpo","texto":"‘Quando examinar uma ruína, pergunte: “O que aqui pertence a uma ocupação mais antiga do que parece?”"}],"opcoes":[],"texto_original":"‘Quando examinar uma ruína, pergunte: “O que aqui pertence a uma ocupação mais antiga do que parece?”","texto_integral_conferido":true,"estado":"transcricao_integral_sem_revisao_mecanica","aplicacao_canonica":false,"origem_inventario_id":"movimento-classe:paragrafo-2820"},{"id":"movimento-classe:paragrafo-2821","paragrafo_docx":2821,"grupo":"ARQUEÓLOGO","categoria":"classe","titulo":"NÃO TOQUE NISSO","requisito_literal":null,"requisito_estruturado":null,"partes":[{"paragrafo_docx":2821,"tipo":"corpo","texto":"Quando identificar uma estrutura, inscrição ou artefato antigo antes de alguém manipulá-lo, pergunte ao Mestre:\n“Qual é a maneira mais perigosa de interagir com isto?”"}],"opcoes":[],"texto_original":"Quando identificar uma estrutura, inscrição ou artefato antigo antes de alguém manipulá-lo, pergunte ao Mestre:\n“Qual é a maneira mais perigosa de interagir com isto?”","texto_integral_conferido":true,"estado":"transcricao_integral_sem_revisao_mecanica","aplicacao_canonica":false,"origem_inventario_id":"movimento-classe:paragrafo-2821"},{"id":"movimento-classe:paragrafo-2822","paragrafo_docx":2822,"grupo":"ARQUEÓLOGO","categoria":"classe","titulo":"CONTEXTO É TUDO","requisito_literal":null,"requisito_estruturado":null,"partes":[{"paragrafo_docx":2822,"tipo":"corpo","texto":"Quando preservar cuidadosamente o contexto de uma descoberta em vez de simplesmente retirar o objeto valioso, receba 1 Preparo relacionado ao povo que produziu aquilo."}],"opcoes":[],"texto_original":"Quando preservar cuidadosamente o contexto de uma descoberta em vez de simplesmente retirar o objeto valioso, receba 1 Preparo relacionado ao povo que produziu aquilo.","texto_integral_conferido":true,"estado":"transcricao_integral_sem_revisao_mecanica","aplicacao_canonica":false,"origem_inventario_id":"movimento-classe:paragrafo-2822"}],
  "hack-archaeologist-movement-indexes.json":{"by_titulo":{"CAMADAS":["movimento-classe:paragrafo-2820"],"NÃO TOQUE NISSO":["movimento-classe:paragrafo-2821"],"CONTEXTO É TUDO":["movimento-classe:paragrafo-2822"]},"by_grupo":{"ARQUEÓLOGO":["movimento-classe:paragrafo-2820","movimento-classe:paragrafo-2821","movimento-classe:paragrafo-2822"]},"by_paragrafo":{"2820":["movimento-classe:paragrafo-2820"],"2821":["movimento-classe:paragrafo-2821"],"2822":["movimento-classe:paragrafo-2822"]},"by_tem_requer":{"nao":["movimento-classe:paragrafo-2820","movimento-classe:paragrafo-2821","movimento-classe:paragrafo-2822"]},"by_tem_opcoes":{"nao":["movimento-classe:paragrafo-2820","movimento-classe:paragrafo-2821","movimento-classe:paragrafo-2822"]},"by_requisito_tipo":{"nenhum":["movimento-classe:paragrafo-2820","movimento-classe:paragrafo-2821","movimento-classe:paragrafo-2822"]},"by_requisito_id":{}},
  "hack-mercenary-movements.json":[
    {id:"movimento-classe:paragrafo-2736",titulo:"CAPITÃO",grupo:"MERCENÁRIO",
      requisito_literal:null,requisito_estruturado:null,
      opcoes:[{paragrafo_docx:2737,texto:"ordenar uma manobra coordenada;"}],
      texto_original:"Quando comandar uma equipe.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2748",titulo:"ABORDAGEM",grupo:"MERCENÁRIO",
      requisito_literal:"Capitão",requisito_estruturado:{
        tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2736"},
      opcoes:[{paragrafo_docx:2749,texto:"sua gente chega agrupada e em posição;"}],
      texto_original:"Quando liderar uma abordagem.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2802",titulo:"SAQUE ORGANIZADO",grupo:"MERCENÁRIO",
      requisito_literal:"Abordagem",requisito_estruturado:{
        tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2748"},
      opcoes:[],texto_original:"Quando uma abordagem quebrar a resistência.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2760",titulo:"O PREÇO DA GUERRA",grupo:"MERCENÁRIO",
      requisito_literal:null,requisito_estruturado:null,opcoes:[],
      texto_original:"Quando negociar os termos de um trabalho perigoso.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2767",titulo:"ADIANTAMENTO",grupo:"MERCENÁRIO",
      requisito_literal:"O Preço da Guerra",requisito_estruturado:{
        tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2760"},
      opcoes:[],texto_original:"Quando fechar um contrato.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2756",titulo:"CONTRABANDISTA",grupo:"MERCENÁRIO",
      requisito_literal:null,requisito_estruturado:null,opcoes:[],
      texto_original:"Quando esconder carga.",aplicacao_canonica:false}
  ],
  "hack-mercenary-movement-indexes.json":{
    by_requisito_tipo:{movimento_exato:[
      "movimento-classe:paragrafo-2748","movimento-classe:paragrafo-2802",
      "movimento-classe:paragrafo-2767"]},
    by_raiz_dependencia:{
      "movimento-classe:paragrafo-2736":[
        "movimento-classe:paragrafo-2748","movimento-classe:paragrafo-2802"],
      "movimento-classe:paragrafo-2760":["movimento-classe:paragrafo-2767"]}
  },
  "hack-artificer-movements.json":[
    {id:"movimento-classe:paragrafo-2679",grupo:"ARTÍFICE",titulo:"ARTÍFICE",
     requisito_literal:null,requisito_estruturado:null,opcoes:[],texto_original:"Quando possuir oficina.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2690",grupo:"ARTÍFICE",titulo:"ALQUIMISTA",
     requisito_literal:null,requisito_estruturado:null,opcoes:[{paragrafo_docx:2691,texto:"corrosivo;"}],
     texto_original:"Quando preparar substâncias.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2700",grupo:"ARTÍFICE",titulo:"TRANSMUTAÇÃO ALQUÍMICA",
     requisito_literal:null,requisito_estruturado:null,opcoes:[],texto_original:"Quando transmutar.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2701",grupo:"ARTÍFICE",titulo:"TROCA EQUIVALENTE",
     requisito_literal:"Transmutação Alquímica",requisito_estruturado:{
       tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2700"},
     opcoes:[],texto_original:"Quando transmutar sem laboratório.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2702",grupo:"ARTÍFICE",titulo:"ARMA HUMANA",
     requisito_literal:"Troca Equivalente",requisito_estruturado:{
       tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2701"},
     opcoes:[],texto_original:"Quando atacar com transmutação.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2703",grupo:"ARTÍFICE",titulo:"AQUILO QUE VOCÊS CHAMAM DE MUNDO",
     requisito_literal:"Arma Humana",requisito_estruturado:{
       tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2702"},
     opcoes:[],texto_original:"Quando a punição do movimento Arma Humana lhe levar a 0 Pontos de Vida.",aplicacao_canonica:false}
  ],
  "hack-artificer-movement-indexes.json":{
    by_requisito_tipo:{movimento_exato:["movimento-classe:paragrafo-2701",
      "movimento-classe:paragrafo-2702","movimento-classe:paragrafo-2703"]},
    by_raiz_dependencia:{"movimento-classe:paragrafo-2700":[
      "movimento-classe:paragrafo-2701","movimento-classe:paragrafo-2702","movimento-classe:paragrafo-2703"]}
  },
  "hack-necromancer-movements.json":[
    {id:"movimento-classe:paragrafo-2582",titulo:"ANIMAR OS MORTOS",grupo:"NECROMANTE",
     requisito_literal:null,requisito_estruturado:null,
     opcoes:[{paragrafo_docx:2583,texto:"executar uma tarefa;"}],
     texto_original:"Quando devolver movimento a um cadáver.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2596",titulo:"NOME DO MORTO",grupo:"NECROMANTE",
     requisito_literal:null,requisito_estruturado:null,
     opcoes:[],texto_original:"Quando recordar o nome verdadeiro.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2598",titulo:"COLHEITA DE OSSOS",grupo:"NECROMANTE",
     requisito_literal:null,requisito_estruturado:null,
     opcoes:[],texto_original:"Quando recolher ossos.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2599",titulo:"LEGIÃO DOS SEM NOME",grupo:"NECROMANTE",
     requisito_literal:"Animar os Mortos",
     requisito_estruturado:{tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2582"},
     opcoes:[],texto_original:"Quando controlar um grupo.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2616",titulo:"LEVANTE-SE COMO VOCÊ MESMO",grupo:"NECROMANTE",
     requisito_literal:"Animar os Mortos e Nome do Morto",
     requisito_estruturado:{tipo:"todos",operador_literal:"e",itens:[
       {tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2582",titulo_requerido:"ANIMAR OS MORTOS"},
       {tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2596",titulo_requerido:"NOME DO MORTO"}
     ]},opcoes:[],texto_original:"Quando devolver movimento a alguém.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2617",titulo:"ABOMINAÇÃO COSTURADA",grupo:"NECROMANTE",
     requisito_literal:"Animar os Mortos e Colheita de Ossos",
     requisito_estruturado:{tipo:"todos",operador_literal:"e",itens:[
       {tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2582",titulo_requerido:"ANIMAR OS MORTOS"},
       {tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2598",titulo_requerido:"COLHEITA DE OSSOS"}
     ]},opcoes:[],texto_original:"Quando construir um cadáver.",aplicacao_canonica:false}
  ],
  "hack-necromancer-movement-indexes.json":{
    by_requisito_tipo:{movimento_exato:["movimento-classe:paragrafo-2599"],
      todos:["movimento-classe:paragrafo-2616","movimento-classe:paragrafo-2617"]},
    by_requisito_id:{
      "movimento-classe:paragrafo-2582":[
        "movimento-classe:paragrafo-2599","movimento-classe:paragrafo-2616","movimento-classe:paragrafo-2617"],
      "movimento-classe:paragrafo-2596":["movimento-classe:paragrafo-2616"],
      "movimento-classe:paragrafo-2598":["movimento-classe:paragrafo-2617"]}},
  "hack-warlock-movements.json":[
    {id:"movimento-classe:paragrafo-2454",titulo:"PACTO",grupo:"BRUXO",
     requisito_literal:null,requisito_estruturado:null,opcoes:[],
     texto_original:"Escolha seu Patrono.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2467",titulo:"RAJADA MÍSTICA",grupo:"BRUXO",
     requisito_literal:"Pacto",requisito_estruturado:{tipo:"movimento_exato",
       movimento_id:"movimento-classe:paragrafo-2454"},
     opcoes:[],texto_original:"Quando conjurar uma rajada.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2474",titulo:"INVOCADOR MÍSTICO",grupo:"BRUXO",
     requisito_literal:"Rajada Mística",requisito_estruturado:{tipo:"movimento_exato",
       movimento_id:"movimento-classe:paragrafo-2467"},
     opcoes:[],texto_original:"Quando aperfeiçoar sua rajada.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2527",titulo:"MAIS UMA INVOCAÇÃO",grupo:"BRUXO",
     requisito_literal:"Invocador Místico",requisito_estruturado:{tipo:"movimento_exato",
       movimento_id:"movimento-classe:paragrafo-2474"},
     opcoes:[],texto_original:"Quando invocar mais.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2488",titulo:"MALDIÇÃO",grupo:"BRUXO",
     requisito_literal:null,requisito_estruturado:null,
     opcoes:[{paragrafo_docx:2489,texto:"Dura até ser quebrada."}],
     texto_original:"Quando amaldiçoar com o nome de alguém.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2492",titulo:"MAGIA SIMPÁTICA",grupo:"BRUXO",
     requisito_literal:null,requisito_estruturado:null,opcoes:[],
     texto_original:"Quando afetar a representação de algo.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2535",titulo:"MALDIÇÃO ADORMECIDA",grupo:"BRUXO",
     requisito_literal:"Maldição",requisito_estruturado:{tipo:"movimento_exato",
       movimento_id:"movimento-classe:paragrafo-2488"},
     opcoes:[],texto_original:"Quando adormecer uma maldição.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2572",titulo:"SABÁ",grupo:"BRUXO",
     requisito_literal:null,requisito_estruturado:null,
     opcoes:[],texto_original:"Quando três ou mais praticantes se reunirem.",aplicacao_canonica:false}
  ],
  "hack-warlock-movement-indexes.json":{
    by_requisito_tipo:{movimento_exato:[
      "movimento-classe:paragrafo-2467","movimento-classe:paragrafo-2474",
      "movimento-classe:paragrafo-2527","movimento-classe:paragrafo-2535"]},
    by_raiz_dependencia:{
      "movimento-classe:paragrafo-2454":[
        "movimento-classe:paragrafo-2467","movimento-classe:paragrafo-2474","movimento-classe:paragrafo-2527"],
      "movimento-classe:paragrafo-2488":["movimento-classe:paragrafo-2535"]}},
  "hack-sorcerer-movements.json":[
    {id:"movimento-classe:paragrafo-2348",titulo:"MAGIA NO SANGUE",grupo:"FEITICEIRO",
     requisito_literal:null,requisito_estruturado:null,
     opcoes:[{paragrafo_docx:2349,texto:"produz efeito;"}],
     texto_original:"Quando liberar sua natureza mágica.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2369",titulo:"FONTE ABERTA",grupo:"FEITICEIRO",
     requisito_literal:"Magia no Sangue",
     requisito_estruturado:{tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2348"},
     opcoes:[],texto_original:"Quando liberar sua fonte.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2354",titulo:"MAGIA SELVAGEM",grupo:"FEITICEIRO",
     requisito_literal:null,requisito_estruturado:null,opcoes:[],
     texto_original:"Magia caótica.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2384",titulo:"CAOS CONTROLADO",grupo:"FEITICEIRO",
     requisito_literal:"Magia Selvagem",
     requisito_estruturado:{tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2354"},
     opcoes:[],texto_original:"Controlar o caos.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2440",titulo:"ENTRE SONHOS",grupo:"FEITICEIRO",
     requisito_literal:null,requisito_estruturado:null,opcoes:[],
     texto_original:"Encontro onírico.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2446",titulo:"TRAZER ALGO DO SONHO",grupo:"FEITICEIRO",
     requisito_literal:"Entre Sonhos",
     requisito_estruturado:{tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2440"},
     opcoes:[],texto_original:"Trazer algo do sonho.",aplicacao_canonica:false}
  ],
  "hack-sorcerer-movement-indexes.json":{
    by_requisito_tipo:{movimento_exato:["movimento-classe:paragrafo-2369","movimento-classe:paragrafo-2384","movimento-classe:paragrafo-2446"]},
    by_raiz_dependencia:{
      "movimento-classe:paragrafo-2348":["movimento-classe:paragrafo-2369"],
      "movimento-classe:paragrafo-2354":["movimento-classe:paragrafo-2384"],
      "movimento-classe:paragrafo-2440":["movimento-classe:paragrafo-2446"]}},
  "hack-mage-movements.json":[
    {id:"movimento-classe:paragrafo-2241",titulo:"ILUSÃO",grupo:"MAGO",
     requisito_literal:null,requisito_estruturado:null,opcoes:[],
     texto_original:"Quando criar uma ilusão sensorial.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2322",titulo:"NÃO ERA EU",grupo:"MAGO",
     requisito_literal:"Ilusão",
     requisito_estruturado:{tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2241"},
     opcoes:[],texto_original:"Uma vez por cena, quando uma violência o atingir.",
     aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2251",titulo:"GRIMÓRIO",grupo:"MAGO",
     requisito_literal:null,requisito_estruturado:null,
     opcoes:[],texto_original:"Escolha ou descreva um grimório.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2252",titulo:"PESQUISA ARCANA",grupo:"MAGO",
     requisito_literal:"Grimório",
     requisito_estruturado:{tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2251"},
     opcoes:[{paragrafo_docx:2253,texto:"um custo e uma exigência"}],
     texto_original:"Quando inventar uma aplicação mágica.",
     aplicacao_canonica:false}
  ],
  "hack-mage-movement-indexes.json":{
    by_requisito_tipo:{movimento_exato:["movimento-classe:paragrafo-2322","movimento-classe:paragrafo-2252"]},
    by_raiz_dependencia:{
      "movimento-classe:paragrafo-2241":["movimento-classe:paragrafo-2322"],
      "movimento-classe:paragrafo-2251":["movimento-classe:paragrafo-2252"]}},
  "hack-druid-movements.json":[
    {id:"movimento-classe:paragrafo-2130",titulo:"METAMORFOSE",grupo:"DRUIDA",
     requisito_literal:null,requisito_estruturado:null,opcoes:[],
     texto_original:"Assuma uma forma animal de seu território.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2131",titulo:"MAESTRIA ELEMENTAL",grupo:"DRUIDA",
     requisito_literal:null,requisito_estruturado:null,opcoes:[],
     texto_original:"Comande um elemento natural.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2146",titulo:"FORMA PRIMORDIAL",grupo:"DRUIDA",
     requisito_literal:"Metamorfose e Maestria Elemental",
     requisito_estruturado:{tipo:"todos",operador_literal:"e",itens:[
       {tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2130",titulo_requerido:"METAMORFOSE"},
       {tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2131",titulo_requerido:"MAESTRIA ELEMENTAL"}]},
     opcoes:[],texto_original:"Assuma uma forma primordial.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2137",titulo:"CÍRCULO DOS ESPOROS",grupo:"DRUIDA",
     requisito_literal:null,requisito_estruturado:null,opcoes:[],
     texto_original:"Quando liberar esporos de sua colônia.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2168",titulo:"CORPO SIMBIÓTICO",grupo:"DRUIDA",
     requisito_literal:"Círculo dos Esporos",
     requisito_estruturado:{tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2137"},
     opcoes:[{paragrafo_docx:2169,texto:"o fungo resiste ao dano;"}],
     texto_original:"Sua colônia integra seu corpo.",aplicacao_canonica:false}
  ],
  "hack-druid-movement-indexes.json":{
    by_requisito_tipo:{todos:["movimento-classe:paragrafo-2146"]},
    by_requisito_id:{
      "movimento-classe:paragrafo-2130":["movimento-classe:paragrafo-2146"],
      "movimento-classe:paragrafo-2131":["movimento-classe:paragrafo-2146"],
      "movimento-classe:paragrafo-2137":["movimento-classe:paragrafo-2168"]}},
  "hack-cleric-movements.json":[

    {id:"movimento-classe:paragrafo-2056",titulo:"SACERDOTE",grupo:"CLÉRIGO",
     requisito_literal:null,requisito_estruturado:null,opcoes:[],texto_original:"Escolha uma divindade.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2057",titulo:"MILAGRES",grupo:"CLÉRIGO",
     requisito_literal:"Sacerdote",requisito_estruturado:{
       tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2056"},
     opcoes:[{paragrafo_docx:2058,texto:"acontece como pedido;"}],
     texto_original:"Quando invocar sua divindade.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2089",titulo:"RUNA",grupo:"CLÉRIGO",
     requisito_literal:null,requisito_estruturado:null,opcoes:[],
     texto_original:"Escolha três conceitos que sabe inscrever.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2099",titulo:"RUNA VIVA",grupo:"CLÉRIGO",
     requisito_literal:"Runa",requisito_estruturado:{
       tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2089"},
     opcoes:[],texto_original:"Quando inscrever uma runa viva.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-2100",titulo:"PELE ESCRITA",grupo:"CLÉRIGO",
     requisito_literal:"Runa Viva",requisito_estruturado:{
       tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-2099"},
     opcoes:[],texto_original:"Quando inscrever seu corpo.",aplicacao_canonica:false}
  ],
  "hack-cleric-movement-indexes.json":{
    by_requisito_tipo:{movimento_exato:["movimento-classe:paragrafo-2057","movimento-classe:paragrafo-2099","movimento-classe:paragrafo-2100"]},
    by_raiz_dependencia:{
      "movimento-classe:paragrafo-2056":["movimento-classe:paragrafo-2057"],
      "movimento-classe:paragrafo-2089":["movimento-classe:paragrafo-2099","movimento-classe:paragrafo-2100"]}},
  "hack-paladin-movements.json":[
    {id:"movimento-classe:paragrafo-1968",titulo:"MISSÃO SAGRADA",grupo:"PALADINO",
     requisito_literal:null,requisito_estruturado:null,opcoes:[],aplicacao_canonica:false,
     texto_original:"Você também recebe livremente os movimentos Juramento Quebrado e Penitência.",
     concessoes_gratuitas_literais:[
       {movimento_id:"movimento-classe:paragrafo-1976",titulo:"JURAMENTO QUEBRADO",
        requer_permanece_obrigatorio:true,aplicacao_automatica:false},
       {movimento_id:"movimento-classe:paragrafo-1977",titulo:"PENITÊNCIA",
        requer_permanece_obrigatorio:true,aplicacao_automatica:false}]},
    {id:"movimento-classe:paragrafo-1976",titulo:"JURAMENTO QUEBRADO",grupo:"PALADINO",
     requisito_literal:"Missão Sagrada",requisito_estruturado:{
       tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-1968"},
     opcoes:[],concessoes_gratuitas_literais:[],texto_original:"Quando quebrar um juramento.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1977",titulo:"PENITÊNCIA",grupo:"PALADINO",
     requisito_literal:"Missão Sagrada",requisito_estruturado:{
       tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-1968"},
     opcoes:[],concessoes_gratuitas_literais:[],texto_original:"Quando reparar o juramento.",aplicacao_canonica:false}
  ],
  "hack-paladin-movement-indexes.json":{
    by_tem_requer:{sim:["movimento-classe:paragrafo-1976","movimento-classe:paragrafo-1977"]},
    by_movimento_concedido:{"movimento-classe:paragrafo-1976":["movimento-classe:paragrafo-1968"],
      "movimento-classe:paragrafo-1977":["movimento-classe:paragrafo-1968"]}},
  "hack-martial-artist-movements.json":[
    {id:"movimento-classe:paragrafo-1862",titulo:"CORPO VAZIO",grupo:"ARTISTA MARCIAL",
     requisito_literal:null,requisito_estruturado:null,opcoes:[],
     texto_original:"Quando lutar desarmado, com postura própria.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1949",titulo:"FORMA DO AR",grupo:"ARTISTA MARCIAL",
     requisito_literal:null,requisito_estruturado:null,opcoes:[],
     texto_original:"Quando mover o ar.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1950",titulo:"CORPO SEM PESO",grupo:"ARTISTA MARCIAL",
     requisito_literal:"Forma do Ar",
     requisito_estruturado:{tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-1949"},
     opcoes:[],texto_original:"Quando aliviar seu peso.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1863",titulo:"MÃO ABERTA",grupo:"ARTISTA MARCIAL",
     requisito_literal:null,requisito_estruturado:null,
     opcoes:[{paragrafo_docx:1864,texto:"derrubar;"}],
     texto_original:"Quando causar dano desarmado.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1962",titulo:"VOO",grupo:"ARTISTA MARCIAL",
     requisito_literal:"Forma do Ar e Corpo Sem Peso",
     requisito_estruturado:{tipo:"todos",operador_literal:"e",itens:[
       {tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-1949",titulo_requerido:"FORMA DO AR"},
       {tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-1950",titulo_requerido:"CORPO SEM PESO"}
     ]},opcoes:[],texto_original:"Quando voar, role.",aplicacao_canonica:false}
  ],
  "hack-martial-artist-movement-indexes.json":{
    by_requisito_tipo:{todos:["movimento-classe:paragrafo-1962"]},
    by_requisito_id:{"movimento-classe:paragrafo-1949":
      ["movimento-classe:paragrafo-1950","movimento-classe:paragrafo-1962"],
      "movimento-classe:paragrafo-1950":["movimento-classe:paragrafo-1962"]}},
  "hack-bard-movements.json":[
    {id:"movimento-classe:paragrafo-1753",titulo:"ARTE ARCANA",grupo:"BARDO",
     requisito_literal:null,requisito_estruturado:null,
     texto_original:"Quando incorporar magia à sua performance, role+CAR.",
     opcoes:[{paragrafo_docx:1754,texto:"curar ou aliviar;"}],aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1798",titulo:"INSPIRAÇÃO BÁRDICA",grupo:"BARDO",
     requisito_literal:null,requisito_estruturado:null,opcoes:[],
     texto_original:"Quando dedicar uma performance a alguém.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1799",titulo:"INSPIRAÇÃO CONTAGIOSA",grupo:"BARDO",
     requisito_literal:"Inspiração Bárdica",
     requisito_estruturado:{tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-1798"},
     opcoes:[],texto_original:"Uma vez por cena, quando alguém gastar Inspiração.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1816",titulo:"CANÇÃO DA CRIAÇÃO",grupo:"BARDO",
     requisito_literal:null,requisito_estruturado:null,
     texto_original:"Quando dar forma ao mundo por sua música.",opcoes:[],aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1843",titulo:"A CANÇÃO QUE FEZ O MUNDO",grupo:"BARDO",
     requisito_literal:"Arte Arcana e dois outros Movimentos de Bardo",
     requisito_estruturado:{tipo:"todos",operador_literal:"e",itens:[
       {tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-1753"},
       {tipo:"quantidade_movimentos_grupo",grupo:"BARDO",quantidade_minima:2,
        excluir_movimentos_ids:["movimento-classe:paragrafo-1753","movimento-classe:paragrafo-1843"]}
     ]},opcoes:[],
     texto_original:"Uma vez por sessão, quando concluir uma performance impossível.",aplicacao_canonica:false}
  ],
  "hack-bard-movement-indexes.json":{
    by_requisito_tipo:{movimento_exato:["movimento-classe:paragrafo-1799"],
                       todos:["movimento-classe:paragrafo-1843"]},
    by_quantidade_minima_grupo:{"BARDO:2":["movimento-classe:paragrafo-1843"]}
  },
  "hack-rogue-movements.json":[
    {id:"movimento-classe:paragrafo-1593",titulo:"TRUQUES DO OFÍCIO",grupo:"LADINO",
     requisito_literal:null,requisito_estruturado:null,opcoes:[],
     texto_original:"Quando tiver acesso físico e ferramentas minimamente apropriadas.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1594",titulo:"ABRIR O IMPOSSÍVEL",grupo:"LADINO",
     requisito_literal:"Truques do Ofício",
     requisito_estruturado:{tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-1593"},
     opcoes:[],texto_original:"Quando alcançar um acesso impossível.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1612",titulo:"HEIST",grupo:"LADINO",
     requisito_literal:null,requisito_estruturado:null,opcoes:[],
     texto_original:"Quando planejar um roubo.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1618",titulo:"PLANO B",grupo:"LADINO",
     requisito_literal:null,requisito_estruturado:null,opcoes:[],
     texto_original:"Uma vez por sessão, declare uma preparação.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1619",titulo:"TUDO SEGUNDO O PLANO",grupo:"LADINO",
     requisito_literal:"Heist ou Plano B",
     requisito_estruturado:{tipo:"qualquer",operador_literal:"ou",itens:[
       {tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-1612"},
       {tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-1618"}]},
     opcoes:[{paragrafo_docx:1620,texto:"uma preparação significativa"}],
     texto_original:"Quando o plano parecer ter falhado catastroficamente.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1724",titulo:"CUTUCAR A FERIDA",grupo:"LADINO",
     requisito_literal:"Perfil",
     requisito_estruturado:{tipo:"referencia_sem_alvo",texto_literal:"Perfil",
       candidatos_confirmados:[],status:"exige_revisao_autoral_antes_de_qualquer_aquisicao"},
     opcoes:[],texto_original:"Quando souber qual comportamento alguém está escondendo.",aplicacao_canonica:false}
  ],
  "hack-rogue-movement-indexes.json":{
    by_requisito_tipo:{movimento_exato:["movimento-classe:paragrafo-1594"],
      qualquer:["movimento-classe:paragrafo-1619"],
      referencia_sem_alvo:["movimento-classe:paragrafo-1724"]},
    by_referencia_sem_alvo:{Perfil:["movimento-classe:paragrafo-1724"]}
  },
  "hack-hunter-movements.json":[
    {id:"movimento-classe:paragrafo-1484",titulo:"CAÇADOR DE MONSTROS",grupo:"CAÇADOR",
     requisito_literal:null,requisito_estruturado:null,opcoes:[],texto_original:"Saiba reconhecer monstros.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1492",titulo:"BARRIGA DE SMAUG",grupo:"CAÇADOR",
     requisito_literal:"Caçador de Monstros ou Um movimento que tenha revelado uma vulnerabilidade",
     requisito_estruturado:{tipo:"qualquer",itens:[
       {tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-1484"},
       {tipo:"condicao_ficcional",texto_literal:"Um movimento que tenha revelado uma vulnerabilidade"}]},
     opcoes:[{paragrafo_docx:1493,texto:"Explora uma fraqueza."}],
     texto_original:"Quando encontrar a vulnerabilidade.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1520",titulo:"NENHUM MUNDO É LONGE DEMAIS",grupo:"CAÇADOR",
     requisito_literal:"Caminhante dos Horizontes e Marca do Caçador",
     requisito_estruturado:{tipo:"todos",itens:[
       {tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-1518"},
       {tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-1461"}]},
     opcoes:[],texto_original:"Siga qualquer trilha.",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1535",titulo:"OLHO DA PRESA",grupo:"CAÇADOR",
     requisito_literal:"Flecha de Sangue ou Marca do Caçador",
     requisito_estruturado:{tipo:"qualquer",itens:[
       {tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-1534"},
       {tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-1461"}]},
     opcoes:[],texto_original:"Rastreie sua presa.",aplicacao_canonica:false}
  ],
  "hack-hunter-movement-indexes.json":{
    by_requisito_tipo:{qualquer:["movimento-classe:paragrafo-1492","movimento-classe:paragrafo-1535"],
                       todos:["movimento-classe:paragrafo-1520"]},
    by_condicao_ficcional:{sim:["movimento-classe:paragrafo-1492"]}
  },
  "hack-barbarian-movements.json":[
    {id:"movimento-classe:paragrafo-1293",titulo:"FÚRIA",categoria:"classe",
     requisito_literal:null,requisito_estruturado:null,paragrafo_docx:1293,
     texto_original:"Quando entregar-se conscientemente à fúria.",
     opcoes:[{paragrafo_docx:1294,texto:"seus ataques corpo a corpo aumentam a Periculosidade em um grau;"}],
     aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1427",titulo:"FÚRIA DIVINA",categoria:"classe",
     requisito_literal:"Fúria",paragrafo_docx:1427,
     requisito_estruturado:{tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-1293"},
     texto_original:"Escolha uma divindade, espírito ou causa sagrada.",opcoes:[],aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1343",titulo:"DEMASIADO FURIOSO PARA MORRER",categoria:"classe",
     requisito_literal:"Fúria",paragrafo_docx:1343,
     requisito_estruturado:{tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-1293"},
     texto_original:"Quando estiver morrendo durante a Fúria.",opcoes:[],aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1430",titulo:"FÚRIA ALÉM DA MORTE",categoria:"classe",
     requisito_literal:"Fúria Divina e Demasiado Furioso Para Morrer",paragrafo_docx:1430,
     requisito_estruturado:{tipo:"todos",itens:[
       {tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-1427"},
       {tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-1343"}]},
     texto_original:"Quando realizar Último Suspiro durante sua Fúria, escolha.",
     opcoes:[{paragrafo_docx:1431,texto:"sua divindade ou causa reivindica sua morte;"}],
     aplicacao_canonica:false}
  ],
  "hack-barbarian-movement-indexes.json":{
    by_tem_requer:{sim:["movimento-classe:paragrafo-1343","movimento-classe:paragrafo-1427","movimento-classe:paragrafo-1430"],nao:["movimento-classe:paragrafo-1293"]},
    by_requisito_tipo:{todos:["movimento-classe:paragrafo-1430"]},
    by_requisito_id:{"movimento-classe:paragrafo-1427":["movimento-classe:paragrafo-1430"]}
  },
  "hack-warrior-movements.json":[
    {id:"movimento-classe:paragrafo-1047",titulo:"ARMA FAVORITA",
     requisito_literal:null,requisito_estruturado:null,
     texto_original:"Escolha uma arma com a qual seu treinamento seja extraordinário.",
     paragrafo_docx:1047,opcoes:[],aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1120",titulo:"ARMA APERFEIÇOADA",
     requisito_literal:"Arma Favorita",
     requisito_estruturado:{tipo:"movimento_exato",
       movimento_id:"movimento-classe:paragrafo-1047"},
     texto_original:"Sua Arma Favorita recebe uma segunda característica.",
     paragrafo_docx:1120,opcoes:[],aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1229",titulo:"PASSO ARCANO",
     requisito_literal:"Surto de Ação e qualquer Movimento de Magia",
     requisito_estruturado:{tipo:"todos",itens:[
       {tipo:"movimento_exato",movimento_id:"movimento-classe:paragrafo-1139"},
       {tipo:"categoria",categoria:"movimento_de_magia",minimo:1}]},
     texto_original:"Quando utilizar Surto de Ação, pode desaparecer.",
     paragrafo_docx:1229,opcoes:[],aplicacao_canonica:false}
  ],
  "hack-warrior-movement-indexes.json":{by_tem_requer:{
    sim:["movimento-classe:paragrafo-1120","movimento-classe:paragrafo-1229"],
    nao:["movimento-classe:paragrafo-1047"]}},
  "hack-class-movement-inventory.json":[
    {id:"movimento-classe:paragrafo-1047",paragrafo_docx:1047,grupo:"GUERREIRO",
     titulo:"ARMA FAVORITA",requisito_literal:null,aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1120",paragrafo_docx:1120,grupo:"GUERREIRO",
     titulo:"ARMA APERFEIÇOADA",requisito_literal:"Arma Favorita",aplicacao_canonica:false},
    {id:"movimento-classe:paragrafo-1229",paragrafo_docx:1229,grupo:"GUERREIRO",
     titulo:"PASSO ARCANO",requisito_literal:"Surto de Ação e qualquer Movimento de Magia",
     aplicacao_canonica:false}
  ],
  "hack-class-movement-indexes.json":{by_grupo:{"GUERREIRO":["movimento-classe:paragrafo-1047",
     "movimento-classe:paragrafo-1120","movimento-classe:paragrafo-1229"]}},
  "hack-class-requirement-candidates.json":[
    {id:"requer:1120-1047",origem_movimento_id:"movimento-classe:paragrafo-1120",
     requisito_movimento_id:"movimento-classe:paragrafo-1047",requisito_literal:"Arma Favorita",
     status:"vinculo_exato_a_confirmar",aplicacao_canonica:false}
  ],
  "hack-class-requirement-pending.json":[
    {origem_movimento_id:"movimento-classe:paragrafo-1229",
     requisito_literal:"Surto de Ação e qualquer Movimento de Magia",
     motivo:"nao_corresponde_a_um_titulo_isolado",candidatos_ids:[],
     status:"exige_analise_editorial",aplicacao_canonica:false}
  ],
  "hack-core-rules.json":{id:"regras-hack:carcaca-dw-nucleo",aplicacao_canonica:false,
    personagens:{movimentos_proprios_nivel_1:5,distribuicao_numerica_por_origem:null,
                 valores_iniciais_para_distribuir:[16,15,13,12,9,8]}},
  "hack-general-movements.json":[
    {id:"movimento-geral:docx-30",titulo:"RECRUTAR",categoria:"avancado",
     quadro_id:"quadro-geral-docx:30",texto_original:"Quando espalhar que está procurando alguém para contratar, role.\nCom 10+: escolha candidatos.",
     gatilhos_literais:[{literal:"Quando espalhar que está procurando alguém para contratar, role."}],
     marcadores_resultado_literais:[{faixa:"10+",literal:"Com 10+: escolha candidatos."}],
     aplicacao_canonica:false},
    {id:"movimento-geral:docx-30-mandados-pendentes",titulo:"MANDADOS PENDENTES",categoria:"avancado",
     quadro_id:"quadro-geral-docx:30",texto_original:"Quando retornar a um lugar civilizado, role+CAR.",
     gatilhos_literais:[{literal:"Quando retornar a um lugar civilizado, role+CAR."}],
     marcadores_resultado_literais:[],aplicacao_canonica:false},
    {id:"movimento-geral:docx-32",titulo:"SERVOS",categoria:"subsistema_servos",
     quadro_id:"quadro-geral-docx:32",texto_original:"Servos trabalham para você.\nLEALDADE DOS SERVOS",
     gatilhos_literais:[],marcadores_resultado_literais:[],aplicacao_canonica:false}
  ],
  "hack-general-movement-indexes.json":{
    by_categoria:{avancado:["movimento-geral:docx-30","movimento-geral:docx-30-mandados-pendentes"],
                  subsistema_servos:["movimento-geral:docx-32"]}},
  "hack-docx-tables.json":[
    {id:"tabela-docx:10",titulo:"Valor / Modificador",tabela_docx_indice:10,
     tipo:"tabela_numerica",texto_integral_curado:false,aplicacao_canonica:false},
    {id:"tabela-docx:14",titulo:"DESAFIAR O PERIGO",tabela_docx_indice:14,
     tipo:"quadro_movimento_geral",texto_integral_curado:false,aplicacao_canonica:false},
    {id:"tabela-docx:32",titulo:"SERVOS",tabela_docx_indice:32,
     tipo:"quadro_movimento_geral",texto_integral_curado:false,aplicacao_canonica:false}
  ],
  "hack-docx-table-indexes.json":{by_tipo:{"quadro_movimento_geral":["tabela-docx:14","tabela-docx:32"]}},
  "hack-selected-movements.json":[
    {id:"movimento-revisado:paragrafo-829",categoria:"povo",grupo:"HUMANOS",
     titulo:"PORTOMONTENSE",requisito_literal:null,paragrafo_docx:829,
     estado:"titulo_e_requisito_conferidos_no_docx",efeito_revisado:false,aplicacao_canonica:false},
    {id:"movimento-revisado:paragrafo-1131",categoria:"classe",grupo:"GUERREIRO",
     titulo:"MAU OLHADO",requisito_literal:"Vendo Vermelho",paragrafo_docx:1131,
     estado:"titulo_e_requisito_conferidos_no_docx",efeito_revisado:false,aplicacao_canonica:false},
    {id:"movimento-revisado:paragrafo-1520",categoria:"classe",grupo:"CAÇADOR",
     titulo:"NENHUM MUNDO É LONGE DEMAIS",requisito_literal:"Caminhante dos Horizontes e Marca do Caçador",
     paragrafo_docx:1520,estado:"titulo_e_requisito_conferidos_no_docx",
     efeito_revisado:false,aplicacao_canonica:false}
  ],
  "hack-selected-movement-indexes.json":{by_grupo:{"CAÇADOR":["movimento-revisado:paragrafo-1520"]}},
  "hack-mechanics-index.json":{
    paginas_com_texto:2,paginas_sem_texto_extraivel:[91],nao_usar_como_fato_de_ambientacao:true,
    paginas_indice:[
      {pagina:49,categoria:"movimentos_de_povo",
       rotulos_detectados:["HUMANOS","PORTOMONTENSE"],mencoes_requer_na_pagina:[]},
      {pagina:70,categoria:"movimentos_de_classe",
       rotulos_detectados:["MAU OLHADO"],mencoes_requer_na_pagina:["REQUER: Vendo Vermelho"]}
    ]
  },
  "lore-index.json":[
    {id:"lore-hack:kuo-toa",tipo:"povo",nome:"Kuo-Toa",
     descricao:"Povo de cavernas e cidades marinhas, com ritos associados a Daegon",
     aliases:["kuotoa"],paginas:[5,14],evidencia:"afirmado_no_rascunho",
     integracao:"referencia_sem_mutar_canonico"},
    {id:"lore-hack:abissais-marinhos",tipo:"povo",nome:"Abissais marinhos",
     descricao:"Povo anfíbio, distinto dos demônios do Abismo",
     aliases:["Abissais"],paginas:[14,15],evidencia:"afirmado_no_rascunho",
     integracao:"referencia_sem_mutar_canonico"},
    {id:"lore-hack:demeter",tipo:"divindade",nome:"Deméter",
     descricao:"Deusa de Portomonte",aliases:["Demeter"],paginas:[5,23],
     evidencia:"afirmado_no_rascunho",integracao:"referencia_sem_mutar_canonico"}
  ],
  "lore-indexes.json":{by_tipo:{povo:["lore-hack:abissais-marinhos","lore-hack:kuo-toa"]},
    by_pagina:{"5":["lore-hack:kuo-toa","lore-hack:demeter"]},
    by_token:{abissais:["lore-hack:abissais-marinhos"]}},
  "lore-chronology.json":{eventos:[
    {id:"cronologia-hack:01",ano_ec:342,descricao:"Invasão kuo-toa",status:"afirmado_no_rascunho"},
    {id:"cronologia-hack:02",ano_ec:351,descricao:"Aliança caatinga e Garganta",status:"afirmado_no_rascunho"}],
    questoes_abertas:[{id:"incognita-hack:mar-de-sangue",estado:"explicitamente_em_aberto"}]},
  "lore-atlas-links.json":[
    {id:"ponte-lore:costa-sul-agua-demeter",entrada_lore_id:"lore-hack:demeter",
     regiao_atlas_id:"regiao:costa-sul",pergunta_curadoria_id:"pergunta:costa-sul-agua",
     parecer:"amplia",pagina:5,aplicar_automaticamente:false,status:"pendente_revisao_autoral"},
    {id:"ponte-lore:costa-sul-abissais",entrada_lore_id:"lore-hack:abissais-marinhos",
     regiao_atlas_id:"regiao:costa-sul",pergunta_curadoria_id:null,
     parecer:"amplia",pagina:14,aplicar_automaticamente:false,status:"pendente_revisao_autoral"}],
  "lore-atlas-link-indexes.json":{by_regiao:{"regiao:costa-sul":["ponte-lore:costa-sul-agua-demeter","ponte-lore:costa-sul-abissais"]},
    by_pergunta:{"pergunta:costa-sul-agua":["ponte-lore:costa-sul-agua-demeter"]}},
  "lore-review-notes.json":{revisoes:[
    {id:"revisao-hack:abissal-homonimia",acao_autorizada:false},
    {id:"revisao-hack:yokai-homonimia",acao_autorizada:false}]},
  "regional-dossiers.json":[
    {
      "id": "dossie-regional:caatinga",
      "regiao_id": "regiao:caatinga",
      "perguntas": [
        {
          "id": "pergunta:caatinga-agua",
          "tema": "subsistencia",
          "pergunta": "Onde conseguem água?"
        }
      ],
      "lacunas": [
        "Localidades não cadastradas"
      ],
      "inventario": {
        "lugares": [],
        "assentamentos": [],
        "criaturas": [],
        "frentes_propostas": [],
        "povos_vinculados_a_assentamentos": [],
        "faccoes_por_associacao_a_criaturas": [],
        "fluxos": [],
        "dependencias_materiais": [],
        "balancos_nao_quantificados": [],
        "pressoes_ecologicas_hipoteticas": [],
        "perfis_suporte": [],
        "perfis_infraestrutura": [],
        "cenarios_dw_nao_executados": [],
        "dinamicas_territoriais": [
          {
            "id": "dinamica:pilhagens",
            "papeis_regionais": [
              "origem"
            ]
          }
        ]
      }
    },
    {
      "id": "dossie-regional:costa-sul",
      "regiao_id": "regiao:costa-sul",
      "perguntas": [
        {
          "id": "pergunta:costa-refugiados",
          "tema": "mobilidade",
          "pergunta": "Quais destinos?"
        }
      ],
      "lacunas": [
        "Refúgio individual não identificado"
      ],
      "inventario": {
        "lugares": [],
        "assentamentos": [
          "assentamento:portomonte"
        ],
        "criaturas": [],
        "frentes_propostas": [],
        "povos_vinculados_a_assentamentos": [],
        "faccoes_por_associacao_a_criaturas": [],
        "fluxos": [],
        "dependencias_materiais": [],
        "balancos_nao_quantificados": [],
        "pressoes_ecologicas_hipoteticas": [],
        "perfis_suporte": [],
        "perfis_infraestrutura": [],
        "cenarios_dw_nao_executados": [],
        "dinamicas_territoriais": [
          {
            "id": "dinamica:pilhagens",
            "papeis_regionais": [
              "destino"
            ]
          }
        ]
      }
    },
    {
      "id": "dossie-regional:foz-rio-ancestral",
      "regiao_id": "regiao:foz-rio-ancestral",
      "perguntas": [
        {
          "id": "pergunta:foz-defesas",
          "tema": "conflito",
          "pergunta": "Quais recursos?"
        }
      ],
      "lacunas": [
        "Sem assentamentos curados"
      ],
      "inventario": {
        "lugares": [],
        "assentamentos": [],
        "criaturas": [
          {
            "id": "carcaca:criatura:joro",
            "estado_curadoria": "piloto"
          }
        ],
        "frentes_propostas": [],
        "povos_vinculados_a_assentamentos": [],
        "faccoes_por_associacao_a_criaturas": [],
        "fluxos": [],
        "dependencias_materiais": [],
        "balancos_nao_quantificados": [],
        "pressoes_ecologicas_hipoteticas": [],
        "perfis_suporte": [],
        "perfis_infraestrutura": [],
        "cenarios_dw_nao_executados": [],
        "dinamicas_territoriais": []
      }
    }
  ],
  "research-backlog.json":[
    {
      "id": "pendencia:caatinga-habitacao",
      "pergunta_id": "pergunta:caatinga-habitacao",
      "regiao_id": "regiao:caatinga",
      "dossie_id": "dossie-regional:caatinga",
      "tema": "abrigo",
      "pergunta": "Onde moram?",
      "estado": "aguarda_nova_fonte",
      "ordem_editorial": 1,
      "faixa_prioridade": "primeiro_lote",
      "depende_de_perguntas": [],
      "evidencias_necessarias": [
        "Descrição da localidade"
      ],
      "justificativa_editorial": "Base da investigação",
      "artefatos_potenciais": [
        "lugar"
      ],
      "resposta_confirmada": null,
      "evidencia_nova": null,
      "mutacao_canonica": false,
      "efeitos_dw_automaticos": false
    },
    {
      "id": "pendencia:costa-sul-agua",
      "pergunta_id": "pergunta:costa-sul-agua",
      "regiao_id": "regiao:costa-sul",
      "dossie_id": "dossie-regional:costa-sul",
      "tema": "subsistencia",
      "pergunta": "Água potável?",
      "estado": "aguarda_nova_fonte",
      "ordem_editorial": 2,
      "faixa_prioridade": "primeiro_lote",
      "depende_de_perguntas": [],
      "evidencias_necessarias": [
        "Uso conhecido"
      ],
      "justificativa_editorial": "Evitar água imaginada",
      "artefatos_potenciais": [
        "revisao_suporte"
      ],
      "resposta_confirmada": null,
      "evidencia_nova": null,
      "mutacao_canonica": false,
      "efeitos_dw_automaticos": false
    },
    {
      "id": "pendencia:caatinga-abastecimento",
      "pergunta_id": "pergunta:caatinga-abastecimento",
      "regiao_id": "regiao:caatinga",
      "dossie_id": "dossie-regional:caatinga",
      "tema": "subsistencia",
      "pergunta": "Como se abastecem?",
      "estado": "aguarda_nova_fonte",
      "ordem_editorial": 3,
      "faixa_prioridade": "segundo_lote",
      "depende_de_perguntas": [
        "pergunta:caatinga-habitacao"
      ],
      "evidencias_necessarias": [
        "Proveniência de recursos"
      ],
      "justificativa_editorial": "Localização antes de atribuir recursos",
      "artefatos_potenciais": [
        "perfil_suporte_rascunho"
      ],
      "resposta_confirmada": null,
      "evidencia_nova": null,
      "mutacao_canonica": false,
      "efeitos_dw_automaticos": false
    },
    {
      "id": "pendencia:foz-resistencia",
      "pergunta_id": "pergunta:foz-resistencia",
      "regiao_id": "regiao:foz-rio-ancestral",
      "dossie_id": "dossie-regional:foz-rio-ancestral",
      "tema": "abrigo",
      "pergunta": "Que abrigos existem?",
      "estado": "aguarda_priorizacao",
      "ordem_editorial": null,
      "faixa_prioridade": null,
      "depende_de_perguntas": [],
      "evidencias_necessarias": [],
      "justificativa_editorial": null,
      "artefatos_potenciais": [],
      "resposta_confirmada": null,
      "evidencia_nova": null,
      "mutacao_canonica": false,
      "efeitos_dw_automaticos": false
    }
  ],
  "research-backlog-indexes.json":{by_regiao:{"regiao:caatinga":["pendencia:caatinga-habitacao","pendencia:caatinga-abastecimento"]},by_estado:{"aguarda_nova_fonte":["pendencia:caatinga-habitacao","pendencia:caatinga-abastecimento","pendencia:costa-sul-agua"]}},
  "regional-dossier-indexes.json":{by_regiao:{"regiao:caatinga":["dossie-regional:caatinga"],"regiao:costa-sul":["dossie-regional:costa-sul"]},
    by_ausencia_assentamento_curado:{"sim":["dossie-regional:caatinga","dossie-regional:foz-rio-ancestral"]}},
  "territorial-labels.json":[{id:"rotulo-territorial:fronteira_de_pilhagens"},{id:"rotulo-territorial:presenca_minoritaria_refugiada"}],
  "territorial-dynamics.json":[
    {id:"dinamica:pilhagens",escala:"regional",origem_regiao_id:"regiao:caatinga",
     destino_regiao_id:"regiao:costa-sul",assentamento_alvo_id:null,
     tipo:"incursao_de_pilhagem",rotulos_territoriais:["rotulo-territorial:fronteira_de_pilhagens"],
     dimensoes_possivelmente_afetadas:["agricultura","seguranca"],
     fato_documentado:"Incursões regionais contra pradarias; nenhuma cidade específica foi confirmada",
     lacunas:["Vítimas e datas específicas ainda não existem"],
     perguntas:["Quais campos estão sob ameaça?"],
     possibilidade_narrativa:"Perda possível de uma safra individualizada"},
    {id:"dinamica:refugiados",escala:"regional",origem_regiao_id:"regiao:eldroth",
     destino_regiao_id:"regiao:costa-sul",assentamento_alvo_id:null,
     tipo:"deslocamento_forcado_documentado",
     rotulos_territoriais:["rotulo-territorial:presenca_minoritaria_refugiada"],
     dimensoes_possivelmente_afetadas:["abrigo","integracao_comunitaria"],
     fato_documentado:"Refugiados minoritários em assentamentos maiores não nomeados",
     lacunas:["Destino não especificado"],perguntas:["Qual cidade os recebeu?"],
     possibilidade_narrativa:"Acolhida futura decidida em campanha"}
  ],
  "territorial-indexes.json":{by_destino_regiao:{"regiao:costa-sul":["dinamica:pilhagens","dinamica:refugiados"]},
    by_rotulo_territorial:{"rotulo-territorial:fronteira_de_pilhagens":["dinamica:pilhagens"]}},

  "fronts.json":[],
  "indexes.json":{},
  "settlements.json":[
    {id:"assentamento:portomonte",regiao_id:"regiao:costa-sul",natureza:"assentamento_civil",
     rotulos_carcaca:[{id:"rotulo:lavoura_sobre_pedra"}],
     habitantes:[{povo_id:"povo:humanos-costa-sul"}],
     ecologia_material:{continuidade:{situacao:"nao_documentada",descricao:null}}},
    {id:"assentamento:rede-cavernas",regiao_id:"regiao:costa-sul",natureza:"rede_de_abrigos",
     rotulos_carcaca:[{id:"rotulo:habitat_de_cavernas"}],
     habitantes:[{povo_id:"povo:kuo-toa-costa-sul"}],
     ecologia_material:{continuidade:{situacao:"nao_documentada",descricao:null}}}
  ],
  "settlement-labels.json":[{id:"rotulo:lavoura_sobre_pedra"}],
  "settlement-indexes.json":{by_rotulo_carcaca:{"rotulo:lavoura_sobre_pedra":["assentamento:portomonte"]}},
  "peoples.json":[{id:"povo:humanos-costa-sul"}],
  "flows.json":[{id:"fluxo:agua-portomonte",destino_assentamento_id:"assentamento:portomonte"}],
  "material-dependencies.json":[
    {id:"dependencia:purificar",assentamento_id:"assentamento:portomonte",
     tipo:"transformacao",fluxo_id:"fluxo:agua-portomonte",depende_de_id:null,
     fato:"A água é purificada",consequencia_hipotetica:"Suspensão do processo",
     desconhecidos:["A escala de produção"]},
    {id:"dependencia:lavoura",assentamento_id:"assentamento:portomonte",
     tipo:"producao_dependente",fluxo_id:"fluxo:agua-portomonte",
     depende_de_id:"dependencia:purificar",fato:"Lavoura depende da água",
     consequencia_hipotetica:"Produção pode ser afetada",desconhecidos:["Safra"]},
    {id:"dependencia:ilhas",assentamento_id:"assentamento:rede-cavernas",
     tipo:"mobilidade",fluxo_id:"fluxo:nao-relacionado",depende_de_id:null,
     fato:"Viagem sazonal",consequencia_hipotetica:"Circulação poderia mudar",
     desconhecidos:["Rotas"]}
  ],
  "material-dependency-indexes.json":{by_assentamento:{"assentamento:portomonte":["dependencia:purificar","dependencia:lavoura"]}},
  "material-balances.json":[
    {id:"balanco:agua",assentamento_id:"assentamento:portomonte",
     recurso_id:"recurso:agua_purificada",tipo_recurso:"agua_transformada",
     sazonalidade:{tipo:"nao_documentada"},
     medidas:Object.fromEntries(["estoque_inicial","producao","entradas","consumo","saidas","perdas","estoque_final"].map(k=>
       [k,{valor:null,unidade:null,periodo:null,origem_medicao:null}]))},
    {id:"balanco:mercadorias",assentamento_id:"assentamento:portomonte",
     recurso_id:null,tipo_recurso:"mercadoria_nao_identificada",
     sazonalidade:{tipo:"nao_documentada"},medidas:{}}
  ],
  "material-balance-indexes.json":{by_assentamento:{"assentamento:portomonte":["balanco:agua","balanco:mercadorias"]}},
  "ecological-pressures.json":[
    {id:"pressao:falha",assentamento_id:"assentamento:portomonte",
     dependencias_ids:["dependencia:purificar"],tipo:"falha_ritual",
     estado:"risco_hipotetico_nao_ocorrido",efeito_dw_automatico:false,evento_campanha_id:null}
  ],
  "ecological-pressure-indexes.json":{by_dependencia:{"dependencia:purificar":["pressao:falha"]}},
  "support-profiles.json":[
    {id:"suporte:portomonte",assentamento_id:"assentamento:portomonte",
     natureza_territorial:"assentamento_civil",
     limites:["agua_potavel","alimentacao","abrigo","residuos"].map(id=>({
       id,disponibilidade:{valor:null,unidade:null,periodo:null,origem_medicao:null},
       necessidade_por_habitante:{valor:null,unidade:null,periodo:null,origem_medicao:null}})),
     demografia:{residentes:{valor:null,unidade:null,periodo:null,origem_medicao:null},
                 nascimentos:{valor:null,unidade:null,periodo:null,origem_medicao:null},
                 obitos:{valor:null,unidade:null,periodo:null,origem_medicao:null},
                 migracao_entrada:{valor:null,unidade:null,periodo:null,origem_medicao:null},
                 migracao_saida:{valor:null,unidade:null,periodo:null,origem_medicao:null}}}
  ],
  "support-indexes.json":{by_assentamento:{"assentamento:portomonte":["suporte:portomonte"]}},
  "infrastructure-profiles.json":[
    {id:"infraestrutura:portomonte",assentamento_id:"assentamento:portomonte",
     natureza:"assentamento_civil",setores:[
       {id:"construcao_abrigo",estado:"evidencia_parcial",
        ancoras_documentadas:[{descricao:"Povoação nos penhascos",classe:"geografia",fonte:"ambientacao",status:"documentado"}],
        materiais_construtivos_confirmados:[],
        instalacoes_especificas_confirmadas:[{instalacao:"Templo de Deméter",fonte:"ambientacao"}],
        problemas_em_aberto:["Materiais desconhecidos"],perguntas_para_o_mestre:["Como são as casas?"],
        dependencias_relacionadas:[]},
       {id:"armazenamento",estado:"sem_documentacao",ancoras_documentadas:[],
        materiais_construtivos_confirmados:[],instalacoes_especificas_confirmadas:[],
        problemas_em_aberto:["Local de estoque não descrito"],
        perguntas_para_o_mestre:["Onde a comida é guardada?"],
        dependencias_relacionadas:["dependencia:lavoura"]},
       {id:"saneamento",estado:"sem_documentacao",ancoras_documentadas:[],
        materiais_construtivos_confirmados:[],instalacoes_especificas_confirmadas:[],
        problemas_em_aberto:["Esgoto não mencionado"],perguntas_para_o_mestre:["Como são tratados dejetos?"],
        dependencias_relacionadas:[]},
       {id:"acessos_logistica",estado:"sem_documentacao",ancoras_documentadas:[],
        materiais_construtivos_confirmados:[],instalacoes_especificas_confirmadas:[],
        problemas_em_aberto:["Cais não descrito"],perguntas_para_o_mestre:["Existe um porto?"],
        dependencias_relacionadas:[]}
     ]},
    {id:"infraestrutura:rede-cavernas",assentamento_id:"assentamento:rede-cavernas",
     natureza:"rede_de_abrigos",setores:[
       {id:"construcao_abrigo",estado:"evidencia_parcial",
        ancoras_documentadas:[{descricao:"Habitações em cavernas",classe:"habitat_coletivo",fonte:"ambientacao",status:"documentado"}],
        materiais_construtivos_confirmados:[],instalacoes_especificas_confirmadas:[],
        problemas_em_aberto:["Estruturas artificiais não descritas"],
        perguntas_para_o_mestre:["Há instalações construídas?"],dependencias_relacionadas:[]},
       {id:"armazenamento",estado:"sem_documentacao",ancoras_documentadas:[],
        materiais_construtivos_confirmados:[],instalacoes_especificas_confirmadas:[],
        problemas_em_aberto:["Estoques desconhecidos"],perguntas_para_o_mestre:["Há provisões?"],dependencias_relacionadas:[]},
       {id:"saneamento",estado:"sem_documentacao",ancoras_documentadas:[],
        materiais_construtivos_confirmados:[],instalacoes_especificas_confirmadas:[],
        problemas_em_aberto:["Esgoto desconhecido"],perguntas_para_o_mestre:["Como descartam resíduos?"],dependencias_relacionadas:[]},
       {id:"acessos_logistica",estado:"sem_documentacao",ancoras_documentadas:[],
        materiais_construtivos_confirmados:[],instalacoes_especificas_confirmadas:[],
        problemas_em_aberto:["Entradas desconhecidas"],perguntas_para_o_mestre:["Quais acessos?"],dependencias_relacionadas:[]}
     ]}
  ],
  "infrastructure-indexes.json":{by_setor_sem_dados:{"saneamento":["infraestrutura:portomonte","infraestrutura:rede-cavernas"]}},
  "settlement-scenarios.json":[
    {id:"cenario:teste",estado:"hipotese_nao_acontecida",mutacao_canonica:false,
     movimento_dw:"Want",assentamentos:["assentamento:portomonte"],
     condicoes_nao_confirmadas:["A água deixa de ser suficiente","Não há suprimento alternativo"],
     resultados_possiveis:["Considerar consequência somente após fato confirmado"],
     pergunta_ao_mestre:"Que alternativa existe?"}
  ]
};
let requests=0;
const atlas=createCarcacaAtlas({baseUrl:"https://localhost/snapshot",fetchImpl:async url=>{
  requests++;
  const key=url.split("/").at(-1);
  return {ok:!!fixtures[key],status:fixtures[key]?200:404,json:async()=>fixtures[key]};
}});
test("busca filtra tipo Carcaça e região sem alterar tipo D&D",async()=>{
  const rows=await atlas.search({tipoCarcaca:"yokai",regiaoId:"regiao:foz"});
  assert.equal(rows.length,2);
  assert.equal(rows[0].tipo_dnd,"fey");
  assert.equal((await atlas.search({tipoDnd:"beast"}))[0].nome,"Urso");
});
test("ausência de ND não equivale a ND 0",async()=>{
  const rows=await atlas.search({ndMin:0});
  assert.deepEqual(rows.map(x=>x.nome),["Jorō","Urso"]);
});
test("busca ignora acentos e respeita paginação",async()=>{
  assert.equal((await atlas.search({query:"joro"})).length,1);
  assert.equal((await atlas.search({regiaoId:"regiao:foz",limit:1,offset:1}))[0].nome,"Kappa");
});
test("retorna ficha autoral e cacheia segmentos",async()=>{
  assert.equal((await atlas.get("carcaca:criatura:joro")).dungeon_world.instinto,"Testar visitantes");
  assert.equal(await atlas.get("carcaca:criatura:nao-existe"),null);
  const before=requests;await atlas.getCatalog();await atlas.getManifest();
  assert.equal(requests,before);
});
test("rejeita paginação inválida",async()=>{
  await assert.rejects(()=>atlas.search({limit:1000}),RangeError);
  await assert.rejects(()=>atlas.search({offset:-1}),RangeError);
});

test("consulta assentamentos por região, rótulo, povo e natureza",async()=>{
  assert.equal((await atlas.searchSettlements({regiaoId:"regiao:costa-sul"})).length,2);
  assert.deepEqual(
    (await atlas.searchSettlements({rotuloId:"rotulo:lavoura_sobre_pedra"})).map(s=>s.id),
    ["assentamento:portomonte"]
  );
  assert.equal((await atlas.searchSettlements({povoId:"povo:kuo-toa-costa-sul",
                                              natureza:"rede_de_abrigos"})).length,1);
});
test("camada material conserva continuidade desconhecida",async()=>{
  const p=await atlas.getSettlement("assentamento:portomonte");
  assert.equal(p.ecologia_material.continuidade.descricao,null);
  assert.equal(await atlas.getSettlement("assentamento:ausente"),null);
  assert.equal((await atlas.getSettlementLabels()).length,1);
  assert.equal((await atlas.getSettlementIndexes()).by_rotulo_carcaca["rotulo:lavoura_sobre_pedra"].length,1);
  assert.equal((await atlas.getPeoples()).length,1);
  assert.equal((await atlas.getFlows())[0].id,"fluxo:agua-portomonte");
});

test("pesquisar cenários por movimento DW e assentamento",async()=>{
  const scenarios=await atlas.searchSettlementScenarios({
    assentamentoId:"assentamento:portomonte",movimentoDw:"Want"});
  assert.equal(scenarios.length,1);
  assert.equal((await atlas.getSettlementScenario("cenario:teste")).estado,"hipotese_nao_acontecida");
  assert.equal(await atlas.getSettlementScenario("cenario:inexistente"),null);
});
test("prévia preserva o estado, exige confirmação e jamais executa efeitos",async()=>{
  const scenario=await atlas.getSettlementScenario("cenario:teste");
  const before=JSON.stringify(scenario);
  const pending=previewSettlementScenario(scenario);
  assert.equal(pending.pronto_para_adjudicacao,false);
  assert.equal(pending.condicoes_pendentes.length,2);
  const after=previewSettlementScenario(scenario,{
    condicoesConfirmadas:[...scenario.condicoes_nao_confirmadas]
  });
  assert.equal(after.pronto_para_adjudicacao,true);
  assert.equal(after.estado,"simulacao_sem_mutacao");
  assert.equal(JSON.stringify(scenario),before);
  assert.throws(()=>previewSettlementScenario({...scenario,mutacao_canonica:true}),TypeError);
});

test("consulta dependências materiais por assentamento e tipo",async()=>{
  const deps=await atlas.searchMaterialDependencies({
    assentamentoId:"assentamento:portomonte",tipo:"transformacao"});
  assert.deepEqual(deps.map(d=>d.id),["dependencia:purificar"]);
  assert.equal((await atlas.getMaterialDependencies()).length,3);
  assert.equal((await atlas.getMaterialDependencyIndexes()).by_assentamento["assentamento:portomonte"].length,2);
});
test("interrupção material percorre apenas relações curadas e não altera nada",async()=>{
  const deps=await atlas.getMaterialDependencies();
  const before=JSON.stringify(deps);
  const preview=previewMaterialInterruption(deps,"dependencia:purificar");
  assert.equal(preview.estado,"simulacao_sem_mutacao");
  assert.equal(preview.mutacao_canonica,false);
  assert.equal(preview.impactos_potenciais.length,1);
  assert.equal(preview.impactos_potenciais[0].dependencia_id,"dependencia:lavoura");
  assert.deepEqual(preview.efeitos_dw_aplicados,[]);
  assert.equal(JSON.stringify(deps),before);
  assert.throws(()=>previewMaterialInterruption(deps,"dependencia:desconhecida"),RangeError);
});
test("eventos locais exigem decisão do mestre, referências e ID único",()=>{
  const state=createCampaignLedger({id:"campanha:teste",nome:"Campanha de teste"});
  const event={id:"evento:primeiro",tipo:"acontecimento",
    assentamento_id:"assentamento:portomonte",descricao:"A purificação falhou nesta campanha",
    mestre_confirmou:true,fonte_cenario_id:null,efeitos_adjudicados:[]};
  const original=JSON.stringify(state);
  assert.throws(()=>recordCampaignEvent(state,{...event,mestre_confirmou:false},
    {settlementIds:["assentamento:portomonte"]}),TypeError);
  assert.throws(()=>recordCampaignEvent(state,event,
    {settlementIds:["assentamento:ilha-inexistente"]}),RangeError);
  const next=recordCampaignEvent(state,event,{settlementIds:["assentamento:portomonte"]});
  assert.equal(state.revisao,0);
  assert.equal(JSON.stringify(state),original);
  assert.equal(next.revisao,1);
  assert.equal(getCampaignEvents(next,{assentamentoId:"assentamento:portomonte"}).length,1);
  assert.throws(()=>recordCampaignEvent(next,event,{settlementIds:["assentamento:portomonte"]}),RangeError);
  const events=getCampaignEvents(next);
  events[0].descricao="Edição local";
  assert.notEqual(next.eventos[0].descricao,"Edição local");
});
test("cenário de DW precisa existir para virar referência de evento local",()=>{
  const state=createCampaignLedger({id:"campanha:teste",nome:"Campanha de teste"});
  const event={id:"evento:segundo",tipo:"decisao_dw",
    assentamento_id:"assentamento:portomonte",descricao:"O mestre aplicou Want nesta campanha",
    mestre_confirmou:true,fonte_cenario_id:"cenario:teste",
    efeitos_adjudicados:["Adicionar necessidade conforme decisão do mestre"]};
  assert.throws(()=>recordCampaignEvent(state,event,{
    settlementIds:["assentamento:portomonte"],scenarioIds:[]}),RangeError);
  const next=recordCampaignEvent(state,event,{
    settlementIds:["assentamento:portomonte"],scenarioIds:["cenario:teste"]});
  assert.equal(next.eventos[0].fonte_cenario_id,"cenario:teste");
  assert.equal(next.eventos[0].efeitos_adjudicados.length,1);
});

test("consultas de balanço e pressão ecológica usam filtros e índices",async()=>{
  const bs=await atlas.searchMaterialBalances({
    assentamentoId:"assentamento:portomonte",tipoRecurso:"agua_transformada"});
  assert.equal(bs.length,1);
  assert.equal(bs[0].medidas.producao.valor,null);
  assert.equal((await atlas.getMaterialBalances()).length,2);
  assert.equal((await atlas.getMaterialBalanceIndexes()).by_assentamento["assentamento:portomonte"].length,2);
  assert.equal((await atlas.searchEcologicalPressures({dependenciaId:"dependencia:purificar"})).length,1);
  assert.equal((await atlas.getEcologicalPressureIndexes()).by_dependencia["dependencia:purificar"].length,1);
});
test("saldo recusa quantidades ausentes em vez de inventar zeros",async()=>{
  const [agua]=await atlas.searchMaterialBalances({tipoRecurso:"agua_transformada"});
  const before=JSON.stringify(agua);
  const preview=previewMaterialBalance(agua);
  assert.equal(preview.calculavel,false);
  assert.equal(preview.motivo,"dados_insuficientes");
  assert.equal(preview.faltantes.length,6);
  assert.equal(preview.mutacao_canonica,false);
  assert.deepEqual(preview.efeitos_dw_aplicados,[]);
  assert.equal(JSON.stringify(agua),before);
});
test("saldo hipotético mantém unidade/período e calcula o déficit separadamente",async()=>{
  const [agua]=await atlas.searchMaterialBalances({tipoRecurso:"agua_transformada"});
  const make=(values)=>Object.fromEntries(BALANCE_FIELDS.map((k,i)=>[k,{
    valor:values[i],unidade:"litro",periodo:"exemplo-p1",
    origem_medicao:"dados_ficticios_de_teste"}]));
  const values=make([100,30,0,70,10,5]);
  const before=JSON.stringify(agua);
  const result=previewMaterialBalance(agua,{medidas:values});
  assert.equal(result.calculavel,true);
  assert.equal(result.saldo_teorico,45);
  assert.equal(result.estoque_final_nao_negativo,45);
  assert.equal(result.deficit_teorico,0);
  const deficit=previewMaterialBalance(agua,{medidas:make([10,0,0,50,0,0])});
  assert.equal(deficit.saldo_teorico,-40);
  assert.equal(deficit.estoque_final_nao_negativo,0);
  assert.equal(deficit.deficit_teorico,40);
  assert.equal(JSON.stringify(agua),before);
});
test("saldo recusa misturar unidades ou períodos e não equaciona recursos desconhecidos",async()=>{
  const bs=await atlas.getMaterialBalances();
  const water=bs[0],unidentified=bs[1];
  const valid=Object.fromEntries(BALANCE_FIELDS.map(k=>[k,{
    valor:0,unidade:"litro",periodo:"exemplo-p1",origem_medicao:"ficticio"}]));
  const badUnit={...valid,consumo:{...valid.consumo,unidade:"quilograma"}};
  const badPeriod={...valid,producao:{...valid.producao,periodo:"exemplo-p2"}};
  assert.equal(previewMaterialBalance(water,{medidas:badUnit}).motivo,"unidade_ou_periodo_incompativel");
  assert.equal(previewMaterialBalance(water,{medidas:badPeriod}).motivo,"unidade_ou_periodo_incompativel");
  assert.equal(previewMaterialBalance(unidentified,{medidas:valid}).motivo,"recurso_nao_identificado");
  const missingOrigin={...valid,consumo:{...valid.consumo,origem_medicao:null}};
  assert.equal(previewMaterialBalance(water,{medidas:missingOrigin}).motivo,"dados_insuficientes");
  assert.throws(()=>previewMaterialBalance(water,{modo:"alterar_canon"}),TypeError);
});

test("perfis de suporte consultáveis preservam água potável e reprodução desconhecidas",async()=>{
  const [p]=await atlas.searchSupportProfiles({assentamentoId:"assentamento:portomonte"});
  assert.equal(p.id,"suporte:portomonte");
  assert.equal(p.limites[0].disponibilidade.valor,null);
  assert.equal(p.limites.length,4);
  assert.equal((await atlas.getSupportProfile("suporte:portomonte")).id,p.id);
  assert.equal(await atlas.getSupportProfile("suporte:ausente"),null);
  assert.equal((await atlas.getSupportIndexes()).by_assentamento["assentamento:portomonte"].length,1);
});
test("não calcular capacidade de suporte a partir de vazios nem de premissas implícitas",async()=>{
  const p=(await atlas.getSupportProfiles())[0];
  const before=JSON.stringify(p);
  const noPremise=previewSupportCapacity(p);
  assert.equal(noPremise.calculavel,false);
  assert.equal(noPremise.motivo,"premissas_nao_confirmadas");
  const missing=previewSupportCapacity(p,{premissasExplicitas:true});
  assert.equal(missing.calculavel,false);
  assert.equal(missing.motivo,"dados_insuficientes");
  assert.equal(missing.pendentes.length,4);
  assert.equal(JSON.stringify(p),before);
  assert.deepEqual(missing.efeitos_dw_aplicados,[]);
});
test("simulação explícita encontra limite restritivo sem reclassificar DW",async()=>{
  const p=(await atlas.getSupportProfiles())[0];
  const make=(v,u)=>({valor:v,unidade:u,periodo:"ciclo-ficticio-01",
                         origem_medicao:"hipotese_de_teste"});
  const limits={
    agua_potavel:{disponibilidade:make(1000,"litro"),necessidade_por_habitante:make(2,"litro"),
                  recurso_especificado:"água potável hipotética",adequacao_confirmada:true},
    alimentacao:{disponibilidade:make(600,"racao"),necessidade_por_habitante:make(3,"racao"),
                 recurso_especificado:"ração nutricional hipotética",adequacao_confirmada:true},
    abrigo:{disponibilidade:make(250,"vaga"),necessidade_por_habitante:make(1,"vaga"),
            recurso_especificado:"vaga habitável hipotética",adequacao_confirmada:true},
    residuos:{disponibilidade:make(400,"kg"),necessidade_por_habitante:make(2,"kg"),
              recurso_especificado:"tratamento hipotético de resíduos",adequacao_confirmada:true}
  };
  const original=JSON.stringify(p);
  const result=previewSupportCapacity(p,{dimensoes:limits,premissasExplicitas:true,
    populacao:make(190,"pessoa")});
  assert.equal(result.calculavel,true);
  assert.equal(result.capacidade_teorica,200);
  assert.deepEqual(result.limites_restritivos,["alimentacao","residuos"]);
  assert.equal(result.excede_capacidade,false);
  assert.equal(result.mutacao_canonica,false);
  assert.equal(JSON.stringify(p),original);
  const overflow=previewSupportCapacity(p,{dimensoes:limits,premissasExplicitas:true,
    populacao:make(205,"pessoa")});
  assert.equal(overflow.excede_capacidade,true);
  assert.equal(overflow.efeitos_dw_aplicados.length,0);
  assert.equal(SUPPORT_LIMITS.length,4);
});
test("unidades, intervalos, adequação e fonte da simulação precisam coincidir",async()=>{
  const p=(await atlas.getSupportProfiles())[0];
  const measure=(n,u="kg",periodo="p1")=>({
    valor:n,unidade:u,periodo,origem_medicao:"ficticio"});
  const all=Object.fromEntries(SUPPORT_LIMITS.map(id=>[id,{
    disponibilidade:measure(100),necessidade_por_habitante:measure(2),
    adequacao_confirmada:true,recurso_especificado:"recurso fictício "+id
  }]));
  const f=(input)=>previewSupportCapacity(p,{dimensoes:input,premissasExplicitas:true});
  const base=f(all);assert.equal(base.capacidade_teorica,50);
  const units=structuredClone(all);units.alimentacao.necessidade_por_habitante.unidade="litro";
  assert.equal(f(units).motivo,"unidade_ou_periodo_incompativel");
  const periods=structuredClone(all);periods.residuos.disponibilidade.periodo="p2";
  periods.residuos.necessidade_por_habitante.periodo="p2";
  assert.equal(f(periods).motivo,"periodos_entre_dimensoes_incompativeis");
  const source=structuredClone(all);source.agua_potavel.disponibilidade.origem_medicao=null;
  assert.equal(f(source).motivo,"dados_insuficientes");
  const qual=structuredClone(all);qual.agua_potavel.adequacao_confirmada=false;
  assert.equal(f(qual).motivo,"dados_insuficientes");
  const demand=structuredClone(all);demand.alimentacao.necessidade_por_habitante.valor=0;
  assert.equal(f(demand).motivo,"dados_insuficientes");
  assert.throws(()=>previewSupportCapacity(p,{modo:"alterar_canon"}),TypeError);
});
test("demografia não transforma viagem sazonal em migração sem números",async()=>{
  const p=(await atlas.getSupportProfiles())[0];
  const noData=previewPopulationFlow(p,{premissasExplicitas:true});
  assert.equal(noData.calculavel,false);
  assert.equal(noData.faltantes.length,5);
  const make=n=>({valor:n,unidade:"pessoa",periodo:"p1",origem_medicao:"hipotese_ficticia"});
  const med={
    residentes:make(100),nascimentos:make(3),obitos:make(1),
    migracao_entrada:make(5),migracao_saida:make(2)
  };
  const before=JSON.stringify(p);
  const result=previewPopulationFlow(p,{medidas:med,premissasExplicitas:true});
  assert.equal(result.calculavel,true);
  assert.equal(result.populacao_final_hipotetica,105);
  assert.equal(result.migracao_liquida,3);
  assert.equal(JSON.stringify(p),before);
  const period=structuredClone(med);period.migracao_entrada.periodo="p2";
  assert.equal(previewPopulationFlow(p,{medidas:period,premissasExplicitas:true}).motivo,"periodos_incompativeis");
  const gone=structuredClone(med);gone.residentes.valor=0;gone.obitos.valor=10;
  assert.equal(previewPopulationFlow(p,{medidas:gone,premissasExplicitas:true}).motivo,"populacao_inviavel");
});

test("perfis de infraestrutura filtram evidências documentais e lacunas",async()=>{
  const port=await atlas.getInfrastructureProfile("infraestrutura:portomonte");
  assert.equal(port.setores.length,4);
  assert.equal(port.setores[0].materiais_construtivos_confirmados.length,0);
  assert.equal(port.setores[0].instalacoes_especificas_confirmadas.length,1);
  const missing=await atlas.searchInfrastructureProfiles({setorId:"saneamento",estadoSetor:"sem_documentacao"});
  assert.equal(missing.length,2);
  const specified=await atlas.searchInfrastructureProfiles({setorId:"construcao_abrigo",estadoSetor:"evidencia_parcial",
                                                             natureza:"assentamento_civil"});
  assert.equal(specified.length,1);
  assert.equal((await atlas.getInfrastructureIndexes()).by_setor_sem_dados.saneamento.length,2);
  assert.equal(await atlas.getInfrastructureProfile("infraestrutura:nao-existe"),null);
});
test("auditInfrastructure copia evidências e não confunde rocha com material",async()=>{
  const port=await atlas.getInfrastructureProfile("infraestrutura:portomonte");
  const before=JSON.stringify(port);
  const res=auditInfrastructure(port,{sectorId:"construcao_abrigo"});
  assert.equal(res.mutacao_canonica,false);
  assert.equal(res.setores[0].materiais_confirmados.length,0);
  assert.equal(res.setores[0].evidencias[0].classe,"geografia");
  res.setores[0].evidencias[0].descricao="Alteração local";
  assert.equal(JSON.stringify(port),before);
  const all=auditInfrastructure(port);
  assert.equal(all.setores.length,4);
  assert.deepEqual(all.efeitos_dw_aplicados,[]);
  assert.throws(()=>auditInfrastructure(port,{sectorId:"pesca"}),RangeError);
});
test("prévia de problema não cria cais, depósitos nem eventos",async()=>{
  const [port]=await atlas.searchInfrastructureProfiles({assentamentoId:"assentamento:portomonte"});
  const risk=previewInfrastructureIssue(port,{
    sectorId:"armazenamento",hipotese:"Uma tempestade costeira fecha a entrada hipotética de provisões"});
  assert.equal(risk.estado,"hipotese_nao_ocorrida");
  assert.equal(risk.dependencias_potencialmente_relevantes[0],"dependencia:lavoura");
  assert.deepEqual(risk.consequencias_confirmadas,[]);
  assert.deepEqual(risk.efeitos_dw_aplicados,[]);
  assert.equal(risk.mutacao_canonica,false);
  assert.throws(()=>previewInfrastructureIssue(port,{
    sectorId:"armazenamento",hipotese:""}),TypeError);
});

test("consulta dinâmica territorial por origem, destino, tipo e rótulo",async()=>{
  const daCaatinga=await atlas.searchTerritorialDynamics({
    origemRegiaoId:"regiao:caatinga",destinoRegiaoId:"regiao:costa-sul"});
  assert.deepEqual(daCaatinga.map(x=>x.id),["dinamica:pilhagens"]);
  const displaced=await atlas.searchTerritorialDynamics({tipo:"deslocamento_forcado_documentado"});
  assert.equal(displaced.length,1);
  assert.equal(displaced[0].assentamento_alvo_id,null);
  assert.equal((await atlas.getTerritorialLabels()).length,2);
  assert.equal((await atlas.getTerritorialIndexes()).by_destino_regiao["regiao:costa-sul"].length,2);
  assert.equal((await atlas.getTerritorialDynamic("dinamica:refugiados")).id,"dinamica:refugiados");
  assert.equal(await atlas.getTerritorialDynamic("dinamica:desconhecida"),null);
});
test("pressões territoriais regionais não causam ataques localizados em Portomonte",async()=>{
  const raids=(await atlas.getTerritorialDynamic("dinamica:pilhagens"));
  const before=JSON.stringify(raids);
  const preview=previewTerritorialImpact(raids,{assentamentoId:"assentamento:portomonte"});
  assert.equal(preview.somente_evidencia_regional,true);
  assert.equal(preview.atribuicao_automatica_bloqueada,true);
  assert.equal(preview.evento_especifico_confirmado,false);
  assert.equal(preview.mutacao_canonica,false);
  assert.deepEqual(preview.efeitos_dw_aplicados,[]);
  preview.lacunas[0]="mudança de visualização";
  assert.equal(JSON.stringify(raids),before);
});
test("refugiados de Eldroth não são atribuídos a uma cidade específica",async()=>{
  const refugees=(await atlas.getTerritorialDynamic("dinamica:refugiados"));
  const preview=previewTerritorialImpact(refugees,{assentamentoId:"assentamento:portomonte"});
  assert.equal(preview.atribuicao_automatica_bloqueada,true);
  assert.equal(preview.evento_especifico_confirmado,false);
  assert.equal(preview.regioes.origem,"regiao:eldroth");
  assert.equal(preview.regioes.destino,"regiao:costa-sul");
  const regional=previewTerritorialImpact(refugees);
  assert.equal(regional.foco_consultado,null);
  assert.throws(()=>previewTerritorialImpact(null),TypeError);
  assert.throws(()=>previewTerritorialImpact(refugees,{assentamentoId:"lugar:portomonte"}),TypeError);
});

test("alvo explicitamente nomeado não confirma ocorrência de evento em campanha",async()=>{
  const regional=await atlas.getTerritorialDynamic("dinamica:pilhagens");
  const hypothetical={...regional,escala:"entre_assentamentos",assentamento_alvo_id:"assentamento:portomonte"};
  const review=previewTerritorialImpact(hypothetical,{assentamentoId:"assentamento:portomonte"});
  assert.equal(review.alvo_nomeado_no_registro,true);
  assert.equal(review.evento_especifico_confirmado,false);
  assert.equal(review.mutacao_canonica,false);
});

test("dossiês regionais consultam origem, tema e falta de assentamentos curados",async()=>{
  const ds=await atlas.getRegionalDossiers();
  assert.equal(ds.length,3);
  assert.equal((await atlas.getRegionalDossier("dossie-regional:caatinga")).regiao_id,"regiao:caatinga");
  assert.equal(await atlas.getRegionalDossier("dossie-regional:ausente"),null);
  const without=await atlas.searchRegionalDossiers({semAssentamentosCurados:true});
  assert.deepEqual(without.map(x=>x.regiao_id),["regiao:caatinga","regiao:foz-rio-ancestral"]);
  assert.equal((await atlas.searchRegionalDossiers({temaPergunta:"mobilidade"})).length,1);
  assert.equal((await atlas.searchRegionalDossiers({dinamicaId:"dinamica:pilhagens"})).length,2);
  assert.equal((await atlas.getRegionalDossierIndexes()).by_ausencia_assentamento_curado.sim.length,2);
});
test("dossiê não interpreta região sem assentamento cadastrado como desabitada",async()=>{
  const dossier=await atlas.getRegionalDossier("dossie-regional:caatinga");
  const old=JSON.stringify(dossier);
  const review=reviewRegionalDossier(dossier);
  assert.equal(review.aviso_sem_assentamento_curado,true);
  assert.equal(review.indicadores_de_cobertura.assentamentos,0);
  assert.equal(review.nao_significa,"regiao_desabitada_ou_sem_recursos");
  assert.equal(review.eventos_campanha_confirmados.length,0);
  assert.deepEqual(review.regioes_das_dinamicas[0].papeis_regionais,["origem"]);
  review.questoes[0].pergunta="Pergunta local modificada";
  review.regioes_das_dinamicas[0].papeis_regionais.push("destino");
  assert.equal(JSON.stringify(dossier),old);
  assert.throws(()=>reviewRegionalDossier({id:"dossie-regional:falso",inventario:{},perguntas:[]}),TypeError);
});
test("cruzamento entre regiões preserva papéis origem/destino",async()=>{
  const caatinga=reviewRegionalDossier(await atlas.getRegionalDossier("dossie-regional:caatinga"));
  const coast=reviewRegionalDossier(await atlas.getRegionalDossier("dossie-regional:costa-sul"));
  assert.deepEqual(caatinga.regioes_das_dinamicas[0].papeis_regionais,["origem"]);
  assert.deepEqual(coast.regioes_das_dinamicas[0].papeis_regionais,["destino"]);
  assert.equal(caatinga.mutacao_canonica,false);
  assert.deepEqual(coast.efeitos_dw_aplicados,[]);
});

test("fila de pesquisa filtra prioridades e conserva perguntas ainda não priorizadas",async()=>{
  assert.equal((await atlas.getResearchBacklog()).length,4);
  assert.equal((await atlas.searchResearchBacklog({priorizada:true})).length,3);
  assert.equal((await atlas.searchResearchBacklog({priorizada:false})).length,1);
  assert.equal((await atlas.searchResearchBacklog({regiaoId:"regiao:caatinga"})).length,2);
  assert.equal((await atlas.searchResearchBacklog({faixaPrioridade:"segundo_lote"})).length,1);
  assert.equal((await atlas.searchResearchBacklog({dependeDePergunta:"pergunta:caatinga-habitacao"})).length,1);
  assert.equal((await atlas.searchResearchBacklog({artefatoPotencial:"lugar"})).length,1);
  assert.equal((await atlas.getResearchBacklogItem("pendencia:caatinga-abastecimento")).ordem_editorial,3);
  assert.equal(await atlas.getResearchBacklogItem("pendencia:desconhecida"),null);
  assert.equal((await atlas.getResearchBacklogIndexes()).by_regiao["regiao:caatinga"].length,2);
});
test("inspeção de pesquisa não resolve perguntas ou libera cânone por conta própria",async()=>{
  const rows=await atlas.getResearchBacklog();
  const old=JSON.stringify(rows);
  const review=reviewResearchBacklog(rows);
  assert.equal(review.priorizadas,3);
  assert.equal(review.nao_priorizadas,1);
  assert.equal(review.perguntas_respondidas,0);
  assert.equal(review.mutacao_canonica,false);
  assert.deepEqual(review.efeitos_dw_aplicados,[]);
  const dependent=review.registros.find(x=>x.id==="pendencia:caatinga-abastecimento");
  assert.equal(dependent.depende_de_perguntas[0].pergunta_id,"pergunta:caatinga-habitacao");
  assert.equal(dependent.depende_de_perguntas[0].respondido,false);
  assert.equal(dependent.evidencia_pendente,true);
  dependent.evidencias_necessarias.push("Fato inventado");
  assert.equal(JSON.stringify(rows),old);
  const local=reviewResearchBacklog(rows,{regiaoId:"regiao:caatinga"});
  assert.equal(local.total_na_visao,2);
  assert.throws(()=>reviewResearchBacklog([...rows,rows[0]]),TypeError);
  assert.throws(()=>reviewResearchBacklog([{...rows[0],depende_de_perguntas:["pergunta:inexistente"]}]),RangeError);
});

test("busca da lore do manuscrito preserva páginas e separa taxonomias",async()=>{
  const material=await atlas.searchLore({query:"AbÍSSAIS",tipo:"povo"});
  assert.equal(material.length,1);
  assert.equal(material[0].id,"lore-hack:abissais-marinhos");
  assert.deepEqual(material[0].paginas,[14,15]);
  assert.equal((await atlas.searchLore({query:"kuotoa",pagina:14})).length,1);
  assert.equal((await atlas.searchLore({tipo:"divindade",pagina:5})).length,1);
  assert.equal((await atlas.getLoreIndex()).length,3);
  assert.equal((await atlas.getLoreIndexIndexes()).by_tipo.povo.length,2);
  assert.equal((await atlas.getLoreEntity("lore-hack:kuo-toa")).nome,"Kuo-Toa");
  assert.equal(await atlas.getLoreEntity("lore-hack:nada"),null);
});
test("cronologia, incógnitas e revisões não modificam cânone automaticamente",async()=>{
  const chronology=await atlas.getLoreChronology();
  const reviews=await atlas.getLoreReviewNotes();
  assert.deepEqual(chronology.eventos.map(x=>x.ano_ec),[342,351]);
  assert.equal(chronology.questoes_abertas[0].estado,"explicitamente_em_aberto");
  assert.ok(reviews.revisoes.every(r=>r.acao_autorizada===false));
  assert.ok((await atlas.getLoreIndex()).every(e=>e.integracao==="referencia_sem_mutar_canonico"));
});

test("pontes entre manuscrito e atlas são referências editoriais sem mutação",async()=>{
  const links=await atlas.getLoreAtlasLinks();
  assert.equal(links.length,2);
  assert.ok(links.every(x=>x.aplicar_automaticamente===false&&x.status==="pendente_revisao_autoral"));
  const consult=await atlas.searchLoreAtlasLinks({regiaoId:"regiao:costa-sul",perguntaId:"pergunta:costa-sul-agua"});
  assert.equal(consult.length,1);
  assert.equal(consult[0].pagina,5);
  assert.equal((await atlas.searchLoreAtlasLinks({entradaLoreId:"lore-hack:abissais-marinhos"})).length,1);
  assert.equal((await atlas.getLoreAtlasLinkIndexes()).by_pergunta["pergunta:costa-sul-agua"].length,1);
  assert.equal((await atlas.searchLoreAtlasLinks({parecer:"nao_encontrado"})).length,0);
});

test("páginas mecânicas são pesquisáveis sem se tornarem fatos de ambientação",async()=>{
  const ix=await atlas.getHackMechanicsIndex();
  assert.equal(ix.nao_usar_como_fato_de_ambientacao,true);
  assert.deepEqual(ix.paginas_sem_texto_extraivel,[91]);
  assert.deepEqual((await atlas.searchHackMechanicsPages({query:"portomontense"})).map(x=>x.pagina),[49]);
  assert.deepEqual((await atlas.searchHackMechanicsPages({comRequer:true})).map(x=>x.pagina),[70]);
  assert.equal((await atlas.searchHackMechanicsPages({categoria:"movimentos_de_classe"})).length,1);
  assert.equal((await atlas.searchHackMechanicsPages({pagina:49})).length,1);
  assert.equal((await atlas.searchHackMechanicsPages({query:"vendo vermelho"})).length,1);
});

test("terceira auditoria pesquisa relações com páginas e proíbe promoção automática",async()=>{
 const a=await atlas.searchLoreRelations({entidadeId:"lore-hack:kuo-toa"});
 assert.equal(a.length,1);
 assert.equal(a[0].destino_id,"lore-hack:daegon");
 assert.equal(a[0].aplicacao_canonica,false);
 assert.equal((await atlas.searchLoreRelations({tipo:"habitat_insular",pagina:14})).length,1);
 assert.equal((await atlas.getLoreRelationIndexes()).by_tipo.culto.length,1);
});
test("movimentos com REQUER literal não são aplicados ao jogo",async()=>{
 const all=await atlas.getSelectedMovements();
 assert.equal(all.length,3);
 assert.equal((await atlas.searchSelectedMovements({grupo:"GUERREIRO",requisito:"Vendo Vermelho"})).length,1);
 assert.equal((await atlas.searchSelectedMovements({categoria:"povo",texto:"portomontense"})).length,1);
 const dependent=(await atlas.searchSelectedMovements({requisito:"Horizontes"}))[0];
 assert.equal(dependent.titulo,"NENHUM MUNDO É LONGE DEMAIS");
 assert.equal(dependent.efeito_revisado,false);
 assert.equal(dependent.aplicacao_canonica,false);
 assert.equal((await atlas.getSelectedMovementIndexes()).by_grupo["CAÇADOR"].length,1);
});

test("quarta auditoria permite buscar os movimentos de povo completos e suas opções",async()=>{
  const all=await atlas.getCompletePilotMovements();
  assert.equal(all.length,2);
  assert.equal((await atlas.searchCompletePilotMovements({grupo:"HUMANOS"})).length,1);
  assert.equal((await atlas.searchCompletePilotMovements({titulo:"saqueador",comOpcoes:true})).length,1);
  assert.equal((await atlas.searchCompletePilotMovements({marcador:"Cultura"})).length,2);
  const saqueador=(await atlas.searchCompletePilotMovements({comOpcoes:true}))[0];
  assert.equal(saqueador.opcoes.length,4);
  assert.deepEqual(saqueador.opcoes.map(o=>o.paragrafo_docx),[838,839,840,841]);
  assert.equal(saqueador.aplicacao_canonica,false);
  assert.equal((await atlas.getCompletePilotMovementIndexes()).by_grupo.HUMANOS.length,1);
});
test("inventário DOCX registra quadros básicos separadamente de tabelas numéricas",async()=>{
  const all=await atlas.getDocxTables();
  assert.equal(all.length,3);
  assert.equal((await atlas.searchDocxTables({tipo:"quadro_movimento_geral"})).length,2);
  assert.equal((await atlas.searchDocxTables({titulo:"desafiar o perigo"}))[0].tabela_docx_indice,14);
  assert.equal((await atlas.getDocxTableIndexes()).by_tipo.quadro_movimento_geral.length,2);
  assert.ok(all.every(x=>x.aplicacao_canonica===false));
});

test("movimentos gerais do Hack distinguem Recrutar de Mandados Pendentes",async()=>{
  const ambos=await atlas.searchGeneralMovements({quadroId:"quadro-geral-docx:30"});
  assert.equal(ambos.length,2);
  assert.deepEqual(ambos.map(x=>x.titulo),["RECRUTAR","MANDADOS PENDENTES"]);
  assert.equal(ambos.every(x=>x.aplicacao_canonica===false),true);
  assert.equal((await atlas.searchGeneralMovements({faixa:"10+"})).length,1);
  assert.equal((await atlas.searchGeneralMovements({query:"civilizado"}))[0].titulo,"MANDADOS PENDENTES");
  assert.equal((await atlas.getGeneralMovement("movimento-geral:docx-32")).titulo,"SERVOS");
  assert.equal((await atlas.searchGeneralMovements({comGatilho:false})).length,1);
  assert.equal(await atlas.getGeneralMovement("movimento-geral:docx-99"),null);
  const indices=await atlas.getGeneralMovementIndexes();
  assert.equal(indices.by_categoria.avancado.length,2);
});

test("núcleo do Hack preserva cinco movimentos iniciais sem inventar distribuição",async()=>{
  const regras=await atlas.getHackCoreRules();
  assert.equal(regras.personagens.movimentos_proprios_nivel_1,5);
  assert.equal(regras.personagens.distribuicao_numerica_por_origem,null);
  assert.deepEqual(regras.personagens.valores_iniciais_para_distribuir,[16,15,13,12,9,8]);
  assert.equal(regras.aplicacao_canonica,false);
});

test("movimentos dos povos preservam escolhas e permitem buscas por região cultural",async()=>{
  const a=await atlas.searchPeopleMovements({grupo:"ANÕES DE THARGRID",comOpcoes:true});
  assert.equal(a.length,1);
  assert.equal(a[0].titulo,"ENGENHEIRO SOB A MONTANHA");
  assert.equal(a[0].opcoes[0].paragrafo_docx,850);
  assert.equal((await atlas.getPeopleMovement("movimento-povo:paragrafo-827")).grupo,"HUMANOS");
  assert.equal((await atlas.searchPeopleMovements({query:"ponto de maior tensão"})).length,1);
  assert.equal(await atlas.getPeopleMovement("nao-existe"),null);
  assert.equal((await atlas.getPeopleMovementIndexes()).by_grupo.HUMANOS.length,1);
});
test("REQUER identifica vínculos candidatos sem habilitar compras de movimentos",async()=>{
  const cls=await atlas.searchClassMovements({grupo:"GUERREIRO",comRequer:true});
  assert.deepEqual(cls.map(x=>x.titulo),["ARMA APERFEIÇOADA","PASSO ARCANO"]);
  const p=await atlas.getClassRequirementPreview("movimento-classe:paragrafo-1120");
  assert.equal(p.vinculos_candidatos.length,1);
  assert.equal(p.vinculos_candidatos[0].presente_na_lista,false);
  assert.equal(p.habilitado_para_compra,null);
  assert.equal(p.necessita_avaliacao_do_mestre,true);
  const presente=await atlas.getClassRequirementPreview("movimento-classe:paragrafo-1120",
     {movimentosPossuidos:["movimento-classe:paragrafo-1047"]});
  assert.equal(presente.todos_candidatos_presentes,true);
  assert.equal(presente.habilitado_para_compra,null);
  const composto=await atlas.getClassRequirementPreview("movimento-classe:paragrafo-1229");
  assert.equal(composto.expressoes_nao_resolvidas.length,1);
  assert.equal(composto.habilitado_para_compra,null);
  const livre=await atlas.getClassRequirementPreview("movimento-classe:paragrafo-1047");
  assert.equal(livre.requisito_literal,null);
  assert.equal(livre.habilitado_para_compra,null);
  assert.equal(await atlas.getClassRequirementPreview("nao-existe"),null);
  assert.equal((await atlas.getClassRequirementCandidates()).length,1);
  assert.equal((await atlas.getClassRequirementPending()).length,1);
  assert.equal((await atlas.getClassMovementIndexes()).by_grupo.GUERREIRO.length,3);
  assert.throws(()=>previewClassRequirements("qualquer",null,[],[]),TypeError);
});

test("Guerreiro integral busca texto e conserva REQUER composto sem autorizar compra",async()=>{
  const todos=await atlas.getWarriorMovements();
  assert.equal(todos.length,3);
  assert.equal((await atlas.searchWarriorMovements({comRequer:true})).length,2);
  assert.equal((await atlas.searchWarriorMovements({tipoRequisito:"todos"}))[0].titulo,"PASSO ARCANO");
  assert.equal((await atlas.searchWarriorMovements({query:"segunda característica"}))[0].titulo,"ARMA APERFEIÇOADA");
  assert.equal((await atlas.getWarriorMovement("movimento-classe:paragrafo-1047")).titulo,"ARMA FAVORITA");
  assert.equal(await atlas.getWarriorMovement("movimento-classe:paragrafo-9999"),null);
  assert.equal((await atlas.getWarriorMovementIndexes()).by_tem_requer.sim.length,2);
  const prev=await atlas.getWarriorRequirementPreview("movimento-classe:paragrafo-1120",
    {movimentosPossuidos:["movimento-classe:paragrafo-1047"]});
  assert.equal(prev.vinculos_candidatos[0].presente_na_lista,true);
  assert.equal(prev.habilitado_para_compra,null);
  assert.equal(prev.aplicacao_canonica,false);
  const composto=await atlas.getWarriorRequirementPreview("movimento-classe:paragrafo-1229",
    {movimentosPossuidos:["movimento-classe:paragrafo-1139"]});
  assert.equal(composto.requisito_estruturado.tipo,"todos");
  assert.equal(composto.expressoes_nao_resolvidas.length,1);
  assert.equal(composto.habilitado_para_compra,null);
});

test("Bárbaro integral preserva opções e dependência conjuntiva sem autorizar compra",async()=>{
  const todos=await atlas.getBarbarianMovements();
  assert.equal(todos.length,4);
  assert.equal((await atlas.searchBarbarianMovements({comRequer:true})).length,3);
  assert.equal((await atlas.searchBarbarianMovements({tipoRequisito:"todos"}))[0].titulo,"FÚRIA ALÉM DA MORTE");
  assert.equal((await atlas.searchBarbarianMovements({query:"conscientemente"}))[0].titulo,"FÚRIA");
  assert.equal((await atlas.searchBarbarianMovements({comOpcoes:true})).length,2);
  assert.equal((await atlas.getBarbarianMovement("movimento-classe:paragrafo-1293")).titulo,"FÚRIA");
  assert.equal(await atlas.getBarbarianMovement("movimento-classe:paragrafo-9999"),null);
  const indice=await atlas.getBarbarianMovementIndexes();
  assert.equal(indice.by_requisito_tipo.todos.length,1);
  const req="movimento-classe:paragrafo-1430";
  const semi=await atlas.getBarbarianRequirementPreview(req,{movimentosPossuidos:["movimento-classe:paragrafo-1427"]});
  assert.equal(semi.componentes_requeridos.length,2);
  assert.deepEqual(semi.componentes_requeridos.map(x=>x.presente_na_lista),[true,false]);
  assert.equal(semi.componentes_identificados_presentes,false);
  assert.equal(semi.habilitado_para_compra,null);
  assert.equal(semi.aplicacao_canonica,false);
  const ambos=await atlas.getBarbarianRequirementPreview(req,{
    movimentosPossuidos:["movimento-classe:paragrafo-1427","movimento-classe:paragrafo-1343"]
  });
  assert.equal(ambos.componentes_identificados_presentes,true);
  assert.equal(ambos.habilitado_para_compra,null);
  assert.equal(ambos.necessita_avaliacao_do_mestre,true);
  assert.equal(await atlas.getBarbarianRequirementPreview("nao-existe"),null);
  await assert.rejects(
    ()=>atlas.getBarbarianRequirementPreview(req,{movimentosPossuidos:"errado"}),
    TypeError
  );
});

test("Caçador distingue REQUER E, OU e alternativas ficcionais sem homologar aquisição",async()=>{
  const todos=await atlas.getHunterMovements();
  assert.equal(todos.length,4);
  assert.equal((await atlas.searchHunterMovements({comRequer:true})).length,3);
  assert.equal((await atlas.searchHunterMovements({tipoRequisito:"todos"}))[0].titulo,
               "NENHUM MUNDO É LONGE DEMAIS");
  assert.equal((await atlas.searchHunterMovements({tipoRequisito:"qualquer"})).length,2);
  assert.equal((await atlas.searchHunterMovements({comCondicaoFiccional:true}))[0].titulo,"BARRIGA DE SMAUG");
  assert.equal((await atlas.searchHunterMovements({comCondicaoFiccional:false})).length,3);
  assert.equal((await atlas.searchHunterMovements({comOpcoes:true}))[0].titulo,"BARRIGA DE SMAUG");
  assert.equal((await atlas.getHunterMovement("movimento-classe:paragrafo-1484")).titulo,"CAÇADOR DE MONSTROS");
  assert.equal(await atlas.getHunterMovement("movimento-classe:paragrafo-9999"),null);
  assert.equal((await atlas.getHunterMovementIndexes()).by_requisito_tipo.qualquer.length,2);
  let p=await atlas.getHunterRequirementPreview("movimento-classe:paragrafo-1492");
  assert.equal(p.operador,"qualquer");
  assert.equal(p.verificacao_estrutural,"alternativa_ficcional_pendente");
  assert.equal(p.componentes[1].comprovacao_ficcional,"pendente_avaliacao");
  assert.equal(p.habilitado_para_compra,null);
  let comMonstro=await atlas.getHunterRequirementPreview("movimento-classe:paragrafo-1492",{
    movimentosPossuidos:["movimento-classe:paragrafo-1484"]});
  assert.equal(comMonstro.verificacao_estrutural,"alternativa_de_movimento_presente");
  assert.equal(comMonstro.habilitado_para_compra,null);
  let parcial=await atlas.getHunterRequirementPreview("movimento-classe:paragrafo-1520",{
    movimentosPossuidos:["movimento-classe:paragrafo-1518"]});
  assert.equal(parcial.verificacao_estrutural,"componentes_ausentes_ou_nao_comprovados");
  let completo=await atlas.getHunterRequirementPreview("movimento-classe:paragrafo-1520",{
    movimentosPossuidos:["movimento-classe:paragrafo-1518","movimento-classe:paragrafo-1461"]});
  assert.equal(completo.verificacao_estrutural,"componentes_identificados_presentes");
  assert.equal(completo.habilitado_para_compra,null);
  assert.equal(completo.necessita_avaliacao_do_mestre,true);
  let alternativo=await atlas.getHunterRequirementPreview("movimento-classe:paragrafo-1535",{
    movimentosPossuidos:["movimento-classe:paragrafo-1461"]});
  assert.equal(alternativo.verificacao_estrutural,"alternativa_de_movimento_presente");
  assert.equal(alternativo.aplicacao_canonica,false);
  assert.equal(await atlas.getHunterRequirementPreview("ausente"),null);
  await assert.rejects(()=>atlas.getHunterRequirementPreview("movimento-classe:paragrafo-1492",{
    movimentosPossuidos: "não é um array"}),TypeError);
});

test("Ladino preserva REQUER OU, referências sem alvo e impede aquisição automática",async()=>{
  const todos=await atlas.getRogueMovements();
  assert.equal(todos.length,6);
  assert.equal((await atlas.searchRogueMovements({tipoRequisito:"qualquer"})).length,1);
  assert.equal((await atlas.searchRogueMovements({tipoRequisito:"referencia_sem_alvo"}))[0].titulo,"CUTUCAR A FERIDA");
  assert.equal((await atlas.searchRogueMovements({requer:"heist"}))[0].titulo,"TUDO SEGUNDO O PLANO");
  assert.equal((await atlas.searchRogueMovements({comOpcoes:true})).length,1);
  assert.equal((await atlas.getRogueMovement("movimento-classe:paragrafo-1594")).titulo,"ABRIR O IMPOSSÍVEL");
  assert.equal(await atlas.getRogueMovement("movimento-classe:paragrafo-9999"),null);
  const indices=await atlas.getRogueMovementIndexes();
  assert.deepEqual(indices.by_referencia_sem_alvo.Perfil,["movimento-classe:paragrafo-1724"]);
  let or=await atlas.getRogueRequirementPreview("movimento-classe:paragrafo-1619");
  assert.equal(or.verificacao_estrutural,"nenhuma_alternativa_presente");
  assert.deepEqual(or.componentes.map(x=>x.presente_na_lista),[false,false]);
  assert.equal(or.habilitado_para_compra,null);
  let heist=await atlas.getRogueRequirementPreview("movimento-classe:paragrafo-1619",{
    movimentosPossuidos:["movimento-classe:paragrafo-1612"]});
  assert.equal(heist.verificacao_estrutural,"uma_alternativa_presente");
  assert.deepEqual(heist.componentes.map(x=>x.presente_na_lista),[true,false]);
  assert.equal(heist.habilitado_para_compra,null);
  let perfil=await atlas.getRogueRequirementPreview("movimento-classe:paragrafo-1724",{
    movimentosPossuidos:["movimento-classe:paragrafo-1612"]});
  assert.equal(perfil.verificacao_estrutural,"referencia_sem_alvo_documentado");
  assert.equal(perfil.requisito_estruturado.texto_literal,"Perfil");
  assert.deepEqual(perfil.componentes,[]);
  assert.equal(perfil.habilitado_para_compra,null);
  assert.equal(perfil.necessita_avaliacao_do_mestre,true);
  assert.equal(perfil.aplicacao_canonica,false);
  let direto=await atlas.getRogueRequirementPreview("movimento-classe:paragrafo-1594",{
    movimentosPossuidos:["movimento-classe:paragrafo-1593"]});
  assert.equal(direto.verificacao_estrutural,"movimento_requerido_presente");
  assert.equal(direto.habilitado_para_compra,null);
  assert.equal(await atlas.getRogueRequirementPreview("nao-existe"),null);
  await assert.rejects(()=>atlas.getRogueRequirementPreview("movimento-classe:paragrafo-1724",{
    movimentosPossuidos:"fora-de-formato"}),TypeError);
});

test("Bardo verifica Arte Arcana e dois OUTROS movimentos, sem contagem duplicada",async()=>{
  const rows=await atlas.getBardMovements();
  assert.equal(rows.length,5);
  assert.equal((await atlas.searchBardMovements({tipoRequisito:"todos"}))[0].titulo,
               "A CANÇÃO QUE FEZ O MUNDO");
  assert.equal((await atlas.searchBardMovements({comOpcoes:true}))[0].titulo,"ARTE ARCANA");
  assert.equal((await atlas.searchBardMovements({requer:"inspiração"}))[0].titulo,"INSPIRAÇÃO CONTAGIOSA");
  assert.equal((await atlas.getBardMovement("movimento-classe:paragrafo-1753")).titulo,"ARTE ARCANA");
  assert.equal(await atlas.getBardMovement("movimento-classe:paragrafo-8888"),null);
  const ix=await atlas.getBardMovementIndexes();
  assert.deepEqual(ix.by_quantidade_minima_grupo["BARDO:2"],["movimento-classe:paragrafo-1843"]);
  const required="movimento-classe:paragrafo-1843";
  let missing=await atlas.getBardRequirementPreview(required);
  assert.equal(missing.verificacao_estrutural,"arte_arcana_ausente");
  assert.equal(missing.habilitado_para_compra,null);
  let arteOnly=await atlas.getBardRequirementPreview(required,{
    movimentosPossuidos:["movimento-classe:paragrafo-1753","movimento-classe:paragrafo-1753",
                         required,"movimento-classe:paragrafo-1047"]});
  assert.equal(arteOnly.componentes[1].quantidade_presente,0);
  assert.equal(arteOnly.verificacao_estrutural,"outros_movimentos_insuficientes");
  let one=await atlas.getBardRequirementPreview(required,{movimentosPossuidos:[
    "movimento-classe:paragrafo-1753","movimento-classe:paragrafo-1798",
    "movimento-classe:paragrafo-1798"]});
  assert.equal(one.componentes[1].quantidade_presente,1);
  let twoNoArte=await atlas.getBardRequirementPreview(required,{movimentosPossuidos:[
    "movimento-classe:paragrafo-1798","movimento-classe:paragrafo-1816"]});
  assert.equal(twoNoArte.verificacao_estrutural,"arte_arcana_ausente");
  let complete=await atlas.getBardRequirementPreview(required,{movimentosPossuidos:[
    "movimento-classe:paragrafo-1753","movimento-classe:paragrafo-1798",
    "movimento-classe:paragrafo-1816"]});
  assert.equal(complete.verificacao_estrutural,"componentes_identificados_presentes");
  assert.equal(complete.componentes[1].quantidade_presente,2);
  assert.equal(complete.habilitado_para_compra,null);
  assert.equal(complete.necessita_avaliacao_do_mestre,true);
  assert.equal(complete.aplicacao_canonica,false);
  let direto=await atlas.getBardRequirementPreview("movimento-classe:paragrafo-1799",{
    movimentosPossuidos:["movimento-classe:paragrafo-1798"]});
  assert.equal(direto.habilitado_para_compra,null);
  assert.equal(await atlas.getBardRequirementPreview("movimento-classe:paragrafo-9999"),null);
  await assert.rejects(()=>atlas.getBardRequirementPreview(required,{
    movimentosPossuidos:"não é array"}),TypeError);
});


test("Artista Marcial exige Forma do Ar E Corpo Sem Peso para VOO sem aquisição automática",async()=>{
  const all=await atlas.getMartialArtistMovements();
  assert.equal(all.length,5);
  assert.equal((await atlas.searchMartialArtistMovements({tipoRequisito:"todos"}))[0].titulo,"VOO");
  assert.equal((await atlas.searchMartialArtistMovements({requer:"corpo vazio"})).length,0);
  assert.equal((await atlas.searchMartialArtistMovements({comOpcoes:true}))[0].titulo,"MÃO ABERTA");
  assert.equal((await atlas.getMartialArtistMovement("movimento-classe:paragrafo-1962")).titulo,"VOO");
  assert.equal(await atlas.getMartialArtistMovement("movimento-classe:paragrafo-9999"),null);
  const ix=await atlas.getMartialArtistMovementIndexes();
  assert.deepEqual(ix.by_requisito_tipo.todos,["movimento-classe:paragrafo-1962"]);
  const id="movimento-classe:paragrafo-1962";
  const ausente=await atlas.getMartialArtistRequirementPreview(id);
  assert.equal(ausente.verificacao_estrutural,"componentes_ausentes");
  assert.deepEqual(ausente.componentes_requeridos.map(x=>x.presente_na_lista),[false,false]);
  assert.equal(ausente.habilitado_para_compra,null);
  const parcial=await atlas.getMartialArtistRequirementPreview(id,{
    movimentosPossuidos:["movimento-classe:paragrafo-1949"]});
  assert.deepEqual(parcial.componentes_requeridos.map(x=>x.presente_na_lista),[true,false]);
  assert.equal(parcial.verificacao_estrutural,"componentes_ausentes");
  const completo=await atlas.getMartialArtistRequirementPreview(id,{
    movimentosPossuidos:["movimento-classe:paragrafo-1949","movimento-classe:paragrafo-1950"]});
  assert.deepEqual(completo.componentes_requeridos.map(x=>x.presente_na_lista),[true,true]);
  assert.equal(completo.verificacao_estrutural,"componentes_identificados_presentes");
  assert.equal(completo.componentes_identificados_presentes,true);
  assert.equal(completo.habilitado_para_compra,null);
  assert.equal(completo.necessita_avaliacao_do_mestre,true);
  assert.equal(completo.aplicacao_canonica,false);
  const direto=await atlas.getMartialArtistRequirementPreview("movimento-classe:paragrafo-1950",{
    movimentosPossuidos:["movimento-classe:paragrafo-1949"]});
  assert.equal(direto.habilitado_para_compra,null);
  assert.equal(await atlas.getMartialArtistRequirementPreview("nada"),null);
  await assert.rejects(()=>atlas.getMartialArtistRequirementPreview(id,{
    movimentosPossuidos:"não é array"}),TypeError);
});



test("Paladino concede dois movimentos gratuitamente sem dispensar REQUER",async()=>{
  const all=await atlas.getPaladinMovements();
  assert.equal(all.length,3);
  const origem=await atlas.getPaladinMovement("movimento-classe:paragrafo-1968");
  assert.equal(origem.concessoes_gratuitas_literais.length,2);
  assert.equal((await atlas.searchPaladinMovements({comConcessoes:true})).length,1);
  assert.equal((await atlas.searchPaladinMovements({comRequer:true})).length,2);
  assert.equal((await atlas.searchPaladinMovements({requer:"MISSAO SAGRADA"})).length,2);
  assert.equal((await atlas.searchPaladinMovements({query:"livremente"})).length,1);
  assert.equal((await atlas.getPaladinMovementIndexes()).by_tem_requer.sim.length,2);
  const juramento="movimento-classe:paragrafo-1976";
  const ausente=await atlas.getPaladinRequirementPreview(juramento);
  assert.equal(ausente.verificacao_estrutural,"componente_ausente");
  assert.equal(ausente.habilitado_para_compra,null);
  const presente=await atlas.getPaladinRequirementPreview(juramento,{
    movimentosPossuidos:[origem.id]});
  assert.equal(presente.verificacao_estrutural,"componente_identificado_presente");
  assert.equal(presente.aplicacao_canonica,false);
  const grants=await atlas.getPaladinGrantPreview(origem.id,{movimentosPossuidos:[origem.id]});
  assert.equal(grants.concessoes.length,2);
  assert.ok(grants.concessoes.every(x=>x.requer_permanece_obrigatorio&&
    x.atribuicao_automatica===false&&x.habilitado_para_compra===null));
  assert.equal(await atlas.getPaladinGrantPreview("movimento-classe:paragrafo-9999"),null);
  await assert.rejects(()=>atlas.getPaladinRequirementPreview(juramento,{
    movimentosPossuidos:"invalido"}),TypeError);
});



test("Clérigo preserva raízes distintas e REQUER transitivos sem liberar seleção",async()=>{
  const all=await atlas.getClericMovements();
  assert.equal(all.length,5);
  assert.equal((await atlas.searchClericMovements({requer:"SACERDOTE"})).length,1);
  assert.equal((await atlas.searchClericMovements({titulo:"pele escrita"})).length,1);
  assert.equal((await atlas.searchClericMovements({comOpcoes:true}))[0].titulo,"MILAGRES");
  assert.equal((await atlas.searchClericMovements({
    raizDependencia:"movimento-classe:paragrafo-2089"})).length,2);
  assert.equal((await atlas.getClericMovementIndexes()).by_requisito_tipo.movimento_exato.length,3);
  const id="movimento-classe:paragrafo-2100";
  const none=await atlas.getClericDependencyChain(id);
  assert.deepEqual(none.cadeia_imediato_para_raiz.map(x=>x.movimento_id),[
    "movimento-classe:paragrafo-2099","movimento-classe:paragrafo-2089"]);
  assert.equal(none.componentes_identificados_presentes,false);
  const partial=await atlas.getClericDependencyChain(id,{
    movimentosPossuidos:["movimento-classe:paragrafo-2089"]});
  assert.deepEqual(partial.cadeia_imediato_para_raiz.map(x=>x.presente_na_lista),[false,true]);
  const complete=await atlas.getClericDependencyChain(id,{
    movimentosPossuidos:["movimento-classe:paragrafo-2089","movimento-classe:paragrafo-2099"]});
  assert.equal(complete.componentes_identificados_presentes,true);
  assert.equal(complete.habilitado_para_compra,null);
  assert.equal(complete.necessita_avaliacao_do_mestre,true);
  assert.equal(complete.aplicacao_canonica,false);
  const priest=await atlas.getClericDependencyChain("movimento-classe:paragrafo-2056");
  assert.deepEqual(priest.cadeia_imediato_para_raiz,[]);
  assert.equal(await atlas.getClericDependencyChain("movimento-classe:paragrafo-9999"),null);
  await assert.rejects(()=>atlas.getClericDependencyChain(id,{movimentosPossuidos:"invalido"}),TypeError);
});


test("Druida exige Metamorfose E Maestria Elemental para Forma Primordial",async()=>{
  const all=await atlas.getDruidMovements();
  assert.equal(all.length,5);
  assert.equal((await atlas.searchDruidMovements({tipoRequisito:"todos"}))[0].titulo,"FORMA PRIMORDIAL");
  assert.equal((await atlas.searchDruidMovements({requer:"maestria elemental"})).length,1);
  assert.equal((await atlas.searchDruidMovements({titulo:"circulo dos esporos"})).length,1);
  assert.equal((await atlas.searchDruidMovements({comOpcoes:true}))[0].titulo,"CORPO SIMBIÓTICO");
  assert.equal((await atlas.getDruidMovementIndexes()).by_requisito_id["movimento-classe:paragrafo-2131"].length,1);
  const forma="movimento-classe:paragrafo-2146",meta="movimento-classe:paragrafo-2130";
  const maestro="movimento-classe:paragrafo-2131";
  const none=await atlas.getDruidRequirementPreview(forma);
  assert.equal(none.operador_literal,"e");
  assert.deepEqual(none.componentes_requeridos.map(x=>x.presente_na_lista),[false,false]);
  const partial=await atlas.getDruidRequirementPreview(forma,{movimentosPossuidos:[meta]});
  assert.deepEqual(partial.componentes_requeridos.map(x=>x.presente_na_lista),[true,false]);
  assert.equal(partial.verificacao_estrutural,"componentes_ausentes");
  const complete=await atlas.getDruidRequirementPreview(forma,{movimentosPossuidos:[meta,maestro]});
  assert.equal(complete.verificacao_estrutural,"componentes_identificados_presentes");
  assert.equal(complete.componentes_identificados_presentes,true);
  assert.equal(complete.habilitado_para_compra,null);
  assert.equal(complete.necessita_avaliacao_do_mestre,true);
  assert.equal(complete.aplicacao_canonica,false);
  const spores=await atlas.getDruidRequirementPreview("movimento-classe:paragrafo-2168");
  assert.equal(spores.componentes_requeridos[0].movimento_id,"movimento-classe:paragrafo-2137");
  assert.equal(await atlas.getDruidRequirementPreview("movimento-classe:paragrafo-9999"),null);
  await assert.rejects(()=>atlas.getDruidRequirementPreview(forma,{movimentosPossuidos:"inválido"}),TypeError);
});



test("Mago preserva escolas independentes sem inventar Grimório universal",async()=>{
  const all=await atlas.getMageMovements();
  assert.equal(all.length,4);
  assert.equal((await atlas.searchMageMovements({titulo:"NAO ERA EU"})).length,1);
  assert.equal((await atlas.searchMageMovements({requer:"GRIMORIO"})).length,1);
  assert.equal((await atlas.searchMageMovements({comOpcoes:true})).length,1);
  const ilusionistas=await atlas.searchMageMovements({raizDependencia:"movimento-classe:paragrafo-2241"});
  assert.deepEqual(ilusionistas.map(m=>m.titulo),["NÃO ERA EU"]);
  assert.equal((await atlas.getMageMovementIndexes()).by_requisito_tipo.movimento_exato.length,2);
  const no=await atlas.getMageRequirementPreview("movimento-classe:paragrafo-2322");
  assert.deepEqual(no.cadeia_imediato_para_raiz.map(x=>x.presente_na_lista),[false]);
  const yes=await atlas.getMageRequirementPreview("movimento-classe:paragrafo-2322",{
    movimentosPossuidos:["movimento-classe:paragrafo-2241"]});
  assert.equal(yes.componentes_identificados_presentes,true);
  assert.equal(yes.raiz_movimento_id,"movimento-classe:paragrafo-2241");
  assert.equal(yes.habilitado_para_compra,null);
  assert.equal(yes.necessita_avaliacao_do_mestre,true);
  assert.equal(yes.aplicacao_canonica,false);
  const base=await atlas.getMageRequirementPreview("movimento-classe:paragrafo-2241");
  assert.deepEqual(base.cadeia_imediato_para_raiz,[]);
  assert.equal(await atlas.getMageMovement("movimento-classe:paragrafo-9999"),null);
  await assert.rejects(()=>atlas.getMageRequirementPreview("movimento-classe:paragrafo-2322",{
    movimentosPossuidos:"invalido"}),TypeError);
});



test("Feiticeiro: REQUER independentes, busca e prévia sem compra automática",async()=>{
  const all=await atlas.getSorcererMovements();
  assert.equal(all.length,6);
  assert.equal((await atlas.searchSorcererMovements({titulo:"fonte aberta"})).length,1);
  assert.equal((await atlas.searchSorcererMovements({requer:"MAGIA SELVAGEM"})).length,1);
  assert.equal((await atlas.searchSorcererMovements({comOpcoes:true}))[0].titulo,"MAGIA NO SANGUE");
  assert.equal((await atlas.searchSorcererMovements({raizDependencia:"movimento-classe:paragrafo-2354"}))[0].titulo,"CAOS CONTROLADO");
  assert.equal((await atlas.getSorcererMovementIndexes()).by_requisito_tipo.movimento_exato.length,3);
  const id="movimento-classe:paragrafo-2446",origem="movimento-classe:paragrafo-2440";
  const none=await atlas.getSorcererRequirementPreview(id);
  assert.deepEqual(none.cadeia_imediato_para_raiz.map(x=>x.movimento_id),[origem]);
  assert.equal(none.componentes_identificados_presentes,false);
  const complete=await atlas.getSorcererRequirementPreview(id,{movimentosPossuidos:[origem]});
  assert.equal(complete.componentes_identificados_presentes,true);
  assert.equal(complete.habilitado_para_compra,null);
  assert.equal(complete.aplicacao_canonica,false);
  assert.equal(await atlas.getSorcererRequirementPreview("movimento-classe:paragrafo-9999"),null);
  await assert.rejects(()=>atlas.getSorcererRequirementPreview(id,{movimentosPossuidos:"inválido"}),TypeError);
});



test("Bruxo preserva cinco tradições, Sabá independente e REQUER em cadeia",async()=>{
  const moves=await atlas.getWarlockMovements();
  assert.equal(moves.length,8);
  assert.equal((await atlas.searchWarlockMovements({comRequer:true})).length,4);
  assert.equal((await atlas.searchWarlockMovements({requer:"MALDICAO"})).length,1);
  assert.equal((await atlas.searchWarlockMovements({comOpcoes:true}))[0].titulo,"MALDIÇÃO");
  assert.equal((await atlas.searchWarlockMovements({raizDependencia:"movimento-classe:paragrafo-2488"}))[0].titulo,
    "MALDIÇÃO ADORMECIDA");
  assert.equal((await atlas.getWarlockMovementIndexes()).by_raiz_dependencia["movimento-classe:paragrafo-2454"].length,3);
  assert.equal((await atlas.getWarlockMovement("movimento-classe:paragrafo-2572")).requisito_literal,null);
  const id="movimento-classe:paragrafo-2527";
  const none=await atlas.getWarlockRequirementPreview(id);
  assert.deepEqual(none.cadeia_imediato_para_raiz.map(x=>x.movimento_id),[
    "movimento-classe:paragrafo-2474","movimento-classe:paragrafo-2467","movimento-classe:paragrafo-2454"]);
  assert.equal(none.componentes_identificados_presentes,false);
  const partial=await atlas.getWarlockRequirementPreview(id,{
    movimentosPossuidos:["movimento-classe:paragrafo-2454","movimento-classe:paragrafo-2467"]});
  assert.deepEqual(partial.cadeia_imediato_para_raiz.map(x=>x.presente_na_lista),[false,true,true]);
  const complete=await atlas.getWarlockRequirementPreview(id,{
    movimentosPossuidos:["movimento-classe:paragrafo-2454","movimento-classe:paragrafo-2467","movimento-classe:paragrafo-2474"]});
  assert.equal(complete.componentes_identificados_presentes,true);
  assert.equal(complete.habilitado_para_compra,null);
  assert.equal(complete.aplicacao_canonica,false);
  const independente=await atlas.getWarlockRequirementPreview("movimento-classe:paragrafo-2488");
  assert.deepEqual(independente.cadeia_imediato_para_raiz,[]);
  assert.equal(independente.raiz_movimento_id,"movimento-classe:paragrafo-2488");
  assert.equal(await atlas.getWarlockRequirementPreview("movimento-classe:paragrafo-99999"),null);
  await assert.rejects(()=>atlas.getWarlockRequirementPreview(id,{
    movimentosPossuidos:"invalido"}),TypeError);
});



test("Necromante: dois REQUER cumulativos exigem ambos os movimentos",async()=>{
  const all=await atlas.getNecromancerMovements();
  assert.equal(all.length,6);
  assert.equal((await atlas.searchNecromancerMovements({tipoRequisito:"todos"})).length,2);
  assert.equal((await atlas.searchNecromancerMovements({requer:"animar os mortos"})).length,3);
  assert.equal((await atlas.searchNecromancerMovements({comOpcoes:true})).length,1);
  const ix=await atlas.getNecromancerMovementIndexes();
  assert.equal(ix.by_requisito_tipo.todos.length,2);
  const animar="movimento-classe:paragrafo-2582";
  const nome="movimento-classe:paragrafo-2596";
  const ossos="movimento-classe:paragrafo-2598";
  const levantar="movimento-classe:paragrafo-2616";
  const costurada="movimento-classe:paragrafo-2617";
  const zero=await atlas.getNecromancerRequirementPreview(levantar);
  assert.deepEqual(zero.componentes_requeridos.map(x=>x.presente_na_lista),[false,false]);
  assert.equal(zero.verificacao_estrutural,"componentes_ausentes");
  const partial=await atlas.getNecromancerRequirementPreview(levantar,{movimentosPossuidos:[animar]});
  assert.deepEqual(partial.componentes_requeridos.map(x=>x.presente_na_lista),[true,false]);
  assert.equal(partial.componentes_identificados_presentes,false);
  const full=await atlas.getNecromancerRequirementPreview(levantar,{movimentosPossuidos:[animar,nome]});
  assert.equal(full.operador_literal,"e");
  assert.equal(full.componentes_identificados_presentes,true);
  assert.equal(full.habilitado_para_compra,null);
  assert.equal(full.aplicacao_canonica,false);
  const second=await atlas.getNecromancerRequirementPreview(costurada,{movimentosPossuidos:[animar,ossos]});
  assert.deepEqual(second.componentes_requeridos.map(x=>x.presente_na_lista),[true,true]);
  assert.equal(second.habilitado_para_compra,null);
  const direct=await atlas.getNecromancerRequirementPreview("movimento-classe:paragrafo-2599",{movimentosPossuidos:[animar]});
  assert.equal(direct.componentes_identificados_presentes,true);
  assert.equal(direct.habilitado_para_compra,null);
  assert.equal(await atlas.getNecromancerRequirementPreview("movimento-classe:paragrafo-99999"),null);
  await assert.rejects(()=>atlas.getNecromancerRequirementPreview(levantar,{movimentosPossuidos:"invalid"}),TypeError);
});


test("Artífice preserva cadeia alquímica transitiva, opções e REQUER obrigatório",async()=>{
  const all=await atlas.getArtificerMovements();
  assert.equal(all.length,6);
  assert.equal((await atlas.searchArtificerMovements({titulo:"transmutacao"})).length,1);
  assert.equal((await atlas.searchArtificerMovements({comOpcoes:true}))[0].titulo,"ALQUIMISTA");
  assert.equal((await atlas.searchArtificerMovements({requer:"TROCA EQUIVALENTE"}))[0].titulo,"ARMA HUMANA");
  assert.equal((await atlas.searchArtificerMovements({
    raizDependencia:"movimento-classe:paragrafo-2700"})).length,3);
  assert.equal((await atlas.getArtificerMovementIndexes()).by_requisito_tipo.movimento_exato.length,3);
  const id="movimento-classe:paragrafo-2703";
  const movimento=await atlas.getArtificerMovement(id);
  assert.match(movimento.texto_original,/punição do movimento Arma Humana/);
  assert.doesNotMatch(movimento.texto_original,/Alquimista Federal/);
  assert.equal(movimento.requisito_literal,"Arma Humana");
  assert.equal((await atlas.searchArtificerMovements({query:"punição do movimento Arma Humana"})).length,1);
  const missing=await atlas.getArtificerRequirementPreview(id);
  assert.deepEqual(missing.cadeia_imediato_para_raiz.map(x=>x.movimento_id),[
    "movimento-classe:paragrafo-2702","movimento-classe:paragrafo-2701","movimento-classe:paragrafo-2700"]);
  assert.equal(missing.componentes_identificados_presentes,false);
  assert.equal(missing.habilitado_para_compra,null);
  const partial=await atlas.getArtificerRequirementPreview(id,{movimentosPossuidos:[
    "movimento-classe:paragrafo-2700","movimento-classe:paragrafo-2702"]});
  assert.deepEqual(partial.cadeia_imediato_para_raiz.map(x=>x.presente_na_lista),[true,false,true]);
  assert.equal(partial.verificacao_estrutural,"componentes_ausentes");
  const allPresent=await atlas.getArtificerRequirementPreview(id,{movimentosPossuidos:[
    "movimento-classe:paragrafo-2700","movimento-classe:paragrafo-2701","movimento-classe:paragrafo-2702"]});
  assert.equal(allPresent.componentes_identificados_presentes,true);
  assert.equal(allPresent.habilitado_para_compra,null);
  assert.equal(allPresent.aplicacao_canonica,false);
  assert.equal(await atlas.getArtificerRequirementPreview("movimento-classe:paragrafo-9999"),null);
  await assert.rejects(()=>atlas.getArtificerRequirementPreview(id,{movimentosPossuidos:"invalido"}),TypeError);
});


test("Mercenário preserva dois ramos e Saque Organizado exige Abordagem e Capitão",async()=>{
  const moves=await atlas.getMercenaryMovements();assert.equal(moves.length,6);
  assert.equal((await atlas.searchMercenaryMovements({titulo:"capitao"}))[0].titulo,"CAPITÃO");
  assert.equal((await atlas.searchMercenaryMovements({requer:"ABORDAGEM"}))[0].titulo,"SAQUE ORGANIZADO");
  assert.equal((await atlas.searchMercenaryMovements({comRequer:true})).length,3);
  assert.equal((await atlas.searchMercenaryMovements({
     raizDependencia:"movimento-classe:paragrafo-2736"})).length,2);
  assert.equal((await atlas.getMercenaryMovementIndexes()).by_requisito_tipo.movimento_exato.length,3);
  const id="movimento-classe:paragrafo-2802";
  const none=await atlas.getMercenaryRequirementPreview(id);
  assert.deepEqual(none.cadeia_imediato_para_raiz.map(x=>x.movimento_id),
    ["movimento-classe:paragrafo-2748","movimento-classe:paragrafo-2736"]);
  assert.equal(none.componentes_identificados_presentes,false);
  const partial=await atlas.getMercenaryRequirementPreview(id,{movimentosPossuidos:[
    "movimento-classe:paragrafo-2736"]});
  assert.deepEqual(partial.cadeia_imediato_para_raiz.map(x=>x.presente_na_lista),[false,true]);
  const complete=await atlas.getMercenaryRequirementPreview(id,{movimentosPossuidos:[
    "movimento-classe:paragrafo-2736","movimento-classe:paragrafo-2748"]});
  assert.equal(complete.componentes_identificados_presentes,true);
  assert.equal(complete.habilitado_para_compra,null);
  assert.equal(complete.aplicacao_canonica,false);
  const smuggler=await atlas.getMercenaryRequirementPreview("movimento-classe:paragrafo-2756");
  assert.deepEqual(smuggler.cadeia_imediato_para_raiz,[]);
  assert.equal(smuggler.verificacao_estrutural,"sem_requer_literal");
  assert.equal(await atlas.getMercenaryMovement("movimento-classe:paragrafo-9999"),null);
  await assert.rejects(()=>atlas.getMercenaryRequirementPreview(id,{movimentosPossuidos:"Capitão"}),TypeError);
});


test("Fechamento 632: três grupos finais sem REQUER e com grafia fiel",async()=>{
  const groups=[
    [await atlas.getYokaiScribeMovements(),await atlas.getYokaiScribeMovementIndexes(),"ESCRIBA YOKAI"],
    [await atlas.getNobleMovements(),await atlas.getNobleMovementIndexes(),"NOBRE"],
    [await atlas.getArchaeologistMovements(),await atlas.getArchaeologistMovementIndexes(),"ARQUEÓLOGO"]
  ];
  for(const [moves,index,group] of groups){
    assert.equal(moves.length,3);
    assert.ok(moves.every(m=>m.grupo===group && m.aplicacao_canonica===false));
    assert.ok(moves.every(m=>m.requisito_literal===null && m.requisito_estruturado===null));
    assert.ok(moves.every(m=>m.opcoes.length===0));
    assert.equal(index.by_tem_requer.nao.length,3);
    assert.equal(index.by_tem_opcoes.nao.length,3);
    assert.deepEqual(index.by_requisito_id,{});
  }
  assert.equal((await atlas.searchYokaiScribeMovements({titulo:"proibe"}))[0].titulo,"PALAVRA QUE PROÍBE");
  assert.equal((await atlas.searchNobleMovements({query:"dominio 1"}))[0].titulo,"FAVOR POLÍTICO");
  assert.equal((await atlas.searchArchaeologistMovements({titulo:"nao toque"}))[0].titulo,"NÃO TOQUE NISSO");
  assert.equal((await atlas.getArchaeologistMovements())[0].texto_original.startsWith("‘Quando"),true);
  assert.equal((await atlas.getFinalClassMovement("movimento-classe:paragrafo-2822")).titulo,"CONTEXTO É TUDO");
  assert.equal(await atlas.getFinalClassMovement("movimento-classe:paragrafo-9999"),null);
  assert.equal((await atlas.searchNobleMovements({paragrafo:2817}))[0].titulo,"PROTOCOLO");
});


test("Povoamento regional: consulta proposta por área, tema, Hack e não aplica cânone",async()=>{
  const obj=await atlas.getRegionalPopulationProposals();
  assert.equal(obj.estado,"propostas_editoriais_nao_canonicas");
  assert.equal(obj.sementes.length,2);
  const indices=await atlas.getRegionalPopulationProposalIndexes();
  assert.equal(indices.by_area["area-proposta:garganta"].length,1);
  const rio=await atlas.searchRegionalPopulationProposals({areaId:"area-proposta:garganta"});
  assert.equal(rio.length,1);
  assert.equal((await atlas.searchRegionalPopulationProposals({regiaoAtlasId:"regiao:costa-sul"})).length,1);
  assert.equal((await atlas.searchRegionalPopulationProposals({tema:"ocupacao"}))[0].id,rio[0].id);
  assert.equal((await atlas.searchRegionalPopulationProposals({
    movimentoHack:"movimento-povo:paragrafo-828"})).length,1);
  assert.equal((await atlas.searchRegionalPopulationProposals({query:"cartorio"})).length,1);
  assert.equal((await atlas.getRegionalPopulationProposal(rio[0].id)).aprovacao_autoral,false);
  assert.equal((await atlas.getRegionalPopulationProposal(rio[0].id)).efeito_automatico_no_canon,false);
  assert.equal(await atlas.getRegionalPopulationProposal("povoamento-proposto:nao-existe"),null);
  assert.deepEqual(await atlas.searchRegionalPopulationProposals({tema:"nao-existe"}),[]);
});


test("Caatinga aprofunda rede social proposta sem promover cânone",async()=>{
  const net=await atlas.getCaatingaSocialNetwork();
  assert.equal(net.regiao_id,"regiao:caatinga");
  assert.equal(net.aprovacao_autoral,false);
  assert.equal(net.efeito_automatico_no_canon,false);
  assert.equal((await atlas.getCaatingaSocialIndexes()).by_tipo.comunidades.length,2);
  assert.equal((await atlas.searchCaatingaEntities({tipo:"comunidades"})).length,2);
  assert.equal((await atlas.searchCaatingaEntities({tipo:"coletivos"})).length,1);
  assert.equal((await atlas.searchCaatingaEntities({tipo:"coletivos"}))[0].subtipo_social,"cla_orc");
  assert.equal((await atlas.getCaatingaEntity("caatinga:coletivo:esteira-rachada")).tipo,"coletivos");
  assert.equal((await atlas.searchCaatingaEntities({tema:"agua",tipo:"pontos_agua"})).length,1);
  assert.equal((await atlas.searchCaatingaEntities({
    movimentoHack:"movimento-povo:paragrafo-834",tipo:"comunidades"})).length,1);
  assert.equal((await atlas.searchCaatingaEntities({comunidadeId:"caatinga:comunidade:poco-sem-bandeira",tipo:"pessoas"})).length,1);
  assert.equal((await atlas.searchCaatingaEntities({query:"VELHA ARU",tipo:"pessoas"})).length,1);
  assert.equal((await atlas.getCaatingaEntity("caatinga:comunidade:poco-sem-bandeira")).tipo,"comunidades");
  assert.equal(await atlas.getCaatingaEntity("caatinga:comunidade:nao-existe"),null);
  assert.deepEqual(await atlas.searchCaatingaEntities({tema:"nao-registrado"}),[]);
});


test("Fronteira Caatinga–Costa Sul consulta encontros e preserva limites do cânone",async()=>{
  const data=await atlas.getFrontierCaatingaCostaSul();
  assert.equal(data.aprovacao_autoral,false);
  assert.equal(data.efeito_automatico_no_canon,false);
  assert.equal(data.encontros.length,2);
  const ix=await atlas.getFrontierCaatingaCostaSulIndexes();
  assert.equal(Object.keys(ix.by_tipo).length,6);
  assert.equal((await atlas.searchFrontierEntities({tipo:"encontros"})).length,2);
  assert.equal((await atlas.searchFrontierEntities({tipo:"encontros",regiaoId:"regiao:costa-sul"})).length,1);
  assert.equal((await atlas.searchFrontierEntities({tipo:"pessoas",movimentoHack:"movimento-classe:paragrafo-2760"})).length,1);
  assert.equal((await atlas.searchFrontierEntities({tipo:"cenas",encontroId:"fronteira:encontro:varanda-da-agua"})).length,1);
  assert.equal((await atlas.searchFrontierEntities({query:"lavouras",tipo:"encontros"})).length,1);
  assert.equal((await atlas.getFrontierEntity("fronteira:encontro:boca-do-pano")).tipo,"encontros");
  assert.equal(await atlas.getFrontierEntity("fronteira:nao-existe"),null);
  assert.equal(data.fluxos[0].transporte_registrado,false);
  assert.deepEqual(await atlas.searchFrontierEntities({query:"naoexiste"}),[]);
});


test("Costa Sul IV consulta microespaços e redes insulares sem inventar cânone",async()=>{
  const costa=await atlas.getCostaSulSocialFabric();
  assert.equal(costa.aprovacao_autoral,false);
  assert.equal(costa.efeito_automatico_no_canon,false);
  assert.equal((await atlas.getCostaSulSocialFabricIndexes()).by_categoria.espacos.length,2);
  assert.equal((await atlas.searchCostaSulEntities({categoria:"espacos",escopo:"portomonte"})).length,2);
  assert.equal((await atlas.searchCostaSulEntities({categoria:"redes"})).length,1);
  assert.equal((await atlas.searchCostaSulEntities({categoria:"cenas",localId:"costa-sul:espaco:contas-agua"})).length,1);
  assert.equal((await atlas.searchCostaSulEntities({referencia:"lugar:portomonte",categoria:"espacos"})).length,2);
  assert.equal((await atlas.getCostaSulEntity("costa-sul:pessoa:gema")).reutiliza,"fronteira:pessoa:gema");
  assert.equal((await atlas.getCostaSulEntity("costa-sul:rede:casco")).ilha_confirmada,false);
  assert.equal((await atlas.getCostaSulEntity("costa-sul:espaco:pedra-molhada")).localizacao_confirmada,false);
  assert.equal(await atlas.getCostaSulEntity("costa-sul:espaco:inexistente"),null);
  assert.deepEqual(await atlas.searchCostaSulEntities({query:"naoexiste"}),[]);
});


test("Mar de Sangue V: sociedades submarinas e dissidência não canônicas",async()=>{
 const data=await atlas.getMarSangueSocialEcology();
 assert.equal(data.aprovacao_autoral,false);
 assert.equal(data.efeito_automatico_no_canon,false);
 assert.equal(Object.keys((await atlas.getMarSangueSocialEcologyIndexes()).by_categoria).length,7);
 assert.equal((await atlas.searchMarSangueEntities({categoria:"coletivos",povo:"kuo-toa"})).length,1);
 assert.equal((await atlas.searchMarSangueEntities({categoria:"zonas",aguas:"vermelhas"})).length,1);
 assert.equal((await atlas.searchMarSangueEntities({categoria:"pessoas",movimentoHack:"movimento-povo:paragrafo-913"})).length,1);
 assert.equal((await atlas.searchMarSangueEntities({query:"Nilku"})).length,1);
 assert.equal((await atlas.getMarSangueEntity("mar-sangue:pessoa:nilku")).reutiliza,"fronteira:pessoa:nilku");
 assert.equal((await atlas.getMarSangueEntity("mar-sangue:pacto:tributo")).vigente,false);
 assert.equal((await atlas.getMarSangueEntity("mar-sangue:zona:santuario")).localizacao_confirmada,false);
 assert.equal(await atlas.getMarSangueEntity("mar-sangue:zona:inexistente"),null);
 assert.deepEqual(await atlas.searchMarSangueEntities({query:"naoexiste"}),[]);
});


test("Diplomacia Mar de Sangue VI: cidades candidatas, sucessões e tratados não canonizados",async()=>{
 const d=await atlas.getMarSangueDiplomacy();
 assert.equal(d.aprovacao_autoral,false);
 assert.equal(d.efeito_automatico_no_canon,false);
 assert.equal(Object.keys((await atlas.getMarSangueDiplomacyIndexes()).by_categoria).length,8);
 assert.equal((await atlas.searchMarSangueDiplomacy({categoria:"polos",aguas:"azuis"})).length,1);
 assert.equal((await atlas.searchMarSangueDiplomacy({categoria:"casas",bloco:"tributo"})).length,1);
 assert.equal((await atlas.searchMarSangueDiplomacy({categoria:"pessoas",povo:"kuo-toa"})).length,1);
 assert.equal((await atlas.searchMarSangueDiplomacy({categoria:"pessoas",query:"nilku"})).length,1);
 assert.equal((await atlas.searchMarSangueDiplomacy({movimentoHack:"movimento-povo:paragrafo-945"})).length,8);
 assert.equal((await atlas.getMarSangueDiplomacyEntity("diplomacia-mar:pessoa:nilku")).reutiliza,"mar-sangue:pessoa:nilku");
 assert.equal((await atlas.getMarSangueDiplomacyEntity("diplomacia-mar:sucessao:trono-vazio")).status_evento,"nao_ocorrido");
 assert.equal((await atlas.getMarSangueDiplomacyEntity("diplomacia-mar:tratado:recifes-autonomos")).vigente,false);
 assert.equal((await atlas.getMarSangueDiplomacyEntity("diplomacia-mar:polo:velarium")).cidade_confirmada,false);
 assert.equal(await atlas.getMarSangueDiplomacyEntity("diplomacia-mar:sucessao:ausente"),null);
 assert.deepEqual(await atlas.searchMarSangueDiplomacy({query:"naoexiste"}),[]);
});


test("Economia Mar de Sangue VII preserva proposta, referências e trabalho",async()=>{
 const data=await atlas.getMarSangueEconomy();
 assert.equal(data.aprovacao_autoral,false);
 assert.equal(data.efeito_automatico_no_canon,false);
 assert.equal(Object.keys((await atlas.getMarSangueEconomyIndexes()).by_categoria).length,8);
 assert.equal((await atlas.searchMarSangueEconomy({categoria:"polos",aguas:"azuis"})).length,1);
 assert.equal((await atlas.searchMarSangueEconomy({categoria:"oficios",setor:"navegacao"})).length,1);
 assert.equal((await atlas.searchMarSangueEconomy({categoria:"pessoas",povo:"abissais"})).length,1);
 assert.equal((await atlas.searchMarSangueEconomy({categoria:"tributos",abuso:"dependencia_hereditaria"})).length,1);
 assert.equal((await atlas.searchMarSangueEconomy({query:"REDE VAZIA"})).length,1);
 assert.equal((await atlas.searchMarSangueEconomy({movimentoHack:"movimento-povo:paragrafo-936"})).length,8);
 assert.equal((await atlas.getMarSangueEconomyEntity("economia-mar:pessoa:maura")).reutiliza,"diplomacia-mar:pessoa:maura");
 assert.equal((await atlas.getMarSangueEconomyEntity("economia-mar:fluxo:pesca")).quantidade_confirmada,false);
 assert.equal((await atlas.getMarSangueEconomyEntity("economia-mar:tributo:herdado")).vigente,false);
 assert.equal((await atlas.getMarSangueEconomyEntity("economia-mar:polo:lastro")).local_confirmado,false);
 assert.equal(await atlas.getMarSangueEconomyEntity("economia-mar:nao-existe"),null);
 assert.deepEqual(await atlas.searchMarSangueEconomy({query:"naoexiste"}),[]);
});


test("Costa Sul VIII: trabalho e tributos sob pressão, sem fatos comerciais inventados",async()=>{
 const d=await atlas.getCostaSulSeaPressure();
 assert.equal(d.aprovacao_autoral,false);
 assert.equal(d.efeito_automatico_no_canon,false);
 const idx=await atlas.getCostaSulSeaPressureIndexes();
 assert.equal(Object.keys(idx.by_categoria).length,8);
 assert.equal((await atlas.searchCostaSulSeaPressure({categoria:"nucleos",territorio:"portomonte"})).length,1);
 assert.equal((await atlas.searchCostaSulSeaPressure({categoria:"oficios",setor:"reparo"})).length,1);
 assert.equal((await atlas.searchCostaSulSeaPressure({categoria:"pessoas",papel:"agricultora"})).length,1);
 assert.equal((await atlas.searchCostaSulSeaPressure({categoria:"impactos"})).length,1);
 assert.equal((await atlas.searchCostaSulSeaPressure({query:"taxa"})).length,2);
 assert.equal((await atlas.searchCostaSulSeaPressure({categoria:"pessoas",referencia:"lugar:portomonte"})).length,1);
 assert.equal((await atlas.getCostaSulSeaPressureEntity("costa-mar:pessoa:gema")).reutiliza,"costa-sul:pessoa:gema");
 assert.equal((await atlas.getCostaSulSeaPressureEntity("costa-mar:impacto:taxa-de-pescaria")).ocorreu,false);
 assert.equal((await atlas.getCostaSulSeaPressureEntity("costa-mar:fluxo:tributo-contestado")).efetivado,false);
 assert.equal((await atlas.getCostaSulSeaPressureEntity("costa-mar:acordo:cobranca-com-prova")).vigente,false);
 assert.equal((await atlas.getCostaSulSeaPressureEntity("costa-mar:nucleo:mesa-do-sal")).local_confirmado,false);
 assert.equal(await atlas.getCostaSulSeaPressureEntity("costa-mar:nucleo:nao-existe"),null);
 assert.deepEqual(await atlas.searchCostaSulSeaPressure({query:"semresultadoaqui"}),[]);
});

test("Garganta IX: povoamento colonial, memória e cenários sem canonização",async()=>{
 const d=await atlas.getGargantaRiverSocial();
 assert.equal(d.aprovacao_autoral,false);
 assert.equal(d.efeito_automatico_no_canon,false);
 assert.equal(Object.keys((await atlas.getGargantaRiverSocialIndexes()).by_categoria).length,8);
 assert.equal((await atlas.searchGargantaRiverSocial({categoria:"lugares",area:"area-proposta:garganta"})).length,1);
 assert.equal((await atlas.searchGargantaRiverSocial({categoria:"oficios",setor:"burocracia"})).length,1);
 assert.equal((await atlas.searchGargantaRiverSocial({categoria:"pessoas",query:"marxinus"})).length,1);
 assert.equal((await atlas.searchGargantaRiverSocial({categoria:"memorias"})).length,1);
 assert.equal((await atlas.searchGargantaRiverSocial({referencia:"povoamento-proposto:cartorio-das-portas-raspadas"})).length,8);
 assert.equal((await atlas.getGargantaRiverEntity("rio-garganta:pessoa:marxinus")).local_atual_confirmado,false);
 assert.equal((await atlas.getGargantaRiverEntity("rio-garganta:memoria:211")).episodio_novo_confirmado,false);
 assert.equal((await atlas.getGargantaRiverEntity("rio-garganta:circuito:minas")).efetivado,false);
 assert.equal((await atlas.getGargantaRiverEntity("rio-garganta:acordo:nome")).vigente,false);
 assert.equal((await atlas.getGargantaRiverEntity("rio-garganta:lugar:portas")).local_confirmado,false);
 assert.equal(await atlas.getGargantaRiverEntity("rio-garganta:lugar:inexistente"),null);
 assert.deepEqual(await atlas.searchGargantaRiverSocial({query:"ausentexyz"}),[]);
});

test("Thargrid X: vida cotidiana, pactos não vigentes e autonomia dos povos",async()=>{
 const d=await atlas.getThargridSocialResistance();
 assert.equal(d.aprovacao_autoral,false);
 assert.equal(d.efeito_automatico_no_canon,false);
 assert.equal(Object.keys((await atlas.getThargridSocialResistanceIndexes()).by_categoria).length,8);
 assert.equal((await atlas.searchThargridSocialResistance({categoria:"pessoas",povo:"draconato"})).length,1);
 assert.equal((await atlas.searchThargridSocialResistance({categoria:"coletivos",tradicao:"anões_e_gigantes_de_pedra"})).length,1);
 assert.equal((await atlas.searchThargridSocialResistance({categoria:"fluxos",setor:"construcao"})).length,1);
 assert.equal((await atlas.searchThargridSocialResistance({categoria:"lugares",ambiente:"subterraneo"})).length,1);
 assert.equal((await atlas.searchThargridSocialResistance({categoria:"pessoas",query:"Serak"})).length,1);
 assert.equal((await atlas.getThargridSocialEntity("thargrid-social:pessoa:serak")).povo,"draconato");
 assert.equal((await atlas.getThargridSocialEntity("thargrid-social:dilema:ordenamento-e-cidadania")).ocorreu,false);
 assert.equal((await atlas.getThargridSocialEntity("thargrid-social:fluxo:mineral-e-muralhas")).efetivado,false);
 assert.equal((await atlas.getThargridSocialEntity("thargrid-social:acordo:ordem-sem-trono")).vigente,false);
 assert.equal((await atlas.getThargridSocialEntity("thargrid-social:lugar:patio-da-metade")).local_confirmado,false);
 assert.equal(await atlas.getThargridSocialEntity("thargrid-social:sem-lugar"),null);
 assert.deepEqual(await atlas.searchThargridSocialResistance({query:"semresultadoaqui"}),[]);
});

test("Ironwood e Eldroth XI: consultas, proveniência e nenhuma canonização",async()=>{
  const doc=await atlas.getIronwoodEldrothResistance();
  assert.equal(doc.aprovacao_autoral,false);
  assert.equal(doc.efeito_automatico_no_canon,false);
  const indexes=await atlas.getIronwoodEldrothResistanceIndexes();
  assert.equal(indexes.by_categoria.pessoas.length,1);
  assert.equal((await atlas.searchIronwoodEldrothResistance({categoria:"lugares",ambiente:"fortaleza_florestal"})).length,1);
  assert.equal((await atlas.searchIronwoodEldrothResistance({categoria:"coletivos",funcao:"acolhimento"})).length,1);
  assert.equal((await atlas.searchIronwoodEldrothResistance({categoria:"pessoas",povo:"elfa_da_floresta"})).length,1);
  assert.equal((await atlas.searchIronwoodEldrothResistance({movimentoHack:"movimento-povo:paragrafo-1003"})).length,2);
  assert.equal((await atlas.searchIronwoodEldrothResistance({query:"bainhas"})).length,1);
  assert.equal((await atlas.getIronwoodEldrothEntity("ironwood-eldroth:pessoa:vaelis")).reutiliza,"thargrid-social:pessoa:vaelis");
  assert.equal((await atlas.getIronwoodEldrothEntity("ironwood-eldroth:lugar:pouso-das-bainhas")).local_confirmado,false);
  assert.equal((await atlas.getIronwoodEldrothEntity("ironwood-eldroth:fluxo:resgate-e-pouso")).rota_operacional,false);
  assert.equal((await atlas.getIronwoodEldrothEntity("ironwood-eldroth:dilema:queimar-ou-curar")).ocorreu,false);
  assert.equal((await atlas.getIronwoodEldrothEntity("ironwood-eldroth:acordo:refugio-sem-obediencia")).vigente,false);
  assert.equal(await atlas.getIronwoodEldrothEntity("ironwood-eldroth:inexistente"),null);
  assert.deepEqual(await atlas.searchIronwoodEldrothResistance({query:"naoexiste"}),[]);
});

test("Ciclo XII: monstros e frentes são consultas propostas, não fatos canônicos",async()=>{
 const data=await atlas.getEldrothMonsterEcology();
 assert.equal(data.aprovacao_autoral,false);
 assert.equal(data.efeito_automatico_no_canon,false);
 const idx=await atlas.getEldrothMonsterEcologyIndexes();
 assert.equal(idx.by_categoria.criaturas.length,2);
 assert.equal((await atlas.searchEldrothMonsterEcology({categoria:"criaturas",tipoCarcaca:"fauna"})).length,1);
 assert.equal((await atlas.searchEldrothMonsterEcology({escopo:"eldroth",categoria:"criaturas"})).length,1);
 assert.equal((await atlas.searchEldrothMonsterEcology({criaturaId:"ecologia-xii:criatura:coruja-do-eco-emprestado"})).length,4);
 assert.equal((await atlas.searchEldrothMonsterEcology({cenaAnterior:"ironwood-eldroth:cena:passaro-sem-canto"})).length,2);
 assert.equal((await atlas.searchEldrothMonsterEcology({query:"Último som"})).length,1);
 assert.equal((await atlas.getEldrothMonsterEcologyEntry("ecologia-xii:criatura:coruja-do-eco-emprestado")).ocorrencia_confirmada,false);
 assert.equal((await atlas.getEldrothMonsterEcologyEntry("ecologia-xii:encontro:canto-sem-ave")).ocorreu,false);
 assert.deepEqual((await atlas.getEldrothMonsterEcologyEntry("ecologia-xii:frente:o-bosque-que-informa")).pressagios_realizados,[]);
 assert.equal(await atlas.getEldrothMonsterEcologyEntry("ecologia-xii:inexistente"),null);
 assert.deepEqual(await atlas.searchEldrothMonsterEcology({query:"zzz-ausente"}),[]);
});

test("Ciclo XIII: API das fichas DW distingue perigo físico de ameaça sem combate",async()=>{
  const pack=await atlas.getEldrothDWStatblocks();
  assert.equal(pack.aprovacao_autoral,false);
  assert.equal(pack.efetiva_canon,false);
  const ix=await atlas.getEldrothDWStatblockIndexes();
  assert.equal(ix.by_modo.sem_estatisticas.length,1);
  const owl=await atlas.getEldrothDWStatblock("ecologia-xiii:ficha:coruja-do-eco-emprestado");
  assert.equal(owl.ficha_dw.pv,12);
  assert.equal(owl.ficha_dw.dano.expressao,"d8-2");
  const fungus=await atlas.getEldrothDWStatblock("ecologia-xiii:ficha:micelio-das-vozes-partidas");
  assert.equal(fungus.ficha_dw.pv,null);
  assert.equal(fungus.ficha_dw.dano,null);
  assert.deepEqual((await atlas.searchEldrothDWStatblocks({modo:"sem_estatisticas"})).map(x=>x.nome),["Micélio das Vozes Partidas"]);
  assert.equal((await atlas.searchEldrothDWStatblocks({organizacao:"solitario",porte:"miudo"})).length,1);
  assert.equal((await atlas.searchEldrothDWStatblocks({tipoCarcaca:"fera_sobrenatural",tag:"magico"})).length,1);
  assert.equal((await atlas.searchEldrothDWStatblocks({origemId:"ecologia-xii:criatura:coruja-do-eco-emprestado"})).length,1);
  assert.equal((await atlas.searchEldrothDWStatblocks({query:"MÍCELIO"})).length,1);
  assert.deepEqual(await atlas.searchEldrothDWStatblocks({query:"zzyy"}),[]);
  assert.equal(await atlas.getEldrothDWStatblock("ecologia-xiii:ficha:nao-existe"),null);
  assert.equal(await atlas.getEldrothDWStatblock("ecologia-xii:criatura:coruja-do-eco-emprestado"),null);
});

test("Ciclo XIV: atlas historico-cultural mantém rascunho separado do canone",async()=>{
 const a=await atlas.getEldrothCulturalAtlas();
 assert.equal(a.aprovacao_autoral,false);
 assert.equal(a.efeito_automatico_no_canon,false);
 assert.equal(a.marcos[1].ano_ec,null);
 const ix=await atlas.getEldrothCulturalAtlasIndexes();
 assert.equal(ix.by_pagina_manuscrito["17"].length,1);
 assert.equal((await atlas.searchEldrothCulturalAxes({areaId:"worldbuilding-xiv:area:eldroth"})).length,1);
 assert.equal((await atlas.searchEldrothCulturalAxes({pagina:18})).length,1);
 assert.equal((await atlas.searchEldrothCulturalAxes({efeito:"etica da guerrilha"})).length,1);
 assert.equal((await atlas.searchEldrothCulturalAxes({query:"MIGRAÇÃO"})).length,1);
 assert.equal((await atlas.getEldrothCulturalAxis("worldbuilding-xiv:eixo:ondas-feericas")).decisoes_autorais_pendentes[0].estado,"alternativa_nao_adotada");
 assert.equal(await atlas.getEldrothCulturalAxis("worldbuilding-xiv:eixo:nao-existe"),null);
 assert.deepEqual(await atlas.searchEldrothCulturalAxes({query:"zzz-inexistente"}),[]);
});

test("Ciclo XV: costumes históricos propostos e pactos sem canonização",async()=>{
 const data=await atlas.getEldrothPreconquest();
 assert.equal(data.aprovacao_autoral,false);
 assert.equal(data.aplicar_ao_canon_automaticamente,false);
 const idx=await atlas.getEldrothPreconquestIndexes();
 assert.equal(idx.by_categoria.praticas.length,2);
 assert.equal((await atlas.searchEldrothPreconquest({categoria:"praticas",fase:"antes_501"})).length,1);
 assert.equal((await atlas.searchEldrothPreconquest({categoria:"praticas",pagina:16})).length,1);
 assert.equal((await atlas.searchEldrothPreconquest({eixoXiv:"worldbuilding-xiv:eixo:ondas-feericas"})).length,1);
 assert.equal((await atlas.searchEldrothPreconquest({query:"NASCENTES"})).length,2);
 assert.equal((await atlas.searchEldrothPreconquest({praticaId:"worldbuilding-xv:pratica:mesa-da-hospitalidade"})).length,3);
 assert.equal((await atlas.getEldrothPreconquestEntry("worldbuilding-xv:pacto:acolhimento-sem-vassalagem")).assinado,false);
 assert.equal((await atlas.getEldrothPreconquestEntry("worldbuilding-xv:vinheta:primeira-hospitalidade")).ocorreu,false);
 assert.equal((await atlas.getEldrothPreconquestEntry("worldbuilding-xv:revisao:autoridade-druidica")).estado,"pendente");
 assert.equal(await atlas.getEldrothPreconquestEntry("worldbuilding-xv:pacto:nao-existe"),null);
 assert.deepEqual(await atlas.searchEldrothPreconquest({query:"zz-sem-resultado"}),[]);
});

test("Ciclo XVI: hipóteses de ocupação não viram políticas nem eventos",async()=>{
 const data=await atlas.getEldrothSylaraOccupation();
 assert.equal(data.aprovacao_autoral,false);
 assert.equal(data.aplicar_ao_canon_automaticamente,false);
 assert.equal(data.resumo.politicas_confirmadas,0);
 const idx=await atlas.getEldrothSylaraOccupationIndexes();
 assert.equal(idx.by_categoria.mecanismos.length,2);
 assert.equal((await atlas.searchEldrothSylaraOccupation({categoria:"mecanismos"})).length,2);
 assert.equal((await atlas.searchEldrothSylaraOccupation({dominio:"ecologia"})).length,1);
 assert.equal((await atlas.searchEldrothSylaraOccupation({praticaXvId:"worldbuilding-xv:pratica:roda-das-nascentes"})).length,1);
 assert.equal((await atlas.searchEldrothSylaraOccupation({pagina:5,categoria:"mecanismos"})).length,2);
 assert.equal((await atlas.searchEldrothSylaraOccupation({mecanismoId:"worldbuilding-xvi:mecanismo:criatura-informante"})).length,3);
 assert.equal((await atlas.searchEldrothSylaraOccupation({posicaoId:"worldbuilding-xvi:posicao:druida-que-ficou"})).length,2);
 assert.equal((await atlas.searchEldrothSylaraOccupation({query:"NASCENTE"})).length,1);
 assert.equal((await atlas.getEldrothSylaraOccupationEntry("worldbuilding-xvi:mecanismo:agua-licenciada")).politica_sylara_confirmada,false);
 assert.equal((await atlas.getEldrothSylaraOccupationEntry("worldbuilding-xvi:modelo:intermediarios")).estado,"alternativa_nao_adotada");
 assert.equal((await atlas.getEldrothSylaraOccupationEntry("worldbuilding-xvi:vinheta:som-no-escuro")).ocorreu,false);
 assert.equal((await atlas.getEldrothSylaraOccupationEntry("worldbuilding-xvi:questao:governanca")).estado,"pendente");
 assert.equal(await atlas.getEldrothSylaraOccupationEntry("worldbuilding-xvi:mecanismo:desconhecido"),null);
 assert.deepEqual(await atlas.searchEldrothSylaraOccupation({query:"zzz_nao_existe"}),[]);
});

test("Ciclo XVII: Vandar, memória e morte preservam lacunas e evitam canonização",async()=>{
 const doc=await atlas.getVandarMemoryAndDead();
 assert.equal(doc.aprovacao_autoral,false);
 assert.equal(doc.efeito_canonico_automatico,false);
 assert.equal(doc.linha_do_tempo.queda_ec,null);
 const ix=await atlas.getVandarMemoryAndDeadIndexes();
 assert.equal(ix.by_categoria.tecidos_urbanos.length,1);
 assert.equal((await atlas.searchVandarMemoryAndDead({categoria:"tecidos_urbanos"})).length,1);
 assert.equal((await atlas.searchVandarMemoryAndDead({dominio:"habitação_e_vizinhança"})).length,1);
 assert.equal((await atlas.searchVandarMemoryAndDead({modalidade:"testemunho_oral"})).length,1);
 assert.equal((await atlas.searchVandarMemoryAndDead({distincao:"sem_corpo_confirmado"})).length,1);
 assert.equal((await atlas.searchVandarMemoryAndDead({pagina:5})).length,5);
 assert.equal((await atlas.searchVandarMemoryAndDead({tecidoId:"worldbuilding-xvii:tecido:moradia-e-bairros"})).length,2);
 assert.equal((await atlas.searchVandarMemoryAndDead({query:"CASA"})).length,1);
 assert.equal((await atlas.getVandarMemoryAndDeadEntry("worldbuilding-xvii:papel:descendente")).personagem_confirmado,false);
 assert.equal((await atlas.getVandarMemoryAndDeadEntry("worldbuilding-xvii:modelo:quartel-de-ruinas")).configuracao_confirmada,false);
 assert.equal((await atlas.getVandarMemoryAndDeadEntry("worldbuilding-xvii:vinheta:chave-sem-casa")).ocorreu,false);
 assert.equal((await atlas.getVandarMemoryAndDeadEntry("worldbuilding-xvii:decisao:queda")).estado,"pendente_de_aprovacao_autoral");
 assert.equal(await atlas.getVandarMemoryAndDeadEntry("worldbuilding-xvii:prova:nao-existe"),null);
 assert.deepEqual(await atlas.searchVandarMemoryAndDead({query:"zzsemresultado"}),[]);
});

test("Ciclo XVIII: Ironwood pertence à história civil sem receber governo ou geografia inventados",async()=>{
 const d=await atlas.getIronwoodCivilSociety();
 assert.equal(d.aprovacao_autoral,false);
 assert.equal(d.efeito_canonico_automatico,false);
 assert.equal(d.lideranca_militar_documentada,"Elara Stormoak");
 assert.equal(d.id_lugar_geografico,null);
 assert.equal(d.id_regiao_geografica,null);
 const ix=await atlas.getIronwoodCivilSocietyIndexes();
 assert.equal(ix.by_categoria.eixos_sociais.length,1);
 assert.equal((await atlas.searchIronwoodCivilSociety({categoria:"eixos_sociais"})).length,1);
 assert.equal((await atlas.searchIronwoodCivilSociety({tema:"educacao"})).length,1);
 assert.equal((await atlas.searchIronwoodCivilSociety({eixoId:"worldbuilding-xviii:eixo:infancia"})).length,4);
 assert.equal((await atlas.searchIronwoodCivilSociety({modeloId:"worldbuilding-xviii:modelo:comando-consultivo"})).length,2);
 assert.equal((await atlas.searchIronwoodCivilSociety({pagina:18})).length,2);
 assert.equal((await atlas.searchIronwoodCivilSociety({query:"CRIANÇA"})).length,3);
 assert.equal((await atlas.getIronwoodCivilSocietyEntry("worldbuilding-xviii:modelo:comando-consultivo")).instituicao_confirmada,false);
 assert.equal((await atlas.getIronwoodCivilSocietyEntry("worldbuilding-xviii:relacao:thargrid")).tratado_assinado,false);
 assert.equal((await atlas.getIronwoodCivilSocietyEntry("worldbuilding-xviii:vinheta:trilha")).ocorreu,false);
 assert.equal((await atlas.getIronwoodCivilSocietyEntry("worldbuilding-xviii:decisao:infancia")).estado,"pendente_de_aprovacao_autoral");
 assert.equal(await atlas.getIronwoodCivilSocietyEntry("worldbuilding-xviii:eixo:nao-existe"),null);
 assert.deepEqual(await atlas.searchIronwoodCivilSociety({query:"zzz-inexistente"}),[]);
});

test("Ciclo XIX: revisão autoral consulta 103 candidatos sem homologar nada",async()=>{
 const d=await atlas.getAtlasAuthorialReview();
 assert.equal(d.aprovacao_autoral,false);
 assert.equal(d.mutacao_canonica_automatica,false);
 assert.equal(d.contagens.candidatos,103);
 assert.equal(d.contagens.aprovados,0);
 const idx=await atlas.getAtlasAuthorialReviewIndexes();
 assert.equal(idx.by_categoria.candidatos.length,2);
 assert.equal((await atlas.searchAtlasReviewDecisions({dominio:"eldroth"})).length,2);
 assert.equal((await atlas.searchAtlasReviewDecisions({prioridade:"alta"})).length,2);
 assert.equal((await atlas.searchAtlasReviewDecisions({preRequisito:"worldbuilding-xix:decisao:autoridade-druida"})).length,1);
 assert.equal((await atlas.searchAtlasReviewDecisions({origemId:"worldbuilding-xv:revisao:autoridade-druidica"})).length,1);
 assert.equal((await atlas.searchAtlasReviewDecisions({query:"REFUGIADOS"})).length,1);
 assert.equal((await atlas.searchAtlasReviewCandidates({ciclo:"XIV"})).length,1);
 assert.equal((await atlas.searchAtlasReviewCandidates({tipo:"pacto"})).length,1);
 assert.equal((await atlas.searchAtlasReviewCandidates({origemId:"worldbuilding-xiv:eixo:sagrado-druidico"})).length,1);
 assert.equal((await atlas.searchAtlasReviewCandidates({query:"VASSALAGEM"})).length,1);
 assert.equal((await atlas.getAtlasReviewDecision("worldbuilding-xix:decisao:refugio-feerico")).escolha_aprovada,null);
 assert.equal((await atlas.getAtlasReviewCandidate("worldbuilding-xix:candidato:002")).homologado,false);
 assert.equal(await atlas.getAtlasReviewDecision("worldbuilding-xix:decisao:inexistente"),null);
 assert.equal(await atlas.getAtlasReviewCandidate("worldbuilding-xix:candidato:999"),null);
 assert.deepEqual(await atlas.searchAtlasReviewDecisions({query:"zznaoexiste"}),[]);
});

test("Ciclo XX: vida cotidiana hobbit e cultura sem canonizar festas ou instituições",async()=>{
 const d=await atlas.getGramaCortadaDailyLife();
 assert.equal(d.aprovacao_autoral,false);
 assert.equal(d.aplicar_ao_canon_automaticamente,false);
 assert.equal(d.referencia_id_regiao,null);
 assert.equal(d.protagonista_cultural_documentado,"Menelau Folha-Seca");
 assert.equal(d.contagens.dominios_da_vida,9);
 const index=await atlas.getGramaCortadaDailyLifeIndexes();
 assert.equal(index.by_categoria.dominios_da_vida.length,1);
 assert.equal((await atlas.searchGramaCortadaDailyLife({categoria:"dominios_da_vida"})).length,1);
 assert.equal((await atlas.searchGramaCortadaDailyLife({pagina:18})).length,2);
 assert.equal((await atlas.searchGramaCortadaDailyLife({query:"DESPENSAS"})).length,2);
 assert.equal((await atlas.searchGramaCortadaDailyLife({query:"SEM-RESULTADO"})).length,0);
 assert.equal((await atlas.getGramaCortadaDailyLifeEntry("worldbuilding-xx:celebracoes_possiveis:primeira-semente")).ocorreu,false);
 assert.equal((await atlas.getGramaCortadaDailyLifeEntry("worldbuilding-xx:vinhetas:o-bardo-que-nao-chegou")).ocorreu,false);
 assert.equal((await atlas.getGramaCortadaDailyLifeEntry("worldbuilding-xx:decisao:territorio")).opcao_escolhida,null);
 assert.equal((await atlas.getGramaCortadaDailyLifeEntry("worldbuilding-xx:fato:01")).reformulacao_aprovada,false);
 assert.equal(await atlas.getGramaCortadaDailyLifeEntry("worldbuilding-xx:vinhetas:inexistente"),null);
});

test("Ciclo XXI: culturas gnômicas com três tradições, mapas e costumes não aprovados",async()=>{
 const d=await atlas.getGnomishCultures();
 assert.equal(d.aprovacao_autoral,false);
 assert.equal(d.aplicar_ao_canon_automaticamente,false);
 assert.equal(d.capital_gnomica_confirmada,null);
 assert.equal(d.governo_comum_confirmado,null);
 assert.equal(d.contagens.tradicoes,3);
 const ix=await atlas.getGnomishCulturesIndexes();
 assert.equal(ix.by_categoria.tradicoes.length,3);
 assert.equal((await atlas.searchGnomishCultures({categoria:"tradicoes"})).length,3);
 assert.equal((await atlas.searchGnomishCultures({tradicaoId:"worldbuilding-xxi:tradicao:florestas"})).length,4);
 assert.equal((await atlas.searchGnomishCultures({pagina:20})).length,4);
 assert.equal((await atlas.searchGnomishCultures({query:"MAPA"})).length,4);
 assert.equal((await atlas.searchGnomishCultures({query:"zzz-nao-existe"})).length,0);
 assert.equal((await atlas.getGnomishCultureEntry("worldbuilding-xxi:tradicao:profundezas")).governo_unificado_confirmado,false);
 assert.equal((await atlas.getGnomishCultureEntry("worldbuilding-xxi:costume:jogo-do-ardil")).ritual_confirmado,false);
 assert.equal((await atlas.getGnomishCultureEntry("worldbuilding-xxi:vinheta:o-caminho")).ocorreu,false);
 assert.equal((await atlas.getGnomishCultureEntry("worldbuilding-xxi:decisao:nomes")).resposta_aprovada,null);
 assert.equal((await atlas.getGnomishCultureEntry("worldbuilding-xxi:fato:01")).novo_canon,false);
 assert.equal(await atlas.getGnomishCultureEntry("worldbuilding-xxi:vinheta:inexistente"),null);
});

test("Ciclo XXII: sociedades meio-demoníacas sem herança moral ou canonização de hipóteses",async()=>{
 const d=await atlas.getHalfDemonSocieties();
 assert.equal(d.aprovacao_autoral,false);
 assert.equal(d.efeito_canonico_automatico,false);
 assert.equal(d.povo,"Meio-Demônios");
 assert.equal(d.governo_comum_documentado,null);
 assert.equal(d.aparencia_uniforme_documentada,null);
 assert.equal(d.contagens.eixos_sociais,11);
 const idx=await atlas.getHalfDemonSocietiesIndexes();
 assert.equal(idx.by_categoria.eixos_sociais.length,1);
 assert.equal((await atlas.searchHalfDemonSocieties({categoria:"eixos_sociais"})).length,1);
 assert.equal((await atlas.searchHalfDemonSocieties({query:"CRIANÇA"})).length,1);
 assert.equal((await atlas.searchHalfDemonSocieties({query:"sem-resultado"})).length,0);
 assert.equal((await atlas.getHalfDemonSocietyEntry("worldbuilding-xxii:contexto:assentamentos-do-abismo")).geografia_exata,null);
 assert.equal((await atlas.getHalfDemonSocietyEntry("worldbuilding-xxii:costume:nome-escolhido")).ritual_confirmado,false);
 assert.equal((await atlas.getHalfDemonSocietyEntry("worldbuilding-xxii:vinheta:album-sem-nome")).ocorreu,false);
 assert.equal((await atlas.getHalfDemonSocietyEntry("worldbuilding-xxii:pergunta:geografia")).resposta_aprovada,null);
 assert.equal((await atlas.getHalfDemonSocietyEntry("worldbuilding-xxii:fato:01")).novo_canon,false);
 assert.equal(await atlas.getHalfDemonSocietyEntry("worldbuilding-xxii:vinheta:inexistente"),null);
});

test("Ciclo XXIII: Caatinga civil consulta referencias existentes sem canonizar locais",async()=>{
 const data=await atlas.getCaatingaCivilLife();
 assert.equal(data.regiao_id,"regiao:caatinga");
 assert.equal(data.aprovacao_autoral,false);
 assert.equal(data.efeito_canonico_automatico,false);
 assert.equal(data.lugares_canonicos_adicionados,0);
 assert.equal(data.agua_potavel_confirmada,null);
 assert.equal(data.contagens.dominios_sociais,12);
 const idx=await atlas.getCaatingaCivilLifeIndexes();
 assert.equal(idx.by_referencia_preexistente["caatinga:comunidade:poco-sem-bandeira"].length,3);
 assert.equal((await atlas.searchCaatingaCivilLife({categoria:"etica_da_agua"})).length,1);
 assert.equal((await atlas.searchCaatingaCivilLife({referenciaId:"caatinga:comunidade:poco-sem-bandeira"})).length,3);
 assert.equal((await atlas.searchCaatingaCivilLife({pagina:12})).length,2);
 assert.equal((await atlas.searchCaatingaCivilLife({query:"CLÃ"})).length,1);
 assert.equal((await atlas.searchCaatingaCivilLife({query:"ZZZ-inexistente"})).length,0);
 assert.equal((await atlas.getCaatingaCivilLifeEntry("worldbuilding-xxiii:vinhetas:cantaro")).ocorreu,false);
 assert.equal((await atlas.getCaatingaCivilLifeEntry("worldbuilding-xxiii:pergunta:agua")).resposta_aprovada,null);
 assert.equal((await atlas.getCaatingaCivilLifeEntry("worldbuilding-xxiii:fato:antiga-alianca")).canon_novo,false);
 assert.equal(await atlas.getCaatingaCivilLifeEntry("worldbuilding-xxiii:vinhetas:inexistente"),null);
});

test("Ciclo XXIV: Costa Sul civil expõe estudos sem promover fatos",async()=>{
  const d=await atlas.getCostaSulCivilLife();
  assert.equal(d.regiao_id,"regiao:costa-sul");
  assert.equal(d.aprovacao_autoral,false);
  assert.equal(d.contagens.propostas,36);
  assert.equal((await atlas.getCostaSulCivilLifeIndexes()).by_referencia["costa-sul:espaco:varal"].length,1);
  assert.equal((await atlas.searchCostaSulCivilLife({categoria:"vida_domestica"})).length,1);
  assert.equal((await atlas.searchCostaSulCivilLife({referenciaId:"costa-sul:espaco:varal"})).length,1);
  assert.equal((await atlas.searchCostaSulCivilLife({query:"COZINHA",pagina:5,escopo:"portomonte"})).length,1);
  assert.equal((await atlas.searchCostaSulCivilLife({query:"zz-absurdo"})).length,0);
  assert.equal((await atlas.getCostaSulCivilLifeEntry("xxiv:fato:1")).canon_novo,false);
  assert.equal((await atlas.getCostaSulCivilLifeEntry("xxiv:pergunta:1")).resposta_aprovada,null);
  assert.equal(await atlas.getCostaSulCivilLifeEntry("xxiv:inexistente"),null);
});

test("Ciclo XXV: modelos alternativos não são governo adotado",async()=>{
  const d=await atlas.getPortomonteTempleCivic();
  assert.equal(d.assentamento_id,"assentamento:portomonte");
  assert.equal(d.modelo_de_governo_adotado,null);
  assert.equal(d.agua_domestica_potavel_confirmada,null);
  assert.equal(d.efeito_canonico_automatico,false);
  const ix=await atlas.getPortomonteTempleCivicIndexes();
  assert.equal(ix.by_referencia["xxiv:trabalhos:templo"].length,1);
  assert.equal((await atlas.searchPortomonteTempleCivic({categoria:"modelos_de_governo"})).length,1);
  assert.equal((await atlas.searchPortomonteTempleCivic({referenciaId:"xxiv:trabalhos:templo"})).length,1);
  assert.equal((await atlas.searchPortomonteTempleCivic({query:"agrícola",pagina:5})).length,1);
  assert.equal((await atlas.searchPortomonteTempleCivic({query:"zx-nenhum"})).length,0);
  assert.equal((await atlas.getPortomonteTempleCivicEntry("worldbuilding-xxv:fato:02")).novo_canon,false);
  assert.equal((await atlas.getPortomonteTempleCivicEntry("worldbuilding-xxv:pergunta:autoridade")).resposta_aprovada,null);
  assert.equal(await atlas.getPortomonteTempleCivicEntry("worldbuilding-xxv:inexistente"),null);
  const modelId="worldbuilding-xxv:modelos_de_governo:templo-consultivo";
  const preview=await atlas.previewPortomonteCivicModel(modelId,{observacoesDeMesa:["Personagens conversaram com sacerdote"]});
  assert.equal(preview.modelo_adotado,false);
  assert.equal(preview.aprovacao_autoral,false);
  assert.equal(preview.efeito_canonico,false);
  assert.equal(preview.efeito_mecanico,false);
  assert.equal(preview.observacoes_nao_verificadas.length,1);
  assert.equal((await atlas.getPortomonteTempleCivic()).modelo_de_governo_adotado,null);
  assert.equal(await atlas.previewPortomonteCivicModel("worldbuilding-xxv:modelos_de_governo:fake"),null);
  await assert.rejects(()=>atlas.previewPortomonteCivicModel(modelId,{observacoesDeMesa:"texto"}),TypeError);
});
