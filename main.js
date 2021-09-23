window.onload = async function () {
  const alunoSelect = document.getElementById("aluno");
  const grupoSelect = document.getElementById("grupo");

  function getGrupo() {
    let data = ["Grupo 1", "Grupo 2"];
    return data;
  }

  function getAlunos(grupo = "Grupo 1") {
    var dic = {
      "Grupo 1": ["Aluno 1", "Aluno 2", "Aluno 3", "Aluno 4"],
      "Grupo 2": ["Aluno 1.2", "Aluno 2.2", "Aluno 3.2", "Aluno 4.2"],
    };
    return dic[grupo];
  }

  let grupos = getGrupo();
  let alunos = getAlunos();

  function buildSelectValues(selectElement, dataList) {
    selectElement.innerHTML = "";
    for (var i = 0; i < dataList.length; i++) {
      selectElement.innerHTML =
        selectElement.innerHTML +
        `<option value="${dataList[i]}"> ${dataList[i]} </option>`;
    }
  }

  async function feedDataSelect() {
    buildSelectValues(grupoSelect, grupos);
    buildSelectValues(alunoSelect, alunos);
  }

  function feedAluno() {
    var grupoOpt = grupoSelect.options[grupoSelect.selectedIndex].value;
    let alunos = getAlunos(grupoOpt);
    buildSelectValues(alunoSelect, alunos);
  }

  async function getData(alunoOpt) {
    // const api = fetch("https://sheetsu.com/apis/v1.0bu/07ss686c9d8a31");
    const api = fetch("https://sheetsu.com/apis/v1.0bu/07686c9d8a31");
    let data = {};
    let result = [];
    await api
      .then((response) => {
        return response.json();
      })
      .then((raw) => {
        for (let i = 0; i < raw.length; i++) {
          for (const [key, value] of Object.entries(raw[i])) {
            if (key.endsWith(`[${alunoOpt}]`)) {
              if (data[key]) {
                data[key] += parseInt(value);
              } else {
                data[key] = parseInt(value);
              }
            }
          }
        }
        for (const [key, value] of Object.entries(data)) {
          result.push(value / getAlunos(grupos[0]).length);
        }
      });
    // result = [4, 5, 4, 4];
    return result;
  }

  await feedDataSelect();

  var valorInicialAluno = getAlunos(grupos[0])[0];
  let lista = await getData(valorInicialAluno);
  var dataset = {
    backgroundColor: ["rgba(48, 48, 181, 0.2)"],
    borderColor: ["rgba(48, 48, 181, 0.7)"],
    pointBackgroundColor: [
      "rgba(234, 0, 0, 1)",
      "rgba(255, 255, 0, 1)",
      "rgba(48, 255, 0, 1)",
      "rgba(0, 0, 255, 1)",
    ],
    borderWidth: 1,
    data: lista,
    label: "Resultado",
  };

  var dataset1 = {
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
    data: lista,
    label: "Resultado",
  };

  const config = {
    type: "radar",
    data: {
      labels: [
        "PROATIVIDADE",
        "AUTONOMIA",
        "COLABORAÇÃO",
        "ENTREGA DE RESULTADOS",
      ],
      datasets: [dataset],
    },
    options: {
      plugins: {
        legend: false,
        tooltip: true,
        title: {
          display: true,
          text: "Radar Chart",
        },
      },
    },
  };

  const config2 = {
    type: "polarArea",
    data: {
      labels: [
        "PROATIVIDADE",
        "AUTONOMIA",
        "COLABORAÇÃO",
        "ENTREGA DE RESULTADOS",
      ],
      datasets: [dataset1],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Polar Area Chart",
        },
      },
    },
  };

  const config3 = {
    type: "pie",
    data: {
      labels: [
        "PROATIVIDADE",
        "AUTONOMIA",
        "COLABORAÇÃO",
        "ENTREGA DE RESULTADOS",
      ],
      datasets: [dataset1],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Pie Chart",
        },
      },
    },
  };

  const ctx = document.getElementById("chart");
  const myChart = new Chart(ctx, config);

  const ctxPolar = document.getElementById("chartPolar");
  const myChartPolar = new Chart(ctxPolar, config2);

  const ctxPie = document.getElementById("chartPie");
  const myChartPie = new Chart(ctxPie, config3);

  const updateData = async () => {
    ctx.style.display = "none";
    ctxPolar.style.display = "none";
    ctxPie.style.display = "none";
    var alunoOpt = alunoSelect.options[alunoSelect.selectedIndex].value;
    dataset["data"] = await getData(alunoOpt);
    myChart.update();
    myChartPolar.update();
    myChartPie.update();
    ctx.style.display = "block";
    ctxPolar.style.display = "block";
    ctxPie.style.display = "block";
  };

  const updateDataGrupo = async () => {
    ctx.style.display = "none";
    ctxPolar.style.display = "none";
    ctxPie.style.display = "none";
    var grupoOpt = grupoSelect.options[grupoSelect.selectedIndex].value;
    let aluno = getAlunos(grupoOpt)[0];
    dataset["data"] = await getData(aluno);
    myChart.update();
    myChartPolar.update();
    myChartPie.update();
    ctx.style.display = "block";
    ctxPolar.style.display = "block";
    ctxPie.style.display = "block";
  };

  alunoSelect.addEventListener("change", updateData);
  grupoSelect.addEventListener("change", updateDataGrupo);
  grupoSelect.addEventListener("change", feedAluno);
};
