#!/usr/bin/env python3
"""Validação da curadoria autoral; cruza referências e não altera dados."""
from __future__ import annotations
import json
import gzip
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


def validar_guias_dossies_regionais(fontes,rids):
    """Exigir um guia por região, perguntas distintas e nenhuma localidade fabricada."""
    schema=load("schemas/guia-dossie-regional.schema.json")
    Draft202012Validator.check_schema(schema)
    check=Draft202012Validator(schema)
    guides=load("data/guias_dossies_regionais.json")["guias"]
    unique(guides,"guias regionais")
    seen_questions=set()
    require({g["regiao_id"] for g in guides}==rids,
            "Um guia de cobertura por região curada é obrigatório.")
    for g in guides:
        errors=list(check.iter_errors(g))
        require(not errors,f"Guia regional inválido {g['id']}: {errors[:1]}")
        require(g["id"]=="dossie-regional:"+g["regiao_id"].split(":",1)[1],
                f"ID de guia regional não corresponde à região: {g['id']}")
        require(g["fonte"] in fontes,f"Fonte de guia inexistente: {g['id']}")
        for question in g["perguntas"]:
            require(question["id"] not in seen_questions,
                    "ID de pergunta repetido: "+question["id"])
            seen_questions.add(question["id"])
    print(f"Guias regionais validados: {len(guides)} regiões, "
          f"{len(seen_questions)} perguntas, sem preencher números nem eventos.")


def validar_prioridades_curadoria(fontes):
    """Prioridades são editoriais. Nunca resolvem perguntas nem criam cânone."""
    priorities=load("data/prioridades_curadoria_m3.json")
    require(priorities["schema_version"]=="0.1.0" and
            priorities["estado"]=="plano_editorial_nao_executado",
            "Priorização não é um plano de execução automática.")
    schema=load("schemas/prioridade-curadoria.schema.json")
    Draft202012Validator.check_schema(schema)
    validator=Draft202012Validator(schema)
    guides=load("data/guias_dossies_regionais.json")["guias"]
    questions={q["id"]:q for g in guides for q in g["perguntas"]}
    require(len(questions)==sum(len(g["perguntas"]) for g in guides),
            "Não aceitar IDs repetidos nos guias.")
    picked=priorities["prioridades"]
    ids=unique([{"id":x["pergunta_id"]} for x in picked],"prioridades de pesquisa")
    order={x["pergunta_id"]:x for x in picked}
    require(len(picked)<=len(questions),"Mais prioridades que perguntas disponíveis.")
    ordinals=[x["ordem_editorial"] for x in picked]
    require(sorted(ordinals)==list(range(1,len(picked)+1)),
            "Ordem editorial deve iniciar em 1 sem lacunas ou duplicidade.")
    for entry in picked:
        errors=list(validator.iter_errors(entry))
        require(not errors,
                f"Prioridade inválida {entry['pergunta_id']}: {errors[:1]}")
        qid=entry["pergunta_id"]
        require(qid in questions,f"Pergunta inexistente na fila: {qid}")
        require(entry["fonte_base"] in fontes,f"Fonte não reconhecida: {qid}")
        require(entry["autoriza_criacao_canonica"] is False,
                f"Prioridade não pode virar cânone automaticamente: {qid}")
        if entry["faixa_prioridade"]=="primeiro_lote":
            require(not entry["depende_de_perguntas"],
                    f"Primeiro lote não pode depender de segundo lote: {qid}")
        for dep in entry["depende_de_perguntas"]:
            require(dep in order,
                    f"Dependência editorial sem priorização: {qid} → {dep}")
            require(dep!=qid and order[dep]["ordem_editorial"]<entry["ordem_editorial"],
                    f"Pré-requisito editorial deve preceder a pergunta: {qid} → {dep}")
            require(dep in questions,
                    f"Dependência aponta para pergunta ausente: {dep}")
    print(f"Fila editorial validada: {len(questions)} perguntas, "
          f"{len(picked)} priorizadas, "
          f"{sum(len(e['depende_de_perguntas']) for e in picked)} precedências, 0 respostas fabricadas.")


def validar_lore_manuscrito():
    """Manuscrito de referência separado do cânone de criaturas/assentamentos."""
    source=load("fontes/autoria/hack-carcaca-dw-capitulo-i.paginas.json")
    idx=load("data/lore/hack-carcaca-dw-indice-tematico.json")
    timeline=load("data/lore/hack-carcaca-dw-cronologia.json")
    reviews=load("data/lore/hack-carcaca-dw-pontos-de-revisao.json")
    schema=load("schemas/lore-hack-manuscrito.schema.json")
    Draft202012Validator.check_schema(schema)
    check=Draft202012Validator(schema)
    require(source["escopo"]=="capitulo_i_ambientacao" and
            [p["pagina"] for p in source["paginas"]]==list(range(2,26)),
            "Fonte manuscrita incompleta: requer páginas 2 a 25 (somente ambiente).")
    require(all(p["texto"] and p["palavras"]>0 for p in source["paginas"]),
            "Página sem texto na fonte do manuscrito.")
    require("hack_carcaca_dw_rascunho" in load("data/fontes_projeto.json"),
            "Manuscrito ausente no cadastro de fontes do projeto.")
    require(idx["fonte_id"]==source["id"]==timeline["fonte_id"]==reviews["fonte_id"],
            "IDs de proveniência incompatíveis para o manuscrito.")
    ids=unique(idx["entradas"],"entradas de lore do manuscrito")
    require(all(not list(check.iter_errors(e)) for e in idx["entradas"]),
            "Registro de lore inválido segundo schema.")
    for row in idx["entradas"]:
        require(row["paginas"] and all(p in range(2,26) for p in row["paginas"]),
                "Página fora da ambientação: "+row["id"])
        require(row["evidencia"]=="afirmado_no_rascunho" and
                row["integracao"]=="referencia_sem_mutar_canonico",
                "Manuscrito não pode consolidar cânone: "+row["id"])
    unique(timeline["eventos"],"eventos da cronologia manuscrita")
    unique(timeline["questoes_abertas"],"questões do manuscrito")
    unique(reviews["revisoes"],"pontos de revisão")
    years=[e["ano_ec"] for e in timeline["eventos"]]
    require(years==sorted(years) and len(set(years))==len(years),
            "Cronologia EC fora de ordem/duplicada.")
    require(all(e["pagina"] in (9,10) and
                e["status"]=="afirmado_no_rascunho" and
                e["uso"]=="nao_promover_para_timeline_canonica_sem_revisao"
                for e in timeline["eventos"]),
            "Eventos do manuscrito não podem atualizar a linha do tempo automaticamente.")
    require(all(x["pagina"]==11 and x["estado"]=="explicitamente_em_aberto"
                for x in timeline["questoes_abertas"]),
            "Uma incógnita não pode virar fato.")
    require(all(not review["acao_autorizada"] and
                all(p in range(2,26) for p in review["paginas"])
                for review in reviews["revisoes"]),
            "Revisão não pode promover automaticamente uma resolução.")
    print(f"Manuscrito indexado: {len(source['paginas'])} páginas de ambientação, "
          f"{len(ids)} entradas, {len(years)} datas, "
          f"{len(timeline['questoes_abertas'])} incógnitas e "
          f"{len(reviews['revisoes'])} revisões editoriais.")


def validar_pontes_lore_manuscrito(rids):
    links=load("data/lore/hack-carcaca-dw-pontes-atlas.json")
    index=load("data/lore/hack-carcaca-dw-indice-tematico.json")
    by_entry={row["id"]:row for row in index["entradas"]}
    questions={q["id"] for g in load("data/guias_dossies_regionais.json")["guias"]
               for q in g["perguntas"]}
    require(links["fonte_id"]==index["fonte_id"],"Ponte com fonte divergente")
    unique(links["pontes"],"pontes de manuscrito para atlas")
    for link in links["pontes"]:
        require(link["id"].startswith("ponte-lore:"),"Namespace de ponte incorreto")
        require(link["entrada_lore_id"] in by_entry,"Entrada de lore desconhecida na ponte")
        require(link["regiao_atlas_id"] in rids,"Região de ponte ausente no atlas")
        require(link["pergunta_curadoria_id"] is None or
                link["pergunta_curadoria_id"] in questions,
                "Pergunta desconhecida na ponte")
        require(link["pagina"] in by_entry[link["entrada_lore_id"]]["paginas"],
                "Página da ponte não corresponde à página citada na entrada")
        require(link["aplicar_automaticamente"] is False and
                link["status"]=="pendente_revisao_autoral",
                "Ponte não pode atualizar cânone por conta própria")
    print(f"Pontes manuscrito→atlas: {len(links['pontes'])} referências em revisão.")


def validar_indice_mecanicas_manuscrito():
    """Cobertura textual do hack; títulos são candidatos, não movimentos certificados."""
    m=load("data/lore/hack-carcaca-dw-indice-mecanicas.json")
    require(m["fonte_id"]=="fonte:hack-carcaca-dungeon-world-rascunho",
            "Fonte do índice mecânico divergente")
    require(m["estado"]=="candidatos_para_revisao_nao_canonicos" and
            m["nao_usar_como_fato_de_ambientacao"] is True,
            "Índice de mecânicas não deve produzir cânone")
    rows=m["paginas_indice"]
    ids=[r["pagina"] for r in rows]
    require(ids==sorted(ids) and len(ids)==len(set(ids)), "Páginas mecânicas duplicadas/desordenadas")
    expected=set(range(26,182))
    missing=sorted(expected-set(ids))
    require(missing==m["paginas_sem_texto_extraivel"],"Páginas sem texto não informadas")
    require(len(rows)==m["paginas_com_texto"],"Total de páginas mecânicas incorreto")
    bundles=[
      "fontes/autoria/hack-carcaca-dw-mecanicas-p26-64.json",
      "fontes/autoria/hack-carcaca-dw-mecanicas-p65-109.json",
      "fontes/autoria/hack-carcaca-dw-mecanicas-p110-154.json",
      "fontes/autoria/hack-carcaca-dw-mecanicas-p155-181.json"
    ]
    for bundle in bundles:
        b=load(bundle)
        require(b["fonte_id"]==m["fonte_id"], "Pacote mecânico com fonte divergente")
        page_ids=[p["pagina"] for p in b["paginas"]]
        require(all(p in ids for p in page_ids),"Pacote de mecânicas com página não indexada")
        require(all(p["texto"] for p in b["paginas"]),"Página mecânica sem texto")
        for p in b["paginas"]:
            entry=next(x for x in rows if x["pagina"]==p["pagina"])
            require(entry["fonte_paginas"]==bundle,"Referência de origem incorreta")
            require(entry["categoria"] in (
                "regras_fundamentais","teoria_dos_movimentos",
                "movimentos_de_povo","movimentos_de_classe"),
                "Categoria mecânica não reconhecida")
    require(sum(len(load(p)["paginas"]) for p in bundles)==len(rows),
            "Pacotes mecânicos não correspondem ao número de páginas")
    require(any(x["mencoes_requer_na_pagina"] for x in rows),
            "Não encontrou menções a REQUER na fonte")
    print(f"Índice secundário: {len(rows)} páginas de regras/movimentos; "
          f"{sum(len(x['rotulos_detectados']) for x in rows)} rótulos candidatos, "
          f"{len(missing)} páginas sem texto extraível, zero movimentos promovidos.")


def validar_terceira_auditoria_manuscrito():
    """Índices verificados de relações e movimentos, sem interpretar regras além do título e REQUER."""
    import re
    import unicodedata
    def norm(value):
        text=unicodedata.normalize("NFKD",str(value or "")).encode("ascii","ignore").decode().lower()
        return re.sub(r"\s+"," ",text).strip()
    source=load("fontes/autoria/hack-carcaca-dw-capitulo-i.paginas.json")
    names={x["id"] for x in load("data/lore/hack-carcaca-dw-indice-tematico.json")["entradas"]}
    page_text={p["pagina"]:norm(p["texto"]) for p in source["paginas"]}
    relations=load("data/lore/hack-carcaca-dw-relacoes.json")
    require(relations["fonte_id"]==source["id"],"Relações com fonte diferente do manuscrito")
    unique(relations["relacoes"],"relações de lore do manuscrito")
    for rel in relations["relacoes"]:
        require(rel["origem_id"] in names and rel["destino_id"] in names,
                f"Referência de entidade ausente: {rel['id']}")
        require(rel["pagina"] in page_text and norm(rel["ancora_textual"]) in page_text[rel["pagina"]],
                f"Âncora de página não localizada: {rel['id']}")
        require(rel["estado"]=="afirmado_no_manuscrito" and rel["aplicacao_canonica"] is False,
                f"Relação editorial não pode alterar cânone: {rel['id']}")
    data=load("data/lore/hack-carcaca-dw-movimentos-selecionados.json")
    rows=data["movimentos"]
    unique(rows,"movimentos extraídos do DOCX")
    require(data["registro_tipo"]=="movimentos_conferidos_parcialmente",
            "Movimentos selecionados não são revisões completas de regras.")
    require(len({x["paragrafo_docx"] for x in rows})==len(rows),
            "Um parágrafo DOCX não pode mapear para dois movimentos distintos.")
    for move in rows:
        require(move["id"]=="movimento-revisado:paragrafo-"+str(move["paragrafo_docx"]),
                f"ID de movimento não acompanha parágrafo do DOCX: {move['id']}")
        require(move["categoria"] in ("povo","classe") and bool(move["grupo"]) and bool(move["titulo"]),
                "Movimento sem título ou grupo.")
        require(move["estado"]=="titulo_e_requisito_conferidos_no_docx"
                and move["efeito_revisado"] is False and move["aplicacao_canonica"] is False,
                f"Movimento não pode ser aplicado sem revisão: {move['id']}")
        require(move["requisito_literal"] is None or bool(move["requisito_literal"].strip()),
                "REQUER não pode ser string vazia")
    mechanics=load("data/lore/hack-carcaca-dw-indice-mecanicas.json")
    check=mechanics.get("conferencia_pagina_91",{})
    require(check.get("confirmada_em_renderizacao_docx") is True
            and check.get("possui_texto") is False
            and mechanics["paginas_sem_texto_extraivel"]==[91],
            "O resultado confirmado da página 91 precisa estar documentado.")
    print(f"3a auditoria: {len(relations['relacoes'])} relações, {len(rows)} títulos conferidos, "
          f"{sum(x['requisito_literal'] is not None for x in rows)} requisitos literais, "
          "página 91 confirmada em branco, zero promoções canônicas.")


def validar_quarta_auditoria_manuscrito():
    """Amostra integral DOCX + catálogo completo das tabelas, sem promover regras ao cânone."""
    from collections import Counter
    path="data/lore/hack-carcaca-dw-movimentos-integrais-piloto.json"
    raw=load(path)
    movements=raw["movimentos"]
    require(raw["posicao"]=="indice_zero_based_de_paragrafo_docx",
            "Âncoras de movimentos devem ser parágrafos zero-based.")
    ids=unique(movements,"movimentos integrais do piloto")
    found_paras={m["paragrafo_docx"] for m in movements}
    expected=set(range(827,833))|{834,835,836,837,842,843}
    require(found_paras==expected,
            "Piloto incompleto: 6 Humanos e 6 Orcs da Caatinga, sem duplicações.")
    require(Counter(m["grupo"] for m in movements)==
            {"HUMANOS":6,"ORCS DA CAATINGA":6},
            "Agrupamento de Movimentos de Povo difere do DOCX.")
    preliminary={
        x["paragrafo_docx"]:x for x in
        load("data/lore/hack-carcaca-dw-movimentos-selecionados.json")["movimentos"]}
    for m in movements:
        require(m["id"]=="movimento-integral:paragrafo-"+str(m["paragrafo_docx"]),
                f"ID e parágrafo não correspondem: {m['id']}")
        require(m["categoria"]=="povo" and bool(m["marcador_original"]) and
                len(m["texto_original"])>50,
                f"Movimento integral sem categoria/texto: {m['id']}")
        require(m["texto_integral_conferido"] is True and
                m["aplicacao_canonica"] is False and
                m["estado"]=="transcricao_integral_docx_em_revisao",
                f"Regras não podem ser aplicadas automaticamente: {m['id']}")
        require(m["requisito_verificado_no_cabecalho"] is True and
                m["requisito_explicito_no_cabecalho"] is None,
                "Não inventar REQUER em movimentos sem REQUER explícito.")
        if m["paragrafo_docx"] in preliminary:
            require(m["titulo"]==preliminary[m["paragrafo_docx"]]["titulo"],
                    "Movimento integral conflita com título previamente curado.")
        opts=m["opcoes"]
        require(all(o["texto"] and isinstance(o["paragrafo_docx"],int)
                    for o in opts), "Opção malformada.")
        if m["paragrafo_docx"]==837:
            require([o["paragrafo_docx"] for o in opts]==[838,839,840,841],
                    "Saqueador da Caatinga deve preservar as 4 opções do DOCX.")
            require("10+: escolha 2" in m["texto_original"]
                    and "7–9: escolha 1" in m["texto_original"],
                    "As faixas de resultado do saqueador devem permanecer intactas.")
        else:
            require(not opts,f"Opção ligada ao movimento incorreto: {m['id']}")
    tables=load("data/lore/hack-carcaca-dw-tabelas-docx.json")
    rows=tables["tabelas"]
    require(len(rows)==33, "DOCX original contém 33 tabelas.")
    require([x["tabela_docx_indice"] for x in rows]==list(range(33)),
            "Tabela faltante, duplicada ou deslocada.")
    require(Counter(x["tipo"] for x in rows)=={
        "quadro_narrativo":10,"tabela_numerica":2,"quadro_movimento_geral":21},
        "Inventário DOCX deve separar narrativa, números e movimentos gerais.")
    require(all(x["id"]=="tabela-docx:"+str(x["tabela_docx_indice"])
                and x["texto_integral_curado"] is False
                and x["aplicacao_canonica"] is False for x in rows),
            "Inventário de títulos não significa texto integral aprovado.")
    print("4a auditoria: 12 movimentos integrais (4 opções), 33 tabelas "
          "(21 quadros de movimentos gerais), zero aplicações automáticas.")

def validar_integracao_movimentos_gerais():
    """Garante integridade da quinta auditoria e separação entre transcrição e regra aprovada."""
    from hack_movimentos_gerais import compilar_movimentos_gerais,indexar_movimentos_gerais

    origem=load("data/lore/hack-carcaca-dw-quadros-integrais.json")
    inventario=load("data/lore/hack-carcaca-dw-tabelas-docx.json")["tabelas"]
    quadros=origem["quadros"]
    require(origem["origem_sha256"] ==
            "b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d",
            "Hash da fonte da 5a auditoria inesperado.")
    require(origem["schema_version"]=="0.1.0" and len(quadros)==21,
            "Fonte integral deve preservar as 21 tabelas de movimentos gerais.")
    require(sum(len(q["blocos"]) for q in quadros)==44,
            "Quinta auditoria deve preservar exatamente 44 blocos/células.")
    require(all(q["aplicacao_canonica"] is False and
                q["texto_integral_extraido"] is True for q in quadros),
            "Texto extraído não pode ser tratado como regra aprovada.")
    moves=compilar_movimentos_gerais(origem,inventario)
    ids=unique(moves,"movimentos gerais integrais")
    require(len(ids)==22 and
            sum(m["categoria"]=="basico" for m in moves)==8 and
            sum(m["categoria"]=="avancado" for m in moves)==13 and
            sum(m["categoria"]=="subsistema_servos" for m in moves)==1,
            "Foram identificadas 22 unidades distintas: 8 basicas, 13 avancadas e Servos.")
    quados_por_id={q["id"]:q for q in quadros}
    for move in moves:
        base=quados_por_id[move["quadro_id"]]
        cabecalho,corpo=(base["blocos"][i] for i in move["linhas_docx"])
        require(cabecalho["texto"]==move["titulo"] and
                corpo["texto"]==move["texto_original"],
                "Texto derivado perdeu correspondencia com a celula DOCX: "+move["id"])
        require(move["aplicacao_canonica"] is False and
                move["requisito_explicito"] is None and
                move["estado"]=="transcricao_integral_sem_revisao_semantica",
                "Nunca inferir REQUER ou promover regras automaticamente.")
        for marco in move["marcadores_resultado_literais"]:
            require(move["texto_original"].splitlines()[marco["linha"]]==marco["literal"],
                    "Marcador de faixa desconectado do texto original.")
        for gatilho in move["gatilhos_literais"]:
            require(move["texto_original"].splitlines()[gatilho["linha"]]==gatilho["literal"],
                    "Gatilho desconectado do texto original.")
    recrutamento=[m for m in moves if m["tabela_docx_indice"]==30]
    require({m["titulo"] for m in recrutamento}=={"RECRUTAR","MANDADOS PENDENTES"},
            "Mandados Pendentes nao pode ficar oculto dentro de Recrutar.")
    servos=[m for m in moves if m["titulo"]=="SERVOS"]
    require(len(servos)==1 and "LEALDADE DOS SERVOS" in servos[0]["texto_original"],
            "Subsistema de Lealdade dos Servos deve permanecer integral.")
    indices=indexar_movimentos_gerais(moves)
    require(len(indices["by_categoria"]["basico"])==8 and
            set(indices["by_quadro"]["quadro-geral-docx:30"])==
              {m["id"] for m in recrutamento},
            "Indice de movimentos gerais incompleto.")
    print("5a auditoria integrada: 21 quadros, 44 blocos, 22 unidades de regras, "
          "nenhuma promocao canonica.")


