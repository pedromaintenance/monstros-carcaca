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
    hack_druid_movement_indexes:"hack-druid-movement-indexes.json"}},
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
