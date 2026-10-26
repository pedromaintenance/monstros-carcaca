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

    print(f"Curadoria validada: {len(criaturas)} criaturas; {len(regioes)} regiões; "
          f"{len(lugares)} lugares; {len(faccoes)} facções; "
          f"{len(frentes)} frentes; {len(assentamentos)} assentamentos.")

if __name__=="__main__":
    main()
