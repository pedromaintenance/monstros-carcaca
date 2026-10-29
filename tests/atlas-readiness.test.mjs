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
 assert.match(audit,/O macro ainda está em construção: povoar antes de aprofundar amplamente/);
 assert.match(audit,/Shadar-Riverie e Grama-Cortada/);
});
test("Atlas XLIII: nenhuma das oito decisões topológicas foi aprovada silenciosamente",()=>{
 assert.equal(topological.decisoes.length,8);
 assert.ok(topological.decisoes.every(d=>d.estado==="pendente"&&d.opcao_aprovada===null));
 assert.match(audit,/As oito questões da oficina topológica continuam pendentes/);
 assert.match(audit,/prioridade passa a ser ampliar e articular o povoamento na escala macro/);
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
test("Revisão autoral: ancoragem temática não equivale a macro povoado",()=>{
 const horizon=JSON.parse(read("data/atlas/horizonte-povoamento-macro.json"));
 assert.equal(horizon.altera_canon,false);
 assert.equal(horizon.aprovacao_autoral,false);
 assert.equal(horizon.frentes.length,10);
 assert.ok(horizon.frentes.every(x=>x.alvo_flexivel===true&&x.contagem_aprovada===null&&x.criar_automaticamente===false));
 assert.equal(horizon.frentes.reduce((v,x)=>v+x.referencia_inferior,0),145);
 assert.equal(horizon.frentes.reduce((v,x)=>v+x.referencia_superior,0),205);
 assert.ok(horizon.frentes.some(x=>x.id==="frente:macro:ironwood"&&x.macro_id==="thargrid"));
 assert.ok(horizon.frentes.some(x=>x.id==="frente:macro:ilhas"&&x.unidade==="ilhas"));
 assert.ok(horizon.frentes.some(x=>x.id==="frente:macro:submersos"&&x.unidade==="assentamentos"));
 assert.match(audit,/id="audit-density"/);
 assert.match(audit,/145–205 localidades e ilhas a estruturar/);
 assert.match(audit,/nenhuma macrorregião pode ser declarada concluída em densidade de povoamento/);
 assert.match(audit,/não uma contagem de localidades existentes/);
 assert.equal((audit.match(/class="audit-density-grid"/g)||[]).length,1);
 assert.equal((audit.match(/class="audit-region" data-readiness=/g)||[]).length,11);
});
test("Povoamento macro: assentamentos de criaturas não são acessórios de humanoides",()=>{
 const horizon=JSON.parse(read("data/atlas/horizonte-povoamento-macro.json"));
 const policy=horizon.povoamento_criaturas;
 assert.ok(policy);
 assert.equal(policy.inclusao_obrigatoria,true);
 assert.equal(policy.nenhuma_especie_automaticamente_canonica,true);
 assert.equal(policy.classificacoes_nao_sao_presenca_confirmada,true);
 assert.ok(policy.exemplos_de_povos_a_considerar_sem_afirmar_presenca_em_cada_regiao.some(s=>s.includes("goblins")));
 assert.ok(policy.exemplos_de_povos_a_considerar_sem_afirmar_presenca_em_cada_regiao.some(s=>s.includes("fadas")));
 assert.ok(policy.formas_possiveis_de_ocupacao.some(f=>f.tipo==="assentamento_permanente"));
 assert.ok(policy.formas_possiveis_de_ocupacao.some(f=>f.tipo==="colonia_organizada"));
 assert.ok(policy.formas_possiveis_de_ocupacao.some(f=>f.tipo==="habitat_ecologico"));
 assert.ok(policy.formas_possiveis_de_ocupacao.some(f=>f.tipo==="covil_individual"));
 assert.ok(policy.politica_de_contagem.includes("Um assentamento misto conta uma única vez"));
 assert.ok(policy.ecologia_integral.includes("migração"));
 assert.equal(horizon.frentes.length,10);
 assert.ok(horizon.frentes.every(f=>f.inclui_assentamentos_de_criaturas===true&&
   f.auditar_habitats_magicos_e_ecologicos===true&&f.meta_reservada_a_humanoides===false));
 assert.ok(horizon.portoes_de_qualidade.some(s=>s.includes("goblins, fadas")));
 assert.match(audit,/id="audit-creature-settlements"/);
 assert.match(audit,/Assentamentos não são exclusividade de humanoides/);
 assert.match(audit,/um covil solitário não é uma aldeia/);
 assert.match(audit,/não devem inflar artificialmente a contagem/);
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
