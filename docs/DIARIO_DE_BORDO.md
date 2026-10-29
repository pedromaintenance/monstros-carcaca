# Diário de bordo — Monstros da Carcaça

## 2026-10-26 · Ciclo 1 (concluído anteriormente)

- Fundação: 14 tipos de criatura autorais da Carcaça independentes dos tipos D&D.
- Regiões piloto: Foz, Costa Sul e Eldroth; sete lugares, três agrupamentos/facções de indexação.
- Duas criaturas: Jorō e Gharoz.
- Uma frente proposta sobre a Lança da Perdição e um assentamento de Portomonte parcialmente especificado.
- Validação por JSON Schema e referências por IDs.

## 2026-10-26 · Ciclo 2 (este incremento)

**Conteúdo lido:** `Arquivo dos Mortos Afogados.docx`, fichas de Akaname do Espelho Fundo e Kappa-Escribas Afogados, e `dungeon-world-divisoria-do-mestre-biblioteca-elfica.pdf` como referencial das práticas de movimentos do MJ.

**Conteúdo adicionado:**
- Akaname — yokai singular do Arquivo; ficha autoral CR 10 / CA 17 / PV 168; instinto e três movimentos DW propostos.
- Kappa-Escribas — grupo yokai de manutenção ritual; ficha autoral CR 7 / CA 16 / PV 95; instinto e três movimentos DW propostos.
- Preservada incerteza: origem genealógica dos Kappa não é fechada; associação a uma facção formal dos guardiões é **inferência de indexação**.
- Arquivos de consulta: gerador determinístico, cliente ESM, testes unitários, artefatos `dist/carcaca/`.
- Validador ampliado a todos os JSON em `curadoria/criaturas`, `curadoria/frentes` e `curadoria/assentamentos`, com integridade de referências cruzadas.
- GitHub Actions: valida, testa, regenera artefatos e publica snapshot autoral sem modificar `dist/creatures/`.

**Escopo mantido:** nenhuma alteração em `pedromaintenance/peren-o-bruxo`, nos 222 parâmetros de jogo, ou nas 2.021 variantes de D&D.

**Próximo lote proposto:** Veren Marés-Rubras e Morgat, combinando curadoria de cosmologia demoníaca e relações políticas; Lampreias depois. Atualizar M1 como concluído quando publicação e testes de Actions confirmarem sucesso.

## Decisões para não esquecer

1. Quando um grupo é mencionado em texto como linhagem ou tradição, isso não prova organização política formal.
2. A ficha de Dungeon World usa instinto/movimentos derivados da ficção, não transformação de atributos D&D.
3. Regiões exigem fonte; não criar habitats de fantasia genéricos como fatos estabelecidos.
4. Fatos da campanha e presságios ainda não realizados pertencem a estados diferentes.

### Verificação final do ciclo 2

Workflow: https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40420863395

Resultado observado: **success** em todas as etapas de checkout, Python, Node, JSON Schema, testes JavaScript, geração, conferência e publicação.

Snapshot publicado: `dist/carcaca/manifest.json` indica 4 criaturas, 3 regiões, 7 lugares, 3 facções, 1 frente e 1 assentamento. `dist/carcaca/catalog.json` relaciona Jorō, Gharoz, Akaname e Kappa-Escribas.

**Marco M1 (núcleo 0.1)** concluído: consultas por nome, tipos, região, lugar, facção e estado; indexação reproduzível e cliente consumível por jogos. Continuidade de M2: 3 fichas restantes do Arquivo.

## 2026-10-26 · Ciclo 3 — Ofensiva demoníaca na foz

**Fonte primária:** `Arquivo dos Mortos Afogados.docx`, fichas de Veren Marés-Rubras e Morgat, Quebra-Âncoras do Vazio.

- **Veren:** tipo Carcaça `demonio`, ancestralidade `meio-demonio`, referência D&D literalmente `Médio corruptor (meio-demônio)` (ND 11 / CA 18 / PV 170). Infiltra-se politicamente, usa favores, disfarces e pactos; instinto DW proposto de obter a Lança por entrega voluntária.
- **Morgat:** tipo Carcaça `demonio`, referência D&D literalmente `Grande corruptor (demônio)` (ND 11 / CA 19 / PV 195). Tenente de ruptura, não governante; instinto DW proposto de quebrar formações resistentes.
- Três movimentos DW novos para cada ficha; todas as estatísticas DW (`pv`, `armadura`, `dano`) seguem `null`.
- A frente da Lança continua como **proposta**. Operadores foram adicionados ao perigo de Gharoz, com dois presságios fictícios que não são fatos consumados.
- Sem alterações no balanceamento de Peren ou nas 2.021 variantes importadas de D&D.

**Ponto de atenção editorial:** `meio-demônio` não cria uma classe cosmológica própria; `corruptor` permanece no campo que registra a terminologia da ficha de origem. 

**Próximo lote:** Lampreias do Pavor Abissal; depois, revisão de qualidade e curadoria por regiões.

### Resultado verificado do Ciclo 3

- Commit de conteúdo: `ebc4433d76ffe56639df62e1009ae3b7efd3acf0`.
- Workflow: https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40422431081.
- Status: **success** em todas as etapas, incluindo geração e publicação de `dist/carcaca/`.
- Manifesto publicado: 6 criaturas curadas, 3 regiões, 7 lugares, 3 facções, 1 frente, 1 assentamento.
- Índices: 3 yokai + 3 demônios; todas as 6 ocorrências da coleção vinculadas à região da foz.
- Limitação preservada: os valores PV, armadura e dano de Dungeon World continuam `null` até construção específica do sistema e revisão editorial.

## 2026-10-26 · Ciclo 4 — Lampreias, conclusão cadastral de M2

**Fonte primária**: `Arquivo dos Mortos Afogados.docx`, seção “Lampreias do Pavor Abissal”, comportamento, história, traços e ações. **Regras**: referências de Dungeon World para instintos, movimentos e frentes.

- Ficha nova: `carcaca:criatura:lampreias-do-pavor-abissal`, `categoria: grupo`, `tipo_carcaca: demonio`, D&D original `Médio corruptor (demônio)`, ND 7, CA 16, PV 102.
- O nome “Abissal” **não** as converte em abissais marinhos; a fonte confirma natureza demoníaca. O Mar de Sangue não foi adicionado como ocorrência.
- Fonte caracteriza sua origem como “moldados ou atraídos”: essa ambiguidade permanece aberta. Há hábitos documentados de caça coordenada e alimentação por resíduos psíquicos.
- Instinto e três movimentos DW foram formulados como **adaptações propostas**; PV/armadura/dano DW permanecem nulos.
- A frente existente recebeu as lampreias como agentes auxiliares de Gharoz. Há três presságios ativos por perigo e outros preservados em reserva, não acontecimentos confirmados.
- Dossiê `docs/ECOLOGIA_ARQUIVO_DOS_MORTOS_AFOGADOS.md` relaciona as sete criaturas, seus propósitos e conflitos, separando evidência, inferência e propostas.
- O marco M2 atingiu **7/7 em cobertura cadastral**; status de aprovação narrativa/DW continua pendente.
- Escopo protegido: nenhuma atualização no repositório do Peren, nem no catálogo geral de fichas importadas. `dist/carcaca/` é atualizado via Action dedicada.

**Pendente até confirmar CI:** checar workflow e manifesto gerado com sete criaturas.

### Verificação pós-publicação do Ciclo 4

- Commit das fichas e dossiê: `84b1f07994b7febe8af84862a421aa1c1ae8d86d`.
- Workflow: https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40423407799.
- Todas as etapas da Action finalizaram em **success**.
- Verificação independente dos JSON publicados:
  - `dist/carcaca/manifest.json`: total_criaturas = **7**; 3 regiões, 7 lugares, 3 facções, 1 frente, 1 assentamento.
  - `dist/carcaca/catalog.json`: as sete fichas estão listadas.
  - `dist/carcaca/indexes.json`: 4 `demonio`, 3 `yokai`; todas as sete vinculadas à região da foz.
  - `dist/carcaca/fronts.json`: 2 perigos, 3 presságios ativos em cada.
