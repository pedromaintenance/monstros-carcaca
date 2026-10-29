# Ciclo XXVI — Portomonte sob revisão: escolhas sem coroação

**Status: pauta editorial; nenhuma decisão autoral foi tomada.** É continuação do [Ciclo XXV](PORTOMONTE_TEMPLO_GOVERNO_CICLO25.md), não um novo capítulo de cânone. Fontes primárias: Hack Carcaça, pp. 5 e 12; fatos já reproduzidos e limitados no XXV. Fonte de propostas: matriz `data/worldbuilding/portomonte-templo-governo-ciclo25.json`.

> O templo de Deméter pode tornar a lavoura possível sem que o manuscrito lhe entregue o governo da cidade.

Portomonte é assentamento humano importante no comércio costeiro e autônomo no sul. O templo purifica águas do Mar de Sangue **para cultivo, inclusive sobre pedra**. Nada disso estabelece um regime político, organização sacerdotal, capacidade produtiva, potabilidade doméstica, sistema de propriedade, mercado de excedentes ou sanções jurídicas. Os números nos balanços permanecem desconhecidos.

## Política de homologação

Este arquivo **não aprova** ideias por preferência editorial, aparente plausibilidade, escolha padrão, silêncio, consulta ou simulação. Uma aprovação futura exige manifestação expressa do autor sobre ID de decisão e formulação; depois, revisão das dependências, confirmação de proveniência e um ciclo de integração separado com novos testes. Nenhum dos dez impactos adiante foi aplicado. `opcao_escolhida_id`, `texto_autoral_aprovado`, `fonte_da_aprovacao` e `data_da_aprovacao` continuam `null` nas 12 decisões.

## Ordem de trabalho — pauta, não fila obrigatória

- **Revisão de fonte e lacuna:** Confirmar fatos já estabelecidos e lacunas de água, governo e quantidades. Decisões: nenhuma; apenas verificação factual.
- **Arquitetura de poder:** Discutir autoridade, templo, distribuição e responsabilidade sem votar automaticamente. Decisões: `worldbuilding-xxvi:decisao:autoridade`, `worldbuilding-xxvi:decisao:templo`, `worldbuilding-xxvi:decisao:distribuicao`, `worldbuilding-xxvi:decisao:responsabilidade`.
- **Vida material e trabalho:** Discutir potabilidade, executantes, mecanismo, continuidade, auxiliares, cultivo e meios. Decisões: `worldbuilding-xxvi:decisao:agua-domestica`, `worldbuilding-xxvi:decisao:responsaveis-rito`, `worldbuilding-xxvi:decisao:mecanismo`, `worldbuilding-xxvi:decisao:continuidade`, `worldbuilding-xxvi:decisao:auxiliares`, `worldbuilding-xxvi:decisao:cultivo`, `worldbuilding-xxvi:decisao:instrumentos`.
- **Integração futura, não nesta revisão:** Revisar comércio, dependências de decisão e impactos antes de eventual nova proposta de alteração canônica. Decisões: `worldbuilding-xxvi:decisao:comercio`.

## Matriz de decisões

### 1. Quem toma decisões civis em Portomonte, e como são contestadas? — critica

**Decisão:** `worldbuilding-xxvi:decisao:autoridade`. **Origem:** `worldbuilding-xxv:pergunta:autoridade`. **Dependências editoriais:** nenhuma.

