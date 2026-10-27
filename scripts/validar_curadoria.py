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



def validar_balancos_e_pressoes(fontes):
    """Valida fontes, evidência, medidas opcionais e pressões hipotéticas."""
    b_schema=load("schemas/balanco-material.schema.json")
    p_schema=load("schemas/pressao-ecologica.schema.json")
    Draft202012Validator.check_schema(b_schema)
    Draft202012Validator.check_schema(p_schema)
    b_check=Draft202012Validator(b_schema)
    p_check=Draft202012Validator(p_schema)
    balancos=load("data/balancos_materiais_costa_sul.json")["balancos"]
    pressoes=load("data/pressoes_ecologicas_costa_sul.json")["pressoes"]
    deps=load("data/dependencias_materiais_costa_sul.json")["dependencias"]
    flows=load("data/fluxos_costa_sul.json")["fluxos"]
    settlements=gather("curadoria/assentamentos")
    aids={s["id"] for s in settlements}
    by_dep={d["id"]:d for d in deps}
    by_fluxo={f["id"]:f for f in flows}
    unique(balancos,"balancos materiais")
    unique(pressoes,"pressões ecológicas")
    medidas=("estoque_inicial","producao","entradas","consumo","saidas","perdas","estoque_final")
    for b in balancos:
        errors=list(b_check.iter_errors(b))
        require(not errors,f"Balanço material com schema inválido {b['id']}: {errors[:1]}")
        require(b["assentamento_id"] in aids, f"Assentamento de balanço inexistente: {b['id']}")
        require(b["dependencia_id"] in by_dep,f"Dependência de balanço inexistente: {b['id']}")
        require(b["fluxo_id"] in by_fluxo,f"Fluxo de balanço inexistente: {b['id']}")
        dep=by_dep[b["dependencia_id"]]
        require(dep["assentamento_id"]==b["assentamento_id"], f"Balanço fora da região do processo: {b['id']}")
        require(dep["fluxo_id"]==b["fluxo_id"], f"Balanço diverge do fluxo material: {b['id']}")
        require(b["fonte"] in fontes, f"Fonte de balanço desconhecida: {b['id']}")
        medidas_reais=[b["medidas"][k] for k in medidas if b["medidas"][k]["valor"] is not None]
        if b["status"]=="nao_quantificado":
            require(not medidas_reais, f"Registro sem quantificação não pode ter números: {b['id']}")
        else:
            require(bool(medidas_reais), f"Balanço revisado sem uma medida: {b['id']}")
        if b["recurso_id"] is None:
            require(not medidas_reais, f"Não quantificar bens materiais não identificados: {b['id']}")
        if b["sazonalidade"]["tipo"] in ("nao_documentada","sazonal_documentada"):
            require(b["sazonalidade"]["periodos_conhecidos"] is None
                    and b["sazonalidade"]["janela_duracao"] is None,
                    f"Não inferir mês ou duração de sazonalidade: {b['id']}")
    for p in pressoes:
        errors=list(p_check.iter_errors(p))
        require(not errors,f"Pressão ecológica com schema inválido {p['id']}: {errors[:1]}")
        require(p["fonte"] in fontes, f"Fonte de pressão desconhecida: {p['id']}")
        require(p["assentamento_id"] in aids, f"Assentamento de pressão inexistente: {p['id']}")
        for did in p["dependencias_ids"]:
            require(did in by_dep, f"Dependência de pressão inexistente: {did}")
            require(by_dep[did]["assentamento_id"]==p["assentamento_id"],
                    f"Pressão não pode presumir relação entre assentamentos: {p['id']}")
        require(p["estado"]=="risco_hipotetico_nao_ocorrido"
                and p["efeito_dw_automatico"] is False and p["evento_campanha_id"] is None,
                f"Pressão não pode modificar cânone ou campanha: {p['id']}")
    print(f"Balanços e pressões validados: {len(balancos)} perfis com "
          f"{sum(1 for b in balancos for m in b['medidas'].values() if m['valor'] is not None)} medições, "
          f"{len(pressoes)} riscos hipotéticos.")



