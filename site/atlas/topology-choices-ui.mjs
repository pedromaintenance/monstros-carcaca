/** Oficina de hipóteses espaciais: seleção local, não salva, não canoniza, não cria mapas. */
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const costs={baixo:"Baixa",medio:"Média",alto:"Alta"};
export function initTopologyChoices(el,data){
 if(!el||!data?.decisoes?.length)throw new Error("Matriz topológica indisponível");
 const chosen=new Map();
 let group=data.grupos[0].id,mode="oficina";
 const groupBy=new Map(data.grupos.map(g=>[g.id,g]));
 const options=new Map(data.decisoes.map(d=>[d.id,new Map(d.alternativas.map(o=>[o.id,o]))]));
 function proposalCards(d){
   return '<div class="topo-options">'+d.alternativas.map((o,n)=>{
     const picked=chosen.get(d.id)===o.id;
     return '<button type="button" class="topo-option'+(picked?" selected":"")+'" data-topo-choice="'+esc(o.id)+'" data-topo-decision="'+esc(d.id)+'" aria-pressed="'+String(picked)+'">'+
       '<span class="topo-option-meta">Alternativa '+String.fromCharCode(65+n)+' · impacto editorial '+esc(costs[o.custo_editorial])+'</span>'+
       '<strong>'+esc(o.titulo)+'</strong><code>'+esc(o.esquema)+'</code>'+
       '<span>'+esc(o.hipotese)+'</span>'+
       '<span class="topo-detail"><b>Mapeamento:</b> '+esc(o.implicacao_cartografica)+'</span>'+
       '<span class="topo-detail"><b>Consequência material:</b> '+esc(o.consequencia_material)+'</span>'+
       '<span class="topo-detail"><b>Condição para aprovar:</b> '+esc(o.condicao_para_canonizar)+'</span>'+
       '<span class="topo-choice-action">'+(picked?"Selecionada apenas para comparação · clicar para limpar":"Simular esta alternativa")+'</span></button>';
   }).join("")+'</div>';
 }
 function cards(){
   const current=data.decisoes.filter(d=>d.grupo===group);
   return '<div class="topo-questions">'+current.map(d=>
     '<article class="topo-decision"><div class="topo-decision-top"><div><span>Questão '+esc(d.ref_questao)+' · Hack p. '+esc(d.paginas.join(", "))+'</span>'+
     '<h4>'+esc(d.titulo)+'</h4></div><span class="topo-pending">Pendente</span></div>'+
     '<p>'+esc(d.documentado)+'</p><div class="topo-invariants"><strong>Referências que não mudam</strong><ul>'+
     d.invariantes.map(t=>'<li>'+esc(t)+'</li>').join("")+'</ul></div>'+proposalCards(d)+'</article>').join("")+'</div>';
 }
 function notebook(){
   let out='<div class="topo-summary-head"><h4>Quadro de hipóteses</h4><p>'+chosen.size+' de '+data.totais.decisoes+' questões simuladas. Nenhuma escolha é armazenada ou adotada.</p></div>';
   out+='<div class="topo-summary-actions"><button type="button" data-topo-reset="all"'+(!chosen.size?" disabled":"")+'>Limpar simulações</button></div>';
   out+='<div class="topo-summary-list">'+data.grupos.map(g=>{
     const d=data.decisoes.filter(q=>q.grupo===g.id);
     const count=d.filter(q=>chosen.has(q.id)).length;
     return '<div class="topo-summary-group"><strong>'+esc(g.nome)+'</strong><small>'+count+'/'+d.length+' hipóteses exploradas</small>'+
       d.map(x=>{
         const option=options.get(x.id).get(chosen.get(x.id));
         return '<div class="topo-summary-choice"><span>'+esc(x.titulo)+'</span><b>'+esc(option?option.titulo:"Em aberto")+'</b>'+
           (option?'<button type="button" data-topo-reset="'+esc(x.id)+'" aria-label="Limpar simulação">×</button>':"")+'</div>';
       }).join("")+'</div>';
   }).join("")+'</div><p class="topo-disclaimer">Os cenários selecionados são apenas hipóteses locais de trabalho. Não são persistidos no navegador, não escrevem no GitHub e não representam um mapa em escala.</p>';
   return out;
 }
 function render(){
   const g=groupBy.get(group);
   el.innerHTML='<div class="env-head"><div><div class="eyebrow">Ciclo XXXVII · oficina de cartografia</div>'+
     '<h3>Decisões de topologia continental</h3><p>Compare interpretações espaciais sem adulterar o manuscrito. O esboço de cada alternativa é uma notação conceitual, não um desenho topográfico.</p></div>'+
     '<div class="env-metrics"><b>'+data.totais.alternativas+'</b><span>alternativas não adotadas</span></div></div>'+
     '<div class="topo-groups">'+data.grupos.map(x=>
       '<button type="button" data-topo-group="'+esc(x.id)+'" class="topo-group'+(group===x.id?" active":"")+'" aria-pressed="'+String(group===x.id)+'">'+
       '<strong>'+esc(x.nome)+'</strong><small>'+esc(x.descricao)+'</small></button>').join("")+'</div>'+
     '<p class="topo-selected-head">'+esc(g.nome)+' — '+data.decisoes.filter(d=>d.grupo===group).length+' decisões com alternativas concorrentes</p>'+
     '<div class="topo-layout"><div>'+cards()+'</div><aside class="topo-notebook">'+notebook()+'</aside></div>'+
     '<p class="env-foot">Fonte primária: manuscrito paginado. Decisões e vínculos: Ciclos XXXIV–XXXVI. Seleções temporárias e sem aprovação autoral.</p>';
 }
 el.addEventListener("click",e=>{
   const section=e.target.closest("[data-topo-group]");
   if(section&&groupBy.has(section.dataset.topoGroup)){group=section.dataset.topoGroup;render();return}
   const pick=e.target.closest("[data-topo-choice]");
   if(pick){
     const id=pick.dataset.topoDecision,option=pick.dataset.topoChoice;
     if(!options.get(id)?.has(option))return;
     if(chosen.get(id)===option)chosen.delete(id);else chosen.set(id,option);
     render();return;
   }
   const clear=e.target.closest("[data-topo-reset]");
   if(clear){
     if(clear.dataset.topoReset==="all")chosen.clear();
     else chosen.delete(clear.dataset.topoReset);
     render();
   }
 });
 render();
 return {simulacoes:()=>data.decisoes.filter(d=>chosen.has(d.id)).map(d=>({questao:d.id,alternativa:chosen.get(d.id)}))};
}
