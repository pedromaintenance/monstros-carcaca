# Ciclo XXXVIII — Carta continental de Golzdov: bússola, restrições e ausências

## Objetivo

Os Ciclos XXXII–XXXVII construíram o inventário do continente: regiões, redes de circulação e poder, anatomia física, macroambientes, interfaces e hipóteses topológicas. O passo seguinte não é desenhar coordenadas fictícias. É criar **uma carta de restrições para orientar futuros mapas**, com uma distinção explícita entre:

- **Orientação cardeal documentada:** pode ser indicada no quadrante correspondente, mas nunca como um pino de coordenadas.
- **Posição relativa:** conhece-se uma relação entre dois marcos, não a posição absoluta.
- **Eixo atravessante:** a relação funcional está documentada, mas não o traçado.
- **Sem orientação fixada:** o lugar existe ou a anatomia é mencionada, mas não há posição cardeal demonstrada.
- **Topologia contestada:** descrições que exigem reconciliação autoral, sem solução por algoritmo.
- **Fronteira móvel:** fenômeno variável que exige representação dinâmica em vez de linha permanente.

**Esta carta não é o primeiro mapa geográfico em escala.** Ela é uma bússola documental e uma especificação para que um futuro mapa não afirme o que não sabemos.

A fonte primária dos marcos e relações continua sendo o capítulo I paginado do Hack da Carcaça. As decisões ainda abertas vêm dos Ciclos XXXVI e XXXVII.

## Inventário: 20 marcos do manuscrito, sem inventar nenhum

A carta inclui os **20 marcos já registrados no Ciclo XXXIV**, distribuídos por oito classificações editoriais. Cada registro preserva seu ID de origem, páginas do manuscrito, classe e orientação de desenho.

| Classe cartográfica | Quantidade | Marcos representados | Representação permitida |
|---|---:|---|---|
| Leste | 1 | Crânio e Garganta | Identificar o extremo oriental |
| Oeste | 1 | Foz/Abismo | Identificar a ruptura ocidental |
| Norte | 1 | Montanhas de Thargrid | Identificar região setentrional |
| Sul | 3 | Caatinga, Costa Sul/Portomonte e Mar de Sangue | Identificar regiões sulinas sem geometria |
| Posição relativa | 4 | Cauda, Ironwood, margem norte do Abismo, águas azuis | Rótulo acompanhado de seu marco de referência |
| Eixo atravessante | 1 | Rio Ancestral | Eixo conceitual com término no Abismo, sem traçado |
| Sem orientação fixada | 5 | Asa direita, coluna dorsal, costelas, ilha do Templo da Lua, Grama-Cortada | Referência documental fora da bússola espacial |
| Topologia contestada | 4 | Margem sul do Abismo, Gualápolis, Boca do Abismo, Shadar-Riverie | Aviso de conflito sem sobreposição automática |

Total: **20 marcos**. Não foram criadas novas cidades, paisagens, rios, mares, faixas de fronteira ou estruturas de acesso.

### A bússola qualitativa

A interface organiza em um painel visual:

- **Norte** acima, com o maciço de Thargrid.
- **Oeste** à esquerda, com a queda do Abismo.
- **Rio Ancestral** em uma caixa central de *eixo atravessante*, não como curso fluvial desenhado.
- **Leste** à direita, com o crânio de Golzdov e Garganta.
- **Sul** abaixo, com Caatinga, Costa Sul e Mar de Sangue.

Isso é **uma convenção de leitura**, não uma projeção geográfica ou alegação de que o rio atravessa matematicamente o centro geométrico do continente. A distância entre os cartões, o tamanho das caixas e as suas dimensões não representam distâncias, áreas ou fronteiras.

Abaixo da bússola existem coleções distintas para referências relativas, marcos sem localização e relações contestadas. **Nenhum deles é deslocado para uma coordenada de conveniência.**

## Doze relações preservadas

A carta também integra as **12 relações do Ciclo XXXIV** sem desenhar novas arestas. As ligações são classificadas por símbolo editorial: oposição cardeal, seta conceitual, relação documental sem traçado, limite móvel e topologia contestada.

**Exemplos:**

- Garganta/Abismo: oposição nos extremos leste e oeste, sem distância.
- Rio/Abismo: a ligação hidrológica existe, mas a linha do rio não pode ser inventada.
- Templo das Sombras/Abismo: margem norte *do Abismo*, não norte de todo o continente.
- Gualápolis/Boca: sobreposição histórica descrita; relação com Shadar-Riverie ainda contraditória.
- Ironwood/Thargrid: orientação ao sul das montanhas, sem extrapolação de fronteira.
- Cauda/Abismo: além da ruptura, acesso físico desconhecido.
- Ilha lunar/Rio: ilha documentada, trecho indeterminado.
- Mar de Sangue/águas azuis: separação variável, não uma linha geopolítica.
- Costelas/coluna dorsal: associação anatômica, não reconstituição geométrica do esqueleto.

