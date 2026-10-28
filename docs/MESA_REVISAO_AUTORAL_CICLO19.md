# Ciclo XIX — Mesa de revisão autoral do Atlas da Carcaça

**Estado:** inventário editorial e fila de decisões, sem aprovação autoral. **Princípio:** fazer o repositório saber *o que precisa ser decidido*, sem fazer parecer que já foi decidido.

> Durante cinco ciclos estudamos a memória de Eldroth, o poder de Sylara, a morte civil de Vandar e a liberdade precária de Ironwood. A Carcaça já possui uma quantidade considerável de material para uma história coerente. Mas um mundo não amadurece só porque uma planilha contém mais nomes: amadurece quando conseguimos distinguir uma afirmação da fonte, uma interpretação nossa, uma possibilidade atraente e uma decisão que o autor realmente tomou.

## 1. Por que a revisão é um ciclo próprio

O [Ciclo XIV](ATLAS_HISTORICO_CULTURAL_ELDROTH_CICLO14.md) inventariou três territórios, estabeleceu 14 eixos histórico-culturais e formulou 42 alternativas *não adotadas*. O [XV](ELDROTH_PRECONQUISTA_CICLO15.md) imaginou oito práticas anteriores à conquista, cada uma com três alternativas, além de quatro possíveis pactos não assinados. O [XVI](ELDROTH_SOB_SYLARA_CICLO16.md) propôs oito formas de captura cultural e três hipóteses para o governo de Sylara. O [XVII](VANDAR_POLITICA_DOS_MORTOS_CICLO17.md) estudou oito dimensões da vida urbana e três interpretações do domínio de Damaris. O [XVIII](IRONWOOD_SOCIEDADE_RESISTENCIA_CICLO18.md) examinou oito áreas da vida civil e três modelos de governo para a resistência.

O conjunto soma **103 candidatos explícitos**, classificados e rastreáveis por ID. Isso **não significa 103 propostas prontas para se tornarem cânone de uma vez**, tampouco exige escolher uma em cada linha imediatamente. A lista é uma ferramenta de auditoria: 42 propostas alternativas do XIV, 24 alternativas e quatro pactos do XV, 8 mecanismos e três modelos do XVI, oito eixos e três modelos do XVII, oito eixos e três governos do XVIII.

Também criamos uma **fila de 20 decisões**, mais pequena que o inventário. Algumas abrangem várias propostas. Todas mantêm **estado: pendente**, **aprovação: false** e **escolha: null**. Nenhuma transição ocorre pela geração de índices ou pela publicação automática.

## 2. Três camadas de autoridade editorial

**Camada 1 — enunciados sustentados por fonte.** A visão geral e a cronologia principal fornecem a estrutura do cenário. O manuscrito do Hack adiciona passagens, marcadas como material autoral ainda em revisão, com páginas próprias. Não se deve elevar automaticamente uma passagem em revisão a verdade definitiva por estar presente no repositório.

**Camada 2 — interpretações e propostas.** Um rito com nome bonito, um regime jurídico possível ou uma situação cotidiana imaginada são elementos úteis para escrever. No entanto, uma hipótese é diferente de uma descrição de evento ocorrido. Os ciclos XIV–XVIII a identificaram assim, e o XIX preserva seus registros originais, com referências ao arquivo, à coleção e ao ID. Quando uma prática contém três alternativas internas, o inventário registra também o índice da alternativa exata, sem reescrever ou truncar o texto de origem.

**Camada 3 — escolha autoral.** Quando o autor decidir algo, será necessário identificar **qual formulação** aceita, **qual alcance** ela possui e **que evidência** a sustenta. Uma aprovação genérica do projeto ou um “próximo ciclo” não dá autorização para assinar pactos em nome dos personagens, inventar datas ou determinar o regime de Ironwood.

A fila de decisões é deliberadamente separada da camada canônica. Uma homologação futura deverá acontecer **em revisão própria** com controle das dependências, alteração dos dados de destino e testes.

## 3. O que já sabemos e não deveríamos perder

Há dez enunciados de referência destacados no JSON, vinculados às páginas do manuscrito e tratados como **fontes revisáveis**, não como dez novas canonizações.

A história distingue **501 EC**, quando feéricos fugiram de Shadowfade e encontraram refúgio, de **666 EC**, quando lordes da Corte chegaram oficialmente, e de **875 EC**, quando começaram as guerras abertas da Corte. O marco geral de domínio posterior **não é a data da queda de Vandar**, nem comprova o ano preciso em que Sylara se tornou governante de Eldroth.

**Eldroth** está sob Sylara Nightwhisper e criaturas da floresta são usadas para vigiar seus opositores. Os círculos druidas possuem histórias diferentes de resistência, fuga, coerção e adesão. Isso não prova imposto, cargo, tribunal, ritual obrigatório nem que a fauna esteja moralmente alinhada com a Corte.

