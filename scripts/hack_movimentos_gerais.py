"""Normalização derivada dos quadros integrais do Hack Carcaça DW.
Não reescreve o texto, não interpreta custos e não aplica efeitos canônicos.
"""
from __future__ import annotations

import re
import unicodedata
from collections import defaultdict

FAIXA = re.compile(r"^Com\s+(10\+|7[–-]9|6\s+ou\s+menos)\s*:?", re.I)
GATILHO = re.compile(r"^Quando\s+", re.I)


def _chave(texto):
    return unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode().lower()


def compilar_movimentos_gerais(origem, inventario):
    quadros = origem["quadros"]
    registro = {t["tabela_docx_indice"]: t for t in inventario}
    if [q["tabela_docx_indice"] for q in quadros] != list(range(12, 33)):
        raise ValueError("As 21 tabelas de movimentos devem ter índices 12–32, sem lacunas.")
    if sum(len(q["blocos"]) for q in quadros) != 44:
        raise ValueError("Extração divergente: esperados 44 blocos de células.")
    movimentos = []
    for quadro in quadros:
        indice = quadro["tabela_docx_indice"]
        base = registro.get(indice)
        if not base or base["tipo"] != "quadro_movimento_geral":
            raise ValueError(f"Quadro sem inventário correspondente: {indice}")
        blocos = quadro["blocos"]
        if [b["linha"] for b in blocos] != list(range(len(blocos))):
            raise ValueError(f"Linhas fora de sequência: {indice}")
        if indice == 30:
            if len(blocos) != 4 or blocos[2]["texto"] != "MANDADOS PENDENTES":
                raise ValueError("A tabela 30 deve preservar Recrutar e Mandados Pendentes.")
            grupos = [blocos[:2], blocos[2:]]
        else:
            if len(blocos) != 2:
                raise ValueError(f"Quadro {indice} não possui título e corpo como esperado.")
            grupos = [blocos]
        if blocos[0]["texto"] != quadro["titulo"] or base["titulo"] != quadro["titulo"]:
            raise ValueError(f"Divergência de título no quadro {indice}")
        for grupo in grupos:
            cabecalho, corpo = grupo
            titulo = cabecalho["texto"]
            texto = corpo["texto"]
            if not titulo or not texto:
                raise ValueError(f"Título/corpo vazio no quadro {indice}")
            marcadores = []
            for posicao, linha in enumerate(texto.splitlines()):
                capturado = FAIXA.match(linha.strip())
                if capturado:
                    faixa = _chave(capturado.group(1)).replace(" ", "")
                    faixa = "6-" if faixa.startswith("6") else "7-9" if faixa.startswith("7") else "10+"
                    marcadores.append({"faixa": faixa, "linha": posicao, "literal": linha})
            gatilhos = [{"linha": i, "literal": linha} for i, linha in enumerate(texto.splitlines())
                        if GATILHO.match(linha.strip())]
            movimentos.append({
                "id": f"movimento-geral:docx-{indice}" +
                      ("-mandados-pendentes" if cabecalho["linha"] == 2 else ""),
                "titulo": titulo,
                "categoria": "basico" if indice <= 19 else
                             ("subsistema_servos" if indice == 32 else "avancado"),
                "quadro_id": quadro["id"],
                "tabela_inventario_id": base["id"],
                "tabela_docx_indice": indice,
                "linhas_docx": [cabecalho["linha"], corpo["linha"]],
                "texto_original": texto,
                "gatilhos_literais": gatilhos,
                "marcadores_resultado_literais": marcadores,
                "requisito_explicito": None,
                "requisito_auditoria": "nao_inferido",
                "estado": "transcricao_integral_sem_revisao_semantica",
                "aplicacao_canonica": False,
            })
    if len(movimentos) != 22:
        raise ValueError("Esperadas 22 unidades (incluindo Mandados Pendentes).")
    if movimentos[-1]["titulo"] != "SERVOS" or "LEALDADE DOS SERVOS" not in movimentos[-1]["texto_original"]:
        raise ValueError("Subsistema de Lealdade dos Servos incompleto.")
    return movimentos


def indexar_movimentos_gerais(movimentos):
    estruturas = {nome: defaultdict(set) for nome in
                  ("by_categoria", "by_quadro", "by_titulo", "by_faixa", "by_gatilho_literal")}
    for mov in movimentos:
        identificador = mov["id"]
        for categoria, valor in (("by_categoria", mov["categoria"]),
                                 ("by_quadro", mov["quadro_id"]),
                                 ("by_titulo", _chave(mov["titulo"]))):
            estruturas[categoria][valor].add(identificador)
        for marcador in mov["marcadores_resultado_literais"]:
            estruturas["by_faixa"][marcador["faixa"]].add(identificador)
        estruturas["by_gatilho_literal"]["sim" if mov["gatilhos_literais"] else "nao"].add(identificador)
    return {nome: {chave: sorted(valores) for chave, valores in sorted(grupos.items())}
            for nome, grupos in estruturas.items()}
