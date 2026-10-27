/**
 * Registro local e imutável de acontecimentos de campanha.
 * Não contém acesso a filesystem, GitHub, rede nem dados canônicos.
 * A gravação externa, se desejada, deve ser gerida explicitamente pelo jogo.
 */
const clone=(data)=>JSON.parse(JSON.stringify(data));
const campaignId=/^campanha:[a-z0-9-]+$/;
const eventId=/^evento:[a-z0-9-]+$/;
export function createCampaignLedger({id,nome}={}){
  if(typeof id!=="string"||!campaignId.test(id))throw new TypeError("ID de campanha inválido");
  if(typeof nome!=="string"||nome.trim().length<3)throw new TypeError("Nome de campanha inválido");
  return {schema_version:"0.1.0",id,nome,referencia_atlas:"carcaca",revisao:0,eventos:[]};
}
export function recordCampaignEvent(state,event,{settlementIds=[],scenarioIds=[]}={}){
  if(!state||!campaignId.test(state.id)||state.referencia_atlas!=="carcaca"||
     !Number.isInteger(state.revisao)||!Array.isArray(state.eventos)){
    throw new TypeError("Ledger de campanha inválido");
  }
  if(!event||typeof event!=="object"||!eventId.test(event.id)||
     !["acontecimento","decisao_dw"].includes(event.tipo)||
     typeof event.descricao!=="string"||event.descricao.trim().length<10||
     event.mestre_confirmou!==true||!Array.isArray(event.efeitos_adjudicados)||
     event.efeitos_adjudicados.some(x=>typeof x!=="string"||x.trim().length<5)){
    throw new TypeError("Evento exige confirmação explícita e descrição válida");
  }
  if(!Array.isArray(settlementIds)||!settlementIds.includes(event.assentamento_id)){
    throw new RangeError("Assentamento não pertence ao atlas verificado");
  }
  if(event.fonte_cenario_id!==null&&
     (!Array.isArray(scenarioIds)||!scenarioIds.includes(event.fonte_cenario_id))){
    throw new RangeError("Cenário DW inexistente ou não verificado");
  }
  if(state.eventos.some(old=>old.id===event.id))throw new RangeError("Evento já registrado");
  if(state.revisao!==state.eventos.length)throw new RangeError("Revisão/eventos inconsistentes");
  const next=clone(state);
  next.eventos.push({
    id:event.id,tipo:event.tipo,assentamento_id:event.assentamento_id,
    descricao:event.descricao,mestre_confirmou:true,
    fonte_cenario_id:event.fonte_cenario_id,
    efeitos_adjudicados:clone(event.efeitos_adjudicados)
  });
  next.revisao++;
  return next;
}
export function getCampaignEvents(state,{assentamentoId}={}){
  if(!state||!Array.isArray(state.eventos))throw new TypeError("Ledger inválido");
  return clone(state.eventos.filter(e=>!assentamentoId||e.assentamento_id===assentamentoId));
}