**Vandar** foi uma cidade próspera e hoje suas ruínas servem ao exército de mortos-vivos de Damaris Blackthorn. O texto não diz quando a cidade foi destruída ou quem deu o golpe inicial; tampouco revela se os soldados reanimados eram seus moradores, se possuem identidade consciente ou como a necromancia os controla.

**Ironwood**, sob liderança ranger de **Elara Stormoak**, fica ao sul das Montanhas de Thargrid e integra a resistência descentralizada. Seus habitantes e aliados não constituem um povo único. Elara **não está confirmada como soberana civil**, nem Ironwood como vassala de Thargrid. Ainda falta criar uma representação geográfica normalizada própria para Ironwood; o ciclo não fabricou um ID.

**Feéricos** não são um partido único; ascendência e migração não determinam adesão aos nobres da Rainha da Noite. **Gnomos da floresta** podem ser aliados sem abrir suas comunidades secretas. Entre elfos da floresta, **Rillifane, Sehanine e Corellon** integram tradições religiosas, mas nenhum culto oficial de Ironwood ou Vandar foi estabelecido.

Esses pontos não são decisões novas. São fronteiras que impedem que uma futura decisão apague inadvertidamente algo que o manuscrito diferencia.

## 4. Fila priorizada de decisões

### Eldroth e seu passado — seis escolhas que se conectam

**Autoridade dos druidas.** Antes de inventar tribunais ou vetos, definir se os círculos mediavam consensos, tinham poder formal de impedir usos destrutivos ou exerciam outra modalidade de autoridade. Isso muda a interpretação de **O Lugar onde Não se Edifica**, **Roda das Nascentes sem Dono** e pactos antigos.

**Refúgio feérico.** Definir o que se devia aos refugiados e o que eles deviam às comunidades locais. A política da hospitalidade não equivale a vassalagem, e a migração anterior à conquista não é um rascunho da Corte colonial.

**Juramentos e descendentes.** Decidir se promessas vinculariam apenas os participantes ou também pessoas nascidas depois. Não basta dizer que as fadas apreciam pactos: é necessário delimitar consentimento, duração, contestação e capacidade de representação dos bosques.

**Memória territorial.** Definir por onde circulavam nomes, trajetos e acordos. Uma tradição oral, escrita localizada ou sistema misto são modelos possíveis; nenhum cartório pré-colonial ou estrada física precisa ser inventado só porque um explorador quer encontrá-lo.

**Oito práticas candidatas do XV.** Revisá-las uma por uma, com possibilidade de aprovar algumas e rejeitar outras. Seus nomes são **editoriais**. Uma decisão de aprovar a ideia de mediação da água não necessariamente aprova o nome “Roda das Nascentes sem Dono”, a cerimônia descrita ou todas as suas alternativas.

**Governança de Sylara.** Somente depois de delimitar os costumes que a Corte poderia capturar, escolher como se manifesta a dominação: agentes locais, pactos reescritos, coerção móvel ou um regime mais complexo. Uma possibilidade política não é um decreto já emitido.

### Eldroth ocupada — três consequências materiais e morais

**Criaturas da floresta.** Diferenciar coação mágica, colaboração individual e mecanismos ainda não conhecidos, sem declarar a fauna inteira traidora ou sem vontade. O manuscrito comprova *uso*, não *consentimento*.

**Colaboração entre druidas.** Coagir, negociar para salvar um povoado, aderir à Corte por interesse e ser magicamente corrompido não são fatos moralmente equivalentes. Se houver julgamento, a lore precisa permitir prova, contestação, responsabilidade e reparação.

**Extração de recursos.** Definir, ou deixar indefinido, como a ocupação se sustenta: comida, trabalho, madeira, passagem, magia ou outros recursos. A Corte colonial controla tributos em termos gerais, mas nenhuma tabela de taxas de Sylara está registrada.

### Vandar — cinco decisões sobre história e direitos

**Prosperidade da cidade.** Antes de datar uma tragédia, decidir quem trabalhava, que bens circulavam e quem se beneficiava da antiga riqueza.

**Queda de Vandar.** Determinar, caso haja evidência e decisão autoral, o momento e o processo da ruína. A fonte **não estabelece** que Damaris causou a destruição; ocupar as ruínas não prova responsabilidade pela queda.

**Identidade dos mortos-vivos.** Decidir de onde vieram os corpos e o que a reanimação preserva ou apaga de memória, pessoa e autonomia. Uma carcaça ambulante não é, por definição, o antigo cidadão.

**Sobreviventes.** Decidir se há população viva dentro das ruínas, em exílio, em ambos ou se ainda não temos informação. O mundo não precisa ser preenchido artificialmente com bairros vivos para tornar-se interessante.

**Ritos e direitos.** Decidir como os vivos identificariam e lembrariam seus mortos, e quem reconheceria evidências de desaparecimento, posse ou herança. Nenhum tribunal, cartório ou templo está estabelecido para essa função.

### Ironwood e a política continental — seis escolhas