- Portanto, **M2 está concluído no que diz respeito ao cadastro e à publicação**; aprovação editorial e mecânica de Dungeon World permanecem distintas e abertas.
- Próximo foco: M3 — primeiras povoações/povos e conflitos da Costa Sul, com fonte local obrigatória.

## 2026-10-26 · Ciclo 5 — assentamentos como ecossistemas

**Fontes examinadas:** `Ambientação - A Carcaça - Visão Geral.txt` (Portomonte, Costa Sul, Kuo-Toa, Tortles/Tabaxis); Dungeon World SRD, https://www.dungeonworldsrd.com/gamemastering/the-world/ (steadings, tags e regras de atualização).

**Decisão de arquitetura:** a curadoria separa cidade/povoação DW de habitats coletivos e redes de abrigos. Existem 12 rótulos novos de Carcaça — p.ex. água sangrenta purificada, lavoura sobre pedra, templo purificador, habitat de cavernas e guerra litúrgica — que não produzem bônus mecânicos por si.

**Pilotos:**
- Portomonte: humano, água do Mar de Sangue purificada por templo de Deméter, lavoura sobre pedra, refúgio entre penhascos, comércio costeiro. Não atribuí Prosperidade, População nem Defesas DW.
- Rede de cavernas kuo-toa: entidade **coletiva**; abrigo em cavernas, devoção a Daegon; relações de ataques da região são documentadas, mas origem específica em cavernas (versus cidades subaquáticas) é **inferida**. Dieta e reprodução desconhecidas.

**Integração:** `data/rotulos_assentamentos_carcaca.json`, `data/povos_carcaca.json`, `data/fluxos_costa_sul.json`, schema, validador e índices em `dist/carcaca/`; API ESM de assentamentos com testes de filtros e conservação de `null`.

**Escopo protegido:** nem os monstros de Peren nem as estatísticas D&D foram alterados. Dados em falta permanecem indeterminados; não se pressupõe que todas as criaturas tenham reprodução biológica.

**Execução:** https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40429102303. Etapas de validação, testes e publicação observadas com conclusão `success`.

**Próximo lote:** aprofundar o ecossistema insular de tortles e tabaxis sem inventar nomes e ligações de comércio; explorar a dinâmica de rótulos e abastecimento em cenários hipotéticos.

## 2026-10-26 · Ciclo 6 — Comunidades insulares e cenários DW

**Fonte principal:** `Ambientação - A Carcaça - Visão Geral.txt`, parágrafo sobre as ilhas tortles/tabaxis; referência de regras: https://www.dungeonworldsrd.com/gamemastering/the-world/.

**Curadoria:** criada a área regional `lugar:ilhas-costa-sul`, associada a `regiao:costa-sul`, e o objeto editorial `assentamento:comunidades-insulares-costa-sul` de natureza `conjunto_de_comunidades`. Este objeto não representa uma ilha única nem uma steading DW. Tortles e tabaxis são cadastrados como grupos regionais; a fonte não demonstra que cada ilha abriga os dois povos.

**Dados materiais:** desconhecidos e explicitamente não preenchidos: água potável, alimentação, moradias específicas, nascimentos/reprodução, volume de comércio e forças de defesa. Documentados: comunidades insulares, tradições monásticas locais, defesa disciplinada, viagens sazonais por histórias/recursos, atuação marítima regional e hostilidade aos kuo-toa/abissais marinhos.

**Rótulos e fluxos:** criados `tradicoes_monasticas_insulares` e `defesa_insular_disciplinada`; reutilizado `rotas_sazonais`. Criado `fluxo:viagens-sazonais-comunidades-insulares` com destino desconhecido. Não foi inventada rota comercial com Portomonte.

**Cenários DW:** quatro cartões em `cenarios/assentamentos/costa-sul.json`, cada um explicitamente `hipotese_nao_acontecida`. Em `Aid`, a ausência de juramento confirmado e a necessidade de comunidade DW individualizada são precondições, não fatos. Outros movimentos `Want`, `Trade`, `Capture` igualmente não transformaram as condições de Portomonte.

**Software:** schema dos cenários estabelece `mutacao_canonica: false`; cliente `previewSettlementScenario` gera proposta e mostra condições pendentes em modo somente leitura. Schema, validação cruzada, índices e publicação atualizados.

