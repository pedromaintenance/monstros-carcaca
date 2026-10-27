# Quarto conjunto de Classe completo — Ladino

**Ciclo:** 27/10/2026. **Fonte:** `Hack Carcaça Dungeon World(1).docx` (181 páginas), manuscrito do autor.  
**SHA-256 da fonte:** `b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d`.

## Escopo documental

Todos os **52 movimentos de LADINO** estão transcritos, com âncoras de título nos parágrafos DOCX **1588–1742** (índices zero-based). As continuações preservadas vão até o parágrafo 1747; o cabeçalho seguinte é **BARDO**, no parágrafo **1751**.

Foram preservados **89 parágrafos de opções** e **156 partes** (corpo, continuação ou opção), sem atribuir efeitos ausentes nem reescrever as escolhas.

| Situação de REQUER | Quantidade |
| --- | ---: |
| Sem REQUER literal | 46 |
| Requisito simples com título correspondente no inventário | 4 |
| Alternativas explícitas (OU) | 1 |
| Referência literal sem alvo identificado | 1 |
| **Total com REQUER** | **6** |

### Dois casos de atenção

**TUDO SEGUNDO O PLANO** (parágrafo 1619): requer **Heist ou Plano B**. O catálogo conserva uma estrutura `tipo:"qualquer"` com dois IDs explícitos (movimentos de parágrafos 1612 e 1618). **OU não é E**: encontrar uma das alternativas na lista de movimentos do personagem não concede, por si só, homologação ou aquisição.

**CUTUCAR A FERIDA** (parágrafo 1724): contém exatamente **`REQUER: Perfil`**. O inventário de 632 movimentos de classe não contém um título `PERFIL`; portanto, `requisito_estruturado.tipo:"referencia_sem_alvo"`, sem candidatos confirmados. O sistema **não** assume que Investigador, Dedução ou outro movimento satisfaça Perfil. Não permite inferir que o requisito possa ser ignorado. A resolução requer decisão autoral e revisão documentada do Hack.

Os demais vínculos são:

- Abrir o Impossível → Truques do Ofício;
- Ladrão de Feitiços → Magia Roubada;
- Larápio Fantasmagórico → Ladrão de Feitiços;
- Jogo Sujo → Golpe pelas Costas.

## Arquitetura

| Camada | Caminho |
| --- | --- |
| Transcrição autoral | `data/lore/hack-carcaca-dw-ladino-integrais.json` |
| Inventário preservado (632 títulos) | `data/lore/hack-carcaca-dw-inventario-classes-requer.json` |
| Extrator reproduzível | `scripts/extrair_ladino_docx.py` |
| Indexador de dependências | `scripts/hack_movimentos_personagem.py` |
| Gerador do atlas | `scripts/gerar_indices_curadoria.py` |
| JSON público | `dist/carcaca/hack-rogue-movements.json` |
| Índices públicos | `dist/carcaca/hack-rogue-movement-indexes.json` |
| Cliente ESM | `src/carcaca-client.mjs` |
| Validação | `scripts/validar_curadoria.py` |

Os registros do inventário recebem `texto_integral_id` e `texto_integral_disponivel:true`; permanecem com `texto_integral_curado:false` porque transcrição completa **não** equivale a homologação mecânica.

### Consulta JavaScript

```js
import { createCarcacaAtlas } from "./src/carcaca-client.mjs";

const atlas=createCarcacaAtlas({
  baseUrl:"https://raw.githubusercontent.com/pedromaintenance/monstros-carcaca/main/dist/carcaca"
});
const ladino=await atlas.getRogueMovements();                  // 52
const dependencias=await atlas.searchRogueMovements({comRequer:true});
const combinadas=await atlas.searchRogueMovements({tipoRequisito:"qualquer"});
const desconhecidas=await atlas.searchRogueMovements({tipoRequisito:"referencia_sem_alvo"});
const indice=await atlas.getRogueMovementIndexes();

const previa=await atlas.getRogueRequirementPreview(
  "movimento-classe:paragrafo-1619",
  {movimentosPossuidos:["movimento-classe:paragrafo-1612"]}
);
// verificacao_estrutural: "uma_alternativa_presente"
// habilitado_para_compra: null

const perfil=await atlas.getRogueRequirementPreview("movimento-classe:paragrafo-1724");
// verificacao_estrutural: "referencia_sem_alvo_documentado"
// habilitado_para_compra: null
```

A prévia consulta apenas IDs explicitamente fornecidos e conserva `habilitado_para_compra:null`. Ela não avalia a ficção, não contorna requisitos, não seleciona movimentos e não modifica fichas ou saves.

## Testes e publicação

`python scripts/validar_curadoria.py` verifica: unicidade de 52 IDs; correspondência de títulos e requisitos com o inventário; fonte e âncoras; 156 partes sem repetições; 89 opções íntegras; 4 vínculos diretos sem ciclos; 1 OU; 1 `Perfil` não resolvido; nenhum efeito aplicado automaticamente.

`node --test tests/carcaca-client.test.mjs` verifica busca, índice, REQUER simples, OU e ausência de alvo; `python scripts/gerar_indices_curadoria.py --check` confirma que o snapshot é determinístico. O GitHub Actions executa esses três estágios, os demais testes regionais e publica os JSON sob `dist/carcaca/`.

## Continuidade e integridade do mundo

**241 de 632 movimentos de classe** agora têm transcrição integral: Guerreiro (77), Bárbaro (59), Caçador (53) e Ladino (52). Restam **391** registros de classe por transcrever. As **107 transcrições de movimentos de povos** são um catálogo independente, não incluído nessa conta.

Esta integração **não** altera o cânone, as sete criaturas e os três assentamentos curados, as fichas de Peren ou os saves de campanhas.

**Próxima etapa sugerida:** BARDO (32 movimentos no inventário), respeitando a mesma distinção entre texto original, dependência documentada e aprovação para jogo.
