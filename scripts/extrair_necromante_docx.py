#!/usr/bin/env python3
"""Extrai todos os movimentos de NECROMANTE do Hack Carcaça Dungeon World.
Uso: python extrair_bruxo_docx.py MANUSCRITO.docx INVENTARIO.json [SAIDA.json]
Dependência opcional de autoria: python-docx. O manuscrito original é privado.
"""
from __future__ import annotations
from pathlib import Path
from docx import Document
import gzip,hashlib,json,re,sys,unicodedata

FIRST,LAST,HEADING,NEXT_HEADING=2581,2666,2579,2670


def slug(text):
    return re.sub(r'[^a-z0-9]+','-',unicodedata.normalize('NFKD',text)
                  .encode('ASCII','ignore').decode().lower()).strip('-')


def extract(source,inventory):
    source=Path(source); inventory=Path(inventory)
    inv=json.loads(inventory.read_text(encoding='utf-8'))
    sha=hashlib.sha256(source.read_bytes()).hexdigest()
    if sha!=inv['fonte_sha256']:
        raise ValueError('O manuscrito não corresponde ao inventário (SHA256 divergente)')
    doc=Document(source)
    group=[m for m in inv['movimentos'] if m['grupo']=='NECROMANTE']
    if len(group)!=29 or group[0]['paragrafo_docx']!=FIRST or group[-1]['paragrafo_docx']!=LAST:
        raise ValueError('A organização da classe NECROMANTE mudou')
    if doc.paragraphs[HEADING].text.strip()!='NECROMANTE' or doc.paragraphs[NEXT_HEADING].text.strip()!='ARTÍFICE':
        raise ValueError('Limites de classes no DOCX alterados')
    edges={x['origem_movimento_id']:x for x in inv['dependencias_exatas_candidatas']}
    pending={x['origem_movimento_id']:x for x in inv['dependencias_nao_resolvidas']}
    by_id={m['id']:m for m in group}
    by_title={slug(m['titulo']):m for m in group}
    output=[];parts_seen=set()
    for pos,orig in enumerate(group):
        i=orig['paragrafo_docx'];stop=group[pos+1]['paragrafo_docx'] if pos+1<len(group) else NEXT_HEADING
        lines=doc.paragraphs[i].text.strip().splitlines()
        if not lines or lines.pop(0).strip()!=orig['titulo']:
            raise ValueError(f'Título diferente do inventário: parágrafo {i}')
        req=None
        if lines and lines[0].strip().startswith('REQUER:'):
            req=lines.pop(0).split(':',1)[1].strip()
        if req!=orig['requisito_literal']:
            raise ValueError(f'REQUER divergente: parágrafo {i}')
        body='\n'.join(lines).strip()
        if not body:raise ValueError(f'Sem efeito textual: parágrafo {i}')
        parts=[{'paragrafo_docx':i,'tipo':'corpo','texto':body}];options=[]
        for j in range(i+1,stop):
            p=doc.paragraphs[j];txt=p.text.strip()
            if p.style.name.startswith('Heading') and txt:
                raise ValueError(f'Cabeçalho inesperado dentro de movimento: {j}')
            if not txt:continue
            kind='opcao' if p.style.name=='List Paragraph' else 'continuacao'
            parts.append({'paragrafo_docx':j,'tipo':kind,'texto':txt})
            if kind=='opcao': options.append({'paragrafo_docx':j,'texto':txt})
        for part in parts:
            if part['paragrafo_docx'] in parts_seen:raise ValueError('Parágrafo atribuído a mais de um movimento')
            parts_seen.add(part['paragrafo_docx'])
        if not req:
            if orig['id'] in edges or orig['id'] in pending:raise ValueError('Aresta sem REQUER')
            structured=None
        elif orig['id'] in edges:
            candidate=edges[orig['id']]
            target=by_id.get(candidate['requisito_movimento_id'])
            if not target or slug(req)!=slug(target['titulo']):raise ValueError('Dependência sem alvo exato no grupo')
            structured={'tipo':'movimento_exato','movimento_id':target['id'],
                        'titulo_requerido':target['titulo'],'escopo':candidate['escopo'],
                        'status':'correspondencia_exata_na_fonte_pendente_homologacao'}
        elif orig['id'] in pending:
            alternatives={
              'Animar os Mortos e Nome do Morto':('ANIMAR OS MORTOS','NOME DO MORTO'),
              'Animar os Mortos e Colheita de Ossos':('ANIMAR OS MORTOS','COLHEITA DE OSSOS'),
            }
            names=alternatives.get(req)
            if not names or i not in (2616,2617):
                raise ValueError(f'REQUER não resolvido/inesperado: {i} {req}')
            components=[]
            for name in names:
                target=by_title.get(slug(name))
                if not target:raise ValueError(f'Não encontrado REQUER componente: {name}')
                components.append({'tipo':'movimento_exato','movimento_id':target['id'],
                                   'titulo_requerido':target['titulo']})
            structured={'tipo':'todos','operador_literal':'e','itens':components,
                        'status':'interpretacao_literal_pendente_homologacao'}
        else:
            raise ValueError(f'REQUER não resolvido/inesperado: {i} {req}')
        output.append({'id':orig['id'],'paragrafo_docx':i,'grupo':'NECROMANTE',
                       'categoria':'classe','titulo':orig['titulo'],
                       'requisito_literal':req,'requisito_estruturado':structured,
                       'partes':parts,'opcoes':options,
                       'texto_original':'\n'.join(part['texto'] for part in parts),
                       'texto_integral_conferido':True,
                       'estado':'transcricao_integral_sem_revisao_mecanica',
                       'aplicacao_canonica':False,'origem_inventario_id':orig['id']})
    counts={'total_movimentos':len(output),
            'total_com_requer':sum(bool(m['requisito_literal']) for m in output),
            'total_vinculos_exatos':sum((m['requisito_estruturado'] or {}).get('tipo')=='movimento_exato' for m in output),
            'total_opcoes':sum(len(m['opcoes']) for m in output),
            'total_partes':sum(len(m['partes']) for m in output),
            'total_requer_composto':sum((m['requisito_estruturado'] or {}).get('tipo')=='todos' for m in output)}
    if counts!={'total_movimentos':29,'total_com_requer':11,'total_vinculos_exatos':9,'total_opcoes':45,'total_partes':83,'total_requer_composto':2} or len(parts_seen)!=counts['total_partes']:
        raise ValueError(f'Integridade documental divergente: {counts}')
    return {'schema_version':'0.1.0','fonte':inv['fonte'],'fonte_sha256':sha,
            'grupo':'NECROMANTE','posicao':'indices_paragrafo_docx_zero_based',
            'descricao':'Transcrição integral de NECROMANTE com necromancia e requisitos diretos e cumulativos, opções e REQUER diretos fiéis à fonte; não homologa mecânicas.',
            'movimentos':output,'integridade':counts}

if __name__=='__main__':
    source=sys.argv[1] if len(sys.argv)>1 else '/mnt/data/Hack Carcaça Dungeon World(1).docx'
    inventory=sys.argv[2] if len(sys.argv)>2 else '/mnt/data/ciclo_movimentos/hack-carcaca-dw-inventario-classes-requer.json'
    path=Path(sys.argv[3] if len(sys.argv)>3 else '/mnt/data/ciclo_necromante/hack-carcaca-dw-necromante-integrais.json')
    obj=extract(source,inventory)
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    compressed=path.with_suffix('.json.gz')
    compressed.write_bytes(gzip.compress(json.dumps(obj,ensure_ascii=False,separators=(',',':')).encode('utf-8'),mtime=0))
    print(json.dumps(obj['integridade'],ensure_ascii=False,indent=2))
    print('Fonte JSON',path.stat().st_size,'bytes; gzip',compressed.stat().st_size,'bytes')