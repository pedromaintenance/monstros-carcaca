# Integração do Hack DW — Movimentos de povos, classes e REQUER

**Ciclo:** continuação da quinta auditoria — 27/10/2026.  
**Fonte primária:** `Hack Carcaça Dungeon World(1).docx` (181 páginas).  
**SHA-256 da fonte:** `b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d`.  
**Natureza:** publicação de dados, não homologação de regras nem alteração de campanha.

## Resultado

| Conjunto | Quantidade | Cobertura |
| --- | ---: | --- |
| Movimentos de povos integralmente transcritos | 107 | 18 grupos, parágrafos DOCX 827–1043 |
| Opções contidas em parágrafos `List Paragraph` | 70 | Corpo, opções e continuações mantidos na ordem |
| Movimentos de classe inventariados | 632 | 18 grupos, parágrafos DOCX 1047–2822 |
| Títulos de classe com `REQUER:` literal | 270 | 256 candidatos exatos + 14 expressões não resolvidas |
| Títulos de classe **com efeitos integrais revisados** neste lote | **0** | O inventário não equivale a regras completas |

O movimento **Saqueador da Caatinga** mantém suas quatro escolhas e sua correspondência com a auditoria anterior. Os 12 movimentos pilotos foram cruzados com a nova transcrição, sem divergência de título, marcador, texto inicial ou opções.

## Arquitectura de dados

**Fontes estruturadas editáveis:**
- `data/lore/hack-carcaca-dw-movimentos-povos-integrais.json`: texto dos 107 movimentos, `partes`, `opcoes`, índices de parágrafo zero-based, `estado` e `aplicacao_canonica:false`.
- `data/lore/hack-carcaca-dw-inventario-classes-requer.json`: 632 títulos e grupos, 270 requisitos literais, 256 **relações candidatas não homologadas** e 14 pendências explícitas.

**Distribuição derivada em `dist/carcaca/`:**
- `hack-people-movements.json`, `hack-people-movement-indexes.json`
- `hack-class-movement-inventory.json`, `hack-class-movement-indexes.json`
- `hack-class-requirement-candidates.json`, `hack-class-requirement-pending.json`

**Reprodutibilidade e testes:** `scripts/extrair_movimentos_personagem_docx.py` extrai do DOCX local do autor; `scripts/hack_movimentos_personagem.py` indexa; `scripts/gerar_indices_curadoria.py` publica as visões; `scripts/validar_curadoria.py` audita cruzamentos, conteúdo do piloto e relações. A fonte .docx não é necessária para os testes CI, porque os dados extraídos estão versionados.

## Semântica obrigatória de REQUER

**`REQUER: X` sempre constitui dependência mecânica obrigatória.** Isso inclui movimentos recebidos gratuitamente de outro movimento. Nenhum adquirente pode ignorá-la.

Um vínculo classificado `vinculo_exato_a_confirmar` é apenas correspondência literal de título, **não** adjudicação de elegibilidade ou liberação de compra. A API nunca retorna `habilitado_para_compra:true`.

Os 14 requisitos não resolvidos incluem expressões como:
- `qualquer Movimento de Magia`;
- `Surto de Ação e qualquer Movimento de Magia`;
- `Fúria Divina e Demasiado Furioso Para Morrer`;
- `Flecha de Sangue ou Marca do Caçador`;
- `Arma Favorita aplicada a um arco ou arma de projétil`;
- `Perfil` (referência sem título isolado identificado; não é corrigida por suposição).

Conjunções `e`, alternativas `ou`, condições qualitativas e vínculos sem título único precisam ser modelados explicitamente antes de serem usados numa ficha. O índice também **não inferiu relações de povo por estereótipo, alinhamento ou geografia**.

## Cliente JavaScript — consulta somente leitura

```js
import {createCarcacaAtlas} from "./src/carcaca-client.mjs";
const atlas=createCarcacaAtlas({
  baseUrl:"https://raw.githubusercontent.com/pedromaintenance/monstros-carcaca/main/dist/carcaca"
});

const anoes=await atlas.searchPeopleMovements({grupo:"ANÕES DE THARGRID"});
const comEscolhas=await atlas.searchPeopleMovements({comOpcoes:true});
const individuo=await atlas.getPeopleMovement("movimento-povo:paragrafo-849");
const magos=await atlas.searchClassMovements({grupo:"MAGO",comRequer:true});
const catalogo=await atlas.getClassMovementInventory();

// Checa texto literal, mas NUNCA autoriza escolha de movimento:
const previa=await atlas.getClassRequirementPreview(
  "movimento-classe:paragrafo-1120",
  {movimentosPossuidos:["movimento-classe:paragrafo-1047"]}
);
console.log(previa.todos_candidatos_presentes); // true
console.log(previa.habilitado_para_compra);      // null, exige revisão
```

## Limites e próxima etapa

1. **Povos:** os 107 textos estão preservados mas ainda não passaram por revisão mecânica e balanceamento individual.
2. **Classes:** os 632 registros possuem título, grupo e eventual REQUER. *Não* contam como textos integrais de movimento ou opções já transcritas.
3. **Dependências:** os 256 vínculos candidatos precisam ser homologados antes de um construtor de personagens; as 14 expressões especiais demandam gramática booleana e/ou condições ficcionais específicas, sem perda do literal.
4. **Cânone:** nenhum movimento altera eventos, seres, regiões, fichas ou saves. A camada de monstros e Peren permanece independente.

**Próximo ciclo recomendado:** estruturar e auditar os movimentos de Classe por lotes, começando por Guerreiro e seus ramos. Só depois criar uma calculadora de elegibilidade com expressões `REQUER` plenamente verificadas.
