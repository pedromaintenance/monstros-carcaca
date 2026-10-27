/**
 * Resumo factual de um dossiê regional de Carcaça.
 * Vetores vazios representam LACUNAS DA CURADORIA, nunca ausência real.
 * Números abaixo contam registros do atlas, NÃO habitantes ou ameaças.
 */
export function reviewRegionalDossier(dossier){
  if(!dossier||!String(dossier.id??"").startsWith("dossie-regional:")||
     !dossier.inventario||!Array.isArray(dossier.perguntas)){
    throw new TypeError("Dossiê regional inválido");
  }
  const inv=dossier.inventario;
  const required=["lugares","assentamentos","criaturas","frentes_propostas",
    "povos_vinculados_a_assentamentos","faccoes_por_associacao_a_criaturas",
    "fluxos","dependencias_materiais","balancos_nao_quantificados",
    "pressoes_ecologicas_hipoteticas","perfis_suporte","perfis_infraestrutura",
    "cenarios_dw_nao_executados","dinamicas_territoriais"];
  if(required.some(key=>!Array.isArray(inv[key])))
    throw new TypeError("Inventário regional incompleto");
  return {
    id:dossier.id,regiao_id:dossier.regiao_id,
    estado:"revisao_sem_mutacao",mutacao_canonica:false,
    indicadores_de_cobertura:Object.fromEntries(required.map(k=>[k,inv[k].length])),
    regioes_das_dinamicas:inv.dinamicas_territoriais.map(x=>({
      id:x.id,papeis_regionais:[...x.papeis_regionais]
    })),
    questoes:[...dossier.perguntas.map(x=>({...x}))],
    lacunas:[...dossier.lacunas],
    aviso_sem_assentamento_curado:inv.assentamentos.length===0,
    interpreta_vazio_como:"nenhum_registro_curado_no_escopo",
    nao_significa:"regiao_desabitada_ou_sem_recursos",
    efeitos_dw_aplicados:[],
    eventos_campanha_confirmados:[],
    observacao:"Contagens de registros não quantificam risco, produção, população nem protagonismo político."
  };
}