def validar_regras_nucleo_hack():
    """Conferência do núcleo de regras sem completar lacunas por inferência."""
    regras=load("data/lore/hack-carcaca-dw-regras-nucleo.json")
    require(regras["aplicacao_canonica"] is False, "Núcleo do Hack não altera saves.")
    p=regras["personagens"]
    require(p["atributos"]==["FOR","DES","CON","INT","SAB","CAR"] and
            p["valores_iniciais_para_distribuir"]==[16,15,13,12,9,8],
            "Atributos iniciais do Hack mudaram.")
    require(p["movimentos_proprios_nivel_1"]==5 and
            p["distribuicao_numerica_por_origem"] is None,
            "Não inventar distribuição numérica de movimentos entre origens.")
    tabelas=p["modificadores"]
    lookup={n:r["valor"] for r in tabelas for n in range(r["min"],r["max"]+1)}
    require(set(lookup)==set(range(3,19)) and
            [lookup[n] for n in p["valores_iniciais_para_distribuir"]]==[2,1,1,0,0,-1],
            "Modificadores iniciais inconsistentes.")
    pv=p["pv_maximos"]
    require(all(pv["constante"]+pv["multiplicador_mod_con"]*x["mod_con"]==x["pv"]
                for x in pv["exemplos"]), "A tabela de PV contraria a fórmula.")
    require(p["carga"]["constante"]==8 and p["carga"]["multiplicador_mod_for"]==1,
            "Carga deve ser 8 + mod. FOR.")
    d=regras["debilidades"]
    require(d["penalidade_modificador"]==-1 and d["altera_valor_bruto"] is False and
            d["acumula_mesma_debilidade"] is False and
            {x["atributo"] for x in d["tipos"]}==set(p["atributos"]),
            "Debilidades não correspondem ao Hack.")
    require([item["dado"] for item in regras["combate"]["dano_por_periculosidade"]]==
            ["1d4","1d6","1d8","1d10","1d12"],
            "Escala de Periculosidade diferente da fonte.")
    evo=regras["evolucao"]
    require(evo["limiar_xp"]["constante"]==7 and
            evo["ganho_pontos_atributo"]==1 and evo["atributo_maximo"]==18,
            "Evolução inconsistente com o documento.")
    print("Núcleo DW: seis atributos, cinco movimentos iniciais, PV, Carga, "
          "Periculosidade, Debilidades e XP validados sem presumir lacunas.")


def validar_integracao_personagens_hack():
    """Confere ancoragem DOCX e preserva os REQUER sem autorizar jogabilidade."""
    from collections import Counter
    from hack_movimentos_personagem import build_people_indexes,build_class_indexes
    povos=load("data/lore/hack-carcaca-dw-movimentos-povos-integrais.json")
    classes=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")
    fonte="b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d"
    require(povos["fonte_sha256"]==classes["fonte_sha256"]==fonte,
            "Catálogos devem usar o mesmo DOCX auditado.")
    race=povos["movimentos"]
    cls=classes["movimentos"]
    edges=classes["dependencias_exatas_candidatas"]
    pending=classes["dependencias_nao_resolvidas"]
    require(len(race)==107 and len({m["grupo"] for m in race})==18,
            "Cobertura de povos deve preservar 107 movimentos de 18 grupos.")
    require(len(cls)==632 and len({m["grupo"] for m in cls})==18,
            "Cobertura preliminar de classes deve preservar 632 títulos de 18 grupos.")
    unique(race,"movimentos de povos do DOCX")
    ids=unique(cls,"títulos de classe do DOCX")
    require(sum(len(x["opcoes"]) for x in race)==70,
            "As opções em parágrafos separados devem ser preservadas.")
    race_paras=set()
    for m in race:
        require(m["id"]=="movimento-povo:paragrafo-"+str(m["paragrafo_docx"]),
                "ID de movimento de povo divergente do parágrafo.")
        require(m["categoria"]=="povo" and m["estado"]=="transcricao_integral_sem_revisao_mecanica" and
                m["aplicacao_canonica"] is False and m["requisito_literal"] is None,
                "Movimentos de povo não podem ser aplicados ou ganhar REQUER por inferência.")
        require(m["texto_original"]=="\n".join(p["texto"] for p in m["partes"]),
                "O texto integral deve ser a concatenação literal das partes do DOCX.")
        require(m["partes"][0]["paragrafo_docx"]==m["paragrafo_docx"] and
                m["partes"][0]["tipo"]=="corpo",
                "Um movimento precisa começar no próprio parágrafo de origem.")
        require(m["opcoes"]==[{ "paragrafo_docx":p["paragrafo_docx"],"texto":p["texto"]}
                 for p in m["partes"] if p["tipo"]=="opcao"],
                "Opções dos movimentos não coincidem com List Paragraph.")
        for part in m["partes"]:
            require(part["paragrafo_docx"] not in race_paras,
                    "Parágrafo de raça foi atribuído mais de uma vez.")
            race_paras.add(part["paragrafo_docx"])
    piloto=load("data/lore/hack-carcaca-dw-movimentos-integrais-piloto.json")["movimentos"]
    por_para={m["paragrafo_docx"]:m for m in race}
    for old in piloto:
        new=por_para[old["paragrafo_docx"]]
        require(new["titulo"]==old["titulo"] and
                new["marcador_original"]==old["marcador_original"] and
                new["partes"][0]["texto"]==old["texto_original"] and
                new["opcoes"]==old["opcoes"],
                "O piloto de 12 movimentos não pode sofrer regressão.")
    require(sum(bool(m["requisito_literal"]) for m in cls)==270 and
            len(edges)==256 and len(pending)==14,
            "Integridade do inventário REQUER (256 candidatos + 14 não resolvidos).")
    require(all(m["id"]=="movimento-classe:paragrafo-"+str(m["paragrafo_docx"])
                and m["aplicacao_canonica"] is False
                and m["texto_integral_curado"] is False
                for m in cls),
            "Títulos extraídos não são movimentos semanticamente revisados.")
    requeridos={m["id"] for m in cls if m["requisito_literal"]}
    cobertos=([e["origem_movimento_id"] for e in edges] +
              [e["origem_movimento_id"] for e in pending])
    require(set(cobertos)==requeridos and len(cobertos)==len(set(cobertos)),
            "Todo REQUER deve aparecer uma única vez como candidato ou pendência.")
    para_id={m["id"]:m for m in cls}
    for e in edges:
        require(e["origem_movimento_id"] in ids and e["requisito_movimento_id"] in ids,
                "Referência quebrada no grafo de REQUER.")
        origem=para_id[e["origem_movimento_id"]]
        destino=para_id[e["requisito_movimento_id"]]
        require(origem["requisito_literal"]==e["requisito_literal"] and
                e["status"]=="vinculo_exato_a_confirmar" and
                e["aplicacao_canonica"] is False and origem["grupo"]==destino["grupo"],
                "Vínculos candidatos não podem criar permissões automáticas.")
    for p in pending:
        require(p["origem_movimento_id"] in ids and
                para_id[p["origem_movimento_id"]]["requisito_literal"]==p["requisito_literal"] and
                p["status"]=="exige_analise_editorial" and p["aplicacao_canonica"] is False,
                "Pendências REQUER não podem ser resolvidas por aproximação.")
    selecionados=load("data/lore/hack-carcaca-dw-movimentos-selecionados.json")["movimentos"]
    por_paragrafo_classe={m["paragrafo_docx"]:m for m in cls}
    for original in selecionados:
        if original["categoria"]=="classe":
            curado=por_paragrafo_classe[original["paragrafo_docx"]]
            require(original["titulo"]==curado["titulo"] and
                    original["requisito_literal"]==curado["requisito_literal"],
                    "O inventário de 632 títulos conflita com a terceira auditoria.")
    require(len(build_people_indexes(race)["by_grupo"])==18 and
            len(build_class_indexes(cls,edges,pending)["by_grupo"])==18,
            "Índices de povo/classe incompletos.")
    print("6o ciclo: 107 movimentos integrais de 18 povos; 632 títulos de classe; "
          "270 REQUER, dos quais 256 candidatos e 14 pendentes. Sem promoção canônica.")


def validar_guerreiro_integral():
    """Todos os 77 movimentos Guerreiro, opções e pré-requisitos são ancorados ao DOCX."""
    from collections import Counter
    from hack_movimentos_personagem import build_warrior_indexes
    raw=load("data/lore/hack-carcaca-dw-guerreiro-integrais.json")
    inventory=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")
    require(raw["fonte_sha256"]==inventory["fonte_sha256"] and
            raw["grupo"]=="GUERREIRO", "Fonte ou grupo Guerreiro inconsistentes.")
    moves=raw["movimentos"]
    listed={x["id"]:x for x in inventory["movimentos"] if x["grupo"]=="GUERREIRO"}
    all_ids={x["id"] for x in inventory["movimentos"]}
    require(len(moves)==len(listed)==77 and len(unique(moves,"guerreiro"))==77,
            "Todos os 77 títulos Guerreiro devem ter texto integral único.")
    assert len(moves)==77
    require([m["paragrafo_docx"] for m in moves]==sorted(m["paragrafo_docx"] for m in moves),
            "Ordem documental Guerreiro deslocada.")
    require(moves[0]["paragrafo_docx"]==1047 and moves[-1]["paragrafo_docx"]==1289,
            "Âncoras da classe Guerreiro alteradas.")
    require(raw["integridade"]=={
        "total_movimentos":77,"total_com_requer":30,"total_vinculos_exatos":27,
        "total_requer_composto_ou_condicional":3,"total_opcoes":137,
        "total_partes":235}, "Contagens documentais do Guerreiro mudaram.")
    occupied=set()
    mapping={m["id"]:m for m in moves}
    dependencies={}
    pending_special={}
    for m in moves:
        original=listed.get(m["id"])
        require(original is not None and m["paragrafo_docx"]==original["paragrafo_docx"]
                and m["titulo"]==original["titulo"] and
                m["requisito_literal"]==original["requisito_literal"],
                "Título/requisito Guerreiro divergente do inventário.")
        require(m["estado"]=="transcricao_integral_sem_revisao_mecanica" and
                m["texto_integral_conferido"] is True and m["aplicacao_canonica"] is False,
                "Movimento de Guerreiro não pode ser aplicado automaticamente.")
        require(m["texto_original"]=="\n".join(p["texto"] for p in m["partes"]),
                "Texto de Guerreiro não coincide com as partes do DOCX.")
        require(m["opcoes"]==[
            {"paragrafo_docx":p["paragrafo_docx"],"texto":p["texto"]}
            for p in m["partes"] if p["tipo"]=="opcao"],
            "Opções de Guerreiro não coincidem com seus parágrafos.")
        require(m["partes"][0]["paragrafo_docx"]==m["paragrafo_docx"] and
                m["partes"][0]["tipo"]=="corpo","Cabeçalho Guerreiro desconectado.")
        for p in m["partes"]:
            require(p["paragrafo_docx"] not in occupied and p["texto"],
                    "Parte duplicada ou vazia no Guerreiro.")
            occupied.add(p["paragrafo_docx"])
        req=m["requisito_estruturado"]
        require(bool(req)==bool(m["requisito_literal"]),
                "Requisito não deve surgir sem REQUER literal.")
        if req is not None:
            if req["tipo"]=="movimento_exato":
                require(req["movimento_id"] in all_ids and
                        req["status"]=="correspondencia_exata_na_fonte_pendente_homologacao",
                        "Vínculo exato não deve ser presumido como homologado.")
                dependencies[m["id"]]=req["movimento_id"]
            else:
                pending_special[m["paragrafo_docx"]]=req["tipo"]
                require(req["status"]=="interpretacao_literal_pendente_homologacao",
                        "Requisito composto e condicional requer análise.")
    require(len(occupied)==235,"Perda de parágrafos do Guerreiro.")
    require(len(dependencies)==27 and pending_special==
            {1228:"categoria",1229:"todos",1231:"movimento_condicionado"},
            "Interpretação de REQUER composto incompleta.")
    require(sum(len(m["opcoes"]) for m in moves)==137,
            "Listas de escolhas e opções do Guerreiro truncadas.")
    for src in dependencies:
        visited={src}
        curr=src
        while curr in dependencies:
            curr=dependencies[curr]
            require(curr not in visited, "Ciclo nas dependências Guerreiro.")
            visited.add(curr)
    index=build_warrior_indexes(moves)
    require(len(index["by_tem_requer"]["sim"])==30 and
            len(index["by_tem_opcoes"]["sim"])>0 and
            len(index["by_requisito_tipo"]["movimento_exato"])==27,
            "Índices de Guerreiro falharam na contagem.")
    print("Guerreiro: 77 movimentos integrais, 137 opções, 235 blocos,"
          " 27 REQUER exatos e 3 condicionais/compostos; zero promoções.")


def validar_barbaro_integral():
    """Valida as 59 fichas literais de Bárbaro sem conceder aquisição automática."""
    from hack_movimentos_personagem import build_barbarian_indexes
    raw=load("data/lore/hack-carcaca-dw-barbaro-integrais.json")
    inventory=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")
    require(raw["fonte_sha256"]==inventory["fonte_sha256"] and raw["grupo"]=="BÁRBARO",
            "Fonte ou grupo do Bárbaro divergentes.")
    moves=raw["movimentos"]
    listed={m["id"]:m for m in inventory["movimentos"] if m["grupo"]=="BÁRBARO"}
    all_by_id={m["id"]:m for m in inventory["movimentos"]}
    require(len(moves)==len(listed)==59 and len(unique(moves,"barbaro"))==59,
            "Bárbaro não contém todos os 59 movimentos.")
    require([m["paragrafo_docx"] for m in moves]==sorted(m["paragrafo_docx"] for m in moves)
            and moves[0]["paragrafo_docx"]==1293 and moves[-1]["paragrafo_docx"]==1447,
            "Âncoras documentais do Bárbaro alteradas.")
    require(raw["integridade"]=={
      "total_movimentos":59,"total_com_requer":37,"total_vinculos_exatos":36,
      "total_requer_composto_ou_condicional":1,"total_opcoes":84,"total_partes":156
    }, "Integridade de transcrição do Bárbaro alterada.")
    used=set()
    exact={}
    special=[]
    for m in moves:
        original=listed.get(m["id"])
        require(original is not None and
                m["titulo"]==original["titulo"] and
                m["paragrafo_docx"]==original["paragrafo_docx"] and
                m["requisito_literal"]==original["requisito_literal"],
                "Título ou requisito do Bárbaro diverge do inventário.")
        require(m["estado"]=="transcricao_integral_sem_revisao_mecanica" and
                m["texto_integral_conferido"] is True and
                m["aplicacao_canonica"] is False,
                "Movimento do Bárbaro não pode alterar estado canônico.")
        require(m["texto_original"]=="\n".join(p["texto"] for p in m["partes"]),
                "Texto original não corresponde aos parágrafos de origem.")
        require(m["opcoes"]==[
            {"paragrafo_docx":p["paragrafo_docx"],"texto":p["texto"]}
            for p in m["partes"] if p["tipo"]=="opcao"],
            "Escolhas do Bárbaro truncadas.")
        require(m["partes"][0]["paragrafo_docx"]==m["paragrafo_docx"] and
                m["partes"][0]["tipo"]=="corpo",
                "Primeiro parágrafo não contém o efeito do movimento.")
        for part in m["partes"]:
            require(part["paragrafo_docx"] not in used and bool(part["texto"]),
                    "Parágrafo duplicado ou vazio em Bárbaro.")
            used.add(part["paragrafo_docx"])
        req=m["requisito_estruturado"]
        require(bool(req)==bool(m["requisito_literal"]),"Requisito sem REQUER literal.")
        if req is None:
            continue
        if req["tipo"]=="movimento_exato":
            require(req["movimento_id"] in all_by_id and
                    req["titulo_requerido"]==all_by_id[req["movimento_id"]]["titulo"] and
                    req["status"]=="correspondencia_exata_na_fonte_pendente_homologacao",
                    "Vínculo exato não preservado.")
            exact[m["id"]]=req["movimento_id"]
        elif req["tipo"]=="todos":
            require(m["paragrafo_docx"]==1430 and
                    m["requisito_literal"]=="Fúria Divina e Demasiado Furioso Para Morrer" and
                    req["operador_literal"]=="e" and
                    req["status"]=="interpretacao_literal_pendente_homologacao",
                    "Fúria Além da Morte exige dois Movimentos, não apenas um.")
            nomes=[all_by_id[p["movimento_id"]]["titulo"] for p in req["itens"]]
            require(nomes==["FÚRIA DIVINA","DEMASIADO FURIOSO PARA MORRER"],
                    "Componentes do requisito composto do Bárbaro divergentes.")
            special.append(m["id"])
        else:
            raise AssertionError("Tipo de REQUER não documentado: "+req["tipo"])
    require(len(used)==156 and sum(len(m["opcoes"]) for m in moves)==84,
            "Bárbaro perdeu opções ou continuações.")
    require(len(exact)==36 and special==["movimento-classe:paragrafo-1430"],
            "Contagem de REQUER não corresponde ao DOCX.")
    for start in exact:
        current=start
        visited={start}
        while current in exact:
            current=exact[current]
            require(current not in visited, "Ciclo de pré-requisitos em Bárbaro.")
            visited.add(current)
    ix=build_barbarian_indexes(moves)
    require(len(ix["by_tem_requer"]["sim"])==37 and
            len(ix["by_requisito_tipo"]["movimento_exato"])==36 and
            ix["by_requisito_tipo"]["todos"]==["movimento-classe:paragrafo-1430"] and
            set(ix["by_requisito_id"]["movimento-classe:paragrafo-1427"]) >=
            {"movimento-classe:paragrafo-1430"},
            "Índices dos requisitos compostos do Bárbaro inconsistentes.")
    print("Bárbaro: 59 movimentos integrais, 84 opções, 156 partes; "
          "36 REQUER exatos e 1 composto. Sem promoção canônica.")


