# Segundo grupo de Classe completo — Bárbaro

**Data:** 27/10/2026. **Fonte:** `Hack Carcaça Dungeon World(1).docx` (181 páginas).
**SHA-256 da fonte:** `b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d`.

## Cobertura documental

A transcrição do grupo **BÁRBARO** contempla **59 movimentos integrais**, do parágrafo DOCX zero-based **1293 (FÚRIA)** ao **1447 (LAMENTO)**. Há **84 opções em listas** e **156 partes** (corpos, continuações e opções), distribuídas por **20 movimentos com escolhas**.

O texto original é mantido em `texto_original` e em `partes`, com âncoras por parágrafo. Não se impõe a mesma interpretação numérica a mecânicas distintas, nem se transforma uma capacidade ficcional em regra artificial. Os títulos permanecem em sua grafia autoral.

## Requisitos

Dos 59 movimentos, **37** possuem `REQUER:` literal, com significado obrigatório mesmo que outro movimento conceda a técnica gratuitamente.

- **36** requisitos possuem correspondência nominal exata com outro movimento do inventário.
- **Um requisito composto**, **FÚRIA ALÉM DA MORTE** (parágrafo 1430), contém `REQUER: Fúria Divina e Demasiado Furioso Para Morrer`. O campo `requisito_estruturado.tipo="todos"` contém os **dois IDs obrigatórios**:
  - `movimento-classe:paragrafo-1427` — FÚRIA DIVINA;
  - `movimento-classe:paragrafo-1343` — DEMASIADO FURIOSO PARA MORRER.

Não há operador OU nessa condição; possuir somente um dos dois não satisfaz o requisito. A interpretação estrutural é **pendente de homologação** e não autoriza automaticamente a compra do movimento.

## Arquitetura integrada

| Camada | Arquivo |
| --- | --- |
| Texto integral fonte | `data/lore/hack-carcaca-dw-barbaro-integrais.json` |
| Extrator reproduzível | `scripts/extrair_barbaro_docx.py` |
| Índices determinísticos | `scripts/hack_movimentos_personagem.py` |
| Gerador de distribuição | `scripts/gerar_indices_curadoria.py` |
| Dados públicos | `dist/carcaca/hack-barbarian-movements.json` |
| Índices públicos | `dist/carcaca/hack-barbarian-movement-indexes.json` |
| Cliente | `src/carcaca-client.mjs` |
| Validador | `scripts/validar_curadoria.py` |

O inventário global de **632 movimentos de classe** permanece inteiro e agora aponta para **136 transcrições completas** (77 de Guerreiro e 59 de Bárbaro). Os **496 restantes** mantêm `texto_integral_disponivel:false`. Isso não significa ausência de movimentos, apenas ausência da transcrição completa publicada.

### Consultas JavaScript

```js
import {createCarcacaAtlas} from "./src/carcaca-client.mjs";

const atlas=createCarcacaAtlas({
  baseUrl:"https://raw.githubusercontent.com/pedromaintenance/monstros-carcaca/main/dist/carcaca"
});
const movimentos=await atlas.getBarbarianMovements();   // 59
const escolhas=await atlas.searchBarbarianMovements({comOpcoes:true}); // 20
const dependentes=await atlas.searchBarbarianMovements({tipoRequisito:"movimento_exato"});
const furia=await atlas.getBarbarianMovement("movimento-classe:paragrafo-1293");
const consulta=await atlas.getBarbarianRequirementPreview(
  "movimento-classe:paragrafo-1430",
  {movimentosPossuidos:["movimento-classe:paragrafo-1427"]}
);
// consulta.componentes_requeridos mostra um requisito presente, outro ausente.
// consulta.habilitado_para_compra permanece null.
```

Os índices incluem `by_requisito_tipo`, `by_tem_requer`, `by_tem_opcoes`, `by_paragrafo`, `by_requisito_id` (incluindo **ambos** os ramos de `todos`) e `by_titulo`.

## Validação e fronteiras

A validação verifica integridade de corpus, títulos, pré-requisitos literais, partes, opções, rastreabilidade, ausência de ciclos na cadeia dos 36 vínculos exatos e preservação da composição de Fúria Além da Morte.

- `aplicacao_canonica:false` em todos os movimentos;
- `estado:"transcricao_integral_sem_revisao_mecanica"`;
- sem alterações em fichas, campanhas, monstros ou cenas;
- `habilitado_para_compra:null`, mesmo quando o usuário fornece os dois requisitos.

## Próximo ciclo recomendado

Concluir o **Caçador**, com 53 movimentos no inventário e 15 REQUER literais, aplicando o mesmo controle documental e de dependências. Em paralelo, desenvolver o criador de personagens como consumidor somente leitura do atlas, sem decisões canônicas automáticas.
