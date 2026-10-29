import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {buildCartographicCharter} from "../site/atlas/cartographic-charter.mjs";
const file=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const source=file("data/atlas/carta-cartografica-ciclo38.json");
const physical=file("data/atlas/geografia-fisica-ciclo34.json");
const interfaces=file("data/atlas/interfaces-continentais-ciclo36.json");
const topology=file("data/atlas/matriz-topologica-ciclo37.json");
const build=d=>buildCartographicCharter(d,physical,interfaces,topology);
const edit=fn=>{const x=structuredClone(source);fn(x);return x};

test("Atlas XXXVIII: carta preserva 20 marcos, 12 relações, 8 decisões e nenhum pino preciso",()=>{
 const v=build(source);
 assert.deepEqual(v.totais,{marcos:20,relacoes:12,decisoes_pendentes:8,
  geometrias_autorizadas:0,cardeais:6,relativos:4,nao_posicionados:5,conflitos:4});
 assert.equal(v.altera_canon,false);
 assert.equal(source.aprovacao_autoral,false);
 assert.equal(v.grupos.length,8);
 assert.ok(v.marcos.every(m=>m.geometria===null&&m.coordenadas===null&&m.aprovado_para_pino===false));
 assert.ok(v.relacoes.every(r=>r.desenhar_linha===false));
 assert.ok(v.decisoes_pendentes.every(d=>d.aprovada===false));
});
test("Atlas XXXVIII: direções do manuscrito são qualitativas, sem trocar anatomia por bússola",()=>{
 const v=build(source);
 const find=id=>v.marcos.find(m=>m.referencia_fisica==="geo-xxxiv:"+id);
 for(const [id,classe] of [["cranio","leste"],["foz","oeste"],["montanhas-thargrid","norte"],
 ["caatinga","sul"],["ironwood","relativo"],["cauda","relativo"],["asa-direita","indeterminado"],
 ["coluna-dorsal","indeterminado"],["grama","indeterminado"],["shadar","contestado"],
 ["gualapolis","contestado"],["rio","transversal"],["aguas-azuis","relativo"]]){
  assert.equal(find(id).classe,classe,id);
 }
 assert.deepEqual(new Set(v.marcos.map(m=>m.referencia_fisica)).size,20);
 assert.ok(v.marcos.filter(x=>x.classe==="contestado").every(x=>x.referencia.estado==="documentado_com_conflito"));
});
test("Atlas XXXVIII: mantém o limite móvel do mar e a revisão de Shadar/Gualápolis",()=>{
 const v=build(source);
 assert.equal(v.fenomenos_dinamicos.length,1);
 assert.equal(v.fenomenos_dinamicos[0].referencia_interface,"inter:xxxvi:sangue-azul");
 assert.equal(v.fenomenos_dinamicos[0].linha_fixa,false);
 assert.equal(v.fenomenos_dinamicos[0].poligono_fixo,false);
 assert.equal(v.relacoes.find(x=>x.referencia==="rel-xxxiv:shadar-riverie-gualapolis").simbolo,"relacao_contestada");
 assert.equal(v.relacoes.find(x=>x.referencia==="rel-xxxiv:aguas-azuis-mar-de-sangue").simbolo,"limite_movel");
 assert.ok(v.decisoes_pendentes.every(q=>q.original.estado==="pendente"));
 assert.doesNotMatch(JSON.stringify(source),/"(?:latitude|longitude|lat|lng|coordinates|polygon|poligono)"\s*:/i);
});
test("Atlas XXXVIII: validador bloqueia orientações inventadas, coordenadas e solução automática",()=>{
 assert.throws(()=>build(edit(x=>x.marcos[0].classe="oeste")),/Classe de orientação adulterada/);
 assert.throws(()=>build(edit(x=>x.marcos[1].classe="leste")),/Classe de orientação adulterada/);
 assert.throws(()=>build(edit(x=>x.marcos[0].coordenadas=[0,0])),/Marco promovido/);
 assert.throws(()=>build(edit(x=>x.marcos[0].aprovado_para_pino=true)),/Marco promovido/);
 assert.throws(()=>build(edit(x=>x.relacoes[0].desenhar_linha=true)),/Relação indevidamente/);
 assert.throws(()=>build(edit(x=>x.relacoes.find(r=>r.referencia.includes("shadar-riverie")).simbolo="relacao_sem_tracado")),/contestada/);
 assert.throws(()=>build(edit(x=>x.decisoes_pendentes[0].aprovada=true)),/Decisão autoral/);
 assert.throws(()=>build(edit(x=>x.marcos.pop())),/Nem todos os marcos/);
 assert.throws(()=>build(edit(x=>x.fenomenos_dinamicos[0].linha_fixa=true)),/Fronteira móvel/);
 assert.throws(()=>build(edit(x=>x.fenomenos_dinamicos[0].poligono_fixo=true)),/Fronteira móvel/);
 assert.throws(()=>build(edit(x=>x.decisoes_pendentes.pop())),/Decisões autorais/);
});
test("Atlas XXXVIII: Pages publica carta, com linguagem visual não georreferenciada",()=>{
 const html=readFileSync(new URL("../site/atlas/index.html",import.meta.url),"utf8");
 const ui=readFileSync(new URL("../site/atlas/cartographic-charter-ui.mjs",import.meta.url),"utf8");
 const workflow=readFileSync(new URL("../.github/workflows/publicar-atlas-pages.yml",import.meta.url),"utf8");
 assert.match(html,/id="cartographicCharter"/);
 assert.match(html,/cartographic-charter\.mjs/);
 assert.match(html,/buildCartographicCharter\(loaded\.charter,state\.physical,state\.interfaces,state\.topology\)/);
 assert.match(html,/initCartographicCharter\(\$\("cartographicCharter"\),state\.charter,macroDiveInto\)/);
 assert.match(workflow,/data\/atlas\/carta-cartografica-ciclo38\.json/);
 assert.match(ui,/charter-compass/);
 assert.match(ui,/charter-dynamic/);
 assert.match(ui,/data-charter-mark/);
 assert.doesNotMatch(ui,/(localStorage|sessionStorage|indexedDB)/);
 const temp=mkdtempSync(join(tmpdir(),"charter-carcaca-"));
 try{
  const script=html.match(/<script type="module">([\s\S]*?)<\/script>/);
  assert.ok(script);
  const path=join(temp,"view.mjs");
  writeFileSync(path,script[1],"utf8");
  execFileSync(process.execPath,["--check",path],{stdio:"pipe"});
 }finally{rmSync(temp,{recursive:true,force:true})}
});