**Verificação técnica:** [Actions #40430220238](https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40430220238) com etapas de validação, testes e publicação `success`. `dist/carcaca/manifest.json` apresenta 7 criaturas, 3 assentamentos/redes, 14 rótulos, 4 povos regionais, 4 fluxos, 4 cenários. Arquivos de origem e dados mecânicos de Peren/D&D não alterados.

**Próximo alvo de M3:** revisão da relação material entre comunidades e análise por região, mantendo indivíduos, nomes de ilhas, dieta e recursos desconhecidos enquanto a fonte não os especificar.

## 2026-10-26 · Ciclo 7 — Dependências, cadeia material e saves por campanha

**Base consultada:** `Ambientação - A Carcaça - Visão Geral.txt`, seção Além Sul, e [Dungeon World SRD — The World](https://www.dungeonworldsrd.com/gamemastering/the-world/) para condições de mudança entre sessões.

**Novos registros:** `data/dependencias_materiais_costa_sul.json` possui cinco dependências/fluxos:
1. Purificação da água em Portomonte: documentado.
2. Produção agrícola dependente da purificação: documentado e ligada à predecessora acima.
3. Comércio costeiro com parceiros/itens desconhecidos: documentado.
4. Viagens sazonais insulares, com recursos não especificados: documentado.
5. Incursões quo-toa agrupadas em rede de cavernas: origem inferida, rito de captura documentado regionalmente; não constitui alimento.

**Melhoria técnica:** schema dedicado para dependências, checagem de ciclos de dependência, referência a assentamento/fluxo existente, estado de evidência não superior ao fluxo; índices publicados e filtros JS.

**Estado de campanha:** `schemas/estado-campanha.schema.json` e `exemplos/campanhas/exemplo-em-branco.json` definem um arquivo **local**, iniciado com zero eventos. `src/carcaca-campaign-state.mjs` cria o registro e anexa acontecimentos explicitamente aprovados pelo mestre a uma **nova cópia**, nunca altera o objeto original. Não há implementação de gravação em disco, upload, nem alteração numérica do atlas.

**Teste de risco:** interromper hipoteticamente a purificação aponta apenas a lavoura como dependência subsequente explícita; não conclui fome, falta de água potável ou crise regional. Cenários de DW são apenas condições propostas, conforme M3.

**Limitações intencionais:** desconhecidos permanecem nulos ou descritos como lacunas; nenhuma inferência sobre calendário, produção/consumo quantitativos, populações ou dietas. A campanha pode relatar um fato sem que ele altere a referência coletiva.

**Arquivos de maior interesse:** `docs/REDE_MATERIAL_E_ESTADO_DE_CAMPANHA.md`, `dist/carcaca/material-dependencies.json` e `src/carcaca-campaign-state.mjs`. Testes de Actions serão registrados após conferência do snapshot gerado.

### Conferência de distribuição — ciclo 7

- Workflow verificado: https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40431958511, resultado **success** em todas as quatro etapas principais.
- Os JSON publicados em `dist/carcaca/` confirmam 5 dependências e índices separados (`by_assentamento`, `by_fluxo`, `by_tipo`, `by_dependencia_predecessora`).
- O grafo preserva: purificação → lavoura em Portomonte; comércio e viagens insulares **não foram interligados artificialmente**.
- Registros totais: 7 criaturas, 3 conjuntos de assentamento, 5 dependências, 4 cenários; versões de campanha de exemplo continuam sem eventos.
- A biblioteca de estado local não grava arquivos nem altera fatos históricos: eventos só são anexados à nova cópia quando `mestre_confirmou=true` é fornecido explicitamente. Esse sinalizador não autentica a identidade do mestre; o jogo consumidor deverá definir sua autorização.

## 2026-10-26 · Ciclo 8 — Balanços quantitativos opcionais e pressões ambientais

**Fonte primária revisada:** `Ambientação - A Carcaça - Visão Geral.txt`, seção Além Sul. Não fornece volumes, unidades reais de medição, calorias, estoques, calendários de safra, datas das viagens nem balanços populacionais. Esses dados permanecem desconhecidos.

**Artefatos:** quatro perfis em `data/balancos_materiais_costa_sul.json`, quatro riscos hipotéticos em `data/pressoes_ecologicas_costa_sul.json`, schemas e validação de IDs cruzados com as cinco dependências e os quatro fluxos anteriores.

**Decisões:**
- Unidade potencial é mera sugestão de entrada, não valor encontrado na lore.
- Se a fonte não quantifica o perfil, todas as sete medidas permanecem `null`; o código não assume zero.
- Viagens insulares são sazonais, mas não há meses ou períodos específicos.
- Comércio não especificado e histórias não são produtos fungíveis que possam ser somados num único estoque.
- A equação é instrumento matemático auxiliar ao atlas, não regra oficial DW.
- Pressões descritas são gatilhos hipotéticos que nunca acontecem automaticamente.

**Software:** novas APIs de leitura/filtro e `previewMaterialBalance` com conferência de unidade, período e proveniência. Nada é persistido em jogos, muito menos balanceamento de Peren ou estatísticas D&D.

**Próximo estudo:** capacidade de suporte e dinâmica de assentamentos dependente de medidas reais, com atenção a armazenamento, resíduos e mobilidade.

### Conferência final do ciclo 8

- Publicação validada: https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40437639411 — **success**.
- Snapshot do atlas revisado na API GitHub: 4 perfis de balanço, todos `nao_quantificado` com **zero** valores preenchidos, 4 riscos `risco_hipotetico_nao_ocorrido` e 4 novos arquivos de distribuição (dados e índices).
- Índice `by_assentamento` inclui 3 perfis em Portomonte. Viagens sazonais insulares não receberam meses inventados.
- O resultado aritmético de teste (45 litros **fictícios**) foi utilizado apenas em testes automatizados e exemplo de documentação, **não** atribuído a quaisquer fichas canônicas.
- O marco M3 prossegue para a análise de capacidade de suporte e incerteza; nenhum jogo, save ou ficha D&D sofreu alteração.

## 2026-10-26 · Ciclo 9 — Capacidade ecológica sem população presumida

**Base documental:** `Ambientação - A Carcaça - Visão Geral.txt` (Além Sul). A fonte sustenta agricultura com água purificada em Portomonte, comunidades insulares tortles/tabaxis com viagens sazonais e habitat costeiro/subaquático dos kuo-toa. **Não fornece** potabilidade, dietas, alimentação por residente, vagas, capacidade de descarte, residentes, nascimentos, mortes ou migração.

**Registros:** um perfil para Portomonte, um conjunto de comunidades insulares e uma rede de cavernas kuo-toa. Cada perfil tem água potável, alimentação, abrigo e resíduos como perguntas materiais; doze limites em `medicoes_nao_disponiveis` com `valor:null`. A água para lavoura não recebeu indevidamente o status de água potável.

**Continuidade:** dados de residentes, nascimentos, óbitos, migração de entrada e saída não foram inventados. O deslocamento sazonal insular é separado de mudança de residência e de reprodução.

**Código:** schema novo, verificação de referências e cardinalidade dos quatro limites, índices gerados para assentamento/natureza/mobilidade e cliente JS. `previewSupportCapacity` e `previewPopulationFlow` permitem **apenas hipóteses explícitas** com todas as medidas, unidades, períodos, fonte e adequação, sem persistência nem modificação de DW. O limite aritmético é o menor entre quatro dimensões; isso não representa consenso ecológico nem capacidade real da Carcaça.

**Testes e limites:** sem dados => indeterminado; recusa valores sem origem, unidade distinta, períodos diferentes, demanda zero e população negativa. Exemplo de 200 habitantes é fictício e só existe nos testes/documentação, não no atlas.

**Próximo:** estudar material construtivo, saneamento, armazenamento e ecologia regional sem retroconverter simuladores em lore canônica.

### Conferência após publicação — ciclo 9

- Resultado observado: https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40439032942, status final **success**. As quatro etapas essenciais — validação, testes de leitura, geração determinística e publicação — passaram.
- Conferidos diretamente: `dist/carcaca/manifest.json` (`total_perfis_suporte=3`); `support-profiles.json` (Portomonte, conjunto insular, cavernas kuo-toa, todos com quatro dimensões e valores `null`); `support-indexes.json` (assentamento/natureza/mobilidade).
- Confirmação editorial: a sazonalidade insular aparece como `deslocamentos_sazonais_documentados`, mas `residentes`, taxas migratórias, nascimentos e óbitos permanecem sem números. Nenhuma potabilidade foi atribuída à água purificada para a lavoura.
- Todas as estimativas numéricas aparecem somente no simulador/testes, não em curadoria, snapshot canônico ou estado persistido de jogo. A documentação técnica fica em `docs/CAPACIDADE_DE_SUPORTE.md`.

## 2026-10-26 · Ciclo 10 — Evidências de infraestrutura por setor

**Fonte revisada:** `Ambientação - A Carcaça - Visão Geral.txt`, "O Além Sul". O material documenta os penhascos e o templo de Portomonte, as atividades agrícolas/comerciais, comunidades insulares com navegação sazonal e kuo-toa em cavernas e cidades subaquáticas. A fonte não descreve casas e seus materiais, depósitos, métodos de conservação, esgoto, água potável doméstica nem cais individuais.

**Conteúdo publicado:** três perfis de infraestrutura (`infraestrutura:portomonte`, `infraestrutura:comunidades-insulares-costa-sul`, `infraestrutura:rede-cavernas-kuo-toa-costa-sul`) com quatro setores cada: construção/abrigo, armazenamento, saneamento e acessos/logística. O templo de Deméter consta como instalação nominal; nenhum material construtivo foi declarado conhecido.

**Proveniência:** `evidencia_parcial` significa algum elemento associado documentado, não infraestrutura completa; `sem_documentacao` não equivale a ausência real. Tipos de âncora (`geografia`, `habitat_coletivo`, `instituicao_fisica`, `circulacao_regional` etc.) impedem confundir penhasco com parede de pedra ou marinheiros com cais.

**Integração:** `schemas/infraestrutura-assentamento.schema.json`, validador referencial (assentamento, suporte, dependências), indexador determinístico e ESM `getInfrastructureProfile/searchInfrastructureProfiles`. `auditInfrastructure` permite inspeção sem alteração; `previewInfrastructureIssue` mantém toda interrupção como hipótese não ocorrida.

**Escopo protegido:** nenhuma instalação fictícia, evento de campanha ou rótulo Dungeon World foi inserido no cânone, e os arquivos mecânicos de D&D/Peren não foram alterados.

**Detalhes e lacunas:** `docs/INFRAESTRUTURA_DOS_ASSENTAMENTOS.md`.

### Conferência técnica após a publicação — ciclo 10

- Workflow executado: https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40440872683; todas as etapas finais em **success**.
- Arquivos `dist/carcaca/manifest.json`, `infrastructure-profiles.json` e `infrastructure-indexes.json` conferidos: 3 perfis, 12 setores, 0 materiais construtivos confirmados e 1 instalação nominal documentada (Templo de Deméter).
- Setores com âncoras documentais: 4 Portomonte, 2 conjunto insular, 2 cavernas kuo-toa. `evidencia_parcial` não valida uma instalação não citada; por exemplo, o setor de saneamento em Portomonte possui a âncora de purificação da água agrícola, mas **não** prova sistema de esgoto.
- Índice por setor sem documentação inclui saneamento nas ilhas e nas cavernas, sem afirmar que tais comunidades não tenham saneamento de fato.
- Próximo alvo: integrar geografia e pressão de guerras do Além Sul com cuidado para não transformar ameaças regionais em ataques a assentamentos particulares não mencionados.

## 2026-10-26 · Ciclo 11 — Guerras regionais e refugiados

**Fonte primária:** `Ambientação - A Carcaça - Visão Geral.txt`, seção "O ALÉM SUL". A obra diz que os exilados da Caatinga e os sobreviventes da Costa Sul travam guerras constantes, que grupos das terras áridas pilham lavouras de pradarias costeiras, que kuo-toa e abissais capturam pessoas para sacrifícios no litoral e nas ilhas, que alguns refugiados de Eldroth são minoria nos maiores assentamentos, e que o Além Sul não está diretamente ocupado pelos shadow fey.

**Decisão de granularidade:** `regiao:caatinga` é um novo território sem localidades individuais identificadas. Quatro dinâmicas `escala:regional` foram registradas sem IDs de assentamento específico. **Não** se afirma que Portomonte foi saqueada ou recebeu refugiados; não se atribui a todos os orcs a prática de saque; o conflito ritual não é subsistência. A ausência de ocupação direta não significa independência política plena ou paz.

**Rótulos:** quatro novos `rotulo-territorial:*` indexam condições regionais sem alterar os 14 rótulos de comunidades ou qualquer estatística DW.

**Integração:** novo schema, validador para região, rótulos e escala, gerador com índices invertidos, API ESM de busca e `previewTerritorialImpact` em modo só leitura. Fonte confirmada é distinta de consequência possível; eventos não são disparados.

**Próxima unidade:** consolidar um dossiê por região com pressões materiais e políticas e buscar lugares individualizados na Caatinga, mantendo perguntas abertas onde o autor não descreveu um povoado.

**Documento de referência:** `docs/DINAMICAS_TERRITORIAIS_ALEM_SUL.md`.

### Refinamento semântico — ciclo 11

- O rótulo territorial foi renomeado para `rotulo-territorial:presenca_minoritaria_refugiada`: a lore descreve **presença** de refugiados nos grandes assentamentos regionais, não acolhimento institucional formal.
- Corrigida distinção de API: `alvo_nomeado_no_registro` verifica correspondência de assentamento, mas `evento_especifico_confirmado` permanece **false** em uma prévia; fatos de campanha exigem registro explícito no livro-razão.
- Adicionado teste de não confirmação mesmo se uma ficha futura contiver nome de alvo.

### Publicação conferida — ciclo 11

- Workflow final https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40441891327 concluído em **success**; validação, testes, geração de dados e publicação confirmados.
- Conferidos no snapshot `dist/carcaca/`: 4 regiões (nova Caatinga vazia de localidades individuais), 4 rótulos territoriais, 4 dinâmicas, 7 criaturas e 3 registros de comunidade.
- Todas as quatro dinâmicas continuam com `escala:regional`, `assentamento_alvo_id:null` e `evento_campanha_id:null`; consulta a Portomonte não autoriza inventar saque, ataque ou acolhimento.
- O rótulo `presenca_minoritaria_refugiada` reflete presença documentada sem assumir acolhimento institucional. Simulação com alvo nominal continua sem confirmar evento de campanha.
- O Marco M3 permanece em expansão; próximo passo é reunir dossiês de pressão por região e procurar assentamentos concretos na Caatinga em fontes autorais.

## 2026-10-27 · Ciclo 12 — Dossiês regionais de pressão material e política

**Fonte autoral:** `Ambientação - A Carcaça - Visão Geral.txt` para fatos de Caatinga, Costa Sul, Eldroth e foz. Registros de criaturas e frentes da foz vêm de `curadoria/` e conservam suas próprias fontes; não se atribuem falsamente essas sete criaturas à ambientação original.

**Curadoria:** quatro guias, quatro perguntas por região (16 no total). Incluem condições documentadas e lacunas, sem números inventados.

**Composição determinística:** o gerador cruza registros reais: os lugares e assentamentos devem pertencer à região curada; povos são incluídos apenas por associação a assentamentos; facções vinculadas a criaturas não são tratadas como domínio; quatro dinâmicas regionais se refletem em ambos os extremos, com papel `origem` e/ou `destino`, sem duplicação dos dados originais. `pressoes_ecologicas_hipoteticas` e `frentes_propostas` permanecem classes separadas.

**Resultado conferível:** 4 regiões, 16 perguntas; Caatinga 0 assentamentos curados, Eldroth 0, foz 0 (apesar de 7 criaturas, 1 frente e 3 lugares), Costa Sul 3 assentamentos, 5 dependências, 4 fluxos e 4 pressões hipotéticas. Vazios em listas não indicam regiões vazias de vida real.

**Software:** `schemas/guia-dossie-regional.schema.json`, `scripts/gerar_indices_curadoria.py`, `src/carcaca-client.mjs`, `src/carcaca-regional.mjs`. Testes ESM de leitura e não mutação e nova suíte de integração Python que consulta os outputs do gerador.

**Correção durante o ciclo:** um identificador de pergunta da foz continha acento e não passou no schema; foi normalizado para `pergunta:foz-alianca`. Os testes posteriores devem ser conferidos antes do encerramento.

**Continuidade:** filas de lacunas de curadoria sem transformar perguntas em novos fatos ou resultados DW. Documento completo em `docs/DOSSIES_REGIONAIS_M3.md`.

### Verificação final de distribuição — ciclo 12

- Pipeline final conferido: https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40443128581, estado `completed`, conclusão `success`.
- Todas as cinco etapas principais foram concluídas: validador Python, testes Node, novos testes Python de integração, geração determinística com `--check`, publicação automática.
- Inspecionados diretamente os arquivos em `dist/carcaca/`: `manifest.json` (4 dossiês, 16 perguntas), `regional-dossiers.json` (quatro regiões; Costa Sul com três comunidades e quatro dinâmicas; foz com sete criaturas e uma frente; Eldroth e Caatinga sem assentamentos curados), `regional-dossier-indexes.json` (seis grupos de índices).
- Incidências duplicadas na mesma região possuem dois **papéis** em uma única relação, não dois eventos. As contagens são registros cadastrados, nunca métricas populacionais ou índices de perigo.
- O dossiê e os testes passaram após correção do ID acentuado. Encerramento deste lote verificado.

## 2026-10-27 · Ciclo 13 — Organizar pendências materiais por precedência

**Objetivo:** não repetir aleatoriamente pesquisa sobre cada região. Das 16 perguntas derivadas dos dossiês do ciclo 12, oito foram colocadas em ordem de trabalho, com dois lotes de quatro questões (duas por região no conjunto) e quatro vínculos de precedência editorial.

**Primeiro lote:** localizar uma comunidade da Caatinga; verificar usos da água de Deméter; investigar água/alimentos na foz; identificar abrigo civil documentável em Eldroth.

**Segundo lote:** buscar abastecimento da comunidade da Caatinga previamente identificada; investigar rotas de reabastecimento da foz; identificar origens e itinerários dos deslocados de Eldroth; investigar quais cidades da Costa Sul receberam esses refugiados.

**Cuidados de proveniência:** a localização de um povoado não define seu consumo; água purificada para agricultura não é automaticamente potável; ausência de assentamentos curados na foz ou na Caatinga não é ausência real de moradores. Nenhuma questão recebeu resposta de cânone, nem houve confirmação de evento DW.

**Arquitetura:** prioridades curadas somente em `data/prioridades_curadoria_m3.json` com schema; gerador combina prioridades e `data/guias_dossies_regionais.json`, sem copiar manualmente 16 registros paralelos; índices de busca; consulta ESM e revisão sem mutações. Testes Python e JavaScript verificam contagens, ordem, fontes e isolamento.

**Documento:** `docs/FILA_CURADORIA_M3.md`. Próxima unidade: uma pesquisa de fonte autoral por vez, baseada na fila e no que já está escrito.

### Validação final da fila — ciclo 13

- Pipeline confirmado como `completed/success`: https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40443990037. Verificadas cinco etapas: schema e integridade, testes Node, testes Python de integração real, gerador determinístico e publicação.
- No snapshot público `dist/carcaca/`, `manifest.json` registra 16 pendências/8 prioridades. `research-backlog.json` conserva 8 pendências sem prioridade definida e 4 perguntas com precedência editorial; todos os fatos esperados seguem `null`.
- `research-backlog-indexes.json` possui sete grupos de busca. Nenhum setor regional foi considerado desabitado por ausência de registros.
- O backlog oferece roteiro de investigação, não conclusão canônica, ação de jogo ou medição real. Próximo ciclo: auditoria de fontes para uma única prioridade, com resultado verificável, inclusive quando só for possível documentar a insuficiência das fontes.

## 2026-10-27 · Ingestão do manuscrito Hack Carcaça Dungeon World

**Recebido:** `Hack Carcaça Dungeon World.docx` (181 páginas), manuscrito de Pedro Rodrigues. A fonte possui três camadas: ambientação, mecânicas do hack e catálogo de movimentos. A importação integrou **a ambientação (Capítulo I, páginas 2–25)**; não copiou regras DW ou movimentos para o catálogo de fatos do mundo.

**Fonte preservada:** `fontes/autoria/hack-carcaca-dw-capitulo-i.paginas.json`, 24 páginas de texto, registrado sob `hack_carcaca_dw_rascunho` em `data/fontes_projeto.json`. A captura conserva quebras de página como referência, não afirma ser edição final do DOCX.

**Índices e fatos em revisão:** 100 entradas de entidades/temas, 18 pontos de cronologia EC, 7 perguntas em aberto, 7 pontos de reconciliação editorial e 14 pontes com o Atlas M3. Os registros preservam `afirmado_no_rascunho` e `referencia_sem_mutar_canonico`, não estado `documentado` dos assentamentos.

**Principal ganho de curadoria:** o texto individualiza **Portomonte como um dos destinos de alguns druidas exilados de Eldroth**, além de outros destinos como Thargrid e arquipélagos. A fila de M3 continua sem evento ou números de refugiados por assentamento; há nova evidência para avaliar manualmente e com escala restrita ao grupo de druidas.

**Novas oportunidades:** reforço da sociedade material de Thargrid (minas, forjas, depósitos, galerias), distinção de Abissais marinhos e demônios do Abismo, cultura de tritões e sereias no oceano azul, religião plural, geografia colonial de Garganta/Drakport e tradições linguísticas da civilização Yokai.

**Conflitos deliberadamente mantidos abertos:** relação espacial Gualápolis/Shadar-Riverie/Boca; referência a expulsão kuo-toa do Extremo Oeste; polissemia de Yokai; cosmologia de Abissais; limites do uso da água de Deméter; novos destinos de refugiados; direito de nomear. Nenhuma resolução inventada.

**Dados e software:** `data/lore/`, `schemas/lore-hack-manuscrito.schema.json`, `scripts/validar_curadoria.py`, `scripts/gerar_indices_curadoria.py`, API `src/carcaca-client.mjs`; testes de correspondência de páginas, referência e separação canônica.

**Documento:** `docs/LORE_HACK_CARCACA_DW.md`.

### Conferência após publicação — manuscrito Hack DW

- Pipeline https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40446090125 completado com `success` em cinco etapas.
- Indexação `dist/carcaca/` verificada diretamente: 100 entradas, 18 eventos EC, 7 perguntas históricas abertas, 7 pontos de revisão e 14 pontes regionais, com 644 termos no índice invertido.
- Fonte preservada em 24 páginas (Capítulo I), acesso a capítulos mecânicos mantido fora do atlas. Total de criaturas (7) e assentamentos (3) não foi alterado pela publicação.
- Correção de integridade: uma ponte para Gualápolis referenciava a página 7, mas seu verbete enumerava a página 6; ajustada a ponte para a página 6 e revalidado o cruzamento. A ambiguidade topológica permanece **não resolvida**, como convém.
- `pergunta:costa-sul-migracao`: uma evidência parcial sobre druidas em Portomonte foi indexada, não canonizada por inteiro ou transformada em contagem de refugiados.

## 2026-10-27 · Segunda auditoria — aprofundamento da indexação do Hack DW

O glossário de 100 verbetes passou a **157**: foram adicionadas **38 divindades** e **19 noções culturais, ecológicas e políticas**, com referências à fonte e páginas. Corrigido schema para permitir o nome legítimo de duas letras **Rá**.

A fonte textual de mecânicas das páginas 26–181 foi extraída em quatro arquivos, preservando **155 páginas de texto**. **A página 91 não apresentou texto extraível**, devendo ser inspecionada visualmente; não a classificamos como vazia. Extração por páginas de duas colunas pode desordenar conteúdo. Um índice secundário tem **653 rótulos candidatos**, identificou menções a `REQUER:` em **86 páginas** e preserva explicitamente sua condição de instrumento preliminar — não movimentos verificados.

`scripts/validar_curadoria.py` passou a validar paginação, pacotes de texto e separação canônica; `scripts/gerar_indices_curadoria.py` passou a distribuir `hack-mechanics-index.json` com contagens no manifesto; `src/carcaca-client.mjs` oferece busca mecânica por página, rótulo e categoria. Atualizados testes Python e JS.

**Exemplo de cautela:** o movimento Portomontense concede uma capacidade ao personagem; isso não resolve automaticamente a questão ecológica da potabilidade de Portomonte. Outro cuidado é não emparelhar um `REQUER:` com o movimento na coluna adjacente.

Documento: `docs/REVISAO_AMPLIADA_HACK_CARCACA_DW.md`.

### Validação de distribuição — segunda auditoria do manuscrito

- Pipeline de integração confirmado concluído com sucesso: https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40447368396
- Artefatos consultados diretamente no branch: `dist/carcaca/manifest.json` (**157 verbetes, 155 páginas, 653 rótulos**), `dist/carcaca/hack-mechanics-index.json` (página **91** ausente da extração, **86 páginas** com alguma menção a `REQUER:`), mais o relatório editorial publicado.
- Durante a verificação foram corrigidas duas situações: o nome curto da divindade **Rá** necessitava aceitação pelo schema e a antiga suíte de testes esperava ainda **100** verbetes. Ambas foram ajustadas antes da execução aprovada.
- O índice de movimentos não é catálogo de habilidades revisadas: 653 são **rótulos candidatos**, sujeitos a títulos gerais e interferências entre colunas.

## 2026-10-27 · Terceira auditoria — rede de relações e estrutura de movimentos

**Capítulo I:** 26 relações novas entre entidades já indexadas (poder territorial, religião, resistência, memória e produção), cada uma com página e âncora textual. O validador verifica endpoints e trechos literais na transcrição. `aplicacao_canonica:false` em todas.

**DOCX original:** amostra de 41 movimentos com grupo, categoria, posição do parágrafo (zero-based), título em negrito e 26 requisitos `REQUER:` conferidos literalmente. `efeito_revisado:false` explicita que títulos/pré-requisitos foram auditados, mas efeitos, listas e árvore completa ainda não foram certificados.

**Resolução da página 91:** DOCX convertido em PDF de 181 páginas; texto extraído da página 91 retornou vazio e a imagem mostrou somente o fundo. Registrado `conferencia_pagina_91`, mantendo o campo antigo de página sem texto por compatibilidade.

**Ferramentas:** gerador determinístico, validador de referências e fontes, novos filtros ESM e testes Python/Node. Não houve alteração nos sete monstros nem nos três assentamentos existentes.

**Próximo:** migrar movimentos em pequenos conjuntos, associando efeitos completos e combinando requisitos somente quando revistos; não usar este índice parcial em validação real de compras e concessões.

Documento: `docs/TERCEIRA_AUDITORIA_HACK_CARCACA_DW.md`.

### Conferência do snapshot e da execução — terceira auditoria

- Workflow final **success**: https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40449350728; passaram schema/referências, testes JS, testes Python e geração/publicação.
- `manifest.json` observado: 26 relações de lore, 41 movimentos parcialmente conferidos, 26 requisitos literais. Correspondência confirmada entre manifestação e arquivos `lore-relations.json`/`hack-selected-movements.json`.
- Índices publicados: `by_entidade`, `by_tipo`, `by_pagina`; `by_grupo`, `by_categoria`, `by_requisito` e `by_pagina_candidata`. Estas últimas páginas são *candidatas*, enquanto `paragrafo_docx` é a âncora verificada dos movimentos selecionados.
- Metadado de página 91 verificado no snapshot; nenhuma intervenção em registros canônicos de criaturas, assentamentos ou saves.

## 2026-10-27 · Quarta auditoria — textos integrais e tabelas DOCX

**Lacuna descoberta:** `Document.paragraphs` omite as **33 tabelas** do DOCX. Destas, 10 são quadros narrativos, duas tabelas numéricas e 21 contêm quadros gerais de regras/movimentos, antes indexados apenas parcialmente.

**Transcrição integral:** publicados **12 Movimentos de Povo**, seis Humanos (parágrafos 827–832) e seis Orcs da Caatinga (834–837, 842–843), com campos para texto original, marcador, requisitos, opções, grupo e origem. As quatro opções de Saqueador da Caatinga estão preservadas com seus parágrafos 838–841.

**Cautelas:** Portomontense é capacidade individual, não abastecimento municipal; Guerra de Nove Anos é nome mecânico, não calendário comprovado; Saqueador não define toda a cultura orc. Movimentos possuem `texto_integral_conferido:true`, mas `aplicacao_canonica:false`. Quadros de tabelas `texto_integral_curado:false`.

**Software:** gerador, validador de integridade e referências, métodos de consulta ESM, testes Node e Python. Sem alteração de fichas existentes.

**Documento:** `docs/QUARTA_AUDITORIA_HACK_CARCACA_DW.md`.

### Snapshot e validação final da quarta auditoria

- [Execução #40520057084](https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40520057084) aprovada nas cinco etapas: curadoria, Node, Python integrado, geração determinística e publicação.
- Artefatos `dist/carcaca/hack-complete-pilot-movements.json`, `hack-complete-pilot-movement-indexes.json`, `hack-docx-tables.json`, `hack-docx-table-indexes.json` consultados diretamente após publicação.
- 12 textos completos; Saqueador da Caatinga com 4 opções documentadas; 33 tabelas classificadas em 10 narrativas, 2 numéricas e 21 de movimentos/regras gerais.
- Três cabeçalhos já existentes ligados por `revisao_preliminar_id`, sem inventar vínculos. Estados `aplicacao_canonica:false` mantidos. Cânone ecológico e fichas de campanhas preservados.

## 2026-10-28 · Povoamento XI — Ironwood, Eldroth e Vandar

Continuidade direta do Povoamento X: a mensageira Vaelis, anteriormente proposta em Thargrid, reaparece como hipótese editorial de comunicação com Ironwood, sem virar evento confirmado.

Criadas 40 entradas — cinco microespaços, cinco coletivos, oito pessoas, quatro dilemas, cinco fluxos, quatro acordos, seis cenas e três arcos — em `data/propostas/ironwood-eldroth-resistencia-hack.json`. A produção cotidiana combina acolhimento, formação, preservação de testemunhos, pesquisa sobre a floresta corrompida e proteção da informação. Não há população, geocodificação, itinerários reais ou novos eventos confirmados.

A fronteira canônica foi preservada: Eldroth continua sob Lady Sylara; Vandar, sob Lord Damaris; Ironwood é fortaleza de resistência liderada por Elara Stormoak, ao sul de Thargrid. Movimentos de elfos da floresta e shadow fey são apenas referências culturais. `REQUER` mantém seu sentido obrigatório em qualquer futura ficha.

As saídas ficam em `dist/carcaca/ironwood-eldroth-resistance*.json`, com manifest/índices gerados, cliente somente leitura, integridade no validador e cobertura de testes Node. Dossiê editorial em `docs/IRONWOOD_ELDROTH_POVOAMENTO_CICLO11.md`.

## 2026-10-28 · Ciclo XII — Ecologia Monstruosa sem canonização

Retomada direta do Ciclo XI. Foram inventariadas oito criaturas **novas e propostas** para Eldroth, Vandar e Ironwood, seis encontros vinculados a cenas anteriores, quatro pressões e duas frentes Dungeon World não iniciadas. A arquitetura separa `data/propostas` (hipóteses jogáveis) de `curadoria/criaturas` (fichas de referência).

As propostas incluem Coruja do Eco Emprestado, Micélio das Vozes Partidas, Cardos que Bebem Cinza, Cervo dos Galhos Invertidos, Besouros da Casca Riscada, Escrivão da Folha Lacrada, Andarilho de Sepultura Negada e Cão de Esporos do Limiar. Nenhuma ocorrência territorial, filiação à Corte, dieta ou biologia reprodutiva foi confirmada. Instinto e movimentos são ficcionais; números aguardam criação DW.

Integração técnica: contrato JSON Schema, `scripts/validar_curadoria.py`, índice em `scripts/gerar_indices_curadoria.py`, métodos ESM e testes reais Python/Node. A automação passa a observar toda a pasta `data/propostas/**` mantendo a política de publicar apenas em `main`. Consulte `docs/ECOLOGIA_MONSTRUOSA_ELDROTH_CICLO12.md`.

## 2026-10-28 · Ciclo XIII — Estatísticas DW pela ficção, não por ND

Oito fichas mecânicas propostas, com escolhas individuais e explicadas. Sete possuem PV, dano, armadura e alcances calculados pelo procedimento de `Making Monsters`; o Micélio das Vozes Partidas é uma exceção explícita por `Monsters Without Stats`, não lacuna na implementação. A origem de cada instinto e movimento continua sendo o ciclo XII.

A implementação acrescenta `data/propostas/eldroth-fichas-dw-ciclo13.json`, schema, `scripts/calcular_monstros_dw.py`, testes de fórmula e integridade, exportação em `dist/carcaca`, índices e métodos ESM. Os números das propostas **não alteram** as sete fichas da curadoria nem promovem tipos, filiações ou ocorrências ficcionais a fatos canônicos. Registro de justificativas e futura revisão em `docs/FICHAS_DW_ELDROTH_CICLO13.md`.

## 2026-10-28 · Ciclo XIV — Volta ao worldbuilding: Eldroth, Ironwood e Vandar

**Nova prioridade editorial:** deixar mecânicas DW em segundo plano e construir história social, cultura, religião, geografia, política e vida cotidiana antes de novos monstros e encontros.

A revisão das fontes cruzou `Ambientação - A Carcaça - Visão Geral.txt` com as páginas 5, 7, 9, 16–18, 20 e 24 de `fontes/autoria/hack-carcaca-dw-capitulo-i.paginas.json`, as fronteiras do atlas de regiões, o povoamento XI e a cronologia existente. A análise distingue claramente os refugiados feéricos de **501 EC**, a migração de lordes em **666 EC**, a guerra de conquista a partir de **875 EC** e a ordem colonial consolidada em **910/912 EC**; sem atribuir data à queda de Vandar nem anexar Ironwood à região de Eldroth.

Entregas: `docs/ATLAS_HISTORICO_CULTURAL_ELDROTH_CICLO14.md` (dossiê narrativo) e `data/worldbuilding/eldroth-ironwood-vandar-ciclo14.json` (3 áreas, 6 marcos, 14 eixos culturais, 42 alternativas não adotadas); integração no índice, exportação e leitura API, CI e testes de proveniência. Nenhuma nova espécie, facção, assentamento ou evento foi promovido a fato.

Próximos temas: **XV** Eldroth pré-conquista, **XVI** sociedade sob a ocupação de Sylara, **XVII** a cidade arruinada de Vandar e **XVIII** a vida civil de Ironwood e a diplomacia da resistência.

## 2026-10-28 · Ciclo XV — A Eldroth anterior à guerra da Rainha

**Continuidade da prioridade de worldbuilding.** Revisamos o manuscrito nas páginas 9, 16, 17, 18, 20 e 24 e o atlas XIV para estudar a sociedade de Eldroth antes das guerras abertas em **875 EC**.

O texto registra comunidades élficas antigas, círculos druidas que mediavam disputas, períodos de caça/coleta, lugares sagrados e pactos com espíritos; também registra fadas refugiadas desde **501 EC**, convivência com comunidades locais e lordes que chegaram oficialmente em **666 EC**. A fonte **não** dá nomes de aldeias, famílias ou tribunais precursores nem a data de ascensão de Sylara. A mediação entre comunidades demonstra que o passado não precisa ser idealizado como ausência de conflitos.

Entregas: `docs/ELDROTH_PRECONQUISTA_CICLO15.md` e `data/worldbuilding/eldroth-preconquista-ciclo15.json`: 4 fases de estudo, 8 práticas candidatas, 4 pactos não assinados, 4 ciclos materiais não quantificados, 4 vinhetas ficcionais e 24 alternativas não adotadas. Cinco questões de revisão autoral permanecem pendentes. Integração técnica por schema, validador, gerador determinístico, API e testes. Próximo foco: ciclo XVI, a sociedade ocupada por Sylara.

## 2026-10-28 · Ciclo XVI — Eldroth sob o domínio de Sylara Nightwhisper

Cruzamento do manuscrito do Hack (pp. 5, 7, 9, 16 e 17) com os ciclos XIV e XV, mantendo **worldbuilding social e institucional** como prioridade em lugar de novos monstros e combates.

A ocupação da floresta e o uso de criaturas como vigilantes estão descritos. Os detalhes do governo, porém, não: não há documento de cobrança, cadastro, patrulha, tribunal ou decreto de Sylara. O dossiê `docs/ELDROTH_SOB_SYLARA_CICLO16.md` e a matriz `data/worldbuilding/eldroth-ocupacao-sylara-ciclo16.json` propõem **oito formas possíveis de apropriação colonial** das oito práticas sociais candidatas do XV, discutindo alimento, água, abrigo, terra, memória, pacto, parentesco e ecologia. Nenhuma recebe status de política realizada.

O atlas inclui 6 posições sociais abstratas (não personagens), 3 modelos alternativos não adotados de administração, 4 dilemas e 4 vinhetas não ocorridas; cinco decisões de governo permanecem com o autor. Validações, índices e API de consulta preservam ausência de números, órgãos e fatos não documentados. A distinção entre coerção e colaboração voluntária e a autonomia das criaturas não-humanas são requisitos da continuidade.

**Próximo ciclo XVII:** Vandar, cidade anterior à ruína e memória dos mortos sob Damaris — sempre separando história documentada das propostas.

## 2026-10-28 · Ciclo XVII — Vandar e a política dos mortos

A prioridade segue em **worldbuilding histórico, cultural, jurídico e político**. Cruzamos o manuscrito autoral do Hack (principalmente p. 5, com religião comparada contextual na p. 24), o atlas XIV e a geografia documentada (`regiao:eldroth`, `lugar:vandar`).

**Fatos que a fonte sustenta:** Vandar foi uma cidade próspera; hoje é ruína ocupada por Lorde Damaris Blackthorn, que comanda um exército de mortos-vivos e utiliza as ruínas para incursões. **Lacunas importantes:** fundação, destruição, agente causador da ruína, população, vida urbana, localização/arquitetura de arquivos e templos, origem e consciência dos mortos-vivos. A narrativa não toma “Damaris ocupa as ruínas” como prova de que ele iniciou a destruição nem identifica os soldados mortos-vivos como ex-moradores.

**Entregas:** `docs/VANDAR_POLITICA_DOS_MORTOS_CICLO17.md` e `data/worldbuilding/vandar-politica-dos-mortos-ciclo17.json` com 3 fases sem datas, 8 questões de sociologia urbana, 5 modalidades de prova não conclusiva, 4 estados jurídico-filosóficos não vigentes da morte, 6 papéis sociais sem NPCs, 3 modelos políticos não adotados, 4 vinhetas nunca ocorridas e 8 perguntas autorais pendentes. JSON Schema, validador, API ESM, índices e testes mantêm as incógnitas explicitamente nulas. As sete criaturas canônicas e a autonomia de Ironwood permanecem intactas.

**Próximo foco — Ciclo XVIII:** a vida civil de Ironwood e a diplomacia descentralizada da resistência.

## 2026-10-28 · Ciclo XVIII — Ironwood, quem sustenta a resistência?

Foco no **worldbuilding civil** de Ironwood. Fonte principal: manuscrito do Hack Carcaça pp. 6–7, 16–18, 20 e 24. Documentado: floresta/fortaleza ao sul de Thargrid, liderança ranger de Elara Stormoak, proteção de civis nas decisões de combate, descentralização da resistência e pluralidade de elfos, gnomos, humanos, meio-elfos, feéricos e refugiados; ritos florestais diversos e alianças com gnomos.

**Lacuna exposta:** Ironwood existe na lore e está situada ao sul das montanhas de Thargrid, mas os registros geográficos normalizados ainda não trazem `regiao:ironwood` nem `lugar:ironwood`. Para evitar topologia artificial, ambos foram mantidos **nulos** no novo conjunto. A autoridade militar de Elara não se tornou automaticamente poder civil ou comando supremo da Carcaça.

Entregas: `docs/IRONWOOD_SOCIEDADE_RESISTENCIA_CICLO18.md` e `data/worldbuilding/ironwood-sociedade-resistencia-ciclo18.json`. Oito eixos de vida civil, três modelos concorrentes e não adotados de governo, quatro relações diplomáticas sem tratados assinados, quatro circuitos materiais sem quantidades, quatro dilemas não ocorridos, quatro vinhetas literárias e oito decisões pendentes. JSON Schema, validador, API ESM, índices e testes preservam o cânone.

Este incremento encerra o primeiro arco regional de worldbuilding XIV–XVIII. A prioridade seguinte é revisão autoral das hipóteses e planejamento de novos territórios ou povos, sem tratar todo o material proposto como história confirmada.

## 2026-10-28 · Ciclo XIX — Da proposta à decisão autoral

Revisamos os cinco ciclos XIV–XVIII para construir uma **mesa de aprovação**, sem confundir produção de opções com fatos da ambientação. As fontes canônicas, os trechos do manuscrito do Hack e as hipóteses posteriores mantêm estatutos separados.

O inventário estruturado contém **103 candidatos** ligados a registros existentes (42 alternativas de XIV, 24 alternativas mais quatro pactos de XV, 8 mecanismos e 3 modelos de XVI, 8 estudos urbanos e 3 modelos de XVII, 8 eixos civis e 3 modelos de XVIII). Existem **20 decisões autorais priorizadas**, com pré-requisitos editoriais, dez guardas de fonte e cinco campos cuja resposta continua nula: geografia normalizada de Ironwood, queda de Vandar, identidade dos mortos-vivos, instituições locais de Sylara e governo civil de Elara.

Entregas: `docs/MESA_REVISAO_AUTORAL_CICLO19.md` e `data/worldbuilding/revisao-autoral-atlas-ciclo19.json`, com schema, validador, índices, consultas ESM e testes. **Nenhum status foi alterado para aprovado**, nenhuma opção foi adotada por silêncio e nenhum evento de campanha foi declarado ocorrido. A integração do roteiro de decisões preserva a autonomia autoral.

Próxima direção: responder escolhas pontuais com fonte, redação e alcance explícitos, ou ampliar pesquisas geográficas e culturais enquanto decisões estiverem abertas.

## 2026-10-28 · Ciclo XX — Grama-Cortada e a independência da vida cotidiana

Retomamos **worldbuilding expansivo**, após o ciclo de revisão XIX. O foco se afasta da guerra e desenvolve o Condado de Grama-Cortada como comunidade com vida própria. Manuscrito do Hack, pp. 18–19: hobbits/halflings, Menelau Folha-Seca, pequenas vilas e campos, influência informal de famílias e anciãos, agricultura diversificada, despensas, cervejas, tabacos, erva-de-hobbit, memórias orais e resistência principalmente discreta.

Foram construídos **9 domínios cotidianos, 5 circuitos econômicos, 4 modelos interpretativos de convivência, 5 tensões internas, 4 possíveis celebrações, 4 gêneros de transmissão da memória, 4 vinhetas e 8 perguntas autorais**, com **12 âncoras textuais** e limites rigorosos sobre o que a fonte não diz. Preservamos distribuição geográfica, população, arquitetura uniforme, rito oficial e política de propriedade como desconhecidos.

Entregas: `docs/GRAMA_CORTADA_COTIDIANO_CICLO20.md`, `data/worldbuilding/grama-cortada-cotidiano-ciclo20.json`, schema, validador, cinco índices, API read-only e testes. Não criamos monstros, regras, festivais ocorridos ou localidades canônicas. Próximo horizonte indicado: culturas gnômicas — rocha, floresta e profundezas — e suas economias do conhecimento (Hack, pp. 19–21), sem nova rodada prematura de homologação.

## 2026-10-28 · Ciclo XXI — Gnomos, conhecimento e a responsabilidade de revelar

Worldbuilding expandido a partir das pp. **19–21 e 23** do manuscrito do Hack. Os gnomos são apresentados como povos **dispersos**, com expressões culturais distintas nas **rochas, florestas e profundezas**. O interesse pelo conhecimento, a cartografia, os nomes múltiplos, os registros Yokai e a presença de Garl Glittergold não autorizam concluir unidade política, culto exclusivo ou patrimônio acadêmico comum.

O novo dossiê `docs/CULTURAS_GNOMICAS_CICLO21.md` trabalha o que significa **inventar, preservar, compartilhar e recusar conhecimento**. A base `data/worldbuilding/culturas-gnomicas-ciclo21.json` separa **14 afirmações de fonte** de **39 hipóteses socioculturais** (3 tradições, 12 eixos, 6 éticas, 5 redes, 5 conflitos, 4 costumes, 4 vinhetas) e **9 decisões em aberto**. É deliberadamente ampla em família, autonomia, produção e cotidiano, sem reduzir os gnomos a mecanismos, ardis ou militantes da resistência.

O schema e a validação protegem as distinções: alguns pactos svirfneblin com anões não equivalem a vassalagem de todos; gnomos florestais não são súditos de Elara; habitantes de Shadar-Riverie não se tornam agentes da Corte por profissão; nenhum segredo cartográfico foi convertido em rota e nenhuma vinheta foi apresentada como episódio histórico. Exportados seis índices determinísticos e leituras ESM com testes.

O **Ciclo XXII** pode expandir a vida e as culturas dos **meio-demônios** (manuscrito p. 21), sem moralizar a ascendência e sem antecipar a revisão canônica.

## 2026-10-28 · Ciclo XXII — Meio-Demônios, corpos, famílias e autonomia

A pesquisa do manuscrito (p. 21; cronologia p. 9) sustenta descendência demoníaca misturada, cosmologia sem separação essencial entre demônios, diabos, cambions e tieflings, e variação substancial de genealogia, aparência, afinidades e relação individual com o Abismo. A invasão registrada em 983 EC não é origem universal das linhagens, cuja presença aumentou após grandes invasões mas não ficou restrita a um único momento.

O novo dossiê `docs/MEIO_DEMONIOS_SOCIEDADES_CICLO22.md` situa **família, trabalho, infância, adaptação corporal, cultura material, religião e vida urbana** no centro do mundo. A base `data/worldbuilding/meio-demonios-sociedades-ciclo22.json` separa **14 âncoras textuais** de **37 propostas não canônicas**: 11 eixos sociais, 6 contextos de convivência, 6 circuitos civis, 6 conflitos, 4 costumes candidatos e 4 vinhetas; 9 questões permanecem sem resposta.

Schema, validador, cinco índices, API ESM e testes resguardam a diferença entre fonte, hipótese e aprovação. Não foram inventados município, aldeia, legislação, ritual, divindade obrigatória ou eventos de campanha. As sete criaturas canônicas permanecem intocadas. Próximo horizonte sugerido: estudo da vida civil da Caatinga do Além Sul, para ampliar povos e regiões além das culturas já exploradas.

## 2026-10-28 · Ciclo XXIII — A Caatinga habitada além de guerra e poços

Retomamos a Caatinga **depois** de descobrir que o repositório já continha propostas extensas de povoamento (Poço Sem Bandeira, Feira das Ferragens, Pátio das Cabaças, Pedra dos Nove Silêncios e Baixio das Sementes), dinâmicas territoriais e relações condicionais com Portomonte. Evitamos duplicá-las: elas permanecem **hipóteses anteriores**, agora ligadas por ID a perguntas culturais mais amplas.

O [novo dossiê](CAATINGA_VIDA_CIVIL_CICLO23.md) separa doze afirmações documentadas do Hack (pp. 5, 9 e 12): ausência de ocupação shadow fey direta, aridez, populações dispersas, pilhagens regionais, comércio costeiro de Portomonte, purificação de água para agricultura, e aliança orc–humana contra os kuo-toa em 351 EC. Nenhuma pilhagem concreta foi atribuída a Portomonte ou a todos os orcs; nenhuma potabilidade, vazão, fronteira ou clima numérico foi inferido.

O [JSON](../data/worldbuilding/caatinga-vida-civil-ciclo23.json) inclui **40 propostas** (12 domínios sociais, 6 circuitos materiais, 6 dilemas de justiça hídrica, 6 mobilidades, 5 relações interregionais, 5 vinhetas não ocorridas), **12 ponteiros de fonte existentes** e **10 perguntas autorais**. Integram-se schema, validador referencial, seis índices determinísticos, API ESM, testes Node/Python e atualização do roadmap. Nenhum lugar novo foi adicionado à `regiao:caatinga` e as sete criaturas canônicas permanecem intactas.

O próximo horizonte sugerido é a **vida civil na Costa Sul e Portomonte**, com foco em agricultura sob bênção de Deméter, ofícios, instituições de vizinhança e relações com os povos insulares, evitando repetir os dossiês de pressão marinha e fronteira já existentes.


## 2026-10-28 · Ciclo XXIV — Portomonte além da ameaça marinha

O ciclo foi iniciado a partir da orientação do XXIII para explorar as condições civis da Costa Sul. Foram integrados dez fatos das páginas 5, 12, 14 e 15 do Hack e trinta e seis propostas sociais sobre famílias, cuidado, infância, trabalho, educação, circulação e crenças. A cada hipótese corresponde uma referência preexistente dentre treze IDs de propostas do litoral, da pressão do Mar de Sangue e da fronteira com a Caatinga. As dez perguntas do autor continuam sem respostas presumidas.

A investigação evita equiparar o milagre agrícola de Deméter a potabilidade doméstica, bem como o comércio de Portomonte a poder administrativo sobre as ilhas. Os personagens, portos, estruturas civis e encontros anteriores continuam propostas. O ciclo insere JSON Schema, validador sem mutação, exportações/indexação determinísticas, cliente ESM e testes. Nenhuma ficha de monstro nem regra DW foi alterada.


## 2026-10-28 · Ciclo XXV — O milagre e a cidade

A partir do Ciclo XXIV foi feita uma investigação concentrada em **Portomonte e no templo de Deméter**. O manuscrito do Hack (pp. 5, 12) afirma a purificação do Mar de Sangue para cultivar até sobre pedra e a autonomia relativa da cidade; não fornece forma de governo, processo litúrgico, trabalhadores, capacidade, potabilidade doméstica ou produção quantitativa. Os balanços do repositório preservam medidas nulas e a dependência lavoura–purificação, sem projetar colapso automático.

O novo dossiê registrou **8 fatos com fronteiras inferenciais, 12 referências cruzadas a IDs existentes e 36 alternativas não canônicas**: 4 modelos políticos, 8 etapas hipotéticas de trabalho, 8 posições sociais, 6 formas possíveis de contestação, 6 dilemas de distribuição e 4 vinhetas não ocorridas. As 12 perguntas autorais permanecem sem escolha. O cliente ESM oferece consultas e prévia de modelo sem alterar o mundo ou saves. Nenhuma instituição, ato político, pessoa, edifício, tarifa, número material, movimento DW ou criatura foi canonizado.