def validar_cacador_integral():
    """Preserva transcrição do Caçador, com REQUER de tipo direto, E, OU e ficcional."""
    from hack_movimentos_personagem import build_hunter_indexes
    raw=load("data/lore/hack-carcaca-dw-cacador-integrais.json")
    inventory=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")
    require(raw["fonte_sha256"]==inventory["fonte_sha256"] and
            raw["grupo"]=="CAÇADOR","Fonte/grupo do Caçador divergentes.")
    moves=raw["movimentos"]
    listed={m["id"]:m for m in inventory["movimentos"] if m["grupo"]=="CAÇADOR"}
    all_ids={m["id"] for m in inventory["movimentos"]}
    require(len(moves)==len(listed)==53 and len(unique(moves,"cacador"))==53,
            "Devem existir 53 movimentos distintos de Caçador.")
    require([m["paragrafo_docx"] for m in moves]==sorted(m["paragrafo_docx"] for m in moves)
            and moves[0]["paragrafo_docx"]==1455 and moves[-1]["paragrafo_docx"]==1582,
            "Âncoras DOCX do Caçador alteradas.")
    require(raw["integridade"]=={
      "total_movimentos":53,"total_com_requer":15,"total_vinculos_exatos":12,
      "total_requer_composto_ou_condicional":3,"total_opcoes":61,"total_partes":125
    },"Integridade documental do Caçador alterada.")
    used=set()
    direct={}
    special={}
    for m in moves:
        origin=listed.get(m["id"])
        require(origin is not None and m["titulo"]==origin["titulo"] and
                m["paragrafo_docx"]==origin["paragrafo_docx"] and
                m["requisito_literal"]==origin["requisito_literal"],
                "Caçador contradiz inventário de títulos e REQUER.")
        require(m["categoria"]=="classe" and
                m["estado"]=="transcricao_integral_sem_revisao_mecanica" and
                m["texto_integral_conferido"] is True and m["aplicacao_canonica"] is False,
                "Transcrição não deve modificar cânone ou aplicar movimento.")
        require(m["texto_original"]=="\n".join(p["texto"] for p in m["partes"]),
                "Texto do Caçador perdeu trecho original.")
        require(m["opcoes"]==[
            {"paragrafo_docx":p["paragrafo_docx"],"texto":p["texto"]}
            for p in m["partes"] if p["tipo"]=="opcao"],
            "Opções de Caçador divergentes de seus parágrafos.")
        require(m["partes"][0]["paragrafo_docx"]==m["paragrafo_docx"] and
                m["partes"][0]["tipo"]=="corpo","Movimento sem âncora de corpo.")
        for p in m["partes"]:
            require(p["texto"] and p["paragrafo_docx"] not in used,
                    "Parte vazia ou parágrafo duplicado de Caçador.")
            used.add(p["paragrafo_docx"])
        req=m["requisito_estruturado"]
        require(bool(req)==bool(m["requisito_literal"]),
                "Ausência de REQUER não autoriza inventá-lo.")
        if req:
            if req["tipo"]=="movimento_exato":
                require(req["movimento_id"] in all_ids and
                        req["status"]=="correspondencia_exata_na_fonte_pendente_homologacao",
                        "Vínculo literal não homologado do Caçador.")
                direct[m["id"]]=req["movimento_id"]
            else:
                special[m["paragrafo_docx"]]=req["tipo"]
                require(req["status"]=="interpretacao_literal_pendente_homologacao" and
                        len(req["itens"])==2 and req["operador_literal"] in ("e","ou"),
                        "Conjunção/disjunção especial não preservada.")
                for item in req["itens"]:
                    if item["tipo"]=="movimento_exato":
                        require(item["movimento_id"] in all_ids,
                                "Movimento exigido não existe no inventário.")
                    else:
                        require(item["tipo"]=="condicao_ficcional" and
                                item["texto_literal"]=="Um movimento que tenha revelado uma vulnerabilidade"
                                and m["paragrafo_docx"]==1492,
                                "Não transformar condição narrativa em movimento fictício.")
    require(len(used)==125 and len(direct)==12 and special==
            {1492:"qualquer",1520:"todos",1535:"qualquer"},
            "Relações ou partes de Caçador não estão completas.")
    for source in direct:
        seen={source}
        target=source
        while target in direct:
            target=direct[target]
            require(target not in seen,"Ciclo no grafo de REQUER do Caçador.")
            seen.add(target)
    idx=build_hunter_indexes(moves)
    require(len(idx["by_tem_requer"]["sim"])==15 and
            len(idx["by_requisito_tipo"]["movimento_exato"])==12 and
            len(idx["by_requisito_tipo"]["qualquer"])==2 and
            len(idx["by_requisito_tipo"]["todos"])==1 and
            idx["by_condicao_ficcional"]["sim"]==["movimento-classe:paragrafo-1492"],
            "Índices e condições ficcionais do Caçador inconsistentes.")
    print("Caçador: 53 movimentos integrais, 61 opções, 125 partes, "
          "12 requisitos diretos, 3 especiais, zero promoções.")


def validar_ladino_integral():
    """Conserva os 52 movimentos de Ladino e bloqueia REQUER 'Perfil' sem alvo."""
    from hack_movimentos_personagem import build_rogue_indexes
    raw=load("data/lore/hack-carcaca-dw-ladino-integrais.json")
    inv=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")
    require(raw["fonte_sha256"]==inv["fonte_sha256"] and raw["grupo"]=="LADINO",
            "Fonte ou grupo Ladino incorretos.")
    moves=raw["movimentos"]
    listed={m["id"]:m for m in inv["movimentos"] if m["grupo"]=="LADINO"}
    all_by_id={m["id"]:m for m in inv["movimentos"]}
    require(len(moves)==len(listed)==52 and len(unique(moves,"ladino"))==52,
            "O Ladino exige 52 movimentos distintos.")
    require([m["paragrafo_docx"] for m in moves]==sorted(m["paragrafo_docx"] for m in moves)
            and moves[0]["paragrafo_docx"]==1588 and moves[-1]["paragrafo_docx"]==1742,
            "Âncoras dos movimentos Ladino mudaram.")
    require(raw["integridade"]=={
      "total_movimentos":52,"total_com_requer":6,"total_vinculos_exatos":4,
      "total_requer_composto_ou_condicional":1,"total_requer_sem_alvo":1,
      "total_opcoes":89,"total_partes":156},
      "Contagem de blocos, opções ou requisitos mudou.")
    occupied=set();edges={};special={}
    for m in moves:
        original=listed.get(m["id"])
        require(original is not None and m["titulo"]==original["titulo"] and
                m["paragrafo_docx"]==original["paragrafo_docx"] and
                m["requisito_literal"]==original["requisito_literal"],
                "Título ou REQUER diverge do inventário: "+m["id"])
        require(m["estado"]=="transcricao_integral_sem_revisao_mecanica" and
                m["texto_integral_conferido"] is True and
                m["aplicacao_canonica"] is False,
                "A transcrição não pode alterar o cânone nem aprovar movimento.")
        require(m["texto_original"]=="\n".join(p["texto"] for p in m["partes"]),
                "Perda de trecho de Ladino em "+m["id"])
        require(m["opcoes"]==[
            {"paragrafo_docx":p["paragrafo_docx"],"texto":p["texto"]}
            for p in m["partes"] if p["tipo"]=="opcao"],
                "Opções de Ladino não acompanham as partes documentais.")
        require(m["partes"][0]["paragrafo_docx"]==m["paragrafo_docx"] and
                m["partes"][0]["tipo"]=="corpo", "Primeira parte do movimento incorreta.")
        for part in m["partes"]:
            require(part["paragrafo_docx"] not in occupied and part["texto"],
                    "Índice documental duplicado ou vazio.")
            occupied.add(part["paragrafo_docx"])
        req=m["requisito_estruturado"]
        require(bool(req)==bool(m["requisito_literal"]),
                "Dependência só existe com REQUER literal.")
        if not req:continue
        if req["tipo"]=="movimento_exato":
            require(req["movimento_id"] in all_by_id and
                    req["titulo_requerido"]==all_by_id[req["movimento_id"]]["titulo"] and
                    req["status"]=="correspondencia_exata_na_fonte_pendente_homologacao",
                    "Dependência direta não coincide com a fonte.")
            edges[m["id"]]=req["movimento_id"]
        elif req["tipo"]=="qualquer":
            require(m["paragrafo_docx"]==1619 and
                    m["requisito_literal"]=="Heist ou Plano B" and
                    req["operador_literal"]=="ou" and
                    req["status"]=="interpretacao_literal_pendente_homologacao",
                    "Tudo Segundo o Plano requer Heist OU Plano B.")
            require([all_by_id[item["movimento_id"]]["titulo"] for item in req["itens"]]==
                    ["HEIST","PLANO B"],"Alternativas de Ladino alteradas.")
            special[1619]="qualquer"
        elif req["tipo"]=="referencia_sem_alvo":
            require(m["paragrafo_docx"]==1724 and
                    m["requisito_literal"]=="Perfil" and
                    req["texto_literal"]=="Perfil" and
                    req["candidatos_confirmados"]==[] and
                    req["status"]=="exige_revisao_autoral_antes_de_qualquer_aquisicao" and
                    not any(x["titulo"]=="PERFIL" for x in inv["movimentos"]),
                    "Perfil não foi encontrado; não deve ser inventado ou ignorado.")
            special[1724]="referencia_sem_alvo"
        else:raise AssertionError("Tipo de requisito inesperado: "+req["tipo"])
    require(len(occupied)==156 and sum(len(m["opcoes"]) for m in moves)==89,
            "Ladino perdeu parágrafos ou opções.")
    require(len(edges)==4 and special=={1619:"qualquer",1724:"referencia_sem_alvo"},
            "Contagem de vínculos do Ladino mudou.")
    for source in edges:
        seen={source};node=source
        while node in edges:
            node=edges[node]
            require(node not in seen,"Ciclo de pré-requisitos Ladino detectado.")
            seen.add(node)
    ix=build_rogue_indexes(moves)
    require(len(ix["by_requisito_tipo"]["movimento_exato"])==4 and
            ix["by_requisito_tipo"]["qualquer"]==["movimento-classe:paragrafo-1619"] and
            ix["by_referencia_sem_alvo"]["Perfil"]==["movimento-classe:paragrafo-1724"] and
            set(ix["by_requisito_id"]["movimento-classe:paragrafo-1612"]) >=
                {"movimento-classe:paragrafo-1619"},
            "Índices de Ladino perderam REQUER OU ou sem alvo.")
    print("Ladino: 52 movimentos, 89 opções, 156 blocos; 4 requisitos exatos,"
          " um OU e Perfil sem alvo. Sem aplicação automática.")


def validar_bardo_integral():
    """Verifica 32 movimentos de Bardo sem converter REQUER cardinal em vínculo único."""
    from hack_movimentos_personagem import build_bard_indexes
    raw=load("data/lore/hack-carcaca-dw-bardo-integrais.json")
    inv=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")
    require(raw["grupo"]=="BARDO" and raw["fonte_sha256"]==inv["fonte_sha256"],
            "A origem documental do Bardo não confere.")
    moves=raw["movimentos"]
    catalog={x["id"]:x for x in inv["movimentos"] if x["grupo"]=="BARDO"}
    all_catalog={x["id"]:x for x in inv["movimentos"]}
    require(len(moves)==len(catalog)==32 and len(unique(moves,"bardo"))==32,
            "São esperados 32 movimentos únicos de Bardo.")
    require(moves[0]["paragrafo_docx"]==1753 and moves[-1]["paragrafo_docx"]==1851
            and [x["paragrafo_docx"] for x in moves]==
                sorted(x["paragrafo_docx"] for x in moves),
            "A posição documental dos movimentos mudou.")
    expected={
        "total_movimentos":32,"total_com_requer":5,"total_vinculos_exatos":4,
        "total_requer_composto_ou_condicional":1,
        "total_opcoes":34,"total_partes":103
    }
    require(raw["integridade"]==expected,"Contagens de Bardo não correspondem ao DOCX.")
    occupied=set();direct={};special=[]
    for m in moves:
        origin=catalog.get(m["id"])
        require(origin and m["titulo"]==origin["titulo"] and
                m["paragrafo_docx"]==origin["paragrafo_docx"] and
                m["requisito_literal"]==origin["requisito_literal"],
                "Inventário e transcrição divergentes: "+m["id"])
        require(m["estado"]=="transcricao_integral_sem_revisao_mecanica" and
                m["texto_integral_conferido"] is True and
                m["aplicacao_canonica"] is False,
                "Transcrição não é homologação do movimento.")
        require(m["texto_original"]=="\n".join(p["texto"] for p in m["partes"]),
                "Texto original do movimento perdeu trechos.")
        require(m["opcoes"]==[
            {"paragrafo_docx":p["paragrafo_docx"],"texto":p["texto"]}
            for p in m["partes"] if p["tipo"]=="opcao"],
                "As opções não conferem com o documento.")
        require(m["partes"][0]["paragrafo_docx"]==m["paragrafo_docx"] and
                m["partes"][0]["tipo"]=="corpo",
                "Movimento sem parágrafo inicial de corpo.")
        for part in m["partes"]:
            require(part["paragrafo_docx"] not in occupied and part["texto"],
                    "Parágrafo duplicado ou vazio na transcrição de Bardo.")
            occupied.add(part["paragrafo_docx"])
        req=m["requisito_estruturado"]
        require(bool(req)==bool(m["requisito_literal"]),
                "Não inventar requisito sem REQUER explícito.")
        if not req:continue
        if req["tipo"]=="movimento_exato":
            require(req["movimento_id"] in all_catalog and
                    req["titulo_requerido"]==all_catalog[req["movimento_id"]]["titulo"] and
                    req["status"]=="correspondencia_exata_na_fonte_pendente_homologacao",
                    "Alvo direto não corresponde ao requisito literal.")
            direct[m["id"]]=req["movimento_id"]
        elif req["tipo"]=="todos":
            require(m["paragrafo_docx"]==1843 and
                    m["requisito_literal"]==
                        "Arte Arcana e dois outros Movimentos de Bardo" and
                    req["operador_literal"]=="e" and len(req["itens"])==2 and
                    req["status"]=="interpretacao_literal_pendente_homologacao",
                    "Canção que Fez o Mundo exige REQUER cumulativo.")
            exact,quantity=req["itens"]
            require(exact["tipo"]=="movimento_exato" and
                    exact["movimento_id"]=="movimento-classe:paragrafo-1753" and
                    quantity["tipo"]=="quantidade_movimentos_grupo" and
                    quantity["grupo"]=="BARDO" and quantity["quantidade_minima"]==2 and
                    set(quantity["excluir_movimentos_ids"])==
                        {"movimento-classe:paragrafo-1753",m["id"]} and
                    quantity["status"]=="quantidade_por_titulos_candidatos_pendente_homologacao",
                    "Arte Arcana deve somar DOIS OUTROS movimentos distintos, sem dupla contagem.")
            special.append(m["id"])
        else:raise AssertionError("REQUER inesperado de Bardo: "+req["tipo"])
    require(len(occupied)==103 and sum(len(m["opcoes"]) for m in moves)==34 and
            len(direct)==4 and special==["movimento-classe:paragrafo-1843"],
            "Trechos, opções ou requisitos perdidos no Bardo.")
    for source in direct:
        seen={source};node=source
        while node in direct:
            node=direct[node]
            require(node not in seen,"Dependência cíclica nos REQUER de Bardo.")
            seen.add(node)
    ix=build_bard_indexes(moves)
    require(len(ix["by_requisito_tipo"]["movimento_exato"])==4 and
            ix["by_requisito_tipo"]["todos"]==special and
            ix["by_quantidade_minima_grupo"]["BARDO:2"]==special and
            "movimento-classe:paragrafo-1843" in
               ix["by_requisito_id"]["movimento-classe:paragrafo-1753"],
            "Índices de Bardo perderam a cardinalidade do requisito.")
    print("Bardo: 32 movimentos integrais, 34 opções, 103 partes, "
          "4 REQUER diretos e 1 cardinal, sem promoção ao cânone.")



def validar_artista_marcial_integral():
    """Confere 42 movimentos integrais do Artista Marcial e a conjunção de VOO."""
    from hack_movimentos_personagem import build_martial_artist_indexes
    raw=load("data/lore/hack-carcaca-dw-artista-marcial-integrais.json")
    inv=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")
    require(raw["grupo"]=="ARTISTA MARCIAL" and raw["fonte_sha256"]==inv["fonte_sha256"],
            "Fonte do Artista Marcial não corresponde ao inventário.")
    moves=raw["movimentos"]
    listed={m["id"]:m for m in inv["movimentos"] if m["grupo"]=="ARTISTA MARCIAL"}
    all_by_id={m["id"]:m for m in inv["movimentos"]}
    require(len(moves)==len(listed)==42 and len(unique(moves,"artista marcial"))==42,
            "Todos os 42 movimentos do Artista Marcial precisam ser únicos.")
    require([m["paragrafo_docx"] for m in moves]==sorted(m["paragrafo_docx"] for m in moves)
            and moves[0]["paragrafo_docx"]==1862 and moves[-1]["paragrafo_docx"]==1963,
            "Âncoras documentais Artista Marcial divergentes.")
    require(raw["integridade"]=={
        "total_movimentos":42,"total_com_requer":19,"total_vinculos_exatos":18,
        "total_requer_composto_ou_condicional":1,"total_opcoes":54,"total_partes":101},
        "Movimentos/partes/opções Artista Marcial não conferem.")
    seen=set();direct={};special=[]
    for m in moves:
        old=listed.get(m["id"])
        require(old is not None and m["paragrafo_docx"]==old["paragrafo_docx"]
                and m["titulo"]==old["titulo"]
                and m["requisito_literal"]==old["requisito_literal"],
                "Título ou requisito divergente: "+m["id"])
        require(m["texto_integral_conferido"] is True
                and m["aplicacao_canonica"] is False
                and m["estado"]=="transcricao_integral_sem_revisao_mecanica",
                "Movimento não pode ser promovido ao cânone automaticamente.")
        require(m["texto_original"]=="\n".join(p["texto"] for p in m["partes"]),
                "Texto perde continuação na fonte: "+m["id"])
        require(m["opcoes"]==[
            {"paragrafo_docx":p["paragrafo_docx"],"texto":p["texto"]}
            for p in m["partes"] if p["tipo"]=="opcao"],
            "Opções não correspondem aos parágrafos do manuscrito.")
        require(m["partes"][0]["paragrafo_docx"]==m["paragrafo_docx"]
                and m["partes"][0]["tipo"]=="corpo",
                "Corpo inicial sem âncora do DOCX.")
        for part in m["partes"]:
            require(part["paragrafo_docx"] not in seen and bool(part["texto"]),
                    "Parte textual repetida ou vazia.")
            seen.add(part["paragrafo_docx"])
        req=m["requisito_estruturado"]
        require(bool(req)==bool(m["requisito_literal"]),
                "Não criar ou dispensar REQUER sem literal.")
        if not req: continue
        if req["tipo"]=="movimento_exato":
            require(req["movimento_id"] in all_by_id
                    and req["titulo_requerido"]==all_by_id[req["movimento_id"]]["titulo"]
                    and req["status"]=="correspondencia_exata_na_fonte_pendente_homologacao",
                    "Requisito direto não identificado literalmente.")
            direct[m["id"]]=req["movimento_id"]
        elif req["tipo"]=="todos":
            require(m["id"]=="movimento-classe:paragrafo-1962"
                    and m["requisito_literal"]=="Forma do Ar e Corpo Sem Peso"
                    and req["operador_literal"]=="e"
                    and req["status"]=="interpretacao_literal_pendente_homologacao",
                    "VOO exige conjunção, não alternativa.")
            itens=req["itens"]
            require([x["tipo"] for x in itens]==["movimento_exato","movimento_exato"]
                    and [all_by_id[x["movimento_id"]]["titulo"] for x in itens]
                    ==["FORMA DO AR","CORPO SEM PESO"]
                    and all(x["movimento_id"]!=m["id"] for x in itens),
                    "VOO exige Forma do Ar E Corpo Sem Peso, sem auto-dependência.")
            special.append(m["id"])
        else:
            raise AssertionError("Tipo de REQUER desconhecido em Artista Marcial.")
    require(len(seen)==101 and sum(len(m["opcoes"]) for m in moves)==54
            and len(direct)==18 and special==["movimento-classe:paragrafo-1962"],
            "Integridade mecânica/estrutural dos movimentos divergente.")
    for src in direct:
        node=src; seen_reqs={src}
        while node in direct:
            node=direct[node]
            require(node not in seen_reqs,"Ciclo de REQUER direto em Artista Marcial.")
            seen_reqs.add(node)
    ix=build_martial_artist_indexes(moves)
    require(len(ix["by_requisito_tipo"]["movimento_exato"])==18
            and ix["by_requisito_tipo"]["todos"]==special
            and set(ix["by_requisito_id"]["movimento-classe:paragrafo-1949"])
            >=set(special)
            and set(ix["by_requisito_id"]["movimento-classe:paragrafo-1950"])
            >=set(special),
            "Índices de pré-requisitos Artista Marcial inconsistentes.")
    print("Artista Marcial: 42 movimentos, 54 opções, 101 partes; "
          "18 REQUER diretos e VOO composto. Sem promoção canônica.")


