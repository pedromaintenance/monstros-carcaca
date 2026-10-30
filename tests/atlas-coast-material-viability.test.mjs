import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {buildCoastMaterialViability} from "../site/atlas/coast-material-viability.mjs";
import {initCoastMaterialViability} from "../site/atlas/coast-material-viability-ui.mjs";
import {buildSettlementDensityAudit} from "../site/atlas/settlement-density.mjs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const j=p=>JSON.parse(read(p));
const source=j("data/atlas/viabilidade-material-costa-ciclo50.json");
const coast=j("data/propostas/povoamento-costa-continental-ciclo49.json");
const places=j("data/lugares_carcaca.json");
const pages=j("data/atlas/indice-paginas-fonte-ciclo45.json");
const audit=buildSettlementDensityAudit(
 j("data/atlas/auditoria-povoamento-transversal-ciclo48.json"),
 j("data/atlas/horizonte-povoamento-macro.json"),
 j("data/atlas/inventario-povoamento-ciclo44.json"),
 j("data/propostas/povoamento-criaturas-lote01.json"),
 j("data/propostas/povoamento-regional-lote02-ciclo45.json"),
 j("data/propostas/povoamento-quatro-frentes-ciclo46.json"),
 j("data/propostas/povoamento-insular-submerso-cauda-ciclo47.json"));