def validar_capacidade_suporte(fontes):
    """Não permite capacidade populacional sintética ou história material inventada."""
    schema=load("schemas/capacidade-suporte.schema.json")
    Draft202012Validator.check_schema(schema)
    check=Draft202012Validator(schema)
    perfis=load("data/capacidade_suporte_costa_sul.json")["perfis"]
    assentamentos={s["id"]:s for s in gather("curadoria/assentamentos")}
    ids=unique(perfis,"capacidade de suporte")
    require(len(ids)==len(assentamentos),
            "Ciclo 9 deve indexar as três entidades coletivas sem duplicar.")
    unidades=("agua_potavel","alimentacao","abrigo","residuos")
    campos_demograficos=("residentes","nascimentos","obitos","migracao_entrada","migracao_saida")
    for perfil in perfis:
        erros=list(check.iter_errors(perfil))
        require(not erros,f"Perfil de suporte inválido {perfil['id']}: {erros[:1]}")
        aid=perfil["assentamento_id"]
        require(aid in assentamentos,f"Assentamento inexistente em suporte: {aid}")
        require(perfil["natureza_territorial"]==assentamentos[aid]["natureza"],
                f"Tipo de habitat distinto em suporte: {aid}")
        require(perfil["fonte"] in fontes,f"Fonte desconhecida em suporte: {aid}")
        require(perfil["efeito_dw_automatico"] is False,
                f"Não converter capacidade ecológica em efeitos DW automáticos: {aid}")
        names=[d["id"] for d in perfil["limites"]]
        require(sorted(names)==sorted(unidades),f"Quatro limites obrigatórios distintos: {aid}")
        medidas=[m for d in perfil["limites"]
                  for m in (d["disponibilidade"],d["necessidade_por_habitante"])]
        medidas.extend(perfil["demografia"][key] for key in campos_demograficos)
        if perfil["estado"]=="sem_capacidade_quantificavel":
            require(all(m["valor"] is None for m in medidas),
                    f"Perfil sem suporte quantificado não pode conter valores: {aid}")
            require(all(d["situacao"]=="medicoes_nao_disponiveis" for d in perfil["limites"]),
                    f"Perfil pendente com limite quantitativo não revisado: {aid}")
        if perfil["natureza_territorial"]!="assentamento_civil":
            require(perfil["demografia"]["residentes"]["valor"] is None,
                    f"Não somar comunidades ou redes num total inventado: {aid}")
        if perfil["demografia"]["mobilidade_sazonal"]=="deslocamentos_sazonais_documentados":
            require(aid=="assentamento:comunidades-insulares-costa-sul",
                    "Não espalhar sazonalidade insular para assentamentos alheios")
        require(perfil["demografia"]["continuidade_reprodutiva"]=="nao_documentada",
                f"Não atribuir reprodução sem fonte explícita: {aid}")
    print(f"Suporte ecológico validado: {len(perfis)} perfis, "
          f"{len(perfis)*4} limites, zero medidas presumidas.")


def validar_infraestrutura_costa_sul(fontes):
    """Validação de evidência e de lacunas em infraestrutura material."""
    schema=load("schemas/infraestrutura-assentamento.schema.json")
    Draft202012Validator.check_schema(schema)
    check=Draft202012Validator(schema)
    perfis=load("data/infraestrutura_assentamentos_costa_sul.json")["perfis"]
    assentamentos={a["id"]:a for a in gather("curadoria/assentamentos")}
    suporte={a["id"]:a for a in load("data/capacidade_suporte_costa_sul.json")["perfis"]}
    deps={d["id"]:d for d in load("data/dependencias_materiais_costa_sul.json")["dependencias"]}
    names=("construcao_abrigo","armazenamento","saneamento","acessos_logistica")
    unique(perfis,"perfis de infraestrutura")
    require(len(perfis)==len(assentamentos),
            "Infraestrutura da Costa Sul: registrar todas as entidades de habitação")
    for row in perfis:
        problems=list(check.iter_errors(row))
        require(not problems,f"Schema de infraestrutura inválido: {row['id']}: {problems[:1]}")
        aid=row["assentamento_id"]
        require(aid in assentamentos,f"Assentamento de infraestrutura desconhecido: {row['id']}")
        require(row["suporte_id"] in suporte,f"Suporte de infraestrutura inexistente: {row['id']}")
        require(suporte[row["suporte_id"]]["assentamento_id"]==aid,
                f"Perfil de suporte não pertence ao assentamento: {row['id']}")
        require(row["natureza"]==assentamentos[aid]["natureza"],
                f"Natureza de habitat incoerente: {row['id']}")
        require(row["fonte"] in fontes,f"Fonte de infraestrutura inexistente: {row['id']}")
        require(sorted(sector["id"] for sector in row["setores"])==sorted(names),
                f"Setores de infraestrutura faltantes ou duplicados: {row['id']}")
        for sector in row["setores"]:
            anchors=sector["ancoras_documentadas"]
            require(bool(anchors)==(sector["estado"]=="evidencia_parcial"),
                    f"Estado sem correspondência com evidências: {row['id']} {sector['id']}")
            require(sector["efeitos_dw_automaticos"] is False and
                    sector["risco_narrativo_proposto"] is None,
                    f"Infraestrutura não causa eventos automaticamente: {row['id']}")
            for anchor in anchors:
                require(anchor["fonte"] in fontes,
                        f"Fonte de âncora inexistente: {row['id']}")
            for kind in ("materiais_construtivos_confirmados","instalacoes_especificas_confirmadas"):
                for material in sector[kind]:
                    require(material["fonte"] in fontes,
                            f"Fonte de construção/instalação inexistente: {row['id']}")
                    require(bool(anchors),
                            f"Infraestrutura específica sem âncora documental: {row['id']}")
            for did in sector["dependencias_relacionadas"]:
                require(did in deps,f"Dependência de infraestrutura desconhecida: {did}")
                require(deps[did]["assentamento_id"]==aid,
                        f"Relação entre assentamentos sem fluxo específico: {row['id']}")
    print(f"Infraestrutura validada: {len(perfis)} perfis, "
          f"{sum(len(x['setores']) for x in perfis)} setores, "
          f"{sum(len(s['materiais_construtivos_confirmados']) for p in perfis for s in p['setores'])} materiais de construção conhecidos.")


