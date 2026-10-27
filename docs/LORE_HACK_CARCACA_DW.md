# Manuscrito Dungeon World — A Carcaça: índice de lore e reconciliação com M3

**Fonte:** `Hack Carcaça Dungeon World.docx`, manuscrito de Pedro Rodrigues.  
**Dimensão do documento:** 181 páginas.  
**Transcrição indexada de ambientação:** Capítulo I, **páginas 2–25** (24 páginas).  
**Estado editorial:** fonte autoral **em revisão** — não reescreve o cânone, saves de campanha nem movimentos DW.

## Escopo e política editorial

O manuscrito combina **ambientação** (Capítulo I), **regras do hack** (Capítulo II) e **movimentos de personagem** (Capítulo III). Nesta importação, **todo o texto do Capítulo I foi preservado por página** em `fontes/autoria/hack-carcaca-dw-capitulo-i.paginas.json`. Os capítulos II e III continuam no documento original, mas não foram copiados para os registros do atlas de lore para evitar confundir descrição de mundo com efeitos de jogo. A publicação é uma **transcrição textual de consulta**, não uma republicação com a diagramação do DOCX.

O índice reúne **100 entradas nomeadas** e referências às páginas: **22 lugares/geografias, 5 regiões, 1 plano, 26 povos, 4 facções, 16 personagens, 16 divindades e 10 conceitos**. O número de entradas é uma métrica da indexação; não é população nem quantidade de seres no mundo. Em `data/lore/hack-carcaca-dw-indice-tematico.json`, cada registro possui `nome`, `tipo`, `aliases`, `descricao`, `paginas`, `evidencia:afirmado_no_rascunho` e `integracao:referencia_sem_mutar_canonico`.

**Importante:** a inclusão de um termo neste índice não confirma que a versão mais recente da ambientação já adotou sua redação. Quando houver divergência, consultar os pontos de revisão antes de alterar registros canônicos. Os termos de personagens, povos e lugares permanecem independentes dos identificadores utilizados nos savegames.

## O que o manuscrito acrescenta à ecologia e à política

### 1. Anatomia territorial e domínio feérico

A Carcaça se organiza sobre o corpo morto de **Golzdov**; o Rio Ancestral funciona como eixo econômico e colonial, enquanto a **Corte Shadow Fey** ocupa lugares com intensidade diferente. **Garganta** aparece como cidade-fortaleza no crânio de Golzdov, sob **Varys Duskveil**. O antigo **Templo de Yolskaariin** foi corrompido. **Drakport** funciona como centro fluvial de escravização ligado a **Morwen Nightshade**; o **Templo da Lua**, numa ilha do rio, é associado a **Severina Shadowbloom**.

A **resistência** não constitui uma organização única: o Reino Sob a Montanha em **Thargrid**, a fortaleza/rangers de **Ironwood**, esconderijos, caravanas e comunidades perseguidas articulam formas diferentes de oposição. Essa descentralização não deve ser confundida com uma aliança sem disputas internas.

### 2. A Garganta, os Yokai e o direito de nomear

O manuscrito associa as inscrições ritualizadas dos **antigos elfos Yokai** a uma língua sagrada herdada de humanos remotos do Leste. **Kanji** nos ossos de Golzdov funcionam como inscrições de poder; a partida do povo Yokai teria removido ou suspendido parte da legitimidade simbólica de nomear o território. A Corte pode controlar sua economia e exércitos sem controlar esse fundamento.

O nome **Yokai** aparece aqui como *povo/civilização antiga*, mas no bestiário do Arquivo dos Mortos Afogados também designa uma *categoria de criaturas*. **Não fundir automaticamente as categorias.** Não explicar o desaparecimento histórico desses elfos: o manuscrito o deixa deliberadamente em aberto.

### 3. Caatinga e Thargrid: sociedades materiais identificáveis

A Caatinga possui **comunidades orcs dispersas**, com passado de cooperação militar com humanos contra os invasores kuo-toa. A existência dessas comunidades é documentada, mas **não há nome ou infraestrutura de povoado individual** neste recorte. Portanto, a primeira pergunta da fila M3 continua não resolvida.

Thargrid tem uma economia de resistência mais explícita: **minas, forjas, depósitos, galerias subterrâneas, produção de alimentos nas cavernas e circulação protegida** por clãs anões. Os gigantes vivem em altas cavernas e montanhas; gigantes de pedra constroem obras defensivas, gigantes do gelo vigiam picos, gigantes do fogo atuam em forjas. Os **draconatos** exercem mediação baseada em juramentos, passagem e responsabilidade. O **Ordenamento** rege hierarquias gigantes, mas não lhes dá supremacia jurídica sobre anões ou draconatos. Não extrapolar essas estruturas para outros povos/locais.

