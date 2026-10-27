# Bardo — quinta classe integral do Hack Carcaça DW

**Ciclo:** 27/10/2026. **Fonte:** `Hack Carcaça Dungeon World(1).docx` (181 páginas).
**SHA-256 da fonte:** `b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d`.

## Escopo e integridade

O inventário de 632 títulos inclui **32 movimentos de BARDO**. Todos os 32 foram transcritos integralmente, com âncoras documentais zero-based **1753–1851**, 34 opções em listas e 103 partes (corpo, continuação e opção).

- 27 movimentos não possuem `REQUER:` literal.
- Quatro dependências de título têm alvo único: **Inspiração Contagiosa** → **Inspiração Bárdica**; **A Dança das Coisas** → **Canção da Criação**; **Harmonia Arcana** → **Arte Arcana**; **Hoje a Festa É Sua, Hoje a Festa É Nossa** → **Arte Arcana**.
- A quinta dependência é uma condição cumulativa com cardinalidade: **A Canção que Fez o Mundo**, `REQUER: Arte Arcana e dois outros Movimentos de Bardo`.

A interpretação derivada do requisito cardinal guarda dois componentes simultâneos:
1. Possuir `Arte Arcana` (ID `movimento-classe:paragrafo-1753`).
2. Possuir **dois outros movimentos distintos de Bardo**, excluindo Arte Arcana da contagem e, naturalmente, o próprio movimento que está sendo adquirido.

A propriedade `quantidade_minima:2` **não** pode ser satisfeita com duas cópias do mesmo ID, um movimento de outra classe, nem com a dupla contagem de Arte Arcana. O cadastro não verifica aprovação mecânica, compra ou resultado da ficção.

## Contrato de arquivos

| Camada | Arquivo |
| --- | --- |
| Texto integral preservado | `data/lore/hack-carcaca-dw-bardo-integrais.json` |
| Extrator reproduzível | `scripts/extrair_bardo_docx.py` |
| Inventário de títulos compartilhado | `data/lore/hack-carcaca-dw-inventario-classes-requer.json` |
| Indexador | `scripts/hack_movimentos_personagem.py` |
| Publicação | `dist/carcaca/hack-bard-movements.json` |
| Índices públicos | `dist/carcaca/hack-bard-movement-indexes.json` |
| Cliente de leitura | `src/carcaca-client.mjs` |
| Validação | `scripts/validar_curadoria.py` e `tests/carcaca-client.test.mjs` |

O manifest recebe `hack_bard_movements` e `hack_bard_movement_indexes`. No inventário público, os 32 registros de Bardo passam a ter `texto_integral_disponivel:true` e `texto_integral_id`, sem promover `texto_integral_curado:false`.

A geração usa `python scripts/gerar_indices_curadoria.py`; `--check` confirma que a saída está atualizada.

## Exemplo de consulta

```js
import {createCarcacaAtlas} from "./src/carcaca-client.mjs";

const atlas=createCarcacaAtlas({
  baseUrl:"https://raw.githubusercontent.com/pedromaintenance/monstros-carcaca/main/dist/carcaca"
});

const bardo=await atlas.getBardMovements(); // 32
const comEscolhas=await atlas.searchBardMovements({comOpcoes:true});
const acumulativos=await atlas.searchBardMovements({tipoRequisito:"todos"});
const indice=await atlas.getBardMovementIndexes();

const canção="movimento-classe:paragrafo-1843";
const preview=await atlas.getBardRequirementPreview(canção,{
  movimentosPossuidos:[
    "movimento-classe:paragrafo-1753", // Arte Arcana
    "movimento-classe:paragrafo-1798", // Inspiração Bárdica
    "movimento-classe:paragrafo-1816"  // Canção da Criação
  ]
});
// preview.verificacao_estrutural === "componentes_identificados_presentes"
// preview.habilitado_para_compra === null
// preview.aplicacao_canonica === false
```

## Guardrails

- Todo `REQUER` é obrigatório, inclusive em movimentos concedidos gratuitamente.
- Correspondências diretas e componentes de cardinalidade são **candidatos estruturais**, não homologação autoral.
- `texto_original` replica a concatenação integral das partes do DOCX, sem substituir as regras.
- Não ocorre modificação automática do cânone, fichas, estatísticas, avanço de personagens ou estados de campanha.
- Criaturas e a base de monstros de Peren permanecem independentes.

## Próximo ciclo

Integrar a classe **Artista Marcial**, que aparece a seguir no manuscrito, mantendo seus requisitos e opções sem inferência de mecânicas não escritas.
