window.onload = async function() {
    g1Label = "Grupo 1";
    const g1 = [
        "Gabriel Borges (SM)",
        "Isabelle Oliveira (PO)",
        "Gabriel Mendes",
        "Gustavo Lopes",
        "Samuel Costa",
        "Victoria Ribeiro"
    ];
  
    g2Label = "Grupo 2";
    const g2 = [
        "Vitor L. Amorim (SM)",
        "Eduardo F. R. Querido (PO)",
        "Douglas H. T. Barboza",
        "Fabrício C. Vasconcellos",
        "Jonatas R. Ferreira",
        "Rafael R. Rodrigues",
        "Samuel D. Xavier"
    ];
  
    g3Label = "Grupo 3";
    const g3 = [
        "Tábatha Fróes (SM)",
        "Natália dos Reis Neves (PO)",
        "Ângelo Lima",
        "Caique Fernandes",
        "José Henrique dos Santos",
        "Larissa Miho Takahashi",
        "Matheus Henrique Rothstein Vieira",
        "Renato Passos",
        "Sandro Toline de Oliveira Junior"
    ];
  
    g4Label = "Grupo 4";
    const g4 = [
        "Christian Dantas (Master)",
        "Jennifer Dominique (PO)",
        "Brendo Bubela",
        "Bruna Gomes",
        "Davi Ramos",
        "Luara Cristine Goulart",
        "Mariana Araújo",
        "Marcos",
        "Joao"
    ];
  
    var grupoAlunoData = {
        "Grupo 1": g1,
        "Grupo 2": g2,
        "Grupo 3": g3,
        "Grupo 4": g4
    };
  
    const grupos = [g1Label, g2Label, g3Label, g4Label];
    const alunoSelect = document.getElementById("aluno");
    const grupoSelect = document.getElementById("grupo");
    const sprintSelect = document.getElementById("sprint");
  
    function getAlunos(grupo) {
        if (grupo) {
            return grupoAlunoData[grupo]; // list
        }
        return grupoAlunoData; // {}
    }
  
    function addElementHtml(id, mainDiv, extra) {
        var div = document.createElement("div");
        div.style.width = "25%";
        div.style.display = "inline-block";
        var innerDiv = document.createElement("canvas");
        innerDiv.id = id;
        if (extra) {
            var titleAluno = document.createElement("h3");
            titleAluno.innerHTML = extra;
            titleAluno.style.textAlign = "center";
            div.appendChild(titleAluno);
        }
        div.appendChild(innerDiv);
        mainDiv.appendChild(div);
    }
  
    function addChartsDinamically(grupoAlunos) {
        let ids = [];
        var mainDiv = document.getElementById("main");
        mainDiv.innerHTML = "";
        for (let i = 0; i < grupoAlunos.length; i++) {
            let id = `dynamically-id-${i}`;
            ids.push(id);
            addElementHtml(id, mainDiv, grupoAlunos[i]);
        }
        return ids;
    }
  
    function buildSelectValues(selectElement, dataList, extraData = "") {
        selectElement.innerHTML = extraData;
        for (var i = 0; i < dataList.length; i++) {
            selectElement.innerHTML += `<option value="${dataList[i]}"> ${dataList[i]} </option>`;
        }
    }
  
    async function feedDataSelect() {
        let alunos = await getAlunos(g1Label);
        buildSelectValues(grupoSelect, grupos);
        extra = `<option value="todos"> Todos </option>`;
        buildSelectValues(alunoSelect, alunos, extra);
    }
  
    async function feedSprintSelect() {
        let sprints = ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4'];
        buildSelectValues(sprintSelect, sprints);
    }
  
    function feedAluno() {
        var grupoOpt = grupoSelect.options[grupoSelect.selectedIndex].value;
        let alunos = getAlunos(grupoOpt);
        extra = `<option value="todos"> Todos </option>`;
        buildSelectValues(alunoSelect, alunos, extra);
    }
  
    const callApiGrupo = async(url) => {
        let data = {};
        const api = fetch(url);
        await api
            .then((response) => {
                return response.json();
            })
            .then((raw) => {
                for (let i = 0; i < raw.length; i++) {
                    var sprint = raw[i]['Número da sprint'];
                    for (const [key, value] of Object.entries(raw[i])) {
                        var nota = parseInt(value) || 0;
                        if (data[sprint]) {
                            if (data[sprint][key]) {
                                data[sprint][key] += nota;
                            } else {
                                data[sprint][key] = nota;
                            }
                        } else {
                            data[sprint] = {};
                            if (data[sprint][key]) {
                                data[sprint][key] += nota;
                            } else {
                                data[sprint][key] = nota;
                            }
                        }
                    }
                }
            });
        return data;
    };
  
    async function getDataUsingAPI() {
        var g1 = await callApiGrupo("https://sheetsu.com/apis/v1.0bu/f3b4139258eb");
        var g2 = await callApiGrupo("https://sheetsu.com/apis/v1.0bu/55ee344befe8");
        var g3 = await callApiGrupo("https://sheetsu.com/apis/v1.0bu/25de6da64537");
        var g4 = await callApiGrupo("https://sheetsu.com/apis/v1.0bu/a3cb2f9a94bd");
        return [g1, g2, g3, g4];
    }
  
    const loadFile = async file => {
        const response = await fetch(`https://raw.githubusercontent.com/CauaneAndrade/pacer-fatec/main/${file}`)
        const text = await response.json();
        return text;
    }
  
    async function getData() {
        var g1 = await loadFile("g1.json");
        var g2 = await loadFile("g2.json");
        var g3 = await loadFile("g3.json");
        var g4 = await loadFile("g4.json");
        return [g1, g2, g3, g4];
    }
    
    async function getDataSprint(data, sprint) {
        let g1 = data[0][sprint];
        let g2 = data[1][sprint];
        let g3 = data[2][sprint];
        let g4 = data[3][sprint];
        return Object.assign({}, g1, g2, g3, g4);
    }
  
    function getGrupoAluno(alunoNome) {
        // return a list
        var dic = getAlunos();
        for (const [key, value] of Object.entries(dic)) {
            if (value.includes(alunoNome)) {
                return value;
            }
        }
    }
  
    function filterData(data, alunoNome) {
        /*
        data -> {} (itens da avaliação e nota)
        alunoNome -> ''
        */
        let result = [];
        // let grupoAluno = getGrupoAluno(alunoNome);
        for (const [key, value] of Object.entries(data)) {
            if (key.endsWith(`[${alunoNome}]`)) {
                debugger;
                result.push(value);
            }
        }
        return result;
    }
  
    await feedDataSelect();
    await feedSprintSelect();
    let dataAll = await getData();
    var dataValores = await getDataSprint(dataAll, 'Sprint 1');
    var valorInicialAluno = getAlunos(grupos[0])[0];
    let dataToDataset = filterData(dataValores, valorInicialAluno);

    const globalDataset = {
        backgroundColor: [
            "rgba(234, 0, 0, 0.2)",
            "rgba(255, 255, 0, 0.2)",
            "rgba(48, 255, 0, 0.2)",
            "rgba(0, 0, 255, 0.2)"
        ],
        borderColor: [
            "rgba(234, 0, 0, 1)",
            "rgba(255, 255, 0, 1)",
            "rgba(48, 255, 0, 1)",
            "rgba(0, 0, 255, 1)"
        ],
        borderWidth: 1,
        label: "Resultado"
    };
  
    var dataset = {...globalDataset, data: dataToDataset };
  
    const globalLabel = [
        "PROATIVIDADE",
        "AUTONOMIA",
        "COLABORAÇÃO",
        "ENTREGA DE RESULTADOS"
    ];
  
    const dataConfig = {
        labels: globalLabel,
        datasets: [dataset]
    };
  
    const globalConfig = {
        type: "polarArea",
        data: dataConfig,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top"
                },
                title: {
                    display: true
                }
            }
        }
    };
  
    const config = {...globalConfig, data: dataConfig };
    const ctxPolar = document.getElementById("chartPolar");
    const chartPolar = new Chart(ctxPolar, config);
    ctxPolar.style.display = "none";
    addChartAlunosGrupo(g1Label);
  
    const updateData = async() => {
        ctxPolar.style.display = "none";
        var grupoOpt = grupoSelect.options[grupoSelect.selectedIndex].value;
        var alunoOpt = alunoSelect.options[alunoSelect.selectedIndex].value;
        var sprintOpt = sprintSelect.options[sprintSelect.selectedIndex].value;
  
        var mainDiv = document.getElementById("main");
        mainDiv.innerHTML = "";
        if (alunoOpt === "todos") {
            await addChartAlunosGrupo(grupoOpt);
        } else {
            globalConfig["options"]["plugins"]["title"]["text"] = alunoOpt;
            var dataValores = await getDataSprint(dataAll, sprintOpt);
            let dataToDataset = filterData(dataValores, alunoOpt);
            dataset["data"] = dataToDataset;
            chartPolar.update();
            ctxPolar.style.display = "block";
        }
    };
  
    async function addChartAlunosGrupo(grupo) {
        var sprintOpt = sprintSelect.options[sprintSelect.selectedIndex].value;
        const alunosGrupo = getAlunos(grupo);
        ids = addChartsDinamically(alunosGrupo);
        var dataValores = await getDataSprint(dataAll, sprintOpt);
        ids.forEach((idElement, index) => {
            let dataToDataset = filterData(dataValores, alunosGrupo[index]);
            var localData = {
                labels: globalLabel,
                datasets: [{...globalDataset, data: dataToDataset }]
            };
            globalConfig["options"]["plugins"]["title"]["text"] = "";
            let locaConfig = {...globalConfig, data: localData };
            const ctx = document.getElementById(idElement);
            new Chart(ctx, locaConfig);
        });
    }
  
    const updateDataGrupo = async() => {
        ctxPolar.style.display = "none";
        var grupoOpt = grupoSelect.options[grupoSelect.selectedIndex].value;
        await addChartAlunosGrupo(grupoOpt);
    };
  
    const updateGraphSprint = async() => {
        ctxPolar.style.display = "none";
        var grupoOpt = grupoSelect.options[grupoSelect.selectedIndex].value;
        await addChartAlunosGrupo(grupoOpt);
    };
  
    alunoSelect.addEventListener("change", updateData);
    grupoSelect.addEventListener("change", updateDataGrupo);
    grupoSelect.addEventListener("change", feedAluno);
    sprintSelect.addEventListener("change", updateGraphSprint);
  };