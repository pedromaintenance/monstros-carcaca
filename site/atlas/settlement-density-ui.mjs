/** Auditoria XLVIII: interface de cobertura, diversidade textual e riscos de cânone. */
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const titleCase=x=>String(x).replaceAll("_"," ");
export function initSettlementDensityAudit(el,model){
 if(!el||model?.contagens?.comunidades_4_lotes!==82||!model.frentes?.length)
   throw Error("Auditoria continental indisponível");
 let tab="matriz",selected="frente:macro:costa",group="todas";
 const frame=()=>model.frentes.find(x=>x.id===selected)||model.frentes[0];
 function table(){
   const rows=model.frentes.filter(x=>group==="todas"||
     group==="povoamentos"&&x.unidade==="assentamentos"||
     group==="ilhas"&&x.unidade==="ilhas");
   return '<label class="density-filter">Unidade de análise <select data-density-filter>'+
     [['todas','Todas as frentes'],['povoamentos','Frentes de assentamentos'],['ilhas','Ilhas geográficas']].map(([id,label])=>
     '<option value="'+id+'"'+(id===group?' selected':'')+'>'+label+'</option>').join("")+'</select></label>'+
     '<p class="density-explain">São quantidades de <strong>propostas não aprovadas</strong>. Não representam cidades existentes nem porcentagem de conclusão. Ilhas são unidades físicas, não assentamentos.</p>'+
     '<div class="density-matrix">'+rows.map(f=>'<button type="button" data-density-front="'+esc(f.id)+
     '" class="density-front'+(f.id===selected?' active':'')+'">'+
     '<b>'+esc(f.nome)+'</b><span>'+esc(f.unidade==="ilhas"?"Ilhas físicas":"Assentamentos")+
     ' · horizonte flexível '+f.referencia[0]+'–'+f.referencia[1]+'</span>'+
     '<div><strong>'+esc(f.unidade==="ilhas"?f.ilhas_fisicas_propostas:f.propostas)+'</strong>'+
     '<small>propostas · '+f.habitats+' habitats separados</small></div></button>').join("")+'</div>';
 }
 function risk(){
   const f=frame();
   return '<div class="density-detail"><div class="env-kicker">Frente editorial · nenhum povoado aprovado</div>'+
      '<h4>'+esc(f.nome)+'</h4>'+
      '<div class="env-subhead">Situação das fontes</div><p>'+esc(f.aviso_documental)+'</p>'+
      '<div class="env-subhead">Ecologia e viabilidade</div><p>'+esc(f.lacuna_ecologica)+'</p>'+
      '<div class="env-subhead">Risco de repetição</div><p>'+esc(f.risco_de_repeticao)+'</p>'+
      '<div class="env-subhead">Próxima ação</div><p>'+esc(titleCase(f.proxima_acao))+'</p>'+
      '<p>Menções a famílias de povos: '+f.diversidade_mencoes.length+
      ' categorias lexicais · '+f.governo_colegiado_mencoes+' comunidades mencionam conselho, assembleia ou colegiado.</p>'+
      (f.id==="frente:macro:costa"?'<p class="density-critical">Costa: 7 comunidades propostas em ilhas e somente 1 comunidade costeira não insular, cuja posição continental NÃO está verificada.</p>':'')+
      (f.id==="frente:macro:ilhas"?'<p>Dez ilhas físicas propostas; quatro ainda sem comunidade associada. Nenhuma ilha individual foi aprovada.</p>':'')+
      (f.id==="frente:macro:submersos"?'<p>7 comunidades rubras e 7 em águas azuis, contando os quatro lotes; a fronteira entre os mares é móvel.</p>':'')+
      '<p class="env-citation">Nenhuma rota, acesso, topologia ou capacidade de suporte foi homologada a partir destas propostas.</p></div>';
 }
 function diversity(){
   const f=frame(),rows=model.comunidades.filter(x=>x.frente_id===f.id);
   const counts=f.diversidade_mencoes.map(tag=>({tag,count:rows.filter(x=>x.tags_de_mencao.includes(tag)).length})).sort((a,b)=>b.count-a.count);
   return '<h4>Menções aos povos em '+esc(f.nome)+'</h4>'+
    '<p class="density-explain">Estas categorias são extraídas das descrições propostas. Um povoado pode mencionar diversos povos; não é contagem de espécies, indivíduos ou povos canônicos.</p>'+
    (counts.length?'<div class="density-mentions">'+counts.map(x=>'<div><b>'+esc(x.tag)+'</b><span>'+x.count+' menções em propostas</span></div>').join("")+'</div>':
    '<p>Esta frente acompanha ilhas físicas, não comunidades individuais. O povoamento insular está registrado na frente Costa.</p>')+
    '<h4>Exemplos de comunidades propostas</h4><div class="density-example-list">'+rows.slice(0,12).map(x=>
     '<div><b>'+esc(x.nome)+'</b><span>'+esc(x.habitantes)+'</span><small>'+esc(x.lote)+' · '+esc(titleCase(x.subzona))+'</small></div>').join("")+'</div>';
 }
 function openGaps(){
   return '<h4>Regiões sem referência numérica autoral</h4>'+
     '<p class="density-explain">Zero propostas nestes grupos não significa ausência de população no cenário. Eles não podem ser avaliados por metas inventadas.</p>'+
     '<div class="density-gap-list">'+model.focos_sem_meta.map(x=>'<article><b>'+esc(x.nome)+'</b><p>'+esc(x.observacao)+'</p></article>').join("")+'</div>'+
     '<h4>Prioridades para aprofundar a malha, não para preencher números</h4>'+
     model.prioridades.map((x,i)=>'<p class="density-priority"><strong>'+String(i+1)+'.</strong> '+esc(x)+'</p>').join("")+
     '<h4>Portões de qualidade antes da canonização</h4>'+
     model.qualidade.map(x=>'<p class="density-rule"><b>'+esc(x.nome)+': </b>'+esc(x.regra)+'</p>').join("");
 }
 function source(){
   return '<h4>Proveniência e contagens incompatíveis</h4>'+
    '<p class="density-explain">O inventário inicial contém três registros formais: Portomonte e dois conjuntos coletivos que precisam de individualização. Não devem ser somados às 82 propostas sem reconciliação por identidade.</p>'+
    '<div class="density-source-stats">'+Object.entries(model.contagens).map(([key,value])=>
      '<div><b>'+value+'</b><span>'+esc(titleCase(key))+'</span></div>').join("")+'</div>'+
    '<p>'+esc(model.nota_epistemica)+'</p><p>'+esc(model.politica_numerica)+'</p>'+
    '<h4>Pendências sistêmicas</h4>'+
    '<p>Governos com vocabulário colegiado: '+model.indicadores.mencoes_de_governo_colegiado+' de '+model.contagens.comunidades_4_lotes+' propostas. É um indicador de possível repetição autoral, não um problema das sociedades representadas.</p>'+
    '<p>Descrições sociais preenchidas: '+model.indicadores.descricoes_sociais_preenchidas+
    '. Viabilidade material comprovada: 0. Topologia homologada a partir de propostas: 0.</p>';
 }
 function render(){
   el.innerHTML='<div class="env-head"><div><div class="eyebrow">Ciclo XLVIII · auditoria transversal</div>'+
    '<h3>Densidade não é povoamento comprovado</h3><p>Quatro lotes cruzados para medir diversidade de propostas, geografia ainda incerta e riscos de repetição.</p></div>'+
    '<div class="env-metrics"><b>82</b><span>comunidades propostas, zero aprovadas</span></div></div>'+
    '<div class="density-stat-grid"><div><b>82</b><span>comunidades propostas</span></div>'+
    '<div><b>10</b><span>ilhas geográficas propostas</span></div>'+
    '<div><b>34</b><span>habitats, não povoados</span></div>'+
    '<div><b>43</b><span>governos com vocabulário colegiado</span></div></div>'+
    '<div class="env-tabs">'+[['matriz','Matriz regional'],['diversidade','Povos e sociedades'],['lacunas','Lacunas prioritárias'],['fontes','Fontes e método']].map(([id,label])=>
     '<button type="button" data-density-tab="'+id+'" class="env-tab'+(tab===id?' active':'')+'">'+label+'</button>').join("")+'</div>'+
    (tab==="matriz"?'<div class="env-layout"><div class="env-main">'+table()+'</div><aside class="env-inspector">'+risk()+'</aside></div>':
     tab==="diversidade"?'<div class="env-layout"><div class="env-main">'+
       '<label class="density-filter">Analisar frente <select data-density-select>'+model.frentes.map(x=>
       '<option value="'+esc(x.id)+'"'+(selected===x.id?' selected':'')+'>'+esc(x.nome)+'</option>').join("")+'</select></label>'+diversity()+
       '</div><aside class="env-inspector">'+risk()+'</aside></div>':
     tab==="lacunas"?openGaps():source())+
    '<p class="env-foot">Sem porcentagem de conclusão, sem somar ilhas a povoados, sem inventar ausência de moradores em Shadar, Grama ou Foz. Governos e espécies são descrições editoriais, não censos.</p>';
 }
 el.addEventListener("click",e=>{
   const t=e.target.closest("[data-density-tab]");
   if(t&&["matriz","diversidade","lacunas","fontes"].includes(t.dataset.densityTab)){tab=t.dataset.densityTab;render();return}
   const f=e.target.closest("[data-density-front]");
   if(f&&model.frentes.some(x=>x.id===f.dataset.densityFront)){selected=f.dataset.densityFront;render()}
 });
 el.addEventListener("change",e=>{
   const f=e.target.closest("[data-density-filter]");if(f){group=f.value;render();return}
   const r=e.target.closest("[data-density-select]");
   if(r&&model.frentes.some(x=>x.id===r.value)){selected=r.value;render()}
 });
 render();
}
