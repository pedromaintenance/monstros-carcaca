/** Painel qualitativo de interfaces. Não desenha fronteiras nem rotas no mapa. */
const escapeHTML=value=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const nomes={
 documentado:"Relação documentada",documentado_sem_contato_fisico:"Relação sem contato físico confirmado",
 movel:"Limite móvel",historico_sem_passagem:"Ligação histórica, passagem desconhecida",
 topologia_em_revisao:"Topologia contestada",em_aberto:"Relação física em aberto"
};
export function initContinentalInterfaces(el,atlas){
 if(!el||!atlas?.interfaces)throw new Error("Interfaces continentais indisponíveis");
 let mode="interfaces",filtro="todos",selected=atlas.interfaces[0].id;
 const records=new Map(atlas.interfaces.map(x=>[x.id,x]));
 const list=()=>atlas.interfaces.filter(x=>filtro==="todos"||x.estado===filtro);
 function details(){
  const p=records.get(selected);
  if(!p)return "<p>Selecione uma interface continental.</p>";
  return '<div class="env-kicker">'+escapeHTML(nomes[p.estado])+'</div>'+
   '<h4>'+escapeHTML(p.nome)+'</h4>'+
   '<div class="env-subhead">O que está documentado</div><p>'+escapeHTML(p.evidencia)+'</p>'+
   '<div class="env-subhead">Leitura material — proposta de análise</div><p>'+escapeHTML(p.leitura_analitica)+'</p>'+
   '<div class="env-subhead">O que NÃO está estabelecido</div><p>'+escapeHTML(p.limite_de_inferencia)+'</p>'+
   '<p class="env-citation">Hack p. '+escapeHTML(p.paginas.join(", "))+' · Setores: '+escapeHTML(p.setores.join(" / "))+'</p>'+
   '<p class="env-citation">Vínculos auditáveis: '+escapeHTML([p.ref_macro,p.ref_ambiental,p.lacuna_id].filter(Boolean).join(" · ")||"lacuna explícita")+'</p>';
 }
 function interfaceCards(){
  const xs=list();
  return '<p class="env-explain">Contatos naturais, mudanças de poder e relações entre povos não equivalem a estradas ou fronteiras cartografadas. Cada registro separa evidência, interpretação e limite.</p>'+
  '<div class="env-card-grid">'+xs.map(x=>
   '<button type="button" class="env-card'+(selected===x.id?" current":"")+'" data-interface-id="'+escapeHTML(x.id)+'">'+
   '<span>'+escapeHTML(nomes[x.estado])+'</span><b>'+escapeHTML(x.nome)+'</b><small>'+
   escapeHTML(x.setores.join(" / "))+' · p. '+escapeHTML(x.paginas.join(", "))+'</small></button>').join("")+
  (xs.length?"":'<p>Sem interfaces nessa classificação.</p>')+'</div>';
 }
 function questions(){
  return '<p class="env-explain">As decisões de autoria abaixo impedem o desenho de uma fronteira precisa. Permanecem abertas — nenhuma foi resolvida neste ciclo.</p>'+
   '<div class="env-gaps">'+atlas.questoes.map(q=>'<div class="env-gap"><span>'+
   escapeHTML(q.setores.join(" / "))+' · aguarda decisão autoral</span><b>'+escapeHTML(q.pergunta)+
   '</b><p>'+escapeHTML(q.ref_lacuna||"Contradição entre registros históricos; ver camada de geografia física.")+'</p></div>').join("")+'</div>';
 }
 function render(){
  const statuses=["todos",...Object.keys(nomes).filter(id=>atlas.interfaces.some(i=>i.estado===id))];
  if(mode==="interfaces"&&!list().some(x=>x.id===selected))selected=list()[0]?.id||selected;
  el.innerHTML='<div class="env-head"><div><div class="eyebrow">Ciclo XXXVI · limites e contatos</div>'+
   '<h3>Interfaces do continente</h3><p>O que conecta, separa ou relaciona as grandes regiões — e quais linhas ainda não podemos desenhar.</p></div>'+
   '<div class="env-metrics"><b>'+atlas.totais.interfaces+'</b><span>interfaces auditadas</span></div></div>'+
   '<div class="env-tabs">'+[["interfaces","Relações continentais"],["questoes","Decisões para o mapa"]].map(([id,label])=>
   '<button type="button" class="env-tab'+(mode===id?" active":"")+'" data-interface-mode="'+id+'">'+label+'</button>').join("")+'</div>'+
   (mode==="interfaces"?'<div class="env-filters">'+statuses.map(s=>
    '<button type="button" class="env-filter'+(filtro===s?" on":"")+'" data-interface-filter="'+s+'">'+
    escapeHTML(s==="todos"?"Todas":nomes[s])+' ('+(s==="todos"?atlas.totais.interfaces:atlas.interfaces.filter(i=>i.estado===s).length)+')</button>').join("")+'</div>':"")+
   '<div class="env-layout"><div class="env-main">'+(mode==="interfaces"?interfaceCards():questions())+'</div>'+
   '<aside class="env-inspector">'+details()+'</aside></div>'+
   '<p class="env-foot">Camada qualitativa não canônica: nenhuma linha, coordenada, rota, divisa ou travessia foi declarada. As leituras materiais são hipóteses editoriais.</p>';
 }
 el.addEventListener("click",event=>{
  const tab=event.target.closest("[data-interface-mode]");
  if(tab){mode=tab.dataset.interfaceMode;render();return}
  const filter=event.target.closest("[data-interface-filter]");
  if(filter){filtro=filter.dataset.interfaceFilter;render();return}
  const pick=event.target.closest("[data-interface-id]");
  if(pick&&records.has(pick.dataset.interfaceId)){selected=pick.dataset.interfaceId;render()}
 });
 render();
}
