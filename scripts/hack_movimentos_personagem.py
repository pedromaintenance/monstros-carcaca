"""Índices determinísticos para movimentos de povo e inventário de classe.
Requerimentos identificados não são autorização de aquisição de movimentos.
"""
from collections import defaultdict

def ordered_index(rows,by):
    mapping=defaultdict(set)
    for item in rows:
        for value in by(item):
            if value is not None and value!="":
                mapping[str(value)].add(item["id"])
    return {k:sorted(v) for k,v in sorted(mapping.items())}

def build_people_indexes(movements):
    return {
      "by_grupo":ordered_index(movements,lambda m:[m["grupo"]]),
      "by_marcador":ordered_index(movements,lambda m:[m["marcador_original"]]),
      "by_tem_opcoes":ordered_index(movements,lambda m:["sim" if m["opcoes"] else "nao"]),
      "by_paragrafo":ordered_index(movements,lambda m:[m["paragrafo_docx"]]),
      "by_piloto_integral":ordered_index(movements,lambda m:[m.get("piloto_integral_id")]),
    }

def build_class_indexes(movements,edges,pending):
    return {
      "by_grupo":ordered_index(movements,lambda m:[m["grupo"]]),
      "by_tem_requer":ordered_index(movements,lambda m:["sim" if m["requisito_literal"] else "nao"]),
      "by_requisito_literal":ordered_index(movements,lambda m:[m["requisito_literal"]]),
      "by_paragrafo":ordered_index(movements,lambda m:[m["paragrafo_docx"]]),
      "by_movimento_dependente":ordered_index(edges,lambda e:[e["origem_movimento_id"]]),
      "by_movimento_requerido":ordered_index(edges,lambda e:[e["requisito_movimento_id"]]),
      "by_movimento_pendente":{
          item["origem_movimento_id"]:item["requisito_literal"] for item in pending
      }
    }

def build_warrior_indexes(movements):
    """Índices de origem sem tratar elegibilidade como autorização de jogo."""
    return {
      "by_requisito_tipo":ordered_index(movements,lambda m:[
        (m["requisito_estruturado"] or {}).get("tipo","nenhum")]),
      "by_tem_requer":ordered_index(movements,lambda m:[
        "sim" if m["requisito_literal"] else "nao"]),
      "by_tem_opcoes":ordered_index(movements,lambda m:[
        "sim" if m["opcoes"] else "nao"]),
      "by_paragrafo":ordered_index(movements,lambda m:[m["paragrafo_docx"]]),
      "by_requisito_id":ordered_index(movements,lambda m:[
        (m["requisito_estruturado"] or {}).get("movimento_id")]),
    }

def build_barbarian_indexes(movements):
    """Índices da transcrição completa, incluindo todos os ramos do REQUER composto."""
    def required_ids(m):
        req=m["requisito_estruturado"]
        if not req: return []
        if req["tipo"]=="movimento_exato":
            return [req["movimento_id"]]
        if req["tipo"]=="todos":
            return [x["movimento_id"] for x in req["itens"] if x["tipo"]=="movimento_exato"]
        return []
    return {
      "by_requisito_tipo":ordered_index(movements,lambda m:[(m["requisito_estruturado"] or {}).get("tipo","nenhum")]),
      "by_tem_requer":ordered_index(movements,lambda m:["sim" if m["requisito_literal"] else "nao"]),
      "by_tem_opcoes":ordered_index(movements,lambda m:["sim" if m["opcoes"] else "nao"]),
      "by_paragrafo":ordered_index(movements,lambda m:[m["paragrafo_docx"]]),
      "by_requisito_id":ordered_index(movements,required_ids),
      "by_titulo":ordered_index(movements,lambda m:[m["titulo"]]),
    }

