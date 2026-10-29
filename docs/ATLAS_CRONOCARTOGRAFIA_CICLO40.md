# Ciclo XL — Cronocartografia do poder da Carcaça

## Objetivo e regra de método

O Atlas chegou a uma escala em que os territórios macro, sua geografia física, seus ambientes, suas interfaces, alternativas topológicas, cartas de restrições e hidrografia já são separáveis em camadas. Este ciclo introduz o **tempo** como outra camada, sem produzir uma sucessão ilusória de mapas políticos com fronteiras contínuas.

O capítulo I do Hack da Carcaça, nas páginas **9–10**, registra os principais acontecimentos históricos com datas EC; a página **11** registra os futuros em aberto. O Ciclo XXXIII já indexava **17 marcos históricos** e **14 esferas de poder**. Esta etapa cruza essas fontes sem alterar a redação ou homologar decisões editoriais.

**Uma ocorrência em um setor não significa que um agente controle toda a região.** Exércitos podem invadir sem reter territórios, refugiados podem habitar uma floresta sem dominá-la e uma estrutura de tributação ao longo do rio pode coexistir com territórios resistentes. O painel separa **evento**, **papel político num local**, **esfera de atuação descrita no manuscrito** e **fronteira**. Não temos polígonos canônicos.

## Seis recortes históricos de consulta

Os intervalos são uma **ferramenta de apresentação** dos marcos, não seis novas eras canônicas. O manuscrito chama 501–886 de Era das Fadas e 886–909 de Era da Traição, com 886 aparecendo na transição. Para navegação sem sobreposição, a interface usa 501–874 e 875–909, evidenciando a conquista antes e depois do golpe de Voragar.

| Recorte editorial | Anos EC exibidos | Marco principal | Limite da representação |
|---|---|---|---|
| Origens e Primeiros Reinos | 0–500 | Fundação geográfica do continente, Garganta livre, invasão Kuo-Toa, coalizão e Confederação dos Ossos | A morte de Golzdov não concede soberania aos setores |
| Migração feérica e implantação | 501–874 | Refugiados feéricos, Lordes chegando à Carcaça, Templo das Sombras | Migração e instalação não compõem um Estado que ocupe o continente |
| Conquista e traição | 875–909 | Guerras de dominação, ruína da Confederação, Voragar e refúgio de Rayquaza | Coluna dorsal não tem localização setorial; conquista não equivale a polígono |
| Dominação e resistência | 910–982 | Predomínio da Corte, exploração em Drakport, resistência de Thargrid e Ironwood, morte de Voragar | Autoridade feérica e resistência coexistem; nenhum governo uniforme |
| Crise abissal | 983–998 | Invasão demoníaca, destruição do templo e tomada de Gualápolis | Não construir o Templo do Crepúsculo retroativamente em 983 |
| Marco do Crepúsculo | 999 | Construção do templo sobre a cauda de Golzdov | Data da obra, não data da existência de uma ponte ou rota |

Não se inventou um “ano presente” para a campanha: **999 EC é o último marco explicitamente datado incorporado** nesta fonte. O manuscrito não fornece data final para o período histórico contemporâneo.

## Cada um dos 17 acontecimentos possui um papel espacial específico

A camada preserva `tempo-xxxiii:01` a `tempo-xxxiii:17`, com ano, título e páginas vindos do Ciclo XXXIII, e adiciona uma **leitura editorial por setor**. O vocabulário é deliberadamente restrito: fundação geográfica, autonomia, circulação, invasão, resistência, aliança, refúgio, sede, conquista, golpe, ocupação, destruição, marco e relação contextual sem projeção.

Esses papéis são **etiquetas históricas**, não valores para preencher áreas de mapas. Cada evento tem `fronteira_confirmada: false`, `rota_confirmada: false`, `geometria: null` e `nao_aplicar_como_estado_territorial: true`.

### Quatro eixos que merecem atenção

**1. Garganta, invasão e Confederação (211–358 EC).**

Em 211 EC Garganta é cidade-estado livre, e o Rio Ancestral já é rota importante. Em 342 EC o manuscrito registra invasão Kuo-Toa a partir do Mar de Sangue, alcançando Garganta; em 351 EC, a coalizão dos orcs da Caatinga com humanos de Garganta. A redação da expulsão, porém, fala em **Extremo Oeste**, apesar da rota de invasão citada alcançar Garganta a leste. A cronocartografia **não corrige** o percurso por inferência. A Confederação dos Ossos forma-se em 358 EC nas proximidades de Garganta, sem contorno territorial definido.

**2. Estabelecimento feérico versus colonização (501–875 EC).**

Refugiados feéricos chegam às florestas em 501 EC; Lordes mudam-se oficialmente para a Carcaça em 666 EC; a Rainha instala-se na margem norte do Abismo em 711 EC. Só em 875 EC o manuscrito marca o início das guerras abertas de dominação. Não se trata a presença anterior de refugiados ou comércio como ocupação feérica universal.

**3. Conquista e resistência simultâneas (910–921 EC).**

Em 910 EC o texto afirma que a Rainha consolidou seu predomínio militar e político sobre **a maior parte** do continente, mas também afirma a resistência do Reino Sob a Montanha e de Ironwood. O registro contém setores diferentes com papéis diferentes: no **Rio Ancestral**, ocupação/extração; em **Thargrid**, resistência. Não se pinta Thargrid da mesma cor da Corte por ela ser mencionada no evento. Em 912 EC a posição do Reino como bastião é reafirmada; 921 EC registra a morte de Voragar e dos Dragões Ancestrais, **não** a libertação automática das regiões ocupadas.