A camada foi desenhada para não transformar cooperação militar, migração e estrutura anatômica em rotas praticáveis.

## Uma faixa marítima que o mapa não deve petrificar

O Mar de Sangue e as águas azuis não possuem fronteira estática. O manuscrito associa a variação a correntes, tempestades e fenômenos mágicos. A carta recomenda hachura, legenda de transição e, em futuras versões, possíveis sobreposições temporais, **mas não escolhe um modelo do Ciclo XXXVII sem aprovação autoral**.

A fonte estruturada impõe `linha_fixa: false`, `poligono_fixo: false` e `geometria: null`.

Os Abissais marinhos são habitantes das profundezas e **não** equivalem aos demônios do Abismo ocidental.

## As oito decisões seguem abertas

A carta consulta as mesmas oito questões da oficina topológica do Ciclo XXXVII:

1. Shadar-Riverie, Gualápolis e Boca do Abismo.
2. Possível acesso da foz à cauda.
3. Paisagem natural de Shadar-Riverie.
4. Contiguidade ou separação de Ironwood e Eldroth.
5. Conectividade dos grandes subsolos.
6. Representação da transição entre os dois mares.
7. Localização continental de Grama-Cortada.
8. Cabeceiras e afluentes do Rio Ancestral.

Nenhuma das 24 alternativas é escolhida por esta implementação; cada questão conserva `aprovada: false`.

## Convenções de desenho para futuras cartas

| Situação | Convenção sugerida | Informação que ela NÃO autoriza |
|---|---|---|
| Âncora cardeal | Nome em um painel direcional ou símbolo de bússola | Pino com latitude/longitude |
| Relação relativa | Texto como “ao sul das montanhas” ou “além do Abismo” | Distância, área ou divisa |
| Eixo atravessante | Seta conceitual e indicação do término | Trajeto sinuoso, afluentes ou largura |
| Referência não localizada | Índice à margem da carta, com ? | Posição desenhada por preenchimento |
| Conflito documental | Dois registros preservados e nota de revisão | Igualar duas cidades ou separá-las definitivamente |
| Limite móvel | Hachura e descrição explícita de variação | Fronteira marítima permanente |
| Subsolo | Símbolo de profundidade e referência ao complexo | Rede contínua de túneis |
| Anatomia fossilizada | Termos “crânio”, “asa”, “cauda”, “coluna” | Silhueta ou orientação exata do corpo inteiro |

A meta é fazer uma cartografia futura que permita **incerteza honesta**, em vez de preencher os vazios com traços convincentes, porém falsos.

## Implementação

- `data/atlas/carta-cartografica-ciclo38.json`: legenda, os vinte marcos, as doze relações, oito decisões e o fenômeno marítimo móvel.
- `site/atlas/cartographic-charter.mjs`: verificação cruzada contra o Atlas físico (XXXIV), interfaces (XXXVI) e oficina topológica (XXXVII). Rejeita marcadores falsos, categorias incompatíveis, posições exatas, polígono marítimo estático, solução automática de conflitos e referência ausente.
- `site/atlas/cartographic-charter-ui.mjs`: bússola qualitativa, inspetor com páginas do manuscrito, relações e um manual de desenho.
- `site/atlas/index.html`: integração na visão macro, sem novos locais na árvore.
- `tests/atlas-charter.test.mjs`: regressões de contagem, orientação e incerteza.
- `.github/workflows/publicar-atlas-pages.yml`: publicação do JSON no Pages.

O Atlas continua um banco de informações útil para **worldbuilding primeiro**. Não foi tocado o compêndio de criaturas, suas fichas Dungeon World, nem os consumidores dos jogos.

## Próxima expansão — Ciclo XXXIX

Há dois avanços macro coerentes, sem descer para a mesoescala:

1. **Camada de bacias, vertentes e divisores hipotéticos**: coletar o que sabemos da água e do relevo, e separar as hipóteses de formação do Rio Ancestral de uma rede hidrográfica confirmada.
2. **Cronocartografia do poder**: registrar quais centros mudam de controle em cada período documentado, sem projetar fronteiras retrospectivas ou inventar trajetórias de exércitos.

A ordem recomendada é **hidrografia continental antes da cronocartografia territorial**. Ela ajudará a estruturar recursos, agricultura, assentamentos e logística sem antecipar detalhes locais.

Atlas: https://pedromaintenance.github.io/monstros-carcaca/atlas/
