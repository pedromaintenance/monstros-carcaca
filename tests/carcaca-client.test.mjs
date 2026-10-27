import test from "node:test";
import assert from "node:assert/strict";
import {createCarcacaAtlas, previewSettlementScenario,previewMaterialInterruption} from "../src/carcaca-client.mjs";
import {createCampaignLedger,recordCampaignEvent,getCampaignEvents} from "../src/carcaca-campaign-state.mjs";
import {previewMaterialBalance,BALANCE_FIELDS} from "../src/carcaca-material-balance.mjs";
import {previewSupportCapacity,previewPopulationFlow,SUPPORT_LIMITS} from "../src/carcaca-support-capacity.mjs";
import {auditInfrastructure,previewInfrastructureIssue} from "../src/carcaca-infrastructure.mjs";
import {previewTerritorialImpact} from "../src/carcaca-territorial.mjs";

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
    territorial_indexes:"territorial-indexes.json"}},
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
  "territorial-labels.json":[{id:"rotulo-territorial:fronteira_de_pilhagens"},{id:"rotulo-territorial:acolhida_minoria_deslocada"}],
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
     rotulos_territoriais:["rotulo-territorial:acolhida_minoria_deslocada"],
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
