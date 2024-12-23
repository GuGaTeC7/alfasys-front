// Função para realizar o cadastro
function realizarCadastro() {
  // Coleta os valores dos campos
  const endId = document.getElementById("endId").value;
  const siteId = document.getElementById("siteId").value;
  const demanda = document.getElementById("demanda").value;
  const observacoes = document.getElementById("observacoes").value;
  const localizacao = document.getElementById("localizacao").value;

  const idDetentora = document.getElementById("idDetentora").value;
  const detentora = document.getElementById("detentora").value;

  const idOperadora = document.getElementById("idOperadora").value;
  const operadora = document.getElementById("operadoraCedente").value;

  const logradouro = document.getElementById("logradouro").value;
  const numero = document.getElementById("numero").value;
  const bairro = document.getElementById("bairro").value;
  const municipio = document.getElementById("municipio").value;
  const estado = document.getElementById("estado").value;
  const cep = document.getElementById("cep").value;

  const latitude = document.getElementById("latitude").value;
  const longitude = document.getElementById("longitude").value;

  // Validação dos campos obrigatórios
  if (
    !endId ||
    !siteId ||
    !demanda ||
    !idDetentora ||
    !detentora ||
    !idOperadora ||
    !operadora ||
    !logradouro ||
    !numero ||
    !bairro ||
    !municipio ||
    !estado ||
    !cep ||
    !latitude ||
    !longitude ||
    !localizacao
  ) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  // Referência ao botão
  const botaoSalvar = document.querySelector(
    'button[onclick="realizarCadastro()"]'
  );
  botaoSalvar.disabled = true; // Desabilita o botão
  botaoSalvar.textContent = "Cadastrando..."; // Altera o texto do botão

  // Estrutura do payload
  const payload = {
    endId: endId,
    siteId: siteId,
    demanda: demanda,
    observacoes: observacoes || null,
    localizacao: localizacao || null,
    detentora: {
      idDetentora: idDetentora,
      detentora: detentora,
    },
    cedente: {
      idOperadora: idOperadora,
      operadora: operadora,
    },
    endereco: {
      logradouro: logradouro,
      numero: numero,
      bairro: bairro,
      municipio: municipio,
      estado: estado,
      cep: cep,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    },
  };

  // Envia a requisição para o servidor
  fetch(`${host}/cadastroEndIds`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Cadastro realizado com sucesso:", data);
      alert("Cadastro realizado com sucesso!");
      resetarCampos("cadastro-fazer"); // Reseta os campos após o sucesso
    })
    .catch((error) => {
      console.error("Erro ao realizar cadastro:", error);
      alert("Erro ao atualizar os dados. Tente novamente.");
    })
    .finally(() => {
      botaoSalvar.disabled = false; // Reabilita o botão
      botaoSalvar.textContent = "Salvar"; // Restaura o texto original do botão
    });
}

// Função para resetar todos os campos
// Função genérica para resetar os campos de um formulário
function resetarCampos(formularioId) {
  const formulario = document.getElementById(formularioId);

  if (!formulario) {
    console.error(`Formulário com o ID "${formularioId}" não encontrado.`);
    return;
  }

  // Limpa todos os inputs, selects e textareas do formulário
  formulario.querySelectorAll("input, select, textarea").forEach((campo) => {
    if (campo.type === "checkbox" || campo.type === "radio") {
      campo.checked = false; // Desmarca checkboxes e radios
    } else {
      campo.value = ""; // Reseta o valor dos campos
    }
  });

  console.log(
    `Todos os campos do formulário "${formularioId}" foram resetados.`
  );
}

let currentPage = 0; // Página inicial
const pageSize = 5; // Elementos por página

function preencherTabela(page = 0) {
  const loadingOverlay = document.getElementById("loading-overlay");
  const tbody = document.querySelector("#tabelaHistorico tbody");

  loadingOverlay.style.display = "block";

  fetch(`${host}/cadastroEndIds?page=${page}&size=${pageSize}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao buscar dados.");
      return response.json();
    })
    .then((dados) => {
      tbody.innerHTML = "";

      const formataData = (data) => {
        if (!Array.isArray(data) || data.length !== 3) return "Data inválida";
        const [ano, mes, dia] = data;
        return `${String(dia).padStart(2, "0")}/${String(mes).padStart(
          2,
          "0"
        )}/${ano}`;
      };

      dados.content.forEach((item, i) => {
        const dataCadastro = item.dataCadastro
          ? formataData(item.dataCadastro)
          : "Não informado";
        const finalizarId = `finalizar-${i}`;

        const row = `
          <tr>
            <td>${item.endId}</td>
            <td>${item.demanda}</td>
            <td>${item.siteId}</td>
            <td>${item.municipio}</td>
            <td style="text-align: center; vertical-align: middle;">
              <a href="${item.linkLocalizacao || "#"}" target="_blank">
                ${
                  item.linkLocalizacao
                    ? '<img width="30" height="auto" src="img/mapa-icon.png" alt="address--v1"/>'
                    : "Não informada"
                }
              </a>
            </td>
            <td>${item.observacoes || ""}</td>
            <td>${dataCadastro}</td>
            <td>
              <button class="btn btn-primary finalizar-btn" data-id="${
                item.endId
              }" id="${finalizarId}">
                Finalizar
              </button>
            </td>
          </tr>`;

        tbody.insertAdjacentHTML("beforeend", row);
      });

      renderizarBotoesPaginacao(dados.pageable.pageNumber, dados.totalPages);
    })
    .catch((error) => {
      console.error("Erro ao buscar dados:", error);
      alert("Erro ao carregar os dados. Atualize a tela apertando 'F5'.");
    })
    .finally(() => {
      loadingOverlay.style.display = "none";
    });
}

function renderizarBotoesPaginacao(currentPage, totalPages) {
  const paginationControls = document.getElementById("pagination-controls");
  paginationControls.innerHTML = ""; // Limpa botões antigos

  for (let i = 0; i < totalPages; i++) {
    const button = document.createElement("button");
    button.className = `btn btn-sm ${
      i === currentPage ? "btn-primary" : "btn-light"
    } mx-1`;
    button.textContent = i + 1;
    button.addEventListener("click", () => preencherTabela(i));
    paginationControls.appendChild(button);
  }
}

// Selecione o link "Histórico de cadastros" e "Editar Cadastro"
const historicoLink = document.querySelector("a[href='#cadastro-feito']");
// Adicione o evento de clique ao link de "Histórico de cadastros"
historicoLink.addEventListener("click", function (event) {
  preencherTabela(); // Função chamada ao clicar no link
});

// Adiciona o evento ao botão resetar
document
  .getElementById("botaoResetar")
  .addEventListener("click", resetarCampos("cadastro-fazer"));
