# Ciclo XII — Ecologia Monstruosa de Eldroth, Vandar e Ironwood

**Estado editorial:** propostas, sem aprovação autoral e sem efeitos automáticos sobre o cânone. **Criaturas registradas:** 8 rascunhos ecológicos, **não** oito monstros canonizados. O catálogo curado de sete fichas permanece intocado.

## Por que um monstro aparece?

O ciclo XI já descreveu pessoas, abrigo, trabalho, luto, medo, circulação de informações e o custo de manter uma resistência viva. O ciclo XII liga a ficção monstruosa às mesmas necessidades concretas. A floresta não se divide em “bichos bons da resistência” e “bichos maus da Corte”: a invasão, a corrupção, a sobrevivência animal e a interpretação das testemunhas formam causas diferentes que os personagens precisam investigar.

### Separação geográfica

**Eldroth:** floresta ocupada sob Lady Sylara Nightwhisper. Quatro fenômenos ecológicos e o Escrivão da Folha Lacrada foram posicionados apenas como possibilidades nesse escopo.

**Vandar:** ruínas sob Lord Damaris Blackthorn. O Andarilho de Sepultura Negada é personagem não canônico; não presumir que todos os mortos-vivos respondam a Damaris, embora o domínio dele sobre as ruínas esteja documentado.

**Ironwood:** fortaleza de patrulheiros e druidas de Elara Stormoak, ao sul de Thargrid. Os Besouros da Casca Riscada e o Cão de Esporos do Limiar têm habitats **hipotéticos** associados a locais **propostos** no ciclo XI. Não foram registrados como espécies confirmadas da fortaleza; nem foi Ironwood geocodificada como um bairro de Eldroth.

## Oito monstros — instintos e movimentos autorais

| Criatura proposta | Tipo Carcaça proposto | Instinto ficcional | Distinção ecológica |
|---|---|---|---|
| **Coruja do Eco Emprestado** | Fera sobrenatural | Guardar e devolver o último som ouvido | Um canto repetido não prova espionagem de Sylara |
| **Besouros da Casca Riscada** | Fauna | Decompor madeira morta e proteger a postura | Ranhuras naturais podem ser confundidas com sinais clandestinos |
| **Cardos que Bebem Cinza** | Flora | Retomar solos perturbados | A presença de fuligem não justifica automaticamente uma queimada |
| **Micélio das Vozes Partidas** | Flora | Espalhar sinais entre madeira e fungos | Uma voz distribuída não comprova um correio da resistência |
| **Cervo dos Galhos Invertidos** | Fera sobrenatural | Proteger filhotes desviando perseguidores | Circularidade de trilhas não implica serviço feérico |
| **Escrivão da Folha Lacrada** | Feérico | Cobrar lembranças por promessas vagas | Não é automaticamente funcionário da Corte |
| **Andarilho de Sepultura Negada** | Morto-vivo | Encontrar testemunha da própria morte | Necromancia e direitos dos familiares continuam em disputa |
| **Cão de Esporos do Limiar** | Fera sobrenatural | Defender seu lugar de repouso | Não é cachorro oficialmente treinado de Ironwood |

Cada entrada inclui **três movimentos ficcionais autorais**, sinais de campo, função ecológica hipotética, perguntas sobre o que ainda não sabemos, três opções para interagir sem lutar e estado mecânico `pendente_do_procedimento_dw` com `pv:null`, `dano:null`, `armadura:null` e `nd_dnd:null`. As tags de organização (solitário, grupo, horda) são sugestões; não representam populações medidas ou fichas balanceadas.

## Seis encontros que continuam o ciclo XI

1. **Um Canto sem Ave** → cena `passaro-sem-canto`. Coruja e micélio confundem testemunhos. Primeiro investigar sons; não capturar uma criatura por suspeita.
2. **A Capa e o Faro** → cena `selo-na-capa`. Uma fera protege passagem diante de um tecido marcado; separar objeto e pessoa.
3. **A Pira Antes da Prova** → cena `viveiro-negro`. Cardos e fuligem desafiam a decisão de destruir o plantio.
4. **A Casca que Contou** → cena `aprendiz-do-mapa`. Besouros explicam sinais que o aprendiz toma por atividade militar.
5. **O Nome que Anda** → cena `despedida-sem-cadaver`. O morto-vivo não comprova o óbito registrado de ninguém.
6. **A Folha com Cláusula** → cena `pedido-de-desercao`. Uma barganha feérica pode converter a proteção em dívida.

