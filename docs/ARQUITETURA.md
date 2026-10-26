# Arquitetura de dados — Carcaça

## Contrato de leitura v1

O diretório \`dist/\` é um snapshot estático em UTF-8 e JSON válido; pode ser servido em GitHub Pages, CDN ou empacotado num jogo offline.

- \`dist/manifest.json\`: versão, fontes, licenças e endereço relativo dos segmentos.
- \`dist/catalog.json\`: registros resumidos para listar, pesquisar, paginar e filtrar sem carregar estatísticas.
- \`dist/indexes.json\`: índices invertidos \`by_type\`, \`by_cr\`, \`by_edition\`, \`by_source\` e \`by_name\`. Cada entrada contém IDs, não cópias de monstros.
- \`dist/creatures/{source-id}.json\`: um segmento por fonte. Armazena as estatísticas e características completas fornecidas pela fonte.
- \`src/client.mjs\`: leitor desacoplado de runtime; usa \`fetch\` injetável e cache por segmento.

## Identidade

A chave \`id\` é **imutável** dentro de uma fonte e edição: \`{fonte}:{edição}:{id-original}\`, normalizado. O campo \`key\` agrupa nomes, mas **não identifica uma variante**. Por exemplo, duas criaturas "Aboleth" de fontes e edições diferentes têm IDs diferentes.

## Separação de camadas

\`\`\`text
FONTE / LICENÇA
  └─ CRIATURA ORIGINAL (edição + variante)
       ├─ classification (tipo, tamanho, ambiente)
       ├─ challenge (CR, XP)
       ├─ stats (CA, PV, atributos, movimento, perícias)
       ├─ features (ações, traços, reações)
       ├─ lore (texto da fonte + formato)
       ├─ carcaca (curadoria regional, facção, papel, cânone)
       └─ games (overrides específicos dos consumidores)
\`\`\`

**Importante:** \`carcaca.canon = false\` nas importações externas. Uma criatura não passa a fazer parte do cânone só por existir no banco. Os campos de adaptação devem ser curados à parte para não desaparecerem numa sincronização.

## Consumidor Peren

Peren já possui \`data/monstros.json\` com \`id=mob-...\`, \`hp\`, \`ataque\`, \`defesa\`, \`xp\`, \`ouro\`, \`nivel_jogo\`, \`icone\` e \`drop_tipo\`. Esses valores são balanceamento próprio, **não** traduções diretas das fichas de D&D.

Use \`toPerenDraft\` do cliente para obter uma proposta com esses campos em \`null\` quando desconhecidos; **não sobrescreva** a base jogável sem curadoria. A associação com criaturas existentes deve ser feita via mapa de aliases, nunca apenas por \`id\` semelhante.

## Evolução

- Versão do esquema independente da versão do banco.
- Referências (IDs) internas em vez de cópias duplicadas nos índices.
- \`2024\` e \`2014\` coexistem.
- Sem dependência de SAP, navegador ou Phaser: apenas JSON e um cliente JS ESM.
- Arte, tokens e retratos somente com licença explícita e créditos; nenhum arquivo de arte foi importado automaticamente.
