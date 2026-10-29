/** Ciclo XLII: laboratório de hipóteses sem simulação numérica ou previsão de perdas. */
const esc=x=>String(x??"").replace(/[&<>"']/g,k=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[k]));
export function initContinentalVulnerabilities(el,model){
 if(!el||!model?.cenarios?.length)throw new Error("Laboratório de vulnerabilidades indisponível");
 const byId=new Map(model.cenarios.map(x=>[x.id,x]));
 const groupTitles=new Map(model.grupos.map(x=>[x.id,x.titulo]));
 let tab="explorar",group="todos",selected=model.cenarios[0].id,compared=model.cenarios[1].id;
 const focusText=(c)=>c.vinculos_foco_expandido.map(v=>
  '<article class="vulnerability-edge"><small>'+esc(v.tipo.replaceAll("_"," "))+' · Hack p. '+esc(v.paginas.join(", "))+'</small>'+
  '<div><span>'+esc(v.de_nome)+'</span><b>→</b><span>'+esc(v.para_nome)+'</span></div>'+
  '<p>'+esc(v.evidencia)+'</p></article>').join("");
 const linksText=(c)=>c.vinculos_condicionais_expandido.length?
   '<div class="vulnerability-related">'+c.vinculos_condicionais_expandido.map(v=>
      '<div><small>'+esc(v.tipo.replaceAll("_"," "))+'</small><span>'+esc(v.de_nome)+' → '+esc(v.para_nome)+'</span></div>').join("")+'</div>':
   '<p class="vulnerability-muted">Nenhum outro vínculo foi selecionado para observação condicionada.</p>';
 function card(c){
  return '<article class="vulnerability-card'+(selected===c.id?" active":"")+'">'+
    '<div class="vulnerability-card-top"><small>'+esc(groupTitles.get(c.grupo))+'</small>'+
    '<small>'+esc(c.tipo.replaceAll("_"," "))+'</small></div>'+
    '<h4>'+esc(c.titulo)+'</h4><p>'+esc(c.premissa)+'</p>'+
    '<div class="vulnerability-actions"><button type="button" data-vuln-select="'+esc(c.id)+'">Examinar hipótese</button>'+
      '<button type="button" data-vuln-compare="'+esc(c.id)+'">Comparar</button></div></article>';
 }
 function explorer(){
  const visible=model.cenarios.filter(c=>group==="todos"||c.grupo===group);
  return '<p class="vulnerability-disclaimer"><strong>Exercício de autoria, não previsão:</strong> as condições abaixo não ocorreram no cânone. O painel não conhece probabilidade, perdas, preços, duração nem rotas alternativas.</p>'+
    '<div class="vulnerability-filter"><label>Dimensão <select data-vuln-group><option value="todos">Todas as dimensões</option>'+
    model.grupos.map(g=>'<option value="'+esc(g.id)+'"'+(g.id===group?" selected":"")+'>'+esc(g.titulo)+'</option>').join("")+
    '</select></label></div>'+
    '<div class="vulnerability-cards">'+visible.map(card).join("")+'</div>';
 }
 function shortColumn(c){
  return '<div class="vulnerability-compare-panel"><small>'+esc(groupTitles.get(c.grupo))+' · hipótese não adotada</small>'+
     '<h4>'+esc(c.titulo)+'</h4>'+
     '<div class="env-subhead">Condição testada</div><p>'+esc(c.premissa)+'</p>'+
     '<div class="env-subhead">Vínculos examinados</div>'+focusText(c)+
     '<div class="env-subhead">Possível repercussão (não calculada)</div><p>'+esc(c.repercussao_condicional)+'</p>'+
     '<div class="env-subhead">Evidência de contraponto, não garantia de resiliência</div><p>'+esc(c.contrapeso_documentado)+'</p>'+
     '<div class="env-subhead">Proibido inferir</div><p>'+esc(c.nao_inferir)+'</p></div>';
 }
 function compare(){
  const first=byId.get(selected),other=byId.get(compared)||model.cenarios[1];
  return '<p class="vulnerability-disclaimer">Comparação <strong>qualitativa</strong>: as diferenças abaixo mostram apenas perguntas e vínculos de origem. Não há classificação de risco, probabilidade ou capacidade de recuperação.</p>'+
   '<div class="vulnerability-picker"><label>Hipótese A <select data-vuln-choice="a">'+
      model.cenarios.map(c=>'<option value="'+esc(c.id)+'"'+(selected===c.id?" selected":"")+'>'+esc(c.titulo)+'</option>').join("")+'</select></label>'+
   '<label>Hipótese B <select data-vuln-choice="b">'+
      model.cenarios.map(c=>'<option value="'+esc(c.id)+'"'+(other.id===c.id?" selected":"")+'>'+esc(c.titulo)+'</option>').join("")+'</select></label></div>'+
   (first.id===other.id?'<p class="vulnerability-muted">Escolha duas hipóteses diferentes para compará-las.</p>':
     '<div class="vulnerability-compare">'+shortColumn(first)+shortColumn(other)+'</div>')+
    '<p class="vulnerability-footnote">Uma relação condicional compartilhada não demonstra um gargalo comum. Exposição territorial, rotas e perdas seguem indeterminadas.</p>';
 }
 function methodology(){
  return '<div class="vulnerability-method"><p>'+esc(model.criterio)+'</p>'+
    '<h4>Invariantes de autoria</h4>'+model.invariantes.map(x=>'<div class="vulnerability-rule">'+esc(x)+'</div>').join("")+
    '<h4>Informações necessárias antes de modelar perdas reais</h4>'+
      model.proximos_dados_necessarios.map(x=>'<div class="vulnerability-need">'+esc(x)+'</div>').join("")+'</div>';
 }
 function inspector(){
  const c=byId.get(selected);
  return '<div class="env-kicker">'+esc(groupTitles.get(c.grupo))+' · não canônico</div>'+
   '<h4>'+esc(c.titulo)+'</h4><p>'+esc(c.premissa)+'</p>'+
   '<div class="env-subhead">A. Vínculo documental posto à prova</div>'+focusText(c)+
   '<div class="env-subhead">B. Efeito direto apenas na hipótese</div><p>'+esc(c.efeito_direto)+'</p>'+
   '<div class="env-subhead">C. Repercussão condicional, não verificada</div><p>'+esc(c.repercussao_condicional)+'</p>'+
   '<div class="env-subhead">Relações adjacentes em observação</div>'+linksText(c)+
   '<div class="env-subhead">Contraponto sustentado pelo manuscrito</div><p>'+esc(c.contrapeso_documentado)+'</p>'+
   '<div class="env-subhead">Não concluir</div><p>'+esc(c.nao_inferir)+'</p>'+
   '<div class="env-subhead">Perguntas editoriais</div><div class="vulnerability-questions">'+
      c.perguntas.map(q=>'<p>'+esc(q)+'</p>').join("")+'</div>'+
   '<p class="env-citation">Hack p. '+esc(c.paginas.join(", "))+' · sem geometria, impacto ou probabilidade</p>';
 }
 function render(){
  const tabs=[["explorar","Explorar cenários"],["comparar","Comparar duas hipóteses"],["criterios","Critérios e dados faltantes"]];
  el.innerHTML='<div class="env-head"><div><div class="eyebrow">Ciclo XLII · dependências continentais</div>'+
     '<h3>O que acontece se uma ligação falhar?</h3>'+
     '<p>Investigue vulnerabilidades da Corte, da resistência e das comunidades sem transformar hipóteses em acontecimentos.</p></div>'+
     '<div class="env-metrics"><b>'+model.totais.cenarios+'</b><span>hipóteses de estudo</span></div></div>'+
     '<div class="vulnerability-metrics"><span>'+model.totais.grupos+' sistemas</span><span>'+
        model.totais.vinculos_foco_unicos+' vínculos distintos examinados</span><span>0 previsões</span><span>0 eventos canonizados</span></div>'+
     '<div class="env-tabs">'+tabs.map(([k,v])=>'<button type="button" class="env-tab'+(tab===k?" active":"")+
        '" data-vuln-tab="'+k+'">'+v+'</button>').join("")+'</div>'+
     '<div class="'+(tab==="comparar"?"vulnerability-main-alone":"env-layout")+'"><div class="env-main">'+
       (tab==="explorar"?explorer():tab==="comparar"?compare():methodology())+'</div>'+
       (tab==="comparar"?"":'<aside class="env-inspector vulnerability-inspector">'+inspector()+'</aside>')+'</div>'+
     '<p class="env-foot">Laboratório editorial: nenhuma hipótese altera o cânone ou constitui cálculo de perdas, probabilidade, distância ou duração.</p>';
 }
 el.addEventListener("click",e=>{
  const t=e.target.closest("[data-vuln-tab]");if(t){tab=t.dataset.vulnTab;render();return}
  const s=e.target.closest("[data-vuln-select]");if(s&&byId.has(s.dataset.vulnSelect)){
    selected=s.dataset.vulnSelect;render();return;
  }
  const c=e.target.closest("[data-vuln-compare]");if(c&&byId.has(c.dataset.vulnCompare)){
    compared=c.dataset.vulnCompare;if(compared===selected){
      selected=model.cenarios.find(x=>x.id!==compared).id;
    }
    tab="comparar";render();
  }
 });
 el.addEventListener("change",e=>{
   const f=e.target.closest("[data-vuln-group]");if(f){
     const g=f.value;group=g==="todos"||model.grupos.some(x=>x.id===g)?g:"todos";render();return;
   }
   const x=e.target.closest("[data-vuln-choice]");if(x&&byId.has(x.value)){
     if(x.dataset.vulnChoice==="a")selected=x.value;else compared=x.value;render();
   }
 });
 render();
}
