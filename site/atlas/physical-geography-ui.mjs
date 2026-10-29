/**
 * Croqui conceitual: grupos cardeais não representam coordenadas nem escala.
 */
const esc=v=>String(v??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
const showDir={leste:"Extremo leste",oeste:"Extremo oeste",norte:"Norte",sul:"Além Sul", "sul-relativo":"Sul relativo", "norte-relativo":"Norte relativo",atravessa:"Eixo continental",nao_fixado:"Posição não determinada",alem_abismo:"Além do Abismo", "alem-mar":"Além do mar"};
export function initPhysicalGeography(root,data,onJump){
  if(!root||!data||typeof onJump!=="function")throw new Error("Painel físico não configurado");
  const points=new Map(data.pontos.map(p=>[p.id,p]));
  let view="direcoes",chosen="geo-xxxiv:cranio";
  const pairs=[
    ["norte","Norte","norte"],
    ["leste","Leste","leste"],
    ["oeste","Oeste","oeste"],
    ["sul","Sul e litoral","sul"]
  ];
  const get=(ids)=>data.pontos.filter(x=>ids.includes(x.orientacao));
  function pill(p){return '<button class="phys-place'+(p.id===chosen?" active":"")+'" type="button" data-phys="'+esc(p.id)+'">'+esc(p.titulo)+'</button>'}
  function detail(p){
    const edges=data.relacoes.filter(x=>x.de===p.id||x.para===p.id);
    const links=edges.map(e=>{
      const other=points.get(e.de===p.id?e.para:e.de);
      return '<button type="button" class="phys-edge" data-phys="'+esc(other.id)+'">'+
        '<span>'+esc(other.titulo)+'</span><small>'+esc(e.descricao)+
        ' · '+esc(e.estado==="revisao_autoral"?"revisão autoral":"fonte documentada")+'</small></button>';
    }).join("");
    return '<div class="phys-detail-head"><span class="phys-kicker">'+esc(p.tipo.replaceAll("_"," "))+
      ' · '+esc(showDir[p.orientacao])+'</span><h4>'+esc(p.titulo)+'</h4></div>'+
      '<p>'+esc(p.descricao)+'</p><p class="phys-source">Hack p. '+esc(p.paginas.join(", "))+
      ' · '+esc(p.estado.replaceAll("_"," "))+'</p>'+
      (p.lugar_id?'<button class="phys-jump" data-phys-go="'+esc(p.lugar_id)+'" type="button">Abrir este lugar na árvore ↗</button>':
        '<p class="phys-unknown">Este marco ainda não possui uma localidade individualizada no atlas.</p>')+
      '<div class="phys-minititle">Relações documentais</div>'+
      (links||'<p class="phys-unknown">Sem outra relação individual cadastrada neste nível.</p>');
  }
  function directions(){
    const cards=pairs.map(([id,title,dir])=>'<div class="phys-card"><div class="phys-card-title"><span>'+esc(title)+
      '</span><small>Direção documentada</small></div><div class="phys-list">'+get([dir]).map(pill).join("")+'</div></div>');
    const group1=get(["norte-relativo","sul-relativo","atravessa"]);
    const group2=get(["alem_abismo","alem-mar","nao_fixado"]);
    cards.push('<div class="phys-card phys-wide"><div class="phys-card-title"><span>Posições relativas e eixos</span>'+
      '<small>Não equivalem a coordenadas</small></div><div class="phys-list">'+group1.map(pill).join("")+'</div></div>');
    cards.push('<div class="phys-card phys-wide"><div class="phys-card-title"><span>Além dos limites e sem orientação cardinal</span>'+
      '<small>Não localizados por dedução</small></div><div class="phys-list">'+group2.map(pill).join("")+'</div></div>');
    return '<div class="phys-grid">'+cards.join("")+'</div>';
  }
  function anatomy(){
    const arr=data.pontos.filter(p=>p.tipo==="anatomia");
    return '<div class="phys-note">A sequência abaixo organiza referências anatômicas, <b>não</b> reproduz a forma ou a orientação real do esqueleto no mapa.</div>'+
      '<div class="phys-anatomy">'+arr.map((p,i)=>'<div class="phys-bone"><small>MARCO ANATÔMICO '+String(i+1).padStart(2,"0")+'</small>'+
      pill(p)+'<p>'+esc(p.descricao)+'</p></div>').join("")+'</div>';
  }
  function links(){
    return '<div class="phys-note">Cada relação informa seu tipo e a evidência textual. Relação entre locais <b>não implica estrada</b> nem permite medir distâncias.</div>'+
      '<div class="phys-relations">'+data.relacoes.map(e=>{
        const a=points.get(e.de),b=points.get(e.para);
        return '<div class="phys-relationship"><div><button data-phys="'+esc(a.id)+'">'+esc(a.titulo)+
          '</button><span> · '+esc(e.tipo.replaceAll("_"," "))+' · </span><button data-phys="'+esc(b.id)+'">'+esc(b.titulo)+
          '</button></div><p>'+esc(e.descricao)+'</p><small>Hack p. '+esc(e.paginas.join(", "))+
          ' · '+esc(e.estado==="revisao_autoral"?"indeterminado":"documentado sem geometria")+'</small></div>';
      }).join("")+'</div>';
  }
  function unanswered(){
    return '<div class="phys-note">Perguntas que impedem preencher a cartografia com certezas inventadas. Permanecem pendentes de decisão autoral.</div>'+
      '<div class="phys-questions">'+data.questoes.map((q,i)=>'<div class="phys-question"><small>QUESTÃO '+(i+1)+
      ' · Hack p. '+esc(q.paginas.join(", "))+'</small><strong>'+esc(q.pergunta)+'</strong><p>'+
      esc(q.limite)+'</p></div>').join("")+'</div>';
  }
  function render(){
    const p=points.get(chosen)||data.pontos[0];
    root.innerHTML='<div class="phys-head"><div><div class="eyebrow">Ciclo XXXIV · corpo continental</div>'+
      '<h3>Geografia física de Golzdov</h3><p>Orientações, anatomia e grandes marcos. Um esquema de evidências, não um mapa em escala.</p></div>'+
      '<div class="phys-count"><strong>'+data.totais.marcos+'</strong><span>marcos físicos</span></div></div>'+
      '<div class="phys-tabs" role="group" aria-label="Camadas da geografia física">'+
      [["direcoes","Orientação continental"],["anatomia","Anatomia de Golzdov"],["relacoes","Relações espaciais"],["lacunas","Questões abertas"]].map(([key,name])=>
        '<button class="phys-tab'+(view===key?" active":"")+'" type="button" data-phys-tab="'+key+
        '" aria-pressed="'+(view===key)+'">'+esc(name)+'</button>').join("")+'</div>'+
      '<div class="phys-main"><div class="phys-board">'+(
        view==="direcoes"?directions():view==="anatomia"?anatomy():view==="relacoes"?links():unanswered()
      )+'</div><aside class="phys-inspector">'+detail(p)+'</aside></div>'+
      '<div class="phys-foot">A posição dos cartões é apenas editorial. Não há escala, coordenadas, distância, curso navegável completo ou passagem implícita entre setores.</div>';
  }
  root.addEventListener("click",e=>{
    const tab=e.target.closest("[data-phys-tab]");
    if(tab){view=tab.dataset.physTab;render();return}
    const sel=e.target.closest("[data-phys]");
    if(sel){chosen=sel.dataset.phys;render();return}
    const jump=e.target.closest("[data-phys-go]");
    if(jump)onJump(jump.dataset.physGo);
  });
  render();
  return {showPoint(id){if(points.has(id)){chosen=id;render()}}};
}
