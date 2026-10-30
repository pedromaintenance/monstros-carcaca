/** Ciclo LI — comparar rumos criativos sem canonizar escolhas da interface. */
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export function initDemeterDecisionBook(el,book,simulate){
 if(!el||!book||typeof simulate!=="function"||book.decisoes?.length!==7)
   throw Error("Caderno de Deméter indisponível");
 let tab="perguntas",focus=book.decisoes[0].chave,selected={};
 const decision=()=>book.decisoes.find(d=>d.chave===focus)||book.decisoes[0];
 function chooser(){
  return '<label class="demeter-select">Questão para a autoria <select data-demeter-focus>'+
    book.decisoes.map(d=>'<option value="'+esc(d.chave)+'"'+(focus===d.chave?' selected':'')+'>'+
    esc(d.pergunta)+'</option>').join("")+'</select></label>'+
   '<div class="demeter-decision-cards">'+book.decisoes.map(d=>
    '<button type="button" data-demeter-key="'+esc(d.chave)+'" class="demeter-decision'+
     (focus===d.chave?' active':'')+'"><b>'+esc(d.pergunta)+'</b><small>'+
     esc(selected[d.chave]?d.alternativas.find(x=>x.id===selected[d.chave])?.titulo:"Pendente · nenhuma alternativa escolhida")+
     '</small></button>').join("")+'</div>';
 }
 function options(){
  const d=decision();
  return '<div class="demeter-detail"><div class="env-kicker">Pergunta não resolvida</div><h4>'+esc(d.pergunta)+'</h4>'+
   '<p>'+esc(d.limite_documental)+'</p>'+
   '<label class="demeter-select">Hipótese para comparar (não é aprovação) <select data-demeter-choice>'+
   '<option value="em_aberto"'+(!selected[d.chave]?' selected':'')+'>Manter em aberto</option>'+
   d.alternativas.map(a=>'<option value="'+esc(a.id)+'"'+(selected[d.chave]===a.id?' selected':'')+'>'+
    esc(a.titulo)+'</option>').join("")+'</select></label>'+
   '<div class="demeter-options">'+d.alternativas.map(a=>
   '<div class="demeter-option'+(selected[d.chave]===a.id?' active':'')+'"><b>'+
   esc(a.titulo)+'</b><p>'+esc(a.condicao_explicita)+'</p>'+
   '<p><strong>Questão adicional:</strong> '+esc(a.pergunta_de_consequencia)+'</p>'+
   '<small>Eixos para investigar: '+esc(a.eixos_potencialmente_afetados.join(", "))+
   ' · alternativa não aprovada</small></div>').join("")+'</div></div>';
 }
 function evidence(){
  return '<h4>Seis afirmações sustentadas pelo manuscrito</h4>'+
   '<p class="demeter-warning">As páginas referenciam o contexto autoral, não a hipótese individual escolhida neste painel. Nenhum texto integral do manuscrito é publicado aqui.</p>'+
   book.fatos.map(x=>'<article class="demeter-fact"><b>'+esc(x.afirmacao)+'</b>'+
    '<small>Capítulo I, página(s) '+esc(x.paginas.join(", "))+'</small>'+
    '<p><strong>Não comprova:</strong> '+esc(x.limite)+'</p></article>').join("");
 }
 function impact(){
  const m=simulate(book,selected);
  return '<h4>Consequências hipotéticas das escolhas feitas</h4>'+
   '<p class="demeter-warning">'+esc(m.aviso)+'</p>'+
   '<div class="demeter-impact-summary"><b>'+m.escolhas_hipoteticas.length+
    '</b><span>alternativas selecionadas para discussão</span><b>'+m.decisoes_ainda_em_aberto+
    '</b><span>decisões mantidas em aberto</span></div>'+
   (m.escolhas_hipoteticas.length?
     m.escolhas_hipoteticas.map(x=>'<article class="demeter-impact"><b>'+
     esc(x.pergunta)+'</b><small>'+esc(x.alternativa)+'</small>'+
     '<p>'+esc(x.condicional)+'</p><p><strong>Ainda precisamos perguntar:</strong> '+
     esc(x.pergunta_aberta)+'</p></article>').join(""):
     '<p class="demeter-empty">Nenhuma hipótese selecionada. O manuscrito continua sendo a única base factual.</p>')+
   '<h4>Dimensões que exigiriam estudo adicional</h4>'+
   '<p>'+esc(m.temas_materiais_para_estudo.length?m.temas_materiais_para_estudo.join(" · "):
     "Selecione alguma alternativa para visualizar possíveis dependências materiais.")+'</p>'+
   '<p class="demeter-no-approval">0 decisões aprovadas · 0 rotas criadas · potabilidade não comprovada</p>'+
   '<button type="button" class="demeter-reset" data-demeter-reset>Limpar simulação e manter todas as decisões abertas</button>';
 }
 function limits(){
  return '<h4>Restrições que as hipóteses não podem ultrapassar</h4>'+
   book.nao_inferir.map(x=>'<p class="demeter-rule">'+esc(x)+'</p>').join("")+
   '<h4>Prioridades de decisão autoral</h4>'+book.proximas_perguntas.map((x,i)=>
   '<p class="demeter-rule"><b>'+String(i+1)+'.</b> '+esc(x)+'</p>').join("");
 }
 function render(){
  const m=simulate(book,selected);
  el.innerHTML='<div class="env-head"><div><div class="eyebrow">Ciclo LI · caderno de decisões autorais</div>'+
   '<h3>Deméter e os limites de Portomonte</h3><p>O que sabemos da bênção; o que ainda precisamos escolher; e o que cada alternativa mudaria na vida da Costa Sul.</p></div>'+
   '<div class="env-metrics"><b>7</b><span>perguntas em aberto no cânone</span></div></div>'+
   '<div class="demeter-stats"><div><b>6</b><span>fatos documentados</span></div>'+
   '<div><b>21</b><span>hipóteses para avaliação</span></div>'+
   '<div><b>'+m.escolhas_hipoteticas.length+'</b><span>seleções apenas nesta simulação</span></div>'+
   '<div><b>0</b><span>alternativas canonizadas</span></div></div>'+
   '<p class="demeter-warning">A existência do templo e da agricultura é documentada. Alcance, potabilidade, duração, gestão, produção e comércio detalhado permanecem indefinidos. Selecionar uma alternativa abaixo NÃO salva nem aprova lore.</p>'+
   '<div class="env-tabs">'+[['perguntas','Decisões abertas'],['fontes','Fatos do manuscrito'],['impactos','Consequências hipotéticas'],['limites','Restrições']].map(([id,title])=>
   '<button type="button" data-demeter-tab="'+id+'" class="env-tab'+(tab===id?' active':'')+'">'+title+'</button>').join("")+'</div>'+
   (tab==="perguntas"?'<div class="env-layout"><div class="env-main">'+options()+
    '</div><aside class="env-inspector">'+chooser()+'</aside></div>':
    tab==="fontes"?evidence():tab==="impactos"?impact():limits())+
   '<p class="env-foot">Os totais permanecem 96 comunidades propostas e 42 habitats. Nenhuma seleção implica acesso seguro ao mar, água potável, excedente agrícola ou nova rota comercial.</p>';
 }
 el.addEventListener("click",e=>{
  const tabButton=e.target.closest("[data-demeter-tab]");
  if(tabButton&&["perguntas","fontes","impactos","limites"].includes(tabButton.dataset.demeterTab)){
   tab=tabButton.dataset.demeterTab;render();return;
  }
  const key=e.target.closest("[data-demeter-key]");
  if(key&&book.decisoes.some(d=>d.chave===key.dataset.demeterKey)){
   focus=key.dataset.demeterKey;render();return;
  }
  const reset=e.target.closest("[data-demeter-reset]");
  if(reset){selected={};render()}
 });
 el.addEventListener("change",e=>{
  const focusSelect=e.target.closest("[data-demeter-focus]");
  if(focusSelect&&book.decisoes.some(d=>d.chave===focusSelect.value)){
    focus=focusSelect.value;render();return;
  }
  const selection=e.target.closest("[data-demeter-choice]");
  if(selection){
    const d=decision();
    if(selection.value==="em_aberto")delete selected[d.chave];
    else if(d.alternativas.some(x=>x.id===selection.value))selected[d.chave]=selection.value;
    render();
  }
 });
 render();
}
