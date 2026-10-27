# Integração das regras gerais — Hack Carcaça Dungeon World

**Ciclo:** 27/10/2026, após a quinta auditoria.
**Documento-fonte:** `Hack Carcaça Dungeon World(1).docx` (181 páginas, disponibilizado pelo autor).
**SHA-256:** `b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d`.

## O que foi integrado

- **33 tabelas DOCX** continuam registradas no inventário original, separando dez quadros narrativos, duas tabelas numéricas e **21 quadros de movimentos gerais**.
- **44 células/blocos** desses 21 quadros estão preservados integralmente em `data/lore/hack-carcaca-dw-quadros-integrais.json`. O arquivo não foi resumido.
- **22 unidades de regras** são derivadas sem reescrever os textos: oito movimentos básicos, treze movimentos avançados e o subsistema Servos.
- **RECRUTAR** e **MANDADOS PENDENTES** são duas unidades diferentes na **mesma tabela 30**. Ambos apontam para `quadro-geral-docx:30`, com intervalos de células próprios.
- **SERVOS** mantém em seu corpo as regras completas de **LEALDADE DOS SERVOS**, não apenas a rolagem de Lealdade.

## Separação de responsabilidades

| Camada | Arquivo | Responsabilidade |
| --- | --- | --- |
| Origem editável | `data/lore/hack-carcaca-dw-quadros-integrais.json` | Preservar os 44 blocos com índices de tabela e linha |
| Inventário | `data/lore/hack-carcaca-dw-tabelas-docx.json` | Identificar todas as 33 tabelas, inclusive as não mecânicas |
| Normalizador | `scripts/hack_movimentos_gerais.py` | Derivar 22 unidades sem alterar os textos |
| Distribuição | `dist/carcaca/hack-general-movements.json` | Entregar registros consultáveis aos clientes |
| Índices | `dist/carcaca/hack-general-movement-indexes.json` | Buscar por categoria, quadro, título, faixa e gatilho |
| Cliente | `src/carcaca-client.mjs` | API ESM somente leitura |
| Validador | `scripts/validar_curadoria.py` | Conferir correspondência exata entre células, quadros e movimentos |

O gerador é determinístico: `python scripts/gerar_indices_curadoria.py`; o comando `--check` detecta distribuição desatualizada.

## Consulta no jogo

```js
import {createCarcacaAtlas} from "./src/carcaca-client.mjs";

const atlas=createCarcacaAtlas({
  baseUrl:"https://raw.githubusercontent.com/pedromaintenance/monstros-carcaca/main/dist/carcaca"
});

// Recuperar uma unidade por ID
const recrutar=await atlas.getGeneralMovement("movimento-geral:docx-30");

// Verificar todas as unidades preservadas numa mesma tabela de origem
const partilhadas=await atlas.searchGeneralMovements({quadroId:"quadro-geral-docx:30"});
// => RECRUTAR, MANDADOS PENDENTES

// Buscar por nome, categoria e faixa literalmente presente na célula
const avancados=await atlas.searchGeneralMovements({categoria:"avancado"});
const com10mais=await atlas.searchGeneralMovements({faixa:"10+"});
const comLealdade=await atlas.searchGeneralMovements({query:"lealdade dos servos"});
const indice=await atlas.getGeneralMovementIndexes();
```

## Significado dos campos

- `texto_original` copia sem reescrita o corpo da célula do DOCX.
- `tabela_docx_indice` e `linhas_docx` são índices **zero-based**.
- `gatilhos_literais` e `marcadores_resultado_literais` apontam apenas linhas textuais detectáveis (`Quando`, `Com 10+`, `Com 7–9`, `Com 6 ou menos`); **não** são a decomposição semântica completa do movimento.
- A ausência de marcador `6-` não significa ausência de consequência; as regras gerais do hack continuam aplicáveis.
- `requisito_explicito:null` e `requisito_auditoria:"nao_inferido"` significam que o normalizador não atribuiu pré-requisitos ausentes, **não** que eles sejam dispensados.
- `estado:"transcricao_integral_sem_revisao_semantica"` indica que ainda há análise editorial pendente.
- `aplicacao_canonica:false` impede considerar que a transcrição alterou automaticamente o mundo, os personagens ou o estado da campanha.

## Núcleo estruturado de personagem e combate

Além dos movimentos, o projeto agora contém `data/lore/hack-carcaca-dw-regras-nucleo.json`,
distribuído como `dist/carcaca/hack-core-rules.json` e consultável por
`await atlas.getHackCoreRules()`.

Essa camada explicita as regras descritas nas páginas 26–33 e 39 do Hack:

- Rolagem de 2d6, interpretação de 10+, 7–9 e 6 ou menos.
- Os seis atributos e os valores iniciais `16, 15, 13, 12, 9, 8`, com a tabela de modificadores.
- Nível inicial 1 e **cinco movimentos próprios**. As origens Raça, Classe e Antecedente estão documentadas; **a quantidade exata de cada origem permanece `null` porque o trecho não a fornece expressamente.**
- PV máximos `20 + 5 × mod. CON`; Carga `8 + mod. FOR`.
- Danos conforme Periculosidade (`1d4` a `1d12`), redução contextual de Armadura, seis Debilidades.
- Descanso, recuperação e evolução mediante `Nível + 7` XP.

Os valores são referências **do texto-fonte**, não estatísticas atribuídas automaticamente a monstros nem regras impostas a saves.

```js
const regras = await atlas.getHackCoreRules();
const {personagens, evolucao} = regras;
console.log(personagens.pv_maximos.expressao_literal);
console.log(personagens.distribuicao_numerica_por_origem); // null: não inferido
console.log(evolucao.limiar_xp.literal);
```

## Próxima etapa de curadoria

Fazer uma revisão mecânica especializada em faixas de resultado, escolhas e custos, definindo um **modelo semântico adicional**, sem substituir o texto original. Em paralelo, continuar a transcrição integral dos movimentos de povo e classe além do piloto de doze movimentos, preservando a semântica obrigatória de **REQUER: X**.

O catálogo de regras não modifica automaticamente as **sete criaturas** ou os **três assentamentos** do atlas autoral, nem o acervo legado de **222 monstros de Peren**. Esse vínculo só deve ocorrer por uma etapa explícita de migração, após revisão e testes.
