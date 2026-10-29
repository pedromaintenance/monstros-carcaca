# Ciclo XXXVI — Interfaces continentais: contato, conflito e limites sem geometria

## Escopo e motivo

Esta etapa continua **na escala macro**. O mapa da Carcaça reúne onze setores de navegação, vinte marcos de geografia física, vinte e oito macroambientes e redes políticas; contudo, nem toda relação entre dois lugares é uma fronteira física. A nova camada pergunta **que tipo de relação pode ser afirmada** sem fabricar coordenadas, rotas, contiguidade ou governos.

O inventário de `data/atlas/interfaces-continentais-ciclo36.json` contém **13 interfaces** e **8 perguntas de decisão autoral**. Todas as páginas se referem ao capítulo I paginado do manuscrito do Hack. A leitura material é apresentada como *interpretação*, e não como conteúdo do manuscrito.

## Critério cartográfico

Há cinco distinções essenciais:

1. **Conexão física documentada:** o Rio Ancestral termina no Abismo. Isso não informa nascente, curso completo nem via de travessia.
2. **Posição relativa:** Ironwood fica ao sul das montanhas de Thargrid. Isso não informa divisa ou extensão da floresta.
3. **Relação política ou social:** cooperação de resistência entre Thargrid e Eldroth, circulação de refugiados de Eldroth à costa. Isso não identifica uma estrada ou contiguidade.
4. **Limite dinâmico:** águas rubras e azuis interagem numa fronteira variável. Uma linha fixa seria uma invenção.
5. **Contradição/ausência de localização:** a topologia Shadar-Riverie–Gualápolis–Boca e o limite entre Eldroth e Ironwood requerem revisão do autor.

## Quadro dos treze registros

| Interface | Evidência / estado | O que não desenhar |
|---|---|---|
| Rio Ancestral → Abismo | Hidrografia, pp. 4–5 | Nascente, afluentes, rota segura |
| Caatinga ↔ pradarias da Costa Sul | Incursões, pp. 5, 12 | Estrada ou fronteira política contínua |
| Eldroth → Costa Sul | Refugiados, pp. 5, 18 | Corredor cartográfico |
| Mar de Sangue ↔ águas azuis | Fronteira móvel, pp. 14–15 | Linha ou polígono fixo |
| Foz ↔ cauda | Transferência histórica de poder, pp. 5–6, 9 | Ponte e passagem comprovada |
| Thargrid ↔ Eldroth | Rede de resistência, pp. 6–7, 18 | Adjacência de florestas/montanhas |
| Foz ↔ Shadar-Riverie | Topologia em revisão, pp. 5–6 | Equivalência automática de nomes históricos |
| Thargrid → Ironwood | Orientação relativa, p. 6 | Fronteira administrativa |
| Thargrid ↔ cidades anãs subterrâneas | Verticalidade, pp. 12–13 | Rede universal de galerias |
| Cavernas Kuo-Toa ↔ Mar de Sangue | Contato costeiro, pp. 5, 14 | Fundir cavernas e cidades submersas |
| Profundezas dos Abissais ↔ Mar de Sangue | Povo marinho, p. 14 | Confundir Abissais com demônios |
| Ilhas monásticas ↔ recifes e cânions | Algumas cidades abaixo de ilhas, p. 15 | Posicionar cidades sob todas as ilhas |
| Ironwood ↔ Eldroth | Limite físico em aberto, pp. 6, 18 | Ecótono ou corredor confirmado |

## Auditoria de coerência

Os sete vínculos macro do Ciclo XXXII estão referenciados, mas apenas quando correspondem realmente ao registro. Oito interfaces remetem a relações ambientais existentes do Ciclo XXXV; estas **não formam um grafo de estradas**. A camada guarda `geometria: null` e `rota_confirmada: false` em cada interface.

O validador cruza IDs com as regiões, redes e habitats já carregados. Proíbe relações com setores inexistentes, referências de fonte sem correspondência, transformação da topologia contestada em fato e fixação da fronteira marítima. O painel interativo é **um atlas de relações qualitativas**, não um mapa em escala.

## Oito decisões editoriais que mudariam o mapa

| Prioridade | Questão | Por quê |
|---|---|---|
| Alta | Reconciliar Shadar-Riverie, Gualápolis e Boca do Abismo | Evita duplicar cidades ou sobrepor sede de poder |
| Alta | Determinar se Ironwood e Eldroth se tocam | Define se existe transição física entre duas florestas |
| Alta | Estabelecer se há travessia entre foz e cauda | Impede desenhar ponte ou estrada sem evidência |
| Alta | Representar a faixa móvel entre os mares | Define a natureza dinâmica da cartografia náutica |
| Média | Localizar nascentes e afluentes do Rio Ancestral | Fundamenta bacias hidrográficas futuras |
| Média | Individualizar conexões reais do subsolo | Evita criar rede de túneis que a fonte não demonstra |
| Alta | Situar Grama-Cortada em relação às demais regiões | Necessário para o mapa continental político/físico |
| Média | Definir a paisagem natural de Shadar-Riverie | Setor ainda sem perfil ecológico documentado |

Nenhuma das oito perguntas foi respondida por esta implementação.

## Próximo desenvolvimento macro sugerido — Ciclo XXXVII

Antes da escala mesorregional, elaborar **uma matriz de decisões topológicas** para o autor com alternativas visualizáveis, mas não adotadas. O artefato pode conter esquemas *não georreferenciados* para apresentar cenários concorrentes de:

- Oeste: Shadar-Riverie, Gualápolis, Boca do Abismo e cauda.
- Norte e asa direita: Thargrid, Ironwood, Eldroth e Vandar.
- Litoral: Costa Sul, Mar de Sangue, águas azuis e ilhas.
- Interior: localização do Condado de Grama-Cortada e das nascentes do Rio Ancestral.

Somente **após decisão expressa de autoria** uma alternativa deve passar do estado de hipótese para fato e, posteriormente, originar uma linha no mapa.

## Arquivos

- `data/atlas/interfaces-continentais-ciclo36.json` — conteúdo e proveniência por interface.
- `site/atlas/macro-interfaces.mjs` — validação cruzada.
- `site/atlas/macro-interfaces-ui.mjs` — exploração por evidência.
- `site/atlas/index.html` — painel sob os macroambientes.
- `tests/atlas-interfaces.test.mjs` — proteção dos invariantes.
- `.github/workflows/publicar-atlas-pages.yml` — publicação no Pages.

Atlas: https://pedromaintenance.github.io/monstros-carcaca/atlas/