### 4. Os mares: poder, comércio e nova região candidata

O manuscrito esclarece que os **Abissais marinhos são um povo anfíbio e não demônios do Abismo**. Seu culto a **Daegon** difere do culto kuo-toa: está associado a sacerdócio hierárquico, tributos, pactos e expansão política. A **Mudança do Oceano** aparece como manifestação tardia da ancestralidade anfíbia de certos descendentes mistos. Isso **não significa** que todos os abissais ou descendentes se comportem de modo idêntico.

Nos **arquipélagos**, Tortles e Tabaxis mantêm tradições monásticas próprias e circulação sazonal. Ao sul, **Tritões e Sereias** habitam águas azuis que resistem à corrupção do Mar de Sangue. Cidades submarinas e rotas estão ligadas a recifes, cânions, correntes e defesa; a fronteira de águas vermelhas e azuis é **móvel**. Não incorporar essas cidades aos três assentamentos existentes da Costa Sul por aproximação geográfica. Seu ambiente merece futura região própria, após revisão.

### 5. Eldroth, deslocamento e uma resposta parcial do M3

O capítulo trata dos druidas de Eldroth e dos rangers de Ironwood como tradições distintas de resistência. Diz que alguns druidas permaneceram ocultos na mata, outros foram cooptados, e **outros se tornaram refugiados em Portomonte, Thargrid e nos arquipélagos**.

Isso permite apontar uma **resposta parcial, limitada ao grupo de druidas**, para as perguntas `pergunta:eldroth-deslocados` e `pergunta:costa-sul-migracao`. Não significa que todos os refugiados de Eldroth estejam em Portomonte, não informa quantidade e não estabelece um sistema institucional de acolhimento. Não alteramos automaticamente o registro canônico do assentamento.

### 6. Religião, cosmologia e pluralismo

A fé na Carcaça é plural: deuses reais de diferentes tradições convivem e uma pessoa pode oferecer devoção a várias potências. Golzdov permanece um ancestral morto divinizado ou venerado sem consenso sobre sua condição. **Yolskaariin e Pelor** são objeto de debate sobre serem deuses distintos ou manifestações solares. Em Portomonte, **Deméter** é associada à purificação para agricultura; isso **não comprova potabilidade doméstica**.

Tradições de Thargrid, cultos do Rio Ancestral, panteões gregos, nórdicos e egípcios, fés marítimas e cultos feéricos são indexados por divindades e conceitos. O **ateísmo arcano** não nega a existência de deuses: discute se seu poder lhes concede autoridade moral. Os **Meio-Demônios** compartilham a natureza demoníaca de seus ancestrais, sem distinção essencial entre demônios/diabos/cambions/tieflings — e a ascendência não determina caráter.

## Cronologia e espaços deliberadamente abertos

**18 datas ou marcos aproximados** foram indexados em `data/lore/hack-carcaca-dw-cronologia.json` e **7 perguntas explicitamente abertas** foram mantidas separadas. Exemplos:

| Data EC | Acontecimento no manuscrito |
| --- | --- |
| 0 | Morte de Golzdov, origem da Era da Carcaça |
| 342–351 | Invasão kuo-toa e aliança posterior de orcs e humanos |
| 501 | Invasão do Shadowfade e chegada de refugiados feéricos |
| 666 | Migração oficial de lordes da Corte |
| 875–888 | Conquista, traição de Voragar e exílio de Rayquaza |
| 921 | Derrota de Voragar e dos Dragões Ancestrais |
| 983 | Destruição do Templo das Sombras pelo ataque demoníaco |
| 984 | Golpe do Senhor do Rio em Gualápolis |
| 999 | Construção do Templo do Crepúsculo |

Esses eventos são **afirmações da linha do tempo do manuscrito**, não uma atualização sem revisão da cronologia de campanhas ou do cânone compilado. Os espaços em branco incluem a revolta de Drakport, destino dos Yokai, paradeiro de Rayquaza, origem de Golzdov, futuro de Thargrid e da Corte e reversibilidade do Mar de Sangue.

## Sete pontos que exigem reconciliação editorial

Foram registrados **7** em `data/lore/hack-carcaca-dw-pontos-de-revisao.json`:

