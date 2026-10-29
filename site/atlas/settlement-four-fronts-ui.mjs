/** Ciclo XLVI — quatro frentes de povoamento, sem falsa cartografia. */
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const readable=x=>String(x||"").replaceAll("_"," ");
export function initFourFrontierSettlements(el,model){
 if(!el||model?.totais?.novos_assentamentos!==24||!model?.frentes?.length)
   throw Error("Camada XLVI não disponível");
 let mode="assentamentos",filter="todas",selected=model.assentamentos[0].id;
 const refs=new Map([...model.assentamentos,...model.habitats].map(x=>[x.id,x]));
 const rows=()=>mode==="habitats"?model.habitats:model.assentamentos;
 function selectedRow(){
  const candidates=rows().filter(x=>filter==="todas"||x.frente_id===filter);
  if(!candidates.some(x=>x.id===selected))selected=candidates[0]?.id||"";
  return refs.get(selected);
 }
 function renderCard(x){
  const active=x.id===selected?' active':'';
  const tag=mode==="assentamentos"?x.forma:x.categoria;
  const desc=mode==="assentamentos"?x.habitantes_propostos:x.habitantes_ou_organismos_propostos;
  return '<button type="button" data-four-place="'+esc(x.id)+'" class="four-place-card'+active+'">'+
    '<small>'+esc(readable(tag))+'</small><b>'+esc(x.nome)+'</b><span>'+esc(desc)+'</span></button>';
 }
 function main(){
  if(mode==="critica")return '<div class="four-method"><p>Este painel não comprova a existência de 24 novas cidades. Apresenta propostas com conteúdo social e ecológico para apreciação da autoria, e não coordenadas ou rotas.</p>'+
    '<h4>Cuidados metodológicos</h4>'+model.restricoes.map(x=>'<p class="four-rule">'+esc(x)+'</p>').join('')+'</div>';
  const filtered=rows().filter(x=>filter==="todas"||x.frente_id===filter);
  return '<label class="four-filter">Frente <select data-four-filter>'+
    '<option value="todas">Todas as quatro frentes</option>'+
    model.frentes.map(x=>'<option value="'+esc(x.id)+'"'+(x.id===filter?' selected':'')+'>'+
       esc(x.nome)+'</option>').join('')+'</select></label>'+
    '<div class="four-place-grid">'+filtered.map(renderCard).join('')+'</div>';
 }
 function inspector(){
  if(mode==="critica")return '';
  const x=selectedRow();if(!x)return '<aside class="env-inspector">Nenhum local selecionado.</aside>';
  const habitat=mode==="habitats";
  const blocks=habitat?[
    ["Organismos",x.habitantes_ou_organismos_propostos],
    ["Ecologia hipotética",x.papel_ecologico_hipotetico],
    ["O que não podemos inferir",x.limite_de_inferencia]]:
   [["Habitantes propostos",x.habitantes_propostos],
    ["Governo e decisões",x.governo_proposto],
    ["Subsistência e recursos",x.sustento_hipotetico],
    ["Como é habitado",x.habitacao_proposta],
    ["Conflito social",x.tensao_social],
    ["Pergunta à autoria",x.pergunta_autoral]];
  return '<aside class="env-inspector four-inspector"><div class="env-kicker">'+
    esc(habitat?"Habitat ecológico · não é povoado":"Assentamento coletivo · proposta sem aprovação")+'</div>'+
    '<h4>'+esc(x.nome)+'</h4>'+
    '<p class="four-inspector-refs">Manuscrito, capítulo I, páginas '+esc(x.paginas_contexto.join(", "))+
    '. Essas páginas dão o contexto regional, não confirmam o lugar.</p>'+
    blocks.map(([title,value])=>'<div class="env-subhead">'+esc(title)+'</div><p>'+esc(value)+'</p>').join('')+
    '<p class="env-citation">Sem coordenadas, caminhos, população ou fronteiras canônicas.</p></aside>';
 }
 function render(){
  selectedRow();
  el.innerHTML='<div class="env-head"><div><div class="eyebrow">Ciclo XLVI · povoamento fantástico</div>'+
    '<h3>Caatinga, Garganta, Thargrid e Ironwood</h3>'+
    '<p>Sociedades de humanos, goblins, fadas, gigantes e criaturas extraordinárias, com sustento e ecologia próprios.</p></div>'+
    '<div class="env-metrics"><b>'+model.totais.novos_assentamentos+'</b><span>comunidades novas propostas</span></div></div>'+
    '<div class="four-stats"><div><b>'+model.totais.propostos_acumulados+'</b><span>propostas acumuladas, 3 lotes</span></div>'+
    '<div><b>'+model.totais.novos_habitats+'</b><span>habitats neste lote</span></div>'+
    '<div><b>0</b><span>novos lugares aprovados</span></div></div>'+
    '<p class="four-warning">Números de propostas não são cobertura canônica. As referências de povoamento continuam flexíveis, e há localidades documentadas ainda por individualizar.</p>'+
    '<div class="four-fronts">'+model.frentes.map(f=>'<div><b>'+esc(f.nome)+'</b>'+
    '<span>'+f.propostas_acumuladas+' propostas (antes '+f.propostas_previas+
    ' + agora 6) · referência flexível '+f.referencia[0]+'–'+f.referencia[1]+'</span></div>').join('')+'</div>'+
    '<div class="env-tabs">'+[['assentamentos','24 comunidades'],['habitats','12 habitats'],['critica','Método e limites']].map(([id,label])=>
      '<button type="button" data-four-view="'+id+'" class="env-tab'+(mode===id?' active':'')+'">'+label+'</button>').join('')+'</div>'+
    '<div class="env-layout"><div class="env-main">'+main()+'</div>'+inspector()+'</div>'+
    '<p class="env-foot">Garganta: assentamentos propostos no entorno, não bairros internos. Ironwood: comunidade florestal distinta da autoridade do Reino Sob a Montanha. Nenhuma rota entre florestas ou galerias foi criada.</p>';
 }
 el.addEventListener("click",event=>{
   const t=event.target.closest("[data-four-view]");
   if(t){mode=t.dataset.fourView;render();return}
   const row=event.target.closest("[data-four-place]");
   if(row&&refs.has(row.dataset.fourPlace)){selected=row.dataset.fourPlace;render()}
 });
 el.addEventListener("change",event=>{
   const f=event.target.closest("[data-four-filter]");
   if(f){filter=f.value==="todas"||model.frentes.some(x=>x.id===f.value)?f.value:"todas";render()}
 });
 render();
}
