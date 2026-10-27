/**
 * Auditoria de infraestrutura da Carcaça. Não infere edifícios, materiais,
 * reservas, cais, água potável ou saneamento a partir do habitat.
 * Somente leitura e sem efeitos no DW.
 */
const SECTORS=Object.freeze([
 "construcao_abrigo","armazenamento","saneamento","acessos_logistica"
]);
export function auditInfrastructure(profile,{sectorId=null}={}){
 if(!profile||typeof profile.id!=="string"||!profile.id.startsWith("infraestrutura:")||
    !Array.isArray(profile.setores))throw new TypeError("Perfil inválido");
 if(sectorId!==null&&!SECTORS.includes(sectorId))
   throw new RangeError("Setor de infraestrutura inválido");
 const items=profile.setores.filter(s=>sectorId===null||s.id===sectorId);
 if(sectorId!==null&&items.length!==1)throw new RangeError("Setor ausente no perfil");
 return {
   id:profile.id,assentamento_id:profile.assentamento_id,
   estado:"auditoria_sem_mutacao",mutacao_canonica:false,
   setores:items.map(s=>({
     id:s.id,estado:s.estado,
     evidencias:s.ancoras_documentadas.map(x=>({...x})),
     materiais_confirmados:s.materiais_construtivos_confirmados.map(x=>({...x})),
     instalacoes_confirmadas:s.instalacoes_especificas_confirmadas.map(x=>({...x})),
     perguntas:[...s.perguntas_para_o_mestre],
     lacunas:[...s.problemas_em_aberto],
     referencias:[...s.dependencias_relacionadas]
   })),
   efeitos_dw_aplicados:[],
   observacao:"A evidência de terreno ou atividade não equivale à evidência de depósito, sistema sanitário ou técnica de construção."
 };
}
/**
 * Prévia de risco elaborada apenas com pergunta do mestre e dependências
 * previamente curadas. Mesmo se o mestre disser que houve interrupção,
 * não deduz efeito mecânico ou altera o atlas.
 */
export function previewInfrastructureIssue(profile,{sectorId,hipotese}={}){
 if(typeof hipotese!=="string"||hipotese.trim().length<10)
   throw new TypeError("Hipótese deve ser formulada explicitamente");
 const review=auditInfrastructure(profile,{sectorId});
 const item=review.setores[0];
 return {
   estado:"hipotese_nao_ocorrida",mutacao_canonica:false,
   assentamento_id:review.assentamento_id,setor_id:item.id,
   hipotese:hipotese.trim(),perguntas:[...item.perguntas],
   lacunas:[...item.lacunas],dependencias_potencialmente_relevantes:[...item.referencias],
   consequencias_confirmadas:[],efeitos_dw_aplicados:[],
   observacao:"Não vincula automaticamente o risco a um evento de campanha; a fonte não confirma a ocorrência."
 };
}