def validar_dinamicas_territoriais(fontes,rids):
    """Somente fatos regionais: não atribuir ataques ou refugiados a cidades desconhecidas."""
    schema=load("schemas/dinamica-territorial.schema.json")
    Draft202012Validator.check_schema(schema)
    check=Draft202012Validator(schema)
    payload=load("data/dinamicas_territoriais_alem_sul.json")
    require(payload["escopo"]=="alem-sul","Escopo territorial inesperado")
    dynamics=payload["dinamicas"]
    label_doc=load("data/rotulos_territoriais_carcaca.json")
    labels=label_doc["rotulos"]
    label_ids=unique(labels,"rótulos territoriais")
    unique(dynamics,"dinâmicas territoriais")
    for label in labels:
        require(label["id"].startswith("rotulo-territorial:"),
                "Rótulo territorial com namespace incorreto")
        require(label.get("consequencia_narrativa_proposta"),
                "Rótulo territorial deve diferenciar hipótese e fato")
    settlements={s["id"]:s for s in gather("curadoria/assentamentos")}
    places=load("data/regioes_carcaca.json")["regioes"]
    caatinga=next((r for r in places if r["id"]=="regiao:caatinga"),None)
    require(caatinga is not None and caatinga["lugares"]==[],
            "Caatinga sem assentamentos nomeados: não inventar localidades")
    for d in dynamics:
        errors=list(check.iter_errors(d))
        require(not errors,f"Dinâmica territorial inválida: {d['id']} {errors[:1]}")
        require(d["fonte"] in fontes,f"Fonte desconhecida: {d['id']}")
        require(d["origem_regiao_id"] in rids and d["destino_regiao_id"] in rids,
                f"Região desconhecida em dinâmica: {d['id']}")
        require(set(d["rotulos_territoriais"])<=label_ids,
                f"Rótulo territorial inexistente em {d['id']}")
        for prop in ("assentamento_origem_id","assentamento_alvo_id"):
            aid=d[prop]
            if aid is not None:
                require(aid in settlements,
                        f"Assentamento sem referência em dinâmica: {d['id']} {aid}")
        if d["escala"]=="regional":
            require(d["assentamento_origem_id"] is None
                    and d["assentamento_alvo_id"] is None,
                    f"Dinâmica regional não pode nomear vítima/atacante individual: {d['id']}")
        require(d["evento_campanha_id"] is None and d["efeitos_dw_automaticos"] is False,
                f"Dinâmica não pode criar evento canônico/DW: {d['id']}")
    refugiados=next((d for d in dynamics if d["id"]==
       "dinamica:refugiados-eldroth-maiores-assentamentos"),None)
    require(refugiados is not None
            and refugiados["assentamento_alvo_id"] is None,
            "Não atribuir refugiados de Eldroth a Portomonte sem fonte")
    print(f"Dinâmicas territoriais válidas: {len(dynamics)} vínculos regionais, "
          f"{len(labels)} rótulos não aplicados automaticamente a assentamentos.")

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
    validar_balancos_e_pressoes(fontes)
    validar_capacidade_suporte(fontes)
    validar_infraestrutura_costa_sul(fontes)
    validar_dinamicas_territoriais(fontes,rids)
    print(f"Curadoria validada: {len(criaturas)} criaturas; {len(regioes)} regiões; "
          f"{len(lugares)} lugares; {len(faccoes)} facções; "
          f"{len(frentes)} frentes; {len(assentamentos)} assentamentos.")

if __name__=="__main__":
    main()
