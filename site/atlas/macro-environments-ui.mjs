/** Interação de habitats na escala macro. Painel sem coordenadas geográficas. */
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export function initMacroEnvironments(el,data,openPlace){
 if(!el||!data||typeof openPlace!=="function")throw new Error("Ambientes não inicializados");
 let view="familias",family="todas",chosen=data.ambientes[0]?.id;
 const byId=new Map(data.ambientes.map(x=>[x.id,x]));
 const counts=(f)=>data.ambientes.filter(x=>x.familia===f).length;
 function detail(){
  const h=byId.get(chosen);
  if(!h)return '<p>Selecione um ambiente.</p>';
  const links=data.relacoes.filter(e=>e.de===h.id||e.para===h.id);
  let out='<div class="env-kicker">'+esc(h.nome_familia)+' · '+esc(h.estado.replaceAll("_"," "))+'</div>'+
   '<h4>'+esc(h.nome)+'</h4><p>'+esc(h.descricao)+'</p><p class="env-citation">Manuscrito p. '+esc(h.paginas.join(", "))+'</p>'+
   '<p class="env-citation">Setor: '+esc(h.setores.join(", ")||"sem localização individualizada")+'</p>';
  if(h.lugar_id)out+='<button class="env-action" type="button" data-env-jump="'+esc(h.lugar_id)+'">Abrir lugar na árvore ↗</button>';
  else out+='<p class="env-dim">Referência regional/transversal; não há assentamento a abrir.</p>';
  if(links.length)out+='<div class="env-subhead">Relações com outros ambientes</div>'+links.map(r=>{
   const peer=byId.get(r.de===h.id?r.para:r.de);
   return '<button type="button" class="env-link" data-env-id="'+esc(peer.id)+'"><b>'+esc(peer.nome)+'</b>'+
   '<small>'+esc(r.descricao)+'</small></button>';
  }).join("");
  return out;
 }
 function cards(){
  const current=data.ambientes.filter(x=>family==="todas"||x.familia===family);
  return '<div class="env-card-grid">'+current.map(h=>'<button type="button" class="env-card'+
   (h.id===chosen?" current":"")+'" data-env-id="'+esc(h.id)+'">'+
   '<span>'+esc(h.nome_familia)+'</span><b>'+esc(h.nome)+'</b><small>p. '+esc(h.paginas.join(", "))+
   ' · '+(h.setores.length?esc(h.setores.join(", ")):"sem setor atribuído")+'</small></button>').join("")+'</div>';
 }
 function matrix(){
  return '<p class="env-explain">Esta matriz indica apenas onde a fonte descreve ambientes, não a quantidade real de biomas no mundo. Setores sem ambiente registrado continuam na árvore.</p>'+
   '<div class="env-matrix">'+data.cobertura.map(c=>'<div class="env-matrix-row"><strong>'+esc(c.nome)+'</strong>'+
   '<span>'+c.ambientes+' ambientes referenciados</span><small>'+esc(c.familias.map(id=>data.familias.find(f=>f.id===id)?.nome).join(" · ")||"Paisagem não caracterizada")+
   '</small><small>'+c.lacunas+' perguntas abertas</small></div>').join("")+'</div>';
 }
 function edges(){
  return '<p class="env-explain">São relações entre grandes paisagens. A ligação não autoriza desenhar passagem, distância, limite ou estrada.</p>'+
   '<div class="env-relations">'+data.relacoes.map(x=>'<div class="env-relation"><div>'+
   '<button data-env-id="'+esc(x.de)+'">'+esc(byId.get(x.de).nome)+'</button>'+
   '<span> '+esc(x.tipo.replaceAll("_"," "))+' </span>'+
   '<button data-env-id="'+esc(x.para)+'">'+esc(byId.get(x.para).nome)+'</button></div>'+
   '<p>'+esc(x.descricao)+'</p><small>Manuscrito p. '+esc(x.paginas.join(", "))+
   (x.estado==="fronteira_sem_geometria"?" · fronteira móvel":" · sem geometria")+'</small></div>').join("")+'</div>';
 }
 function gaps(){
  return '<p class="env-explain">Uma lacuna não é convite para preencher com suposições. São questões para futura decisão autoral.</p>'+
   '<div class="env-gaps">'+data.lacunas.map(q=>'<div class="env-gap"><span>Manuscrito p. '+esc(q.paginas.join(", "))+
   '</span><b>'+esc(q.tema)+'</b><p>'+esc(q.limite)+'</p></div>').join("")+'</div>';
 }
 function render(){
  if(family!=="todas"&&!data.ambientes.some(h=>h.id===chosen&&h.familia===family)){
    chosen=data.ambientes.find(h=>h.familia===family)?.id||data.ambientes[0].id;
  }
  el.innerHTML='<div class="env-head"><div><div class="eyebrow">Ciclo XXXV · sistemas naturais</div>'+
   '<h3>Grandes ambientes da Carcaça</h3><p>Florestas, montanhas, pradarias, cavernas, rios, arquipélagos e mares — antes das cidades e criaturas individuais.</p></div>'+
   '<div class="env-metrics"><b>'+data.totais.ambientes+'</b><span>ambientes de referência</span></div></div>'+
   '<div class="env-tabs">'+[["familias","Famílias de ambientes"],["setores","Cobertura por região"],["relacoes","Relações"],["lacunas","Questões pendentes"]].map(([v,l])=>
    '<button type="button" data-env-view="'+v+'" class="env-tab'+(view===v?" active":"")+'">'+l+'</button>').join("")+'</div>'+
   (view==="familias"?'<div class="env-filters">'+['<button data-env-family="todas" class="env-filter'+(family==="todas"?" on":"")+'">Todas ('+data.totais.ambientes+')</button>'].concat(data.familias.map(f=>
     '<button data-env-family="'+esc(f.id)+'" class="env-filter'+(family===f.id?" on":"")+'">'+esc(f.nome)+' ('+counts(f.id)+')</button>')).join("")+'</div>':"")+
   '<div class="env-layout"><div class="env-main">'+(view==="familias"?cards():view==="setores"?matrix():view==="relacoes"?edges():gaps())+
   '</div><aside class="env-inspector">'+detail()+'</aside></div>'+
   '<p class="env-foot">Índice macroambiental editorial: sem coordenadas, extensão, clima inferido, fronteira fixa nem novos assentamentos aprovados.</p>';
 }
 el.addEventListener("click",e=>{
  const v=e.target.closest("[data-env-view]");if(v){view=v.dataset.envView;render();return}
  const f=e.target.closest("[data-env-family]");if(f){family=f.dataset.envFamily;render();return}
  const sel=e.target.closest("[data-env-id]");if(sel&&byId.has(sel.dataset.envId)){chosen=sel.dataset.envId;render();return}
  const jump=e.target.closest("[data-env-jump]");if(jump)openPlace(jump.dataset.envJump);
 });
 render();
 return {select(id){if(byId.has(id)){chosen=id;view="familias";family="todas";render()}}};
}