Esses encontros têm três alternativas ao confronto, condição ficcional de abertura e possível consequência caso sejam ignorados. Nenhum deles **ocorreu**, mesmo que a cena anterior exista no banco de ideias.

## Quatro pressões ecológico-políticas

- **A Floresta que Parece Denunciar:** falsos alertas poderiam fragmentar uma rede de assistência.
- **A Pira que Destrói o Remédio:** interpretações ruins sobre o solo ameaçam a produção de alimento e plantas.
- **Sepulturas e Direitos:** a pressa para reconhecer mortos pode apagar desaparecidos e a vontade das famílias.
- **O Abrigo que Acusa o Animal:** converter todo bicho estranho em informante gera violência e mais vigilância.

São cenários **condicionais**, nunca impactos medidos: `medicao:null`, `periodo:null`, `ocorreu:false`.

## Frentes Dungeon World (não iniciadas)

**O Bosque que Informa sem Consentimento** — perigo de transformar suspeita ecológica em controle de nomes. Três presságios descrevem uma escalada possível da desconfiança à captura de informações. **Desastre proposto:** a própria rede de abrigo entrega dados que permitem sua perseguição.

**O Refúgio que Queima suas Sementes** — perigo de sacrificar as condições materiais de subsistência em nome da segurança. Três presságios propõem perda de cultivos, restrição de acesso e conflito interno. **Desastre proposto:** uma resistência protegida militarmente, mas incapaz de alimentar e acolher.

As frentes não têm presságios realizados (`pressagios_realizados:[]`) e não alteram `curadoria/frentes/`. Uma campanha poderá adotar e evoluir uma cópia em estado próprio, sem modificar a história comum.

## Arquitetura e consulta

**Fonte editorial:** `data/propostas/eldroth-ecologia-monstruosa-dw.json`  
**Schema:** `schemas/ecologia-monstruosa-xii.schema.json`  
**Saídas públicas geradas:** `dist/carcaca/eldroth-monster-ecology.json` e `eldroth-monster-ecology-indexes.json`.

A busca está disponível por categoria (`criaturas`, `encontros`, `pressoes`, `frentes`), Tipo Carcaça, escopo, criatura relacionada, cena original e texto sem exigir acentos:

```js
import {createCarcacaAtlas} from "./src/carcaca-client.mjs";
const atlas=createCarcacaAtlas({
  baseUrl:"https://raw.githubusercontent.com/pedromaintenance/monstros-carcaca/main/dist/carcaca"
});
const criaturas=await atlas.searchEldrothMonsterEcology({
  categoria:"criaturas",escopo:"eldroth"
});
const cenas=await atlas.searchEldrothMonsterEcology({
  categoria:"encontros",criaturaId:"ecologia-xii:criatura:coruja-do-eco-emprestado"
});
const frente=await atlas.getEldrothMonsterEcologyEntry(
  "ecologia-xii:frente:o-bosque-que-informa"
);
```

**Não misturar** esses oito rascunhos com `dist/carcaca/creatures.json`: esse arquivo mantém o conjunto curado anterior. Não há equivalência ND ↔ estatísticas DW; somente instintos e movimentos autorais estão disponíveis neste ciclo.

## Próximo ciclo sugerido: ficha DW verificável

Conduzir as perguntas de criação do Dungeon World **uma criatura de cada vez**, decidindo tamanho, organização, dano, PV, armadura, qualidade e tags com critério; documentar a origem de cada número. Em seguida, validar o equilíbrio em encontros simulados e apresentar fichas para aprovação autoral individual. A relação de uma espécie com Sylara ou Damaris deve ser uma decisão narrativa documentada, não um resultado automático da sua aparência.
