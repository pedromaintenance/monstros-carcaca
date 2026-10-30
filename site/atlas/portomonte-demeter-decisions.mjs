/** Ciclo LI: curadoria de Portomonte com cenários autorais sem aprovação automática. */
const normal=x=>String(x||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toLowerCase();
const resourceAxes=new Set(["agua","alimento","energia","materiais","trabalho","acesso"]);
export function buildDemeterDecisionBook(data,material,places,pageIndex){
 const fail=x=>{throw Error(x)};
 if(data?.schema_version!=="1.0"||data.estado!=="caderno_de_decisao_autoral_nao_homologado"||
   data.altera_canon!==false||data.aprovacao_autoral!==false||
   data.consequencias_sem_quantificacao!==true||
   data.localizacao!==null||data.raio_milhas!==null||
   data.agua_potavel_confirmada!==false||data.limite_bencao_aprovado!==false||
   data.rotas_comerciais_aprovadas!==false||data.produtividade_confirmada!==false)
  fail("Caderno autoral promovido a cânone ou a dados geográficos");
 if(material?.balanco?.celulas_de_auditoria!==90||
   material.balanco?.comunidades_propostas_anteriores!==96||
   material.balanco?.locais_com_viabilidade_homologada!==0||
   !places?.lugares?.some(x=>x.id==="lugar:portomonte"&&x.estado==="documentado")||
   pageIndex?.texto_autoral_incluido!==false||!Array.isArray(pageIndex.paginas))
  fail("Faltam fontes revisadas ou a proteção do texto autoral");
 const validPages=new Set(pageIndex.paginas.map(x=>x.pagina));
 const factIds=new Set(),decisionIds=new Set(),keys=new Set(),options=new Set();
 if(data.fatos_documentados?.length!==6||data.decisoes?.length!==7)
  fail("A estrutura de seis evidências e sete decisões foi modificada");
 for(const f of data.fatos_documentados){
  if(!f.id||factIds.has(f.id)||f.estado!=="contexto_documentado_na_fonte"||
    !f.afirmacao||f.afirmacao.length<65||!f.limite||f.limite.length<55||
    !Array.isArray(f.paginas)||!f.paginas.length||
    f.paginas.some(p=>!validPages.has(p))||f.evidencia_quantitativa!==false)
   fail("Fato documental insuficiente ou convertido em dado mensurável: "+f.id);
  factIds.add(f.id);
 }
 const requiredFacts=["portomonte_documentada","templo_demeter","agricultura_documentada",
  "comercio_documentado","contexto_costeiro","contexto_religioso"];
 if(requiredFacts.some(id=>!factIds.has(id)))fail("Uma âncora documental essencial foi retirada");
 const requiredKeys=["alcance","mecanismo","duracao","potabilidade","governanca","producao","circulacao"];
 for(const d of data.decisoes){
  if(!d.id||decisionIds.has(d.id)||keys.has(d.chave)||
    !requiredKeys.includes(d.chave)||d.estado!=="em_aberto"||
    d.valor_canonico!==null||!d.pergunta||d.pergunta.length<20||
    !d.limite_documental||d.limite_documental.length<75||
    !Array.isArray(d.alternativas)||d.alternativas.length!==3)
   fail("Decisão estabelecida sem aprovação ou sem alternativas: "+d?.id);
  keys.add(d.chave);decisionIds.add(d.id);
  for(const a of d.alternativas){
   if(!a.id||options.has(a.id)||!a.id.startsWith(d.chave+":")||
     a.aprovada!==false||a.estado!=="hipotese_autoral_nao_aprovada"||
     a.rota_criada!==false||a.agua_potavel_comprovada!==false||
     a.excedente_comprovado!==false||a.efeito_territorial_aprovado!==false||
     !a.condicao_explicita?.startsWith("Se ")||a.condicao_explicita.length<110||
     !a.titulo||a.titulo.length<12||
     !a.pergunta_de_consequencia||a.pergunta_de_consequencia.length<50||
     !Array.isArray(a.eixos_potencialmente_afetados)||
     a.eixos_potencialmente_afetados.length<2||
     a.eixos_potencialmente_afetados.some(x=>!resourceAxes.has(x)))
     fail("Alternativa não é hipótese segura ou criou consequência comprovada: "+a?.id);
   options.add(a.id);
  }
 }
 if(requiredKeys.some(k=>!keys.has(k))||options.size!==21)
  fail("Decisões ou cenários incompatíveis com sete temas e 21 possibilidades");
 const totals={evidencias_documentadas:6,decisoes_abertas:7,
  alternativas_contrafactuais:21,alternativas_aprovadas:0,locais_novos:0,
  comunidades_propostas_permanecem:96,habitats_propostos_permanecem:42,
  novas_aprovacoes:0};
 for(const [k,n] of Object.entries(totals))
  if(data.balanco?.[k]!==n)fail("Balanço de escolhas inventa aprovações ou locais: "+k);
 if(!Array.isArray(data.nao_inferir)||data.nao_inferir.length<11||
   !data.nao_inferir.some(x=>x.includes("água potável"))||
   !data.nao_inferir.some(x=>x.includes("demônios do Abismo"))||
   !data.nao_inferir.some(x=>x.includes("manuscrito")))
  fail("Salvaguardas da fonte foram suprimidas");
 if(material.ancora_portomonte?.eixos?.[0]?.estado!=="efeito_local_documentado_sem_potabilidade"||
    material.ancora_portomonte?.eixos?.[1]?.estado!=="agricultura_local_documentada_sem_quantificacao"||
    material.ancora_portomonte?.eixos?.[5]?.estado!=="centralidade_comercial_documentada_sem_rotas")
   fail("O relatório anterior de Portomonte perdeu o contexto documentado");
 return {titulo:data.titulo,fatos:data.fatos_documentados,decisoes:data.decisoes,
  nao_inferir:data.nao_inferir,orientacao:data.orientacao,proximas_perguntas:data.proximas_perguntas,
  balanco:totals,protecao:{sem_novas_localidades:true,aprovacao_automatica:false,
   agua_potavel_documentada:false,efeito_quantificado:false}};
}
export function simulateDemeterDecisions(book,selected={}){
 if(!book?.proteção && !book?.protecao)throw Error("Caderno de decisões não validado");
 if(!selected||typeof selected!=="object"||Array.isArray(selected))throw Error("Seleções inválidas");
 const allowed=new Map(book.decisoes.map(d=>[d.chave,d]));
 for(const key of Object.keys(selected))if(!allowed.has(key))throw Error("Tema autoral inexistente: "+key);
 const notes=[],topics=new Set();
 for(const d of book.decisoes){
   const chosen=selected[d.chave]??null;
   if(chosen===null||chosen==="em_aberto")continue;
   const opt=d.alternativas.find(x=>x.id===chosen);
   if(!opt)throw Error("Alternativa desconhecida para "+d.chave);
   notes.push({decisao:d.chave,pergunta:d.pergunta,alternativa_id:opt.id,
     alternativa:opt.titulo,condicional:opt.condicao_explicita,
     pergunta_aberta:opt.pergunta_de_consequencia});
   for(const t of opt.eixos_potencialmente_afetados)topics.add(t);
 }
 return {escolhas_hipoteticas:notes,decisoes_ainda_em_aberto:book.decisoes.length-notes.length,
  temas_materiais_para_estudo:[...topics].sort(),escolhas_aprovadas:0,
  altera_canon:false,comprova_potabilidade:false,cria_rotas:false,
  aviso:"Esta simulação compara alternativas autorais não homologadas. Selecionar não aprova nem grava fatos no mundo."};
}
