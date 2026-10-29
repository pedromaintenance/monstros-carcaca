import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {buildTopologyChoices} from "../site/atlas/topology-choices.mjs";

const file=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const source=file("data/atlas/matriz-topologica-ciclo37.json");
const originalMacro=file("data/atlas/macrorregioes-carcaca.json");
const macro={setores:originalMacro.setores};
const interfaces=file("data/atlas/interfaces-continentais-ciclo36.json");
const physical=file("data/atlas/geografia-fisica-ciclo34.json");
const run=data=>buildTopologyChoices(data,macro,interfaces,physical);
const mutate=edit=>{const copy=structuredClone(source);edit(copy);return copy};

test("Atlas XXXVII: oito decisões e vinte e quatro alternativas em quatro grandes conjuntos",()=>{
 const result=run(source);
 assert.deepEqual(result.totais,{grupos:4,decisoes:8,alternativas:24,opcoesCanonicas:0,referenciasInterfaces:8});
 assert.equal(result.altera_canon,false);
 assert.equal(source.aprovacao_autoral,false);
 assert.ok(source.grupos.every(g=>g.setores.length));
 assert.deepEqual(source.grupos.map(g=>g.id),["oeste","norte","mar","interior"]);
 assert.equal(new Set(source.decisoes.map(d=>d.ref_questao)).size,interfaces.questoes.length);
 assert.ok(result.decisoes.every(d=>d.estado==="pendente"&&d.opcao_aprovada===null));
 assert.ok(result.decisoes.every(d=>d.alternativas.length===3));
});
test("Atlas XXXVII: todas as hipóteses são explicitamente não adotadas, sem coordenadas",()=>{
 const options=run(source).decisoes.flatMap(d=>d.alternativas);
 assert.ok(options.every(o=>o.estado==="nao_adotada"&&o.geometria===null&&o.aprovacao_autoral===false&&o.cria_lugar===false));
 assert.ok(options.every(o=>o.condicao_para_canonizar&&o.consequencia_material));
 assert.ok(source.aviso.includes("não alteram o cânone"));
 assert.doesNotMatch(JSON.stringify(source),/"(?:latitude|longitude|lat|lng|coordinates|polygon|poligono|rota_confirmada|fronteira_definida)"\s*:/i);
});
test("Atlas XXXVII: pressupostos incontornáveis e perguntas anteriores permanecem presentes",()=>{
 const decisions=run(source).decisoes;
 const shadar=decisions.find(d=>d.id==="decisao:xxxvii:shadar");
 const north=decisions.find(d=>d.id==="decisao:xxxvii:florestas");
 const sea=decisions.find(d=>d.id==="decisao:xxxvii:mar");
 const river=decisions.find(d=>d.id==="decisao:xxxvii:rio");
 assert.match(shadar.documentado,/margem sul/i);
 assert.match(shadar.documentado,/Boca/i);
 assert.match(north.documentado,/sul de Thargrid/i);
 assert.match(sea.documentado,/não possuem linha estável/i);
 assert.match(river.documentado,/termina no Abismo/i);
 assert.ok(interfaces.questoes.every(q=>decisions.some(d=>d.ref_questao===q.id)));
});
test("Atlas XXXVII: rejeita canonização, geometrias, perguntas falsas e perda de opções",()=>{
 assert.throws(()=>run(mutate(x=>x.aprovacao_autoral=true)),/salvaguardas autorais/);
 assert.throws(()=>run(mutate(x=>x.decisoes[0].opcao_aprovada=x.decisoes[0].alternativas[0].id)),/promovida/);
 assert.throws(()=>run(mutate(x=>x.decisoes[1].alternativas[0].estado="canonico")),/convertida em fato/);
 assert.throws(()=>run(mutate(x=>x.decisoes[1].alternativas[0].geometria={lat:0})),/Coordenadas|convertida/);
 assert.throws(()=>run(mutate(x=>x.decisoes[2].alternativas[0].cria_lugar=true)),/convertida em fato/);
 assert.throws(()=>run(mutate(x=>x.decisoes[3].ref_questao="questao:xxxvi:inventada")),/Questão autoral/);
 assert.throws(()=>run(mutate(x=>x.decisoes[3].ref_interfaces=["inter:xxxvi:inventada"])),/Interface de origem inexistente/);
 assert.throws(()=>run(mutate(x=>x.decisoes[3].ref_pontos_fisicos=["geo-xxxiv:inventada"])),/Ponto anatômico inexistente/);
 assert.throws(()=>run(mutate(x=>x.decisoes[4].setores=["eldroth"])),/Setores diferentes/);
 assert.throws(()=>run(mutate(x=>x.decisoes[5].alternativas.pop())),/três alternativas/);
});
test("Atlas XXXVII: interface e distribuição estão integradas ao Pages",()=>{
 const html=readFileSync(new URL("../site/atlas/index.html",import.meta.url),"utf8");
 const ui=readFileSync(new URL("../site/atlas/topology-choices-ui.mjs",import.meta.url),"utf8");
 const ci=readFileSync(new URL("../.github/workflows/publicar-atlas-pages.yml",import.meta.url),"utf8");
 assert.match(html,/id="topologyChoices"/);
 assert.match(html,/topology-choices-ui\.mjs/);
 assert.match(html,/buildTopologyChoices\(loaded\.topology,state\.macro,state\.interfaces,state\.physical\)/);
 assert.match(html,/initTopologyChoices\(\$\("topologyChoices"\),state\.topology\)/);
 assert.match(ci,/data\/atlas\/matriz-topologica-ciclo37\.json/);
 assert.match(ui,/data-topo-choice/);
 assert.match(ui,/data-topo-reset/);
 assert.match(ui,/data-topo-group/);
 assert.doesNotMatch(ui,/(localStorage|sessionStorage|indexedDB|fetch\s*\()/);
 const temp=mkdtempSync(join(tmpdir(),"topology-carcaca-"));
 try {
   const modulePath=join(temp,"atlas.mjs");
   const script=html.match(/<script type="module">([\s\S]*?)<\/script>/);
   assert.ok(script);
   writeFileSync(modulePath,script[1],"utf8");
   execFileSync(process.execPath,["--check",modulePath],{stdio:"pipe"});
 } finally {rmSync(temp,{recursive:true,force:true})}
});