def validar_paladino_integral():
    """Preserva movimentos, REQUER e concessoes gratuitas sem homologacao."""
    from hack_movimentos_personagem import build_paladin_indexes
    obj=json.loads(gzip.decompress((ROOT/"data/lore/hack-carcaca-dw-paladino-integrais.json.gz").read_bytes()).decode("utf-8"))
    inv=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")
    require(obj["fonte_sha256"]==inv["fonte_sha256"] and obj["grupo"]=="PALADINO",
            "Fonte Paladino divergente.")
    moves=obj["movimentos"]
    listed={m["id"]:m for m in inv["movimentos"] if m["grupo"]=="PALADINO"}
    require(len(moves)==len(listed)==28 and len(unique(moves,"paladino"))==28,"Faltam movimentos Paladino.")
    require(moves[0]["paragrafo_docx"]==1968 and moves[-1]["paragrafo_docx"]==2048,
            "Ancoras Paladino deslocadas.")
    expected={"total_movimentos":28,"total_com_requer":13,
              "total_vinculos_exatos":13,"total_opcoes":47,"total_partes":83,
              "total_concessoes_gratuitas_literais":2}
    require(obj["integridade"]==expected,"Contagens de Paladino alteradas.")
    by_id={m["id"]:m for m in moves}
    parts_seen=set();edges={}
    for m in moves:
        old=listed.get(m["id"])
        require(old is not None and m["titulo"]==old["titulo"] and
                m["requisito_literal"]==old["requisito_literal"] and
                m["paragrafo_docx"]==old["paragrafo_docx"],
                "Titulo/REQUER do Paladino divergente.")
        require(m["texto_integral_conferido"] is True and
                m["aplicacao_canonica"] is False and
                m["estado"]=="transcricao_integral_sem_revisao_mecanica",
                "Sem promocao canonica.")
        require(m["texto_original"]=="\n".join(p["texto"] for p in m["partes"]),
                "Texto original desconectado.")
        require(m["opcoes"]==[
          {"paragrafo_docx":p["paragrafo_docx"],"texto":p["texto"]}
          for p in m["partes"] if p["tipo"]=="opcao"],"Opcoes truncadas.")
        require(m["partes"][0]["tipo"]=="corpo" and
                m["partes"][0]["paragrafo_docx"]==m["paragrafo_docx"],
                "Corpo sem origem.")
        for part in m["partes"]:
            require(part["paragrafo_docx"] not in parts_seen and part["texto"],
                    "Parte repetida/vazia.")
            parts_seen.add(part["paragrafo_docx"])
        req=m["requisito_estruturado"]
        require(bool(req)==bool(m["requisito_literal"]),"REQUER divergente.")
        if req:
            require(req["tipo"]=="movimento_exato" and req["movimento_id"] in listed
                    and req["status"]=="correspondencia_exata_na_fonte_pendente_homologacao"
                    and req["titulo_requerido"]==by_id[req["movimento_id"]]["titulo"],
                    "Alvo de REQUER invalido.")
            edges[m["id"]]=req["movimento_id"]
        grants=m["concessoes_gratuitas_literais"]
        if m["titulo"]=="MISSÃO SAGRADA":
            require([x["titulo"] for x in grants]==["JURAMENTO QUEBRADO","PENITÊNCIA"],
                    "Concessoes livres ausentes.")
            require("Você também recebe livremente os movimentos Juramento Quebrado e Penitência." in m["texto_original"],
                    "Literal de concessao ausente.")
            for x in grants:
                require(x["requer_permanece_obrigatorio"] is True and
                        x["aplicacao_automatica"] is False and
                        by_id[x["movimento_id"]]["requisito_estruturado"]["movimento_id"]==m["id"],
                        "Movimento gratuito nao pode dispensar REQUER.")
        else:
            require(not grants,"Concessao inventada.")
    require(len(parts_seen)==83 and sum(len(m["opcoes"]) for m in moves)==47
            and len(edges)==13,"Partes/opcoes/dependencias incompletas.")
    for start in edges:
        seen={start};at=start
        while at in edges:
            at=edges[at]
            require(at not in seen,"Ciclo de REQUER.")
            seen.add(at)
    ix=build_paladin_indexes(moves)
    require(len(ix["by_tem_requer"]["sim"])==13 and
            ix["by_movimento_concedido"]["movimento-classe:paragrafo-1976"]==
            ["movimento-classe:paragrafo-1968"] and
            ix["by_movimento_concedido"]["movimento-classe:paragrafo-1977"]==
            ["movimento-classe:paragrafo-1968"],"Indices de Paladino inconsistentes.")
    print("Paladino: 28 movimentos, 47 opcoes, 83 partes, 13 REQUER, 2 concessoes livres.")


def validar_clerigo_integral():
    """Confere 37 movimentos, 19 REQUER diretos e cadeias independentes do sacerdocio."""
    from hack_movimentos_personagem import build_cleric_indexes
    raw=json.loads(gzip.decompress((ROOT/"data/lore/hack-carcaca-dw-clerigo-integrais.json.gz").read_bytes()).decode("utf-8"))
    inv=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")
    require(raw["fonte_sha256"]==inv["fonte_sha256"] and raw["grupo"]=="CLÉRIGO",
            "Fonte Clérigo divergente do inventário.")
    moves=raw["movimentos"]
    originals={m["id"]:m for m in inv["movimentos"] if m["grupo"]=="CLÉRIGO"}
    require(len(moves)==len(originals)==37 and len(unique(moves,"clerigo"))==37,
            "Faltam movimentos originais do Clérigo.")
    require([m["paragrafo_docx"] for m in moves]==sorted(m["paragrafo_docx"] for m in moves)
            and moves[0]["paragrafo_docx"]==2056 and moves[-1]["paragrafo_docx"]==2126,
            "Âncoras do Clérigo alteradas.")
    expected={"total_movimentos":37,"total_com_requer":19,"total_vinculos_exatos":19,
              "total_opcoes":26,"total_partes":68,"total_concessoes_gratuitas_literais":0}
    require(raw["integridade"]==expected,"Contagens integrais do Clérigo divergentes.")
    by_id={m["id"]:m for m in moves}
    parts=set();edges={}
    for m in moves:
        old=originals.get(m["id"])
        require(old is not None and m["titulo"]==old["titulo"] and
                m["paragrafo_docx"]==old["paragrafo_docx"] and
                m["requisito_literal"]==old["requisito_literal"],
                "Movimento ou REQUER divergente da fonte.")
        require(m["texto_integral_conferido"] is True and
                m["aplicacao_canonica"] is False and
                m["estado"]=="transcricao_integral_sem_revisao_mecanica",
                "Clérigo não pode ser aplicado automaticamente.")
        require(m["texto_original"]=="\n".join(p["texto"] for p in m["partes"]),
                "Texto Clérigo desconectado das partes originais.")
        require(m["opcoes"]==[
                  {"paragrafo_docx":p["paragrafo_docx"],"texto":p["texto"]}
                  for p in m["partes"] if p["tipo"]=="opcao"],
                "Opções documentais Clérigo incompletas.")
        require(m["partes"][0]["paragrafo_docx"]==m["paragrafo_docx"] and
                m["partes"][0]["tipo"]=="corpo",
                "Corpo sem origem documental Clérigo.")
        for part in m["partes"]:
            require(part["paragrafo_docx"] not in parts and part["texto"],
                    "Parte duplicada/vazia Clérigo.")
            parts.add(part["paragrafo_docx"])
        require(not m.get("concessoes_gratuitas_literais"),
                "Não há concessões gratuitas nos movimentos de Clérigo auditados.")
        req=m["requisito_estruturado"]
        require(bool(req)==bool(m["requisito_literal"]), "REQUER não deve ser inferido.")
        if req:
            require(req["tipo"]=="movimento_exato" and req["movimento_id"] in originals
                    and req["titulo_requerido"]==by_id[req["movimento_id"]]["titulo"]
                    and req["status"]=="correspondencia_exata_na_fonte_pendente_homologacao",
                    "Clérigo tem pré-requisito não homologado ou sem alvo literal.")
            edges[m["id"]]=req["movimento_id"]
    require(len(parts)==68 and sum(len(m["opcoes"]) for m in moves)==26
            and len(edges)==19,"Contagem de opções/partes/REQUER inconsistente.")
    for start in edges:
        at=start;visited={start}
        while at in edges:
            at=edges[at]
            require(at not in visited,"Ciclo de REQUER na classe Clérigo.")
            visited.add(at)
    ix=build_cleric_indexes(moves)
    require(len(ix["by_tem_requer"]["sim"])==19
            and len(ix["by_requisito_tipo"]["movimento_exato"])==19,
            "Índice Clérigo perdeu dependências.")
    groups={"movimento-classe:paragrafo-2056":5,
            "movimento-classe:paragrafo-2084":2,
            "movimento-classe:paragrafo-2089":5,
            "movimento-classe:paragrafo-2102":1,
            "movimento-classe:paragrafo-2103":1,
            "movimento-classe:paragrafo-2112":5}
    require({k:len(v) for k,v in ix["by_raiz_dependencia"].items()}==groups,
            "Clérigo deve preservar seis raízes de dependência independentes.")
    require(edges["movimento-classe:paragrafo-2100"]=="movimento-classe:paragrafo-2099",
            "PELE ESCRITA exige RUNA VIVA, não apenas RUNA.")
    print("Clérigo: 37 movimentos, 26 opções, 68 partes e 19 REQUER diretos; seis raízes, sem aplicação canônica.")


def validar_druida_integral():
    """Valida 27 movimentos, suas opções e conjunção de Forma Primordial."""
    from hack_movimentos_personagem import build_druid_indexes
    raw=load("data/lore/hack-carcaca-dw-druida-integrais.json")
    inv=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")
    require(raw["fonte_sha256"]==inv["fonte_sha256"] and raw["grupo"]=="DRUIDA",
            "Fonte ou grupo DRUIDA inconsistentes.")
    moves=raw["movimentos"]
    listed={m["id"]:m for m in inv["movimentos"] if m["grupo"]=="DRUIDA"}
    require(len(moves)==len(listed)==27 and len(unique(moves,"druida"))==27,
            "Druida precisa manter 27 movimentos únicos.")
    require(moves[0]["paragrafo_docx"]==2130 and moves[-1]["paragrafo_docx"]==2199
            and [m["paragrafo_docx"] for m in moves]==sorted(m["paragrafo_docx"] for m in moves),
            "Ordem documental Druida divergente.")
    expected={"total_movimentos":27,"total_com_requer":13,"total_vinculos_exatos":12,
              "total_requer_composto_ou_condicional":1,"total_opcoes":42,"total_partes":74}
    require(raw["integridade"]==expected,"Contagens integrais de Druida divergentes.")
    by_id={m["id"]:m for m in moves}
    used=set();connections={};special=[]
    for m in moves:
        old=listed.get(m["id"])
        require(old is not None and m["titulo"]==old["titulo"]
                and m["paragrafo_docx"]==old["paragrafo_docx"]
                and m["requisito_literal"]==old["requisito_literal"],
                "Título ou REQUER divergente no Druida.")
        require(m["texto_integral_conferido"] is True and
                m["aplicacao_canonica"] is False and
                m["estado"]=="transcricao_integral_sem_revisao_mecanica",
                "Movimento de Druida não pode ser promovido automaticamente.")
        require(m["texto_original"]=="\n".join(p["texto"] for p in m["partes"]),
                "Texto Druida não corresponde às partes.")
        require(m["opcoes"]==[
                {"paragrafo_docx":p["paragrafo_docx"],"texto":p["texto"]}
                for p in m["partes"] if p["tipo"]=="opcao"],
                "Opções de Druida não correspondem às listas.")
        require(m["partes"][0]["tipo"]=="corpo"
                and m["partes"][0]["paragrafo_docx"]==m["paragrafo_docx"],
                "Corpo de Druida não corresponde à âncora.")
        for p in m["partes"]:
            require(p["paragrafo_docx"] not in used and bool(p["texto"]),
                    "Parágrafo de Druida duplicado ou vazio.")
            used.add(p["paragrafo_docx"])
        req=m["requisito_estruturado"]
        require(bool(req)==bool(m["requisito_literal"]), "REQUER inferido ou perdido.")
        if not req:continue
        if req["tipo"]=="movimento_exato":
            require(req["movimento_id"] in by_id
                    and req["titulo_requerido"]==by_id[req["movimento_id"]]["titulo"]
                    and req["status"]=="correspondencia_exata_na_fonte_pendente_homologacao",
                    "REQUER direto inconsistente ou homologado.")
            connections[m["id"]]=[req["movimento_id"]]
        elif req["tipo"]=="todos":
            require(m["id"]=="movimento-classe:paragrafo-2146"
                    and m["requisito_literal"]=="Metamorfose e Maestria Elemental"
                    and req["operador_literal"]=="e"
                    and req["status"]=="interpretacao_literal_pendente_homologacao",
                    "FORMA PRIMORDIAL exige conjunção de dois movimentos.")
            itens=req["itens"]
            require([x["tipo"] for x in itens]==["movimento_exato","movimento_exato"]
                    and [x["movimento_id"] for x in itens]==[
                        "movimento-classe:paragrafo-2130","movimento-classe:paragrafo-2131"]
                    and [x["titulo_requerido"] for x in itens]==["METAMORFOSE","MAESTRIA ELEMENTAL"],
                    "Elementos de FORMA PRIMORDIAL perdidos.")
            connections[m["id"]]=[x["movimento_id"] for x in itens]
            special.append(m["id"])
        else:
            raise AssertionError("Tipo inesperado de REQUER em Druida.")
    require(len(used)==74 and sum(len(m["opcoes"]) for m in moves)==42
            and len(connections)==13 and special==["movimento-classe:paragrafo-2146"],
            "Integridade de partes ou dependências Druida alterada.")
    def visitar(node,active):
        require(node not in active,"Ciclo em REQUER de Druida.")
        for child in connections.get(node,[]):
            require(child in by_id,"REQUER com alvo fora de Druida.")
            visitar(child,active|{node})
    for node in connections:
        visitar(node,set())
    ix=build_druid_indexes(moves)
    require(len(ix["by_tem_requer"]["sim"])==13
            and len(ix["by_requisito_tipo"]["movimento_exato"])==12
            and ix["by_requisito_tipo"]["todos"]==["movimento-classe:paragrafo-2146"],
            "Índices Druida não preservam REQUER composto.")
    expected_refs={"movimento-classe:paragrafo-2130":8,
                   "movimento-classe:paragrafo-2131":1,
                   "movimento-classe:paragrafo-2137":3,
                   "movimento-classe:paragrafo-2141":2}
    require({k:len(v) for k,v in ix["by_requisito_id"].items()}==expected_refs,
            "Ramos druídicos não correspondem ao manuscrito.")
    print("Druida: 27 movimentos, 42 opções, 74 partes; 12 REQUER diretos e 1 conjunção. Zero promoção canônica.")


def validar_mago_integral():
    """Confere os 42 movimentos e 21 REQUER diretos preservando os 14 ramos."""
    from hack_movimentos_personagem import build_mage_indexes
    raw=json.loads(gzip.decompress((ROOT/"data/lore/hack-carcaca-dw-mago-integrais.json.gz").read_bytes()).decode("utf-8"))
    inv=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")
    require(raw["fonte_sha256"]==inv["fonte_sha256"] and raw["grupo"]=="MAGO",
            "Fonte Mago divergente do inventario.")
    moves=raw["movimentos"]
    listed={m["id"]:m for m in inv["movimentos"] if m["grupo"]=="MAGO"}
    require(len(moves)==len(listed)==42 and len(unique(moves,"mago"))==42,
            "Movimentos Mago faltantes ou duplicados.")
    require([m["paragrafo_docx"] for m in moves]==sorted(m["paragrafo_docx"] for m in moves)
            and moves[0]["paragrafo_docx"]==2209 and moves[-1]["paragrafo_docx"]==2334,
            "Ancoras documentais do Mago alteradas.")
    expected={"total_movimentos":42,"total_com_requer":21,
              "total_vinculos_exatos":21,"total_opcoes":77,"total_partes":131}
    require(raw["integridade"]==expected,"Integridade do Mago alterada.")
    occupied=set();edges={}
    for m in moves:
        original=listed.get(m["id"])
        require(original is not None
                and m["titulo"]==original["titulo"]
                and m["requisito_literal"]==original["requisito_literal"]
                and m["paragrafo_docx"]==original["paragrafo_docx"],
                "Titulo, ancora ou REQUER de Mago divergente.")
        require(m["texto_integral_conferido"] is True
                and m["estado"]=="transcricao_integral_sem_revisao_mecanica"
                and m["aplicacao_canonica"] is False,
                "Nenhum Mago pode ser aplicado automaticamente.")
        require(m["texto_original"]=="\n".join(p["texto"] for p in m["partes"]),
                "Partes do Mago nao correspondem ao texto integral.")
        require(m["opcoes"]==[
            {"paragrafo_docx":p["paragrafo_docx"],"texto":p["texto"]}
            for p in m["partes"] if p["tipo"]=="opcao"],
            "Opcoes do Mago incompletas ou divergentes.")
        require(m["partes"][0]["tipo"]=="corpo"
                and m["partes"][0]["paragrafo_docx"]==m["paragrafo_docx"],
                "Corpo do Mago sem ancora DOCX.")
        for p in m["partes"]:
            require(p["texto"] and p["paragrafo_docx"] not in occupied,
                    "Paragrafo de Mago vazio ou duplicado.")
            occupied.add(p["paragrafo_docx"])
        req=m["requisito_estruturado"]
        require(bool(req)==bool(m["requisito_literal"]),
                "REQUER nao deve ser inferido.")
        if req:
            require(req["tipo"]=="movimento_exato" and
                    req["movimento_id"] in listed and
                    req["titulo_requerido"]==listed[req["movimento_id"]]["titulo"]
                    and req["status"]=="correspondencia_exata_na_fonte_pendente_homologacao",
                    "REQUER de Mago nao e correspondencia direta valida.")
            edges[m["id"]]=req["movimento_id"]
    require(len(occupied)==131
            and sum(len(m["opcoes"]) for m in moves)==77
            and len(edges)==21,"Perda de partes/opcoes/REQUER de Mago.")
    for start in edges:
        current=start;seen={start}
        while current in edges:
            current=edges[current]
            require(current not in seen,"Ciclo de pre-requisitos do Mago.")
            seen.add(current)
    ix=build_mage_indexes(moves)
    require(len(ix["by_raiz_dependencia"])==14
            and sum(len(v) for v in ix["by_raiz_dependencia"].values())==21
            and len(ix["by_requisito_tipo"]["movimento_exato"])==21,
            "Indices de raizes ou REQUER do Mago divergentes.")
    require(ix["by_requisito_id"]["movimento-classe:paragrafo-2251"]==
            ["movimento-classe:paragrafo-2252"],
            "Grimorio nao e REQUER universal da classe Mago.")
    require(edges["movimento-classe:paragrafo-2329"]==
            "movimento-classe:paragrafo-2243",
            "Voo Arcano depende de Telecinese, nao de Grimorio.")
    print("Mago: 42 movimentos, 77 opcoes, 131 partes e 21 REQUER em 14 raizes. Sem homologacao.")