const build=(x=source,c=coast,p=places,q=pages,a=audit)=>buildCoastMaterialViability(x,c,p,q,a);
test("L: Portomonte e quatorze propostas, seis eixos cada, sem novas cidades",()=>{
 const m=build(),sites=[m.portomonte,...m.comunidades];
 assert.equal(sites.length,15);
 assert.equal(m.comunidades.length,14);
 assert.equal(m.eixos.length,6);
 assert.equal(sites.reduce((s,x)=>s+x.eixos.length,0),90);
 assert.equal(m.cenarios.length,6);
 assert.deepEqual(m.balanco,{portomonte_ancora_documentada:1,
  comunidades_propostas_analisadas:14,eixos_por_local:6,celulas_de_auditoria:90,
  cenarios_qualitativos:6,dependencias_canonicas_comprovadas:0,recursos_quantificados:0,
  locais_com_viabilidade_homologada:0,comunidades_propostas_anteriores:96,
  habitats_propostos_anteriores:42,novos_assentamentos:0,aprovacoes_novas:0});
 assert.ok(sites.every(x=>x.viabilidade_comprovada===false&&x.dependencia_confirmada===false&&x.localizacao===null));
 assert.ok(sites.every(x=>x.eixos.every(a=>a.demonstracao_material===false&&a.disponibilidade_garantida===false)));
 assert.equal(m.validacao_hidrica,0);
 assert.equal(m.validacao_logistica,0);
});
test("L: Portomonte documentada, agricultura sim; potabilidade e produtividade não",()=>{
 const m=build(),p=m.portomonte;
 assert.equal(p.lugar_documentado_id,"lugar:portomonte");
 assert.equal(p.eixos[0].estado,"efeito_local_documentado_sem_potabilidade");
 assert.equal(p.eixos[1].estado,"agricultura_local_documentada_sem_quantificacao");
 assert.equal(p.eixos[5].estado,"centralidade_comercial_documentada_sem_rotas");
 assert.match(p.eixos[0].analise,/Potabilidade/);
 assert.ok(m.comunidades.every(x=>x.eixos.every(v=>v.estado==="necessidade_hipotetica_nao_verificada")));
 assert.ok(m.advertencias.some(v=>v.includes("Abissais não são demônios")));
});
test("L: cenário sensível é ferramenta de perguntas e não previsão",()=>{
 const m=build();
 for(const x of m.cenarios){
  assert.equal(x.evento_confirmado,false);
  assert.equal(x.probabilidade,null);
  assert.equal(x.impacto_quantificado,null);
  assert.equal(x.risco_real_quantificado,false);
  assert.equal(x.contagem_de_mencoes_condicionais,x.expostos_por_tag.length);
  assert.ok(x.expostos_por_tag.every(z=>m.comunidades.some(c=>c.id===z.id)||z.id===m.portomonte.id));
 }
 const drought=m.cenarios.find(x=>x.exposicao_primaria==="agua");
 assert.equal(drought.contagem_de_mencoes_condicionais,15);
 const coast=m.cenarios.find(x=>x.exposicao_primaria==="incursoes");
 assert.ok(coast.contagem_de_mencoes_condicionais>0);
});
test("L: bloquear inferência de água, energia, fluxos, população, mapas e eventos reais",()=>{
 const deny=(label,fn,pattern)=>{
  const input=structuredClone(source);fn(input);assert.throws(()=>build(input),pattern,label);
 };
 deny("canonizar lote",x=>x.aprovacao_autoral=true,/separação/);
 deny("trocar estado",x=>x.estado="aprovado",/separação/);
 deny("falsa potabilidade",x=>x.ancora_portomonte.eixos[0].disponibilidade_garantida=true,/Recurso material/);
 deny("água abundante",x=>x.comunidades[0].eixos[0].demonstracao_material=true,/Recurso material/);
 deny("abastecimento aprovado",x=>x.comunidades[0].eixos[1].estado="documentado",/Evidência atribuída/);
 deny("rota conhecida",x=>x.ancora_portomonte.dependencia_confirmada=true,/quantificada/);
 deny("população",x=>x.comunidades[0].capacidade_populacional=1000,/quantificada/);
 deny("localização",x=>x.comunidades[0].localizacao={lat:0},/quantificada/);
 deny("estoque conhecido",x=>x.comunidades[0].quantidade_recursos=100,/quantificada/);
 deny("viabilidade comprovada",x=>x.comunidades[0].viabilidade_comprovada=true,/quantificada/);
 deny("remover eixo",x=>x.comunidades[0].eixos.pop(),/Eixos de auditoria incompletos/);
 deny("trocar ordem de eixos",x=>{const t=x.comunidades[0].eixos[0];x.comunidades[0].eixos[0]=x.comunidades[0].eixos[1];x.comunidades[0].eixos[1]=t},/Recurso material/);
 deny("fonte de Portomonte",x=>x.ancora_portomonte.paginas_contexto=[999],/Portomonte confundida/);
 deny("arvore falsa",x=>x.comunidades[0].comunidade_id="cidade:falsa",/não corresponde/);
 deny("comunidade extra",x=>x.comunidades.push(structuredClone(x.comunidades[0])),/Fontes do ciclo/);
 deny("comunidade faltante",x=>x.comunidades.pop(),/Fontes do ciclo/);
 deny("cenário vira fato",x=>x.cenarios[0].evento_confirmado=true,/Cenário probabilístico/);
 deny("probabilidade inventada",x=>x.cenarios[0].probabilidade=0.75,/Cenário probabilístico/);
 deny("impacto inventado",x=>x.cenarios[0].impacto_quantificado=900,/Cenário probabilístico/);
 deny("tag sem fonte",x=>x.cenarios[0].tags_de_sensibilidade=["inventada"],/Cenário probabilístico/);
 deny("cenário sem limite",x=>x.cenarios[0].limite="",/Cenário probabilístico/);
 deny("cenário ausente",x=>x.cenarios.pop(),/Fontes do ciclo/);
 deny("recursos quantificados",x=>x.balanco.recursos_quantificados=5,/Balanço material/);
 deny("aprova cidade",x=>x.balanco.aprovacoes_novas=1,/Balanço material/);
 deny("remover ressalvas",x=>x.advertencias=[],/Salvaguardas/);
});
test("L: interações percorrem locais, eixos, cenários e retorno à matriz",()=>{
 const el={innerHTML:"",events:{},addEventListener(k,cb){this.events[k]=cb}};
 initCoastMaterialViability(el,build());
 assert.match(el.innerHTML,/De que vive a Costa Sul\?/);
 assert.match(el.innerHTML,/Portomonte/);
 assert.equal((el.innerHTML.match(/class="material-axis(?: active)?"/g)||[]).length,6);
 const click=(target,selector)=>el.events.click({target:{closest(k){return k===selector?target:null}}});
 click({dataset:{materialAxis:"energia"}},"[data-material-axis]");
 assert.match(el.innerHTML,/Energia, calor e conservação/);
 el.events.change({target:{closest(k){return k==="[data-material-site]"?{value:"viabilidade:l:costa:07"}:null}}});
 assert.match(el.innerHTML,/A Fenda das Conchas Ocas/);
 click({dataset:{materialTab:"cenarios"}},"[data-material-tab]");
 assert.match(el.innerHTML,/Os cenários abaixo são contrafactuais/);
 el.events.change({target:{closest(k){return k==="[data-material-scenario]"?{value:"cenario:l:03"}:null}}});
 assert.match(el.innerHTML,/Perda de colheita nas pradarias/);
 click({dataset:{materialTab:"fontes"}},"[data-material-tab]");
 assert.match(el.innerHTML,/O que o manuscrito realmente confirma/);
});
test("L: integrado ao Atlas, CI e Pages sem publicar manuscrito integral",()=>{
 const html=read("site/atlas/index.html"),ci=read(".github/workflows/validar-curadoria.yml"),
   wf=read(".github/workflows/publicar-atlas-pages.yml");
 assert.match(html,/id="coastMaterialViability"/);
 assert.match(html,/import \{buildCoastMaterialViability\} from "\.\/coast-material-viability\.mjs"/);
 assert.match(html,/buildCoastMaterialViability\(loaded\.coastMaterial,loaded\.continentalCoast,loaded\.places,loaded\.authoredPages,state\.settlementDensity\)/);
 assert.match(html,/initCoastMaterialViability\(\$\("coastMaterialViability"\),state\.coastMaterial\)/);
 assert.match(wf,/data\/atlas\/viabilidade-material-costa-ciclo50\.json/);
 assert.match(wf,/tests\/atlas-coast-material-viability\.test\.mjs/);
 assert.match(ci,/tests\/atlas-coast-material-viability\.test\.mjs/);
 assert.doesNotMatch(wf,/^\s+fontes\/autoria\/hack-carcaca-dw-capitulo-i\.paginas\.json\s*$/m);
 const tmp=mkdtempSync(join(tmpdir(),"material-costa-"));
 try{
  const inline=html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];assert.ok(inline);
  const file=join(tmp,"atlas.mjs");writeFileSync(file,inline);
  execFileSync(process.execPath,["--check",file],{stdio:"pipe"});
 }finally{rmSync(tmp,{force:true,recursive:true})}
});