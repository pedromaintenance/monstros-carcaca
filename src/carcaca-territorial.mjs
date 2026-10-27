/**
 * Dinâmicas territoriais: distinguir evidência regional e evento específico.
 * O motor não atribui ataques, migração ou deslocados a Portomonte
 * por inferência. Não modifica registros de assentamentos ou campanhas.
 */
export function previewTerritorialImpact(dinamica,{assentamentoId=null}={}){
  if(!dinamica||!String(dinamica.id??"").startsWith("dinamica:"))
    throw new TypeError("Dinâmica territorial inválida");
  if(assentamentoId!==null&&
     (typeof assentamentoId!=="string"||!assentamentoId.startsWith("assentamento:")))
    throw new TypeError("Assentamento inválido");
  const confirmedTarget=assentamentoId!==null&&dinamica.assentamento_alvo_id===assentamentoId;
  const known=dinamica.escala==="regional";
  return {
    id:dinamica.id,escala:dinamica.escala,
    estado:"previa_sem_mutacao",mutacao_canonica:false,
    foco_consultado:assentamentoId,
    alvo_nomeado_no_registro:confirmedTarget,
    evento_especifico_confirmado:false,
    somente_evidencia_regional:known,
    atribuicao_automatica_bloqueada:assentamentoId!==null&&!confirmedTarget,
    regioes:{origem:dinamica.origem_regiao_id,destino:dinamica.destino_regiao_id},
    possibilidades_materiais:[...dinamica.dimensoes_possivelmente_afetadas],
    fatos_documentados:dinamica.fato_documentado,
    lacunas:[...dinamica.lacunas],
    perguntas:[...dinamica.perguntas],
    efeito_proposto:dinamica.possibilidade_narrativa,
    efeitos_dw_aplicados:[],
    observacao:"Fatos regionais não implicam ataques a cidades identificadas, presença local de refugiados ou mudança automática de tags DW."
  };
}