def build_hunter_indexes(movements):
    """Indexação íntegra de alternativas, conjunções e condições ficcionais de REQUER.

    As arestas são referências de candidatos, nunca permissão automática de aquisição.
    """
    def req_ids(m):
        req=m["requisito_estruturado"]
        if not req:return []
        if req["tipo"]=="movimento_exato":return [req["movimento_id"]]
        if req["tipo"] in ("todos","qualquer"):
            return [x["movimento_id"] for x in req["itens"] if x["tipo"]=="movimento_exato"]
        return []
    def has_fiction(m):
        req=m["requisito_estruturado"] or {}
        return "sim" if any(x["tipo"]=="condicao_ficcional" for x in req.get("itens",[])) else "nao"
    return {
      "by_requisito_tipo":ordered_index(movements,lambda m:[(m["requisito_estruturado"] or {}).get("tipo","nenhum")]),
      "by_tem_requer":ordered_index(movements,lambda m:["sim" if m["requisito_literal"] else "nao"]),
      "by_tem_opcoes":ordered_index(movements,lambda m:["sim" if m["opcoes"] else "nao"]),
      "by_paragrafo":ordered_index(movements,lambda m:[m["paragrafo_docx"]]),
      "by_requisito_id":ordered_index(movements,req_ids),
      "by_condicao_ficcional":ordered_index(movements,lambda m:[has_fiction(m)]),
      "by_titulo":ordered_index(movements,lambda m:[m["titulo"]]),
    }

def build_rogue_indexes(movements):
    """Ladino: preserva REQUER direto, OU e referência sem alvo documentado."""
    def candidate_ids(m):
        req=m["requisito_estruturado"]
        if not req:return []
        if req["tipo"]=="movimento_exato":return [req["movimento_id"]]
        if req["tipo"]=="qualquer":
            return [x["movimento_id"] for x in req["itens"] if x["tipo"]=="movimento_exato"]
        return []
    return {
      "by_requisito_tipo":ordered_index(movements,lambda m:[(m["requisito_estruturado"] or {}).get("tipo","nenhum")]),
      "by_tem_requer":ordered_index(movements,lambda m:["sim" if m["requisito_literal"] else "nao"]),
      "by_tem_opcoes":ordered_index(movements,lambda m:["sim" if m["opcoes"] else "nao"]),
      "by_paragrafo":ordered_index(movements,lambda m:[m["paragrafo_docx"]]),
      "by_requisito_id":ordered_index(movements,candidate_ids),
      "by_referencia_sem_alvo":ordered_index(movements,lambda m:[
          (m["requisito_estruturado"] or {}).get("texto_literal")
          if (m["requisito_estruturado"] or {}).get("tipo")=="referencia_sem_alvo"
          else None]),
      "by_titulo":ordered_index(movements,lambda m:[m["titulo"]]),
    }


def build_bard_indexes(movements):
    """Índices de movimentos do Bardo; REQUER cardinal mantém semântica, sem liberar compra."""
    def req_ids(m):
        req=m["requisito_estruturado"]
        if not req:return []
        if req["tipo"]=="movimento_exato":return [req["movimento_id"]]
        if req["tipo"]=="todos":
            return [x["movimento_id"] for x in req["itens"] if x["tipo"]=="movimento_exato"]
        return []
    return {
      "by_requisito_tipo":ordered_index(movements,lambda m:[
          (m["requisito_estruturado"] or {}).get("tipo","nenhum")]),
      "by_tem_requer":ordered_index(movements,lambda m:[
          "sim" if m["requisito_literal"] else "nao"]),
      "by_tem_opcoes":ordered_index(movements,lambda m:[
          "sim" if m["opcoes"] else "nao"]),
      "by_paragrafo":ordered_index(movements,lambda m:[m["paragrafo_docx"]]),
      "by_requisito_id":ordered_index(movements,req_ids),
      "by_quantidade_minima_grupo":ordered_index(movements,lambda m:[
          item["grupo"]+":"+str(item["quantidade_minima"])
          for item in (m["requisito_estruturado"] or {}).get("itens",[])
          if item["tipo"]=="quantidade_movimentos_grupo"]),
      "by_titulo":ordered_index(movements,lambda m:[m["titulo"]]),
    }


