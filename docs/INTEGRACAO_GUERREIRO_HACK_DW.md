# Primeiro grupo de Classe completo — Guerreiro

**Ciclo:** 27/10/2026. **Fonte:** `Hack Carcaça Dungeon World(1).docx` (manuscrito do autor; 181 páginas).  
**Origem SHA-256:** `b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d`.

## Escopo e evidência

A integração cobre os **77 movimentos** de **GUERREIRO** do manuscrito (âncoras de parágrafos DOCX **1047–1289**, índices zero-based), incluindo **137 opções** e **235 trechos** de corpo/opção/continuação. Não foram preenchidos movimentos que não estejam nessa região documental.

Dos 77 registros:
- **47** não têm `REQUER:` explícito no cabeçalho;
- **30** possuem `REQUER:`;
- **27** têm pré-requisito cuja grafia corresponde exatamente a um movimento encontrado no inventário, com referência ao ID original;
- **3** possuem condições que **não são** apenas um título de movimento e estão preservadas como expressões especiais.

A transcrição contém `texto_original`, `partes` (com índices dos parágrafos de origem), `opcoes`, `requisito_literal`, `requisito_estruturado` e o ID **já existente** no inventário de 632 movimentos. O catálogo não reescreve resultados de dados ou efeitos: o corpo original foi preservado.

## Os três REQUER especiais

| Movimento | Expressão literal | Estrutura candidata |
| --- | --- | --- |
| **Magia de Guerra** | `qualquer Movimento de Magia` | Uma categoria de movimento mágico, sem título fixo |
| **Passo Arcano** | `Surto de Ação e qualquer Movimento de Magia` | Conjunção de movimento específico **e** categoria de magia |
| **Tiro Arcano** | `Arma Favorita aplicada a um arco ou arma de projétil` | Movimento específico **com** condição sobre sua aplicação |

Estas são **interpretações literais pendentes de homologação**, não equivalências automáticas entre magia, armamento e movimentos. Um futuro criador de personagens precisará obter evidência da posse **e**, quando aplicável, das condições de uso. Um movimento recebido gratuitamente ainda exige `REQUER` (política geral do projeto).

## Proveniência, derivação e leitura

| Camada | Caminho |
| --- | --- |
| Fonte editável da transcrição | `data/lore/hack-carcaca-dw-guerreiro-integrais.json` |
| Inventário original preservado | `data/lore/hack-carcaca-dw-inventario-classes-requer.json` |
| Extrator reproduzível | `scripts/extrair_guerreiro_docx.py` |
| Indexador | `scripts/hack_movimentos_personagem.py` |
| Gerador de snapshots | `scripts/gerar_indices_curadoria.py` |
| Distribuição | `dist/carcaca/hack-warrior-movements.json` |
| Índices distribuídos | `dist/carcaca/hack-warrior-movement-indexes.json` |
| Cliente ESM | `src/carcaca-client.mjs` |

O inventário geral de **632 títulos** não foi substituído. Os 77 movimentos de Guerreiro receberam no inventário distribuído `texto_integral_disponivel:true` e `texto_integral_id`; os outros 555 continuam sem esse vínculo. O campo legado `texto_integral_curado:false` não foi promovido.

### Consulta JavaScript

```js
import {createCarcacaAtlas} from "./src/carcaca-client.mjs";
const atlas=createCarcacaAtlas({
  baseUrl:"https://raw.githubusercontent.com/pedromaintenance/monstros-carcaca/main/dist/carcaca"
});

const todos=await atlas.getWarriorMovements();                   // 77
const comOpcoes=await atlas.searchWarriorMovements({comOpcoes:true});
const pendentes=await atlas.searchWarriorMovements({tipoRequisito:"todos"});
const arma=await atlas.getWarriorMovement("movimento-classe:paragrafo-1047");
const dependencias=await atlas.getWarriorRequirementPreview(
  "movimento-classe:paragrafo-1120",
  {movimentosPossuidos:["movimento-classe:paragrafo-1047"]}
);
console.log(dependencias.habilitado_para_compra); // null: revisão exigida
```

`getWarriorRequirementPreview` produz diagnóstico **somente de leitura**, não concede movimentos ou altera fichas. Nenhuma criatura, assentamento, estado de campanha ou dado de Peren foi alterado.

### Reproduzir a extração a partir do DOCX original

```bash
python -m pip install python-docx
python scripts/extrair_guerreiro_docx.py "/caminho/Hack Carcaça Dungeon World(1).docx"
python scripts/validar_curadoria.py
python scripts/gerar_indices_curadoria.py --check
node --test tests/carcaca-client.test.mjs
```

O DOCX não é distribuído no GitHub; a extração versionada permite que a integração e as validações funcionem em CI sem acesso ao arquivo de 181 páginas.

## Estado e próximo lote

**Concluído:** transcrição integral documental, opções, continuidade, IDs, índices, testes de integridade e publicação.  
**Pendente:** revisão de equilíbrio/adjudicação ficcional, homologação de requisitos especiais e mecanismo de aquisição de personagens. O campo `aplicacao_canonica:false` continua obrigatório.

**Próximo lote natural:** **Bárbaro**, mantendo a mesma metodologia de extração e atualização do inventário, sem inventar os movimentos das demais classes.