**4. Deslocamento do poder na crise do Abismo (711–999 EC).**

- **711 EC** — construção do Templo das Sombras, sede na margem norte do Abismo.
- **983 EC** — invasão demoníaca destrói o templo e desloca a Corte; a existência do novo palácio ainda não está datada para esse momento.
- **984 EC** — Gualápolis é tomada pelo golpe do Senhor do Rio. A equivalência ou distinção entre **Shadar-Riverie, Gualápolis e Boca do Abismo** continua uma decisão autoral não resolvida.
- **999 EC** — construção do Templo do Crepúsculo na cauda. A mudança de sede não prova ponte, estrada ou passagem física.

Os demônios que atacam pelo Abismo ocidental não são os **Abissais marinhos**, uma civilização anfíbia distinta.

## Catorze esferas de poder não são catorze Estados com fronteiras

O Ciclo XXXIII documenta 14 centros, agentes e modos de presença:

- Garganta ocupada sob Varys Duskveil;
- dominação, tributos e escravização na rede do Rio, incluindo Drakport;
- Eldroth sob Sylara Nightwhisper e Vandar sob Damaris Blackthorn;
- Reino Sob a Montanha e Ironwood como polos diferentes de resistência;
- Boca do Abismo e Shadar-Riverie, com a necessária revisão da topologia política;
- Templo do Crepúsculo, sede da Rainha;
- Caatinga e Costa Sul fora da colonização feérica direta, mas atravessadas por conflitos;
- poderes marítimos de Kuo-Toa, Abissais, tritões e sereias com domínios não cartografados.

São descrições do panorama político existente no texto, **não fichas históricas datadas para todos os séculos**. Cada esfera da nova camada guarda `inicia_no_ano: null`, `termina_no_ano: null`, `nao_retroprojetar: true` e `fronteira_confirmada: false`.

O painel permite abrir acontecimentos **contextuais** relacionados a cada polo, mas não utiliza a data de um acontecimento como data automática de fundação da esfera. Por exemplo: 984 EC é a data da tomada de Gualápolis, não prova a data exata da implantação das instituições descritas em Shadar-Riverie ou Boca.

## Sete futuros abertos permanecem sem resolução

Da página 11 do manuscrito:

1. Revolta dos escravizados de Drakport.
2. Queda ou permanência de Thargrid.
3. Destino dos Yokai.
4. Destino de Rayquaza.
5. Origem de Golzdov e sua morte.
6. Futuro da Corte sob a guerra demoníaca.
7. Possibilidade de reversão da corrupção do Mar de Sangue.

Todos têm `estado: nao_acontecido_ou_indeterminado`, `ano_ec: null` e `acontecimento_confirmado: false`. O painel não adiciona uma revolução de Drakport, a queda de Thargrid ou qualquer desfecho que não esteja no texto.

## Como utilizar no Atlas

Na seção **O poder através dos séculos**:

1. Abrir **Linha do tempo** e alternar seis recortes com períodos explícitos.
2. Escolher um evento; o inspetor exibe ano, páginas, leitura política e papéis diferentes de cada setor.
3. Filtrar eventos por setor: **a ausência de registro em um período não demonstra ausência de população, autoridade ou conflitos**.
4. Consultar **14 centros de poder** como o panorama descrito pelo manuscrito, sempre sem início temporal presumido.
5. Consultar **Futuros em aberto**, preservados como perguntas.
6. Consultar **Regras de interpretação**, que definem os limites da cartografia temporal.

O formato da linha do tempo é **qualitativo**, não uma animação de fronteiras. O Atlas continua apropriado para orientar a criação posterior de mapas por épocas após decisões explícitas.

## Arquivos

- `data/atlas/cronocartografia-ciclo40.json` — seis recortes, 17 marcos históricos, 14 polos e sete futuros abertos.
- `site/atlas/chronocartography.mjs` — validação cruzada com o Ciclo XXXIII, 11 setores e marcos físicos.
- `site/atlas/chronocartography-ui.mjs` — cronologia interativa, filtros de período e setor, inspetor, polos, futuros.
- `site/atlas/index.html` — integração do painel à visão macro.
- `tests/atlas-chronocartography.test.mjs` — regressões contra inventar eventos, datas de polos, fronteiras ou futuros realizados.
- `.github/workflows/publicar-atlas-pages.yml` — publicação de JSON no Pages.
- `.github/workflows/validar-curadoria.yml` — inclusão das regressões da cronocartografia.

## Próxima etapa macro — Ciclo XLI

O próximo passo recomendado é **circulação material e dependências continentais**: redes de abastecimento, extração, tributos, refúgio, alimentos, rotas marítimas e redes de informação. A fonte documenta funções de circulação, mas as distâncias e os caminhos entre os nós permanecem indeterminados.

A camada deve diferenciar **relações materiais comprovadas** de **rotas hipotéticas** e registrar quem depende do quê *sem calcular custos de transporte, fluxos ou distâncias inventadas*. Ela prepara a futura política territorial sem fazer geografia por conveniência.

Atlas: https://pedromaintenance.github.io/monstros-carcaca/atlas/
