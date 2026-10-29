# Atlas Macrorregional da Carcaça — Ciclo XXXII

## Objetivo editorial

Consolidar o continente **de fora para dentro**, antes de elaborar bairros, bestiários locais, habitantes e itens: Carcaça → setores geográficos → lugares-chave e territórios → redes de relações → lacunas cartográficas. A hierarquia de assentamentos e sublugares da V1.2 continua preservada; a V1.3 acrescenta uma camada inicial de leitura e um índice macro rastreável.

**Não há nova cidade, reino, conquista, ritual, data, divindade, coordenada ou ocorrência de monstro aprovada automaticamente.**

## Resultados

A fonte `data/atlas/macrorregioes-carcaca.json` registra **11 setores geográficos** (mais a pasta transversal que permanece fora da geografia), **26 âncoras de lugares nomeados**, **7 relações inter-regionais** e **33 questões macrorregionais a resolver**. Cada âncora aponta para o **mesmo ID da árvore**, em vez de gerar uma cidade ou sítio duplicado.

Os onze setores são organização de navegação — apenas quatro IDs de região haviam sido formalizados no atlas principal antes deste ciclo. Não os tratar como governos, fronteiras efetivas ou novas divisões canônicas.

| Setor | Referências macro | Lacuna prioritária |
|---|---|---|
| Garganta / Extremo Leste | Garganta, Templo de Yolskaariin | Assentamentos mineiros, Dunhaven/Harlowe e sítios Yokai sem forçar cartografia |
| Rio Ancestral / Drakport | Rio, Drakport, Templo da Lua | Núcleos fluviais e localização exata da ilha |
| Costa Sul / Mar de Sangue | Portomonte, Deméter, ilhas, cavernas kuo-toa, Mar de Sangue | Desagregar ilhas, portos e cidades submersas sem inventar população |
| Caatinga | Terras áridas | Primeiro assentamento canônico individualizado e principais pontos de água |
| Eldroth / Vandar | Floresta, ruínas de Vandar | Dividir florestas e refúgios sem apagar a ocupação |
| Thargrid / Ironwood | Montanhas, Reino Sob a Montanha, Ironwood, fortaleza ranger | Aldeias e refúgios; esclarecer jurisdições sem unificar resistência |
| Foz / Abismo | Abismo, Gualápolis, Boca do Abismo, Arquivo, Templo das Sombras | Topologia histórica/civil de Gualápolis e defesa da foz |
| Shadar-Riverie | Capital aristocrática | Resolver relação com Gualápolis e instituições urbanas |
| Grama-Cortada | Condado hobbit | Posição geográfica e assentamentos agrícolas |
| Cauda | Templo do Crepúsculo | Paisagem circundante e acessos, sem inventar uma cidade-capital |
| Águas azuis | Mar não corrompido | Localização de cidades dos tritões e sereias, fronteira móvel |

## Sete relações — nem todas equivalem a estradas

1. **Rio Ancestral → Foz:** curso fluvial e precipício (Hack p. 5)
2. **Caatinga ↔ Costa:** conflito histórico e incursões (Hack p. 5)
3. **Eldroth → Costa:** presença regional de refugiados (Hack p. 5), não rota nem cidade receptora definida
4. **Costa ↔ Águas azuis:** fronteira marítima dinâmica (Hack pp. 14–15), sem traçado geodésico
5. **Foz → Cauda:** retirada histórica da Rainha após a guerra demoníaca (Hack pp. 5–6, 8), sem ponte ou trajeto garantido
6. **Thargrid ↔ Eldroth:** conexões políticas e redes de resistência (Hack pp. 6–7), sem delimitar fronteira
7. **Foz ↔ Shadar:** **topologia em revisão**. O mesmo manuscrito descreve Ulorian assentado sobre Gualápolis e Shadar-Riverie situada sobre a antiga Gualápolis (Hack p. 6). Não resolvemos a sobreposição editorialmente.

**Abissais marinhos ≠ demônios do Abismo.** Também não equiparamos acordo entre facções a pertencimento de soberania.

## Hierarquia editorial

1. **Macro:** territórios, mares, grandes marcos, cidades e fortalezas já nomeadas, divisas em revisão, redes regionais.
2. **Meso:** rios tributários (somente se documentados), distritos, assentamentos individuais, ilhas, vilas, sítios e rotas verificadas.
3. **Micro:** bairros, habitantes, conflitos de cada família, fauna, flora, monstros em covis específicos, itens mágicos, Dungeon World.

O trabalho inicial é fortalecer o **macro**. Macro não significa necessariamente cidades maiores: uma Caatinga com comunidades dispersas é tão importante quanto uma capital. Não devemos preencher campos vazios inventando governos ou assentamentos.

## Ordem de expansão a seguir

**Passagem A — Inventário territorial (agora):** validar as 11 áreas de navegação, normalizar nomes e localizar cidades e biomas na árvore com suas fontes. **Cumprido no núcleo macrorregional**, sujeito à revisão autoral.

**Passagem B — Coerência geográfica e fronteiras:** priorizar inconsistência Shadar/Gualápolis/Boca do Abismo, posição de Grama-Cortada, limites de Ironwood/Thargrid/Eldroth, ilha do Templo da Lua. Registrar resoluções somente mediante decisão do autor.

**Passagem C — Topologia e circulação:** adicionar ligações confirmadas como rio, litoral, proximidade, viagem, migração, troca, influência política e guerra; nunca equiparar ligação narrativa a caminho praticável. Só criar rotas físicas quando fonte ou autoria permitir.

**Passagem D — Assentamentos da escala meso:** ampliar gradualmente a malha de cidades, vilas, áreas povoadas e postos, em prioridades acordadas com o autor.

**Passagem E — Ecologia e aventuras locais:** depois desenvolver covis, monstros, fauna, flora, comunidades, personagens, magia e fichas DW individuais.

## Interface de revisão

O Pages abre em **Visão geral do continente** por padrão. Os 11 cartões trazem lugares documentados, contagem de propostas, situação política, povos associados, lacunas e relações com outras regiões; os botões de lugar abrem a **Árvore detalhada** com os dados anteriores intactos. Os seis eixos globais mantêm o continente inteligível sem antecipar detalhamento.

Link: https://pedromaintenance.github.io/monstros-carcaca/atlas/

## Fontes e estado

- `fontes/autoria/hack-carcaca-dw-capitulo-i.paginas.json` — referência autoral paginada (pp. 2–9, 12–15, 18–20, 23)
- `data/lore/hack-carcaca-dw-indice-tematico.json` — 20 lugares previamente indexados e personagens/povos sem fixação espacial inventada
- `data/regioes_carcaca.json`, `data/lugares_carcaca.json` — quatro regiões do catálogo e oito lugares formalizados
- `data/atlas/aninhamento-territorial.json` — relações entre lugares e microespaços
- `data/atlas/macrorregioes-carcaca.json` — nova camada macro, **não canonizada automaticamente**
- `site/atlas/macro-atlas.mjs`, `tests/atlas-macro.test.mjs` — verificação de âncoras, relações, estados, e nenhum efeito automático no mundo

A árvore não é substituída pelo mapa macro; a informação regional é uma **vista editorial** cuja única autoridade factual continua sendo o conjunto de fontes originais.