def validar_feiticeiro_integral():
    """Preserva os 42 movimentos e sete raizes REQUER independentes."""
    from hack_movimentos_personagem import build_sorcerer_indexes
    obj=json.loads(gzip.decompress((ROOT/"data/lore/hack-carcaca-dw-feiticeiro-integrais.json.gz").read_bytes()).decode("utf-8"))
    inv=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")
    require(obj["fonte_sha256"]==inv["fonte_sha256"] and obj["grupo"]=="FEITICEIRO",
            "Fonte de Feiticeiro divergente.")
    moves=obj["movimentos"]
    originals={m["id"]:m for m in inv["movimentos"] if m["grupo"]=="FEITICEIRO"}
    require(len(moves)==len(originals)==42 and len(unique(moves,"feiticeiro"))==42,
            "Movimentos de Feiticeiro faltantes ou duplicados.")
    require([m["paragrafo_docx"] for m in moves]==sorted(m["paragrafo_docx"] for m in moves)
            and moves[0]["paragrafo_docx"]==2348 and moves[-1]["paragrafo_docx"]==2446,
            "Ancoras Feiticeiro alteradas.")
    require(obj["integridade"]=={"total_movimentos":42,"total_com_requer":20,
            "total_vinculos_exatos":20,"total_opcoes":48,"total_partes":100},
            "Integridade do Feiticeiro alterada.")
    occupied=set();edges={}
    for m in moves:
        old=originals.get(m["id"])
        require(old is not None and m["titulo"]==old["titulo"] and
                m["paragrafo_docx"]==old["paragrafo_docx"] and
                m["requisito_literal"]==old["requisito_literal"],
                "Titulo, posicao ou REQUER divergentes.")
        require(m["texto_integral_conferido"] is True and
                m["estado"]=="transcricao_integral_sem_revisao_mecanica" and
                m["aplicacao_canonica"] is False,
                "Proibida promocao automatica ao canon.")
        require(m["texto_original"]=="\n".join(p["texto"] for p in m["partes"])
                and m["partes"][0]["tipo"]=="corpo"
                and m["partes"][0]["paragrafo_docx"]==m["paragrafo_docx"],
                "Texto de Feiticeiro perdeu partes.")
        require(m["opcoes"]==[
                {"paragrafo_docx":p["paragrafo_docx"],"texto":p["texto"]}
                for p in m["partes"] if p["tipo"]=="opcao"],
                "Opcoes textuais de Feiticeiro truncadas.")
        for p in m["partes"]:
            require(p["texto"] and p["paragrafo_docx"] not in occupied,
                    "Paragrafo Feiticeiro duplicado/vazio.")
            occupied.add(p["paragrafo_docx"])
        req=m["requisito_estruturado"]
        require(bool(req)==bool(m["requisito_literal"]),"REQUER inventado ou omitido.")
        if req:
            require(req["tipo"]=="movimento_exato" and
                    req["movimento_id"] in originals and
                    req["titulo_requerido"]==originals[req["movimento_id"]]["titulo"] and
                    req["status"]=="correspondencia_exata_na_fonte_pendente_homologacao",
                    "REQUER Feiticeiro nao corresponde a um movimento exato.")
            edges[m["id"]]=req["movimento_id"]
    require(len(occupied)==100 and sum(len(m["opcoes"]) for m in moves)==48 and
            len(edges)==20,"Opcoes, trechos ou requisitos Feiticeiro perdidos.")
    for start in edges:
        node=start;seen={start}
        while node in edges:
            node=edges[node]
            require(node not in seen,"Ciclo REQUER Feiticeiro.")
            seen.add(node)
    ix=build_sorcerer_indexes(moves)
    roots={"movimento-classe:paragrafo-2348":9,
           "movimento-classe:paragrafo-2354":3,
           "movimento-classe:paragrafo-2355":3,
           "movimento-classe:paragrafo-2363":1,
           "movimento-classe:paragrafo-2364":2,
           "movimento-classe:paragrafo-2406":1,
           "movimento-classe:paragrafo-2440":1}
    require({k:len(v) for k,v in ix["by_raiz_dependencia"].items()}==roots
            and {k:len(v) for k,v in ix["by_requisito_id"].items()}==roots
            and len(ix["by_requisito_tipo"]["movimento_exato"])==20,
            "Sete raizes de Feiticeiro nao conferem.")
    require(edges["movimento-classe:paragrafo-2446"]=="movimento-classe:paragrafo-2440"
            and edges["movimento-classe:paragrafo-2412"]=="movimento-classe:paragrafo-2406",
            "Requisitos do Sonho ou Fenix divergentes.")
    print("Feiticeiro: 42 movimentos, 48 opcoes, 100 partes e 20 REQUER em sete raizes.")


def validar_bruxo_integral():
    """Preserva 49 movimentos e cinco linhagens de Bruxo sem pacto universal."""
    from hack_movimentos_personagem import build_warlock_indexes
    obj=json.loads(gzip.decompress((ROOT/"data/lore/hack-carcaca-dw-bruxo-integrais.json.gz").read_bytes()).decode("utf-8"))
    inv=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")
    require(obj["grupo"]=="BRUXO" and obj["fonte_sha256"]==inv["fonte_sha256"],
            "Fonte de Bruxo não corresponde ao inventário autoral.")
    moves=obj["movimentos"]
    originals={m["id"]:m for m in inv["movimentos"] if m["grupo"]=="BRUXO"}
    require(len(moves)==len(originals)==49 and len(unique(moves,"bruxo"))==49,
            "Bruxo com movimentos faltantes ou duplicados.")
    require([m["paragrafo_docx"] for m in moves]==sorted(m["paragrafo_docx"] for m in moves)
            and moves[0]["paragrafo_docx"]==2454 and moves[-1]["paragrafo_docx"]==2572,
            "Limites documentais de Bruxo divergentes.")
    expected={"total_movimentos":49,"total_com_requer":43,
              "total_vinculos_exatos":43,"total_opcoes":59,"total_partes":120}
    require(obj["integridade"]==expected,"Contagens documentais de Bruxo divergentes.")
    by_id={m["id"]:m for m in moves}
    parts=set();edges={}
    for m in moves:
        old=originals.get(m["id"])
        require(old is not None and m["titulo"]==old["titulo"]
                and m["requisito_literal"]==old["requisito_literal"]
                and m["paragrafo_docx"]==old["paragrafo_docx"],
                "Título ou REQUER divergente do inventário: "+m["id"])
        require(m["texto_integral_conferido"] is True
                and m["estado"]=="transcricao_integral_sem_revisao_mecanica"
                and m["aplicacao_canonica"] is False,
                "Nenhuma transcrição de Bruxo pode ser homologada automaticamente.")
        require(m["texto_original"]=="\n".join(p["texto"] for p in m["partes"]),
                "Partes textuais não recompõem o texto do movimento: "+m["id"])
        require(m["opcoes"]==[
                  {"paragrafo_docx":p["paragrafo_docx"],"texto":p["texto"]}
                  for p in m["partes"] if p["tipo"]=="opcao"],
                "Opções do Bruxo desconectadas do DOCX.")
        require(m["partes"][0]["paragrafo_docx"]==m["paragrafo_docx"]
                and m["partes"][0]["tipo"]=="corpo",
                "Corpo do Bruxo sem âncora documental.")
        for p in m["partes"]:
            require(p["texto"] and p["paragrafo_docx"] not in parts,
                    "Parte de Bruxo duplicada ou vazia.")
            parts.add(p["paragrafo_docx"])
        req=m["requisito_estruturado"]
        require(bool(req)==bool(m["requisito_literal"]),
                "REQUER deve corresponder a literal do manuscrito.")
        if req:
            require(req["tipo"]=="movimento_exato"
                    and req["movimento_id"] in by_id
                    and req["titulo_requerido"]==by_id[req["movimento_id"]]["titulo"]
                    and req["status"]=="correspondencia_exata_na_fonte_pendente_homologacao",
                    "Dependência de Bruxo não tem alvo exato, ou já foi homologada.")
            edges[m["id"]]=req["movimento_id"]
    require(len(parts)==120 and sum(len(m["opcoes"]) for m in moves)==59
            and len(edges)==43,"Partes, opções ou dependências de Bruxo incompletas.")
    for start in edges:
        at=start;visited={start}
        while at in edges:
            at=edges[at]
            require(at not in visited,"Ciclo de REQUER em Bruxo.")
            visited.add(at)
    roots={m["titulo"] for m in moves if m["requisito_estruturado"] is None}
    require(roots=={"PACTO","MALDIÇÃO","MAGIA SIMPÁTICA","CALDEIRÃO","OLHO GORDO","SABÁ"},
            "Não tornar Pacto pré-requisito universal para outras tradições.")
    ix=build_warlock_indexes(moves)
    groups={"movimento-classe:paragrafo-2454":30,
            "movimento-classe:paragrafo-2488":5,
            "movimento-classe:paragrafo-2492":3,
            "movimento-classe:paragrafo-2501":2,
            "movimento-classe:paragrafo-2502":3}
    require({k:len(v) for k,v in ix["by_raiz_dependencia"].items()}==groups,
            "As cinco raízes com dependentes precisam ser independentes.")
    require(edges["movimento-classe:paragrafo-2527"]=="movimento-classe:paragrafo-2474"
            and edges["movimento-classe:paragrafo-2474"]=="movimento-classe:paragrafo-2467"
            and edges["movimento-classe:paragrafo-2467"]=="movimento-classe:paragrafo-2454",
            "Cadeia de Invocador/Rajada/Pacto foi perdida.")
    require(not by_id["movimento-classe:paragrafo-2572"]["requisito_literal"],
            "SABÁ não possui REQUER literal.")
    print("Bruxo: 49 movimentos, 59 opções, 120 trechos, 43 REQUER diretos; "
          "cinco raízes com dependentes e Sabá independente.")


def validar_necromante_integral():
    """Confere 29 movimentos, nove REQUER diretos e duas conjuncoes E."""
    from hack_movimentos_personagem import build_necromancer_indexes
    raw=json.loads(gzip.decompress((ROOT/"data/lore/hack-carcaca-dw-necromante-integrais.json.gz").read_bytes()).decode("utf-8"))
    inv=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")
    require(raw["grupo"]=="NECROMANTE" and raw["fonte_sha256"]==inv["fonte_sha256"],
            "Manuscrito e inventario do Necromante divergentes.")
    moves=raw["movimentos"]
    original={m["id"]:m for m in inv["movimentos"] if m["grupo"]=="NECROMANTE"}
    require(len(moves)==len(original)==29 and len(unique(moves,"necromante"))==29,
            "Movimentos do Necromante ausentes ou duplicados.")
    require([m["paragrafo_docx"] for m in moves]==sorted(m["paragrafo_docx"] for m in moves)
            and moves[0]["paragrafo_docx"]==2581 and moves[-1]["paragrafo_docx"]==2666,
            "Fronteiras documentais do Necromante alteradas.")
    expected={"total_movimentos":29,"total_com_requer":11,"total_vinculos_exatos":9,
              "total_opcoes":45,"total_partes":83,"total_requer_composto":2}
    require(raw["integridade"]==expected,"Contagens documentais do Necromante divergentes.")
    by_id={m["id"]:m for m in moves}
    direct={};compound={};parts=set()
    for m in moves:
        old=original.get(m["id"])
        require(old is not None and m["titulo"]==old["titulo"] and
                m["paragrafo_docx"]==old["paragrafo_docx"] and
                m["requisito_literal"]==old["requisito_literal"],
                "Movimento Necromante nao corresponde ao inventario.")
        require(m["texto_integral_conferido"] is True
                and m["estado"]=="transcricao_integral_sem_revisao_mecanica"
                and m["aplicacao_canonica"] is False,
                "Movimento nao pode ser aplicado automaticamente ao canone.")
        require(m["texto_original"]=="\n".join(p["texto"] for p in m["partes"])
                and m["opcoes"]==[
                 {"paragrafo_docx":p["paragrafo_docx"],"texto":p["texto"]}
                 for p in m["partes"] if p["tipo"]=="opcao"],
                "Texto ou opcoes truncados.")
        require(m["partes"][0]["tipo"]=="corpo"
                and m["partes"][0]["paragrafo_docx"]==m["paragrafo_docx"],
                "Corpo Necromante sem ancoragem.")
        for p in m["partes"]:
            require(p["texto"] and p["paragrafo_docx"] not in parts,"Parte vazia/duplicada.")
            parts.add(p["paragrafo_docx"])
        req=m["requisito_estruturado"]
        require(bool(req)==bool(m["requisito_literal"]),"REQUER inferido ou omitido.")
        if req is None:continue
        if req["tipo"]=="movimento_exato":
            target=req["movimento_id"]
            require(target in by_id and req["titulo_requerido"]==by_id[target]["titulo"]
                    and req["status"]=="correspondencia_exata_na_fonte_pendente_homologacao",
                    "REQUER simples sem correspondencia literal.")
            direct[m["id"]]=target
        elif req["tipo"]=="todos":
            require(req["operador_literal"]=="e" and
                    req["status"]=="interpretacao_literal_pendente_homologacao"
                    and len(req["itens"])==2 and
                    all(i["tipo"]=="movimento_exato" for i in req["itens"]),
                    "REQUER composto deve ser conjuncao obrigatoria.")
            targets=[i["movimento_id"] for i in req["itens"]]
            require(len(set(targets))==2 and
                    all(i["movimento_id"] in by_id and
                        i["titulo_requerido"]==by_id[i["movimento_id"]]["titulo"]
                        for i in req["itens"]),
                    "Componentes cumulativos nao identificados.")
            compound[m["id"]]=targets
        else:raise AssertionError("Tipo de REQUER desconhecido.")
    expected_compound={
      "movimento-classe:paragrafo-2616":["movimento-classe:paragrafo-2582","movimento-classe:paragrafo-2596"],
      "movimento-classe:paragrafo-2617":["movimento-classe:paragrafo-2582","movimento-classe:paragrafo-2598"]
    }
    require(compound==expected_compound and len(direct)==9
            and len(parts)==83 and sum(len(m["opcoes"]) for m in moves)==45,
            "Integridade de alternativas, conjuncoes e requisitos alterada.")
    for start in direct:
        visited={start};at=start
        while at in direct:
            at=direct[at]
            require(at not in visited,"Ciclo de REQUER no Necromante.")
            visited.add(at)
    ix=build_necromancer_indexes(moves)
    require(len(ix["by_requisito_tipo"]["movimento_exato"])==9
            and ix["by_requisito_tipo"]["todos"]==sorted(expected_compound)
            and set(expected_compound)<=set(ix["by_requisito_id"]["movimento-classe:paragrafo-2582"])
            and "movimento-classe:paragrafo-2616" in
                ix["by_requisito_id"]["movimento-classe:paragrafo-2596"]
            and "movimento-classe:paragrafo-2617" in
                ix["by_requisito_id"]["movimento-classe:paragrafo-2598"],
            "Indices de REQUER composto incompletos.")
    print("Necromante: 29 movimentos, 45 opcoes, 83 partes, 9 REQUER diretos e 2 conjuncoes.")


def validar_artifice_integral():
    """Valida 23 movimentos, 32 opções, 59 partes e 7 REQUER sem inferir pré-requisitos."""
    from hack_movimentos_personagem import build_artificer_indexes
    obj=json.loads(gzip.decompress((ROOT/"data/lore/hack-carcaca-dw-artifice-integrais.json.gz").read_bytes()).decode("utf-8"))
    inventory=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")
    require(obj["grupo"]=="ARTÍFICE" and obj["fonte_sha256"]==inventory["fonte_sha256"],
            "Fonte do ARTÍFICE diferente do inventário.")
    moves=obj["movimentos"]
    original={m["id"]:m for m in inventory["movimentos"] if m["grupo"]=="ARTÍFICE"}
    require(len(moves)==len(original)==23 and len(unique(moves,"artifice"))==23,
            "Movimentos de ARTÍFICE perdidos ou duplicados.")
    require([m["paragrafo_docx"] for m in moves]==sorted(m["paragrafo_docx"] for m in moves)
            and moves[0]["paragrafo_docx"]==2672 and moves[-1]["paragrafo_docx"]==2731,
            "Âncoras de ARTÍFICE alteradas.")
    expected={"total_movimentos":23,"total_com_requer":7,"total_vinculos_exatos":7,
              "total_opcoes":32,"total_partes":59}
    require(obj["integridade"]==expected,"Integridade do ARTÍFICE não coincide com o manuscrito.")
    by_id={m["id"]:m for m in moves}
    parts=set();edges={}
    for m in moves:
        old=original.get(m["id"])
        require(old is not None and m["titulo"]==old["titulo"]
                and m["paragrafo_docx"]==old["paragrafo_docx"]
                and m["requisito_literal"]==old["requisito_literal"],
                "Título, parágrafo ou REQUER divergente no ARTÍFICE.")
        require(m["texto_integral_conferido"] is True and
                m["estado"]=="transcricao_integral_sem_revisao_mecanica" and
                m["aplicacao_canonica"] is False,
                "ARTÍFICE não pode ser homologado automaticamente.")
        require(m["texto_original"]=="\n".join(p["texto"] for p in m["partes"]),
                "Trechos de ARTÍFICE foram truncados.")
        require(m["opcoes"]==[
                {"paragrafo_docx":p["paragrafo_docx"],"texto":p["texto"]}
                for p in m["partes"] if p["tipo"]=="opcao"],
                "Opções de ARTÍFICE fora da fonte.")
        require(m["partes"][0]["tipo"]=="corpo" and
                m["partes"][0]["paragrafo_docx"]==m["paragrafo_docx"],
                "Movimento ARTÍFICE sem âncora.")
        for p in m["partes"]:
            require(bool(p["texto"]) and p["paragrafo_docx"] not in parts,
                    "Parte duplicada/vazia em ARTÍFICE.")
            parts.add(p["paragrafo_docx"])
        req=m["requisito_estruturado"]
        require(bool(req)==bool(m["requisito_literal"]),"REQUER não deve ser inferido ou eliminado.")
        if req:
            require(req["tipo"]=="movimento_exato"
                    and req["movimento_id"] in original
                    and req["titulo_requerido"]==by_id[req["movimento_id"]]["titulo"]
                    and req["status"]=="correspondencia_exata_na_fonte_pendente_homologacao",
                    "REQUER ARTÍFICE sem correspondência literal.")
            edges[m["id"]]=req["movimento_id"]
    require(len(parts)==59 and sum(len(m["opcoes"]) for m in moves)==32 and len(edges)==7,
            "Opções/partes/requisitos incompletos.")
    # A emenda autorizada muda somente uma referência no corpo de um movimento.
    # O hash da fonte identifica o manuscrito anterior à correção informada.
    emendas=obj.get("correcoes_autorais",[])
    require(emendas==[{
       "movimento_id":"movimento-classe:paragrafo-2703",
       "paragrafo_docx":2703,
       "tipo":"correcao_referencia_no_corpo",
       "referencia_anterior":"Alquimista Federal",
       "referencia_corrigida":"Arma Humana",
       "confirmacao_autoral":"2026-10-27",
       "observacao":"Emenda autoral posterior à versão do DOCX identificada em fonte_sha256; não modifica REQUER, opções ou efeitos."
    }], "Emenda autoral de ARTÍFICE alterada ou ausente.")
    corrigido=by_id["movimento-classe:paragrafo-2703"]
    require("punição do movimento Arma Humana" in corrigido["texto_original"]
            and "Alquimista Federal" not in corrigido["texto_original"]
            and all("Alquimista Federal" not in p["texto"] for m in moves for p in m["partes"]),
            "A referência obsoleta reapareceu no corpo do ARTÍFICE.")
    require(corrigido["requisito_literal"]=="Arma Humana" and
            corrigido["requisito_estruturado"]["movimento_id"]=="movimento-classe:paragrafo-2702",
            "A emenda não pode alterar REQUER de AQUILO QUE VOCÊS CHAMAM DE MUNDO.")
    for start in edges:
        seen={start};current=start
        while current in edges:
            current=edges[current]
            require(current not in seen,"Ciclo de REQUER em ARTÍFICE.")
            seen.add(current)
    expected_roots={"movimento-classe:paragrafo-2679":1,
                    "movimento-classe:paragrafo-2690":3,
                    "movimento-classe:paragrafo-2700":3}
    index=build_artificer_indexes(moves)
    require({k:len(v) for k,v in index["by_raiz_dependencia"].items()}==expected_roots,
            "Raízes do ARTÍFICE não coincidem com as três linhagens da fonte.")
    require(edges["movimento-classe:paragrafo-2703"]=="movimento-classe:paragrafo-2702"
            and edges["movimento-classe:paragrafo-2702"]=="movimento-classe:paragrafo-2701",
            "Cadeia de transmutação do ARTÍFICE interrompida.")
    print("ARTÍFICE: 23 movimentos, 32 opções, 59 partes, 7 REQUER; 3 raízes. Sem alteração canônica.")