**Geografia de Ironwood.** O atlas deve incorporar um registro próprio coerente com o texto, ou manter a localização descritiva enquanto fronteiras forem vagas. **Não registrar como parte da região de Eldroth** apenas porque ambas são florestas.

**Poder civil de Elara.** Decidir se a liderança militar conversa com instâncias civis, se comunidades preservam autonomia ou se alguma assembleia mista representa os habitantes. Nenhuma existe oficialmente hoje.

**Pertencimento político.** Determinar quando refugiados, pessoas de outras espécies e moradores de longa data podem participar das decisões sobre comida, cuidado e segurança.

**Infância e educação.** A fonte fala de crianças que aprendem trilhas. Isso não equivale a recrutamento compulsório. A decisão é se Ironwood protege o aprendizado como direito civil e como o faz.

**Diplomacia com Thargrid.** Definir o tipo de reciprocidade, sem criar vassalagem, comando único ou contratos que a fonte não possui.

**Depois da Rainha.** A resistência tem projetos políticos distintos. A pergunta de longo prazo é se Ironwood deseja autonomia, restauração de reinos, uma ordem plural ou outro futuro — e se admite aliados feéricos dissidentes nesse projeto.

## 5. Por que algumas decisões têm precedência

A matriz registra **pré-requisitos editoriais**. São uma ordem recomendada para escrever e revisar, não uma alegação de causalidade histórica absoluta.

- É prudente **estabelecer a autoridade dos druidas** antes de descrever como Sylara a usurpa.
- A **hospitalidade do refúgio** precisa de contornos antes de definir quem herda obrigações de pactos.
- Para descrever a **identidade dos mortos-vivos**, convém esclarecer o papel da queda de Vandar e o que significa ter sido cidadão daquela cidade.
- A **autoridade de Elara** deve ser discutida antes de prometer a Thargrid suprimentos ou obediência em nome de moradores.
- A pergunta **sobre o mundo após a Rainha** precisa respeitar tanto a pluralidade dos resistentes quanto os direitos dos feéricos que não são colonizadores.

Na API, cada decisão pode ser consultada por ID, domínio, prioridade e perguntas; o índice de dependências permite montar uma pauta de revisão sem que o cliente precise interpretar texto livre.

## 6. Protocolo de aprovação futura

Uma decisão **não se torna fato** por ter sido discutida longamente. A homologação futura exige uma instrução explícita do autor que identifique o item, a formulação aceita e o alcance. O repositório então deverá:

1. **Registrar a opção aceita** e a referência à manifestação autoral, sem completar partes que ele não decidiu.
2. **Conferir as dependências** e eventuais contradições com a visão geral, o manuscrito e outras decisões aprovadas.
3. **Abrir uma mudança separada** na estrutura canônica apropriada, com revisão do diff; manter as alternativas rejeitadas disponíveis para pesquisa histórica e revisão.
4. **Executar testes de integridade** da nova mudança antes de publicar nos arquivos consumidos pelos jogos.

Se o autor responder “ainda não sei”, a decisão permanece aberta. Se aprovar somente o conceito de uma prática, o nome, o rito, o alcance geográfico e as implicações mecânicas continuam em aberto. **Não existe homologação por silêncio.**

Exemplo de instrução futura, apenas para demonstrar o processo:

> Revisão XIX, decisão `worldbuilding-xix:decisao:autoridade-druida`: aprovo que os círculos druídicos exerciam mediação comunitária sobre disputas de uso da mata. Não aprovo a existência de tribunais druidas nem poderes absolutos de veto. A abrangência territorial e a forma dos ritos continuam indefinidas.

Isso seria uma decisão concreta **se o autor a emitisse**. Está aqui somente como exemplo de formato; não foi emitida nem aplicada.

## 7. Resultado do ciclo e destino do atlas

Este ciclo não cria mais monstros, cenas canônicas, regiões fictícias ou regras de RPG. O resultado é uma **mesa de revisão editorial publicável**:

- `data/worldbuilding/revisao-autoral-atlas-ciclo19.json`: cinco dossiês, 103 candidatos com ponte a registros de origem, 20 decisões com dependências, dez guardas de fonte e cinco lacunas.
- `schemas/revisao-autoral-atlas-xix.schema.json`: proíbe estados de aprovação não autorizados.
- `dist/carcaca/atlas-authorial-review.json` e `atlas-authorial-review-indexes.json`: exportação determinística para consultas por origem, classe, domínio, prioridade, pré-requisito e estado.
- API ESM: `getAtlasAuthorialReview`, `getAtlasAuthorialReviewIndexes`, `getAtlasReviewDecision` e `searchAtlasReviewDecisions`.

**Próximo ciclo proposto (XX):** aprofundar uma rodada de **decisões autorais efetivamente tomadas**, quando houver, ou ampliar o estudo de fontes geográficas e sociais das regiões ainda pouco trabalhadas. A direção editorial será informada pela revisão, não por uma canonização automática das 103 possibilidades.
