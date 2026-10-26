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
| **M3 — Atlas de regiões, povos e assentamentos** | Foz, Costa Sul, Eldroth, depois demais regiões da lore; cidades, grupos e conflitos | Referências cruzadas, assentamentos DW com tags apenas quando suportadas/curadas |
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
- [ ] Validar índices e workflow no GitHub e registrar o resultado final.
- [ ] Avaliar com o autor as sete adaptações e produzir fichas mecânicas específicas de DW.
- [ ] Iniciar o Marco M3 com assentamentos e povos da Costa Sul em novo lote.
