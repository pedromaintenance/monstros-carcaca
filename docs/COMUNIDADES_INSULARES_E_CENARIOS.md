# Comunidades insulares da Costa Sul e cenários de Dungeon World

## 1. Conteúdo da lore, sem acréscimos silenciosos

A `Ambientação - A Carcaça - Visão Geral.txt` registra que **tortles e tabaxis habitam ilhas ao redor da Costa Sul**, que cada ilha possui **tradições monásticas próprias**, que os povos se defendem com honra e disciplina, que viajam sazonalmente para coletar histórias e recursos e que muitos trabalham como marinheiros. A ambientação também os associa à resistência aos ataques kuo-toa e abissais marinhos.

**O que não sabemos:** ilhas e portos nomeados, quantidade de comunidades, presença simultânea de ambos os povos em cada ilha, população, alimentação, água potável, modelos de habitação, reprodução, rotas e volumes de comércio, juramentos, templos ou número de combatentes.

Por isso, `lugar:ilhas-costa-sul` e `assentamento:comunidades-insulares-costa-sul` são **registros coletivos**. Não representam uma ilha individual inventada, uma única ordem monástica ou um assentamento DW completo.

## 2. Ecossistema e indexação

O novo objeto possui `natureza:conjunto_de_comunidades` e `tipo_dw.classificacao:null`. Os três rótulos Carcaça documentados para esse conjunto são:

- `tradicoes_monasticas_insulares`: costumes de cada ilha, sem presumir uma tradição uniforme;
- `defesa_insular_disciplinada`: defesa organizada culturalmente, sem atribuir categoria de Defesas DW;
- `rotas_sazonais`: viagens regulares por histórias e recursos, sem calendário ou trajetos conhecidos.

Os grupos `povo:tortles-ilhas-costa-sul` e `povo:tabaxis-ilhas-costa-sul` são **identidades regionais de indexação**, não prova de que formem um só assentamento político. `fluxo:viagens-sazonais-comunidades-insulares` representa circulação documentada; destino desconhecido permanece `null`. Não se presume comércio com Portomonte.

## 3. Quatro movimentos DW como hipóteses, não eventos

Inspiramo-nos nas regras `Updating the Campaign Map` do [Dungeon World SRD](https://www.dungeonworldsrd.com/gamemastering/the-world/), que distinguem situações de necessidade, comércio bloqueado, captura de recursos e auxílio entre steadings. As regras são **condicionais**, não um mecanismo automático de evolução do cenário.

| Movimento | Situação hipotética | Condições ainda não confirmadas |
|---|---|---|
| **Want** | Falha na purificação da água de Portomonte | O rito precisaria falhar e a necessidade resultante não ser atendida |
| **Trade** | Bloqueio de uma rota costeira | Identificar rota e produto; não sabemos quais bens são negociados |
| **Capture** | Outra força assume controle do acesso à água purificada | Confirmar mudança real de controle, detentor e se há recurso com tag DW |
| **Aid** | Socorro entre Portomonte e uma ilha | Exigiria comunidade individualizada, juramento `Oath`, ataque e Defesas DW; nada disso está estabelecido |

A aplicação concreta de `Aid` não é possível sobre o registro coletivo das ilhas, que **não é uma steading DW individualizada**. Isso é uma restrição expressa nos cartões.

Todas as condições são prévias à aplicação, não acontecimentos passados. A hipótese usa `estado:hipotese_nao_acontecida` e `mutacao_canonica:false`. As opções de resultado ficam registradas como orientações ao mestre.

## 4. API e bloqueio de mutação canônica

O pacote em `dist/carcaca/settlement-scenarios.json` é derivado de `cenarios/assentamentos/costa-sul.json`. O manifesto o inclui, e `schemas/cenario-assentamento.schema.json` exige explicitamente `mutacao_canonica:false`.

```js
import {createCarcacaAtlas,previewSettlementScenario} from "./src/carcaca-client.mjs";

const atlas = createCarcacaAtlas({baseUrl:"./dist/carcaca"});
const cartoes = await atlas.searchSettlementScenarios({movimentoDw:"Want"});
const previa = previewSettlementScenario(cartoes[0]);
console.log(previa.condicoes_pendentes);
```

Mesmo que o mestre informe `condicoesConfirmadas`, a API não modifica tags de prosperidade/população/defesas, nem arquivos, nem histórico de campanha. Essa separação foi testada. Um eventual **sistema de saves** será produto próprio, não parte da lore estática.

## 5. Próximos passos

1. Curar uma ilha específica **somente após existir nome, história e localização fundamentados**; aí decidir se faz sentido atribuir categorias DW.
2. Refletir sobre redes de ajuda e abastecimento entre comunidades e locais rituais: água, comida, trabalho, consumo e resíduos, sem preenchimentos automáticos de lacunas.
3. Preparar um registro de eventos de campanha separado de `curadoria/`; nele, o mestre poderia futuramente autorizar a aplicação de movimentos DW.
4. Expandir o atlas para outros habitantes costeiros e lugares, sem assumir que a oposição a Daegon define toda a cultura de cada povo.

**Fontes primárias:** `Ambientação - A Carcaça - Visão Geral.txt`; Dungeon World SRD, `The World`, https://www.dungeonworldsrd.com/gamemastering/the-world/.
