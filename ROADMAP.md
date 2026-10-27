# Roadmap — Bestiário e ecologia da Carcaça

Objetivo: preservar a taxonomia D&D como referência e criar o **Tipo de Criatura da Carcaça** para jogos, enriquecendo cada criatura com ecologia, regiões, cultura, organização, conflitos e, quando apropriado, Dungeon World.

## Princípios não negociáveis

- **A ficha D&D não é a ficha DW.** Instinto, movimentos e tags surgem da ficção; PV/dano/armadura de DW exigem respostas às perguntas oficiais de criação de monstros, nunca fórmula de conversão de ND.
- D&D: campo de referência preservado por edição e fonte. Carcaça: tipo independente, curado.
- Natureza/tipo, ancestralidade, tradição, facção, papel político, habitat e alinhamento são dimensões independentes.
- Yokai não vira automaticamente um shadow fey; demônios da Carcaça não são subdivididos pela taxonomia cosmológica D&D. Abissal marinho NÃO é necessariamente demônio.
- **Sem preenchimento fictício em massa.** Fatos têm proveniência; propostas e inferências são sinalizadas. Ausências ficam nulas/indeterminadas.
- Curadoria original fica fora de `dist/creatures`, pois a sincronização de fontes é automática. O estado de campanhas e os presságios cumpridos não pertencem ao repositório canônico.
- Nenhum conteúdo licenciado de terceiros fora de SRD autorizado é reproduzido sem revisão específica.
- Não tratar povos inteligentes como inimigos por definição.

## Etapas por lotes pequenos

| Etapa | Escopo | Entrega e critério de aceite |
|---|---|---|
| **M0 — Fundamentos (concluído)** | Tipo Carcaça, modelo de criatura/ecologia, IDs, regiões, frente e assentamento, roteiro de validação | 2 criaturas-piloto Jorō e Gharoz; uma frente-proposta e um assentamento incompleto, todos com fontes/status explícitos |
| **M1 — Motor de curadoria (núcleo 0.1 concluído)** | Schemas completos, validador de referências, índices de tipos/regiões, compatibilidade com catálogo e CI | Testes passam; nenhuma classe/type externa é sobrescrita; nenhum campo canônico é inferido em lote |
| **M2 — Arquivo dos Mortos Afogados (7/7 cadastradas; revisão DW pendente)** | Completar 7 fichas originais, com instintos/movimentos DW, vínculos e comportamento | Revisão de 7 criaturas; registrar decisões em changelog; números DW somente quando aprovados |
| **M3 — Atlas ecológico de regiões, povos e assentamentos (em expansão)** | Foz, Costa Sul, Eldroth, depois demais regiões da lore; cidades, grupos e conflitos | Referências cruzadas, assentamentos DW com tags apenas quando suportadas/curadas |
| **M4 — Frente viva e encontros** | Perigos, impulsos, presságios, desfechos; tabelas de encontros e habitats em pequenas regiões | 1 frente revisada por vez; propostas distintas de fatos; efeitos de campanha ficam fora do cânone |
| **M5 — Lotes de importados** | Seleção de 10–25 monstros por ciclo orientada por jogos e por evidência da lore | Tipo Carcaça e ocorrência somente após curadoria; reportar cobertura e pendências |
| **M6 — Consumidores e assets** | Peren, Mar de Sangue e futuros jogos; pacotes JSON/ESM, índice de sprites/retratos | IDs versionados, adaptadores sem alterar o balanceamento dos jogos |
| **M7 — Qualidade contínua** | Testes, revisão de licenças, deduplicação por identidade, proveniência, métricas e melhorias | Auditoria de todas as alterações e catálogo de lacunas, sem inventar dados |

## Modelo de trabalho para cada criatura

1. Ler fonte original e identificar o que é **confirmado**, **inferido**, **proposto** ou **desconhecido**.
2. Registrar o Tipo da Carcaça e manter o tipo da ficha D&D literalmente.
3. Localizar região + lugar + status da evidência; registrar hábitos, organização, alimentação e comportamento quando houver fonte.
4. Anotar relações com povos e facções sem criar inimizades automáticas por espécie.
5. Escrever instinto DW com verbo de propósito, 2–3 movimentos ficcionais, tags e qualidades.
6. Opcionalmente responder à criação de monstros de DW para gerar uma ficha mecânica própria (não converter ND).
7. Vincular perigos e frentes apenas quando narrativa o justificar; presságios são possibilidades, não fatos acontecidos.
8. Validar IDs, procedência e compatibilidade; só então marcar como `revisado`/`aprovado`.

## M0 — resultados e pendências

- [x] Definir vocabulário do Tipo de Criatura da Carcaça.
- [x] Criar JSON/schema inicial e exemplificar 2 criaturas de facções distintas.
- [x] Registrar regiões piloto: foz do Rio Ancestral, Costa Sul e Eldroth.
- [x] Criar frente DW experimental e assentamento de Portomonte com campos desconhecidos nulos.
- [ ] Validar os campos mecânicos de DW em mesa e revisar instintos com o autor da Carcaça.
- [x] Cadastrar as sete fichas originais do Arquivo nos ciclos 1–4 (revisão editorial e mecânica DW ainda pendente).
- [x] Publicar documentação e índices do cliente ESM de curadoria (núcleo M1 em produção).

