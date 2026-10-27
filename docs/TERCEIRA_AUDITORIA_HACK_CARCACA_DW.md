# Terceira auditoria do manuscrito Dungeon World — A Carcaça

**Data:** 27 de outubro de 2026  
**Fonte primária:** `Hack Carcaça Dungeon World.docx` (181 páginas)  
**Escopo desta rodada:** rede de relações nominais no Capítulo I; seleção conservadora de movimentos conferidos diretamente na estrutura do DOCX; revisão visual da página 91.

## Resultados e distinção dos índices

A primeira ingestão indexou 100 verbetes de ambientação; a segunda ampliou o total a 157 e gerou um índice de 653 **rótulos visuais candidatos** nas páginas mecânicas. A terceira acrescenta dados de naturezas diferentes:

| Artefato novo | Total | Nível de revisão |
| --- | ---: | --- |
| Relações entre entidades de lore | **26** | Origem, destino, tipo e âncora localizável na página do Capítulo I |
| Movimentos selecionados | **41** | Grupo, título e requisito literal conferidos na estrutura de parágrafos do DOCX |
| Movimentos selecionados com `REQUER:` | **26** | Texto literal do pré-requisito, sem avaliação integral do efeito |
| Movimentos selecionados sem `REQUER:` | **15** | Nenhum pré-requisito explícito no cabeçalho, não implica ausência de outras condições |
| Página 91 | **confirmada vazia** | DOCX convertido em PDF de 181 páginas; inspeção visual da página 91 |

Os números desta tabela **não substituem** 157 verbetes nem 653 rótulos candidatos. As relações são ligações entre verbetes; os 41 movimentos constituem uma **amostra estruturada**, não o catálogo completo de movimentos do hack.

## 1. Rede de relações — 26 arestas com âncoras

`data/lore/hack-carcaca-dw-relacoes.json` lista relações entre IDs já indexados em `data/lore/hack-carcaca-dw-indice-tematico.json`.

Cada aresta declara `id`, `origem_id`, `destino_id`, `tipo`, `pagina`, `ancora_textual`, `estado:afirmado_no_manuscrito` e `aplicacao_canonica:false`. O validador confere que **ambas as entidades existem** e que a âncora textual é encontrada na página indicada da transcrição da ambientação, normalizando acentos e espaços.

Exemplos representativos:

- **Poder territorial:** Varys Duskveil → Garganta; Sylara Nightwhisper → Eldroth; Damaris Blackthorn → Vandar.
- **Religião e instituições:** Severina Shadowbloom → Templo da Lua; Portomonte → Templo de Deméter; Kuo-Toa → Daegon.
- **Resistência:** Resistência → Reino Sob a Montanha; Resistência → Ironwood; Elara Stormoak → Ironwood.
- **Geografia e história:** Golzdov → Carcaça; Ulorian Uln-Shayr → Boca do Abismo; tritões → sereias.
- **Memória e produção:** Elfos Yokai antigos → direito de nomear; hobbits → Grama-Cortada.

**Limite:** a âncora curta identifica o ponto da leitura; sozinha não substitui o parágrafo completo nem autoriza uma inferência sobre soberania jurídica, causalidade ou cronologia fora do enunciado. No caso da Boca do Abismo, a topologia com Gualápolis e Shadar-Riverie **continua pendente de revisão**. Na relação de Portomonte com Deméter, a purificação para agricultura **não confirma potabilidade doméstica**.

São referências do **manuscrito em revisão**, não modificações da rede de assentamentos DW ou das histórias de campanha.

## 2. Movimentos conferidos diretamente no DOCX

A segunda auditoria extraiu títulos por página de uma diagramação de duas colunas e encontrou 653 rótulos, com risco de agrupar uma habilidade a uma coluna vizinha. Nesta rodada, conferi diretamente os **parágrafos estruturados do DOCX**: os grupos usam cabeçalhos próprios (`HUMANOS`, `ANÕES DE THARGRID`, `GUERREIRO`, `BÁRBARO`, `CAÇADOR`, `LADINO`, `BARDO`, `MERCENÁRIO`, `ESCRIBA YOKAI`, `NOBRE`, `ARQUEÓLOGO` etc.), enquanto um título de movimento normalmente aparece em negrito no começo de um parágrafo.

`data/lore/hack-carcaca-dw-movimentos-selecionados.json` publica **41 movimentos selecionados** com:

- `paragrafo_docx`: posição **zero-based** do parágrafo no documento original (não confundir com número de página).
- `categoria`: `povo` ou `classe`; `grupo`: seção original.
- `titulo`: título identificado no parágrafo.
- `requisito_literal`: texto transcrito exatamente do cabeçalho `REQUER:`, quando presente, ou `null`.
- `paginas_candidatas`: resultados auxiliares do índice visual anterior; podem estar vazios e **não invalidam** a verificação do parágrafo.
- `efeito_revisado:false`, `aplicacao_canonica:false`: **não** representam movimentos completos aprovados, regras executáveis ou itens adquiridos por um personagem.