- **A — Assembleia de casas e ofícios.** Poder civil distribuído entre representantes de moradores e trabalhadores, sujeitos a contestação. *Custo ou risco:* Representatividade pode excluir quem não possui oficina ou casa. `worldbuilding-xxvi:opcao:autoridade:casas` (referência: `worldbuilding-xxv:modelos_de_governo:casas-e-oficios`).
- **B — Conselho temporário revogável.** Coordenação civil restrita a necessidades, com fim de mandato definido pelo autor. *Custo ou risco:* Emergência tende a prolongar poderes. `worldbuilding-xxvi:opcao:autoridade:conselho` (referência: `worldbuilding-xxv:modelos_de_governo:conselho-revogavel`).
- **C — Templo consultado, decisão civil.** Rito e conselho se relacionariam sem transferir automaticamente a soberania. *Custo ou risco:* Parecer técnico pode virar veto político. `worldbuilding-xxvi:opcao:autoridade:templo-consultivo` (referência: `worldbuilding-xxv:modelos_de_governo:templo-consultivo`).
- **D — Pactos entre núcleos.** Autoridade civil plural por acordos voluntários, sem centro definido de antemão. *Custo ou risco:* Desigualdade de força pode tornar um pacto coercitivo. `worldbuilding-xxvi:opcao:autoridade:pactos` (referência: `worldbuilding-xxv:modelos_de_governo:pactos-entre-vizinhos`).
- **E — Modelo próprio ou ainda desconhecido.** O autor pode propor uma quinta arquitetura ou manter a questão aberta. *Custo ou risco:* Não deduzir instituições a partir da importância do templo. `worldbuilding-xxvi:opcao:autoridade:outro`.

**Estado:** nenhuma opção escolhida; todas são apenas candidatas.

### 2. O templo de Deméter possui poder político formal ou apenas autoridade ritual? — critica

**Decisão:** `worldbuilding-xxvi:decisao:templo`. **Origem:** `worldbuilding-xxv:pergunta:templo`. **Dependências editoriais:** `worldbuilding-xxvi:decisao:autoridade`.

- **A — Autonomia ritual sem poder civil.** O templo decide apenas assuntos internos do culto; distribuição e lei seguiriam outra autoridade escolhida. *Custo ou risco:* Precisaria definir onde acaba competência ritual. `worldbuilding-xxvi:opcao:templo:autonomia-ritual`.
- **B — Autoridade religiosa e civil vinculadas.** O autor poderia definir um vínculo institucional específico. *Custo ou risco:* O vínculo pode gerar coação de fé e alimentação. `worldbuilding-xxvi:opcao:templo:vinculo-civil`.
- **C — Prestígio sem título político.** Influência social forte, ainda que sem cargo formal de governo. *Custo ou risco:* Decisões podem ser controladas sem responsabilidade pública. `worldbuilding-xxvi:opcao:templo:poder-informal`.

**Estado:** nenhuma opção escolhida; todas são apenas candidatas.

### 3. A água purificada do Mar de Sangue é adequada para beber? — critica

**Decisão:** `worldbuilding-xxvi:decisao:agua-domestica`. **Origem:** `worldbuilding-xxv:pergunta:agua-domestica`. **Dependências editoriais:** nenhuma.

- **A — Sem potabilidade estabelecida.** Confirmar apenas a finalidade agrícola que já está no manuscrito; outros usos permanecem abertos. *Custo ou risco:* Não equivale a declarar que toda água purificada é imprópria. `worldbuilding-xxvi:opcao:agua-domestica:apenas-agricola`.
- **B — Potabilidade por regra autoral específica.** O autor poderia criar critérios verificáveis para um uso doméstico definido. *Custo ou risco:* Exige estabelecer limites e origem; não inventar litros ou segurança universal. `worldbuilding-xxvi:opcao:agua-domestica:potabilidade-a-definir`.
- **C — Pesquisa pendente.** Manter potabilidade sem resposta no atlas. *Custo ou risco:* Não prometer abastecimento em mesa. `worldbuilding-xxvi:opcao:agua-domestica:indecidido`.

**Estado:** nenhuma opção escolhida; todas são apenas candidatas.

### 4. Quem realiza a purificação e como esse conhecimento é transmitido? — alta

**Decisão:** `worldbuilding-xxvi:decisao:responsaveis-rito`. **Origem:** `worldbuilding-xxv:pergunta:sacerdotes`. **Dependências editoriais:** `worldbuilding-xxvi:decisao:templo`.

