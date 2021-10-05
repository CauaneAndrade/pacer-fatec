window.onload = async function () {
  g1Label = "Grupo 1";
  const g1 = [
    "Gabriel Borges (SM)",
    "Isabelle Oliveira (PO)",
    "Gabriel Mendes",
    "Gustavo Lopes",
    "Samuel Costa",
    "Victoria Ribeiro",
  ];

  g2Label = "Grupo 2";
  const g2 = [
    "Vitor L. Amorim (SM)",
    "Eduardo F. R. Querido (PO)",
    "Douglas H. T. Barboza",
    "Fabrício C. Vasconcellos",
    "Jonatas R. Ferreira",
    "Rafael R. Rodrigues",
    "Samuel D. Xavier",
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
    "Sandro Toline de Oliveira Junior",
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
    "Joao",
  ];

  var grupoAlunoData = {
    "Grupo 1": g1,
    "Grupo 2": g2,
    "Grupo 3": g3,
    "Grupo 4": g4,
  };

  const grupos = [g1Label, g2Label, g3Label, g4Label];
  const alunoSelect = document.getElementById("aluno");
  const grupoSelect = document.getElementById("grupo");

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

  function feedAluno() {
    var grupoOpt = grupoSelect.options[grupoSelect.selectedIndex].value;
    let alunos = getAlunos(grupoOpt);
    extra = `<option value="todos"> Todos </option>`;
    buildSelectValues(alunoSelect, alunos, extra);
  }

  const callApiGrupo = async (url) => {
    let data = {};
    const api = fetch(url);
    await api
      .then((response) => {
        return response.json();
      })
      .then((raw) => {
        for (let i = 0; i < raw.length; i++) {
          for (const [key, value] of Object.entries(raw[i])) {
            var nota = parseInt(value) || 0;
            if (data[key]) {
              data[key] += nota;
            } else {
              data[key] = nota;
            }
          }
        }
      });
      return data;
  };

  async function getData() {
    var g1 = await callApiGrupo("https://sheetsu.com/apis/v1.0bu/f3b4139258eb");
    var g2 = await callApiGrupo("https://sheetsu.com/apis/v1.0bu/55ee344befe8");
    var g3 = await callApiGrupo("https://sheetsu.com/apis/v1.0bu/25de6da64537");
    var g4 = await callApiGrupo("https://sheetsu.com/apis/v1.0bu/a3cb2f9a94bd");
    var data = Object.assign({}, g1, g2, g3, g4);
    return data;
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
    let grupoAluno = getGrupoAluno(alunoNome);
    for (const [key, value] of Object.entries(data)) {
      if (key.endsWith(`[${alunoNome}]`)) {
        result.push(value / grupoAluno.length);
      }
    }
    return result;
  }

  await feedDataSelect();
  let dataValores = await getData();
  var valorInicialAluno = getAlunos(grupos[0])[0];
  let dataToDataset = filterData(dataValores, valorInicialAluno);

  const globalDataset = {
    backgroundColor: [
      "rgba(234, 0, 0, 0.2)",
      "rgba(255, 255, 0, 0.2)",
      "rgba(48, 255, 0, 0.2)",
      "rgba(0, 0, 255, 0.2)",
    ],
    borderColor: [
      "rgba(234, 0, 0, 1)",
      "rgba(255, 255, 0, 1)",
      "rgba(48, 255, 0, 1)",
      "rgba(0, 0, 255, 1)",
    ],
    borderWidth: 1,
    label: "Resultado",
  };

  var dataset = { ...globalDataset, data: dataToDataset };

  const globalLabel = [
    "PROATIVIDADE",
    "AUTONOMIA",
    "COLABORAÇÃO",
    "ENTREGA DE RESULTADOS",
  ];

  const dataConfig = {
    labels: globalLabel,
    datasets: [dataset],
  };

  const globalConfig = {
    type: "polarArea",
    data: dataConfig,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
        },
      },
    },
  };

  const config = { ...globalConfig, data: dataConfig };
  const ctxPolar = document.getElementById("chartPolar");
  const chartPolar = new Chart(ctxPolar, config);
  ctxPolar.style.display = "none";
  addChartAlunosGrupo(g1Label);

  const updateData = async () => {
    ctxPolar.style.display = "none";
    var grupoOpt = grupoSelect.options[grupoSelect.selectedIndex].value;
    var alunoOpt = alunoSelect.options[alunoSelect.selectedIndex].value;

    var mainDiv = document.getElementById("main");
    mainDiv.innerHTML = "";
    if (alunoOpt === "todos") {
      addChartAlunosGrupo(grupoOpt);
    } else {
      globalConfig["options"]["plugins"]["title"]["text"] = alunoOpt;
      let dataToDataset = filterData(dataValores, alunoOpt);
      dataset["data"] = dataToDataset;
      chartPolar.update();
      ctxPolar.style.display = "block";
    }
  };

  function addChartAlunosGrupo(grupo) {
    const alunosGrupo = getAlunos(grupo);
    ids = addChartsDinamically(alunosGrupo);
    ids.forEach((idElement, index) => {
      let dataToDataset = filterData(dataValores, alunosGrupo[index]);
      var localData = {
        labels: globalLabel,
        datasets: [{ ...globalDataset, data: dataToDataset }],
      };
      globalConfig["options"]["plugins"]["title"]["text"] = "";
      let locaConfig = { ...globalConfig, data: localData };
      const ctx = document.getElementById(idElement);
      new Chart(ctx, locaConfig);
    });
  }

  const updateDataGrupo = async () => {
    ctxPolar.style.display = "none";
    var grupoOpt = grupoSelect.options[grupoSelect.selectedIndex].value;
    addChartAlunosGrupo(grupoOpt);
  };

  alunoSelect.addEventListener("change", updateData);
  grupoSelect.addEventListener("change", updateDataGrupo);
  grupoSelect.addEventListener("change", feedAluno);
};
