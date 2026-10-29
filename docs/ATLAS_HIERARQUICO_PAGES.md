# Atlas Hierárquico da Carcaça — Protótipo para avaliação

## Acesso
Quando GitHub Pages estiver habilitado e o deploy concluído, endereço padrão:

**https://pedromaintenance.github.io/monstros-carcaca/atlas/**

No GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions** (configuração necessária apenas se o Pages ainda não estiver habilitado).

## Modelo em profundidade variável — assentamentos no quinto nível

A hierarquia não deve ter profundidade artificial fixa. Uma região pode conter um bioma, que contém vilas e cidades; uma cidade pode conter bairros, que contêm templos, casas, lojas e covis.

1. **Carcaça** — o continente inteiro.
2. **Região / setor de leitura** — unidade geográfica, sem presumir limites ou soberania.
3. **Tipo de lugar** — assentamento, bioma, fortaleza, ruína, rota, local de poder etc.
4. **Lugar/território abrangente** — ex.: Ironwood, Montanhas de Thargrid, Garganta, Portomonte.
5. **Localidades internas e assentamentos** — vilas, cidades, fortificações, refúgios, distritos e outras unidades explicitamente contidas no quarto nível.
6. **Sublugares recursivos** — bairros, estabelecimentos, sítios sagrados, covis, arquivos ou outras subdivisões; repetíveis sem limite fixo.
7. **Categorias de conteúdo** — povos, culturas, personagens, criaturas, fauna, flora, relíquias, facções, deuses e memórias.
8. **Registros e atributos** — entidade individual, proveniência e vínculos verificados.

**Importante:** se o quarto nível já for o lugar mais específico da fonte (por exemplo, um assentamento sem bairros documentados), suas categorias de conteúdo podem ficar diretamente nele. Não criamos um fictício "centro de Portomonte" apenas para preencher o nível cinco.

### Ironwood como caso de referência

- `Ironwood` é a âncora territorial original do manuscrito (floresta/fortaleza ranger).
- `Fortaleza ranger — núcleo de Ironwood` é a representação **do núcleo fortificado documentado**, não uma cidade nova nem um governo adicional. Elara Stormoak e rangers ficam ligados a esse núcleo.
- `Pouso das Bainhas Viradas` e `Pátio da Trilha Incompleta` são **dois microespaços não canonizados** dos dossiês anteriores, explicitamente ancorados em Ironwood; aparecem como localidades propostas.
- `Outras vilas e cidades — ainda não individualizadas` é uma **pasta de lacuna**, não uma afirmação de que existem várias cidades documentadas.
- `A Escola das Trilhas que Somem` continua **próxima de Ironwood**, e não dentro dele: proximidade não basta para criar parentesco geográfico.

O mesmo mecanismo coloca `Reino Sob a Montanha` sob `Montanhas de Thargrid`, `Templo de Deméter` sob `Portomonte`, `Templo de Yolskaariin` sob `Garganta`, `Templo da Lua` sob `Rio Ancestral` e `Arquivo dos Mortos Afogados` sob `Gualápolis`, sem modificar identidades ou criar coordenadas.

## Estatutos e proveniência

- **Manuscrito:** constava no capítulo I do Hack ou nas referências correspondentes. Menção de fonte não é homologação de mecânica e não preenche lacuna cartográfica.
- **Catalogado:** existe em arquivos estruturados do repositório, podendo ainda ser rascunho de curadoria com valores DW pendentes.
- **Proposta:** hipótese não canonizada dos ciclos anteriores (inclusive os 16 núcleos e oito organismos de Eldroth).
- **Organizador editorial:** pasta de navegação, não região/cidade/facção inventada.
- **Lacuna:** categoria sem registros suficientes; não significa que aquilo não exista no mundo.

### Salvaguardas específicas

- **Kuo-Toa e Abissais marinhos são povos**, não são adicionados como monstros por preconceito taxonômico. Abissais marinhos não são demônios do Abismo no oeste.
- **Sete monstros catalogados** mantêm ocorrência no Arquivo dos Mortos Afogados. Não há inferência de presença continental.
- **Oito seres da ecologia de Eldroth** permanecem propostas, com ocorrência apenas regional, não covil individual.
- **Lança da Perdição** é menção narrativa, não ficha de item mágico homologada; propriedades, raridade e câmara específica não foram inventadas.
- **Grama-Cortada** inclui grupos agrícolas documentados, não novas espécies botânicas nomeadas.
- **Shadar-Riverie, Gualápolis e Boca do Abismo** mantêm relações narrativas sob revisão geográfica. Um vínculo não corresponde a trajeto real.
- **Ironwood e Thargrid** aparecem agrupadas apenas em um setor de leitura ligado à resistência; não são declaradas a mesma soberania.
- **Revolta de Drakport** permanece futura e aberta; o site não modifica o câ­none.

## Fontes usadas no protótipo

O site lê os dados do próprio repositório, copiados de forma estática para o artefato de Pages na publicação:

- `data/lore/hack-carcaca-dw-indice-tematico.json` — lugares, povos, personagens, culturas, divindades etc.
- `data/regioes_carcaca.json` e `data/lugares_carcaca.json` — classificação factual formalizada.
- `data/povos_carcaca.json`, `data/faccoes_carcaca.json` — referências regionais do atlas principal.
- `dist/carcaca/settlements.json` — assentamentos estruturados, ainda com campos DW sem quantificação.
- `dist/carcaca/creatures.json` — sete criaturas do Arquivo.
- `data/propostas/povoamento-regional-hack-carcaca.json` — dezesseis núcleos não canônicos.
- `data/propostas/eldroth-ecologia-monstruosa-dw.json`, `data/propostas/eldroth-fichas-dw-ciclo13.json` — ecologia e fichas propostas.
- `data/propostas/ironwood-eldroth-resistencia-hack.json` — dois microespaços hipotéticos explicitamente ancorados em Ironwood.

A página apresenta 12 pastas de alto nível (11 setores e a pasta transversal) e pode aninhar localidades recursivamente. Os dados são montados pelo módulo `site/atlas/atlas-tree.mjs`; os testes `tests/atlas-hierarquia.test.mjs` são executados na CI e no workflow de Pages. O deploy copia somente onze arquivos JSON públicos necessários; não publica arquivos privados ou integra fontes de D&D não destinadas à distribuição.

## Evolução futura

1. Rever as áreas do mapa com IDs geográficos oficiais e fazer ajustes por decisão de autoria.
2. Individualizar assentamentos, covis, rotas e comunidades sem presumir nomes e populações.
3. Anexar novos monstros aos habitats com proveniência e alcance documentado.
4. Separar a ficha de criatura em ecologia, comportamento, estatísticas DW, ocorrências de campanha e história.
5. Representar relações não hierárquicas (alianças, antagonismos, parentescos e caminhos) em grafo complementar, sem duplicar fatos.
6. Fazer uma interface de aprovação autoral por ID; nenhuma aprovação é automática.

## Publicação

O workflow `.github/workflows/publicar-atlas-pages.yml` executa os testes Node, prepara `site/` e as cópias JSON, envia artefato e tenta publicar no ambiente `github-pages`. **O primeiro deploy exige que a fonte de Pages do repositório esteja habilitada como GitHub Actions.** Caso ainda não esteja, a implantação pode falhar após a etapa de testes; nesse caso o usuário precisa escolher a fonte uma única vez em Settings → Pages. É uma limitação de permissões da administração da conta, não um problema na geração do HTML.
