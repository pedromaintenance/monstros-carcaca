/** Circulação material da Carcaça: navegação por vínculos documentais, não mapa de rotas. */
const esc=v=>String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const titles={rio:"Eixo do Rio Ancestral",thargrid:"Thargrid e o subsolo",eldroth:"Eldroth e resistência",costa:"Costa Sul e ilhas",caatinga:"Caatinga",grama:"Grama-Cortada"};
export function initMaterialCirculation(el,data){
 if(!el||!data?.nodos?.length)throw new Error("Circulação material indisponível");
 const nodes=new Map(data.nodos.map(n=>[n.id,n]));
 const types=[...new Set(data.vinculos.map(v=>v.tipo))];
 let tab="redes",sector="todos",selected=data.nodos[0].id,type="todos";
 const visible=()=>data.vinculos.filter(v=>(sector==="todos"||
    nodes.get(v.de).setor===sector||nodes.get(v.para).setor===sector)&&
    (type==="todos"||v.tipo===type));
 function inspector(){
   const n=nodes.get(selected);if(!n)return '<p>Selecione um nó material.</p>';
   const links=data.vinculos.filter(e=>e.de===n.id||e.para===n.id);
   const gaps=data.lacunas.filter(q=>q.ref_nodo===n.id);
   return '<div class="env-kicker">'+esc(titles[n.setor])+' · '+esc(n.funcao.replaceAll("_"," "))+'</div>'+
    '<h4>'+esc(n.titulo)+'</h4><div class="env-subhead">Evidência no manuscrito</div><p>'+esc(n.evidencia)+'</p>'+
    '<p class="env-citation">Hack p. '+esc(n.paginas.join(", "))+' · '+esc(n.ref_rede||"sem rede temática confirmada")+'</p>'+
    '<div class="env-subhead">Relações documentadas ('+links.length+')</div>'+
    (links.map(e=>{const other=nodes.get(e.de===n.id?e.para:e.de);return '<button class="material-inspector-link" type="button" data-material-node="'+esc(other.id)+'">'+
       '<b>'+esc(other.titulo)+'</b><small>'+esc(e.evidencia)+'</small></button>';}).join("")||'<p>Nenhuma transferência específica foi documentada para este nó.</p>')+
    (gaps.length?'<div class="env-subhead">O que falta saber</div>'+
     gaps.map(g=>'<p class="material-inspector-gap">'+esc(g.pergunta)+'</p>').join(""):"")+
    '<div class="env-subhead">Limites cartográficos</div>'+
    '<p>Sem coordenadas, medidas de fluxo, custo logístico, frequência aferida ou trajeto homologado.</p>';
 }
 function nodesTab(){
   return '<p class="material-context">Os nós representam <strong>funções sociais, instituições ou coletividades</strong> citadas no manuscrito. Não são necessariamente cidades nem pontos cartografáveis.</p>'+
    '<div class="material-nodes">'+data.nodos.filter(n=>sector==="todos"||n.setor===sector).map(n=>
      '<button class="material-node'+(selected===n.id?" selected":"")+'" type="button" data-material-node="'+esc(n.id)+'">'+
       '<span>'+esc(titles[n.setor])+' · '+esc(n.funcao.replaceAll("_"," "))+'</span>'+
       '<b>'+esc(n.titulo)+'</b><small>Hack p. '+esc(n.paginas.join(", "))+'</small></button>').join("")+'</div>';
 }
 function linksTab(){
   const vs=visible();
   return '<p class="material-context">A direção abaixo identifica o sentido documental da relação, não o trajeto físico. Os vínculos incluem comércio, coerção, refúgio, informação e exigências ainda sem comprovação de pagamento.</p>'+
    '<div class="material-relations">'+(vs.map(e=>
      '<article class="material-relation"><div class="material-relation-meta">'+esc(e.tipo.replaceAll("_"," "))+
       ' · '+esc(e.modalidade.replaceAll("_"," "))+' · Hack p. '+esc(e.paginas.join(", "))+'</div>'+
       '<div class="material-relation-path"><button type="button" data-material-node="'+esc(e.de)+'">'+esc(nodes.get(e.de).titulo)+'</button>'+
       '<span>→</span><button type="button" data-material-node="'+esc(e.para)+'">'+esc(nodes.get(e.para).titulo)+'</button></div>'+
       '<p>'+esc(e.evidencia)+'</p><small><b>Não inferir:</b> '+esc(e.limite)+'</small></article>').join("")||
      '<p class="material-empty">Não há vínculo deste tipo no recorte selecionado.</p>')+'</div>';
 }
 function gapsTab(){return '<p class="material-context">Perguntas editoriais que não devem ser respondidas por suposição cartográfica.</p>'+
    '<div class="material-gaps">'+data.lacunas.filter(g=>sector==="todos"||nodes.get(g.ref_nodo).setor===sector).map(g=>
    '<article><small>Em aberto</small><p>'+esc(g.pergunta)+'</p><button type="button" data-material-node="'+esc(g.ref_nodo)+'">Consultar a referência</button></article>').join("")+'</div>';}
 function rulesTab(){return '<div class="material-rules"><p>'+esc(data.criterio)+'</p>'+
    data.guardrails.map(t=>'<div>'+esc(t)+'</div>').join("")+'</div>';}
 function render(){
   const tabs=[["redes","24 nós materiais"],["relacoes","15 vínculos documentais"],["lacunas","12 decisões abertas"],["criterios","Critérios de leitura"]];
   el.innerHTML='<div class="env-head"><div><div class="eyebrow">Ciclo XLI · economia e circulação continental</div>'+
    '<h3>O que sustenta a Carcaça</h3><p>Extração, produção, circulação, refúgio e informação como relações sociais — sem distâncias ou volumes inventados.</p></div>'+
    '<div class="env-metrics"><b>'+data.totais.vinculos+'</b><span>relações auditadas</span></div></div>'+
    '<div class="material-stats"><span>'+data.totais.nodos+' nós documentais</span><span>'+data.totais.lacunas+' lacunas</span><span>0 rotas confirmadas</span><span>0 fluxos medidos</span></div>'+
    '<div class="env-tabs">'+tabs.map(([k,v])=>
      '<button class="env-tab'+(tab===k?" active":"")+'" type="button" data-material-tab="'+k+'">'+v+'</button>').join("")+'</div>'+
    (tab!=="criterios"?'<div class="material-filters"><label>Setor <select data-material-sector><option value="todos">Todos os setores</option>'+
     data.grupos.map(g=>'<option value="'+esc(g.setor)+'"'+(sector===g.setor?" selected":"")+'>'+esc(titles[g.setor])+'</option>').join("")+
     '</select></label>'+(tab==="relacoes"?'<label>Tipo <select data-material-type><option value="todos">Todos os tipos</option>'+
     types.map(t=>'<option value="'+esc(t)+'"'+(type===t?" selected":"")+'>'+esc(t.replaceAll("_"," "))+'</option>').join("")+'</select></label>':"")+'</div>':"")+
    '<div class="env-layout"><div class="env-main">'+(tab==="redes"?nodesTab():tab==="relacoes"?linksTab():tab==="lacunas"?gapsTab():rulesTab())+
    '</div><aside class="env-inspector">'+inspector()+'</aside></div>'+
    '<p class="env-foot">Vínculo não equivale a rota; exigência tributária não comprova pagamento; trabalho escravizado não é mercadoria neutra. Todas as páginas remetem ao capítulo I do Hack.</p>';
 }
 el.addEventListener("click",ev=>{
   const t=ev.target.closest("[data-material-tab]");if(t){tab=t.dataset.materialTab;render();return}
   const n=ev.target.closest("[data-material-node]");if(n&&nodes.has(n.dataset.materialNode)){
     selected=n.dataset.materialNode;sector="todos";render();
   }
 });
 el.addEventListener("change",ev=>{
   const s=ev.target.closest("[data-material-sector]");
   if(s){const ids=new Set(data.grupos.map(g=>g.setor));sector=ids.has(s.value)?s.value:"todos";
     if(sector!=="todos"&&!data.nodos.some(n=>n.id===selected&&n.setor===sector)){
       const first=data.nodos.find(n=>n.setor===sector);if(first)selected=first.id;
     }render();return}
   const t=ev.target.closest("[data-material-type]");
   if(t){type=types.includes(t.value)?t.value:"todos";render()}
 });
 render();
}
