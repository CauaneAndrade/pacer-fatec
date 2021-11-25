import pandas as pd
import json


def create_dic_values(df, dic, sprint_name_list: list):
    for sprint_name in sprint_name_list:
        df_filter = df['Número da sprint'] == sprint_name
        cols = df.columns[2:]
        dic[sprint_name] = dict(df[df_filter][cols].sum())
        dic[sprint_name]["Número da sprint"] = sprint_name
    return dic


def create_result_struct(file_name):
    df = pd.read_excel(file_name, header=0)
    dic = {}
    sprints = ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4']
    result = create_dic_values(df, dic, sprints)
    # sp1 = df['Número da sprint'] == 'Sprint 1'
    # sp2 = df['Número da sprint'] == 'Sprint 2'
    # sp3 = df['Número da sprint'] == 'Sprint 3'
    # sp4 = df['Número da sprint'] == 'Sprint 4'
    # cols = df.columns[2:]
    # dic["Sprint 1"] = dict(df[sp1][cols].sum())
    # dic["Sprint 2"] = dict(df[sp2][cols].sum())
    # dic["Sprint 3"] = dict(df[sp3][cols].sum())
    # dic["Sprint 4"] = dict(df[sp4][cols].sum())
    return result


g1 = create_result_struct("./g1.xlsx")
g2 = create_result_struct("./g2.xlsx")
g3 = create_result_struct("./g3.xlsx")
g4 = create_result_struct("./g4.xlsx")


with open('g1.json', 'w', encoding='utf-8') as writer:
    writer.write(json.dumps(g1, indent=4, ensure_ascii=False))

with open('g2.json', 'w', encoding='utf-8') as writer:
    writer.write(json.dumps(g2, indent=4, ensure_ascii=False))

with open('g3.json', 'w', encoding='utf-8') as writer:
    writer.write(json.dumps(g3, indent=4, ensure_ascii=False))

with open('g4.json', 'w', encoding='utf-8') as writer:
    writer.write(json.dumps(g4, indent=4, ensure_ascii=False))
    