## Fontes de regras e lore

- `dungeon-world-divisoria-do-mestre-biblioteca-elfica.pdf`: objetivos e movimentos do MJ; listas de instintos.
- Dungeon World SRD: https://www.dungeonworldsrd.com/monsters/, https://www.dungeonworldsrd.com/gamemastering/fronts/, https://www.dungeonworldsrd.com/gamemastering/the-world/
- `Arquivo dos Mortos Afogados.docx`: Jorō, Akaname, Kappa-Escribas, Gharoz, Veren e demais fichas.
- `Ambientação - A Carcaça - Visão Geral.txt`: ecologia regional e conflitos.
- `Apêndice I - Trelohim, Uln-Shayr, Yokai, Kuo-Toa.txt`: tradições, cosmologia e status das informações.

**Método:** um lote curado por vez; o volume de 2.021 fichas importadas não é meta de enriquecimento imediato.

## Ciclo de trabalho 2 — 2026-10-26

- [x] Extrair e curar **Akaname do Espelho Fundo** e **Kappa-Escribas Afogados**; fichas base documentadas, movimentos DW registrados como propostas.
- [x] Gerador determinístico `scripts/gerar_indices_curadoria.py` sem conexão de rede.
- [x] Pacotes de distribuição em `dist/carcaca/`: criaturas, catálogo, índices, regiões, facções, lugares, frentes, assentamentos e tipos.
- [x] Cliente JS ESM `src/carcaca-client.mjs` para os jogos, sem misturar fichas D&D e fichas autorais.
- [x] Testes de busca, combinação de filtros, cache, ND nulo e paginação no Node.
- [x] Configuração de Actions para validar, regenerar e publicar snapshots autorais.
- [ ] Revisão editorial e estatísticas específicas de DW; aguardam curadoria.
- [x] Concluir o cadastro das outras três fichas do Arquivo nos ciclos 3–4.
- [ ] Criar índices mais amplos de identidade entre espécies e variantes das fontes SRD, posteriormente.

### Critério de conservação

`scripts/gerar_indices_curadoria.py` lê somente `curadoria/` e os atlas `data/*_carcaca.json`; escreve exclusivamente `dist/carcaca/`. A importação SRD escreve `dist/creatures/`, `dist/catalog.json` e `dist/indexes.json` como antes. Nenhum consumidor deve confundir o pacote autoral com SRD.

## Fechamento do ciclo 2 — verificação automática

- [x] GitHub Actions `40420863395`: validação JSON Schema e referências cruzadas, testes de cliente JS, gerador e publicação **concluídos com sucesso**.
- [x] `dist/carcaca/manifest.json`: **4 criaturas, 3 regiões, 7 lugares, 3 facções, 1 frente, 1 assentamento**.
- [x] `dist/carcaca/indexes.json`: índices `by_tipo_carcaca`, `by_tipo_dnd`, `by_regiao`, `by_lugar`, `by_faccao`, `by_estado`, `by_nome`.
- [x] Publicação automática isolada do catálogo de 2.021 variantes SRD. Nenhuma alteração no jogo Peren.
- [ ] A seleção de identidade central de espécies entre variantes SRD continua para M5; M1 entregou apenas o motor do atlas autoral.

## Ciclo 3 — Veren e Morgat (2026-10-26)

- [x] Preservar os dados de referência de Veren (ND 11, CA 18, PV 170) e Morgat (ND 11, CA 19, PV 195) sem inventar ficha DW.
- [x] Descrever instinto e três movimentos narrativos para cada um, todos marcados como adaptação proposta.
- [x] Registrá-los na região da Foz do Rio Ancestral, vinculados ao Arquivo dos Mortos Afogados.
- [x] Registrar meio-demônio de Veren como ancestralidade, sem novo tipo cosmológico.
- [x] Relacionar os papéis na ofensiva de Gharoz sem presumir fatos além da fonte.
- [x] Atualizar uma frente DW existente com operadores e presságios **propostos**, não novos acontecimentos canônicos.
- [x] Integrar as Lampreias do Pavor Abissal (ficha final do Arquivo).
- [ ] Revisar o conteúdo com o autor e criar as fichas numéricas DW por procedimento próprio.
- [x] Verificar publicação gerada e testes automáticos: GitHub Actions #40422431081 concluído com sucesso.

### Verificação de publicação do Ciclo 3

