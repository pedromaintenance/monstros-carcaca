import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {join} from "node:path";
import {tmpdir} from "node:os";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const html=read("site/atlas/index.html");
const macro=JSON.parse(read("data/atlas/macrorregioes-carcaca.json"));
const topological=JSON.parse(read("data/atlas/matriz-topologica-ciclo37.json"));
const md=read("docs/ATLAS_AUDITORIA_PRONTIDAO_CICLO43.md");
const audit=html.match(/<section id="continentalAudit"[\s\S]*?<\/section>/)?.[0];
test("Atlas XLIII: a auditoria está diretamente no HTML e não depende de fetch ou JS",()=>{
 assert.ok(audit);
 assert.match(audit,/<h2 id="auditHeading">Estamos prontos para aprofundar a Carcaça\?<\/h2>/);
 assert.match(audit,/id="audit-verdict"/);
 assert.ok(html.indexOf('id="continentalAudit"')<html.indexOf('id="physicalGeo"'));
 assert.match(audit,/texto permanece visível mesmo se as camadas interativas não carregarem/);
});
test("Atlas XLIII: há um único parágrafo escrito para cada um dos 11 setores",()=>{
 const items=[...audit.matchAll(/<article id="audit-([^"]+)" class="audit-region" data-readiness="([^"]+)">([\s\S]*?)<\/article>/g)]
  .map(m=>({id:m[1],parecer:m[2],corpo:m[3]}));
 assert.equal(items.length,11);
 assert.equal(new Set(items.map(x=>x.id)).size,11);
 assert.deepEqual(new Set(items.map(x=>x.id)),new Set(macro.setores.map(x=>x.id)));
 for(const row of items){
  assert.equal((row.corpo.match(/<p>/g)||[]).length,1,"um parágrafo por região: "+row.id);
  assert.equal((row.corpo.match(/<\/p>/g)||[]).length,1,"um parágrafo fechado: "+row.id);
  assert.match(row.corpo,/<strong>[\s\S]*?<\/strong>/,"conclusão editorial explícita");
  assert.match(row.corpo,/Hack pp?\./,"páginas da fonte");
  assert.ok(row.corpo.replace(/<[^>]+>/g," ").split(/\s+/).filter(Boolean).length>75,"parecer suficiente: "+row.id);
  assert.match(audit,new RegExp('href="#audit-'+row.id+'"'));
 }
});
test("Atlas XLIII: categorias editoriais são 4 locais, 5 condicionadas, 2 macro",()=>{
 const rows=[...audit.matchAll(/data-readiness="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(rows.filter(x=>x==="local").length,4);
 assert.equal(rows.filter(x=>x==="condicionado").length,5);
 assert.equal(rows.filter(x=>x==="macro").length,2);
 assert.deepEqual(rows.filter(x=>!["local","condicionado","macro"].includes(x)),[]);
 assert.match(audit,/Aprofundar seletivamente, sem encerrar a etapa macro/);
 assert.match(audit,/Shadar-Riverie e Grama-Cortada/);
});
test("Atlas XLIII: nenhuma das oito decisões topológicas foi aprovada silenciosamente",()=>{
 assert.equal(topological.decisoes.length,8);
 assert.ok(topological.decisoes.every(d=>d.estado==="pendente"&&d.opcao_aprovada===null));
 assert.match(audit,/oito questões da oficina topológica permanecem abertas/);
 assert.match(audit,/Este parecer não aprova nenhuma dessas alternativas/);
 assert.match(audit,/href="#topologyChoices"/);
 assert.match(audit,/não equivale automaticamente ao leste cartográfico/);
 assert.match(audit,/não comprova potabilidade/);
 assert.match(audit,/não comprova continuidade/);
});
test("Atlas XLIII: documento espelha o texto HTML sem mudar a redação dos pareceres",()=>{
 const items=[...audit.matchAll(/<article id="audit-([^"]+)" class="audit-region" data-readiness="([^"]+)">([\s\S]*?)<\/article>/g)];
 for(const [,id,,htmlRow] of items){
  const p=htmlRow.match(/<p>([\s\S]*?)<\/p>/)?.[1];
  assert.ok(p,id);
  assert.ok(md.includes(p.replace(/<strong>/g,"**").replace(/<\/strong>/g,"**")),id);
 }
});
test("Atlas XLIII: responsividade e integridade da página preservadas",()=>{
 assert.match(html,/\.audit-region\{display:grid/);
 assert.match(html,/@media\(max-width:770px\)\{\.audit-section/);
 const dir=mkdtempSync(join(tmpdir(),"atlas-ready-"));
 try{
  const module=html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(module);
  const file=join(dir,"atlas.mjs");writeFileSync(file,module,"utf8");
  execFileSync(process.execPath,["--check",file],{stdio:"pipe"});
 }finally{rmSync(dir,{recursive:true,force:true})}
});