def validar_mercenario_integral():
    """Confere 31 movimentos de Mercenário, opções, partes e requisitos transitivos."""
    from hack_movimentos_personagem import build_mercenary_indexes
    obj=json.loads(gzip.decompress((ROOT/"data/lore/hack-carcaca-dw-mercenario-integrais.json.gz").read_bytes()).decode("utf-8"))
    inventory=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")
    require(obj["grupo"]=="MERCENÁRIO" and obj["fonte_sha256"]==inventory["fonte_sha256"],
            "Fonte do Mercenário não corresponde ao inventário.")
    moves=obj["movimentos"]
    originals={m["id"]:m for m in inventory["movimentos"] if m["grupo"]=="MERCENÁRIO"}
    require(len(moves)==len(originals)==31 and len(unique(moves,"mercenario"))==31,
            "Movimentos de Mercenário incompletos ou duplicados.")
    require([m["paragrafo_docx"] for m in moves]==sorted(m["paragrafo_docx"] for m in moves)
            and moves[0]["paragrafo_docx"]==2736 and moves[-1]["paragrafo_docx"]==2810,
            "Âncoras de Mercenário modificadas.")
    require(obj["integridade"]=={"total_movimentos":31,"total_com_requer":11,
            "total_vinculos_exatos":11,"total_opcoes":37,"total_partes":75},
            "Contagens do Mercenário divergentes.")
    by_id={m["id"]:m for m in moves};used=set();edges={}
    for m in moves:
        old=originals.get(m["id"])
        require(old is not None and m["titulo"]==old["titulo"]
                and m["paragrafo_docx"]==old["paragrafo_docx"]
                and m["requisito_literal"]==old["requisito_literal"],
                "Mercenário: título, parágrafo ou REQUER divergiu do manuscrito.")
        require(m["texto_integral_conferido"] is True
                and m["estado"]=="transcricao_integral_sem_revisao_mecanica"
                and m["aplicacao_canonica"] is False,
                "Mercenário: movimento não pode ser homologado na extração.")
        require(m["texto_original"]=="\n".join(p["texto"] for p in m["partes"]),
                "Mercenário: texto original diverge dos trechos.")
        require(m["opcoes"]==[{"paragrafo_docx":p["paragrafo_docx"],"texto":p["texto"]}
                for p in m["partes"] if p["tipo"]=="opcao"],
                "Mercenário: opções perdidas ou alteradas.")
        require(m["partes"][0]["tipo"]=="corpo"
                and m["partes"][0]["paragrafo_docx"]==m["paragrafo_docx"],
                "Mercenário: corpo sem origem.")
        for part in m["partes"]:
            require(part["texto"] and part["paragrafo_docx"] not in used,
                    "Mercenário: trecho vazio ou duplicado.")
            used.add(part["paragrafo_docx"])
        req=m["requisito_estruturado"]
        require(bool(req)==bool(m["requisito_literal"]),"Mercenário: REQUER inferido ou omitido.")
        if req:
            require(req["tipo"]=="movimento_exato"
                    and req["movimento_id"] in originals
                    and req["titulo_requerido"]==by_id[req["movimento_id"]]["titulo"]
                    and req["status"]=="correspondencia_exata_na_fonte_pendente_homologacao",
                    "Mercenário: alvo de REQUER incorreto.")
            edges[m["id"]]=req["movimento_id"]
    require(len(used)==75 and sum(len(m["opcoes"]) for m in moves)==37
            and len(edges)==11,"Mercenário: integridade de partes/requisitos divergente.")
    for start in edges:
        visited={start};current=start
        while current in edges:
            current=edges[current]
            require(current not in visited,"Mercenário: ciclo de pré-requisitos.")
            visited.add(current)
    index=build_mercenary_indexes(moves)
    require({k:len(x) for k,x in index["by_raiz_dependencia"].items()}=={
        "movimento-classe:paragrafo-2736":9,
        "movimento-classe:paragrafo-2760":2},
        "Mercenário: dependências de Capitão e O Preço da Guerra indevidamente unificadas.")
    require(edges["movimento-classe:paragrafo-2802"]=="movimento-classe:paragrafo-2748"
            and edges["movimento-classe:paragrafo-2748"]=="movimento-classe:paragrafo-2736",
            "Saque Organizado exige Abordagem, que exige Capitão.")
    for index_id in (2755,2756,2779):
        require(not by_id[f"movimento-classe:paragrafo-{index_id}"]["requisito_literal"],
                "Mercenário: Capitão não é requisito universal.")
    print("Mercenário: 31 movimentos, 37 opções, 75 partes, 11 REQUER, duas árvores.")


def validar_fechamento_classes_integrais():
    """Prova os nove textos finais e a cobertura 632/632 do inventário de 18 grupos."""
    from hack_movimentos_personagem import build_final_class_indexes
    inventory=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")
    rows=inventory["movimentos"]
    require(len(rows)==632 and len({m["id"] for m in rows})==632
            and len({m["grupo"] for m in rows})==18,
            "Inventário de classes não possui 632 movimentos únicos em 18 grupos.")
    expected=(("ESCRIBA YOKAI","escriba-yokai",2812,2814),
              ("NOBRE","nobre",2816,2818),
              ("ARQUEÓLOGO","arqueologo",2820,2822))
    all_ids=set()
    for grupo,slug,first,last in expected:
        obj=load("data/lore/hack-carcaca-dw-"+slug+"-integrais.json")
        moves=obj["movimentos"]
        require(obj["fonte_sha256"]==inventory["fonte_sha256"]
                and obj["grupo"]==grupo,
                "Fonte ou classe divergente em "+grupo)
        require(obj["integridade"]=={"total_movimentos":3,"total_com_requer":0,
              "total_vinculos_exatos":0,"total_opcoes":0,"total_partes":3},
              "Integridade do grupo final divergente: "+grupo)
        originals={m["id"]:m for m in rows if m["grupo"]==grupo}
        require(len(moves)==len(originals)==3
                and [m["paragrafo_docx"] for m in moves]==list(range(first,last+1)),
                "Nove movimentos finais incompletos ou fora da posição de origem.")
        seen=set()
        for move in moves:
            source=originals.get(move["id"])
            require(source and move["titulo"]==source["titulo"]
                    and move["paragrafo_docx"]==source["paragrafo_docx"]
                    and source["requisito_literal"] is None,
                    "Inventário e transcrição final divergem.")
            require(not move["requisito_literal"] and not move["requisito_estruturado"]
                    and not move["opcoes"] and len(move["partes"])==1,
                    "REQUER/opção foi inferido sem evidência documental.")
            require(move["texto_original"]==move["partes"][0]["texto"]
                    and move["partes"][0]["paragrafo_docx"]==move["paragrafo_docx"]
                    and move["partes"][0]["tipo"]=="corpo" and bool(move["texto_original"]),
                    "Corpo do movimento ausente ou sem proveniência.")
            require(move["texto_integral_conferido"] is True
                    and move["aplicacao_canonica"] is False
                    and move["estado"]=="transcricao_integral_sem_revisao_mecanica",
                    "Transcrição não é homologação mecânica.")
            require(move["id"] not in all_ids and move["id"] not in seen,
                    "ID duplicado entre grupos finais.")
            all_ids.add(move["id"]);seen.add(move["id"])
        idx=build_final_class_indexes(moves)
        require(len(idx["by_tem_requer"]["nao"])==3
                and len(idx["by_tem_opcoes"]["nao"])==3
                and not idx["by_requisito_id"],
                "Índices finais registraram pré-requisitos inexistentes.")
    require(len(all_ids)==9,"Os nove movimentos não foram todos transcritos.")
    archaeologist=load("data/lore/hack-carcaca-dw-arqueologo-integrais.json")["movimentos"]
    require(archaeologist[0]["texto_original"].startswith("‘Quando"),
            "O caractere de abertura editorial de CAMADAS deve ser preservado até revisão autoral.")
    print("Fechamento documental: 9 movimentos, 0 opções, 0 REQUER; 18 grupos / 632 IDs inventariados.")


def validar_povoamento_narrativo_hack():
    """Impede que a proposta de povoamento pareça um evento ou lugar canônico."""
    obj=load("data/propostas/povoamento-regional-hack-carcaca.json")
    require(obj["estado"]=="propostas_editoriais_nao_canonicas","Povoamento não pode ser homologado automaticamente.")
    areas=obj["areas"];seeds=obj["sementes"]
    require(len(areas)==8 and len(seeds)==16,"Povoamento perdeu áreas ou núcleos.")
    area_ids={a["id"] for a in areas}
    require(len(area_ids)==len(areas),"Área de proposta repetida.")
    known_regions={r["id"] for r in load("data/regioes_carcaca.json")["regioes"]}
    for area in areas:
        require(area["regiao_atlas_id"] is None or area["regiao_atlas_id"] in known_regions,
                "Proposta referenciou região não cadastrada.")
        require(area["cadastrada_como_regiao_oficial"]==bool(area["regiao_atlas_id"]),
                "Proposta declarou região oficial inexistente.")
    inventory=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")["movimentos"]
    people=load("data/lore/hack-carcaca-dw-movimentos-povos-integrais.json")["movimentos"]
    move_ids={m["id"] for m in inventory}|{m["id"] for m in people}
    ids=set();counts={a["id"]:0 for a in areas}
    for s in seeds:
        require(s["id"] not in ids and s["area_id"] in area_ids,
                "Núcleo duplicado ou com área desconhecida.")
        ids.add(s["id"]);counts[s["area_id"]]+=1
        require(s["estado"]=="proposta_de_povoamento" and s["aprovacao_autoral"] is False
                and s["efeito_automatico_no_canon"] is False,
                "Ficção proposta não deve alterar o cânone.")
        require(2<=len(s["movimentos_inspiradores"])<=4
                and all(m in move_ids for m in s["movimentos_inspiradores"]),
                "Movimentos inspiradores sem vínculo com Hack.")
        for k in ("titulo","local_proposto","habitantes_propostos","personagem_central",
                  "vida_cotidiana","conflito_vivo","gancho_de_aventura",
                  "decisao_sem_resposta_certa","ancora_documentada"):
            require(isinstance(s[k],str) and len(s[k].strip())>=(6 if k=="titulo" else 20),
                    "Proposta tem lacuna narrativa em "+k)
        require(s["temas"] and s["possivel_conexao"]
                and all(other!=s["area_id"].split(":")[-1]
                        for other in s["possivel_conexao"]),
                "Conexões temáticas do povoamento inválidas.")
    require(all(v==2 for v in counts.values()),"Cada área deve conter dois núcleos.")
    require(len(obj["tramas"])==3 and all(not x.get("efeito_automatico_no_canon",False)
            for x in obj["tramas"]),"Tramas cruzadas não podem ser forçadas.")
    print("Povoamento narrativo: 8 áreas, 16 núcleos, 3 tramas e referências Hack conferidas; sem promover cânone.")

 
def validar_rede_social_caatinga():
    """Valida coesão das comunidades e separação entre cânone e sugestões."""
    data=load("data/propostas/caatinga-rede-social-hack.json")
    require(data["regiao_id"]=="regiao:caatinga"
            and data["estado"]=="propostas_narrativas_nao_canonicas"
            and data["aprovacao_autoral"] is False
            and data["efeito_automatico_no_canon"] is False,
            "Rede da Caatinga não pode estabelecer cânone automaticamente.")
    counts={"comunidades":5,"coletivos":5,"pessoas":8,"pontos_agua":4,
            "rotas":6,"conflitos":4,"cenas":6}
    require(data["totais_propostos"]==counts,"Contagens da Caatinga divergentes.")
    entities=[e for k in counts for e in data[k]]
    require(len(entities)==38 and len({e["id"] for e in entities})==38,
            "Rede da Caatinga contém IDs repetidos.")
    for k,n in counts.items():
        require(len(data[k])==n and all(x["estado"]=="proposta" for x in data[k]),
                "Tipo de entidade da Caatinga incompleto: "+k)
    inventory=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")["movimentos"]
    people=load("data/lore/hack-carcaca-dw-movimentos-povos-integrais.json")["movimentos"]
    hack_ids={m["id"] for m in inventory+people}
    ids={e["id"] for e in entities}
    coms={e["id"] for e in data["comunidades"]}
    collectives={e["id"] for e in data["coletivos"]}
    existing_places={p["id"] for p in load("data/lugares_carcaca.json")["lugares"]}
    for e in entities:
        require(e["id"].startswith("caatinga:"),"ID da Caatinga fora do namespace.")
        if e.get("movimentos_inspiradores"):
            require(all(m in hack_ids for m in e["movimentos_inspiradores"]),
                    "Movimento de inspiração não encontrado no Hack.")
        for refkey in ("comunidade_id","coletivo_id"):
            ref=e.get(refkey)
            if ref is not None:
                expected=coms if refkey=="comunidade_id" else collectives
                require(ref in expected,"Referência comunitária inválida: "+str(ref))
        if "comunidade_ids" in e:
            require(all(r in coms for r in e["comunidade_ids"]),
                    "Conflito referencia comunidade não catalogada.")
        if "conexoes" in e:
            require(all(r in coms for r in e["conexoes"]),"Ligação de comunidade desconhecida.")
        if "ligacoes_propostas" in e:
            require(all(r in coms for r in e["ligacoes_propostas"]),
                    "Ligação de coletivo desconhecida.")
        if "origem_id" in e:
            require(e["origem_id"] in coms and
                    (e["destino_id"] in coms or e["destino_id"] in existing_places),
                    "Rota pressupõe lugar inexistente no atlas.")
            require(e["tracado_confirmado"] is False and e["distancia_confirmada"] is False,
                    "Rota proposta não pode declarar traçado ou distância verificados.")
    refs=set(data["conexoes_com_sementes_anteriores"])
    original=load("data/propostas/povoamento-regional-hack-carcaca.json")
    require(refs=={"povoamento-proposto:poco-sem-bandeira","povoamento-proposto:mercado-das-ferragens"}
            and refs<={x["id"] for x in original["sementes"]},
            "A Caatinga deve continuar ligada às duas sementes anteriores.")
    require(data["pontos_agua"] and all(p["estado_material"]=="hipotetico_sem_medicao"
            for p in data["pontos_agua"]),
            "Não inventar volume, potabilidade ou água disponível.")
    require(all(isinstance(x.get("situacao_de_abertura"),str)
            and isinstance(x.get("efeito_se_ignorarem_condicional"),str)
            for x in data["cenas"]),"Cenas devem ter abertura e consequência condicional.")
    print("Povoamento da Caatinga: 38 entidades propostas em sete categorias, sem novos fatos ou mapas canônicos.")


def validar_fronteira_caatinga_costa_sul():
    """Valida povoamento propositivo sem transformar a hipótese de comércio em fato."""
    data=load("data/propostas/fronteira-caatinga-costa-sul-hack.json")
    sections={"encontros":5,"pessoas":9,"acordos":5,"fluxos":6,"cenas":6,"tramas":3}
    require(data["estado"]=="propostas_narrativas_nao_canonicas"
            and data["regioes_envolvidas"]==["regiao:caatinga","regiao:costa-sul"]
            and data["aprovacao_autoral"] is False
            and data["efeito_automatico_no_canon"] is False,
            "Fronteira não pode homologar cânone ou forçar comércio.")
    require(data["totais_propostos"]==sections and
            all(len(data[k])==n for k,n in sections.items()),
            "Fronteira perdeu elementos.")
    all_entities=[x for k in sections for x in data[k]]
    all_ids={x["id"] for x in all_entities}
    require(len(all_entities)==34 and len(all_ids)==34,
            "Elementos da fronteira duplicados ou perdidos.")
    require(all(x["estado"]=="proposta" for x in all_entities),
            "Evento da fronteira tornou-se canônico indevidamente.")
    classes=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")["movimentos"]
    povos=load("data/lore/hack-carcaca-dw-movimentos-povos-integrais.json")["movimentos"]
    move_ids={x["id"] for x in classes+povos}
    for section in ("pessoas","acordos","fluxos"):
        for obj in data[section]:
            require(1<=len(obj["movimentos_inspiradores"])<=4
                    and all(x in move_ids for x in obj["movimentos_inspiradores"]),
                    "Movimento do Hack sem origem válida.")
    caatinga=load("data/propostas/caatinga-rede-social-hack.json")
    ids_caatinga={x["id"] for k in ("comunidades","coletivos","pessoas","pontos_agua","rotas","conflitos","cenas")
                  for x in caatinga[k]}
    past=load("data/propostas/povoamento-regional-hack-carcaca.json")
    ids_past={x["id"] for x in past["sementes"]}
    places=load("data/lugares_carcaca.json")
    ids_places={x["id"] for x in places["lugares"]}
    settlements={"assentamento:portomonte"}
    permitted=all_ids|ids_caatinga|ids_past|ids_places|settlements|{
                "regiao:caatinga","regiao:costa-sul"}
    for obj in all_entities:
        require(obj["id"].startswith("fronteira:"),
                "Namespace não separado da curadoria factual.")
        ref_lists=["referencias","conexoes_preexistentes"]
        for key in ref_lists:
            require(all(x in permitted for x in obj.get(key,[])),
                    "Referência inexistente no cenário/proposta: "+obj["id"])
        for key in ("origem_proposta","destino_proposto","encontro_id"):
            if key in obj:
                require(obj[key] in permitted,
                        "Fronteira cita local sem ficha ou identificador editorial.")
        for key in ("personagens_id","quem_tentaria_assinar"):
            if key in obj:
                require(all(x in permitted for x in obj[key]),
                        "Fronteira cita personagem sem ficha.")
    for place in data["encontros"]:
        require(place["localizacao_confirmada"] is False
                and place["territorio_hypotetico"] is True,
                "Ponto de encontro não deve ser mapeado como fato.")
    for flow in data["fluxos"]:
        require(flow["transporte_registrado"] is False
                and flow["quantidade_registrada"] is False,
                "Troca proposta não pode estabelecer produção, mercadoria ou rota documentada.")
    for s in data["cenas"]:
        require(s["encontro_id"] in {x["id"] for x in data["encontros"]}
                and len(s["acoes_possiveis"])>=3
                and len(s["acontecimento_inesperado"])>=25,
                "Cena sem ponto de encontro ou escolha significativa.")
    require(any("Portomonte" in t for t in data["limites_editoriais"])
            and any("potabilidade" in x.lower() for x in data["fatos_preservados"]),
            "Não suprimir ressalvas sobre água e comércio.")
    print("Fronteira Caatinga–Costa Sul: 34 propostas, 6 categorias, 0 eventos/rotas canonizados.")