- **A — Tradição ritual compartilhada.** A purificação poderia depender de um corpo de praticantes com tarefas diversas. *Custo ou risco:* Precisa distinguir participantes de pessoas que apenas ajudam. `worldbuilding-xxvi:opcao:responsaveis-rito:coletivo`.
- **B — Conhecimento concentrado em especialistas.** A purificação poderia exigir especialistas reconhecidos pelo templo. *Custo ou risco:* A dependência pode concentrar autoridade. `worldbuilding-xxvi:opcao:responsaveis-rito:especialistas`.
- **C — Identidade dos executantes ainda aberta.** Não atribuir rito a uma profissão ou personagem. *Custo ou risco:* O fato da purificação permanece, mas seus agentes não são nomeados. `worldbuilding-xxvi:opcao:responsaveis-rito:nao-definir`.

**Estado:** nenhuma opção escolhida; todas são apenas candidatas.

### 5. Qual sequência efetiva de atos ou condições faz a purificação funcionar? — alta

**Decisão:** `worldbuilding-xxvi:decisao:mecanismo`. **Origem:** `worldbuilding-xxv:pergunta:processo`. **Dependências editoriais:** `worldbuilding-xxvi:decisao:responsaveis-rito`.

- **A — Rito mágico repetido em condições próprias.** Propor etapas litúrgicas depois de definição autoral. *Custo ou risco:* Não fixar duração ou custo. `worldbuilding-xxvi:opcao:mecanismo:magia-recorrente`.
- **B — Processo dependente de intervenção específica.** O autor poderia definir um requisito mágico particular. *Custo ou risco:* Não inventar artefato nem limitação numérica. `worldbuilding-xxvi:opcao:mecanismo:intervencao-singular`.
- **C — Manter o mecanismo como mistério.** O templo permanece capaz de purificar sem procedimento mecânico detalhado. *Custo ou risco:* Mistério não autoriza onipotência. `worldbuilding-xxvi:opcao:mecanismo:nao-descrever`.

**Estado:** nenhuma opção escolhida; todas são apenas candidatas.

### 6. A purificação funciona sempre ou exige condições e intervalos específicos? — alta

**Decisão:** `worldbuilding-xxvi:decisao:continuidade`. **Origem:** `worldbuilding-xxv:pergunta:continuidade`. **Dependências editoriais:** `worldbuilding-xxvi:decisao:mecanismo`.

- **A — Pode falhar por condições definidas.** Uma limitação explícita poderia criar decisões coletivas e problemas de trabalho. *Custo ou risco:* Efeitos sobre alimento exigiriam observação posterior. `worldbuilding-xxvi:opcao:continuidade:condicionada`.
- **B — Funciona com estabilidade no contexto conhecido.** O autor poderia decidir por uma continuidade ritual confiável. *Custo ou risco:* Não corresponde a produção infinita. `worldbuilding-xxvi:opcao:continuidade:estavel`.
- **C — Ritmo e interrupção desconhecidos.** Não modelar falha ou produtividade sem bases. *Custo ou risco:* Evitar gatilhos automáticos de fome. `worldbuilding-xxvi:opcao:continuidade:indeterminada`.

**Estado:** nenhuma opção escolhida; todas são apenas candidatas.

### 7. Quem tem direito à produção agrícola e quais critérios valem? — alta

**Decisão:** `worldbuilding-xxvi:decisao:distribuicao`. **Origem:** `worldbuilding-xxv:pergunta:distribuicao`. **Dependências editoriais:** `worldbuilding-xxvi:decisao:autoridade`.

- **A — Direitos definidos pelos produtores e famílias.** Colheitas poderiam ser distribuídas por acordos de trabalho e cuidado. *Custo ou risco:* Precisaria contemplar não produtores e visitantes. `worldbuilding-xxvi:opcao:distribuicao:familias`.
- **B — Regras de deliberação civil.** Uma instituição civil escolhida pelo autor decidiria critérios de partilha. *Custo ou risco:* Autoridade não implica direito de confiscar trabalho. `worldbuilding-xxvi:opcao:distribuicao:deliberacao`.
- **C — Distribuição delegada ao templo.** Uma atribuição formal poderia ser concedida explicitamente. *Custo ou risco:* Requer decidir legitimidade e direito de recusa. `worldbuilding-xxvi:opcao:distribuicao:templo`.

