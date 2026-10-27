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
