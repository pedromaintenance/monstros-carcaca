# Integração integral de Druida — Hack Carcaça Dungeon World

**Ciclo:** 27/10/2026. Fonte primária: `Hack Carcaça Dungeon World(1).docx` — SHA-256 `b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d`.

## Integridade e cobertura

A seção **DRUIDA** contém **27 movimentos**, com âncoras DOCX **2130–2199** (índices zero-based), **42 opções**, **74 partes** de corpo/opção/continuação e **13 REQUER**. As condições são 12 referências literais diretas e uma conjunção `e` de dois movimentos; nenhuma mecânica foi acrescentada.

## Conjunção: Forma Primordial

`FORMA PRIMORDIAL` exige simultaneamente `METAMORFOSE` **E** `MAESTRIA ELEMENTAL`. Esses movimentos têm IDs próprios e continuam distintos. A modelagem é `requisito_estruturado.tipo:"todos"`, com dois componentes `movimento_exato`. Mesmo a presença dos dois não libera aquisição automática.

## Ramos documentados

| Raiz de REQUER | Dependentes diretos ou componentes de conjunção |
| --- | ---: |
| Metamorfose | 8 |
| Maestria Elemental | 1 |
| Círculo dos Esporos | 3 |
| Fogo Selvagem | 2 |

Forma Primordial é incluída em duas contagens acima porque possui **dois** pré-requisitos; portanto, a soma de arestas (14) é maior que o número de movimentos dependentes (13). A tabela expressa dependências **do manuscrito**, não subclasses inventadas.

## Artefatos

| Camada | Caminho |
| --- | --- |
| Transcrição fonte | `data/lore/hack-carcaca-dw-druida-integrais.json` |
| Extrator reproduzível | `scripts/extrair_druida_docx.py` |
| JSON distribuído | `dist/carcaca/hack-druid-movements.json` |
| Índices distribuídos | `dist/carcaca/hack-druid-movement-indexes.json` |
| Cliente ESM | `src/carcaca-client.mjs` |

## Consulta JavaScript

```js
const druida = await atlas.getDruidMovements(); // 27
const esporos = await atlas.searchDruidMovements({requer:"Círculo dos Esporos"});
const preview = await atlas.getDruidRequirementPreview("movimento-classe:paragrafo-2146", {
  movimentosPossuidos:["movimento-classe:paragrafo-2130"]
});
// Maestria Elemental ausente, habilitado_para_compra === null.
```

**Limites:** `aplicacao_canonica:false`, `estado:transcricao_integral_sem_revisao_mecanica`; diagnóstico de REQUER não equivale à homologação ou concessão, nem altera campanhas.
