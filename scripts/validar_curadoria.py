#!/usr/bin/env python3
"""Validação da curadoria autoral; cruza referências e não altera dados."""
from __future__ import annotations
import json
from pathlib import Path
from jsonschema import Draft202012Validator

ROOT=Path(__file__).resolve().parents[1]

def load(path):
    return json.loads((ROOT/path).read_text(encoding="utf8"))

def gather(folder):
    rows=[]
    for path in sorted((ROOT/folder).glob("*.json")):
        content=load(path.relative_to(ROOT))
        rows.extend(content if isinstance(content,list) else [content])
    return rows

def require(ok, msg):
    if not ok: raise AssertionError(msg)

def unique(rows,label):
    ids=[r["id"] for r in rows]
    require(len(set(ids))==len(ids),"IDs duplicados: "+label)
    return set(ids)


def validate_ecossistema(fontes, rids, lids, lugares):
    """Validação sem efeitos colaterais de habitações, tags, povos e fluxos."""
    schema=load("schemas/assentamento-carcaca.schema.json")
    Draft202012Validator.check_schema(schema)
    check=Draft202012Validator(schema)
    assentamentos=gather("curadoria/assentamentos")
    rotulos=load("data/rotulos_assentamentos_carcaca.json")["rotulos"]
    povos=load("data/povos_carcaca.json")["povos"]
    fluxos=load("data/fluxos_costa_sul.json")["fluxos"]
    aids=unique(assentamentos,"assentamentos")
    tags=unique(rotulos,"rótulos")
    pids=unique(povos,"povos")
    unique(fluxos,"fluxos")
    for p in povos:
        require(p["fonte"] in fontes,"Fonte de povo desconhecida: "+p["id"])
    for s in assentamentos:
        errs=list(check.iter_errors(s))
        require(not errs,f"Schema inválido do assentamento {s['id']}: {errs[:1]}")
        require(s["regiao_id"] in rids,"Região desconhecida: "+s["id"])
        require(s["lugar_id"] in lids,"Lugar desconhecido: "+s["id"])
        lugar=next(x for x in lugares if x["id"]==s["lugar_id"])
        require(lugar["regiao_id"]==s["regiao_id"],
                "Assentamento não pertence à região do lugar: "+s["id"])
        require(s["fonte"] in fontes,"Fonte desconhecida: "+s["id"])
        for h in s["habitantes"]:
            require(h["povo_id"] in pids,"Povo sem registro: "+h["povo_id"])
            require(h["fonte"] in fontes,"Fonte desconhecida: "+s["id"])
        for t in s["rotulos_carcaca"]:
            require(t["id"] in tags,"Rótulo sem registro: "+t["id"])
            require(t["fonte"] in fontes,"Fonte desconhecida do rótulo: "+t["id"])
        for cat in ("agua","alimento","abrigo","materiais","residuos","dependencias"):
            for rec in s["ecologia_material"][cat]:
                require(rec["fonte"] in fontes,"Fonte desconhecida em ecologia: "+s["id"])
        cont=s["ecologia_material"]["continuidade"]
        if cont["situacao"]=="nao_documentada":
            require(cont["descricao"] is None and cont.get("fonte") is None,
                    "Continuidade não documentada precisa permanecer nula: "+s["id"])
        for rel in s["rotas_e_conflitos"]:
            require(rel["fonte"] in fontes,"Fonte desconhecida da relação: "+s["id"])
            if rel.get("alvo_assentamento_id"):
                require(rel["alvo_assentamento_id"] in aids,
                        "Referência quebrada: "+rel["alvo_assentamento_id"])
    for flow in fluxos:
        require(flow["fonte"] in fontes,"Fonte desconhecida do fluxo: "+flow["id"])
        require(flow["status"] in ("documentado","inferido","proposto","incerto"),
                "Status inválido do fluxo: "+flow["id"])
        require(flow.get("origem_assentamento_id") or flow.get("destino_assentamento_id"),
                "Fluxo sem assentamento: "+flow["id"])
        for key in ("origem_assentamento_id","destino_assentamento_id"):
            if flow.get(key):
                require(flow[key] in aids,"Assentamento inexistente no fluxo: "+flow["id"])
    scenario_schema=load("schemas/cenario-assentamento.schema.json")
    Draft202012Validator.check_schema(scenario_schema)
    check_scenario=Draft202012Validator(scenario_schema)
    scenario_rows=[]
    for filepath in sorted((ROOT/"cenarios/assentamentos").glob("*.json")):
        package=load(filepath.relative_to(ROOT))
        require(package["estado"]=="material_para_mestre_nao_executado",
                "Pacote de cenários precisa ser hipotético: "+str(filepath))
        require(package["schema_version"]=="0.1.0",
                "Versão de cenário desconhecida: "+str(filepath))
        scenario_rows.extend(package["cenarios"])
    unique(scenario_rows,"cenários hipotéticos")
    for scenario in scenario_rows:
        errors=list(check_scenario.iter_errors(scenario))
        require(not errors, f"Schema de cenário inválido {scenario['id']}: {errors[:1]}")
        require(set(scenario["assentamentos"])<=aids,
                "Cenário referencia assentamento inexistente: "+scenario["id"])
        require(scenario["fonte_regras"] in fontes and scenario["fonte_cenario"] in fontes,
                "Cenário com fontes inexistentes: "+scenario["id"])
        require(scenario["mutacao_canonica"] is False,
                "Cenário jamais pode mutar o cânone: "+scenario["id"])
    print(f"Cenários hipotéticos validados: {len(scenario_rows)} sem mutação canônica.")
    print(f"Ecossistema válido: {len(assentamentos)} registros, "
          f"{len(tags)} rótulos, {len(povos)} povos, {len(fluxos)} fluxos.")


