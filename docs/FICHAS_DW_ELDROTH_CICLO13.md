# Ciclo XIII — Fichas mecânicas de Dungeon World: Eldroth

**Estado:** 8 fichas propostas, nenhuma aprovada ou canônica. **Escopo:** criaturas hipotéticas desenvolvidas no Ciclo XII; não introduz ocorrências, populações, filiações, encontros realizados ou acontecimentos históricos.

## Fundamento: responder à ficção, não converter o ND

A pergunta central do procedimento [*Making Monsters*, Dungeon World SRD](https://www.dungeonworldsrd.com/monsters/) é: **que organização, porte, proteção, meios de ataque e propriedades decorrem desta criatura como imaginada?**

Valores base utilizados nesta implementação:

| Organização proposta | PV base | Dano base |
|---|---:|---|
| Horda | 3 | d6 |
| Grupo pequeno | 6 | d8 |
| Solitário | 12 | d10 |

Os termos horda/grupo/solitário são **hipóteses de comportamento no encontro**, não dados de distribuição populacional na Carcaça. O porte diminuto aplica `−2` ao dano e alcance mão; grande soma `+4 PV` e `+1` dano. Defesa física simples vale zero; couro espesso vale 1 de armadura. A escolha *ardiloso* reduz um passo do dado (d10→d8, d8→d6, d6→d4); armas pequenas ou fracas também reduzem um passo. Dano nunca fica abaixo de 1 após a rolagem. Não se trata de regras inéditas do Hack Carcaça; é uma aplicação delimitada do procedimento do Dungeon World SRD, com termos de saída adaptados ao projeto.

A função de cálculo `scripts/calcular_monstros_dw.py` reconstrói as oito fichas a partir das escolhas do JSON e impede números inseridos manualmente sem a justificativa do procedimento. Para os sete combatentes, `ficha_dw.estado=proposta_mecanica_nao_aprovada`. Para o fungário, `sem_estatisticas_por_escolha_ficcional`; isso segue a seção [*Monsters Without Stats*](https://www.dungeonworldsrd.com/monsters/), pois nem toda ameaça oferece um corpo que faça sentido derrotar por dano.

## Oito respostas individuais — uma ficha por criatura

| Criatura | Organização | Porte | Defesa | Ajustes escolhidos | Resultado |
|---|---|---|---|---|---|
| **Coruja do Eco Emprestado** | Solitário | Miúdo | Carne | Ardiloso: redução d10→d8; miúdo −2, magia e trapaça como tags | **12 PV / 0 Arm / d8−2**, mão |
| **Besouros da Casca Riscada** | Horda | Miúdo | Exoesqueleto (couro) | Miúdo −2; mandíbulas fracas d6→d4 | **3 PV / 1 Arm / d4−2**, mão |
| **Cardos que Bebem Cinza** | Grupo | Pequeno | Carne/folhas | Ardiloso d8→d6; espinhos fracos d6→d4 | **6 PV / 0 Arm / d4**, corpo a corpo |
| **Micélio das Vozes Partidas** | Horda apenas descritiva | — | — | Não se cria um corpo combatente: resolver por investigação ecológica | **Sem estatísticas** |
| **Cervo dos Galhos Invertidos** | Solitário | Grande | Couro | Porte +4 PV / +1 dano; força +2 dano; magia e adaptação | **16 PV / 1 Arm / d10+3**, corpo a corpo/alcance |
| **Escrivão da Folha Lacrada** | Solitário | Médio | Carne | Ardiloso d10→d8; inteligente, furtivo, mágico; ataque de selo próximo | **12 PV / 0 Arm / d8**, corpo a corpo/perto |
| **Andarilho de Sepultura Negada** | Solitário | Médio | Carne | Ardiloso d10→d8; sustentação não biológica +4 PV, aterrador | **16 PV / 0 Arm / d8**, corpo a corpo |
| **Cão de Esporos do Limiar** | Grupo | Médio | Couro | Adaptação: esporos defensivos como qualidade, sem bônus numérico arbitrário | **6 PV / 1 Arm / d8**, corpo a corpo |

**Detalhe de regra:** `d4-2` ou `d8-2` não representa dano negativo: aplica-se mínimo de 1 no total final, conforme procedimento do DW. A palavra “armadura” representa proteção mecânica, não prova que uma criatura usa armadura fabricada.

### 1. Coruja do Eco Emprestado

**Instinto preservado:** conservar o último som e devolvê-lo para corroer a certeza das testemunhas. A organização solitária gera d10/12 PV, o tamanho miúdo reduz o dano em 2 e o foco no engano reduz o dado a d8. O ataque físico é uma bicada de alcance mão, mas os três movimentos que mais importam continuam **Eco que Acusa**, **Silêncio de Ninho** e **Voo sem Testemunha**. Não é um espião confirmado de Sylara.

### 2. Besouros da Casca Riscada

Um inseto individual é pequeno e frágil; uma horda pode transformar madeira em pista ambígua. O ataque de mandíbulas é fraco, não um golpe cinematográfico. O 1 de armadura pressupõe a carapaça resistente **somente para esta versão proposta**. Sua função como decompositor não confere moralidade nem lealdade à resistência.

### 3. Cardos que Bebem Cinza

A planta pode ferir quando tocada, mas o maior perigo da cena é o risco de destruir o plantio sob falsa suspeita de contaminação. Por isso a ficha prioriza efeito ambiental, ataque fraco e a tag ardiloso para reduzir a importância do dano. A luta não é o único — nem o melhor — modo de encerrar o encontro.

### 4. Micélio das Vozes Partidas

**Sem PV, Armadura e Dano por escolha de design.** O fungário é uma rede cujo perigo ficcional está em transmitir palavras incompletas e criar confusão, não em agir como um adversário individual. “Horda” é um índice organizacional descritivo herdado de XII, mas **não** gera os 3 PV e o d6 padrão nesta ficha. Suas três ações podem ser acionadas pelo mestre como movimentos ficcionais. Investigar um testemunho, preservar o solo ou interromper uma reação em cadeia mudam a situação mais que acertar um fungo com uma espada.

### 5. Cervo dos Galhos Invertidos

A galhada de tamanho grande justifica a tag alcance e dano de investida. Sua hostilidade é **condicional** à proteção dos filhotes; o mestre deve mostrar sinais de defesa e oportunidades de recuo, não tratar a espécie inteira como fera assassina. A magia de caminhos circulares é qualidade ficcional, não atalho para inventar dano que ignora armadura.

### 6. Escrivão da Folha Lacrada

É feérico, mas não tem filiação comprovada à corte. A capacidade de impor pactos aparece nos movimentos originais do ciclo XII. O **Fio de selo rasgado**, ataque de papel à distância curta, é uma **adição mecânica nova e explicitamente proposta** para uso de combate, passível de rejeição pelo autor. Não se infere por isso uma classe, origem planar ou novo tipo cosmológico.

### 7. Andarilho de Sepultura Negada

A existência sobrenatural justifica +4 PV, não uma ligação automática a Damaris. A defesa é de carne/tecido, pois não existe evidência de ossatura ou placa blindada. O movimento central confronta memórias e registros do morto, sem declarar quem de fato morreu.

### 8. Cão de Esporos do Limiar

Um pequeno grupo com mordida de contenção e pele resistente. Esporos não causam dano adicional por decreto e não há ataque mágico embutido. O melhor resultado de uma cena pode ser oferecer passagem alternativa e não transformar um animal territorial em instrumento humano.

## Como editar e validar

Arquivos:
- `data/propostas/eldroth-fichas-dw-ciclo13.json` — oito fichas, decisões, movimentos herdados e estados.
- `schemas/eldroth-fichas-dw-ciclo13.schema.json` — contrato de dados.
- `scripts/calcular_monstros_dw.py` — calculadora do procedimento.
- `scripts/validar_curadoria.py` e `tests/test_monstros_dw_xiii.py` — integridade, referências e reprodutibilidade.
- `dist/carcaca/eldroth-dw-statblocks.json` e `dist/carcaca/eldroth-dw-statblock-indexes.json` — exportações geradas.

Exemplo de consumo:

```js
const atlas=createCarcacaAtlas({baseUrl:"https://raw.githubusercontent.com/pedromaintenance/monstros-carcaca/main/dist/carcaca"});
const ficha=await atlas.getEldrothDWStatblock(
  "ecologia-xiii:ficha:coruja-do-eco-emprestado"
);
const semCombate=await atlas.searchEldrothDWStatblocks({modo:"sem_estatisticas"});
const magicos=await atlas.searchEldrothDWStatblocks({tag:"magico"});
```

A busca filtra nome/instinto, Tipo Carcaça proposto, organização DW, modo, porte, tags e ID da origem em XII. Os dados não são incluídos em `dist/carcaca/creatures.json`: o catálogo das sete fichas curadas continua sem novas entradas.

## Decisões ainda sujeitas à revisão do autor

1. Porte exato da Coruja e do Cervo; só com arte ou descrição autoral será possível decidir se as dimensões sugeridas servem às campanhas.
2. Autonomia, corpo e combate do Escrivão; o novo ataque mágico não foi descrito na lore prévia.
3. Naturalidade e armadura da carapaça dos Besouros; coerência ecológica depende de revisão.
4. Manter o Micélio sem combate ou criar uma manifestação individual distinta, se a campanha precisar de um adversário físico.
5. Testar as oito fichas em sessões concretas, levando em conta espaço, perigo ficcional, efeitos sem dano e consentimento de negociação antes de alterar equilíbrio.

**Próximo horizonte (XIV):** criar exemplos de encontros testáveis para estas fichas, com gatilhos, telegráficos de perigo, reação da ecologia, possibilidade de retirada e variantes de dificuldade sem distorcer números ou narrar resultados canônicos.
