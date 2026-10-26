# Integração com Peren, o Bruxo

O repositório \`pedromaintenance/peren-o-bruxo\` já mantém **222 monstros** em \`data/monstros.json\`. Esses valores são específicos da jogabilidade (HP, ataque, defesa, ouro, drop), e muitos têm nomenclatura portuguesa.

## Leitura sem substituir o jogo

\`\`\`js
import { createBestiary, toPerenDraft } from "./src/client.mjs";

const db = createBestiary({
  baseUrl: "https://raw.githubusercontent.com/pedromaintenance/monstros-carcaca/main/dist"
});
const lista = await db.search({ query: "aboleth", limit: 10 });
const ficha = await db.get(lista[0].id);
const rascunho = toPerenDraft(ficha);
// rascunho.hp/ataque/defesa/etc ficam null até a aprovação de balanceamento.
\`\`\`

## Migração responsável

1. Não apagar nem regravar \`data/monstros.json\`.
2. Manter mapa de aliases explícitos (ex.: \`mob-carnical\` e nomes originais em inglês).
3. Expor opção no jogo de **consultar** a ficha original de D&D, quando licença permitir.
4. Curar de forma independente parâmetros de combate, nível do jogo, bioma e drops.
5. Versões SRD 2014/2024 devem ser selecionáveis e não combinadas.

Recomendação: uma integração por leitura em tempo de desenvolvimento (geração de assets JSON versionados). Evitar dependência de internet durante a partida.
