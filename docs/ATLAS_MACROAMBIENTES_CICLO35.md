# Ciclo XXXV — Inventário macrorregional de ambientes da Carcaça

## Propósito

Ampliar o Atlas **na escala macro**, mantendo intocados os detalhes internos dos assentamentos: identificar **paisagens, relevos, grandes habitats, zonas fluviais, arquipélagos e níveis subterrâneos** antes de determinar suas vilas, criaturas, recursos, flora e acontecimentos locais.

O capítulo I paginado do Hack da Carcaça é a base documental. O índice é editorial e **não promove nenhum habitat ou nome de categoria à condição de novo lugar canônico**.

## Entrega

- **8 famílias ambientais:** ossatura de Golzdov; montanhas; florestas; terrenos secos e agrícolas; rios e Abismo; litoral e ilhas; oceanos e profundezas; cavernas e subsolo.
- **28 grandes ambientes** referenciados nas fontes, sem polígonos ou coordenadas inventadas.
- **15 relações documentais** entre ambientes, classificadas por tipo: contém, acima, profundidade relativa, margem, término de rio, contato costeiro, fronteira móvel etc.
- **12 lacunas editoriais** com evidência paginada e status pendente.
- **11 setores** auditados em matriz de cobertura. Dez possuem alguma paisagem referenciada; **Shadar-Riverie não tem bioma individualizado** na fonte disponível.

## Organização do território físico

| Escala de ambiente | Referências encontradas | Restrições |
|---|---|---|
| Ossatura de Golzdov | Crânio oriental, asa direita, coluna e costelas antigas, cauda além do Abismo | Asa direita não indica leste; coluna e costelas sem locais individualizados |
| Montanhas de Thargrid | Maciço, picos nevados, escarpas, cavernas e vales altos | Sem altitude, distância, coordenadas ou jurisdições cartografadas |
| Florestas | Eldroth ocupada, Ironwood ranger, bosques gnômicos dispersos | Parentesco e resistência não provam continuidade entre os bosques |
| Terras agrícolas e secas | Caatinga, pradarias litorâneas, campos agrícolas hobbits | Clima e posição de Grama-Cortada não definidos |
| Rio e Abismo | Rio Ancestral, ilha do Templo da Lua, queda e margens do Abismo | Sem nascente, afluentes, trecho exato da ilha ou travessia conhecida |
| Costa e ilhas | Penhascos de Portomonte, arquipélagos tortles/tabaxis, cavernas costeiras Kuo-Toa | Sem nomes e coordenadas de ilhas ou distribuição de entradas |
| Oceanos | Mar de Sangue, profundezas dos Abissais, águas azuis, recifes/cânions submarinos | Fronteira azul/vermelha **móvel**; Abissais marinhos **não são demônios** |
| Subsolo | Cidades anãs nas cavernas de Thargrid, enclaves svirfneblin, forjas quentes e ossos fossilizados | A existência de galerias não prova sistema subterrâneo continental |

### Evidências do manuscrito

- **Hack pp. 2, 4, 5, 9:** ossatura ancestral, relevo de Garganta e referências à coluna/costelas.
- **Hack pp. 6, 12, 13:** Thargrid, altitude, neve, gigantes do gelo, rocha e fogo, cidades anãs.
- **Hack pp. 5, 6, 18, 20:** Eldroth, Ironwood e a distribuição dispersa de gnomos da floresta.
- **Hack pp. 5, 12, 18–19:** Caatinga, pradarias da Costa Sul e subsistência hobbit.
- **Hack pp. 4–6, 8:** Rio Ancestral, ilha lunar, Abismo e margens.
- **Hack pp. 5, 14–15, 24:** ilhas, penhascos, Abissais marinhos, cidades submarinas de tritões/sereias e limite móvel das águas.
- **Hack pp. 12–13, 20:** profundidades anãs e dos gnomos svirfneblin.

## Doze perguntas de macrogeografia que permanecem abertas

1. Qual é o ambiente natural de Shadar-Riverie?
2. Qual é o clima e relevo do Condado de Grama-Cortada?
3. Onde começam as nascentes e quais são os afluentes do Rio Ancestral?
4. Qual é a divisa ou relação física entre Ironwood e Eldroth?
5. Os sistemas subterrâneos de Thargrid e dos ossos fósseis se conectam?
6. Quais ilhas tortles e tabaxis podem ser individualizadas no mapa?
7. Onde ficam as cidades dos tritões e sereias?
8. Como descrever a fronteira variável entre águas rubras e azuis sem fixá-la indevidamente?
9. Quais fontes de água da Caatinga foram aprovadas?
10. Existe passagem praticável entre o Abismo e a cauda?
11. Como distribuir cavernas Kuo-Toa e cidades submarinas sem uni-las?
12. Qual a escala e profundidade da cabeça submersa de Golzdov?

## Interface e metodologia

O Pages mantém o modo **Visão geral do continente**. O novo bloco **Grandes ambientes da Carcaça** fica abaixo da geografia física e permite alternar entre quatro vistas: **Famílias de ambientes**, **Cobertura por região**, **Relações ambientais** e **Questões pendentes**. Um inspetor mostra fonte, categoria, setor e atalho para o lugar já documentado na árvore.

A matriz apresenta *quantidade de referências*, não quantidade de biomas existentes. A ausência de referência à ecologia de Shadar-Riverie **não** significa que a capital não possua paisagem natural; significa que não podemos caracterizá-la ainda.

A classificação por famílias é editorial, não uma pretensa ciência climática inventada para o mundo. **Não acrescentar automaticamente flora, fauna, recursos, aldeias, rotas ou regras DW neste ciclo.**

### Arquivos

- `data/atlas/macroambientes-ciclo35.json` — inventário de habitats, vínculos e dúvidas.
- `site/atlas/macro-environments.mjs` — conferência de fonte, lugares e setores.
- `site/atlas/macro-environments-ui.mjs` — interface interativa.
- `site/atlas/index.html` — integração da nova camada com o Atlas.
- `tests/atlas-macro.test.mjs` — testes de integridade e salvaguardas.
- `.github/workflows/publicar-atlas-pages.yml` — publicação automática do JSON.

## Próximo passo macro

Completar o **registro de interfaces e fronteiras ecológicas/históricas** que ainda não se transformaram em assentamentos concretos: contatos entre florestas, áreas de influência marinha, limites do Mar de Sangue, águas continentais e reinos subterrâneos. A aprovação de novos limites, passagens ou marcos exige decisão do autor, sem preenchimento automático das lacunas.

Atlas: https://pedromaintenance.github.io/monstros-carcaca/atlas/