- [x] Workflow [Validar e publicar curadoria #40422431081](https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40422431081): sucesso em validação JSON Schema, referências cruzadas, testes JavaScript, geração de índices e publicação.
- [x] `dist/carcaca/manifest.json` confirmado: 6 criaturas, 3 regiões, 7 lugares, 3 facções, 1 frente, 1 assentamento.
- [x] `dist/carcaca/indexes.json` confirmado: 3 yokai, 3 demônios, 6 criaturas vinculadas à foz.
- [ ] Revisão editorial das adaptações de Dungeon World ainda pendente, apesar de tecnicamente validadas.

## Ciclo 4 — Lampreias e revisão ecológica (2026-10-26)

- [x] Registrar **Lampreias do Pavor Abissal**, documento primário com ND 7, CA 16, PV 102, origem demoníaca e dieta de resíduos psíquicos.
- [x] Distinguir `demonio` de `abissal_marinho` mesmo quando o nome contém “abissal”.
- [x] Curar hábitos de caça e organização grupal; elaborar instinto e três movimentos ficcionais DW como **propostas**, não regras numéricas.
- [x] Relacionar lampreias a Gharoz, Veren e Arquivo com referências internas e status documentado.
- [x] Integrar as lampreias à frente da Lança como agentes do perigo existente, sem criar novo perigo artificialmente.
- [x] Ajustar a frente de aventura para três presságios ativos por perigo, mantendo propostas antigas em reserva.
- [x] Publicar dossiê de ecologia e relações para as sete criaturas, distinguindo ocorrências confirmadas e propostas de encontros.
- [x] Atualizar inventário da fonte autoral, ROADMAP e diário; manter o importador D&D e Peren intactos.
- [x] Validar índices e workflow no GitHub: execução #40423407799 bem-sucedida; catálogo publicado com 7 criaturas.
- [ ] Avaliar com o autor as sete adaptações e produzir fichas mecânicas específicas de DW.
- [ ] Iniciar o Marco M3 com assentamentos e povos da Costa Sul em novo lote.

### Fechamento técnico verificado — Ciclo 4

- [x] GitHub Actions [#40423407799](https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40423407799): sucesso em validação estrutural, testes Node, geração e publicação de `dist/carcaca/`.
- [x] Manifesto publicado: **7 criaturas, 3 regiões, 7 lugares, 3 facções, 1 frente e 1 assentamento**.
- [x] Índice `by_tipo_carcaca`: **3 yokai / 4 demônios**; lampreias corretamente em `demonio`, sem presença inferida no Mar de Sangue.
- [x] Índice `by_regiao`: **7** criaturas do Arquivo associadas à Foz.
- [x] Frente: dois perigos, três presságios ativos em cada; catálogo de frentes publicado.
- [ ] Apresentar as adaptações para revisão narrativa do autor; nenhum monstro possui estatísticas numéricas DW.
- [ ] Avançar M3 em lotes regionais pequenos, começando por povos e assentamentos da Costa Sul.

## Ciclo 5 — Ecossistema material da Costa Sul (2026-10-26)

- [x] Revisar Dungeon World SRD: Prosperidade, População, Defesas, Recursos, Necessidades, Comércio, Inimizade e atualização das *steadings*.
- [x] Criar `data/rotulos_assentamentos_carcaca.json`: 12 rótulos próprios, todos separados das tags de DW e sem modificadores automáticos.
- [x] Introduzir `ecologia_material`: água, alimento, abrigo, continuidade, materiais, resíduos, dependências e lacunas.
- [x] Curar Portomonte: água do Mar de Sangue purificada no templo de Deméter; agricultura sobre pedra, penhascos e comércio litorâneo.
- [x] Registrar a **rede coletiva** de cavernas kuo-toa; não inventar uma cidade única nem uma dieta ou política demográfica.
- [x] Criar duas entradas de povos regionais e três fluxos materiais/rituais (inclusive diferenciação entre captura e alimentação).
- [x] Distinguir fatos regionais de suposta origem de ataques numa caverna específica: origem marcada como `inferido`.
- [x] Criar schema, validar IDs e referências, publicar índices invertidos de assentamento e estender API JavaScript.
- [x] Integrar novos JSON e testes ao GitHub Actions; publicação do snapshot verificada ao fim do ciclo.
- [x] Registrar comunidades insulares tortles/tabaxis como conjunto coletivo regional, sem inventar ilhas individuais nem fundar uma cidade não documentada.
- [ ] Estudar sistemas de abastecimento, sazonalidade, nascimento/migração e conflitos de recursos sem dados fabricados.
- [x] Publicar quatro cenários hipotéticos para `Want`, `Trade`, `Capture` e `Aid`, sem alteração de rótulos DW ou cânone; a adjudicação manual e os eventos de campanha continuam pendentes.

**Método editorial adotado:** registro de habitat agregado não equivale a povoado singular; rótulos Carcaça explicam condições físicas, rótulos DW medem comunidade quando houver dados; incerteza é armazenada, não apagada. Veja `docs/ECOLOGIA_DOS_ASSENTAMENTOS.md`.

## Ciclo 6 — Ilhas e movimentos DW sem mutação (2026-10-26)

- [x] Consultar a ambientação para estabelecer fatos documentados: tortles e tabaxis habitam ilhas ao redor da Costa Sul, preservam tradições monásticas locais, defendem-se, viajam sazonalmente e trabalham como marinheiros.
- [x] Criar `lugar:ilhas-costa-sul` como área coletiva; nenhuma ilha individual, rota marítima nem população foi inventada.
- [x] Cadastrar tortles/tabaxis como **dois grupos regionais**, sem deduzir coabitação em cada ilha nem estruturas familiares.
- [x] Criar `assentamento:comunidades-insulares-costa-sul` com natureza `conjunto_de_comunidades` (não é uma única steading DW).
- [x] Aplicar os rótulos `rotas_sazonais`, `tradicoes_monasticas_insulares` e `defesa_insular_disciplinada`; prosperidade, população e defesas DW ficam nulas.
- [x] Registrar fluxo de circulação sazonal sem destino/mercadorias específicos e sem vincular a Portomonte como parceiro comercial.
- [x] Criar quatro hipóteses de campanha para atualizações DW `Want`, `Trade`, `Capture` e `Aid`, cada uma com condições ainda não confirmadas e decisões para o mestre.
- [x] Impedir mutações do cânone por schema (const `false`) e por testes do cliente ESM; nenhuma simulação é executada por padrão.
- [x] Integrar `settlement-scenarios.json` à distribuição e oferecer leitura, busca por movimento e prévia de condições faltantes.
- [x] Verificar GitHub Actions [#40430220238](https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40430220238): validação, testes JavaScript, geração e publicação **sucesso**.
- [x] Verificar snapshot publicado: **7 criaturas, 3 registros de assentamentos, 14 rótulos, 4 povos regionais, 4 fluxos, 4 cenários hipotéticos**.
- [ ] Identificar uma ilha e comunidade singular em fonte futura antes de atribuir Prosperidade/População/Defesas DW.
- [ ] Próximos ciclos: simular abastecimento e mudanças de recursos somente em saves/campanhas, com revisão do autor; distinguir cânone e estado local.

## Ciclo 7 — Dependências materiais e estado local de campanha (2026-10-26)

- [x] Descrever **5 relações** da Costa Sul em `data/dependencias_materiais_costa_sul.json`, com fonte e estado de evidência por ligação.
- [x] Representar Portomonte em duas etapas explícitas: purificação da água do Mar de Sangue → agricultura dependente dessa purificação.
- [x] Preservar ligações sem destino específico: comércio costeiro e viagens sazonais não provam comércio direto entre Portomonte e as ilhas.
- [x] Catalogar incursões rituais dos kuo-toa como **conflito**, sem confundi-las com alimentação; origem atribuída à rede de cavernas continua inferida.
- [x] Validar IDs de assentamentos e fluxos, fontes, aciclicidade do grafo e coerência do estado de evidência.
- [x] Gerar índices por assentamento, fluxo, tipo e predecessora em `dist/carcaca/material-dependency-indexes.json`.
- [x] Criar prévia ficcional `previewMaterialInterruption`, que só percorre dependências documentadas no grafo e **não aplica efeitos de DW**.
- [x] Criar contrato de save `schemas/estado-campanha.schema.json`, com exemplo **vazio** fora de `curadoria/`.
- [x] Criar `src/carcaca-campaign-state.mjs`: livro-razão local e imutável, que exige mestre confirmar cada evento e rejeita IDs desconhecidos.
- [x] Adicionar testes de não mutação, confirmação do mestre, duplicidade, referências e alcance de dependências.
- [ ] Exigir aprovação e edição explícitas do mestre para efeitos mecânicos de Prosperidade, Defesas e População em cada campanha; o motor ainda não altera esses valores.
- [ ] Dados de ingestão, resíduos, taxa de migração e reprodução ficam desconhecidos onde a fonte não os descreve.
- [ ] Construir consumidor de save persistente no jogo futuramente: a biblioteca atual retorna objetos sem gravar em disco/rede.
- [ ] Revisitar o modelo com o autor antes de transformar possíveis crises em histórias canônicas.

**Resultado:** contrato autoral separado de `dist/catalog.json` e de saves de jogos. A programação continua por lotes auditáveis.

### Validação e publicação do ciclo 7 — conferidas

- [x] [GitHub Actions #40431958511](https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40431958511): validação de referências/schemas, testes Node, geração e publicação concluídos com sucesso.
- [x] `dist/carcaca/manifest.json`: **5 dependências materiais, 7 criaturas e 3 assentamentos/redes**; permanecem quatro cenários hipotéticos.
- [x] Índice `by_assentamento` aponta 3 relações de Portomonte; `by_dependencia_predecessora` aponta a lavoura como dependente da purificação.
- [x] O contrato de evento de campanha fica fora de `dist/carcaca/`; exemplos editoriais sem eventos não são estado canônico.

## Ciclo 8 — Modelo de balanços, sazonalidade e pressões ecológicas (2026-10-26)

- [x] Criar quatro **perfis materiais sem valores fabricados**, para água purificada, lavoura, comércio não especificado e circulação insular.
- [x] Adotar `valor`, `unidade`, `periodo`, `origem_medicao` com nulos explícitos e separar ausência de dado de valor zero.
- [x] Registrar sazonalidade das viagens insulares sem inventar meses, calendário agrícola ou ritmos de consumo.
- [x] Criar quatro **pressões hipotéticas** com estado próprio, fonte e lacunas: purificação, comércio, viagens e conflito ritual.
- [x] Criar schemas e validações cruzadas de perfis, fluxos, dependências, origem documental e pressões.
- [x] Exportar índices específicos em `dist/carcaca/` e filtros do cliente por assentamento, recurso, tipo e sazonalidade.
- [x] Criar função pura `previewMaterialBalance`: só aceita seis medidas com unidade, período, origem e valor; rejeita bens heterogêneos e unidades incompatíveis.
- [x] Testar ausência de dados, zero explícito, déficit hipotético, incompatibilidade de períodos e integridade dos perfis originais.
- [x] Garantir que cálculos fictícios não sejam publicados como medidas reais nem como eventos de campanha; nenhuma mecânica DW atualizada.
- [x] Documentar lógica, contrato, exemplos e lacunas em `docs/BALANCOS_E_PRESSOES_ECOLOGICAS.md`.
- [ ] Ampliar com indicadores opcionais de capacidade de suporte quando a lore ou campanha fornecer quantidades fundamentadas.
- [ ] Introduzir observações autorizadas de campanha sem incorporá-las aos JSON canônicos.

### Verificação pós-publicação do ciclo 8

- [x] [GitHub Actions #40437639411](https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40437639411): testes Node, validação estrutural e cruzada, geração de índices e publicação com conclusão `success`.
- [x] `dist/carcaca/manifest.json`: **7 criaturas, 3 registros de assentamento, 5 dependências, 4 perfis materiais e 4 pressões ecológicas**.
- [x] Todos os 4 perfis têm **zero medições numéricas preenchidas**; todas as pressões permanecem `risco_hipotetico_nao_ocorrido` e `efeito_dw_automatico=false`.
- [x] Índices publicados: balanços por assentamento/recurso/tipo/sazonalidade e pressões por assentamento/dependência/tipo.

## Ciclo 9 — Capacidade de suporte e continuidade demográfica (2026-10-26)

- [x] Revisar a lore: Portomonte possui água purificada para agricultura, mas não há prova de potabilidade; comunidades insulares viajam sazonalmente, sem taxas de migração.
- [x] Criar três perfis de suporte ecológico em `data/capacidade_suporte_costa_sul.json` sem números fabricados.
- [x] Modelar quatro limites por perfil: água potável, alimentação, abrigo e destinação de resíduos; **12 limites em estado desconhecido**.
- [x] Separar residentes, nascimentos, óbitos, migração de entrada e saída; todos os valores quantitativos e períodos permanecem `null`.
- [x] Criar schema e validação cruzada com IDs de assentamentos, natureza editorial e status de documentação.
- [x] Indexar e distribuir perfis de suporte em `dist/carcaca/`, com cliente ESM para busca por assentamento, natureza e mobilidade sazonal.
- [x] Criar simulação pura da capacidade limitante que exige **quatro recursos especificados, adequação e medidas explícitas**, sem afetar rótulos DW.
- [x] Criar simulação demográfica separada; impedir que viagens sazonais sejam migrantes permanentes inferidos.
- [x] Acrescentar testes de não mutação, falta de fonte, unidade/período incompatíveis, demandas nulas e população hipotética inválida.
- [x] Documentar método, limites, exemplos fictícios e incertezas em `docs/CAPACIDADE_DE_SUPORTE.md`.
- [ ] Revisão editorial com o autor: fontes de água potável, dietas, armazenamento, saneamento e sustentação de povoações singulares.
- [ ] Transformar grupos regionais em *steadings* concretas apenas quando a fonte permitir individualizar comunidade, população e defesas.
- [ ] Integrar observações reais de cada campanha somente em saves, não ao catálogo canônico.

### Validação verificada — ciclo 9

- [x] GitHub Actions [#40439032942](https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40439032942) concluído com **success** em JSON Schema, referências cruzadas, testes Node, geração e publicação.
- [x] `dist/carcaca/manifest.json`: 7 criaturas, 3 assentamentos, **3 perfis de suporte** publicados.
- [x] `support-profiles.json`: 12 limites distribuídos entre três registros; as medições canônicas permanecem `null`; deslocamentos sazonais documentados **apenas** no conjunto insular.
- [x] `support-indexes.json`: índices válidos por assentamento, natureza e mobilidade; cada assentamento da Costa Sul aponta para exatamente um perfil.
- [x] Resultados fictícios de testes **não foram incorporados** aos dados canônicos, rótulos DW ou saves.

## Ciclo 10 — Infraestrutura física da Costa Sul (2026-10-26)

- [x] Reexaminar a lore: penhascos de Portomonte, templo purificador, cavernas kuo-toa, viagens insulares e comércio regional.
- [x] Separar **geografia e costumes** de prova de estruturas construídas; não inventar celeiros, cais, casas de pedra, fossas ou redes de esgoto.
- [x] Criar `data/infraestrutura_assentamentos_costa_sul.json`: **3 perfis e 12 setores** de construção/abrigo, armazenamento, saneamento e acessos.
- [x] Registrar o templo de Deméter como instalação explicitamente existente, sem atribuir material, reservatórios ou usos domésticos de água.
- [x] Manter **zero materiais de construção confirmados** e explicitar lacunas com perguntas orientadas ao mestre.
- [x] Integrar referências a processos materiais conhecidos, sem ligar automaticamente incursões regionais à rede de cavernas.
- [x] Criar schema, validador de evidências e integridade entre assentamentos, suporte e dependências.
- [x] Publicar `infrastructure-profiles.json` e índices invertidos em `dist/carcaca/`; oferecer consulta pelo cliente JS.
- [x] Criar `auditInfrastructure` e `previewInfrastructureIssue` para auditoria e hipóteses sem efeitos automáticos.
- [x] Adicionar testes sobre falta de evidências, cópias dos dados, setor ausente e hipótese explícita.
- [x] Documentar decisões, lacunas e contratos em `docs/INFRAESTRUTURA_DOS_ASSENTAMENTOS.md`.
- [ ] Mapear no próximo ciclo impactos geográficos e conflitos da Caatinga/Além Sul somente quando houver fonte individualizável.
- [ ] Atribuir materiais, depósitos e saneamento apenas após o autor documentar ou aprovar tais características.

### Validação pós-publicação — ciclo 10

- [x] [GitHub Actions #40440872683](https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40440872683): quatro etapas principais concluídas com `success` (schema/referências, testes Node, geração determinística, publicação).
- [x] `dist/carcaca/manifest.json`: **3 perfis e 12 setores de infraestrutura**, preservando 7 criaturas e 3 assentamentos/redes.
- [x] `dist/carcaca/infrastructure-profiles.json`: 0 materiais construtivos confirmados; 1 instalação nominal — Templo de Deméter em Portomonte.
- [x] `dist/carcaca/infrastructure-indexes.json`: índices por assentamento, natureza, setor com evidências, setor sem documentação e dependência material; cada assentamento aponta para exatamente um perfil.
- [x] Nenhum dado material foi convertido em valor, instalação suposta, estatística DW ou acontecimento de campanha.

## Ciclo 11 — Guerra, pilhagens e deslocamentos no Além Sul (2026-10-26)

- [x] Revisar texto autoral do Além Sul e diferenciar **fatos regionais** de ataques a uma cidade ou ilha específica.
- [x] Incluir `regiao:caatinga` na geografia, **sem lugares nomeados** nem limites cartográficos artificiais.
- [x] Criar quatro dinâmicas territoriais documentadas: pilhagens da Caatinga, incursões sacrificiais na costa e ilhas, presença minoritária de refugiados de Eldroth nos maiores centros, ausência de ocupação feérica direta do Além Sul.
- [x] Criar **quatro rótulos territoriais**, separados dos **14 rótulos Carcaça de assentamentos** e das tags DW.
- [x] Conservar nulos os alvos de assentamentos concretos, os locais de origem de cada ataque e os acontecimentos por campanha não confirmados.
- [x] Garantir que a presença de refugiados regional não seja atribuída automaticamente a Portomonte.
- [x] Associar agricultura, terra, segurança, abrigo e integração como **dimensões possivelmente afetadas**, não prejuízos já ocorridos.
- [x] Criar schema, validação cruzada e busca por região, rótulo, tipo e dimensão potencial.
- [x] Criar `previewTerritorialImpact`, prévia de risco que bloqueia atribuição indevida a um assentamento e não altera tags DW.
- [x] Adicionar testes de filtragem, diferenciação regional/local, cópia de informações e presença de refugiados sem destino nominal.
- [x] Documentar decisões em `docs/DINAMICAS_TERRITORIAIS_ALEM_SUL.md`.
- [ ] Investigar povoações individualizadas da Caatinga após novas fontes.
- [ ] Integrar futuramente uma frente DW de guerra regional proposta, não acontecimento histórico.

### Verificação do ciclo 11 — publicado

- [x] [GitHub Actions #40441891327](https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40441891327): **success** na validação de JSON/referências, testes JavaScript, geração determinística e publicação.
- [x] `dist/carcaca/manifest.json`: **4 regiões, 7 criaturas, 3 assentamentos/redes, 4 rótulos territoriais e 4 dinâmicas regionais**.
- [x] `dist/carcaca/territorial-dynamics.json`: 4 relações com `escala:regional`, `assentamento_alvo_id:null`, `evento_campanha_id:null`; nenhum ataque ou acolhimento formal foi inventado.
- [x] `dist/carcaca/territorial-labels.json`: 4 rótulos, incluindo `presenca_minoritaria_refugiada` (sem pressupor acolhimento formal).
- [x] `dist/carcaca/territorial-indexes.json`: filtros por origem/destino, rótulo, tipo e dimensões materiais potenciais publicados.
- [x] `regiao:caatinga`: cadastrada sem povoações individuais (`lugares:[]`).

## Ciclo 12 — Dossiês regionais integrados do M3 (2026-10-27)

- [x] Reler a ambientação como fonte primária, distinguindo fatos materiais e políticos de lacunas.
- [x] Registrar **quatro guias factuais** (Caatinga, Costa Sul, Eldroth e foz) com **16 perguntas** sobre abrigo, subsistência, conflitos e mobilidade.
- [x] Montar dossiês **derivados** por região a partir de lugares, assentamentos, criaturas, povos vinculados, frentes, fluxos, dependências, balanços, infraestrutura, cenários e dinâmicas territoriais já curados.
- [x] Exibir `origem` e `destino` para cada vínculo regional, incluindo os dois papéis em dinâmicas internas à Costa Sul; não duplicar um evento nem presumir alvo individual.
- [x] Diferenciar **zero fichas** de **zero habitantes** e evitar inferir que facções associadas a criaturas governem regiões.
- [x] Separar explicitamente pressões hipotéticas, frentes com presságios propostos e dados documentados.
- [x] Criar schema, validação referencial, gerador determinístico e índices de consulta.
- [x] Acrescentar API ESM `getRegionalDossiers`, `getRegionalDossier`, `searchRegionalDossiers`, `getRegionalDossierIndexes` e revisor puro de cobertura.
- [x] Adicionar testes em Node e **testes Python sobre a curadoria real**, não só sobre fixtures.
- [x] Documentar resultados e questões em `docs/DOSSIES_REGIONAIS_M3.md`.
- [ ] Próximo lote: fila prioritária de lacunas de fontes, com dependências entre questões materiais e políticas.
- [ ] Não transformar povoações não individualizadas em steadings nem atribuir populações, consumo ou perdas territoriais por inferência.

### Validação e publicação verificadas — ciclo 12

- [x] [GitHub Actions #40443128581](https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40443128581): `success` para validação de curadoria, testes ESM, testes de integração Python sobre dados reais, geração determinística e publicação.
- [x] `dist/carcaca/manifest.json`: **4 dossiês regionais, 16 perguntas, 4 regiões, 7 criaturas, 3 assentamentos**.
- [x] `dist/carcaca/regional-dossiers.json`: Caatinga e Eldroth sem assentamento curado; foz com 7 criaturas e 1 frente; Costa Sul com 3 comunidades, 5 dependências, 4 fluxos e 4 pressões hipotéticas.
- [x] `dist/carcaca/regional-dossier-indexes.json`: índices por região, dinâmica, local, assentamento, tema e ausência de assentamento curado publicados.
- [x] Nenhum cenário hipotético ou frente foi convertido em evento confirmado e nenhum vetor vazio foi interpretado como ausência real de habitantes.

## Ciclo 13 — Fila de lacunas priorizadas (2026-10-27)

- [x] Usar as 16 perguntas **já presentes** nos quatro dossiês, sem duplicar ou substituir fontes.
- [x] Priorizar oito questões em dois lotes de quatro, duas por região, com ordem editorial 1 a 8.
- [x] Definir **4 precedências editoriais** entre questões; não transformar ordem de pesquisa em causalidade ficcional.
- [x] Identificar a evidência que falta e os artefatos que poderão ser propostos depois de verificação humana.
- [x] Manter as outras oito perguntas como `aguarda_priorizacao`, com ordem nula, não descartadas.
- [x] Produzir saída indexada `dist/carcaca/research-backlog.json`, derivada dos dossiês + metadados prioritários, e `research-backlog-indexes.json`.
- [x] Proteger integridade dos IDs, sequência de prioridades, precedência acíclica por ordem, existência de fonte e `autoriza_criacao_canonica:false`.
- [x] Criar API de consulta da fila e função de revisão puramente editorial.
- [x] Testar JavaScript e Python integrado com o atlas real, exigindo zero respostas inseridas artificialmente.
- [x] Documentar método e ordem em `docs/FILA_CURADORIA_M3.md`.
- [ ] Próximo: pesquisar profundamente um único item prioritário e marcar como lacuna persistente quando as fontes não forem suficientes.
- [ ] Implementar fluxo de aprovação de novas respostas somente após revisão editorial específica; a fila por si não cria cânone ou salva eventos de campanha.

### Publicação verificada — ciclo 13

- [x] [GitHub Actions #40443990037](https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40443990037): `success` na validação, testes Node, integração Python, geração e publicação de JSON.
- [x] `dist/carcaca/manifest.json`: **16 pendências de curadoria, 8 priorizadas**, ligadas aos 4 dossiês e às 16 perguntas do ciclo anterior.
- [x] `dist/carcaca/research-backlog.json`: quatro pesquisas de primeiro lote, quatro do segundo, oito não priorizadas; quatro precedências; nenhuma resposta e nenhuma evidência nova atribuída.
- [x] `dist/carcaca/research-backlog-indexes.json`: índices validados por região, tema, estado, faixa, pergunta anterior, artefato potencial e dossiê.
- [x] Todos os registros continuam `resposta_confirmada:null`, `evidencia_nova:null` e `mutacao_canonica:false`.

## Ingestão do manuscrito Dungeon World — A Carcaça (2026-10-27)

- [x] Examinar a estrutura de 181 páginas e separar **Capítulo I — Ambientação** dos Capítulos II/III de regras e movimentos.
- [x] Arquivar as **24 páginas (2 a 25)** do capítulo autoral em `fontes/autoria/`, preservando referências para consulta.
- [x] Indexar **100 entradas** de lugar, região, plano, povo, facção, pessoa, divindade e conceito, com aliases e páginas.
- [x] Indexar **18 eventos de cronologia EC** e **7 incógnitas históricas** que o manuscrito deixa em aberto.
- [x] Registrar **7 pontos de revisão** com decisão conservadora (não resolver divergência sem revisão autoral).
- [x] Criar **14 pontes de lore→M3**, incluindo resposta parcial de Portomonte como destino de alguns druidas e não de todos os refugiados.
- [x] Registrar `hack_carcaca_dw_rascunho` no cadastro de fontes sem alterar fatos consolidados.
- [x] Schema e validação da integridade de páginas, campos, cronologia e vínculos de perguntas/regiões.
- [x] Distribuir índices e dados via `dist/carcaca/lore-*.json`, com API de consulta ESM por texto, tema, página e dossiê.
- [x] Adicionar testes Python sobre dados reais e testes Node com fixtures sem mutação.
- [x] Documentar estrutura, descobertas, conflitos, rotas de acesso e limitação de capítulos em `docs/LORE_HACK_CARCACA_DW.md`.
- [ ] Cotejar os sete pontos de revisão com a cartografia/cânone atualizado antes de promover informações ao atlas.
- [ ] Considerar indexação específica dos movimentos do Capítulo III em módulo de **mecânicas**, separado da lore.

### Verificação de ingestão do manuscrito — publicada (2026-10-27)

- [x] [GitHub Actions #40446090125](https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40446090125): **success** em validação, testes Node, Python integrado, geração determinística e publicação.
- [x] `dist/carcaca/manifest.json` conferido: **24 páginas, 100 verbetes, 18 eventos, 7 incógnitas, 7 revisões e 14 pontes**.
- [x] Índices invertidos: 644 tokens de pesquisa, filtros por tipo/página e por região/pergunta/parecer de ponte.
- [x] Preservadas **7 criaturas e 3 assentamentos** existentes, sem alteração canônica por ingestão de manuscrito.
- [x] Todas as 14 pontes conservam `aplicar_automaticamente:false` e `status:pendente_revisao_autoral`.

## Segunda auditoria de indexação do manuscrito — 2026-10-27

- [x] Ampliar glossário de 100 para **157 verbetes** de fonte autoral (38 divindades e 19 conceitos adicionais).
- [x] Preservar como texto consultável as páginas de regras e movimentos **26–181**, com 155 páginas extraíveis e lacuna explícita na página 91.
- [x] Indexar por página/categoria **653 rótulos visuais candidatos** (não certificados como movimentos) e detectar páginas com menções literais a `REQUER:`.
- [x] Validar fontes, paginação, escopo não canônico, esquema de nomes curtos e geração determinística.
- [x] Expor `getHackMechanicsIndex` e `searchHackMechanicsPages` na API ESM.
- [x] Atualizar testes com 157 termos e novo índice mecânico, preservando as fichas do atlas.
- [x] Documentar análise e limitações em `docs/REVISAO_AMPLIADA_HACK_CARCACA_DW.md`.
- [ ] Verificar visualmente a página 91 no DOCX original e recuperar seu conteúdo, se houver.
- [ ] Refinar candidatos a movimentos em blocos individuais e verificar `REQUER` sem confundimento entre colunas.
- [ ] Integrar ao atlas canônico apenas evidência de ambientação aprovada individualmente.

### Conferência da segunda auditoria

- [x] [GitHub Actions #40447368396](https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40447368396): resultado `success` na validação de curadoria, testes JavaScript, testes Python de integração, geração determinística e publicação.
- [x] Snapshot inspecionado diretamente: `manifest.json` com **157 verbetes**, **155 páginas de texto mecânico** e **653 rótulos candidatos**; `hack-mechanics-index.json` declara **página 91 sem texto extraível** e 86 páginas com `REQUER:`.
- [x] Continuam sem alterações de cânone as **7 criaturas** e os **3 assentamentos** curados.

## Terceira auditoria do Hack DW — relações e movimentos (2026-10-27)

- [x] Indexar **26 relações** entre entidades do Capítulo I, com fonte, página, âncora literal e nenhuma modificação canônica.
- [x] Conferir diretamente no DOCX original **41 títulos de movimentos**, distribuídos por seções de povo e classe.
- [x] Registrar **26 expressões `REQUER:`** literais sem simplificar dependências compostas.
- [x] Separar `efeito_revisado:false` de conferência de título/requisito, sem aplicar movimentos nem criar fichas.
- [x] Converter e inspecionar visualmente a **página 91**, confirmada vazia (apenas pergaminho).
- [x] Publicar dois índices invertidos e quatro arquivos de leitura em `dist/carcaca/`.
- [x] Integrar API ESM e novos testes sobre relações e requisitos literais.
- [x] Registrar método, cautelas e consultas em `docs/TERCEIRA_AUDITORIA_HACK_CARCACA_DW.md`.
- [ ] Avançar por grupos pequenos para texto completo de movimentos, opções e pré-requisitos.
- [ ] Conservar separadas consequências hipotéticas e aplicação real de movimentos em saves.

### Validação pós-publicação — terceira auditoria

- [x] [GitHub Actions #40449350728](https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40449350728): **success** em validação, testes Node, testes Python de integração, geração determinística e publicação.
- [x] Snapshot conferido em `dist/carcaca/`: **26 relações**, **41 cabeçalhos de movimentos**, **26 com REQUER literal**, índices de entidade/tipo/página e grupo/categoria/pré-requisito/página candidata.
- [x] Metadado `conferencia_pagina_91` publicado: a página 91 está visualmente confirmada como vazia, no PDF renderizado do DOCX de 181 páginas.
- [x] Preservadas **7 criaturas**, **3 assentamentos**, `efeito_revisado:false` e `aplicacao_canonica:false`.

## Quarta auditoria do manuscrito — 2026-10-27

- [x] Identificar as tabelas do DOCX, fora de `doc.paragraphs`.
- [x] Inventariar **33 tabelas**: 10 narrativas, 2 numéricas e 21 quadros de movimentos/regras gerais.
- [x] Transcrever **12 movimentos de povo integralmente**: seis Humanos e seis Orcs da Caatinga.
- [x] Preservar as **quatro opções** de `Saqueador da Caatinga` e os resultados 10+/7–9.
- [x] Preservar ausência de `REQUER` explícito nos cabeçalhos dos 12 movimentos.
- [x] Separar transcrição integral de promoção/aplicação canônica.
- [x] Acrescentar artefatos `dist/carcaca/hack-complete-pilot-*.json` e `hack-docx-*.json`, API e testes.
- [x] Documentar a revisão em `docs/QUARTA_AUDITORIA_HACK_CARCACA_DW.md`.
- [ ] Revisar texto integral de 21 quadros gerais de movimentos em tabelas.
