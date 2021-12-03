import pandas as pd
import json


SPRINTS_LIST = ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4']


def create_dic_values(df):
    dic = {}
    for sprint_name in SPRINTS_LIST:
        df_filter = df['Número da sprint'] == sprint_name
        cols = df.columns[2:]
        val = df[df_filter][cols]
        sum_val = dict(val.sum())
        sprint_result = {}
        for key in sum_val:
            try:
                sprint_result[key] = sum_val[key] / len(val)
            except Exception:
                # se a coluna não é o valor do PACER
                pass
        dic[sprint_name] = sprint_result
        dic[sprint_name]["Número da sprint"] = sprint_name
        dic[sprint_name]['respostas_qtd'] = len(val)
    return dic


def create_result_struct(file_name):
    df = pd.read_excel(file_name, header=0)
    result = create_dic_values(df)
    return result


def create_json_file(files):
    for file_name in files:
        grupo = create_result_struct(f"./{file_name}.xlsx")
        with open(f'{file_name}.json', 'w', encoding='utf-8') as writer:
            writer.write(json.dumps(grupo, indent=4, ensure_ascii=False))


create_json_file(["g1", "g2", "g3", "g4"])
