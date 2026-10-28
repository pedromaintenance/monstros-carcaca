"""Calculadora auditável de Dungeon World (perguntas de Making Monsters).
A entrada é a decisão editorial, não ND ou estatísticas D&D. Não canoniza conteúdo.
Fonte: https://www.dungeonworldsrd.com/monsters/
"""
from __future__ import annotations

ORGANIZACAO = {
    "horda": {"pv": 3, "faces": 6},
    "grupo": {"pv": 6, "faces": 8},
    "solitario": {"pv": 12, "faces": 10},
}
PORTE = {
    "miudo": {"pv": 0, "bonus": -2, "alcances": ["mao"]},
    "pequeno": {"pv": 0, "bonus": 0, "alcances": ["corpo_a_corpo"]},
    "medio": {"pv": 0, "bonus": 0, "alcances": ["corpo_a_corpo"]},
    "grande": {"pv": 4, "bonus": 1, "alcances": ["corpo_a_corpo", "alcance"]},
    "enorme": {"pv": 8, "bonus": 3, "alcances": ["alcance"]},
}
DEFESA = {"carne": 0, "couro": 1, "escamas": 2, "osso": 3, "magica": 4}
PASSO_DADO = {4: 4, 6: 4, 8: 6, 10: 8, 12: 10}
DESTAQUES = {"forca", "adaptacao", "magia", "trapaça"}
TRACOS = {"ardiloso", "nao_biologico", "inteligente", "terrivel"}
OPCOES_ATAQUE = {"armas_fracas", "distancia"}

def _unique(values):
    return list(dict.fromkeys(values))

def calcular_ficha(organizacao, modo, decisoes):
    """Retorna somente a mecânica derivada, determinística, sem lançamento de dados."""
    if organizacao not in ORGANIZACAO:
        raise ValueError(f"Organização DW inválida: {organizacao}")
    if modo == "sem_estatisticas":
        if any([decisoes["porte"], decisoes["defesa"],
                decisoes["destaques"], decisoes["ataque"], decisoes["tracos"]]):
            raise ValueError("Monstro sem estatísticas deve manter escolhas de combate vazias.")
        return {"estado": "sem_estatisticas_por_escolha_ficcional",
                "pv": None, "armadura": None, "dano": None, "ataque": None,
                "tags": [organizacao, "sem_estatisticas"]}
    if modo != "estatizado":
        raise ValueError(f"Modo de ficha inválido: {modo}")
    porte, defesa = decisoes["porte"], decisoes["defesa"]
    if porte not in PORTE or defesa not in DEFESA:
        raise ValueError("Porte ou defesa inválidos.")
    destaques, tracos = decisoes["destaques"], decisoes["tracos"]
    ataque = decisoes["ataque"]
    if not ataque or not ataque["nome"]:
        raise ValueError("Monstro estatizado precisa de ataque identificável.")
    opcoes = ataque["opcoes"]
    if (len(destaques) != len(set(destaques))
            or len(tracos) != len(set(tracos))
            or len(opcoes) != len(set(opcoes))
            or not set(destaques) <= DESTAQUES
            or not set(tracos) <= TRACOS
            or not set(opcoes) <= OPCOES_ATAQUE):
        raise ValueError("Opções de procedimento repetidas ou não previstas no modelo.")
    pv = ORGANIZACAO[organizacao]["pv"] + PORTE[porte]["pv"]
    faces = ORGANIZACAO[organizacao]["faces"]
    mod = PORTE[porte]["bonus"]
    armadura = DEFESA[defesa]
    alcances = list(PORTE[porte]["alcances"])
    tags = [organizacao, porte]
    for opcao in destaques:
        if opcao == "forca":
            mod += 2
            tags.append("impetuoso")
        elif opcao == "magia":
            tags.append("magico")
        elif opcao == "trapaça":
            tags.append("furtivo")
        # Adaptacao implica qualidade ficcional; nenhuma alteração numérica.
    for opcao in tracos:
        if opcao == "ardiloso":
            faces = PASSO_DADO[faces]
            tags.append("ardiloso")
        elif opcao == "nao_biologico":
            pv += 4
        elif opcao == "inteligente":
            tags.append("inteligente")
        elif opcao == "terrivel":
            tags.append("aterrador")
    for opcao in opcoes:
        if opcao == "armas_fracas":
            faces = PASSO_DADO[faces]
        elif opcao == "distancia":
            alcances.append("perto")
    return {"estado": "proposta_mecanica_nao_aprovada",
            "pv": max(1, pv), "armadura": armadura,
            "dano": {"faces": faces, "modificador": mod,
                     "expressao": "d" + str(faces) + (f"+{mod}" if mod > 0 else str(mod) if mod < 0 else ""),
                     "minimo": 1},
            "ataque": {"nome": ataque["nome"],
                       "alcances": _unique(alcances), "opcoes": opcoes},
            "tags": _unique(tags + alcances)}
