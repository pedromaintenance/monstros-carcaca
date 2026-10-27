# Integração integral de Feiticeiro — Hack Carcaça Dungeon World

**Fonte:** `Hack Carcaça Dungeon World(1).docx`, SHA-256 `b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d`. Data: 27/10/2026.

## Escopo

**42 movimentos, 48 opções, 100 partes e 20 REQUER diretos** preservados sem revisão de mecânica. Cabeçalho FEITICEIRO no parágrafo DOCX 2346, movimentos 2348–2446; próximo cabeçalho BRUXO no parágrafo 2452. Índices de parágrafo começam no zero.

## Fontes de dependência

| Movimento-base | Dependentes |
| --- | ---: |
| Magia no Sangue | 9 |
| Magia Selvagem | 3 |
| Herança Dracônica | 3 |
| Invasão Mental | 2 |
| Manto da Fênix | 1 |
| Telepatia | 1 |
| Entre Sonhos | 1 |

São sete raízes documentais, não subclasses adicionais nem uma hierarquia inventada. Nenhuma origem é obrigatória para todos os movimentos.

## Arquivos

| Camada | Arquivo |
| --- | --- |
| Fonte JSON gzip determinística | `data/lore/hack-carcaca-dw-feiticeiro-integrais.json.gz` |
| Extrator reproduzível | `scripts/extrair_feiticeiro_docx.py` |
| Catálogo JSON legível | `dist/carcaca/hack-sorcerer-movements.json` |
| Índices | `dist/carcaca/hack-sorcerer-movement-indexes.json` |
| Gerador e validador | `scripts/gerar_indices_curadoria.py`, `scripts/validar_curadoria.py` |
| Cliente | `src/carcaca-client.mjs` |

```js
const all=await atlas.getSorcererMovements();
const branch=await atlas.searchSorcererMovements({raizDependencia:"movimento-classe:paragrafo-2348"});
const preview=await atlas.getSorcererRequirementPreview("movimento-classe:paragrafo-2446",{
  movimentosPossuidos:["movimento-classe:paragrafo-2440"]
});
// habilitado_para_compra === null; aplicacao_canonica === false
```

**Regra:** nenhuma transcrição cria uma regra nova, dispensa REQUER ou autoriza aquisição automática. Estado mantido em `transcricao_integral_sem_revisao_mecanica` e `aplicacao_canonica:false`.
