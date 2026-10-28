# A Caatinga habitada — ciclo de povoamento 02

**Status:** proposta narrativa, não cânone aprovado. **Âncora territorial:** `regiao:caatinga`.

A Caatinga não é uma terra de NPCs hostis agrupados por espécie. O Hack oferece outro retrato: um povo que conhece o calor, conserva relatos da **Guerra de Nove Anos contra os kuo-toa**, lembra alianças e pode discordar profundamente sobre como viver depois da guerra. O material autoral confirma dispersão de comunidades e conflitos com as pradarias, mas não registra nomes de aldeias, poços, safras, distâncias ou demografia. Este ciclo inventa **hipóteses sociais jogáveis**, sem registrar esses elementos como história factual.

## A região em cinco cenas permanentes

### O Poço Sem Bandeira
Aru insiste que ninguém paga pela primeira medida de água. A segurança oferecida por Iram, chefe de escolta, pode preservar vidas — e ao mesmo tempo transformar um direito comum em tributo. O poço não tem vazão ou potabilidade documentada; sua existência individual também é proposta.

### A Feira das Ferragens Trocadas
Nala, armeira, negocia ferramentas e armas. Consertar recipientes e instrumentos de plantio rende menos que uma encomenda militar sem destinatário. Uma arma vendida para proteger uma caravana pode reaparecer numa pilhagem costeira.

### O Pátio das Cabaças Lacradas
Satira organiza a contagem de recipientes de água. Um lacre intacto, porém, não prova que havia água no pote. Que parte do pânico de uma crise vem da falta de recursos, e que parte vem de números falsos?

### A Pedra dos Nove Silêncios
Rukhan conserva versões incompatíveis da Guerra de Nove Anos. Um dos nichos recorda uma trégua e um resgate entre antigos inimigos; parentes dos mortos querem apagá-lo. A guerra é documentada; o memorial e seus ritos são criações propostas.

### O Baixio das Sementes Guardadas
Paja preserva sementes e cadernos de safras fracassadas. Nada demonstra haver produtividade agrícola, fontes de água seguras ou uma safra vindoura. Guardar a última semente pode ser prudência — ou uma decisão cruel diante da fome atual.

## Cinco organizações com interesses diferentes

| Nome | Natureza | Posição |
| --- | --- | --- |
| Clã da Esteira Rachada | Famílias orcs | Primeira medida de água sem pagamento |
| Clã dos Nove Nós | Famílias marcadas pela guerra | Nenhum morto deve ser apagado da memória |
| Casa das Cinzas Lavadas | Abrigo multietnico | Proteção não depende de interrogatório |
| Ofício da Ferrugem Andante | Artesãos itinerantes | Contratos revelam responsabilidade de quem usa as ferramentas |
| Roda da Semente Oca | Guardiões de sementes e tentativas | A última semente não pode ser vendida sem consulta |

Esses agrupamentos **não representam todos os orcs** e não possuem filiação, território ou poder político canônico.

## Oito pessoas com vontade própria

**Aru**, guardiã de acesso; **Nala**, armeira cuidadosa; **Satira**, auditora das reservas; **Rukhan**, memorialista da guerra; **Borr**, guia dividido entre lealdades; **Paja**, guardiã de sementes; **Tiru**, mensageiro da fronteira; e **Iram**, chefe de escolta com objetivos próprios. Cada ficha de personagem no JSON contém desejo, medo, segredo possível, primeira aparição e referências a movimentos do Hack.

## Circulação sem transformar hipótese em mapa

São **seis conexões narrativas**, não estradas confirmadas: Poço↔Feira, Poço↔Pátio, Poço↔Memorial, Pátio↔Baixio, Feira↔Baixio e uma ligação **condicional** Feira↔Portomonte. A última é uma possibilidade de campanha; não comprova comércio direto, trajeto, rota fixa ou compra efetiva.

O dossiê também apresenta **quatro pontos de abastecimento propostos**, todos com origem, vazão e segurança não verificadas. Não foram atribuídos números de habitantes, toneladas, litros, preço de água ou tempo de viagem.

## Quatro conflitos que podem evoluir

1. **Quem é dono da primeira medida?** Aru e Iram precisam negociar proteção sem permitir que a água vire propriedade de uma escolta.
2. **Quem pode contar a guerra?** Veteranos escolhem entre memória plural e mobilização através da vingança.
3. **Ferragens para proteger ou saquear?** Uma encomenda alimenta a feira, mas talvez arme uma incursão costeira.
4. **O que guardar para quem ainda não nasceu?** A última semente revela a distância entre interesse coletivo e fome de hoje.

Existem **seis cenas prontas para jogar**, cada uma com acontecimento inicial, decisões dos personagens, revelação e consequência *condicional se não houver intervenção*. Nenhuma dessas cenas é um fato já ocorrido.

## Consulta técnica

Fonte: `data/propostas/caatinga-rede-social-hack.json`.

Dist: `dist/carcaca/caatinga-social-network.json` e `caatinga-social-indexes.json`.

```javascript
const caatinga=await atlas.getCaatingaSocialNetwork();
const crises=await atlas.searchCaatingaEntities({tipo:"conflitos"});
const agua=await atlas.searchCaatingaEntities({tema:"agua"});
const aru = await atlas.getCaatingaEntity("caatinga:pessoa:aru");
```

**Próximo desdobramento criativo:** aprofundar a rota condicional entre Caatinga e Costa Sul, dando vozes próprias às comunidades costeiras e distinguindo troca pacífica, defesa, refugiados, pirataria e ataques. Isso deve continuar como hipótese, sem fixar geografia sem fonte.
