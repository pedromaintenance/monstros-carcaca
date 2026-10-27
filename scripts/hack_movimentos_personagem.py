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
