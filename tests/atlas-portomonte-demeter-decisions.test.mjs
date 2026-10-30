import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {buildDemeterDecisionBook,simulateDemeterDecisions} from "../site/atlas/portomonte-demeter-decisions.mjs";
import {initDemeterDecisionBook} from "../site/atlas/portomonte-demeter-decisions-ui.mjs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const json=p=>JSON.parse(read(p));
const raw=json("data/atlas/portomonte-demeter-decisoes-ciclo51.json");
const old=json("data/atlas/viabilidade-material-costa-ciclo50.json");
const places=json("data/lugares_carcaca.json");
const index=json("data/atlas/indice-paginas-fonte-ciclo45.json");
const build=(d=raw,a=old,b=places,c=index)=>buildDemeterDecisionBook(d,a,b,c);
test("LI: seis fatos, sete decisões, 21 alternativas e nenhum efeito canônico",()=>{
 const m=build();
 assert.equal(m.fatos.length,6);
 assert.equal(m.decisoes.length,7);
 assert.equal(m.decisoes.flatMap(x=>x.alternativas).length,21);
 assert.equal(m.balanco.alternativas_aprovadas,0);
 assert.equal(m.balanco.locais_novos,0);
 assert.equal(m.balanco.novas_aprovacoes,0);
 assert.equal(m.balanco.comunidades_propostas_permanecem,96);
 assert.equal(m.balanco.habitats_propostos_permanecem,42);
 assert.ok(m.decisoes.every(x=>x.valor_canonico===null&&x.estado==="em_aberto"));
 assert.ok(m.decisoes.flatMap(x=>x.alternativas).every(x=>
  x.aprovada===false&&x.agua_potavel_comprovada===false&&
  x.rota_criada===false&&x.excedente_comprovado===false));
 assert.equal(m.protecao.aprovacao_automatica,false);
});
test("LI: fatos fundamentados em páginas reais e limites autorais explícitos",()=>{
 const m=build();
 assert.deepEqual(m.fatos.find(x=>x.id==="templo_demeter").paginas,[5,23]);
 assert.deepEqual(m.fatos.find(x=>x.id==="agricultura_documentada").paginas,[5,12,23]);
 assert.ok(m.nao_inferir.some(x=>x.includes("água potável")));
 assert.ok(m.nao_inferir.some(x=>x.includes("demônios do Abismo")));
 assert.ok(m.fatos.every(x=>x.estado==="contexto_documentado_na_fonte"));
});
test("LI: cenário em branco não pressupõe uma única decisão",()=>{
 const m=build(),s=simulateDemeterDecisions(m,{});
 assert.equal(s.escolhas_hipoteticas.length,0);
 assert.equal(s.decisoes_ainda_em_aberto,7);
 assert.equal(s.escolhas_aprovadas,0);
 assert.equal(s.comprova_potabilidade,false);
 assert.equal(s.cria_rotas,false);
});
test("LI: simular cenários não canoniza água, produtividade nem relações geográficas",()=>{
 const m=build();
 const s=simulateDemeterDecisions(m,{
  alcance:"alcance:01",potabilidade:"potabilidade:03",circulacao:"circulacao:02"});
 assert.equal(s.escolhas_hipoteticas.length,3);
 assert.equal(s.decisoes_ainda_em_aberto,4);
 assert.ok(s.temas_materiais_para_estudo.includes("agua"));
 assert.ok(s.temas_materiais_para_estudo.includes("acesso"));
 assert.equal(s.escolhas_aprovadas,0);
 assert.equal(s.altera_canon,false);
 assert.equal(s.comprova_potabilidade,false);
 assert.equal(s.cria_rotas,false);
 assert.equal(m.decisoes.find(x=>x.chave==="potabilidade").valor_canonico,null);
 assert.throws(()=>simulateDemeterDecisions(m,{falso:"falso:01"}),/Tema autoral inexistente/);
 assert.throws(()=>simulateDemeterDecisions(m,{alcance:"potabilidade:01"}),/Alternativa desconhecida/);
});
test("LI: mutações de canonização, fonte, geografia e estado falham",()=>{
 const deny=(name,fn,regex)=>{
  const x=structuredClone(raw);fn(x);assert.throws(()=>build(x),regex,name);
 };
 deny("aprovar conjunto",x=>x.aprovacao_autoral=true,/Caderno autoral/);
 deny("alterar cânone",x=>x.altera_canon=true,/Caderno autoral/);
 deny("coordenadas",x=>x.localizacao={lat:0},/Caderno autoral/);
 deny("raio",x=>x.raio_milhas=10,/Caderno autoral/);
 deny("água potável",x=>x.agua_potavel_confirmada=true,/Caderno autoral/);
 deny("produtividade",x=>x.produtividade_confirmada=true,/Caderno autoral/);
 deny("rotas",x=>x.rotas_comerciais_aprovadas=true,/Caderno autoral/);
 deny("fato quantificado",x=>x.fatos_documentados[0].evidencia_quantitativa=true,/Fato documental/);
 deny("página inválida",x=>x.fatos_documentados[0].paginas=[999],/Fato documental/);
 deny("sem limite documental",x=>x.fatos_documentados[0].limite="",/Fato documental/);
 deny("fato essencial removido",x=>x.fatos_documentados.pop(),/seis evidências/);
 deny("decisão aprovada",x=>x.decisoes[0].valor_canonico="alcance:01",/Decisão estabelecida/);
 deny("decisão sem alternativa",x=>x.decisoes[0].alternativas.pop(),/Decisão estabelecida/);
 deny("novo tema",x=>x.decisoes[0].chave="teleporte",/Decisão estabelecida/);
 deny("opção aprovada",x=>x.decisoes[0].alternativas[0].aprovada=true,/Alternativa não é hipótese/);
 deny("rota por cenário",x=>x.decisoes[0].alternativas[0].rota_criada=true,/Alternativa não é hipótese/);
 deny("água comprovada por cenário",x=>x.decisoes[3].alternativas[0].agua_potavel_comprovada=true,/Alternativa não é hipótese/);
 deny("excedente comprovado por cenário",x=>x.decisoes[5].alternativas[0].excedente_comprovado=true,/Alternativa não é hipótese/);
 deny("efeito territorial aprovado",x=>x.decisoes[0].alternativas[0].efeito_territorial_aprovado=true,/Alternativa não é hipótese/);
 deny("afirmação não condicional",x=>x.decisoes[0].alternativas[0].condicao_explicita="É assim.",/Alternativa não é hipótese/);
 deny("opção duplicada",x=>x.decisoes[0].alternativas[1].id=x.decisoes[0].alternativas[0].id,/Alternativa não é hipótese/);
 deny("caminho de cânone",x=>x.balanco.novas_aprovacoes=1,/Balanço de escolhas/);
 deny("novas cidades",x=>x.balanco.locais_novos=4,/Balanço de escolhas/);
 deny("retirar ressalvas",x=>x.nao_inferir=[],/Salvaguardas/);
});
test("LI: interface reage às escolhas, impactos e limpeza de cenário",()=>{
 const el={innerHTML:"",events:{},addEventListener(name,cb){this.events[name]=cb}};
 initDemeterDecisionBook(el,build(),simulateDemeterDecisions);
 assert.match(el.innerHTML,/Deméter e os limites de Portomonte/);
 assert.equal((el.innerHTML.match(/class="demeter-decision(?: active)?"/g)||[]).length,7);
 const onChange=(key,value)=>el.events.change({target:{closest(x){return x===key?{value}:null}}});
 const click=(key,data)=>el.events.click({target:{closest(x){return x===key?data:null}}});
 onChange("[data-demeter-choice]","alcance:01");
 click("[data-demeter-tab]",{dataset:{demeterTab:"impactos"}});
 assert.match(el.innerHTML,/1<\/b><span>alternativas selecionadas/);
 assert.match(el.innerHTML,/Faixa de influência local/);
 click("[data-demeter-reset]",{});
 assert.match(el.innerHTML,/Nenhuma hipótese selecionada/);
 click("[data-demeter-tab]",{dataset:{demeterTab:"fontes"}});
 assert.match(el.innerHTML,/Seis afirmações sustentadas pelo manuscrito/);
 click("[data-demeter-tab]",{dataset:{demeterTab:"limites"}});
 assert.match(el.innerHTML,/Restrições que as hipóteses não podem ultrapassar/);
});
test("LI: fontes públicas e workflows não expõem transcrição integral",()=>{
 const html=read("site/atlas/index.html");
 const wf=read(".github/workflows/publicar-atlas-pages.yml");
 const ci=read(".github/workflows/validar-curadoria.yml");
 assert.match(html,/id="demeterDecisionBook"/);
 assert.match(html,/import \{buildDemeterDecisionBook,simulateDemeterDecisions\} from "\.\/portomonte-demeter-decisions\.mjs"/);
 assert.match(html,/buildDemeterDecisionBook\(loaded\.demeterBook,loaded\.coastMaterial,loaded\.places,loaded\.authoredPages\)/);
 assert.match(html,/initDemeterDecisionBook\(\$\("demeterDecisionBook"\),state\.demeterBook,simulateDemeterDecisions\)/);
 assert.match(wf,/data\/atlas\/portomonte-demeter-decisoes-ciclo51\.json/);
 assert.match(wf,/tests\/atlas-portomonte-demeter-decisions\.test\.mjs/);
 assert.match(ci,/tests\/atlas-portomonte-demeter-decisions\.test\.mjs/);
 assert.doesNotMatch(wf,/^\s+fontes\/autoria\/hack-carcaca-dw-capitulo-i\.paginas\.json\s*$/m);
 const dir=mkdtempSync(join(tmpdir(),"demeter-li-"));
 try{const script=html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);const file=join(dir,"inline.mjs");writeFileSync(file,script);
  execFileSync(process.execPath,["--check",file],{stdio:"pipe"});
 }finally{rmSync(dir,{recursive:true,force:true})}
});