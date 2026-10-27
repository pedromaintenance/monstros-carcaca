# Terceira classe integral — Caçador

**Ciclo:** 27/10/2026. **Fonte autoral:** `Hack Carcaça Dungeon World(1).docx`, SHA-256 `b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d`.

## Evidência e cobertura

Foram transcritos **53 movimentos de CAÇADOR**, âncoras zero-based **1455–1582**, até o próximo cabeçalho `LADINO` (1586), com **61 opções** e **125 trechos** preservados, entre corpos, escolhas e continuações.

Há **15 ocorrências de REQUER**: **12 correspondências literais de título** e três casos lógicos não triviais. Todas as entradas preservam `texto_original`, `partes`, `opcoes`, `requisito_literal`, `requisito_estruturado`, ancoragem documental e `aplicacao_canonica:false`. O campo `texto_integral_conferido` representa fidelidade à transcrição, não aprovação de equilíbrio ou elegibilidade.

| Movimento | REQUER literal | Estrutura diagnosticada, sem homologação |
| --- | --- | --- |
| Barriga de Smaug (1492) | Caçador de Monstros ou Um movimento que tenha revelado uma vulnerabilidade | Alternativa: movimento identificado **OU condição ficcional**, que depende de validação na mesa |
| Nenhum Mundo É Longe Demais (1520) | Caminhante dos Horizontes e Marca do Caçador | Conjunção: **ambos** os movimentos identificados |
| Olho da Presa (1535) | Flecha de Sangue ou Marca do Caçador | Disjunção: **um dos dois** movimentos identificados |

**REQUER é obrigatório**, inclusive se outro movimento conceder a aquisição gratuitamente. O grafo de títulos somente ajuda a diagnosticar dependências; não implementa seleção automática, não atribui movimento, não dispensa avaliação da ficção e não aprova regras ou cenas.

## Arquitetura

| Camada | Caminho |
| --- | --- |
| Fonte integral | `data/lore/hack-carcaca-dw-cacador-integrais.json` |
| Inventário de 632 títulos | `data/lore/hack-carcaca-dw-inventario-classes-requer.json` |
| Extrator reprodutível | `scripts/extrair_cacador_docx.py` |
| Indexador | `scripts/hack_movimentos_personagem.py` |
| Gerador determinístico | `scripts/gerar_indices_curadoria.py` |
| Catálogo público | `dist/carcaca/hack-hunter-movements.json` |
| Índices públicos | `dist/carcaca/hack-hunter-movement-indexes.json` |
| Cliente de leitura | `src/carcaca-client.mjs` |

Os **53 registros** de Caçador agora têm `texto_integral_disponivel:true` no inventário **derivado** publicado; a origem `data/lore` permanece intacta. A soma atual é **189 movimentos completos de 632** (77 Guerreiro + 59 Bárbaro + 53 Caçador). Os **443 restantes** permanecem inventariados sem texto integral.

## Exemplo de uso

```js
import {createCarcacaAtlas} from "./src/carcaca-client.mjs";
const atlas=createCarcacaAtlas({
  baseUrl:"https://raw.githubusercontent.com/pedromaintenance/monstros-carcaca/main/dist/carcaca"
});
const list=await atlas.getHunterMovements();
const optionals=await atlas.searchHunterMovements({tipoRequisito:"qualquer"});
const ands=await atlas.searchHunterMovements({tipoRequisito:"todos"});
const requiringFiction=await atlas.searchHunterMovements({comCondicaoFiccional:true});
const index=await atlas.getHunterMovementIndexes();

// Com Caçador de Monstros listado; a outra alternativa depende da ficção:
const preview=await atlas.getHunterRequirementPreview(
  "movimento-classe:paragrafo-1492",
  {movimentosPossuidos:["movimento-classe:paragrafo-1484"]}
);
// preview.habilitado_para_compra === null: sem liberação automática.
```

## Validação e próximos passos

O CI valida identidade, proveniência, igualdade do texto original com os parágrafos, opções, requisitos especiais, referências a movimentos existentes, ausência de ciclos nos vínculos diretos, contagens e distribuição determinística. A API oferece resultados de leitura, não mutations.

**Próximo ciclo recomendado:** Ladino (**52 movimentos** identificados). Posteriormente, consolidar as três classes completas e o grafo compartilhado para prototipar o construtor de fichas sem flexibilizar REQUER e sem alterar os dados do jogo de Peren.