def validar_povoamento_costa_sul():
    """Confere propostas sociais sem inventar fontes, rotas ou instituições canônicas."""
    obj=load("data/propostas/portomonte-ilhas-costa-sul-hack.json")
    expected={"espacos":6,"redes":3,"pessoas":8,"praticas":4,
              "circulacoes":4,"cenas":5,"tramas":3}
    require(obj["regiao_id"]=="regiao:costa-sul"
            and obj["estado"]=="propostas_narrativas_nao_canonicas"
            and obj["aprovacao_autoral"] is False
            and obj["efeito_automatico_no_canon"] is False,
            "Propostas da Costa Sul foram indevidamente canonizadas.")
    require(obj["contagens"]==expected
            and all(len(obj[k])==n for k,n in expected.items()),
            "Contagens do povoamento da Costa Sul incompletas.")
    all_rows=[r for k in expected for r in obj[k]]
    ids={r["id"] for r in all_rows}
    require(len(all_rows)==len(ids)==33 and
            all(r["estado"]=="proposta" and r["id"].startswith("costa-sul:")
                for r in all_rows),"IDs de povoamento ausentes ou duplicados.")
    inv=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")["movimentos"]
    povo=load("data/lore/hack-carcaca-dw-movimentos-povos-integrais.json")["movimentos"]
    move_ids={m["id"] for m in inv+povo}
    places={r["id"] for r in load("data/lugares_carcaca.json")["lugares"]}
    seeds={r["id"] for r in load("data/propostas/povoamento-regional-hack-carcaca.json")["sementes"]}
    frontier=load("data/propostas/fronteira-caatinga-costa-sul-hack.json")
    front_ids={r["id"] for k in ("encontros","pessoas","acordos","fluxos","cenas","tramas")
               for r in frontier[k]}
    caat=load("data/propostas/caatinga-rede-social-hack.json")
    caat_ids={r["id"] for k in ("comunidades","coletivos","pessoas","pontos_agua",
                               "rotas","conflitos","cenas") for r in caat[k]}
    allowed_refs=places|seeds|front_ids|caat_ids|{"regiao:caatinga","regiao:costa-sul"}
    people_ids={p["id"] for p in obj["pessoas"]}
    scenario_ids={x["id"] for x in obj["espacos"]+obj["redes"]}
    for row in all_rows:
        require(bool(row["nome"]) and bool(row["cotidiano"]) and bool(row["conflito"]),
                "Povoamento requer identidade e tensão social.")
        require(1<=len(row["movimentos_inspiradores"])<=4
                and all(x in move_ids for x in row["movimentos_inspiradores"]),
                "Inspiração fora do Hack.")
        require(all(x in allowed_refs for x in row["referencias"]),
                "Referência externa não encontrada: "+row["id"])
    for p in obj["pessoas"]:
        require(p["reutiliza"] is None or p["reutiliza"] in front_ids,
                "Personagem recorrente sem vínculo com ficha anterior.")
    require(sum(bool(p["reutiliza"]) for p in obj["pessoas"])==5,
            "Cinco personagens anteriores devem ser reutilizados, não duplicados.")
    for r in obj["espacos"]:
        require(r["localizacao_confirmada"] is False,
                "Espaço proposto não pode tornar-se bairro geolocalizado.")
    for r in obj["redes"]:
        require(r["ilha_confirmada"] is False
                and r["rota_confirmada"] is False
                and r["coabitacao_confirmada"] is False,
                "Rede insular inventou ilha, rota ou comunidade comum.")
    for r in obj["praticas"]:
        require(all(x in people_ids for x in r["participantes"]),
                "Prática remete a pessoa inexistente.")
    for r in obj["circulacoes"]:
        require(r["fluxo_confirmado"] is False,
                "Comércio proposto virou fato sem homologação.")
    for r in obj["cenas"]:
        require(r["local_id"] in scenario_ids
                and all(x in people_ids for x in r["pessoas_ids"])
                and len(r["escolhas"])>=3,
                "Cena sem local, personagens ou decisões.")
    for r in obj["tramas"]:
        require(all(x in ids for x in r["pontos"]),
                "Trama sem elemento de origem no ciclo.")
    facts=" ".join(obj["fatos_documentados"]+obj["limites_editoriais"]).lower()
    require("potabilidade" in facts and "deméter" in facts
            and "eldroth" in facts and "portomonte" in facts,
            "Costa Sul perdeu limites factuais de água, culto ou refugiados.")
    print("Costa Sul IV: 33 propostas, 7 categorias, 8 NPCs, ilhas não individualizadas; zero alterações canônicas.")


def validar_ecologia_politica_mar_sangue():
    """Vínculos e autonomia dos povos marinhos sem promoção automática ao cânone."""
    obj=load("data/propostas/mar-sangue-ecologia-politica-hack.json")
    counts={"zonas":5,"coletivos":6,"pessoas":8,"pactos":4,
            "fenomenos":4,"cenas":6,"tramas":3}
    require(obj["regiao_id"]=="regiao:costa-sul" and
            obj["estado"]=="propostas_narrativas_nao_canonicas" and
            obj["aprovacao_autoral"] is False and
            obj["efeito_automatico_no_canon"] is False,
            "Ecologia marinha não pode alterar cânone sem aprovação.")
    require(obj["contagens"]==counts and
            all(len(obj[k])==v for k,v in counts.items()),
            "Ecologia política do Mar de Sangue: contagens divergentes.")
    all_rows=[r for k in counts for r in obj[k]]
    ids={r["id"] for r in all_rows}
    require(len(all_rows)==len(ids)==36 and
            all(r["id"].startswith("mar-sangue:") and r["estado"]=="proposta"
                for r in all_rows),"IDs da proposta marinha duplicados ou alterados.")
    classes=load("data/lore/hack-carcaca-dw-inventario-classes-requer.json")["movimentos"]
    povos=load("data/lore/hack-carcaca-dw-movimentos-povos-integrais.json")["movimentos"]
    move_ids={x["id"] for x in classes+povos}
    places={x["id"] for x in load("data/lugares_carcaca.json")["lugares"]}
    past=load("data/propostas/fronteira-caatinga-costa-sul-hack.json")
    past_ids={x["id"] for k in ("encontros","pessoas","acordos","fluxos","cenas","tramas")
              for x in past[k]}
    caat=load("data/propostas/caatinga-rede-social-hack.json")
    caat_ids={x["id"] for k in ("comunidades","coletivos","pessoas","pontos_agua","rotas","conflitos","cenas")
              for x in caat[k]}
    coasts=load("data/propostas/portomonte-ilhas-costa-sul-hack.json")
    coast_ids={x["id"] for k in ("espacos","redes","pessoas","praticas","circulacoes","cenas","tramas")
               for x in coasts[k]}
    refs=ids|places|past_ids|caat_ids|coast_ids|{"regiao:costa-sul"}
    for row in all_rows:
        require(bool(row["nome"]) and bool(row["rotina"]) and bool(row["tensao"]),
                "Entidade marinha requer atividade e conflito.")
        require(1<=len(row["referencias_hack"])<=4 and
                all(x in move_ids for x in row["referencias_hack"]),
                "Movimento do Hack sem ID de origem.")
        require(all(x in refs for x in row["ligacoes"]),
                "Entidade marinha tem ligação órfã: "+row["id"])
    require(sum(p.get("reutiliza")=="fronteira:pessoa:nilku" for p in obj["pessoas"])==1,
            "Nilku deve manter vínculo com a proposta anterior.")
    require(all(z["localizacao_confirmada"] is False for z in obj["zonas"]),
            "Zonas propostas não são novas cidades subaquáticas oficiais.")
    require(all(x["instituicao_confirmada"] is False for x in obj["coletivos"]),
            "Coletivos imaginados não são instituições canônicas.")
    require(all(x["vigente"] is False for x in obj["pactos"]),
            "Pactos individuais não são fatos consumados.")
    require(all(x["ocorrencia_individual_confirmada"] is False for x in obj["fenomenos"]),
            "Fenômenos regionais não provam episódios particulares.")
    people={x["id"] for x in obj["pessoas"]}
    for x in obj["cenas"]:
        require(all(p in people for p in x["elenco"]) and len(x["escolhas"])>=3,
                "Cena marinha sem NPCs ou decisões.")
    scenes={x["id"] for x in obj["cenas"]}
    require(all(all(y in scenes for y in x["cenas"]) for x in obj["tramas"]),
            "Trama sem cenas de origem.")
    fact=" ".join(obj["fatos_documentados"]+obj["limites"]).lower()
    require("demônios" in fact and "abismo" in fact
            and "centralizado" in fact and "fronteira" in fact,
            "Guardas de lore de origem e política marinha ausentes.")
    print("Mar de Sangue: 36 propostas, 7 grupos, 8 NPCs; sem cidades inventadas nem alteração canônica.")

 
def validar_diplomacia_mar_sangue():
    """Diplomacia submarina jogável com continuidade e sucessões não ocorridas."""
    d=load("data/propostas/mar-sangue-diplomacia-hack.json")
    expected={"polos":4,"casas":5,"pessoas":9,"disputas":5,
              "tratados":5,"cenas":6,"missoes":4,"arcos":3}
    require(d["regiao_id"]=="regiao:costa-sul" and
            d["estado"]=="propostas_narrativas_nao_canonicas" and
            d["aprovacao_autoral"] is False and
            d["efeito_automatico_no_canon"] is False,
            "Diplomacia marinha foi homologada indevidamente.")
    require(d["contagens"]==expected
            and all(len(d[k])==n for k,n in expected.items()),
            "Categorias da diplomacia submarina incompletas.")
    all_rows=[row for category in expected for row in d[category]]
    ids={row["id"] for row in all_rows}
    require(len(all_rows)==len(ids)==41
            and all(row["id"].startswith("diplomacia-mar:")
                    and row["estado"]=="proposta_nao_canonica" for row in all_rows),
            "IDs duplicados ou categoria canonizada na diplomacia.")
    povo_moves=load("data/lore/hack-carcaca-dw-movimentos-povos-integrais.json")["movimentos"]
    move_ids={x["id"] for x in povo_moves}
    places={x["id"] for x in load("data/lugares_carcaca.json")["lugares"]}
    coastal=load("data/propostas/portomonte-ilhas-costa-sul-hack.json")
    coast_ids={x["id"] for category in ("espacos","redes","pessoas","praticas",
                                        "circulacoes","cenas","tramas")
              for x in coastal[category]}
    frontier=load("data/propostas/fronteira-caatinga-costa-sul-hack.json")
    frontier_ids={x["id"] for category in ("encontros","pessoas","acordos",
                                           "fluxos","cenas","tramas")
                  for x in frontier[category]}
    marine=load("data/propostas/mar-sangue-ecologia-politica-hack.json")
    marine_ids={x["id"] for category in ("zonas","coletivos","pessoas","pactos",
                                         "fenomenos","cenas","tramas")
                for x in marine[category]}
    allowed=ids|places|coast_ids|frontier_ids|marine_ids|{"regiao:costa-sul"}
    people={x["id"] for x in d["pessoas"]}
    scenes={x["id"] for x in d["cenas"]}
    require(set(d["continuidades"]) <= allowed,
            "Pessoas de origem da diplomacia não existem no atlas proposto.")
    for x in all_rows:
        require(x["nome"].strip() and x["vida_ordinaria"].strip()
                and x["questao_politica"].strip(),
                "Dilema diplomático sem cotidiano e tensão.")
        require(1<=len(x["movimentos_inspiradores"])<=4
                and all(m in move_ids for m in x["movimentos_inspiradores"]),
                "Movimento cultural fora do Hack.")
        require(all(r in allowed for r in x["referencias"]),
                "Referência sem registro em diplomacia: "+x["id"])
    require(all(p["cidade_confirmada"] is False and
                p["representacao"] and p["aguas"] in ("azuis","vermelhas")
                for p in d["polos"]),
            "Polo hipotético foi tratado como cidade real.")
    require(all(c["entidade_reconhecida"] is False for c in d["casas"]),
            "Casa política proposta foi promovida a instituição canônica.")
    people_ref={p["reutiliza"] for p in d["pessoas"] if p["reutiliza"]}
    require(len(people_ref)==6 and people_ref<=marine_ids
            and sum(p["reutiliza"] is not None for p in d["pessoas"])==6,
            "Diplomacia deve dar continuidade a seis NPCs já propostos.")
    for claim in d["disputas"]:
        require(claim["status_evento"]=="nao_ocorrido" and
                len(claim["gatilho_hipotetico"])>=15
                and all(p in people for p in claim["candidatos"]),
                "Sucessão contingente foi declarada fato ou possui candidato órfão.")
    for treaty in d["tratados"]:
        require(treaty["vigente"] is False
                and len(treaty["signatarios_propostos"])>=2
                and all(p in people for p in treaty["signatarios_propostos"])
                and treaty["custo_de_adesao"] and treaty["condicao_de_ruptura"],
                "Tratado sem consentimento, custo, rompimento ou signatários.")
    for scene in d["cenas"]:
        require(len(scene["opcoes"])>=3
                and all(p in people for p in scene["elenco"])
                and scene["ligacao_crise"] in {s["id"] for s in d["disputas"]},
                "Cena não está ligada à disputa ou não tem decisões significativas.")
        if scene.get("convidado_preexistente"):
            require(scene["convidado_preexistente"] in coast_ids,
                    "Visitante costeiro não foi localizado em Portomonte.")
    for mission in d["missoes"]:
        require(len(mission["entregavel_narrativo"])>=18
                and mission["escolha"],"Missão sem objetivo e dilema jogáveis.")
    require(all(len(a["cenas"])>=2 and all(c in scenes for c in a["cenas"])
                for a in d["arcos"]),"Arco diplomático não está apoiado em cenas.")
    facts=" ".join(d["fatos_documentados"]+d["limites"]).lower()
    require("centralizado" in facts and "demônios" in facts
            and "descendentes" in facts,
            "Foram removidas ressalvas de soberania e cosmologia.")
    print("Diplomacia marinha: 41 propostas, 4 polos, 5 sucessões contingentes, 5 tratados não assinados.")


def validar_economia_mar_sangue():
    """Vínculos e restrições das propostas de economia, trabalho e captura submarina."""
    d=load("data/propostas/mar-sangue-economia-hack.json")
    counts={"polos":5,"oficios":6,"pessoas":8,"fluxos":7,
            "tributos":5,"clandestinas":4,"cenas":6,"arcos":3}
    require(d["regiao_id"]=="regiao:costa-sul"
            and d["estado"]=="propostas_narrativas_nao_canonicas"
            and d["aprovacao_autoral"] is False
            and d["efeito_automatico_no_canon"] is False,
            "Economia marinha não deve canonizar fatos.")
    require(d["contagens"]==counts
            and all(len(d[k])==n for k,n in counts.items()),
            "Contagens da economia marinha inconsistentes.")
    all_rows=[x for k in counts for x in d[k]]
    ids={x["id"] for x in all_rows}
    require(len(all_rows)==len(ids)==44
            and all(x["estado"]=="proposta_nao_canonica"
                    and x["id"].startswith("economia-mar:") for x in all_rows),
            "Entidades econômicas duplicadas ou homologadas.")
    moves=load("data/lore/hack-carcaca-dw-movimentos-povos-integrais.json")["movimentos"]
    move_ids={m["id"] for m in moves}
    places={x["id"] for x in load("data/lugares_carcaca.json")["lugares"]}
    diplomacy=load("data/propostas/mar-sangue-diplomacia-hack.json")
    d_ids={x["id"] for k in ("polos","casas","pessoas","disputas","tratados",
                             "cenas","missoes","arcos") for x in diplomacy[k]}
    ocean=load("data/propostas/mar-sangue-ecologia-politica-hack.json")
    ocean_ids={x["id"] for k in ("zonas","coletivos","pessoas","pactos",
                                 "fenomenos","cenas","tramas") for x in ocean[k]}
    coast=load("data/propostas/portomonte-ilhas-costa-sul-hack.json")
    coast_ids={x["id"] for k in ("espacos","redes","pessoas","praticas",
                                 "circulacoes","cenas","tramas") for x in coast[k]}
    valid=ids|places|d_ids|ocean_ids|coast_ids|{"regiao:costa-sul"}
    for x in all_rows:
        require(bool(x["nome"]) and bool(x["rotina"]) and bool(x["conflito"]),
                "Entidade econômica sem vida cotidiana e tensão.")
        require(1<=len(x["movimentos_inspiradores"])<=4
                and all(m in move_ids for m in x["movimentos_inspiradores"]),
                "Movimento inspirador econômico sem origem no Hack.")
        require(all(r in valid for r in x["referencias"]),
                "Referência econômica não resolvida: "+x["id"])
    require(all(p["local_confirmado"] is False for p in d["polos"]),
            "Polo material não pode criar bairro ou cidade oficial.")
    require(all(p["oficio_canonico"] is False for p in d["oficios"]),
            "Ofício proposto não é instituição comprovada.")
    require(sum(p["reutiliza"] is not None for p in d["pessoas"])==6
            and {p["reutiliza"] for p in d["pessoas"] if p["reutiliza"]}<=d_ids,
            "Seis personagens de continuidade necessários.")
    for x in d["fluxos"]:
        require(x["efetivado"] is False and x["quantidade_confirmada"] is False,
                "Fluxo futuro foi registrado como produção/comércio verdadeiro.")
        require(x["origem"] in ids and x["destino"] in ids,
                "Fluxo sem polo de origem ou destino conhecido.")
    require(all(x["vigente"] is False for x in d["tributos"]),
            "Não criar dízimo ou cobrança em vigor.")
    require(all(x["ocorrencia_confirmada"] is False and x["rota_operacional"] is False
                for x in d["clandestinas"]),
            "Circuito clandestino não pode afirmar crime ou rota real.")
    people={x["id"] for x in d["pessoas"]}
    for x in d["cenas"]:
        require(len(x["escolhas"])>=3
                and all(p in people for p in x["personagens"])
                and len(x["consequencia_condicional"])>=20,
                "Cena sem gente, escolha e consequência condicional.")
    scenes={x["id"] for x in d["cenas"]}
    require(all(len(a["cenas"])>=2 and all(c in scenes for c in a["cenas"])
                for a in d["arcos"]),
            "Arco não conectado às cenas.")
    text=" ".join(d["fatos_documentados"]+d["limites_editoriais"]).lower()
    require("escravidão" in text and "demônios" in text
            and "captura" in text and "correntes" in text,
            "Economia marinha perdeu ressalvas factuais ou cosmológicas.")
    print("Economia do Mar de Sangue: 44 propostas, 8 categorias e 7 fluxos não efetivados.")


def validar_pressao_mar_sangue_costa_sul():
    """Custos sociais de travessias sem promover rumores e taxações a fatos."""
    d=load("data/propostas/costa-sul-pressao-mar-sangue-hack.json")
    expected={"nucleos":5,"oficios":5,"pessoas":9,"impactos":6,
              "fluxos":6,"acordos":5,"cenas":6,"arcos":3}
    require(d["regiao_id"]=="regiao:costa-sul"
            and d["estado"]=="propostas_narrativas_nao_canonicas"
            and d["aprovacao_autoral"] is False
            and d["efeito_automatico_no_canon"] is False,
            "Costa sob pressão não pode se tornar cânone automaticamente.")
    require(d["contagens"]==expected and
            all(len(d[k])==v for k,v in expected.items()),
            "Categorias da pressão costeira inconsistentes.")
    rows=[x for cat in expected for x in d[cat]]
    ids={x["id"] for x in rows}
    require(len(rows)==len(ids)==45 and
            all(x["id"].startswith("costa-mar:")
                and x["estado"]=="proposta_nao_canonica" for x in rows),
            "IDs ausentes, duplicados ou canonizados.")
    movimento_ids={x["id"] for x in load("data/lore/hack-carcaca-dw-movimentos-povos-integrais.json")["movimentos"]}
    refs=set(ids)
    refs.update(x["id"] for x in load("data/lugares_carcaca.json")["lugares"])
    datasets=(
       ("data/propostas/portomonte-ilhas-costa-sul-hack.json",
        ("espacos","redes","pessoas","praticas","circulacoes","cenas","tramas")),
       ("data/propostas/mar-sangue-economia-hack.json",
        ("polos","oficios","pessoas","fluxos","tributos","clandestinas","cenas","arcos")),
       ("data/propostas/mar-sangue-diplomacia-hack.json",
        ("polos","casas","pessoas","disputas","tratados","cenas","missoes","arcos")),
       ("data/propostas/mar-sangue-ecologia-politica-hack.json",
        ("zonas","coletivos","pessoas","pactos","fenomenos","cenas","tramas")),
       ("data/propostas/fronteira-caatinga-costa-sul-hack.json",
        ("encontros","pessoas","acordos","fluxos","cenas","tramas")))
    for filename,categories in datasets:
        dataset=load(filename)
        refs.update(x["id"] for cat in categories for x in dataset[cat])
    refs.update(("regiao:costa-sul",))
    require(set(d["continuidades"]) <= refs,
            "Vínculos de continuidade costeira não resolvidos.")
    for item in rows:
        require(bool(item["nome"].strip())
                and bool(item["rotina_cotidiana"].strip())
                and bool(item["tensao_politica"].strip()),
                "Proposta sem vida material e tensão social.")
        require(1<=len(item["movimentos_inspiradores"])<=4
                and all(mid in movimento_ids for mid in item["movimentos_inspiradores"]),
                "Movimento cultural ausente do Hack.")
        require(all(ref in refs for ref in item["referencias"]),
                "Referência órfã na Costa Sul: "+item["id"])
    require(all(x["local_confirmado"] is False
                and x["estrutura_oficial"] is False for x in d["nucleos"]),
            "Núcleo hipotético tornou-se bairro ou estrutura canônica.")
    require(all(x["oficio_confirmado"] is False for x in d["oficios"]),
            "Ofício hipotético declarado existente.")
    old_people={x["id"] for x in load("data/propostas/portomonte-ilhas-costa-sul-hack.json")["pessoas"]}
    require(sum(x["reutiliza"] is not None for x in d["pessoas"])==6
            and {x["reutiliza"] for x in d["pessoas"] if x["reutiliza"]}<=old_people,
            "Seis personagens devem ser reaproveitados da Costa Sul.")
    require(all(x["ocorreu"] is False and
                len(x["efeito_em_cadeia"])>=3 and x["contrapeso"]
                for x in d["impactos"]),
            "Impacto condicional não pode virar acontecimento histórico.")
    for x in d["fluxos"]:
        require(x["efetivado"] is False and
                x["quantidade_confirmada"] is False and
                x["origem"] in refs and x["destino"] in refs,
                "Fluxo marítimo proposto tem ligação órfã ou comércio indevidamente confirmado.")
    people={x["id"] for x in d["pessoas"]}
    require(all(x["vigente"] is False and
                len(x["proponentes"])>=2 and
                all(p in people for p in x["proponentes"]) and
                x["custo"] and x["condicao_ruptura"] for x in d["acordos"]),
            "Acordo não assinado foi homologado ou perdeu custo.")
    places={x["id"] for x in d["nucleos"]}
    require(all(x["nucleo"] in places and
                all(p in people for p in x["elenco"]) and
                len(x["escolhas"])>=3 and len(x["se_ignorarem"])>=25
                for x in d["cenas"]),
            "Cena sem local, atores, opções ou consequências condicionais.")
    scenes={x["id"] for x in d["cenas"]}
    require(all(len(x["cenas"])>=2 and
                all(k in scenes for k in x["cenas"]) and x["decisao_central"]
                for x in d["arcos"]),
            "Arco sem cenas ou decisão para os jogadores.")
    facts=" ".join(d["fatos_documentados"]+d["limites_editoriais"]).lower()
    require("potabilidade" in facts and "demônios" in facts
            and "portomonte" in facts and "refugiados" in facts,
            "A expansão perdeu ressalvas importantes da lore.")
    print("Costa Sul VIII: 45 propostas, 6 impactos condicionais, 6 fluxos não efetivados.")


