/** Consulta à hidrografia macro. Um vínculo documental não vira trajeto no mapa. */
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const stateLabel={documentado:"Documentado",documentado_com_limite:"Documentado com limite",
 documentado_variavel:"Limite variável",regime_indeterminado:"Regime hídrico desconhecido"};
const groupLabel={interior:"Rio e Abismo",sul:"Terras e água para cultivo",oceano:"Mares e profundezas",potencial:"Relevo com água não demonstrada"};
const category=u=>["fluvial","queda","insular_fluvial"].includes(u.tipo)?"interior":
 ["marinho","fronteira_movel"].includes(u.tipo)?"oceano":
 ["relevo_potencial","subsolo_potencial"].includes(u.tipo)?"potencial":"sul";
export function initContinentalHydrology(el,data,openPlace){
 if(!el||!data?.unidades?.length||typeof openPlace!=="function")
   throw new Error("Hidrografia continental indisponível");
 const byId=new Map(data.unidades.map(x=>[x.id,x]));
 const questionByUnit=new Map(data.unidades.map(x=>[x.id,data.lacunas.filter(q=>q.ref_dominio===x.id)]));
 let tab="dominios",group="todos",selected=data.unidades[0].id;
 const filtered=()=>data.unidades.filter(u=>group==="todos"||category(u)===group);
 function inspect(){
   const u=byId.get(selected);
   if(!u)return '<p>Selecione um domínio hídrico.</p>';
   const links=data.vinculos.filter(r=>r.de===u.id||r.para===u.id);
   const gaps=questionByUnit.get(u.id)||[];
   let html='<div class="env-kicker">'+esc(stateLabel[u.estado])+' · '+esc(u.tipo.replaceAll("_"," "))+'</div>'+
    '<h4>'+esc(u.nome)+'</h4>'+
    '<div class="env-subhead">Evidência do manuscrito</div><p>'+esc(u.documentado)+'</p>'+
    '<div class="env-subhead">Ainda desconhecido</div><p>'+esc(u.desconhecido)+'</p>'+
    '<div class="env-subhead">Não inferir</div><p>'+esc(u.nao_inferir)+'</p>'+
    '<p class="env-citation">Hack p. '+esc(u.paginas.join(", "))+' · setor '+esc(u.setores.join(" / "))+'</p>'+
    '<p class="env-citation">Âncoras: '+esc(u.ref_fisica)+' / '+esc(u.ref_ambiente)+'</p>';
   if(links.length)html+='<div class="env-subhead">Relações com outros ambientes</div>'+
     links.map(r=>{const peer=byId.get(r.de===u.id?r.para:r.de);
       return '<button type="button" class="env-link" data-hydro-unit="'+esc(peer.id)+'"><b>'+esc(peer.nome)+'</b>'+
        '<small>'+esc(r.documentado)+'</small></button>'}).join("");
   if(gaps.length)html+='<div class="env-subhead">Perguntas específicas</div>'+
     gaps.map(q=>'<p class="hydro-mini-gap">'+esc(q.pergunta)+'</p>').join("");
   const place=u.ref_fisica==="geo-xxxiv:rio"? "lugar-visual:rio-ancestral":null;
   if(place)html+='<button type="button" class="env-action" data-hydro-place="'+place+'">Abrir Rio Ancestral na árvore</button>';
   return html;
 }
 function domains(){
   return '<p class="env-explain">Os domínios são recortes de leitura hidrológica, não novas bacias ou corpos d’água no cânone. Se um regime aparece como desconhecido, o manuscrito não fornece dados suficientes.</p>'+
    '<div class="hydro-cards">'+filtered().map(u=>'<button type="button" class="hydro-card'+(selected===u.id?" current":"")+'" data-hydro-unit="'+esc(u.id)+'">'+
     '<span>'+esc(groupLabel[category(u)])+' · '+esc(stateLabel[u.estado])+'</span>'+
     '<b>'+esc(u.nome)+'</b><small>Hack p. '+esc(u.paginas.join(", "))+' · '+esc(u.setores.join(", "))+'</small></button>').join("")+'</div>';
 }
 function links(){
   return '<p class="env-explain">As seis relações são evidências documentais e rituais, não linhas de drenagem nem rotas fluviais construídas por suposição.</p>'+
    '<div class="hydro-links">'+data.vinculos.map(r=>'<article class="hydro-link"><small>'+esc(r.tipo.replaceAll("_"," "))+' · Hack p. '+esc(r.paginas.join(", "))+'</small>'+
     '<div><button type="button" data-hydro-unit="'+esc(r.de)+'">'+esc(byId.get(r.de).nome)+'</button> <span>↔</span> '+
     '<button type="button" data-hydro-unit="'+esc(r.para)+'">'+esc(byId.get(r.para).nome)+'</button></div>'+
     '<p>'+esc(r.documentado)+'</p></article>').join("")+'</div>';
 }
 function gaps(){
   return '<p class="env-explain">Estas questões são tarefas de cartografia e worldbuilding, não convites para assumir um rio ou um aquífero que o texto não descreveu.</p>'+
    '<div class="hydro-gaps">'+data.lacunas.map(q=>'<article class="hydro-gap"><small>Pendente · Hack p. '+esc(q.paginas.join(", "))+'</small>'+
    '<b>'+esc(q.pergunta)+'</b><button type="button" data-hydro-unit="'+esc(q.ref_dominio)+'">Ver domínio relacionado</button></article>').join("")+'</div>';
 }
 function rules(){
   return '<div class="hydro-rules"><p class="env-explain">'+esc(data.principio)+'</p>'+
    data.invariantes.map(s=>'<div class="hydro-rule">'+esc(s)+'</div>').join("")+'</div>';
 }
 function render(){
   const tabs=[["dominios","Ambientes e usos da água"],["vinculos","Relações comprovadas"],["lacunas","12 questões abertas"],["regras","Regras para o mapa"]];
   el.innerHTML='<div class="env-head"><div><div class="eyebrow">Ciclo XXXIX · hidrografia continental</div>'+
    '<h3>Águas de Golzdov</h3><p>Do Rio Ancestral ao Mar de Sangue: água, relevo, cultivo e poder sem inventar bacias hidrográficas.</p></div>'+
    '<div class="env-metrics"><b>'+data.totais.unidades+'</b><span>domínios auditados</span></div></div>'+
    '<div class="hydro-counts"><span>'+data.totais.vinculos+' relações</span><span>'+data.totais.lacunas+
    ' lacunas</span><span>'+data.totais.comRegimeIndeterminado+' regimes desconhecidos</span><span>0 nascentes localizadas</span></div>'+
    '<div class="env-tabs">'+tabs.map(([v,t])=>'<button type="button" class="env-tab'+(tab===v?" active":"")+'" data-hydro-tab="'+v+'">'+t+'</button>').join("")+'</div>'+
    (tab==="dominios"?'<div class="env-filters">'+[["todos","Todos"],...Object.entries(groupLabel)].map(([id,name])=>
       '<button type="button" class="env-filter'+(group===id?" on":"")+'" data-hydro-group="'+id+'">'+esc(name)+'</button>').join("")+'</div>':"")+
    '<div class="env-layout"><div class="env-main">'+(tab==="dominios"?domains():tab==="vinculos"?links():tab==="lacunas"?gaps():rules())+
    '</div><aside class="env-inspector">'+inspect()+'</aside></div>'+
    '<p class="env-foot">Proveniência: capítulo I do Hack e camadas XXXIV–XXXVIII. Sem afluentes, cabeceiras, potabilidade geral, limites ou vazões inventados.</p>';
 }
 el.addEventListener("click",event=>{
   const t=event.target.closest("[data-hydro-tab]");
   if(t){tab=t.dataset.hydroTab;render();return}
   const g=event.target.closest("[data-hydro-group]");
   if(g){group=g.dataset.hydroGroup;const first=filtered()[0];if(first&&!filtered().some(x=>x.id===selected))selected=first.id;render();return}
   const u=event.target.closest("[data-hydro-unit]");
   if(u&&byId.has(u.dataset.hydroUnit)){selected=u.dataset.hydroUnit;group="todos";render();return}
   const p=event.target.closest("[data-hydro-place]");if(p)openPlace(p.dataset.hydroPlace);
 });
 render();
}
