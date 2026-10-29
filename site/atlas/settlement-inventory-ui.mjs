/** Inventário e primeiro lote: documentos não são habitantes; propostas não são cânone. */
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export function initSettlementInventory(el,model){
 if(!el||!model?.lote?.length)throw Error("Inventário de povoamento indisponível");
 const byId=new Map(model.lote.map(x=>[x.id,x]));
 let view="propostas",front="todas",selected=model.lote[0].id;
 const selectedRow=()=>byId.get(selected)||model.lote[0];
 function rowCard(x){
  return '<button type="button" class="settlement-seed-card'+(selected===x.id?" active":"")+
   '" data-settlement-id="'+esc(x.id)+'"><small>'+esc(x.frente_id.replace("frente:macro:",""))+
   ' · proposta não canônica</small><b>'+esc(x.nome)+'</b><span>'+esc(x.criaturas_e_povos.join(" · "))+'</span></button>';
 }
 function proposalView(){
  const visible=model.lote.filter(x=>front==="todas"||x.frente_id===front);
  return '<div class="settlement-filter"><label>Frente regional <select data-settlement-filter><option value="todas">Todas as frentes</option>'+
   model.frentes.map(f=>'<option value="'+esc(f.id)+'"'+(front===f.id?" selected":"")+'>'+
     esc(f.titulo)+' · '+f.propostas.length+' propostas</option>').join("")+'</select></label></div>'+
   '<p class="settlement-note">Estas comunidades são hipóteses editoriais habitadas, não assentamentos confirmados. A distribuição não homologa estradas, coordenadas ou presença de espécies.</p>'+
   '<div class="settlement-seed-grid">'+(visible.length?visible.map(rowCard).join(""):'<p>Não há propostas novas nesta frente no primeiro lote.</p>')+'</div>';
 }
 function baseline(){
  const x=model.totais;
  return '<p class="settlement-note">A contagem abaixo mede <strong>registros nas bases consultadas</strong>, nunca o total real de localidades do continente. Há duplicidades entre documentos e conjuntos regionais não individualizados.</p>'+
   '<div class="settlement-stats">'+[
      ["Âncoras macro",x.ancoras_macro],
      ["Lugares catalogados",x.lugares_catalogados],
      ["Registros formais de assentamento",x.registros_formais_assentamento],
      ["Sementes de cenas",x.redacoes_sementes],
      ["Espécies e manifestações propostas",x.propostas_de_criaturas_ecologicas],
      ["Comunidades novas propostas",x.novos_assentamentos_propostos]
    ].map(([name,value])=>'<div><b>'+value+'</b><span>'+name+'</span></div>').join("")+'</div>'+
    '<h4>Os três registros formais existentes</h4>'+
    model.registros_formais.map(x=>'<div class="settlement-baseline-row"><b>'+esc(x.nome)+'</b>'+
      '<span>'+esc(x.natureza.replaceAll("_"," "))+(x.precisa_individualizacao?" · conjunto a individualizar":" · cidade identificada")+'</span></div>').join("")+
    '<h4>Por que não somar tudo?</h4>'+model.advertencias.map(x=>'<p class="settlement-rule">'+esc(x)+'</p>').join("");
 }
 function dedupe(){
  return '<p class="settlement-note">Equivalências para impedir a criação artificial de várias cidades a partir de referências repetidas. Nenhuma relação espacial contestada foi resolvida automaticamente.</p>'+
    model.equivalencias.map(g=>'<article class="settlement-equivalence"><h4>'+esc(g.grupo.replaceAll("-"," "))+'</h4><p>'+esc(g.nota)+'</p><small>'+
      g.refs.map(esc).join(" / ")+'</small></article>').join("");
 }
 function detail(){
  const x=selectedRow();
  return '<div class="env-kicker">Proposta ecológica · '+esc(x.permanencia.replaceAll("_"," "))+'</div>'+
    '<h4>'+esc(x.nome)+'</h4>'+
    '<div class="env-subhead">Habitantes e organização</div><p>'+esc(x.habitantes_descritos)+'</p><p>'+esc(x.organizacao)+'</p>'+
    '<div class="env-subhead">Como vive</div><p>'+esc(x.subsistencia_hipotetica)+'</p>'+
    '<div class="env-subhead">Forma de habitação</div><p>'+esc(x.habitat_e_arquitetura)+'</p>'+
    '<div class="env-subhead">Conflito editorial</div><p>'+esc(x.conflito_editorial)+'</p>'+
    '<div class="env-subhead">Apoio na ambientação</div><p>'+esc(x.ancora_de_ambientacao)+'</p>'+
    '<div class="env-subhead">Limites de inferência</div><p>'+esc(x.nao_inferir)+'</p>'+
    '<p class="env-citation">Sem posição, população ou rotas confirmadas; aprovação autoral pendente.</p>';
 }
 function render(){
  const tabs=[["propostas","14 comunidades propostas"],["inventario","Inventário das fontes"],["equivalencias","7 grupos de equivalência"]];
  el.innerHTML='<div class="env-head"><div><div class="eyebrow">Povoamento continental · primeiro recenseamento</div>'+
    '<h3>Quem realmente habita a Carcaça?</h3>'+
    '<p>Uma base de referências, não um censo de cidades; e o primeiro conjunto de comunidades fantásticas para avaliação autoral.</p></div>'+
    '<div class="env-metrics"><b>'+model.totais.novos_assentamentos_propostos+'</b><span>comunidades propostas</span></div></div>'+
    '<div class="settlement-header-note">0 novos assentamentos canonizados · 3 registros formais já existentes (incluindo 2 conjuntos) · 16 sementes narrativas não são 16 vilas</div>'+
    '<div class="env-tabs">'+tabs.map(([k,label])=>'<button type="button" class="env-tab'+(view===k?" active":"")+
      '" data-settlement-view="'+k+'">'+label+'</button>').join("")+'</div>'+
    '<div class="env-layout"><div class="env-main">'+(view==="propostas"?proposalView():view==="inventario"?baseline():dedupe())+
     '</div><aside class="env-inspector">'+detail()+'</aside></div>'+
    '<p class="env-foot">A classificação de um povoado, refúgio, covil, habitat ou ruína será revista antes de ser adicionada à contagem de assentamentos. Nenhuma espécie é automaticamente canônica no setor.</p>';
 }
 el.addEventListener("click",event=>{
  const t=event.target.closest("[data-settlement-view]");if(t){view=t.dataset.settlementView;render();return}
  const n=event.target.closest("[data-settlement-id]");if(n&&byId.has(n.dataset.settlementId)){
    selected=n.dataset.settlementId;render();
  }
 });
 el.addEventListener("change",event=>{
  const f=event.target.closest("[data-settlement-filter]");if(f){
   front=f.value==="todas"||model.frentes.some(x=>x.id===f.value)?f.value:"todas";
   if(front!=="todas"&&!model.lote.some(x=>x.id===selected&&x.frente_id===front)){
    selected=model.lote.find(x=>x.frente_id===front)?.id||selected;
   }
   render();
  }
 });
 render();
}