def validar_povoamento_garganta_rio_ancestral():
    """Fatos de ocupação e história separados de 43 propostas cotidianas."""
    d=load("data/propostas/garganta-rio-ancestral-social-hack.json")
    expected={"lugares":6,"oficios":5,"pessoas":9,"circuitos":5,
              "memorias":5,"acordos":4,"cenas":6,"arcos":3}
    require(d["contagens"]==expected
            and all(len(d[k])==v for k,v in expected.items()),
            "Povoamento Garganta/Rio: contagens divergentes.")
    require(d["estado"]=="propostas_narrativas_nao_canonicas"
            and d["aprovacao_autoral"] is False
            and d["efeito_automatico_no_canon"] is False,
            "Garganta/Rio não pode alterar cânone automaticamente.")
    require(set(d["escopos"])=={"area-proposta:garganta","area-proposta:rio"},
            "Escopos ainda não individualizados do atlas foram alterados.")
    rows=[r for categoria in expected for r in d[categoria]]
    all_ids={r["id"] for r in rows}
    require(len(rows)==len(all_ids)==43
            and all(r["id"].startswith("rio-garganta:")
                    and r["estado"]=="proposta_nao_canonica" for r in rows),
            "IDs duplicados ou propostas canonizadas.")
    sementes={s["id"] for s in load("data/propostas/povoamento-regional-hack-carcaca.json")["sementes"]}
    moves={m["id"] for m in load("data/lore/hack-carcaca-dw-movimentos-povos-integrais.json")["movimentos"]}
    for r in rows:
        require(bool(r["nome"].strip()) and bool(r["vida"].strip())
                and bool(r["conflito"].strip()),"Registro sem cotidiano e conflito.")
        require(1<=len(r["movimentos_inspiradores"])<=4
                and all(m in moves for m in r["movimentos_inspiradores"]),
                "Referência cultural sem movimento original.")
        require(all(ref in sementes for ref in r["vinculos"]),
                "Semente de povoamento anterior não encontrada.")
    require(all(r["local_confirmado"] is False
                and r["area"] in d["escopos"]
                and bool(r["ancora"]) for r in d["lugares"]),
            "Lugar proposto virou bairro canônico ou perdeu sua referência.")
    require(all(r["instituicao_confirmada"] is False for r in d["oficios"]),
            "Ofício proposto foi tratado como instituição estabelecida.")
    people={r["id"] for r in d["pessoas"]}
    require(sum(p["personagem_canonico"] is True for p in d["pessoas"])==4
            and all(p["local_atual_confirmado"] is False for p in d["pessoas"]),
            "Marxinus, Maire, Jorvan e Kaelen não devem ser duplicados ou deslocados.")
    require({p["nome"] for p in d["pessoas"] if p["personagem_canonico"]}
            =={"Marxinus","Maire","Jorvan","Kaelen Branth"},
            "Quatro personagens canônicos devem preservar nomes.")
    places={r["id"] for r in d["lugares"]}
    for r in d["circuitos"]:
        require(r["efetivado"] is False
                and r["quantidade_confirmada"] is False
                and r["area"] in d["escopos"]
                and r["origem"] in places and r["destino"] in places,
                "Circuito proposto virou rota/comércio efetivo.")
    require({r["ano_ec"] for r in d["memorias"]}=={None,211,351,358,875}
            and all(r["fato_historico_documentado"] is True
                    and r["episodio_novo_confirmado"] is False for r in d["memorias"]),
            "Marcos históricos de Garganta foram transformados em novos eventos.")
    require(all(r["vigente"] is False
                and len(r["proponentes"])>=2
                and all(p in people for p in r["proponentes"])
                for r in d["acordos"]),
            "Acordo proposto não pode ser reconhecido como assinado.")
    scenes={r["id"] for r in d["cenas"]}
    require(all(r["local_id"] in places
                and all(p in people for p in r["elenco"])
                and len(r["escolhas"])>=3
                and len(r["consequencia_condicional"])>=25
                for r in d["cenas"]),
            "Cena não contém local, atores, escolhas ou efeito condicional.")
    require(all(len(r["cenas"])>=2
                and all(c in scenes for c in r["cenas"])
                for r in d["arcos"]),
            "Arco não vinculado a cenas.")
    facts=" ".join(d["fatos_documentados"]+d["limites"]).lower()
    require("varys" in facts and "drakport" in facts and
            "lua" in facts and "yokai" in facts and
            "confederação" in facts and "abismo" in facts,
            "Foram perdidas âncoras factuais da Garganta/Rio.")
    print("Garganta e Rio IX: 43 propostas, 4 NPCs canônicos não deslocados, 5 circuitos não efetivados.")


def validar_povoamento_social_thargrid():
    """Valida a integração editorial sem transformar propostas em fatos."""
    data=load("data/propostas/thargrid-resistencia-cotidiano-hack.json")
    expected={"lugares":6,"coletivos":6,"pessoas":9,"dilemas":4,"fluxos":6,
              "acordos":5,"cenas":7,"arcos":3}
    require(data["area_id"]=="area-proposta:thargrid"
            and data["contagens"]==expected
            and data["aprovacao_autoral"] is False
            and data["efeito_automatico_no_canon"] is False,
            "Thargrid: contagens ou estado editorial alterados.")
    rows=[r for kind in expected for r in data[kind]]
    ids={r["id"] for r in rows}
    require(len(rows)==len(ids)==46 and
            all(r["estado"]=="proposta_nao_canonica" for r in rows),
            "Thargrid: registros duplicados ou indevidamente canônicos.")
    seeds={x["id"] for x in load("data/propostas/povoamento-regional-hack-carcaca.json")["sementes"]}
    moves={x["id"] for x in load("data/lore/hack-carcaca-dw-movimentos-povos-integrais.json")["movimentos"]}
    for r in rows:
        require(r["nome"] and r["rotina_cotidiana"] and r["tensao_social"]
                and all(v in seeds for v in r["vinculos"])
                and all(v in moves for v in r["movimentos_inspiradores"]),
                "Thargrid: conteúdo ou referência cultural inválidos.")
    require(all(x["local_confirmado"] is False for x in data["lugares"])
            and all(x["instituicao_confirmada"] is False for x in data["coletivos"])
            and all(x["ocorreu"] is False for x in data["dilemas"])
            and all(x["vigente"] is False for x in data["acordos"]),
            "Thargrid: evento, instituição ou tratado não confirmado.")
    lugares={x["id"] for x in data["lugares"]}
    pessoas={x["id"] for x in data["pessoas"]}
    cenas={x["id"] for x in data["cenas"]}
    require(all(x["efetivado"] is False and x["quantidade_confirmada"] is False
                and x["origem"] in lugares and x["destino"] in lugares
                for x in data["fluxos"]),
            "Thargrid: fluxo hipotético indevidamente confirmado.")
    require(all(x["local_id"] in lugares
                and all(p in pessoas for p in x["elenco"])
                and len(x["escolhas"])>=3 for x in data["cenas"]),
            "Thargrid: cena sem lugar, atores ou escolhas.")
    require(all(x["cenas"] and all(c in cenas for c in x["cenas"])
                for x in data["arcos"]),
            "Thargrid: arco sem cenas conectadas.")
    limits=" ".join(data["fatos_documentados"]+data["limites_editoriais"]).lower()
    require(all(word in limits for word in ("ordenamento","ironwood","rayquaza","921","refugiados")),
            "Thargrid: faltam limites históricos essenciais.")
    print("Thargrid X: 46 propostas válidas, fluxos e acordos não canonizados.")

def validar_resistencia_florestal_xi():
    """Confere IDs, proveniência e a não canonização de Ironwood/Eldroth."""
    data=load("data/propostas/ironwood-eldroth-resistencia-hack.json")
    categorias={"lugares":5,"coletivos":5,"pessoas":8,"dilemas":4,
                "fluxos":5,"acordos":4,"cenas":6,"arcos":3}
    require(data["contagens"]==categorias
            and data["estado"]=="propostas_narrativas_nao_canonicas"
            and data["aprovacao_autoral"] is False
            and data["efeito_automatico_no_canon"] is False,
            "Ironwood/Eldroth XI: estado ou contagens incorretos.")
    registros=[x for categoria in categorias for x in data[categoria]]
    ids={x["id"] for x in registros}
    require(len(registros)==len(ids)==40
            and all(x["estado"]=="proposta_nao_canonica"
                    and x["id"].startswith("ironwood-eldroth:") for x in registros),
            "Ironwood/Eldroth XI: IDs duplicados ou registro canonizado.")
    sementes={x["id"] for x in load("data/propostas/povoamento-regional-hack-carcaca.json")["sementes"]}
    movimentos={x["id"] for x in load("data/lore/hack-carcaca-dw-movimentos-povos-integrais.json")["movimentos"]}
    for item in registros:
        require(bool(item.get("nome")) and bool(item.get("rotina_cotidiana"))
                and bool(item.get("tensao_social"))
                and item["vinculos"] and all(x in sementes for x in item["vinculos"])
                and item["movimentos_inspiradores"]
                and all(x in movimentos for x in item["movimentos_inspiradores"]),
                "Ironwood/Eldroth XI: proposta sem origem, conteúdo ou movimentos rastreáveis.")
    lugares={x["id"] for x in data["lugares"]}
    pessoas={x["id"] for x in data["pessoas"]}
    cenas={x["id"] for x in data["cenas"]}
    require(all(x["local_confirmado"] is False for x in data["lugares"])
            and all(x["instituicao_confirmada"] is False for x in data["coletivos"])
            and all(x["localizacao_atual_confirmada"] is False for x in data["pessoas"])
            and all(x["ocorreu"] is False and len(x["opcoes"])>=3 for x in data["dilemas"])
            and all(x["vigente"] is False and set(x["proponentes"]).issubset(pessoas) for x in data["acordos"]),
            "Ironwood/Eldroth XI: local, grupo, pessoa, dilema ou acordo indevidamente confirmado.")
    require(all(x["efetivado"] is False
                and x["quantidade_confirmada"] is False
                and x["rota_operacional"] is False
                and x["origem"] in lugares and x["destino"] in lugares
                for x in data["fluxos"]),
            "Ironwood/Eldroth XI: fluxo confirmado ou sem origem/destino proposto.")
    require(all(x["ocorreu"] is False
                and x["local_id"] in lugares
                and x["elenco"] and set(x["elenco"]).issubset(pessoas)
                and len(x["escolhas"])>=3 for x in data["cenas"]),
            "Ironwood/Eldroth XI: cena mal referenciada ou efetivada.")
    require(all(x["resultado_confirmado"] is False
                and x["cenas"] and set(x["cenas"]).issubset(cenas)
                for x in data["arcos"]),
            "Ironwood/Eldroth XI: arco confirmado ou desconectado.")
    anteriores={x["id"] for x in load("data/propostas/thargrid-resistencia-cotidiano-hack.json")["pessoas"]}
    require(all(x["reutiliza"] is None or x["reutiliza"] in anteriores for x in data["pessoas"]),
            "Ironwood/Eldroth XI: personagem reutilizado sem origem.")
    limite=" ".join(data["fatos_documentados"]+data["limites_editoriais"]).lower()
    require(all(x in limite for x in ("sylara","damaris","ironwood","thargrid","refugiados")),
            "Ironwood/Eldroth XI: faltam limites de lore documentados.")
    print("Povoamento XI: 40 propostas, 0 rotas/acontecimentos/acordos canonizados.")



def validar_ecologia_monstruosa_xii():
    """Valida o módulo hipotético sem incluir rascunhos nas criaturas do atlas."""
    data=load("data/propostas/eldroth-ecologia-monstruosa-dw.json")
    schema=load("schemas/ecologia-monstruosa-xii.schema.json")
    Draft202012Validator.check_schema(schema)
    errors=list(Draft202012Validator(schema).iter_errors(data))
    require(not errors, f"Ecologia XII: schema inválido: {errors[:2]}")
    categorias={"criaturas":8,"encontros":6,"pressoes":4,"frentes":2}
    require(data["contagens"]==categorias and
            data["aprovacao_autoral"] is False and
            data["efeito_automatico_no_canon"] is False,
            "Ecologia XII: contagens ou estado editorial alterados.")
    registros=[item for cat in categorias for item in data[cat]]
    ids=[item["id"] for item in registros]
    require(len(ids)==len(set(ids))==20 and
            all(item["id"].startswith("ecologia-xii:") for item in registros),
            "Ecologia XII: IDs duplicados ou prefixo errado.")
    taxonomia={x["id"] for x in load("data/taxonomia_carcaca.json")["tipos"]}
    anteriores=load("data/propostas/ironwood-eldroth-resistencia-hack.json")
    lugares_xi={x["id"] for x in anteriores["lugares"]}
    cenas_xi={x["id"] for x in anteriores["cenas"]}
    cid={x["id"] for x in data["criaturas"]}
    eid={x["id"] for x in data["encontros"]}
    for criatura in data["criaturas"]:
        escopo=criatura["localizacao_proposta"]["escopo"]
        rid=criatura["localizacao_proposta"]["regiao_canonica_de_referencia"]
        require(criatura["tipo_carcaca_proposto"] in taxonomia
                and criatura["vinculo_cena_anterior"] in cenas_xi
                and criatura["dungeon_world"]["instinto"]
                and len(criatura["dungeon_world"]["movimentos"])>=3
                and criatura["ocorrencia_confirmada"] is False,
                "Ecologia XII: tipo, instinto, proveniência ou ocorrência inválidos.")
        require(criatura["localizacao_proposta"]["local_proposto_id"] in lugares_xi,
                "Ecologia XII: habitat proposto sem ligação no ciclo XI.")
        require((rid is None) if escopo=="ironwood" else (rid=="regiao:eldroth"),
                "Ecologia XII: Ironwood foi confundida com Eldroth ou região errada.")
        require(all(criatura["dungeon_world"]["estatisticas"][k] is None
                    for k in ("pv","armadura","dano","nd_dnd")),
                "Ecologia XII: estatística DW/D&D inventada ou convertida.")
        require(criatura["ecologia"]["alimentacao_confirmada"] is None
                and criatura["ecologia"]["reproducao_confirmada"] is None
                and criatura["ecologia"]["densidade_confirmada"] is None,
                "Ecologia XII: dados ecológicos não medidos preenchidos.")
    for encontro in data["encontros"]:
        require(encontro["cena_anterior_id"] in cenas_xi
                and set(encontro["criaturas_ids"]).issubset(cid)
                and len(encontro["escolhas_sem_combater"])>=3
                and encontro["ocorreu"] is False
                and encontro["resultado_canonico"] is None,
                "Ecologia XII: encontro sem referência, escolhas ou fictício realizado.")
    for pressao in data["pressoes"]:
        require(set(pressao["criaturas_ids"]).issubset(cid)
                and pressao["ocorreu"] is False
                and pressao["medicao"] is None and pressao["periodo"] is None,
                "Ecologia XII: pressão foi efetivada ou quantificada.")
    for frente in data["frentes"]:
        require(set(frente["criaturas_ids"]).issubset(cid)
                and set(frente["encontros_ids"]).issubset(eid)
                and len(frente["pressagios_sombrios_propostos"])==3
                and frente["pressagios_realizados"]==[]
                and frente["ocorreu"] is False
                and frente["resultado_canonico"] is None,
                "Ecologia XII: frente já consumada ou com ponte quebrada.")
    # O bestiário canônico permanece distinto: nenhuma das oito espécies foi
    # armazenada na árvore de fichas de monstros curados.
    ids_canonicos={x["id"] for x in gather("curadoria/criaturas")}
    require(not (ids_canonicos & cid),
            "Ecologia XII: criatura em proposta colidiu com catálogo curado.")
    print("Ecologia XII: 8 criaturas, 6 encontros, 4 pressões, 2 frentes propostos; zero promoção canônica.")


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
    validar_guias_dossies_regionais(fontes,rids)
    validar_prioridades_curadoria(fontes)
    validar_lore_manuscrito()
    validar_pontes_lore_manuscrito(rids)
    validar_indice_mecanicas_manuscrito()
    validar_terceira_auditoria_manuscrito()
    validar_quarta_auditoria_manuscrito()
    validar_integracao_movimentos_gerais()
    validar_regras_nucleo_hack()
    validar_integracao_personagens_hack()
    validar_guerreiro_integral()
    validar_barbaro_integral()
    validar_cacador_integral()
    validar_ladino_integral()
    validar_bardo_integral()
    validar_artista_marcial_integral()
    validar_paladino_integral()
    validar_clerigo_integral()
    validar_druida_integral()
    validar_mago_integral()
    validar_feiticeiro_integral()
    validar_bruxo_integral()
    validar_necromante_integral()
    validar_artifice_integral()
    validar_mercenario_integral()
    validar_fechamento_classes_integrais()
    validar_povoamento_narrativo_hack()
    validar_rede_social_caatinga()
    validar_fronteira_caatinga_costa_sul()
    validar_povoamento_costa_sul()
    validar_ecologia_politica_mar_sangue()
    validar_diplomacia_mar_sangue()
    validar_economia_mar_sangue()
    validar_pressao_mar_sangue_costa_sul()
    validar_povoamento_garganta_rio_ancestral()
    validar_povoamento_social_thargrid()
    validar_resistencia_florestal_xi()
    validar_ecologia_monstruosa_xii()
    print(f"Curadoria validada: {len(criaturas)} criaturas; {len(regioes)} regiões; "
          f"{len(lugares)} lugares; {len(faccoes)} facções; "
          f"{len(frentes)} frentes; {len(assentamentos)} assentamentos.")

if __name__=="__main__":
    main()
