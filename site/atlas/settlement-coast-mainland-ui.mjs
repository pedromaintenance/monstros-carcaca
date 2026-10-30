/** Ciclo XLIX: costa continental; vínculos sociais são hipóteses, não rotas. */
const escape=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const readable=x=>String(x).replaceAll("_"," ");
export function initContinentalCoastSettlementLot(el,model){
 if(!el||model?.comunidades?.length!==14||model?.habitats?.length!==8)throw Error("Lote costeiro XLIX indisponível");
 let tab="comunidades",selected=model.comunidades[0].id,area="todas";
 const all=[...model.comunidades,...model.habitats],byId=new Map(all.map(x=>[x.id,x]));
 const selectedItem=()=>byId.get(selected)||model.comunidades[0];
 function islandWarning(){
  return '<div class="coast-counter-warning">Esta rodada descreve 14 comunidades <b>continentais propostas</b>, ainda sem posição geográfica. Antes havia 8 propostas na frente Costa: 7 insulares e 1 em cavernas sem localização continental confirmada. Agora são 22 propostas da frente, mas <b>nenhuma nova cidade foi canonizada</b>.</div>';
 }
 function listRows(){
  if(tab==="relações")return '<p class="coast-note">As linhas abaixo expressam relações sociais que poderiam existir, não estradas, viagens realizadas nem fluxos econômicos comprovados.</p>'+
    model.relacoes.map(x=>'<article class="coast-link"><b>'+escape(byId.get(x.origem_id)?.nome||x.origem_id)+
    ' · '+escape(byId.get(x.destino_id)?.nome||x.destino_id)+'</b><small>'+escape(readable(x.tipo))+
    ' · hipótese não aprovada</small><p>'+escape(x.hipotese)+'</p></article>').join('');
  if(tab==="limites")return '<h4>Materialidade antes da homologação</h4>'+
    '<p class="coast-note">Deméter permite agricultura em Portomonte segundo o manuscrito, mas não autoriza água potável, irrigação ou proteção estendida às quatorze propostas.</p>'+
    model.restricoes.map(x=>'<p class="coast-rule">'+escape(x)+'</p>').join('')+
    '<h4>Base documental limitada</h4>'+model.contexto_documentado.map(x=>'<p class="coast-rule">'+escape(x)+'</p>').join('');
  const habitat=tab==="habitats";const base=habitat?model.habitats:model.comunidades;
  const items=base.filter(x=>area==="todas"||x.ambiente_id===area);
  return '<label class="coast-filter">Ambiente hipotético <select data-coast-area>'+
    [['todas','Todos'],['amb:pradarias','Pradarias agrícolas'],['amb:penhascos','Penhascos de Portomonte (ambiente de referência)']].map(([id,title])=>
      '<option value="'+escape(id)+'"'+(area===id?" selected":"")+'>'+title+'</option>').join('')+'</select></label>'+
    '<div class="coast-cards">'+items.map(x=>'<button type="button" class="coast-place'+(selected===x.id?" active":"")+
    '" data-coast-place="'+escape(x.id)+'"><small>'+escape(readable(x.forma||x.categoria))+'</small>'+
    '<b>'+escape(x.nome)+'</b><span>'+escape(x.habitantes_propostos||x.organismos_propostos)+'</span></button>').join('')+
    '</div>';
 }
 function details(){
  if(tab==="relações"||tab==="limites")return '';
  const x=selectedItem(),isHabitat=tab==="habitats";
  const fields=isHabitat?[
    ['Organismos propostos',x.organismos_propostos],
    ['Função ecológica',x.funcao_ecologica_hipotetica],
    ['Limite da inferência',x.limite_de_inferencia]]:
    [['Habitantes',x.habitantes_propostos],
     ['Autoridade e organização',x.regime_de_autoridade_proposto],
     ['Subsistência — ainda não verificada',x.subsistencia_condicional],
     ['Forma de habitar',x.habitacao_hipotetica],
     ['Conflito material e social',x.conflito_material_e_social],
     ['Questão aberta à autoria',x.questao_aberta],
     ['Contexto documental, não comprovação do povoado',x.fundamento_regional_documentado]];
  return '<aside class="env-inspector coast-inspector"><div class="env-kicker">'+
   escape(isHabitat?"Habitat, não assentamento":"Comunidade continental proposta — não canônica")+'</div>'+
   '<h4>'+escape(x.nome)+'</h4>'+
   fields.map(([label,text])=>'<div class="env-subhead">'+escape(label)+'</div><p>'+escape(text)+'</p>').join('')+
   '<p class="env-citation">Cap. I, pp. '+escape(x.paginas_contexto.join(", "))+
   '. Localização, água, alimento e rotas não homologados.</p></aside>';
 }
 function render(){
  const rows=tab==="habitats"?model.habitats:model.comunidades;
  if(["comunidades","habitats"].includes(tab)&&!rows.some(x=>x.id===selected&&
    (area==="todas"||x.ambiente_id===area)))selected=rows.find(x=>area==="todas"||x.ambiente_id===area)?.id||"";
  el.innerHTML='<div class="env-head"><div><div class="eyebrow">Ciclo XLIX · povoamento continental</div>'+
    '<h3>Além Sul — a vida longe das ilhas</h3>'+
    '<p>Pradarias, trabalho, conflitos, fé e sociedades fantásticas no litoral continental: relações humanas e ecológicas sem mapas inventados.</p></div>'+
    '<div class="env-metrics"><b>'+model.balanco.propostas_comunidades_apos+'</b><span>propostas acumuladas · 0 aprovadas</span></div></div>'+
    '<div class="coast-stats"><div><b>14</b><span>comunidades continentais propostas</span></div>'+
    '<div><b>8</b><span>habitats não contáveis</span></div>'+
    '<div><b>8</b><span>relações sociais hipotéticas</span></div>'+
    '<div><b>22</b><span>propostas na frente Costa, incluindo ilhas</span></div></div>'+
    islandWarning()+'<div class="env-tabs">'+
    [['comunidades','14 comunidades'],['habitats','8 habitats'],['relações','8 relações'],['limites','Fontes e restrições']].map(([id,title])=>
    '<button type="button" data-coast-tab="'+escape(id)+'" class="env-tab'+(tab===id?' active':'')+'">'+title+'</button>').join('')+
    '</div><div class="env-layout"><div class="env-main">'+listRows()+'</div>'+details()+'</div>'+
    '<p class="env-foot">O painel XLVIII preserva o retrato dos quatro lotes anteriores, com 82 propostas. Esta é a camada adicional XLIX, ainda sem homologação de topologia, economia ou cânone.</p>';
 }
 el.addEventListener("click",e=>{
  const t=e.target.closest("[data-coast-tab]");
  if(t&&["comunidades","habitats","relações","limites"].includes(t.dataset.coastTab)){
   tab=t.dataset.coastTab;area="todas";render();return;
  }
  const p=e.target.closest("[data-coast-place]");
  if(p&&byId.has(p.dataset.coastPlace)){selected=p.dataset.coastPlace;render()}
 });
 el.addEventListener("change",e=>{
  const p=e.target.closest("[data-coast-area]");
  if(p){area=["todas","amb:pradarias","amb:penhascos"].includes(p.value)?p.value:"todas";render()}
 });
 render();
}