def validar_dependencias_e_exemplos(fontes):
    """Graus de evidência, integridade do grafo e exemplos de campanhas; nada é executado."""
    dependencias=load("data/dependencias_materiais_costa_sul.json")["dependencias"]
    assentamentos=gather("curadoria/assentamentos")
    fluxos=load("data/fluxos_costa_sul.json")["fluxos"]
    cenarios=[]
    for path in sorted((ROOT/"cenarios/assentamentos").glob("*.json")):
        cenarios.extend(load(path.relative_to(ROOT))["cenarios"])
    ids_assentamentos={x["id"] for x in assentamentos}
    ids_fluxos={x["id"] for x in fluxos}
    ids_cenarios={x["id"] for x in cenarios}
    ids_dependencias=unique(dependencias,"dependencias materiais")
    by_id={x["id"]:x for x in dependencias}
    schema=load("schemas/dependencia-material.schema.json")
    Draft202012Validator.check_schema(schema)
    check=Draft202012Validator(schema)
    for dep in dependencias:
        errors=list(check.iter_errors(dep))
        require(not errors,f"Dependência com schema inválido {dep['id']}: {errors[:1]}")
        require(dep["assentamento_id"] in ids_assentamentos,
                f"Assentamento de dependência inexistente: {dep['id']}")
        require(dep["fluxo_id"] in ids_fluxos,
                f"Fluxo de dependência inexistente: {dep['id']}")
        require(dep["fonte"] in fontes,
                f"Fonte de dependência inexistente: {dep['id']}")
        upstream=dep["depende_de_id"]
        if upstream is not None:
            require(upstream in ids_dependencias,f"Dependência predecessora inexistente: {dep['id']}")
            require(by_id[upstream]["assentamento_id"]==dep["assentamento_id"],
                    f"Dependências entre assentamentos requerem fluxo explícito: {dep['id']}")
        flow=next(f for f in fluxos if f["id"]==dep["fluxo_id"])
        require(flow.get("origem_assentamento_id")==dep["assentamento_id"]
                or flow.get("destino_assentamento_id")==dep["assentamento_id"],
                f"Fluxo não toca o assentamento: {dep['id']}")
        if dep["estado_evidencia"]=="documentado":
            require(flow["status"]=="documentado",
                    f"Dependência não pode ser mais confirmada que seu fluxo: {dep['id']}")
    visiting=set()
    visited=set()
    def walk(node):
        if node in visited:return
        require(node not in visiting,f"Ciclo de dependências materiais: {node}")
        visiting.add(node)
        upstream=by_id[node]["depende_de_id"]
        if upstream is not None:walk(upstream)
        visiting.remove(node)
        visited.add(node)
    for node in ids_dependencias:walk(node)

    ledger_schema=load("schemas/estado-campanha.schema.json")
    Draft202012Validator.check_schema(ledger_schema)
    ledger_check=Draft202012Validator(ledger_schema)
    samples=sorted((ROOT/"exemplos/campanhas").glob("*.json"))
    for p in samples:
        example=load(p.relative_to(ROOT))
        errors=list(ledger_check.iter_errors(example))
        require(not errors,f"Exemplo de campanha inválido {p.name}: {errors[:1]}")
        unique(example["eventos"],"eventos de "+example["id"])
        require(example["revisao"]==len(example["eventos"]),
                "Revisão não corresponde a eventos: "+example["id"])
        for event in example["eventos"]:
            require(event["assentamento_id"] in ids_assentamentos,
                    "Evento de exemplo aponta para assentamento inexistente")
            if event["fonte_cenario_id"] is not None:
                require(event["fonte_cenario_id"] in ids_cenarios,
                        "Evento aponta para cenário inexistente")
    print(f"Grafo material validado: {len(dependencias)} dependências sem ciclos, "
          f"{len(samples)} exemplos de campanha sem efeito canônico.")


