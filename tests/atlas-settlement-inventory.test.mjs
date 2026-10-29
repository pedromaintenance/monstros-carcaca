import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {buildSettlementInventory} from "../site/atlas/settlement-inventory.mjs";
import {initSettlementInventory} from "../site/atlas/settlement-inventory-ui.mjs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const j=p=>JSON.parse(read(p));
const inventory=j("data/atlas/inventario-povoamento-ciclo44.json");
const lot=j("data/propostas/povoamento-criaturas-lote01.json");
const horizon=j("data/atlas/horizonte-povoamento-macro.json");
const macro=j("data/atlas/macrorregioes-carcaca.json");
const build=(a=inventory,b=lot,c=horizon)=>buildSettlementInventory(a,b,c,macro);
const copy=f=>{const a=structuredClone(inventory),b=structuredClone(lot),h=structuredClone(horizon);f(a,b,h);return [a,b,h]};
test("Povoamento XLIV: inventário não é censo de assentamentos",()=>{
 const m=build();
 assert.deepEqual(m.totais,{
  ancoras_macro:26,lugares_catalogados:8,registros_formais_assentamento:3,
  redacoes_sementes:16,propostas_de_criaturas_ecologicas:8,
  novos_assentamentos_propostos:14,novos_assentamentos_aprovados:0,
  grupos_equivalencia_revisados:7
 });
 assert.equal(m.altera_canon,false);
 assert.equal(m.registros_formais.filter(x=>x.precisa_individualizacao).length,2);
 assert.ok(m.sementes_narrativas.every(x=>x.conta_como_assentamento===false));
 assert.ok(m.criaturas_ecologicas_propostas.every(x=>x.conta_como_assentamento===false));
 assert.ok(m.lote.every(x=>x.aprovacao_autoral===false&&x.estado==="proposta_nao_canonica"));
});
test("Povoamento: humanoides não monopolizam os assentamentos",()=>{
 const m=build();
 assert.ok(m.lote.some(x=>x.criaturas_e_povos.some(p=>p.includes("Goblins"))));
 assert.ok(m.lote.some(x=>x.criaturas_e_povos.some(p=>p.includes("Fadas"))));
 assert.ok(m.lote.some(x=>x.criaturas_e_povos.some(p=>p.includes("árvores")||p.includes("Árvores"))));
 assert.ok(m.lote.some(x=>x.criaturas_e_povos.some(p=>p.includes("Elementais"))));
 assert.ok(m.lote.some(x=>x.criaturas_e_povos.some(p=>p.includes("Kuo-Toa"))));
 assert.ok(m.lote.some(x=>x.criaturas_e_povos.some(p=>p.includes("Abissais"))));
 assert.ok(m.lote.some(x=>x.criaturas_e_povos.some(p=>p.includes("Tritões"))));
 assert.equal(m.frentes.find(f=>f.id==="frente:macro:ilhas").propostas.length,0);
 assert.equal(m.frentes.find(f=>f.id==="frente:macro:ironwood").propostas.length,2);
 assert.equal(m.frentes.find(f=>f.id==="frente:macro:submersos").propostas.length,2);
 assert.ok(m.lote.every(x=>x.localizacao_exata===null&&x.rota_acesso===null&&
   x.geometria===null&&x.populacao===null));
});
test("Povoamento: deduplicação explícita impede tripla contagem de Portomonte, ilhas e cavernas",()=>{
 const m=build(),g=id=>m.equivalencias.find(x=>x.grupo===id);
 assert.equal(g("portomonte").refs.length,3);
 assert.equal(g("ilhas-costa-sul-coletivo").refs.length,3);
 assert.equal(g("cavernas-kuotoa-coletivo").refs.length,3);
 assert.ok(g("gualapolis").nota.includes("Capital histórica"));
 assert.ok(g("eldroth").nota.includes("Macrorregião florestal"));
 assert.equal(m.equivalencias.length,7);
});
test("Povoamento: validação nega canonização, cidades fictícias e estatísticas indevidas",()=>{
 const fail=(name,edit,pattern)=>{
   const [a,b,h]=copy(edit);
   assert.throws(()=>build(a,b,h),pattern,name);
 };
 fail("aprovação",a=>{a.aprovacao_autoral=true},/proteção autoral/);
 fail("registro duplicado",a=>{a.lugares_catalogados[0].id=a.lugares_catalogados[1].id},/Identificador/);
 fail("semente virou vila",a=>{a.sementes_narrativas[0].conta_como_assentamento=true},/indevidamente contado/);
 fail("espécie virou vila",a=>{a.criaturas_ecologicas_propostas[0].conta_como_assentamento=true},/indevidamente contado/);
 fail("aprovada via contagem",a=>{a.comunidades_novas_propostas[0].conta_como_aprovado=true},/Proposta aprovada/);
 fail("coordenadas",(_,b)=>{b.assentamentos[0].geometria={lat:1}},/coordenadas/);
 fail("população fictícia",(_,b)=>{b.assentamentos[0].populacao=900},/coordenadas/);
 fail("especie ausente",(_,b)=>{b.assentamentos[0].criaturas_e_povos=[]},/identidade e ecologia/);
 fail("identidade",(_,b)=>{b.assentamentos[0].organizacao=""},/identidade e ecologia/);
 fail("falsa equivalência",a=>{a.equivalencias_para_deduplicacao[0].refs.push("inexistente")},/Referência de equivalência ausente/);
 fail("contagem inflada",a=>{a.totais.novos_assentamentos_aprovados=14},/Contagem editorial/);
 fail("lote incompleto",(_,b)=>{b.assentamentos.pop()},/14 comunidades/);
 fail("frente inválida",(_,b)=>{b.assentamentos[0].frente_id="frente:macro:sem-mapa"},/Localidade nova não validada/);
 fail("setor submerso inválido",(_,b)=>{b.assentamentos.find(x=>x.id==="povoamento:xlv:14").setor="garganta"},/Localidade nova não validada/);
});
test("Povoamento: interface mostra 14 propostas, 7 equivalências e registro formal limitado",()=>{
 const el={innerHTML:"",handlers:{},addEventListener(k,cb){this.handlers[k]=cb}};
 initSettlementInventory(el,build());
 assert.equal((el.innerHTML.match(/class="settlement-seed-card(?: active)?"/g)||[]).length,14);
 assert.match(el.innerHTML,/0 novos assentamentos canonizados/);
 const click=tab=>el.handlers.click({target:{closest(k){
    return k==="[data-settlement-view]"?{dataset:{settlementView:tab}}:null;
 } }});
 click("equivalencias");assert.equal((el.innerHTML.match(/class="settlement-equivalence"/g)||[]).length,7);
 click("inventario");assert.match(el.innerHTML,/Os três registros formais existentes/);
 assert.match(el.innerHTML,/nunca o total real de localidades/);
});
test("Povoamento: HTML e workflows carregam dados e testes",()=>{
 const html=read("site/atlas/index.html");
 const pages=read(".github/workflows/publicar-atlas-pages.yml");
 const ci=read(".github/workflows/validar-curadoria.yml");
 assert.match(html,/id="settlementInventory"/);
 assert.match(html,/buildSettlementInventory\(loaded\.settlementInventory,loaded\.creatureSettlements,loaded\.settlementHorizon,state\.macro\)/);
 assert.match(html,/initSettlementInventory\(\$\("settlementInventory"\),state\.settlementInventory\)/);
 assert.match(pages,/data\/atlas\/inventario-povoamento-ciclo44\.json/);
 assert.match(pages,/data\/propostas\/povoamento-criaturas-lote01\.json/);
 assert.match(pages,/data\/atlas\/horizonte-povoamento-macro\.json/);
 assert.match(pages,/tests\/atlas-settlement-inventory\.test\.mjs/);
 assert.match(ci,/tests\/atlas-settlement-inventory\.test\.mjs/);
 const dir=mkdtempSync(join(tmpdir(),"settlements-atlas-"));
 try{const m=html.match(/<script type="module">([\s\S]*?)<\/script>/);assert.ok(m);
   const file=join(dir,"atlas.mjs");writeFileSync(file,m[1],"utf8");
   execFileSync(process.execPath,["--check",file],{stdio:"pipe"});
 }finally{rmSync(dir,{recursive:true,force:true})}
});