1. **Gualápolis / Boca do Abismo / Shadar-Riverie:** a geografia exata dos três nomes não pode ser fundida automaticamente.
2. **351 EC:** a expulsão dos kuo-toa é relacionada ao *Extremo Oeste* apesar de o avanço alcançar Garganta no leste; verificar direção/local.
3. **Yokai:** povo élfico antigo ≠ tipo de criatura sem evidência explícita.
4. **Abissais:** marinhos seguidores de Daegon ≠ demônios que vêm do Abismo da foz.
5. **Deméter:** água adequada à agricultura ≠ potabilidade doméstica confirmada.
6. **Refugiados:** o trecho dos druidas individualiza Portomonte como um dos destinos, mas não todos os refugiados do continente.
7. **Direito de nomear:** história e consequências do afastamento dos Yokai ainda estão abertas.

O arquivo registra `acao_autorizada:false` para todos os pontos. Nenhum nome foi reescrito no material canônico.

## Pontes para o Atlas M3

As **14 relações editoriais** de `data/lore/hack-carcaca-dw-pontes-atlas.json` ligam registros do manuscrito aos `regiao:*` e às `pergunta:*` existentes. **Oito delas apontam a perguntas do backlog.** Os pareceres distinguem `amplia`, `insuficiente_para_resolver`, `resposta_parcial_para_grupo`, `fronteira_nova` e `precisa_revisao`.

Exemplo: as comunidades dispersas de orcs sustentam a afirmação de que há habitação regional na Caatinga, mas não identificam povoado. A água purificada de Portomonte permanece limitada ao uso agrícola documentado. O mapa de gualápoles permanece por revisar.

## Consulta a partir de jogos ou documentação

O indexador gera automaticamente:

- `dist/carcaca/lore-index.json`: 100 entidades/temas.
- `dist/carcaca/lore-indexes.json`: índices invertidos por tipo, página, palavra e estado.
- `dist/carcaca/lore-chronology.json`: eventos e incógnitas.
- `dist/carcaca/lore-review-notes.json`: dúvidas de reconciliação.
- `dist/carcaca/lore-atlas-links.json`: pontes para M3.
- `dist/carcaca/lore-atlas-link-indexes.json`: por região, pergunta, entrada e parecer.

```js
import {createCarcacaAtlas} from "./src/carcaca-client.mjs";
const atlas=createCarcacaAtlas({baseUrl:"./dist/carcaca"});

const povos=await atlas.searchLore({tipo:"povo"});
const abissais=await atlas.searchLore({query:"abissais",tipo:"povo"});
const doCapitulo14=await atlas.searchLore({pagina:14});
const cronologia=await atlas.getLoreChronology();
const revisoes=await atlas.getLoreReviewNotes();
const pontes=await atlas.searchLoreAtlasLinks({
  perguntaId:"pergunta:costa-sul-migracao"
});
```

A fonte textual página a página permanece em `fontes/autoria/` e não é duplicada no snapshot `dist/carcaca`. Os capítulos II/III, a mecânica de criação de personagem e as listas de movimentos **não** foram incorporados a `dist/carcaca/lore-*.json`. A separação protege o mundo de transformações derivadas de exemplos de regras.

## Anexo — índice das áreas mecânicas para eventual revisão futura

O restante do documento (páginas 26–181) cobre o hack sem playbooks rígidos, movimentos básicos/avançados e progressão, listas de movimentos de raça e de classe. Entre os movimentos de **povo** encontram-se humanos, orcs da Caatinga, anões, gigantes, draconatos, tortles, tabaxis, kuo-toa, abissais, tritões, sereias, shadow fey, feéricos, Yokai, elfos da floresta, hobbits, gnomos e meio-demônios. A lista de práticas de classe inclui guerreiro, bárbaro, caçador, ladino, bardo, artista marcial, paladino, clérigo, druida, mago, feiticeiro, bruxo, necromante, artífice, mercenário, escriba Yokai, nobre e arqueólogo.

**Esses nomes não foram transformados em classes ou fichas canônicas do bestiário.** Sua revisão é um trabalho separado de game design, com a distinção entre Movimento de Raça, Classe e Antecedente e a regra de dependências `REQUER: X` preservadas na discussão original do hack.

## Próximas ações propostas

1. Revisar a topologia de Gualápolis/Boca/Shadar-Riverie e a direção da campanha kuo-toa de 351 EC.
2. Quando aprovado, promover **fatos pontuais**, citando página, sem fazer merge automático de todo o manuscrito.
3. Ampliar o atlas a **Thargrid, Garganta, Grama-Cortada e ao oceano azul** em lotes geográficos separados.
4. Prosseguir no M3 com a Caatinga utilizando as novas evidências sobre existência regional de comunidades, ainda sem inventar uma vila.
