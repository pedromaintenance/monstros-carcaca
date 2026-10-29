/** Ciclo XLVII: inventário insular, sociedades submersas e Cauda. */
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pretty=x=>String(x??"").replaceAll("_"," ");
export function initMarineTailSettlements(el,model){
 if(!el||model?.totais?.comunidades_novas_propostas!==26)throw Error("Camada marinha XLVII indisponível");
 let tab="ilhas",sector="todos",selected=model.ilhas[0].id;
 const all=[...model.ilhas,...model.comunidades,...model.habitats];
 const byId=new Map(all.map(x=>[x.id,x]));
 const groups=[
 ["ilhas","10 ilhas",model.ilhas],
 ["comunidades","26 comunidades",model.comunidades],
 ["habitats","12 habitats",model.habitats],
 ["criterios","Cânone e topologia",[]]
 ];
 function activeRows(){
  const arr=groups.find(x=>x[0]===tab)?.[2]||[];
  return arr.filter(x=>sector==="todos"||tab==="ilhas"||(
    sector==="insular"&&x.frente_id==="frente:macro:costa"||
    sector==="rubro"&&x.setor==="costa"&&tab==="comunidades"&&x.frente_id==="frente:macro:submersos"||
    sector==="azul"&&x.setor==="azuis"||
    sector==="cauda"&&x.setor==="cauda"||
    sector==="insular"&&tab==="habitats"&&x.frente==="ilhas"||
    sector==="rubro"&&tab==="habitats"&&x.setor==="costa"&&x.frente==="submersos"
  ));
 }
 function rowDetail(x){
  if(!x)return '';
  const island=x.id.startsWith("ilha:"),habitat=x.id.startsWith("habitat:");
  const pairs=island?[
   ["Ambiente proposto",x.ecologia_hipotetica],
   ["Função",x.papel_regional_hipotetico],
   ["Ocupantes possíveis",x.ocupantes_possiveis],
   ["Conflito",x.conflito_potencial],
   ["Limite",x.limite_de_inferencia],
   ["Comunidades vinculadas",x.comunidades_associadas.length?x.comunidades_associadas.map(id=>byId.get(id)?.nome||id).join("; "):"Nenhuma comunidade vinculada neste lote; ilha não significa aldeia."]
  ]:habitat?[
   ["Organismos propostos",x.organismos_propostos],
   ["Função ecológica",x.papel_ecologico_hipotetico],
   ["Limite",x.limite_de_inferencia]
  ]:[
   ["Habitantes",x.habitantes_propostos],
   ["Governo e organização",x.governo_proposto],
   ["Subsistência",x.sustento_hipotetico],
   ["Forma de habitar",x.modo_de_habitar],
   ["Tensão política",x.tensao_politica],
   ...(x.ilha_id?[["Ilha hipotética associada",byId.get(x.ilha_id)?.nome||x.ilha_id]]:[])
  ];
  return '<aside class="env-inspector marine-inspector"><div class="env-kicker">'+
   esc(island?"Unidade geográfica não canônica":habitat?"Local ecológico, não assentamento":"Comunidade habitada proposta")+'</div>'+
   '<h4>'+esc(x.nome)+'</h4>'+pairs.map(([name,value])=>'<div class="env-subhead">'+esc(name)+'</div><p>'+esc(value)+'</p>').join("")+
   '<p class="env-citation">Contexto do manuscrito: cap. I, p. '+esc(x.paginas_contexto.join(", "))+
   '. Não há coordenadas, distância, rotas ou confirmação do local.</p></aside>';
 }
 function listing(){
  const options=[["todos","Todas"],["insular","Ilhas e comunidades insulares"],["rubro","Mar de Sangue"],["azul","Águas azuis"],["cauda","Cauda"]];
  const rows=activeRows();
  return '<label class="marine-filter">Ambiente <select data-marine-sector>'+
    options.map(([id,label])=>'<option value="'+id+'"'+(sector===id?" selected":"")+'>'+label+'</option>').join("")+
    '</select></label><div class="marine-grid">'+(rows.length?rows.map(x=>
    '<button type="button" class="marine-place'+(x.id===selected?' active':'')+'" data-marine-id="'+esc(x.id)+'">'+
    '<small>'+esc(pretty(x.categoria||x.forma||x.estado))+'</small><b>'+esc(x.nome)+'</b>'+
    '<span>'+esc(x.ocupantes_possiveis||x.habitantes_propostos||x.organismos_propostos)+'</span></button>').join(""):
    '<p class="marine-empty">Não há registros nesta combinação de filtros. Isso não confirma a inexistência de localidades no mundo.</p>')+
    '</div>';
 }
 function guidelines(){
   return '<div class="marine-method"><p>'+esc(model.politica)+'</p>'+
     '<h4>Restrições que não podem ser ultrapassadas sem decisão autoral</h4>'+
     model.restricoes.map(x=>'<p>'+esc(x)+'</p>').join("")+'</div>';
 }
 function render(){
   if(tab!=="criterios"&&!activeRows().some(x=>x.id===selected))
     selected=activeRows()[0]?.id||"";
   el.innerHTML='<div class="env-head"><div><div class="eyebrow">Ciclo XLVII · povoamento de ilhas e mares</div>'+
   '<h3>Arquipélagos, cidades submersas e a Cauda</h3><p>Ilhas são territórios; assentamentos são comunidades; habitats não são povoados. Nada foi canonizado automaticamente.</p></div>'+
   '<div class="env-metrics"><b>82</b><span>comunidades propostas acumuladas</span></div></div>'+
   '<div class="marine-stats"><div><b>10</b><span>ilhas propostas, não aprovadas</span></div>'+
   '<div><b>6</b><span>comunidades insulares</span></div>'+
   '<div><b>12</b><span>comunidades submersas (6 rubras + 6 azuis)</span></div>'+
   '<div><b>8</b><span>comunidades na Cauda</span></div>'+
   '<div><b>12</b><span>habitats ecológicos adicionais</span></div>'+
   '<div><b>0</b><span>novos assentamentos aprovados</span></div></div>'+
   '<p class="marine-warning">Todas as ilhas e comunidades deste ciclo são propostas. O Templo do Crepúsculo está documentado na Cauda, mas o acesso pelo Abismo NÃO está definido; as águas azuis não possuem um reino único e sua fronteira com o Mar de Sangue é móvel.</p>'+
   '<div class="env-tabs">'+groups.map(([id,label])=>'<button type="button" data-marine-tab="'+id+'" class="env-tab'+(id===tab?" active":"")+'">'+label+'</button>').join("")+'</div>'+
   '<div class="env-layout"><div class="env-main">'+(tab==="criterios"?guidelines():listing())+'</div>'+
   (tab==="criterios"?'':rowDetail(byId.get(selected)))+'</div>'+
   '<p class="env-foot">As faixas de densidade do Atlas são referências criativas flexíveis. Nenhum desses números é uma contagem de localidades já aprovadas ou de ilhas cartograficamente estabelecidas.</p>';
 }
 el.addEventListener("click",e=>{
  const btn=e.target.closest("[data-marine-tab]");
  if(btn&&groups.some(x=>x[0]===btn.dataset.marineTab)){tab=btn.dataset.marineTab;sector="todos";render();return}
  const place=e.target.closest("[data-marine-id]");
  if(place&&byId.has(place.dataset.marineId)){selected=place.dataset.marineId;render()}
 });
 el.addEventListener("change",e=>{
  const select=e.target.closest("[data-marine-sector]");
  if(select){sector=["todos","insular","rubro","azul","cauda"].includes(select.value)?select.value:"todos";render()}
 });
 render();
}
