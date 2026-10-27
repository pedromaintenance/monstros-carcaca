import test from "node:test";
import assert from "node:assert/strict";
import {createCarcacaAtlas, previewSettlementScenario,previewMaterialInterruption} from "../src/carcaca-client.mjs";
import {createCampaignLedger,recordCampaignEvent,getCampaignEvents} from "../src/carcaca-campaign-state.mjs";

const fixtures={
  "manifest.json":{arquivos:{catalog:"catalog.json",creatures:"creatures.json",
    indexes:"indexes.json",regions:"regions.json",fronts:"fronts.json",
    settlements:"settlements.json",settlement_labels:"settlement-labels.json",
    settlement_indexes:"settlement-indexes.json",peoples:"peoples.json",
    flows:"flows.json",settlement_scenarios:"settlement-scenarios.json",
    material_dependencies:"material-dependencies.json",
    material_dependency_indexes:"material-dependency-indexes.json"}},
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
  "regions.json":[],
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
