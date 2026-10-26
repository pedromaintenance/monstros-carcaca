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
| **M0 — Fundamentos (iniciado)** | Tipo Carcaça, modelo de criatura/ecologia, IDs, regiões, frente e assentamento, roteiro de validação | 2 criaturas-piloto Jorō e Gharoz; uma frente-proposta e um assentamento incompleto, todos com fontes/status explícitos |
| **M1 — Motor de curadoria** | Schemas completos, validador de referências, índices de tipos/regiões, compatibilidade com catálogo e CI | Testes passam; nenhuma classe/type externa é sobrescrita; nenhum campo canônico é inferido em lote |
| **M2 — Arquivo dos Mortos Afogados** | Completar 7 fichas originais, com instintos/movimentos DW, vínculos e comportamento | Revisão de 7 criaturas; registrar decisões em changelog; números DW somente quando aprovados |
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
- [ ] Expandir para as outras 5 fichas do Arquivo; isso é M2.
- [ ] Publicar documentação de integração runtime e índices de região; isso é M1.

## Fontes de regras e lore

- `dungeon-world-divisoria-do-mestre-biblioteca-elfica.pdf`: objetivos e movimentos do MJ; listas de instintos.
- Dungeon World SRD: https://www.dungeonworldsrd.com/monsters/, https://www.dungeonworldsrd.com/gamemastering/fronts/, https://www.dungeonworldsrd.com/gamemastering/the-world/
- `Arquivo dos Mortos Afogados.docx`: Jorō, Akaname, Kappa-Escribas, Gharoz, Veren e demais fichas.
- `Ambientação - A Carcaça - Visão Geral.txt`: ecologia regional e conflitos.
- `Apêndice I - Trelohim, Uln-Shayr, Yokai, Kuo-Toa.txt`: tradições, cosmologia e status das informações.

**Método:** um lote curado por vez; o volume de 2.021 fichas importadas não é meta de enriquecimento imediato.
