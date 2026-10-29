/** Carta qualitativa de Golzdov; interface sem mapa em escala, coordenadas ou SVG georreferenciado. */
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const heading={leste:"Extremo leste",oeste:"Extremo oeste",norte:"Região norte",sul:"Região sul",
 relativo:"Referências relativas",transversal:"Eixo atravessante",indeterminado:"Sem orientação fixada",
 contestado:"Relações em conflito"};
export function initCartographicCharter(el,data,openPlace){
 if(!el||!data?.marcos?.length)throw new Error("Carta cartográfica não disponível");
 if(typeof openPlace!=="function")throw new Error("Inspetor sem navegação para lugares");
 let tab="bussola",selected=data.marcos[0].id,filter="todos";
 const marks=new Map(data.marcos.map(m=>[m.id,m]));
 const orig=new Map(data.marcos.map(m=>[m.referencia_fisica,m]));
 function button(m){
   return '<button type="button" class="charter-pin'+(selected===m.id?" active":"")+'" data-charter-mark="'+esc(m.id)+'">'+
     '<span>'+esc(m.rotulo)+'</span><small>Hack p. '+esc(m.referencia.paginas.join(", "))+'</small></button>';
 }
 function cluster(id){
   const group=data.grupos.find(g=>g.classe===id);
   return '<div class="charter-compass-cell charter-'+id+'"><small>'+esc(heading[id])+'</small>'+
     '<div class="charter-pin-list">'+group.marcos.map(button).join("")+'</div></div>';
 }
 function compass(){
   return '<p class="charter-note">Bússola <b>qualitativa</b>: os rótulos mostram apenas orientação documentada. As distâncias, as dimensões e o traçado real do continente NÃO são representados.</p>'+
     '<div class="charter-compass">'+cluster("norte")+
     '<div class="charter-compass-middle">'+cluster("oeste")+cluster("transversal")+cluster("leste")+'</div>'+
     cluster("sul")+'</div>'+
     '<div class="charter-dynamic"><strong>≈ Mar de Sangue / águas azuis</strong><span>'+esc(data.fenomenos_dinamicos[0].descricao)+'</span></div>'+
     '<div class="charter-stacks">'+["relativo","indeterminado","contestado"].map(id=>
      '<section class="charter-stack"><h4>'+esc(heading[id])+' ('+data.grupos.find(g=>g.classe===id).marcos.length+')</h4>'+
       '<div class="charter-pin-list">'+data.grupos.find(g=>g.classe===id).marcos.map(button).join("")+'</div></section>').join("")+'</div>';
 }
 function relationList(){
   return '<p class="charter-note">As setas e relações abaixo são <b>semânticas</b>: não mostram linhas de fronteira, estradas nem distâncias.</p>'+
     '<div class="charter-relations">'+data.relacoes.map(r=>{
       const a=orig.get(r.referencia_original.de),b=orig.get(r.referencia_original.para);
       return '<div class="charter-relation"><span class="charter-relation-kind">'+esc(r.simbolo.replaceAll("_"," "))+'</span>'+
        '<div><button type="button" data-charter-mark="'+esc(a.id)+'">'+esc(a.rotulo)+'</button>'+
        ' <span>· '+esc(r.referencia_original.tipo.replaceAll("_"," "))+' ·</span> '+
        '<button type="button" data-charter-mark="'+esc(b.id)+'">'+esc(b.rotulo)+'</button></div>'+
        '<p>'+esc(r.referencia_original.descricao||"Associação documental sem geometria.")+'</p></div>';
     }).join("")+'</div>';
 }
 function gaps(){
   return '<p class="charter-note">O desenho geográfico futuro depende destas decisões. As 24 alternativas do ciclo anterior continuam disponíveis na oficina topológica, mas nenhuma foi homologada.</p>'+
     '<div class="charter-gaps">'+data.decisoes_pendentes.map(d=>
       '<article><small>Decisão autoral ainda pendente</small><h4>'+esc(d.original.titulo)+'</h4>'+
       '<p>Hack p. '+esc(d.original.paginas.join(", "))+' · '+esc(d.original.grupo)+'</p></article>').join("")+'</div>';
 }
 function guide(){
   return '<div class="charter-guidelines"><p class="charter-note">Esta carta delimita aquilo que um ilustrador pode e não pode afirmar ao desenhar o mundo.</p>'+
     data.guia_de_uso.map(t=>'<div class="charter-rule">'+esc(t)+'</div>').join("")+
     '<div class="charter-rule"><strong>Convenções sugeridas:</strong> título e símbolo para orientações cardeais; indicação textual para posição relativa; eixo esquemático para o rio; hachuras para fronteira móvel; ponto de interrogação para localização aberta; conflito sinalizado sem deslocar assentamentos.</div></div>';
 }
 function details(){
   const x=marks.get(selected);
   if(!x)return "<p>Selecione um marco do continente.</p>";
   const p=x.referencia;
   return '<div class="env-kicker">'+esc(heading[x.classe])+' · '+esc(p.tipo.replaceAll("_"," "))+'</div>'+
    '<h4>'+esc(x.rotulo)+'</h4><p>'+esc(p.descricao||"Referência macrogeográfica do manuscrito.")+'</p>'+
    '<div class="env-subhead">O que pode ser indicado</div><p>'+esc(x.desenho_permitido)+'</p>'+
    '<div class="env-subhead">Precisão permitida</div><p>Referência qualitativa. Sem coordenada, polígono, escala ou pino posicional homologado.</p>'+
    '<p class="env-citation">Hack p. '+esc(p.paginas.join(", "))+' · '+esc(p.setores.join(" / ")||"setor indeterminado")+' · '+esc(p.estado.replaceAll("_"," "))+'</p>'+
    (p.lugar_id?'<button type="button" class="env-action" data-charter-place="'+esc(p.lugar_id)+'">Abrir referência na árvore</button>':
     '<p class="env-dim">Sem âncora de localidade individualizada.</p>');
 }
 function render(){
   const tabs=[["bussola","Bússola qualitativa"],["relacoes","Relações documentadas"],["decisoes","Decisões em aberto"],["regras","Manual de desenho"]];
   el.innerHTML='<div class="env-head"><div><div class="eyebrow">Ciclo XXXVIII · leitura cartográfica</div>'+
    '<h3>Carta continental de Golzdov</h3><p>Uma base visual para futuras cartas da Carcaça, distinguindo o que pode ser desenhado do que ainda é desconhecido.</p></div>'+
    '<div class="env-metrics"><b>'+data.totais.marcos+'</b><span>marcos auditados</span></div></div>'+
    '<div class="charter-metrics"><span>6 orientações cardeais</span><span>4 referências relativas</span><span>5 sem posição</span>'+
    '<span>4 em conflito</span><span>0 geometrias autorizadas</span></div>'+
    '<div class="env-tabs">'+tabs.map(([key,label])=>
    '<button type="button" class="env-tab'+(tab===key?" active":"")+'" data-charter-tab="'+key+'">'+label+'</button>').join("")+'</div>'+
    '<div class="env-layout"><div class="env-main charter-board">'+
       (tab==="bussola"?compass():tab==="relacoes"?relationList():tab==="decisoes"?gaps():guide())+
    '</div><aside class="env-inspector charter-inspector">'+details()+'</aside></div>'+
    '<p class="env-foot">Bússola conceitual não georreferenciada · 20 marcos · 12 relações · 8 decisões em aberto · fontes e cânone preservados.</p>';
 }
 el.addEventListener("click",e=>{
   const t=e.target.closest("[data-charter-tab]");if(t){tab=t.dataset.charterTab;render();return}
   const mark=e.target.closest("[data-charter-mark]");if(mark&&marks.has(mark.dataset.charterMark)){
     selected=mark.dataset.charterMark;render();return;
   }
   const place=e.target.closest("[data-charter-place]");if(place)openPlace(place.dataset.charterPlace);
 });
 render();
}