**Estado:** nenhuma opção escolhida; todas são apenas candidatas.

### 8. Existe trabalho não sacerdotal indispensável ao rito, e como é reconhecido? — media

**Decisão:** `worldbuilding-xxvi:decisao:auxiliares`. **Origem:** `worldbuilding-xxv:pergunta:auxiliares`. **Dependências editoriais:** `worldbuilding-xxvi:decisao:responsaveis-rito`, `worldbuilding-xxvi:decisao:mecanismo`.

- **A — Funções auxiliares reconhecidas.** O autor poderia detalhar responsabilidades não mágicas e sua remuneração. *Custo ou risco:* Não converter ajuda em servidão obrigatória. `worldbuilding-xxvi:opcao:auxiliares:reconhecido`.
- **B — Cooperação de famílias e ofícios.** Tarefas poderiam ser acordadas entre grupos sem criar emprego formal. *Custo ou risco:* Rotação voluntária não garante igual esforço. `worldbuilding-xxvi:opcao:auxiliares:rotativo`.
- **C — Sem ofícios confirmados.** Preservar a lacuna sem negar a existência de apoio. *Custo ou risco:* Não batizar profissões sem fonte. `worldbuilding-xxvi:opcao:auxiliares:em-aberto`.

**Estado:** nenhuma opção escolhida; todas são apenas candidatas.

### 9. Quais espécies, técnicas, safras e rendimentos agrícolas foram efetivamente observados? — media

**Decisão:** `worldbuilding-xxvi:decisao:cultivo`. **Origem:** `worldbuilding-xxv:pergunta:cultivo`. **Dependências editoriais:** nenhuma.

- **A — Catalogar culturas mediante nova autoria.** Estabelecer espécies e técnicas apenas mediante decisão e novo registro. *Custo ou risco:* Não projetar rendimentos ou safras automáticas. `worldbuilding-xxvi:opcao:cultivo:catalogar`.
- **B — Agricultura plural sem espécies individualizadas.** O autor pode definir diversidade sem uma lista restritiva de plantas. *Custo ou risco:* Isso não confirma quantidades. `worldbuilding-xxvi:opcao:cultivo:diverso`.
- **C — Manter culturas e produção desconhecidas.** O trabalho e a dependência existem; detalhes seguem nulos. *Custo ou risco:* Balanços não recebem valores artificiais. `worldbuilding-xxvi:opcao:cultivo:lacuna`.

**Estado:** nenhuma opção escolhida; todas são apenas candidatas.

### 10. Quais instrumentos, insumos e estruturas materiais são necessários? — media

**Decisão:** `worldbuilding-xxvi:decisao:instrumentos`. **Origem:** `worldbuilding-xxv:pergunta:manutencao`. **Dependências editoriais:** `worldbuilding-xxvi:decisao:mecanismo`.

- **A — Detalhar dependências comprovadas depois.** Criar recursos e inventário somente após definir requisitos e evidências. *Custo ou risco:* Não confundir decoração do templo com equipamento indispensável. `worldbuilding-xxvi:opcao:instrumentos:dependencias`.
- **B — Não formalizar materiais específicos.** Foco na ação ritual, sem cadeia de insumos definida. *Custo ou risco:* Não declarar que não exista manutenção. `worldbuilding-xxvi:opcao:instrumentos:minimo`.
- **C — Pesquisar os materiais.** Registrar lacuna antes de criar rotas de suprimento. *Custo ou risco:* Não atribuir ferramentas, volume ou custo. `worldbuilding-xxvi:opcao:instrumentos:em-aberto`.

**Estado:** nenhuma opção escolhida; todas são apenas candidatas.

### 11. Quanto da agricultura local circula no comércio costeiro, se houver excedente? — baixa

**Decisão:** `worldbuilding-xxvi:decisao:comercio`. **Origem:** `worldbuilding-xxv:pergunta:comercio`. **Dependências editoriais:** `worldbuilding-xxvi:decisao:cultivo`, `worldbuilding-xxvi:decisao:distribuicao`.

