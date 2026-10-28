# A fronteira que negocia — Caatinga e Costa Sul

**Estado:** propostas narrativas, não fatos canônicos. **Ciclo:** povoamento regional III. A Caatinga possui moradores, memória da Guerra de Nove Anos contra os kuo-toa e conflitos com as pradarias; a Costa Sul possui Portomonte, a agricultura viabilizada por água purificada pelo templo de Deméter, e comunidades insulares viajantes. O Hack inspira práticas e tensões, **não transforma todos os orcs em agressores nem atesta comércio direto**.

## Um cotidiano antes da batalha

- **Boca do Pano Pardo**, caravana móvel: durante a negociação, as armas ficam fora do pano e pessoas que não leem recebem contratos explicados em voz alta.
- **Varanda da Água Retornada**, pátio agrícola hipotético na área de Portomonte: as pessoas cuidam de canteiros, ferramentas e acesso à água **para lavoura**, sem declarar que a purificação fornece água para beber.
- **Três Pedras da Hospitalidade**, abrigo provisório: visitantes encontram regras de acolhimento que não dependem de sobrenome, mas limitadas por provisões reais.
- **Escada das Cordas Soltas**, transbordo costeiro hipotético: trabalhadores registram a condição da carga para impedir apreensões abusivas. Não é entrada conhecida de Portomonte.
- **Roda das Histórias que Não Cabem**, reunião itinerante: relatos tortles e tabaxis podem encontrar memórias orcs sem pressupor ilha específica, rota já existente ou coabitação.

Os cinco pontos acima não existem no atlas factual e **não possuem localização geográfica estabelecida**.

## Quem vive nesses encontros

| Personagem | Origem / papel | Posição e tensão |
| --- | --- | --- |
| **Nala Duas-Balas** | Caatinga, armeira já proposta no ciclo anterior | Precisa alimentar aprendizes sem armar futuros saqueadores |
| **Tiru das Trilhas Curvas** | Caatinga, mensageiro já proposto | Não deseja entregar o caminho dos abrigos |
| **Borr de Olho Seco** | Caatinga, guia já proposto | Conhece rotas que também foram usadas para atacar |
| **Gema da Falésia** | Costa Sul, agricultora proposta | Defende hospitalidade, mas não inventa potabilidade da água agrícola |
| **Antera dos Lacres Claros** | Costa Sul, intérprete proposta | Lê contratos suspeitos antes que eles escravizem alguém |
| **Mestre Córima do Casco Verde** | Tortle viajante proposto | Pode preservar memórias sem revelar um mosteiro |
| **Sahá de Rota Nenhuma** | Tabaxi viajante proposta | Desenha mapas incompletos para proteger lugares |
| **Mara das Duas Tigelas** | Cuidadora costeira proposta | Hospitalidade tem custo material, mesmo sendo um valor profundo |
| **Nilku das Marés Discutidas** | Kuo-toa dissidente hipotético | Não quer que um culto determine a sorte de todas as pessoas de seu povo |

Todos são indivíduos, não representantes automáticos de uma espécie, culto ou cidade.

## Cinco pactos que podem dar errado

1. **Direito à Primeira Tigela:** socorro básico sem exigir identificação, sem prometer água ou alimento ilimitados.
2. **Ferragem com Destino Declarado:** oficinas negociam responsabilidade pelo destino informado de ferramentas e armas.
3. **Lacres Conferidos em Voz Alta:** contratos são lidos com testemunhas antes de uma carga ser apreendida.
4. **Hospitalidade sem Mapa:** pessoas podem oferecer abrigo sem divulgar a posição de suas comunidades.
5. **Testemunho sem Vingança:** versões da Guerra de Nove Anos são ouvidas, não reduzidas a uma narrativa oficial única.

Os pactos não estão vigentes no cânone. Cada um possui benefícios, custos, interpretações conflitantes e modos de fracasso no JSON.

## Comércio, informação e deslocamento

Seis fluxos **propostos e condicionais** ligam ferragens, sementes, recipientes, relatos de viagem, pedidos de acolhimento e testemunhos de ritos costeiros. **Não** existe comprovação de volumes, preços, saída de produtos de Portomonte, calendário de caravanas ou caminho desenhado. Os fluxos são oportunidades de campanha e não relações comerciais cadastradas como fato.

A guerra regional e os ataques sacrificiais kuo-toa/abissais marinhos constam das fontes, mas **um ataque específico a Portomonte não foi estabelecido**. Abissais marinhos não são demônios do Abismo.

## Seis cenas com repercussões possíveis

**Duas medidas, nenhuma resposta.** Um visitante precisa de água para beber e alguém confunde água de lavoura purificada com potável. Quem arrisca prometer uma coisa que não sabe?

**A encomenda que não assina.** Uma encomenda financia o próximo dia da feira, mas o comprador não revela o destino das armas.

**O caminho que não pode ser lembrado.** Um mapa pode salvar uma família ou revelar seu refúgio.

**O hóspede que parece inimigo.** Um kuo-toa rejeitado por seu próprio culto pede hospitalidade, mas não existe prova de que não seja um espião.

**A carga de alguém que não chegou.** Um contrato de transporte inclui cláusula ambígua de apreensão e o transportador desapareceu.

**O nono testemunho.** Um relato insular contradiz uma lembrança da Guerra de Nove Anos e reabre disputa histórica.

Cada cena traz figuras, abertura cotidiana, situação de ruptura, opções e consequência **condicional** caso os personagens não ajam.

## Três tramas de campanha

**A água que tem dois nomes:** saber qual água serve à lavoura não é saber qual pode ser bebida. A negociação exige reconhecer limites e custos do acolhimento.

**A ferramenta que voltou como arma:** um objeto de uso duplo conecta reparos, contratos, possível contrabando e acusações potencialmente falsas.

**Nove ecos de uma guerra:** a memória da guerra contra os kuo-toa é posta em diálogo com tortles, tabaxis e um possível dissidente kuo-toa, sem apagar conflitos nem impor paz fácil.

## Arquivos e consultas

A fonte editável é `data/propostas/fronteira-caatinga-costa-sul-hack.json` e a distribuição é `dist/carcaca/frontier-caatinga-costa-sul.json`. Índices: `frontier-caatinga-costa-sul-indexes.json`.

```javascript
const fronteira=await atlas.getFrontierCaatingaCostaSul();
const locais=await atlas.searchFrontierEntities({tipo:"encontros"});
const personagens=await atlas.searchFrontierEntities({tipo:"pessoas",regiaoId:"regiao:costa-sul"});
const agua=await atlas.searchFrontierEntities({query:"água"});
const visita=await atlas.getFrontierEntity("fronteira:cena:hospede-sem-nome");
```

A integração não cria cidades oficiais, não altera os registros `curadoria/assentamentos` e não escreve eventos nos estados das campanhas. `aprovacao_autoral:false` continua vigente.
