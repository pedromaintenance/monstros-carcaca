/** Leitura do Ciclo XLV, distinguindo comunidades propostas e habitats não contáveis. */
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export function initSettlementExpansion(el,model){
 if(!el||!model?.assentamentos?.length)throw Error("Expansão do povoamento indisponível");
 let view="comunidades",area="todas",selected=model.assentamentos[0].id;
 const places=new Map([...model.assentamentos,...model.habitats].map(x=>[x.id,x]));
 function filtered(rows){return rows.filter(x=>area==="todas"||x.setor===area)}
 function cards(){
  const isHabitat=view==="habitats",rows=filtered(isHabitat?model.habitats:model.assentamentos);
  return '<div class="expansion-filter"><label>Região <select data-expansion-area>'+
    [['todas','Rio e Eldroth'],['rio','Rio Ancestral'],['eldroth','Eldroth']].map(([id,name])=>'<option value="'+id+'"'+(area===id?' selected':'')+'>'+name+'</option>').join('')+
    '</select></label></div>'+
    '<p class="expansion-note">'+(isHabitat?'Locais ecológicos: covis, reprodução, decompositores e territórios. Nenhum desses dez lugares conta como aldeia ou cidade.':'Comunidades coletivas propostas: cada local tem organização, sustento, modo de habitação e dilemas próprios. Nenhum está aprovado no cânone.')+'</p>'+
    '<div class="expansion-card-grid">'+(rows.length?rows.map(x=>'<button type="button" class="expansion-card'+(selected===x.id?' active':'')+'" data-expansion-id="'+esc(x.id)+'">'+
      '<small>'+esc(x.setor==="rio"?"Rio Ancestral":"Eldroth")+' · '+esc(isHabitat?x.categoria.replaceAll("_"," "):x.tipo.replaceAll("_"," "))+'</small>'+
      '<b>'+esc(x.nome)+'</b><span>'+esc(isHabitat?x.organismos_propostos:x.habitantes_propostos)+'</span></button>').join(''):'<p>Sem registros para este filtro.</p>')+'</div>';
 }
 function inspection(){
  const x=places.get(selected)||(view==="habitats"?model.habitats[0]:model.assentamentos[0]);if(!x)return "";
  const isHabitat=x.id.startsWith("ecologia:");
  return '<div class="env-kicker">'+esc(isHabitat?"Lugar ecológico · não conta como assentamento":"Comunidade habitada · proposta sem aprovação")+'</div>'+
   '<h4>'+esc(x.nome)+'</h4><p>'+esc(x.macroambiente_nome)+'</p>'+
   (isHabitat?
    '<div class="env-subhead">Organismos</div><p>'+esc(x.organismos_propostos)+'</p>'+
    '<div class="env-subhead">Papel ecológico proposto</div><p>'+esc(x.papel_ecologico_hipotetico)+'</p>'+
    '<div class="env-subhead">Limite</div><p>'+esc(x.limite)+'</p>':
    '<div class="env-subhead">Comunidade</div><p>'+esc(x.habitantes_propostos)+'</p>'+
    '<div class="env-subhead">Governo e organização</div><p>'+esc(x.governo_e_organizacao)+'</p>'+
    '<div class="env-subhead">Subsistência e ofícios</div><p>'+esc(x.subsistencia_e_oficios)+'</p>'+
    '<div class="env-subhead">Como habita</div><p>'+esc(x.arquitetura_e_modo_de_habitar)+'</p>'+
    '<div class="env-subhead">Tensão política</div><p>'+esc(x.tensao_politica)+'</p>'+
    '<div class="env-subhead">Dilema narrativo</div><p>'+esc(x.gancho_social)+'</p>'+
    '<div class="env-subhead">Base do manuscrito, não confirmação da comunidade</div><p>'+esc(x.base_no_manuscrito)+'</p>')+
   '<p class="env-citation">Hack, cap. I, p. '+esc(x.paginas.join(", "))+' · posição e presença exatas não confirmadas</p>';
 }
 function methods(){
  return '<div class="expansion-method"><p>'+esc(model.criterio)+'</p>'+
    '<h4>Quatro eixos de construção</h4>'+
    model.premissas_de_rede.map(x=>'<article><b>'+esc(x.funcao.replaceAll("_"," "))+'</b><small>Hack p. '+esc(x.fonte_paginas.join(", "))+'</small><p>'+esc(x.observacao)+'</p></article>').join('')+
    '<h4>Regras de autoria e ecologia</h4>'+model.regras.map(s=>'<p class="expansion-rule">'+esc(s)+'</p>').join('')+'</div>';
 }
 function render(){
  const tabs=[['comunidades','18 comunidades'],['habitats','10 habitats'],['metodo','Eixos e critérios']];
  const rows=view==='habitats'?model.habitats:model.assentamentos;
  if(!rows.some(x=>x.id===selected))selected=rows[0]?.id||selected;
  if(area!=='todas'&&!rows.some(x=>x.id===selected&&x.setor===area))selected=rows.find(x=>x.setor===area)?.id||selected;
  el.innerHTML='<div class="env-head"><div><div class="eyebrow">Ciclo XLV · povoamento macrorregional</div>'+
    '<h3>Rio Ancestral e Eldroth: comunidades vivas</h3><p>Núcleos fantásticos ligados a religião, poder, alimentação, memória e ecologia — sem coordenadas ou viagens inventadas.</p></div>'+
    '<div class="env-metrics"><b>'+model.totais.lote_atual+'</b><span>novas comunidades</span></div></div>'+
    '<div class="expansion-overview"><div><b>'+model.totais.rio_acumulado+'</b><span>propostas no Rio (2 + 9)</span></div>'+
    '<div><b>'+model.totais.eldroth_acumulado+'</b><span>propostas em Eldroth (2 + 9)</span></div>'+
    '<div><b>'+model.totais.habitats_novos+'</b><span>lugares ecológicos separados</span></div>'+
    '<div><b>0</b><span>novos assentamentos canonizados</span></div></div>'+
    '<p class="expansion-scope">Os totais 11 + 11 indicam apenas propostas em dois lotes, não assentamentos confirmados nem cobertura atingida das referências flexíveis (Rio: 15–20; Eldroth: 20–30).</p>'+
    '<div class="env-tabs">'+tabs.map(([id,title])=>'<button type="button" data-expansion-view="'+id+'" class="env-tab'+(view===id?' active':'')+'">'+title+'</button>').join('')+'</div>'+
    '<div class="env-layout"><div class="env-main">'+(view==='metodo'?methods():cards())+'</div>'+
    (view==='metodo'?'':'<aside class="env-inspector expansion-inspector">'+inspection()+'</aside>')+'</div>'+
    '<p class="env-foot">Presença de goblins, fadas, miconídeos, mortos-vivos dissidentes e outros povos é hipotética nestes lugares. Habitat ecológico não prova assentamento social.</p>';
 }
 el.addEventListener("click",e=>{
   const t=e.target.closest("[data-expansion-view]");if(t){view=t.dataset.expansionView;render();return}
   const c=e.target.closest("[data-expansion-id]");if(c&&places.has(c.dataset.expansionId)){
     selected=c.dataset.expansionId;render();
   }
 });
 el.addEventListener("change",e=>{
   const f=e.target.closest("[data-expansion-area]");if(f){
     area=['todas','rio','eldroth'].includes(f.value)?f.value:'todas';render();
   }
 });
 render();
}
