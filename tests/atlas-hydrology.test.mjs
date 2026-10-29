import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {buildContinentalHydrology} from "../site/atlas/continental-hydrology.mjs";
const file=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const data=file("data/atlas/hidrografia-continental-ciclo39.json");
const physical=file("data/atlas/geografia-fisica-ciclo34.json");
const environments=file("data/atlas/macroambientes-ciclo35.json");
const interfaces=file("data/atlas/interfaces-continentais-ciclo36.json");
const topology=file("data/atlas/matriz-topologica-ciclo37.json");
const build=x=>buildContinentalHydrology(x,physical,environments,interfaces,topology);
const clone=edit=>{const d=structuredClone(data);edit(d);return d};

test("Atlas XXXIX: 13 domínios, seis vínculos, doze perguntas e fonte preservada",()=>{
 const h=build(data);
 assert.deepEqual(h.totais,{unidades:13,vinculos:6,lacunas:12,geometria_confirmada:0,
   comRegimeIndeterminado:5,semNascentesConfirmadas:true});
 assert.equal(h.altera_canon,false);
 assert.equal(data.aprovacao_autoral,false);
 assert.equal(data.representacao,"qualitativa_sem_geometria");
 assert.ok(h.unidades.every(u=>u.paginas.length&&u.documentado&&u.desconhecido&&u.nao_inferir));
 assert.ok(h.lacunas.every(q=>q.resolvida===false&&q.promove_bacia===false));
 assert.ok(h.vinculos.every(v=>v.roteiro_de_agua_confirmado===false));
});
test("Atlas XXXIX: Rio termina no Abismo e ilha lunar permanece sem trecho conhecido",()=>{
 const h=build(data);
 const get=id=>h.unidades.find(u=>u.id==="hidro:xxxix:"+id);
 const edge=id=>h.vinculos.find(v=>v.id==="hidrorel:xxxix:"+id);
 assert.equal(get("rio-ancestral").ref_fisica,"geo-xxxiv:rio");
 assert.equal(get("abismo").ref_fisica,"geo-xxxiv:foz");
 assert.equal(get("ilha-lunar").ref_fisica,"geo-xxxiv:ilha-lunar");
 assert.equal(edge("rio-abismo").de,get("rio-ancestral").id);
 assert.equal(edge("rio-abismo").para,get("abismo").id);
 assert.equal(edge("rio-ilha").para,get("ilha-lunar").id);
 assert.match(get("rio-ancestral").desconhecido,/nascente/i);
 assert.match(get("ilha-lunar").desconhecido,/trecho/i);
 assert.ok(!h.vinculos.some(v=>v.de===get("abismo").id&&v.para===get("mar-sangue").id));
});
test("Atlas XXXIX: Portomonte não estabelece potabilidade nem irrigação regional",()=>{
 const h=build(data);
 const port=h.unidades.find(u=>u.id==="hidro:xxxix:portomonte");
 const link=h.vinculos.find(v=>v.tipo==="purificacao_local");
 assert.equal(port.estado,"documentado_com_limite");
 assert.match(port.documentado,/Deméter/);
 assert.match(port.desconhecido,/consumo humano/i);
 assert.equal(link.de,"hidro:xxxix:mar-sangue");
 assert.equal(link.para,port.id);
 assert.deepEqual(link.paginas,[5,23]);
 assert.equal(link.ref_interface,null);
 assert.equal(link.ref_ambiental,null);
 const prairie=h.unidades.find(u=>u.id==="hidro:xxxix:pradarias");
 assert.equal(prairie.estado,"regime_indeterminado");
 assert.match(prairie.nao_inferir,/não atribuir/i);
});
test("Atlas XXXIX: neve, subsolo, condado e Caatinga não viram novas bacias",()=>{
 const h=build(data);
 for(const id of ["caatinga","pradarias","thargrid","grama","cavernas"]){
   const u=h.unidades.find(x=>x.id==="hidro:xxxix:"+id);
   assert.ok(u,id);
   assert.equal(u.estado,"regime_indeterminado");
   assert.equal(u.geometria,null);
   assert.equal(u.volume,null);
   assert.equal(u.regime_sazonal,null);
 }
 assert.equal(h.unidades.find(x=>x.id==="hidro:xxxix:limite-azul").estado,"documentado_variavel");
 assert.equal(h.vinculos.find(x=>x.id==="hidrorel:xxxix:mar-limite").ref_interface,"inter:xxxvi:sangue-azul");
 assert.doesNotMatch(JSON.stringify(data),/"(?:latitude|longitude|lat|lng|coordinates|polygon|poligono|bacia_confirmada|nascente_confirmada)"\s*:/i);
});
test("Atlas XXXIX: validador recusa hidrografia e potabilidade inventadas",()=>{
 assert.throws(()=>build(clone(d=>d.aprovacao_autoral=true)),/salvaguardas/);
 assert.throws(()=>build(clone(d=>d.unidades[0].geometria=[[0,0]])),/inventou geometria/);
 assert.throws(()=>build(clone(d=>d.unidades.find(x=>x.id.endsWith(":caatinga")).estado="documentado")),/Regime hídrico hipotético/);
 assert.throws(()=>build(clone(d=>d.unidades.find(x=>x.id.endsWith(":portomonte")).estado="documentado")),/Purificação local/);
 assert.throws(()=>build(clone(d=>d.unidades.find(x=>x.id.endsWith(":limite-azul")).estado="documentado")),/Fronteira marítima/);
 assert.throws(()=>build(clone(d=>d.unidades[0].ref_ambiente="amb:inexistente")),/Âncora hídrica/);
 assert.throws(()=>build(clone(d=>d.vinculos[0].para="hidro:xxxix:inexistente")),/Vínculo hídrico inválido/);
 assert.throws(()=>build(clone(d=>d.vinculos[0].roteiro_de_agua_confirmado=true)),/desenhado como curso/);
 assert.throws(()=>build(clone(d=>d.vinculos.find(x=>x.tipo==="purificacao_local").para="hidro:xxxix:pradarias")),/indevidamente generalizada/);
 assert.throws(()=>build(clone(d=>d.lacunas[0].resolvida=true)),/resolvida sem autoria/);
 assert.throws(()=>build(clone(d=>d.lacunas[0].promove_bacia=true)),/resolvida sem autoria/);
});
test("Atlas XXXIX: UI, script e JSON são incluídos na publicação do Pages",()=>{
 const html=readFileSync(new URL("../site/atlas/index.html",import.meta.url),"utf8");
 const frontend=readFileSync(new URL("../site/atlas/continental-hydrology-ui.mjs",import.meta.url),"utf8");
 const ci=readFileSync(new URL("../.github/workflows/publicar-atlas-pages.yml",import.meta.url),"utf8");
 assert.match(html,/id="continentalHydrology"/);
 assert.match(html,/continental-hydrology\.mjs/);
 assert.match(html,/buildContinentalHydrology\(loaded\.hydrology,state\.physical,state\.environments,state\.interfaces,state\.topology\)/);
 assert.match(html,/initContinentalHydrology\(\$\("continentalHydrology"\),state\.hydrology,macroDiveInto\)/);
 assert.match(ci,/data\/atlas\/hidrografia-continental-ciclo39\.json/);
 assert.match(frontend,/data-hydro-unit/);
 assert.match(frontend,/data-hydro-tab/);
 assert.match(frontend,/data-hydro-group/);
 assert.doesNotMatch(frontend,/(localStorage|sessionStorage|indexedDB)/);
 const temp=mkdtempSync(join(tmpdir(),"hydro-carcaca-"));
 try{
  const script=html.match(/<script type="module">([\s\S]*?)<\/script>/);
  assert.ok(script);
  const path=join(temp,"view.mjs");
  writeFileSync(path,script[1],"utf8");
  execFileSync(process.execPath,["--check",path],{stdio:"pipe"});
 }finally{rmSync(temp,{recursive:true,force:true})}
});