def build_martial_artist_indexes(movements):
    """Indexa todos os braços de REQUER (VOO exige os dois). Sem homologar seleção."""
    def required_ids(m):
        req=m["requisito_estruturado"]
        if not req:return []
        if req["tipo"]=="movimento_exato":return [req["movimento_id"]]
        if req["tipo"]=="todos":
            return [item["movimento_id"] for item in req["itens"]
                    if item["tipo"]=="movimento_exato"]
        return []
    return {
      "by_requisito_tipo":ordered_index(movements,lambda m:[
          (m["requisito_estruturado"] or {}).get("tipo","nenhum")]),
      "by_tem_requer":ordered_index(movements,lambda m:[
          "sim" if m["requisito_literal"] else "nao"]),
      "by_tem_opcoes":ordered_index(movements,lambda m:[
          "sim" if m["opcoes"] else "nao"]),
      "by_paragrafo":ordered_index(movements,lambda m:[m["paragrafo_docx"]]),
      "by_requisito_id":ordered_index(movements,required_ids),
      "by_titulo":ordered_index(movements,lambda m:[m["titulo"]]),
    }

def build_paladin_indexes(moves):
    """REQUER e concessoes sao relacoes distintas; nenhuma e aplicada."""
    return {
        "by_requisito_tipo":ordered_index(moves,lambda m:[(m["requisito_estruturado"] or {}).get("tipo","nenhum")]),
        "by_tem_requer":ordered_index(moves,lambda m:["sim" if m["requisito_literal"] else "nao"]),
        "by_tem_opcoes":ordered_index(moves,lambda m:["sim" if m["opcoes"] else "nao"]),
        "by_paragrafo":ordered_index(moves,lambda m:[m["paragrafo_docx"]]),
        "by_titulo":ordered_index(moves,lambda m:[m["titulo"]]),
        "by_requisito_id":ordered_index(moves,lambda m:[(m["requisito_estruturado"] or {}).get("movimento_id")]),
        "by_movimento_concedido":ordered_index(moves,lambda m:[g["movimento_id"] for g in m["concessoes_gratuitas_literais"]])
    }


def build_cleric_indexes(moves):
    """Indexa requisitos literais, inclusive cadeias transitivas, sem impor Sacerdote a todos."""
    by_id={m["id"]:m for m in moves}
    def req_ids(m):
        req=m["requisito_estruturado"]
        return [req["movimento_id"]] if req else []
    def raiz(m):
        if not m["requisito_estruturado"]:return []
        seen={m["id"]};cur=m
        while cur["requisito_estruturado"]:
            target=cur["requisito_estruturado"]["movimento_id"]
            if target in seen or target not in by_id:
                raise ValueError("Ciclo ou REQUER externo inesperado em Clérigo")
            seen.add(target);cur=by_id[target]
        return [cur["id"]]
    return {
      "by_titulo":ordered_index(moves,lambda m:[m["titulo"]]),
      "by_paragrafo":ordered_index(moves,lambda m:[m["paragrafo_docx"]]),
      "by_tem_requer":ordered_index(moves,lambda m:["sim" if m["requisito_literal"] else "nao"]),
      "by_tem_opcoes":ordered_index(moves,lambda m:["sim" if m["opcoes"] else "nao"]),
      "by_requisito_tipo":ordered_index(moves,lambda m:[(m["requisito_estruturado"] or {}).get("tipo","nenhum")]),
      "by_requisito_id":ordered_index(moves,req_ids),
      "by_raiz_dependencia":ordered_index(moves,raiz)
    }


def build_druid_indexes(moves):
    """Indexa todos os componentes de REQUER, sem simplificar a conjuncao E."""
    def componentes(m):
        req=m["requisito_estruturado"]
        if not req:return []
        if req["tipo"]=="movimento_exato":return [req["movimento_id"]]
        if req["tipo"]=="todos":
            return [x["movimento_id"] for x in req["itens"] if x["tipo"]=="movimento_exato"]
        raise ValueError("Tipo inesperado de REQUER em Druida")
    return {
      "by_titulo":ordered_index(moves,lambda m:[m["titulo"]]),
      "by_paragrafo":ordered_index(moves,lambda m:[m["paragrafo_docx"]]),
      "by_tem_requer":ordered_index(moves,lambda m:["sim" if m["requisito_literal"] else "nao"]),
      "by_tem_opcoes":ordered_index(moves,lambda m:["sim" if m["opcoes"] else "nao"]),
      "by_requisito_tipo":ordered_index(moves,lambda m:[(m["requisito_estruturado"] or {}).get("tipo","nenhum")]),
      "by_requisito_id":ordered_index(moves,componentes)
    }