- **A — Excedentes negociados sob condições.** O autor poderia estabelecer uma relação material entre lavoura e comércio. *Custo ou risco:* Requer confirmar que há excedente, produtos e parceiros. `worldbuilding-xxvi:opcao:comercio:excedente`.
- **B — Produção priorizada localmente.** A agricultura poderia servir primariamente aos habitantes. *Custo ou risco:* Não cancela comércio de outros bens. `worldbuilding-xxvi:opcao:comercio:consumo-local`.
- **C — Nenhuma relação definida.** Manter comércio confirmado e agricultura confirmada, mas sem declarar transação entre ambos. *Custo ou risco:* Não nomear comprador ou mercadoria. `worldbuilding-xxvi:opcao:comercio:em-aberto`.

**Estado:** nenhuma opção escolhida; todas são apenas candidatas.

### 12. Quem responde quando o rito falha, e como se distingue culpa de incerteza? — alta

**Decisão:** `worldbuilding-xxvi:decisao:responsabilidade`. **Origem:** `worldbuilding-xxv:pergunta:responsabilidade`. **Dependências editoriais:** `worldbuilding-xxvi:decisao:autoridade`, `worldbuilding-xxvi:decisao:templo`, `worldbuilding-xxvi:decisao:continuidade`.

- **A — Prestação de contas civil.** O autor poderia estabelecer procedimento público para investigar danos. *Custo ou risco:* Não presumir tribunal ou crime definido. `worldbuilding-xxvi:opcao:responsabilidade:prestacao-civil`.
- **B — Responsabilidade ritual delimitada.** O templo responderia apenas pelo que realmente controla. *Custo ou risco:* Não responsabilizar todos os praticantes por igual. `worldbuilding-xxvi:opcao:responsabilidade:autoridade-ritual`.
- **C — Conflitos tratados caso a caso.** Sem sistema único declarado, acordos seriam negociados localmente. *Custo ou risco:* Não implica justiça satisfatória ou ausência de violência. `worldbuilding-xxvi:opcao:responsabilidade:caso-a-caso`.

**Estado:** nenhuma opção escolhida; todas são apenas candidatas.

## Impactos que só podem existir após revisão expressa