### Exemplos de requisitos que agora podemos localizar corretamente

| Grupo | Movimento | `REQUER:` literal |
| --- | --- | --- |
| Guerreiro | Mau Olhado | Vendo Vermelho |
| Guerreiro | Escudo Rúnico | Gravador de Runas |
| Bárbaro | Escudo dos Ancestrais | Os Ancestrais Lutam Comigo |
| Bárbaro | Golpe Brutal Aprimorado | Golpe Brutal |
| Caçador | Nenhum Mundo É Longe Demais | Caminhante dos Horizontes e Marca do Caçador |
| Ladino | Larápio Fantasmagórico | Ladrão de Feitiços |
| Bardo | A Canção Que Fez o Mundo | Arte Arcana e dois outros Movimentos de Bardo |
| Mercenário | O Navio É o Mais Importante | Capitão |

A notação `REQUER: X` mantém seu significado **mecânico vinculante**: o movimento não pode ser escolhido ou comprado sem cumprir X, mesmo se outro movimento o conceder gratuitamente. Quando o pré-requisito envolve expressões compostas ou alternativas, **o texto completo permanece literal**, sem quebrá-lo em arestas de requisitos que possam mudar a lógica.

**Fica para uma etapa posterior:** reconstruir o texto completo dos 41 movimentos (inclusive listas e opções em parágrafos separados), confirmar sua redação final, verificar que os pré-requisitos apontam a movimentos definidos e fazer a curadoria do catálogo restante. O estado `titulo_e_requisito_conferidos_no_docx` não é atestado do efeito.

## 3. Página 91 resolvida

A segunda auditoria identificou a página 91 como ausente da extração textual e não determinou se estava vazia. Nesta auditoria:

1. Converti o **DOCX original** com LibreOffice.
2. Confirmei **181 páginas** no documento renderizado.
3. Extraí somente a página 91 — sem texto.
4. Inspecionei sua imagem: **página inteiramente vazia, contendo apenas o fundo de pergaminho**.

A conclusão consta em `data/lore/hack-carcaca-dw-indice-mecanicas.json`, campo `conferencia_pagina_91`. A chave antiga `paginas_sem_texto_extraivel:[91]` foi mantida por compatibilidade e agora vem acompanhada da confirmação de que a página foi **visualmente verificada como vazia**.

Não houve OCR desnecessário, preenchimento especulativo ou deslocamento dos números de páginas.

## 4. Consulta programática

Os arquivos editáveis publicam-se automaticamente como:

- `dist/carcaca/lore-relations.json`
- `dist/carcaca/lore-relation-indexes.json`
- `dist/carcaca/hack-selected-movements.json`
- `dist/carcaca/hack-selected-movement-indexes.json`

As duas famílias são mantidas **separadas**: relações da ambientação e cabeçalhos mecânicos não são misturados no mesmo grafo.

```js
const atlas=createCarcacaAtlas({baseUrl:"./dist/carcaca"});

const daegon=await atlas.searchLoreRelations({
  entidadeId:"lore-hack:daegon"
});
const doCapitulo=await atlas.searchLoreRelations({pagina:5});
const guerreiro=await atlas.searchSelectedMovements({
  grupo:"GUERREIRO",requisito:"Vendo Vermelho"
});
const povo=await atlas.searchSelectedMovements({
  categoria:"povo",texto:"Portomontense"
});
```

As outras funções disponíveis são `getLoreRelations`, `getLoreRelationIndexes`, `getSelectedMovements` e `getSelectedMovementIndexes`. As funções de busca devolvem somente dados catalogados, sem criar eventos, alterar fichas, aplicar rótulos DW ou validar as escolhas de personagens.

## 5. Integridade e próximos passos

A validação verifica a existência dos IDs de ambos os extremos das relações, a ocorrência da âncora no texto da página e o estado sem mutação; para os movimentos, IDs não duplicados, parágrafos distintos, categoria e grupo, requisito literal não vazio e `efeito_revisado:false`.

Os testes Python e Node cobrem casos específicos de `REQUER:`, consultas por entidade/página/grupo e separação da lore. As sete criaturas e os três assentamentos do Atlas M3 **continuam preservados**.

**Prioridade recomendada:** ampliar a verificação estruturada dos movimentos com **texto completo e dependências compostas**, a partir do DOCX de origem, em grupos pequenos (um povo ou uma classe por ciclo). Só depois usar esses dados em fichas de personagens e no sistema de compra de Movimentos. Em paralelo, continuar a reconciliação das sete dúvidas de ambientação já registradas.
