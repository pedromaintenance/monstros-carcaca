# Inventário de povoamento e primeiro lote fantástico — Ciclo XLIV

## Objetivo

A autoria esclareceu que a macroescala da Carcaça ainda está longe de concluída: o horizonte flexível ultrapassa 140 localidades e ilhas relevantes e **inclui assentamentos de criaturas tão importantes quanto os humanoides**. Uma cidade, colônia de fadas, comunidade goblin, sociedade subterrânea ou assentamento de criaturas aquáticas pode integrar a malha de povoamento; covis solitários e habitats também importam, mas pertencem à camada ecológica, não devem inflar a contagem de povoados.

Este ciclo **não inventaria um censo total** nem preenche metas arbitrariamente. Primeiro reconciliamos as representações do mundo já disponíveis em diferentes catálogos; depois criamos um lote transversal de **14 comunidades habitadas propostas**, sem aprovação canônica.

## I. O que de fato foi encontrado no repositório

| Fonte | Entradas | O que representam |
|---|---:|---|
| `data/atlas/macrorregioes-carcaca.json` | 26 âncoras de setores | Mistura de cidades, regiões, templos, ruínas, conjuntos coletivos, fortificações e acidentes físicos |
| `data/lugares_carcaca.json` | 8 lugares | Contém Portomonte, cavernas, ruínas, floresta e conjunto insular; **não são oito cidades** |
| `dist/carcaca/settlements.json` | 3 registros formais | Portomonte e **dois conjuntos regionais ainda por individualizar**: comunidades insulares tortles/tabaxis e cavernas habitadas Kuo-Toa |
| `data/propostas/povoamento-regional-hack-carcaca.json` | 16 sementes | Cenas, oficinas, feiras, travessias e microespaços propostos; **não são 16 assentamentos** |
| `data/propostas/eldroth-ecologia-monstruosa-dw.json` | 8 criaturas | Espécies e manifestações ecológicas hipotéticas; **não são oito comunidades** |
| `data/propostas/povoamento-criaturas-lote01.json` | 14 propostas novas | Comunidades com organização, ecologia e habitação propostas, **zero aprovadas** |

O corpus foi cruzado em `data/atlas/inventario-povoamento-ciclo44.json`. Este é um **inventário de referências** com categorias diferentes, não uma soma de cidades. Os números medem documentos das seis fontes, não o volume de povoamento existente na lore inteira.

### Sete grupos explícitos de equivalência

- **Portomonte:** âncora da macroescala, lugar cadastrado e registro formal referem-se à mesma cidade.
- **Ilhas da Costa Sul:** três registros referem-se a um conjunto regional, sem dizer quantas ilhas ou povoados existem nele.
- **Cavernas Kuo-Toa:** três representações da rede de cavernas não significam três assentamentos.
- **Vandar:** ruína e referência ambiental; os mortos-vivos ocupantes não comprovam assentamento civil.
- **Gualápolis:** cidade histórica, com grafias variantes; não resolve a sobreposição Shadar–Boca.
- **Boca do Abismo:** diferentes catálogos citam a fortaleza, não vários lugares.
- **Eldroth:** referência florestal é macroambiente, não povoado único.

Por isso o Atlas **não apresenta um percentual falso de progresso** contra o horizonte de 145–205 lugares e ilhas.

## II. Primeiro lote: quatorze comunidades fantásticas propostas