def main():
    schema=load("schemas/criatura-carcaca.schema.json")
    Draft202012Validator.check_schema(schema)
    validator=Draft202012Validator(schema)
    tipos=unique(load("data/taxonomia_carcaca.json")["tipos"],"tipos")
    regioes=load("data/regioes_carcaca.json")["regioes"]
    lugares=load("data/lugares_carcaca.json")["lugares"]
    faccoes=load("data/faccoes_carcaca.json")["faccoes"]
    criaturas=gather("curadoria/criaturas")
    frentes=gather("curadoria/frentes")
    assentamentos=gather("curadoria/assentamentos")
    fontes=load("data/fontes_projeto.json")
    rids=unique(regioes,"regioes")
    lids=unique(lugares,"lugares")
    fids=unique(faccoes,"faccoes")
    cids=unique(criaturas,"criaturas")
    unique(frentes,"frentes")
    unique(assentamentos,"assentamentos")

    def source(k,owner):require(k in fontes,f"Fonte inexistente em {owner}: {k}")

    for regiao in regioes:
        for place in regiao["lugares"]:
            require(place in lids,f"Lugar ausente na região {regiao['id']}: {place}")
    for lugar in lugares:
        require(lugar["regiao_id"] in rids,f"Região desconhecida: {lugar['id']}")
        source(lugar["fonte"],lugar["id"])
    for faccao in faccoes:
        source(faccao["fonte"],faccao["id"])

    for c in criaturas:
        errors=list(validator.iter_errors(c))
        require(not errors,f"Schema inválido {c['id']}: {errors[:1]}")
        require(c["tipo_carcaca"] in tipos,f"Tipo Carcaça inexistente: {c['id']}")
        require(c["tipo_dnd_referencia"]["original"],f"Tipo D&D ausente: {c['id']}")
        for key in c["proveniencia"]["fontes"]:source(key,c["id"])
        for ocorrencia in c["ocorrencias"]:
            rid=ocorrencia["regiao_id"]
            lid=ocorrencia.get("lugar_id")
            require(rid in rids,f"Região inexistente em {c['id']}: {rid}")
            if lid:
                require(lid in lids,f"Lugar inexistente em {c['id']}: {lid}")
                require(next(l for l in lugares if l["id"]==lid)["regiao_id"]==rid,
                        f"Lugar não está nessa região: {lid}")
        for f in c.get("faccoes",[]):
            require(f["id"] in fids,f"Facção inexistente em {c['id']}: {f['id']}")
        for relacao in c.get("relacoes",[]):
            require(relacao["alvo_id"] in (fids|lids|cids),
                    f"Alvo de relação inexistente: {relacao['alvo_id']}")
        dw=c["dungeon_world"]
        require(dw["instinto"],f"Instinto DW vazio: {c['id']}")
        require(len(dw["movimentos"])>=2,f"Faltam movimentos DW: {c['id']}")
        for move in dw["movimentos"]:
            require(move["nome"] and move["texto"],f"Movimento sem texto: {c['id']}")
        stats=dw["estatisticas"]
        if stats["estado"]=="nao_calculadas":
            require(all(stats[x] is None for x in ("pv","armadura","dano")),
                    f"Não preencher DW por conversão automática: {c['id']}")
        else:
            require(c["estado"] in ("revisado","aprovado"),
                    f"Estatísticas DW não revisadas: {c['id']}")

    for frente in frentes:
        require(set(frente["regioes"])<=rids,"Frente sem região")
        require(set(frente["elenco"])<=cids,"Frente sem elenco")
        require(1<=len(frente["perigos"])<=6,"Quantidade de perigos inválida")
        require(frente["perguntas_em_aberto"],"Frente sem perguntas")
        for perigo in frente["perigos"]:
            require(set(perigo["criaturas"])<=cids,"Perigo com criatura não cadastrada")
            require(perigo["pressagios_propostos"] and perigo["desastre_iminente_proposto"],
                    "Perigo sem presságio/desastre")
    for assentamento in assentamentos:
        require(assentamento["regiao_id"] in rids,"Assentamento sem região")
        source(assentamento["fonte"],assentamento["id"])
        if assentamento.get("lugar_id"):
            require(assentamento["lugar_id"] in lids,"Assentamento sem lugar")
        require(assentamento["tipo_dw"]["classificacao"] is None or
                assentamento["tipo_dw"]["estado"]=="revisado",
                "Assentamento teve classificação DW inferida")

    validate_ecossistema(fontes, rids, lids, lugares)
    validar_dependencias_e_exemplos(fontes)
    print(f"Curadoria validada: {len(criaturas)} criaturas; {len(regioes)} regiões; "
          f"{len(lugares)} lugares; {len(faccoes)} facções; "
          f"{len(frentes)} frentes; {len(assentamentos)} assentamentos.")

if __name__=="__main__":
    main()
