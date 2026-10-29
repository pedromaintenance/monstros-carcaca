/**
 * Interface estática das redes macro e cronologia da Carcaça.
 * Leituras territoriais não são mapas topográficos ou fronteiras.
 */
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const sourcePages=x=>"Hack p. "+x.paginas.join(", ");
const label=x=>String(x||"").replaceAll("_"," ");
export function initMacroLayers(container,macro,networkAtlas){
  if(!container||!macro||!networkAtlas)throw new Error("Interface macro sem dados");
  let chosen=networkAtlas.redes[0]?.id;
  let upto=999;
  const titles=new Map(macro.setores.map(s=>[s.id,s.titulo]));
  const selected=()=>networkAtlas.redes.find(n=>n.id===chosen);
  function eventHTML(e){
    return '<article class="time-event"><span class="time-year">'+e.ano_ec+' EC</span><div><strong>'+
      esc(e.titulo)+'</strong><small>'+esc(sourcePages(e))+' · '+
      (e.setores.length?esc(e.setores.map(s=>titles.get(s)||s).join(" / ")):"escala continental ou posição não fixada")+
      '</small>'+(e.nota?'<p>'+esc(e.nota)+'</p>':"")+'</div></article>';
  }
  function eventsHTML(){
    const net=selected();
    const events=networkAtlas.cronologia.filter(e=>e.ano_ec<=upto&&
      (!e.setores.length||e.setores.some(s=>net.setores.includes(s))));
    return events.map(eventHTML).join("")||'<p class="layer-muted">Nenhum evento desta rede até o ano selecionado.</p>';
  }
  function render(){
    const net=selected();if(!net){container.textContent="Nenhuma rede disponível.";return}
    const spheres=networkAtlas.esferas.filter(e=>net.setores.includes(e.setor));
    const open=networkAtlas.lacunas_estruturais.filter(e=>e.setores.some(s=>net.setores.includes(s)));
    let html='<div class="layer-top"><div><div class="eyebrow">Camadas continentais</div>'+
      '<h3>Redes de influência e circulação</h3><p>Relações documentadas, sem presumir fronteiras ou estradas. Selecione uma rede para examinar os setores envolvidos.</p>'+
      '</div><span class="layer-tag">Sete leituras complementares</span></div>';
    html+='<div class="layer-tabs" role="group" aria-label="Selecionar rede continental">'+
      networkAtlas.redes.map(n=>'<button type="button" class="layer-chip '+(n.id===chosen?"on":"")+
      '" data-layer="'+esc(n.id)+'" aria-pressed="'+String(n.id===chosen)+'">'+esc(n.titulo)+'</button>').join("")+'</div>';
    html+='<div class="layer-layout"><div class="layer-main"><h4>'+esc(net.titulo)+'</h4><p>'+esc(net.descricao)+'</p>'+
      '<div class="layer-small"><span>'+net.setores.length+' setores</span><span>'+net.relacoes.length+' relações</span><span>'+esc(sourcePages(net))+'</span></div>'+
      '<div class="layer-subheading">Setores dessa rede</div><div class="layer-regions">'+
      net.setores.map(id=>'<span class="layer-region">'+esc(titles.get(id)||id)+'</span>').join("")+'</div>'+
      '<div class="layer-subheading">Relações de fonte</div>';
    html+=net.relacoes.length?net.relacoes.map(e=>'<div class="layer-relation"><strong>'+
      esc(titles.get(e.de))+' · '+esc(titles.get(e.para))+'</strong><small>'+esc(label(e.tipo))+
      ' · '+esc(e.estado)+' · '+esc(sourcePages(e))+'</small><p>'+esc(e.descricao)+'</p></div>').join(""):
      '<p class="layer-muted">Presenças regionais não comprovam ligação física entre todos os setores.</p>';
    html+='<p class="layer-warning">'+esc(net.limite)+'</p></div><div class="layer-secondary">'+
      '<div class="layer-subheading">Esferas e centros de poder ('+spheres.length+')</div><div class="layer-scroll">';
    html+=spheres.map(e=>'<div class="sphere"><strong>'+esc(e.titulo)+'</strong><span>'+
      esc(e.agente)+'</span><small>'+esc(titles.get(e.setor))+' · '+esc(sourcePages(e))+
      '</small><p>'+esc(e.descricao)+'</p></div>').join("")||
      '<p class="layer-muted">Nenhuma esfera individualizada para esta rede.</p>';
    html+='</div><div class="layer-subheading">Dúvidas de autoria relacionadas ('+open.length+')</div><div class="layer-scroll">';
    html+=open.map(e=>'<div class="question"><strong>'+esc(e.pergunta)+'</strong><p>'+esc(e.contexto)+
      '</p><small>'+esc(sourcePages(e))+' · não resolvida</small></div>').join("")||
      '<p class="layer-muted">Sem questão adicional específica desta rede.</p>';
    html+='</div></div></div>';
    html+='<section class="time-rail"><div class="time-head"><div><div class="eyebrow">História documentada</div>'+
      '<h3>Cronologia territorial</h3><p>Marcos do manuscrito relacionados aos setores selecionados. Não é mapa político ano a ano.</p></div>'+
      '<div class="time-lim"><label for="atlasTime">Mostrar até <output id="atlasTimeOut">'+upto+
      ' EC</output></label><input type="range" id="atlasTime" min="0" max="999" step="1" value="'+upto+
      '"></div></div><div class="time-events">'+eventsHTML()+'</div></section>';
    container.innerHTML=html;
  }
  container.addEventListener("click",e=>{
    const el=e.target.closest("[data-layer]");
    if(el&&networkAtlas.redes.some(n=>n.id===el.dataset.layer)){chosen=el.dataset.layer;render()}
  });
  container.addEventListener("input",e=>{
    if(e.target.id!=="atlasTime")return;
    const value=Number(e.target.value);
    if(!Number.isInteger(value)||value<0||value>999)return;
    upto=value;
    const out=container.querySelector("#atlasTimeOut");if(out)out.textContent=upto+" EC";
    const list=container.querySelector(".time-events");if(list)list.innerHTML=eventsHTML();
  });
  render();
  return {setNetwork(id){if(networkAtlas.redes.some(n=>n.id===id)){chosen=id;render()}},
    getCurrent:()=>chosen};
}
