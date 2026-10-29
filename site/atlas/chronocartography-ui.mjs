/** Cronocartografia: cronologia interativa e papéis territoriais, nunca um mapa de domínio em escala. */
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export function initChronocartography(el,data){
 if(!el||!data?.eventos?.length)throw new Error("Cronocartografia indisponível");
 const phases=new Map(data.fases.map(x=>[x.id,x]));
 const events=new Map(data.eventos.map(x=>[x.id,x]));
 const originalEvents=new Map(data.eventos.map(x=>[x.cronologia_original.id,x]));
 const roles=new Map(data.papeis_territoriais.map(x=>[x.id,x.nome]));
 let tab="timeline",phase=data.fases[0].id,selected=data.eventos[0].id,sector="todos";
 const selectedPhase=()=>phases.get(phase);
 const currentEvents=()=>data.eventos.filter(x=>x.ref_fase===phase&&
    (sector==="todos"||x.setores.includes(sector)));
 const labelYear=(y)=>y===null?"Sem data de início documentada":y+" EC";

 function timeline(){
   const q=currentEvents();
   return '<p class="chrono-notice">Os acontecimentos de um mesmo período podem apontar para autoridades <strong>diferentes ou conflitantes</strong>. Marcadores por setor indicam referência histórica, nunca posse de todo o território.</p>'+
    '<div class="chrono-filter-line"><label>Setor citado <select data-chrono-sector>'+
      '<option value="todos">Todos os setores</option>'+
      [...new Set(data.eventos.flatMap(x=>x.setores))].map(s=>
        '<option value="'+esc(s)+'"'+(sector===s?" selected":"")+'>'+esc(s)+'</option>').join("")+
      '</select></label><small>Filtro de referências, não fronteira política.</small></div>'+
    '<div class="chrono-event-list">'+(q.length?q.map(e=>
     '<button type="button" class="chrono-event'+(selected===e.id?" active":"")+'" data-chrono-event="'+esc(e.id)+'">'+
       '<b>'+e.ano_ec+' EC</b><span>'+esc(e.titulo)+'</span>'+
       '<small>'+esc(e.setores.length?e.setores.join(" · "):"sem setor fixado")+'</small></button>').join(""):
     '<p class="chrono-empty">Nenhum evento do manuscrito cruza este período com o setor selecionado. Ausência de registro não prova ausência de habitantes ou governos.</p>')+
    '</div>';
 }
 function centers(){
   return '<p class="chrono-notice">As 14 esferas territoriais foram descritas na camada histórica como um <strong>panorama</strong>. O manuscrito não fornece uma data de início para cada uma. Por isso, elas não são aplicadas retroativamente ao período selecionado.</p>'+
    '<div class="chrono-centers">'+data.polos.map(x=>{
      const p=x.original;
      return '<article class="chrono-center"><small>'+esc(p.setor)+' · '+esc(p.forma.replaceAll("_"," "))+'</small>'+
      '<h4>'+esc(p.titulo)+'</h4><p>'+esc(p.descricao)+'</p>'+
      '<div class="chrono-center-footer"><span>'+esc(p.agente)+'</span><span>Período inicial: desconhecido</span></div>'+
      (x.ref_eventos_contextuais.length?
         '<div class="chrono-refs">Eventos relacionados, não datas de fundação: '+
          x.ref_eventos_contextuais.map(id=>{
           const e=originalEvents.get(id);
           return '<button type="button" data-chrono-event="'+esc(e.id)+'">'+e.ano_ec+' EC</button>';
          }).join(" ")+'</div>':
         '<div class="chrono-refs">Nenhum marco anual específico associado.</div>')+'</article>';
     }).join("")+'</div>';
 }
 function future(){
   return '<p class="chrono-notice">A página 11 do manuscrito define estes tópicos como <strong>futuros em aberto</strong>, não acontecimentos realizados. A cronologia não atribui resultados nem datas a eles.</p>'+
    '<div class="chrono-future">'+data.futuros_em_aberto.map(f=>
      '<article><small>Em aberto · Hack p. '+f.pagina+'</small><p>'+esc(f.pergunta)+'</p></article>').join("")+'</div>';
 }
 function inspect(){
   const e=events.get(selected);
   if(!e)return '<p>Selecione um evento.</p>';
   const phaseObj=phases.get(e.ref_fase);
   const local=Object.entries(e.leitura_por_setor);
   return '<div class="env-kicker">'+esc(phaseObj.titulo)+' · '+e.ano_ec+' EC</div>'+
    '<h4>'+esc(e.titulo)+'</h4>'+
    '<div class="env-subhead">Leitura histórica</div><p>'+esc(e.leitura_editorial)+'</p>'+
    '<div class="env-subhead">Setores citados e papéis distintos</div>'+
    (local.length?'<div class="chrono-roles">'+local.map(([s,r])=>
      '<div><b>'+esc(s)+'</b><small>'+esc(roles.get(r))+'</small></div>').join("")+'</div>':
      '<p>Não há setor geográfico confirmado para este evento. Não atribuir posição.</p>')+
    (e.ref_marco_fisico?'<div class="env-subhead">Marco físico relacionado</div><p>'+esc(e.ref_marco_fisico)+
      ' · referência anatômica, não coordenada.</p>':"")+
    '<div class="env-subhead">Limite cartográfico</div><p>Não é possível determinar a extensão contínua da autoridade, fronteiras ou trajetos militares com este registro.</p>'+
    (e.nota_documental?'<div class="env-subhead">Advertência da fonte</div><p>'+esc(e.nota_documental)+'</p>':"")+
    '<p class="env-citation">Hack p. '+esc(e.paginas.join(", "))+' · registro '+esc(e.cronologia_original.id)+'</p>';
 }
 function render(){
   const tabs=[["timeline","Linha do tempo"],["centers","14 centros de poder"],["future","Futuros em aberto"],["rules","Regras de interpretação"]];
   const phaseObj=selectedPhase();
   el.innerHTML='<div class="env-head"><div><div class="eyebrow">Ciclo XL · cronocartografia</div>'+
    '<h3>O poder através dos séculos</h3><p>Conquistas, ocupações e resistências ligadas à geografia de Golzdov — sem pintar fronteiras retrospectivas.</p></div>'+
    '<div class="env-metrics"><b>'+data.totais.eventos+'</b><span>marcos históricos</span></div></div>'+
    '<div class="chrono-stats"><span>'+data.totais.fases+' períodos de consulta</span><span>'+data.totais.polos+' esferas sem início datado</span>'+
    '<span>'+data.totais.futuros_em_aberto+' futuros em aberto</span><span>0 fronteiras inferidas</span></div>'+
    '<div class="env-tabs">'+tabs.map(([id,name])=>
      '<button type="button" class="env-tab'+(tab===id?" active":"")+'" data-chrono-tab="'+id+'">'+name+'</button>').join("")+'</div>'+
    (tab==="timeline"?
      '<div class="chrono-phases">'+data.fases.map(p=>
       '<button type="button" class="chrono-phase'+(phase===p.id?" active":"")+'" data-chrono-phase="'+esc(p.id)+'">'+
       '<small>'+p.inicio_ec+(p.inicio_ec===p.fim_ec?"":"–"+p.fim_ec)+' EC</small><b>'+esc(p.titulo)+'</b></button>').join("")+'</div>'+
       '<p class="chrono-phase-description">'+esc(phaseObj.leitura_editorial)+'</p>':"")+
    '<div class="env-layout"><div class="env-main">'+(tab==="timeline"?timeline():tab==="centers"?centers():tab==="future"?future():
      '<div class="chrono-rules"><p>'+esc(data.criterio)+'</p>'+
      data.restricoes.map(x=>'<div>'+esc(x)+'</div>').join("")+'</div>')+'</div>'+
    '<aside class="env-inspector">'+inspect()+'</aside></div>'+
    '<p class="env-foot">Recortes cronológicos de consulta: não são novos períodos canônicos. Eventos do Hack pp. 9–10, esferas do Ciclo XXXIII e futuros em aberto da p. 11.</p>';
 }
 el.addEventListener("click",event=>{
   const t=event.target.closest("[data-chrono-tab]");if(t){tab=t.dataset.chronoTab;render();return}
   const p=event.target.closest("[data-chrono-phase]");
   if(p&&phases.has(p.dataset.chronoPhase)){phase=p.dataset.chronoPhase;sector="todos";
     const first=data.eventos.find(x=>x.ref_fase===phase);if(first)selected=first.id;render();return}
   const e=event.target.closest("[data-chrono-event]");
   if(e&&events.has(e.dataset.chronoEvent)){selected=e.dataset.chronoEvent;phase=events.get(selected).ref_fase;
     if(tab==="centers")tab="timeline";sector="todos";render();return}
 });
 el.addEventListener("change",event=>{
   const target=event.target.closest("[data-chrono-sector]");if(!target)return;
   const allowed=new Set(data.eventos.flatMap(x=>x.setores));sector=target.value==="todos"||allowed.has(target.value)?target.value:"todos";
   const first=currentEvents()[0];if(first)selected=first.id;
   render();
 });
 render();
}
