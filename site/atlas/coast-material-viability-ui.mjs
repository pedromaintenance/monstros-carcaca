/** Ciclo L — leitura material sem transformar faltas de fonte em inexistência de recurso. */
const esc=v=>String(v??"").replace(/[&<>"']/g,k=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[k]));
export function initCoastMaterialViability(el,model){
 if(!el||model?.balanco?.celulas_de_auditoria!==90||model.comunidades?.length!==14)
   throw Error("Matriz de viabilidade XL não disponível");
 let tab="matriz",selected=model.portomonte.id,axis="agua",scenario=model.cenarios[0].id;
 const locations=[model.portomonte,...model.comunidades],sites=new Map(locations.map(x=>[x.id,x]));
 const current=()=>sites.get(selected)||model.portomonte;
 const axisLabel=x=>model.eixos.find(a=>a.id===x)?.nome||x;
 function resources(){
   const site=current(),primary=site.id===model.portomonte.id;
   return '<div class="material-resource-intro"><h4>'+esc(site.nome)+'</h4>'+
    '<p>'+esc(primary?"Âncora documentada: apenas efeitos locais descritos no manuscrito, não um balanço de recursos.":"Comunidade proposta: necessidades materiais não verificadas; a descrição não confirma ocupação, água ou alimento.")+'</p></div>'+
    '<div class="material-axis-list">'+site.eixos.map(x=>
      '<button type="button" data-material-axis="'+esc(x.eixo)+'" class="material-axis'+(axis===x.eixo?" active":"")+'">'+
      '<b>'+esc(x.rotulo)+'</b><span>'+esc(primary?x.estado.replaceAll("_"," "):"hipótese não verificada")+'</span></button>').join("")+'</div>'+
    '<div class="material-axis-detail"><div class="env-kicker">'+esc(axisLabel(axis))+'</div>'+
    '<p>'+esc(site.eixos.find(x=>x.eixo===axis)?.analise)+'</p>'+
    '<div class="env-subhead">Pergunta para a autoria</div><p>'+esc(site.eixos.find(x=>x.eixo===axis)?.pergunta_a_resolver)+'</p>'+
    '<p class="material-no-guarantee">Disponibilidade garantida: não · Demonstração quantitativa: não</p></div>';
 }
 function siteList(){
   return '<label class="material-site-label">Local de análise <select data-material-site>'+
    locations.map(x=>'<option value="'+esc(x.id)+'"'+(selected===x.id?" selected":"")+'>'+
      esc(x.nome)+(x.id===model.portomonte.id?" · documentada":" · proposta")+'</option>').join("")+'</select></label>'+
    '<div class="material-site-list">'+locations.map(x=>'<button type="button" class="material-site'+
       (selected===x.id?" active":"")+'" data-material-select="'+esc(x.id)+'"><b>'+esc(x.nome)+'</b><small>'+
       esc(x.id===model.portomonte.id?"Local documentado · sem viabilidade comprovada":"Comunidade proposta · sem viabilidade homologada")+'</small></button>').join("")+'</div>';
 }
 function scenarios(){
   const sim=model.cenarios.find(x=>x.id===scenario)||model.cenarios[0];
   return '<p class="material-warning">Os cenários abaixo são contrafactuais. A contagem de localidades sensíveis apenas encontra tags propostas no texto: NÃO estima risco, probabilidade, população ameaçada ou dano real.</p>'+
     '<label class="material-site-label">Cenário hipotético <select data-material-scenario>'+
     model.cenarios.map(x=>'<option value="'+esc(x.id)+'"'+(scenario===x.id?" selected":"")+'>'+esc(x.titulo)+'</option>').join("")+'</select></label>'+
     '<div class="material-scenario"><h4>'+esc(sim.titulo)+'</h4>'+
     '<p>'+esc(sim.mecanismo_condicional)+'</p>'+
     '<p class="material-limit">'+esc(sim.limite)+'</p>'+
     '<div class="env-subhead">Localidades com menção temática à exposição ('+sim.contagem_de_mencoes_condicionais+' de 15 registros)</div>'+
     '<div class="material-exposed">'+sim.expostos_por_tag.map(x=>'<button type="button" data-material-open-site="'+esc(x.id)+'">'+esc(x.nome)+'</button>').join("")+'</div></div>';
 }
 function epistemic(){
   return '<h4>O que o manuscrito realmente confirma?</h4><p class="material-warning">'+esc(model.principio)+'</p>'+
    '<div class="material-critical"><b>Portomonte</b><p>O templo de Deméter purifica águas próximas e torna possível a agricultura da costa pedregosa; Portomonte é um centro comercial. O texto não fornece potabilidade, vazão, produção anual, estoques, rotas nem entregas às comunidades propostas.</p></div>'+
    '<h4>Salvaguardas de cânone</h4>'+model.advertencias.map(x=>'<p class="material-rule">'+esc(x)+'</p>').join("")+
    '<h4>Próximas decisões autorais</h4>'+model.proximo_ciclo.map((x,i)=>'<p class="material-rule"><b>'+String(i+1)+'.</b> '+esc(x)+'</p>').join("");
 }
 function render(){
   el.innerHTML='<div class="env-head"><div><div class="eyebrow">Ciclo L · auditoria de recursos</div>'+
      '<h3>De que vive a Costa Sul?</h3><p>Água, alimento, energia, matérias-primas, trabalho e circulação: o que sabemos, o que propomos e o que ainda falta comprovar.</p></div>'+
      '<div class="env-metrics"><b>90</b><span>perguntas materiais · não respostas confirmadas</span></div></div>'+
      '<div class="material-stat-grid"><div><b>1</b><span>local documentado: Portomonte</span></div>'+
      '<div><b>14</b><span>comunidades propostas analisadas</span></div>'+
      '<div><b>6</b><span>cenários condicionais</span></div>'+
      '<div><b>0</b><span>viabilidades homologadas</span></div></div>'+
      '<p class="material-warning">Este módulo NÃO declara que faltam recursos na Carcaça. Indica quais recursos ainda não foram comprovados nos materiais disponíveis. Não transforma a bênção agrícola de Portomonte em água potável ou abastecimento regional.</p>'+
      '<div class="env-tabs">'+[['matriz','Locais e recursos'],['cenarios','Cenários de tensão'],['fontes','Fontes e limites']].map(([id,name])=>
      '<button type="button" data-material-tab="'+id+'" class="env-tab'+(tab===id?" active":"")+'">'+name+'</button>').join("")+'</div>'+
      (tab==="matriz"?'<div class="env-layout"><div class="env-main">'+resources()+'</div><aside class="env-inspector">'+siteList()+'</aside></div>':
       tab==="cenarios"?scenarios():epistemic())+
      '<p class="env-foot">O XLIX mantém 96 propostas de comunidades e 42 habitats. Este ciclo não acrescenta nem aprova cidades: identifica condições necessárias para que as futuras decisões sejam coerentes.</p>';
 }
 el.addEventListener("click",e=>{
   const t=e.target.closest("[data-material-tab]");
   if(t&&["matriz","cenarios","fontes"].includes(t.dataset.materialTab)){tab=t.dataset.materialTab;render();return}
   const a=e.target.closest("[data-material-axis]");
   if(a&&model.eixos.some(x=>x.id===a.dataset.materialAxis)){axis=a.dataset.materialAxis;render();return}
   const site=e.target.closest("[data-material-select]");
   if(site&&sites.has(site.dataset.materialSelect)){selected=site.dataset.materialSelect;render();return}
   const open=e.target.closest("[data-material-open-site]");
   if(open&&sites.has(open.dataset.materialOpenSite)){selected=open.dataset.materialOpenSite;tab="matriz";render()}
 });
 el.addEventListener("change",e=>{
   const loc=e.target.closest("[data-material-site]");
   if(loc&&sites.has(loc.value)){selected=loc.value;render();return}
   const sim=e.target.closest("[data-material-scenario]");
   if(sim&&model.cenarios.some(x=>x.id===sim.value)){scenario=sim.value;render()}
 });
 render();
}