- **governo:** caso as decisões `worldbuilding-xxvi:decisao:autoridade`, `worldbuilding-xxvi:decisao:templo` sejam expressamente revisadas, o alvo possível é `curadoria/assentamentos/portomonte.json`. Poder civil e eventuais limites do templo poderão ser descritos. **Não inferir:** Não criar órgão formal, título ou hierarquia automaticamente.
- **ritos:** caso as decisões `worldbuilding-xxvi:decisao:responsaveis-rito`, `worldbuilding-xxvi:decisao:mecanismo` sejam expressamente revisadas, o alvo possível é `data/fluxos_costa_sul.json`. Somente um procedimento homologado poderia ampliar a descrição do fluxo ritual. **Não inferir:** Não inventar insumo, intervalo, duração, lançamentos ou litros.
- **agua-domestica:** caso as decisões `worldbuilding-xxvi:decisao:agua-domestica` sejam expressamente revisadas, o alvo possível é `curadoria/assentamentos/portomonte.json`. A seção de água poderia passar a distinguir usos agrícolas e domésticos aprovados. **Não inferir:** Uso agrícola não comprova potabilidade; nenhuma medição automática.
- **continuidade:** caso as decisões `worldbuilding-xxvi:decisao:continuidade`, `worldbuilding-xxvi:decisao:mecanismo` sejam expressamente revisadas, o alvo possível é `data/dependencias_materiais_costa_sul.json`. Poderiam ser descritas condições específicas de continuidade ou interrupção. **Não inferir:** Não converter hipóteses em falhas ocorridas ou penalidades DW.
- **agricultura:** caso as decisões `worldbuilding-xxvi:decisao:cultivo` sejam expressamente revisadas, o alvo possível é `data/balancos_materiais_costa_sul.json`. O balanço poderia ganhar categorias agrícolas identificadas. **Não inferir:** Nunca preencher números sem medidas ou decisão expressa.
- **distribuicao:** caso as decisões `worldbuilding-xxvi:decisao:autoridade`, `worldbuilding-xxvi:decisao:distribuicao` sejam expressamente revisadas, o alvo possível é `curadoria/assentamentos/portomonte.json`. Direitos e critérios aprovados poderiam ser descritos em campo apropriado. **Não inferir:** Não presumir propriedade de toda produção pelo templo.
- **trabalho:** caso as decisões `worldbuilding-xxvi:decisao:responsaveis-rito`, `worldbuilding-xxvi:decisao:auxiliares` sejam expressamente revisadas, o alvo possível é `data/worldbuilding/portomonte-templo-governo-ciclo25.json`. Uma revisão editorial posterior poderia qualificar funções e responsabilidades. **Não inferir:** Não promover propostas de trabalhadores a pessoas reais.
- **infraestrutura:** caso as decisões `worldbuilding-xxvi:decisao:instrumentos`, `worldbuilding-xxvi:decisao:mecanismo` sejam expressamente revisadas, o alvo possível é `data/dependencias_materiais_costa_sul.json`. Insumos comprovados poderiam ser modelados com dependências identificáveis. **Não inferir:** Não criar automaticamente equipamentos, reservatórios, aquedutos ou templos adicionais.
- **comercio:** caso as decisões `worldbuilding-xxvi:decisao:comercio`, `worldbuilding-xxvi:decisao:cultivo`, `worldbuilding-xxvi:decisao:distribuicao` sejam expressamente revisadas, o alvo possível é `data/fluxos_costa_sul.json`. Um fluxo comercial específico poderia ser registrado se os parceiros e bens forem definidos. **Não inferir:** Não presumir comércio direto com Caatinga ou ilhas individualizadas.
- **responsabilizacao:** caso as decisões `worldbuilding-xxvi:decisao:responsabilidade`, `worldbuilding-xxvi:decisao:autoridade`, `worldbuilding-xxvi:decisao:templo` sejam expressamente revisadas, o alvo possível é `curadoria/assentamentos/portomonte.json`. Eventuais mecanismos de responsabilidade civil poderão ser descritos após decisão. **Não inferir:** Não inventar lei, tribunal, pena, coerção religiosa ou evento histórico.

## Doze guardas editoriais

1. Nenhuma escolha sem declaração autoral explícita, identificada e revisável.
2. Silêncio ou ausência de correção nunca significam aprovação.
3. Cada decisão aponta para pergunta e propostas anteriores existentes.
4. Prioridade editorial não corresponde a preferência do autor.
5. Não inferir teocracia, forma jurídica, voto, imposto ou soberania a partir da purificação.
6. Uso agrícola não implica potabilidade nem toxicidade doméstica.
7. Não criar vazões, estoques, safras, excedentes ou capacidade ritual.
8. Risco hipotético não produz fome, morte, dano ou mudanças automáticas de Prosperidade DW.
9. Não atribuir a Portomonte governo de ilhas, Caatinga ou toda Costa Sul.
10. Não alterar as sete criaturas nem fichas, movimentos ou regras DW.
11. Uma aprovação futura exige verificar arquivos e separar novo cânone de afirmação antiga.
12. Mesmo após autorização, impactos no atlas requerem edição específica e testes, nunca mutação por consulta.

## Como usar o ciclo em mesa

Consultar opções é gratuito e não modifica a lore. A prévia de uma escolha deve retornar somente sua formulação e o mapa de impactos, com campos como `aprovacao_autoral:false`, `canon_aplicado:false`, `impactos_aplicados:[]`. Até que o autor tome a decisão, nenhuma hipótese vira acontecimento passado, regra de sociedade, bairro, pessoa, lei, profissão, feitiço, número de estoque ou recurso consumível.

**Próximo horizonte (XXVII):** se surgirem decisões do autor, realizar homologação seletiva de uma ou duas, registrar proveniência e testar a propagação; sem decisões, migrar para outra região ou aprofundar fontes sem forçar aprovação.

