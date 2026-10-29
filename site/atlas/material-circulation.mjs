/** Circulação material: relações textuais não são arestas cartográficas ou séries de volume. */
export function buildMaterialCirculation(data,macro,networks,chrono){
 if(!data||data.schema_version!=="1.0"||data.estado!=="rede_material_documental_qualitativa"||
    data.aprovacao_autoral!==false||data.altera_canon!==false||
    data.representacao!=="relacoes_sem_rota_ou_volume")
    throw new Error("Camada material sem proteção autoral");
 if(!Array.isArray(macro?.setores)||!Array.isArray(networks?.redes)||
    !Array.isArray(networks?.esferas)||!Array.isArray(chrono?.eventos))
    throw new Error("Dependências macro/históricas incompletas");
 if(/"(?:latitude|longitude|lat|lng|coordinates|polygon|poligono|fronteira_definida|fluxo_medido)"\s*:/i.test(JSON.stringify(data)))
    throw new Error("A camada não permite geometria, fronteira ou medição inventada");
 const sectors=new Set(macro.setores.map(x=>x.id));
 const net=new Map(networks.redes.map(x=>[x.id,x]));
 const spheres=new Map(networks.esferas.map(x=>[x.id,x]));
 const funcs=new Set(["circulacao","extracao","producao","transformacao","armazenagem","distribuicao",
  "informacao","resistencia","deslocamento","acolhimento","comercio","conflito","cultura-marinha",
  "autossuficiencia","comercio-subterraneo","pressao"]);
 const modes=new Set(["cobranca_documentada","abastecimento_documentado","transferencia_documentada",
  "contribuicao_documentada","deslocamento_documentado","articulacao_documentada","pressao_documentada"]);
 const kinds=new Set(["tributacao","trabalho_forcado","transformacao_mineral","provisao_de_ferramentas",
  "abastecimento","refugio","comercio_costeiro","pilhagem","circulacao_sazonal","acolhimento_alimentar",
  "troca_subterranea","contato_clandestino","exigencia_tributaria"]);
 const requirePages=(x)=>{if(!Array.isArray(x.paginas)||!x.paginas.length||
   x.paginas.some(p=>!Number.isInteger(p)||p<2||p>25))
     throw new Error("Página não vinculada ao manuscrito: "+x.id)};
 const nodes=new Map();
 for(const n of data.nodos||[]){
   if(!n.id||nodes.has(n.id)||!n.titulo||!sectors.has(n.setor)||!funcs.has(n.funcao))
     throw new Error("Nó material duplicado ou malformado: "+n.id);
   requirePages(n);
   if(n.coordenadas!==null||n.capacidade!==null)
     throw new Error("Nó material ganhou posição ou capacidade inferida: "+n.id);
   if(!n.evidencia)throw new Error("Nó sem evidência: "+n.id);
   if(n.ref_rede!==null){
     const x=net.get(n.ref_rede);
     if(!x||!x.setores.some(s=>s===n.setor))
       throw new Error("Rede temática ausente ou setor incompatível: "+n.id);
   }
   if(n.ref_esfera!==null){
     const e=spheres.get(n.ref_esfera);
     if(!e||e.setor!==n.setor)
       throw new Error("Esfera política incompatível: "+n.id);
   }
   nodes.set(n.id,n);
 }
 if(nodes.size!==24)throw new Error("Não foram preservados os 24 nós materiais");
 const links=new Map();
 for(const e of data.vinculos||[]){
   if(!e.id||links.has(e.id)||!nodes.has(e.de)||!nodes.has(e.para)||e.de===e.para||
      !kinds.has(e.tipo)||!modes.has(e.modalidade))
     throw new Error("Vínculo material incorreto: "+e.id);
   requirePages(e);
   if(!e.evidencia||!e.limite)throw new Error("Vínculo sem origem ou limite de inferência: "+e.id);
   if(e.geometria!==null||e.rota_confirmada!==false||e.volume!==null||
      e.custo!==null||e.frequencia!==null)
     throw new Error("Vínculo material convertido em rota ou métrica: "+e.id);
   if(e.tipo==="trabalho_forcado"&&
      (e.de!=="fluxo:xli:drakport"||e.para!=="fluxo:xli:corte-rio"))
     throw new Error("Trabalho forçado registrado fora da referência de Drakport");
   if(e.tipo==="pilhagem"&&
      (e.de!=="fluxo:xli:caatinga-grupos"||e.para!=="fluxo:xli:fazendas-costa"))
     throw new Error("Pilhagens generalizadas para toda a Caatinga");
   if(e.tipo==="exigencia_tributaria"&&e.modalidade!=="pressao_documentada")
     throw new Error("Exigência de tributo confundida com pagamento realizado");
   if(e.tipo==="refugio"&&e.modalidade!=="deslocamento_documentado")
     throw new Error("Refúgio convertido em rota precisa");
   if(e.ref_rede!==null){
     const n=net.get(e.ref_rede);
     if(!n||![nodes.get(e.de).setor,nodes.get(e.para).setor].every(s=>n.setores.includes(s)))
       throw new Error("Rede macro não sustenta vínculo material: "+e.id);
   }
   links.set(e.id,e);
 }
 if(links.size!==15)throw new Error("Os 15 vínculos documentais não foram preservados");
 const gaps=new Map();
 for(const x of data.lacunas||[]){
   if(!x.id||gaps.has(x.id)||!x.pergunta||!nodes.has(x.ref_nodo)||
      x.resolvida!==false||x.rota_aferida!==false)
     throw new Error("Lacuna material resolvida ou incompleta");
   gaps.set(x.id,x);
 }
 if(gaps.size!==12)throw new Error("As doze lacunas devem permanecer em aberto");
 const requiredEdges=["tributos-rio","drakport-coercao","minerio-forjas","eldroth-costa","eldroth-thargrid",
  "caatinga-pradarias","grama-fugitivos","svirf-gemas","anoes-svirf","ironwood-druidas","abissais-costa"];
 if(requiredEdges.some(id=>!links.has("vinculo:xli:"+id)))
   throw new Error("Um elo documental essencial foi omitido");
 const reqNodes=["mercados-rio","corte-rio","minas-thargrid","grama-cultivos","portomonte","abissais-marinhos"];
 if(reqNodes.some(id=>!nodes.has("fluxo:xli:"+id)))throw new Error("Um nó material essencial foi omitido");
 if(!data.criterio?.includes("Um vínculo registra relação documental")||
    !data.guardrails||data.guardrails.length<10)
   throw new Error("A rede material perdeu as limitações metodológicas");
 return {titulo:data.titulo,criterio:data.criterio,altera_canon:false,
   nodos:[...nodes.values()],vinculos:[...links.values()],lacunas:[...gaps.values()],
   guardrails:data.guardrails,totais:{nodos:nodes.size,vinculos:links.size,lacunas:gaps.size,
     rotas_confirmadas:0,volumes_confirmados:0},
   grupos:[...new Set([...nodes.values()].map(n=>n.setor))].map(setor=>({
     setor,nodos:[...nodes.values()].filter(n=>n.setor===setor)}))};
}
