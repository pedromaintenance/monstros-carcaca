# Integração integral da classe Artífice

**Fonte:** Hack Carcaça Dungeon World(1).docx; SHA-256 `b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d`.

## Resultados da transcrição

**23 movimentos**, parágrafos DOCX **2672 a 2731** (zero-based), **32 opções**, **59 trechos documentais**, **7 REQUER diretos**. O próximo grupo é MERCENÁRIO, a partir do parágrafo 2736.

### Linhagens literais

- **ARTÍFICE → FEITO PARA ISSO** (um dependente);
- **ALQUIMISTA → BOM DEMAIS PARA DESPERDIÇAR, BEBA ISTO, BOMBA DE BOLSO** (três);
- **TRANSMUTAÇÃO ALQUÍMICA → TROCA EQUIVALENTE → ARMA HUMANA → AQUILO QUE VOCÊS CHAMAM DE MUNDO** (três dependências transitivas).

Todos os requisitos são literalmente documentados. As práticas de engenharia, medicina e culinária não são subordinadas a Artífice ou Alquimista sem `REQUER` no manuscrito.

**Correção autoral — resolvida em 27/10/2026:** o autor confirmou que *Alquimista Federal* era o nome anterior de **Arma Humana** e que havia permanecido por engano no corpo de **AQUILO QUE VOCÊS CHAMAM DE MUNDO**. A referência foi corrigida para **Arma Humana** no catálogo integral, sem alterar efeitos, opções, títulos ou a dependência mecânica já existente (`REQUER: Arma Humana`).

A versão do DOCX anexada ao projeto ainda contém o nome antigo. Portanto, `fonte_sha256` mantém o checksum dessa versão documental original, enquanto `correcoes_autorais` registra expressamente a emenda feita por confirmação do autor. O extrator aplica a mesma substituição pontual ao reprocessar essa versão, impedindo que a grafia obsoleta retorne. Quando o DOCX corrigido for disponibilizado, o inventário e os checksums poderão ser atualizados contra a nova versão.

### Arquivos distribuídos

- `data/lore/hack-carcaca-dw-artifice-integrais.json.gz`: fonte integral compactada em gzip;
- `scripts/extrair_artifice_docx.py`: extrator a partir do DOCX autoral, não distribuído;
- `dist/carcaca/hack-artificer-movements.json`: 23 movimentos em JSON legível;
- `dist/carcaca/hack-artificer-movement-indexes.json`: índices e raízes transitivas;
- `scripts/gerar_indices_curadoria.py`: gerador determinístico;
- `scripts/validar_curadoria.py`: testes de integridade;
- `src/carcaca-client.mjs`: API somente-leitura.

### Uso da API

```javascript
const moves=await atlas.getArtificerMovements(); // 23
const alquimicos=await atlas.searchArtificerMovements({raizDependencia:"movimento-classe:paragrafo-2700"});
const preview=await atlas.getArtificerRequirementPreview("movimento-classe:paragrafo-2703",{
  movimentosPossuidos:["movimento-classe:paragrafo-2700","movimento-classe:paragrafo-2702"]
});
// TROCA EQUIVALENTE está ausente;
// habilitado_para_compra permanece null.
```

O atlas **não homologa efeitos nem autoriza automaticamente aquisições**. Todos os movimentos possuem `aplicacao_canonica:false`.