| Frente | Localidade proposta | Comunidade e singularidade |
|---|---|---|
| Costa Sul | **A Maré dos Rostos de Sal** | Kuo-Toa em ocupação recorrente de cavernas sujeitas às marés, entre tradição, autonomia e exigências do culto |
| Costa Sul (ilha proposta) | **O Mosteiro das Tartarugas de Vidro** | Comunidade tortle com visitantes tabaxis, hospitalidade monástica e pressões sobre os recursos |
| Rio Ancestral | **A Orla das Cestas Sussurrantes** | Aldeia goblin de coletores e tecelões, potencialmente ameaçada pelo aparelho fiscal da Corte |
| Rio Ancestral | **Círculo das Lanternas D'Água** | Assentamento sazonal de fadas fluviais com acolhimento e organização própria |
| Eldroth | **Bolsa da Folha Gravada** | Vila goblin que esconde registros e fugitivos, sem lealdade presumida à Corte ou à resistência |
| Eldroth | **Jardim das Vozes Desatadas** | Enclave feérico habitado com disputas internas e autonomia não garantida |
| Ironwood | **O Coral dos Troncos Acordados** | Colônia comunitária de árvores conscientes, com vida social que não segue urbanismo humano |
| Ironwood | **O Ninho das Cinquenta Cordas** | Núcleo sazonal de goblinoides arborícolas, em tensão com usos rangers do bosque |
| Caatinga | **A Aldeia das Jarras Refeitas** | Povoado de goblins ceramistas e famílias orcs, com dependência hídrica em aberto |
| Caatinga | **A Vigília do Barro que Anda** | Colônia hipotética de elementais de argila, cuja reprodução e água disponível são perguntas |
| Thargrid | **O Condado das Sementes de Quartzo** | Enclave svirfneblin e comunidade fúngica inteligente proposta, com interesses próprios |
| Entorno de Garganta | **Os Degraus da Escama Rachada** | Comunidade de kobolds escavadores e artesãos ligada, apenas por hipótese, ao entorno do crânio |
| Águas azuis | **A Sinfonia das Fendas Claras** | Comunidade tritã e sereia habitando recifes, com dilema sobre patrulhas do limite móvel |
| Mar de Sangue | **O Claustro das Marés Feridas** | Comunidade de Abissais marinhos com disputas sacerdotais sobre coerção e proteção |

**Todos os nomes, moradores específicos, forma arquitetônica e conflito institucional desses quatorze lugares são propostos, não canônicos.** A fonte que inspira cada proposta é indicada em `ancora_de_ambientacao`, e sua impossibilidade de inferência em `nao_inferir`. Nenhum registro possui coordenadas, população, distância ou rota.

O Mosteiro das Tartarugas de Vidro é **uma comunidade proposta em uma ilha também proposta**: esse registro conta na lista de comunidades, e não confirma uma ilha nova no inventário insular. Para Ironwood, os moradores são associados à frente específica, mesmo quando o identificador de setor é `thargrid`. A frente submersa contempla **dois setores**, `costa` e `azuis`, sem confundir as águas rubras com as águas azuis.

### Por que as comunidades têm substância

Cada proposta identifica **habitantes, organização social, subsistência hipotética, forma de habitar, permanência, tensão narrativa e limite de inferência**. Uma colônia de árvores conscientes pode ter vida social sem casas ou ruas; um lugar sazonal pode existir sem ser cidade permanente; fadas não são automaticamente subordinadas aos Shadow Fey; uma comunidade goblin não é necessariamente hostil. A relação com a Corte, com as redes da resistência e com outros assentamentos será modelada caso a caso.

## III. Onde ainda estamos longe do horizonte

Este lote alcança oito das dez frentes de geração, mas **não resolve sua densidade**. As frentes de ilhas geograficamente individualizadas e de comunidades da cauda ainda não receberam propostas neste lote; o primeiro mosteiro insular também não individualiza sua ilha no mapa. Foz, Shadar-Riverie e Grama-Cortada seguem sem meta de densidade autoral estabelecida. O inventário não autoriza mapa de estradas, biomas novos, fronteiras ou conexões subterrâneas.

O próximo passo apropriado é **catalogar as comunidades já documentadas no manuscrito e converter as relações gerais de cada região em oportunidades de povoamento**, antes de multiplicar propostas. A expansão pode seguir por pequenos lotes ecologicamente variados, sempre com controle de duplicidade, canonização e consequências sobre os recursos de cada território.

## Implementação

- `data/atlas/inventario-povoamento-ciclo44.json`: inventário de seis fontes e sete grupos de equivalência.
- `data/propostas/povoamento-criaturas-lote01.json`: quatorze propostas independentes.
- `site/atlas/settlement-inventory.mjs`: valida cruzamento, identidade, frentes e ausência de coordenadas, contagens aprovadas e inferências não permitidas.
- `site/atlas/settlement-inventory-ui.mjs`: três modos — propostas, inventário e equivalências — com filtro de frente e inspetor ecológico.
- `site/atlas/index.html`: integração à visão macro do Atlas.
- `tests/atlas-settlement-inventory.test.mjs`: verificação de contagens, equivalências, múltiplas comunidades de criaturas, cenários adversos e HTML.
- Workflows de validação e Pages passam a carregar os arquivos do ciclo.

[Explorar no Atlas](https://pedromaintenance.github.io/monstros-carcaca/atlas/#settlementInventory)

**Fronteira autoral preservada:** o inventário não altera o cânone; cada nova comunidade exige aprovação explícita antes de ser apresentada como parte estabelecida do continente.
