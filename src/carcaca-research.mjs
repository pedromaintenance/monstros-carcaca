/**
 * Inspeciona prioridades editoriais sem resolver perguntas, abrir arquivos,
 * criar localidade, alterar canon ou produzir eventos de campanha.
 */
export function reviewResearchBacklog(items,{regiaoId=null}={}){
 if(!Array.isArray(items))throw new TypeError("A fila deve ser um array");
 if(regiaoId!==null && (typeof regiaoId!=="string"||!regiaoId.startsWith("regiao:")))
   throw new TypeError("Região inválida");
 const byQuestion=new Map();
 for(const x of items){
   if(!x||typeof x.pergunta_id!=="string"||byQuestion.has(x.pergunta_id)||
      !Array.isArray(x.depende_de_perguntas))
      throw new TypeError("Itens ou IDs de perguntas inválidos/duplicados");
   byQuestion.set(x.pergunta_id,x);
 }
 const relevant=items.filter(x=>!regiaoId||x.regiao_id===regiaoId);
 const entries=relevant.map(item=>{
   const pendencias=item.depende_de_perguntas.map(id=>{
     const prev=byQuestion.get(id);
     if(!prev)throw new RangeError("Pré-requisito ausente da fila: "+id);
     return {pergunta_id:id,estado:prev.estado,respondido:false};
   });
   return {
     id:item.id,pergunta_id:item.pergunta_id,regiao_id:item.regiao_id,
     estado:item.estado,ordem_editorial:item.ordem_editorial,
     depende_de_perguntas:pendencias,
     evidencia_pendente:item.resposta_confirmada===null,
     evidencias_necessarias:[...item.evidencias_necessarias],
     artefatos_potenciais:[...item.artefatos_potenciais],
     criacao_canonica_autorizada:false
   };
 });
 return {
   estado:"revisao_editorial_sem_mutacao",
   mutacao_canonica:false,
   filtro_regiao:regiaoId,
   total_na_visao:entries.length,
   priorizadas:entries.filter(x=>x.ordem_editorial!==null).length,
   nao_priorizadas:entries.filter(x=>x.ordem_editorial===null).length,
   perguntas_respondidas:0,
   registros:entries,
   efeitos_dw_aplicados:[],
   observacao:"Precedências são de trabalho editorial, não causalidade na lore. Nenhuma pergunta foi respondida nem uma ação executada."
 };
}
