# Ciclo XXXIII — Redes continentais, esferas de poder e evolução histórica

## Escopo

Este ciclo amplia **somente a escala macro**: não individualiza aldeias, monstros, cultivos, casas, clãs ou objetos mágicos. Os mesmos 11 setores geográficos e a árvore V1.2 permanecem, mas ganha-se uma segunda camada documental: **como poder, circulação, guerra, deslocamentos e história atravessam o continente**.

A camada `data/atlas/redes-historicas-ciclo33.json` é uma *síntese editorial baseada no capítulo I do Hack da Carcaça*. É independente do cânone formal; não altera regras de Dungeon World nem cria fatos históricos, movimentos, rotas, soberanias ou coordenadas.

## Resultado

- **7 redes**: rio/circulação; Corte e centros de poder; resistência; conflitos do Além Sul; fronteira marítima; guerra do Abismo e mudança da Corte; deslocamentos/refúgios.
- **14 esferas de presença e poder** em regiões: Garganta/Varys, Rio/tributos e Drakport/Morwen, Eldroth/Sylara, Vandar/Damaris, Thargrid e Ironwood, Boca do Abismo/Ulorian, Shadar/Casa Shayr, Cauda/Sarastra, Caatinga e Costa Sul sem ocupação feérica direta, povos marinhos das águas vermelhas e azuis. *Não são polígonos de governo nem fronteiras calculáveis.*
- **17 marcos datados** de 0 a 999 EC. A cronologia é fonte histórica, não uma fotografia exaustiva do estado político de cada ano.
- **8 lacunas estruturais abertas**: Shadar/Gualápolis; Grama-Cortada; limites Ironwood/Eldroth/Thargrid; fortaleza histórica de Voragar na coluna dorsal; ilha do Templo da Lua; cidades submersas; trajetória invasão Kuo-Toa entre 342 e 351 EC; futura Revolta de Drakport.

Os `relacao_ids` das redes referem-se exclusivamente aos **7 vínculos macro existentes** em `data/atlas/macrorregioes-carcaca.json`, validados por código. Não introduzimos arestas cartográficas pelo simples fato de regiões pertencerem à mesma rede temática.

## Referências documentadas

### Poder e ocupação

Hack pp. 2, 4–8: Varys controla Garganta; Morwen associa-se a Drakport; Sylara ocupa Eldroth; Damaris ocupa Vandar; Ulorian funda a Boca do Abismo e participa de uma defesa tensa com povos nativos; Casa Shayr atua em Shadar-Riverie; Sarastra mantém a Corte na cauda.

Hack p. 5: Caatinga e Costa Sul **não são áreas de colonização feérica direta** — isso não significa que estejam livres de guerras, incursões, coerção ou influências indiretas. A resistência **não** se reduz a um comando único (p. 7).

### Eventos de larga escala

Hack pp. 9–10: 211 (Garganta livre), 342 (invasão Kuo-Toa), 351 (contraofensiva orc e humana), 358 (Confederação dos Ossos), 501 (refúgio feérico em Eldroth/Ironwood), 666 (mudança dos Lordes), 711 (Templo das Sombras), 875 (guerras de conquista), 886 (Voragar), 888 (Rayquaza refugiado), 910–912 (ocupação e resistência), 921 (morte de Voragar), 983 (invasão demoníaca), 984 (tomada de Gualápolis), 999 (Templo do Crepúsculo).

Essas datas são **as do manuscrito**, e não datas inferidas para assentamentos ou fatos ainda indefinidos.

### Limitações cronológicas e geográficas

- **886/921 EC:** a fortaleza de Voragar é citada no centro da coluna dorsal, mas não existe setor geográfico correspondente. Os marcos históricos aparecem sem setor, e a posição não é inventada.
- **984 EC:** o golpe contra Gualápolis fica associado à foz como área de leitura, mas seu conflito topológico com Shadar-Riverie continua **aberto**.
- **342/351 EC:** a descrição da invasão até Garganta e expulsão do Extremo Oeste pode confundir interpretações de percurso. Registramos a inconsistência como pergunta, não desenhamos linha de marcha.
- **Revolta de Drakport:** Hack p. 11 **futuro sem data**, não incluída nos 17 marcos já ocorridos. Não supor que ocorreu nem que Ironwood participou.
- **Mar de Sangue:** Abissais marinhos são um povo antigo anfíbio e **não são os demônios** do Abismo ocidental (Hack p. 14).

## Interface — três escalas separadas

1. **Visão geral do continente**: 11 setores e seus marcos-chave, como no Ciclo XXXII.
2. **Redes macro e cronologia**: sete filtros temáticos, autoridades e presenças, ligações *comprovadas* e oito lacunas. Um slider temporal mostra fatos de 0–999 EC relacionados a cada rede.
3. **Árvore de localidades e criaturas**: estrutura recursiva do atlas mantida em aba separada.

A seleção temporal **não é um simulador político**: a existência de um registro em 875 não autoriza projetar a mesma fronteira em 910; são apenas acontecimentos datados. A interface não tenta desenhar um mapa geográfico impreciso com cartões conceituais.

## Próxima expansão macro recomendada

Rever **topologia histórica e controle territorial em cada grande região**, começando por `Shadar-Riverie ↔ Gualápolis ↔ Boca do Abismo`, depois limites de Ironwood/Thargrid/Eldroth e a localização de Grama-Cortada, por decisão autoral. Só depois construir um mapa técnico de rotas, corredores e cidades em escala meso.

## Arquivos

- `data/atlas/redes-historicas-ciclo33.json` — dados, fontes e ressalvas.
- `site/atlas/macro-networks.mjs` — validador determinístico cruzando o macroatlas e rejeitando falsos vínculos.
- `site/atlas/macro-layers-ui.mjs` — exploração visual, filtros e história.
- `site/atlas/index.html` — integração com o Pages.
- `tests/atlas-macro.test.mjs` — testes de invariantes e semântica.
- `.github/workflows/publicar-atlas-pages.yml` — distribuição estática dos dados.

Para revisão: https://pedromaintenance.github.io/monstros-carcaca/atlas/