def build_mage_indexes(moves):
    """Indexa 21 REQUER de Mago sem promover Grimório a requisito universal."""
    by_id={m["id"]:m for m in moves}
    def raiz(m):
        req=m["requisito_estruturado"]
        if not req:return []
        target=req["movimento_id"]
        seen={m["id"]}
        while target in by_id:
            if target in seen:raise ValueError("Ciclo de REQUER de Mago")
            seen.add(target)
            nxt=by_id[target]["requisito_estruturado"]
            if not nxt:return [target]
            target=nxt["movimento_id"]
        raise ValueError("REQUER de Mago sem alvo documentado")
    return {
      "by_titulo":ordered_index(moves,lambda m:[m["titulo"]]),
      "by_paragrafo":ordered_index(moves,lambda m:[m["paragrafo_docx"]]),
      "by_tem_requer":ordered_index(moves,lambda m:["sim" if m["requisito_literal"] else "nao"]),
      "by_tem_opcoes":ordered_index(moves,lambda m:["sim" if m["opcoes"] else "nao"]),
      "by_requisito_tipo":ordered_index(moves,lambda m:[
         (m["requisito_estruturado"] or {}).get("tipo","nenhum")]),
      "by_requisito_id":ordered_index(moves,lambda m:[
         (m["requisito_estruturado"] or {}).get("movimento_id")]),
      "by_raiz_dependencia":ordered_index(moves,raiz)
    }


def build_sorcerer_indexes(moves):
    """Indexa 20 REQUER de Feiticeiro sem promover Grimório a requisito universal."""
    by_id={m["id"]:m for m in moves}
    def raiz(m):
        req=m["requisito_estruturado"]
        if not req:return []
        target=req["movimento_id"]
        seen={m["id"]}
        while target in by_id:
            if target in seen:raise ValueError("Ciclo de REQUER de Feiticeiro")
            seen.add(target)
            nxt=by_id[target]["requisito_estruturado"]
            if not nxt:return [target]
            target=nxt["movimento_id"]
        raise ValueError("REQUER de Feiticeiro sem alvo documentado")
    return {
      "by_titulo":ordered_index(moves,lambda m:[m["titulo"]]),
      "by_paragrafo":ordered_index(moves,lambda m:[m["paragrafo_docx"]]),
      "by_tem_requer":ordered_index(moves,lambda m:["sim" if m["requisito_literal"] else "nao"]),
      "by_tem_opcoes":ordered_index(moves,lambda m:["sim" if m["opcoes"] else "nao"]),
      "by_requisito_tipo":ordered_index(moves,lambda m:[
         (m["requisito_estruturado"] or {}).get("tipo","nenhum")]),
      "by_requisito_id":ordered_index(moves,lambda m:[
         (m["requisito_estruturado"] or {}).get("movimento_id")]),
      "by_raiz_dependencia":ordered_index(moves,raiz)
    }


def build_warlock_indexes(moves):
    """Indices de Bruxo: cinco raízes de dependência e Sabá independente."""
    by_id={m["id"]:m for m in moves}
    def root(m):
        req=m["requisito_estruturado"]
        if not req:return []
        target=req["movimento_id"]
        seen={m["id"]}
        while target in by_id:
            if target in seen:raise ValueError("Ciclo de REQUER em Bruxo")
            seen.add(target)
            next_req=by_id[target]["requisito_estruturado"]
            if not next_req:return [target]
            target=next_req["movimento_id"]
        raise ValueError("REQUER de Bruxo sem alvo no inventário")
    return {
      "by_titulo":ordered_index(moves,lambda m:[m["titulo"]]),
      "by_paragrafo":ordered_index(moves,lambda m:[m["paragrafo_docx"]]),
      "by_tem_requer":ordered_index(moves,lambda m:["sim" if m["requisito_literal"] else "nao"]),
      "by_tem_opcoes":ordered_index(moves,lambda m:["sim" if m["opcoes"] else "nao"]),
      "by_requisito_tipo":ordered_index(moves,lambda m:[
          (m["requisito_estruturado"] or {}).get("tipo","nenhum")]),
      "by_requisito_id":ordered_index(moves,lambda m:[
          (m["requisito_estruturado"] or {}).get("movimento_id")]),
      "by_raiz_dependencia":ordered_index(moves,root)
    }
