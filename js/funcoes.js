// Funções reutilizáveis
function dismissAlert() {
  const alertDiv = document.querySelector(".custom-alert");
  if (alertDiv) {
    alertDiv.remove();
  }
}

function confirmAlert(action, endId, etapa) {
  if (action === "finalizar") {
    if (etapa === "agendamento") {
      finalizaAgendamento(endId);
    }
  } else if (action === "iniciar") {
    if (etapa === "agendamento") {
      iniciaAgendamento(endId);
    }
  }
  dismissAlert();
}

function createAlert(content, onConfirm) {
  const alertDiv = document.createElement("div");
  alertDiv.className = "custom-alert";
  alertDiv.style.position = "fixed";
  alertDiv.style.top = "50%";
  alertDiv.style.left = "50%";
  alertDiv.style.transform = "translate(-50%, -50%)";
  alertDiv.style.width = "300px";
  alertDiv.style.padding = "15px";
  alertDiv.style.backgroundColor = "rgba(1, 41, 112, 0.9)";
  alertDiv.style.color = "#ffffff";
  alertDiv.style.borderRadius = "5px";
  alertDiv.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)";
  alertDiv.style.zIndex = "1000";
  alertDiv.style.textAlign = "center";
  alertDiv.innerHTML = content;

  // Botões
  const cancelButton = alertDiv.querySelector("#cancel-button");
  cancelButton.addEventListener("click", dismissAlert);

  const confirmButton = alertDiv.querySelector("#confirm-button");
  confirmButton.addEventListener("click", onConfirm);

  document.body.appendChild(alertDiv);
}

// Botão para ver o End ID
document.querySelectorAll(".end-id").forEach((button) => {
  button.addEventListener("click", (event) => {
    console.log("cliclou");
    const endId = event.target.getAttribute("data-id");

    const alertDiv = document.createElement("div");
    alertDiv.className = "alert-container";

    alertDiv.style.position = "fixed";
    alertDiv.style.top = "50%";
    alertDiv.style.left = "50%";
    alertDiv.style.transform = "translate(-50%, -50%)";
    alertDiv.style.width = "86%"; /* 7% em cada lado */
    alertDiv.style.maxWidth = "900px";
    alertDiv.style.padding = "30px";
    alertDiv.style.backgroundColor = "#012970";
    alertDiv.style.color = "#ffffff";
    alertDiv.style.border = "2px solid #012970";
    alertDiv.style.borderRadius = "15px";
    alertDiv.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)";
    alertDiv.style.zIndex = "1000";
    alertDiv.style.overflow = "hidden";

    alertDiv.innerHTML = `
              <strong style="display: block; text-align: center; margin-bottom: 20px; font-size: 1.5em;">Detalhes do Projeto: ${endId}</strong>
              <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                  <ul style="flex: 1; padding-left: 20px; font-size: 1em; list-style: none;">
                      <li><strong>Site ID:</strong> Projeto Exemplo</li>
                      <li><strong>Demanda:</strong> Empresa A</li>
                      <li><strong>Detentora:</strong> 01/01/2024</li>
                      <li><strong>ID Detentora:</strong> 31/12/2024</li>
                      <li><strong>Operadora cedente:</strong> Em Andamento</li>
                      <li><strong>ID Operadora:</strong> Este é um projeto de exemplo para fins demonstrativos.</li>
                      <li><strong>Logradouro:</strong> Rua Vinte</li>
                      <li><strong>Número:</strong> 20</li>
                  </ul>
                  <ul style="flex: 1; padding-right: 20px; font-size: 1em; list-style: none;">
                      <li><strong>Bairro:</strong> Bairro Vinte</li>
                      <li><strong>Município:</strong> Vinte</li>
                      <li><strong>Estado:</strong> SP</li>
                      <li><strong>CEP:</strong> 0800081</li>
                      <li><strong>Latitude:</strong> -1240</li>
                      <li><strong>Longitude:</strong> 8158</li>
                      <li><strong>Observações:</strong> sem observações adicionais</li>
                      <li><strong>Status do agendamento:</strong> Em Andamento</li>
                  </ul>
  
              </div>
          `;

    const closeButton = document.createElement("button");
    closeButton.innerText = "Fechar";
    closeButton.style.marginTop = "20px";
    closeButton.style.padding = "12px 20px";
    closeButton.style.backgroundColor = "#ffffff";
    closeButton.style.border = "2px solid #ffffff";
    closeButton.style.color = "#012970";
    closeButton.style.cursor = "pointer";
    closeButton.style.borderRadius = "10px";
    closeButton.style.display = "block";
    closeButton.style.marginLeft = "auto";
    closeButton.style.marginRight = "auto";

    closeButton.addEventListener("click", () => {
      alertDiv.remove();
    });

    alertDiv.appendChild(closeButton);
    document.body.appendChild(alertDiv);

    window.scrollTo(
      0,
      alertDiv.getBoundingClientRect().top + window.scrollY - 100
    );
  });
});

// Botão de ver mais informações do projeto
document.querySelectorAll(".btn-outline-primary").forEach((button) => {
  button.addEventListener("click", (event) => {
    const endId = event.target
      .closest("tr")
      .querySelector(".end-id")
      .getAttribute("data-id");

    const alertDiv = document.createElement("div");
    alertDiv.className = "alert-container";

    alertDiv.style.position = "fixed";
    alertDiv.style.top = "50%";
    alertDiv.style.left = "50%";
    alertDiv.style.transform = "translate(-50%, -50%)";
    alertDiv.style.width = "86%"; /* 7% em cada lado */
    alertDiv.style.maxWidth = "900px";
    alertDiv.style.padding = "30px";
    alertDiv.style.backgroundColor = "#012970";
    alertDiv.style.color = "#ffffff";
    alertDiv.style.border = "2px solid #012970";
    alertDiv.style.borderRadius = "15px";
    alertDiv.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)";
    alertDiv.style.zIndex = "1000";
    alertDiv.style.overflow = "hidden";

    alertDiv.innerHTML = `
              <strong style="display: block; text-align: center; margin-bottom: 20px; font-size: 1.5em;">Informações de ligação do projeto: ${endId}</strong>
              <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              <ul style="flex: 1; padding-left: 20px; font-size: 1em; list-style: none;">
                  <li><strong>ENDEREÇO ID:</strong> </li>
                  <li><strong>SITE ID:</strong> </li>
                  <li><strong>Leitura Inicial:</strong> </li>
                  <li><strong>Concessionária:</strong> </li>
                  <li><strong>Regional:</strong> </li>
                  <li><strong>CEP:</strong> </li>
                  <li><strong>UF:</strong> </li>
                  <li><strong>Cidade:</strong> </li>
                  <li><strong>Endereço:</strong> </li>
                  <li><strong>Número:</strong> </li>
                  <li><strong>Bairro:</strong> </li>
                  <li><strong>Complemento:</strong> </li>
              </ul>
              <ul style="flex: 1; padding-right: 20px; font-size: 1em; list-style: none;">
                  <li><strong>CNPJ:</strong></li>
                  <li><strong>CMPJ DA UC SOLICITADA:</strong> </li> 
                  <li><strong>Previsão de Ligação:</strong> </li>
                  <li><strong>Número Medidor:</strong> </li>
                  <li><strong>Tipo de Tensão:</strong> </li>
                  <li><strong>Unidade:</strong> </li>
                  <li><strong>Número de Instalação:</strong> </li>
                  <li><strong>Número de Fases:</strong> </li>
              </li>
          </ul>
      </div>
          `;

    const closeButton = document.createElement("button");
    closeButton.innerText = "Fechar";
    closeButton.style.marginTop = "20px";
    closeButton.style.padding = "12px 20px";
    closeButton.style.backgroundColor = "#ffffff";
    closeButton.style.border = "2px solid #ffffff";
    closeButton.style.color = "#012970";
    closeButton.style.cursor = "pointer";
    closeButton.style.borderRadius = "10px";
    closeButton.style.display = "block";
    closeButton.style.marginLeft = "auto";
    closeButton.style.marginRight = "auto";

    closeButton.addEventListener("click", () => {
      alertDiv.remove();
    });

    alertDiv.appendChild(closeButton);
    document.body.appendChild(alertDiv);

    window.scrollTo(
      0,
      alertDiv.getBoundingClientRect().top + window.scrollY - 100
    );
  });
});

// Botão para fazer logout
document.getElementById("logout").addEventListener("click", function () {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

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

// Função para formatar datas
function formatarDataParaInput(data) {
  if (!data) return ""; // Caso a data seja nula ou indefinida
  if (Array.isArray(data) && data.length === 3) {
    // Data no formato array [ano, mes, dia]
    const [ano, mes, dia] = data;
    return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(
      2,
      "0"
    )}`;
  }
  return ""; // Retorna vazio para outros formatos inválidos
}

function formataData(data) {
  if (!Array.isArray(data) || data.length !== 3) return "Data inválida";
  const [ano, mes, dia] = data;
  return `${String(dia).padStart(2, "0")}/${String(mes).padStart(
    2,
    "0"
  )}/${ano}`;
}

let currentPage = 0; // Página inicial
const pageSize = 5; // Elementos por página

function renderizarBotoesPaginacao(
  idPaginationControls,
  tabelaFunction,
  currentPage,
  totalPages
) {
  const paginationControls = document.getElementById(`${idPaginationControls}`);
  paginationControls.innerHTML = ""; // Limpa botões antigos

  for (let i = 0; i < totalPages; i++) {
    const button = document.createElement("button");
    button.className = `btn btn-sm ${
      i === currentPage ? "btn-primary" : "btn-light"
    } mx-1`;
    button.textContent = i + 1;

    // Passa a página como argumento para a função
    button.addEventListener("click", () => tabelaFunction(i));
    paginationControls.appendChild(button);
  }
}

function filtrarTabela(page = 0, secao, idTabela) {
  const loadingOverlay = document.getElementById("loading-overlay");
  const tbody = document.querySelector(`#${idTabela} tbody`);
  const secaoId = document.getElementById(secao);

  // Obtém os valores dos campos de pesquisa
  const endId = secaoId.querySelector("#pesquisaEndId").value.trim();
  const siteId = secaoId.querySelector("#pesquisaSiteId").value.trim();
  const municipio = secaoId.querySelector("#pesquisaMunicipio").value.trim();

  // Monta os parâmetros da URL
  const params = new URLSearchParams();
  if (endId) params.append("endId", endId.toUpperCase());
  if (siteId) params.append("siteId", siteId.toUpperCase());
  if (municipio) params.append("municipio", municipio.toUpperCase());
  params.append("page", page);
  params.append("size", pageSize);

  // Define a URL com base no ID da tabela
  const endpoint =
    idTabela === "tabelaHistoricoAgendamento"
      ? `${host}/cadastroEndIds/buscar-agendamento`
      : `${host}/cadastroEndIds/buscar-endid`;

  loadingOverlay.style.display = "block";

  fetch(`${endpoint}?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao buscar dados.");
      return response.json();
    })
    .then((dados) => {
      tbody.innerHTML = ""; // Limpa a tabela antes de preencher

      if (!dados.content || dados.content.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center">Nenhum dado encontrado.</td></tr>`;
        renderizarBotoesPaginacao("pagination-controls", 0, 0);
        return;
      }

      dados.content.forEach((item, i) => {
        const dataSolicitacao = item.dataSolicitacao
          ? formatarDataParaInput(item.dataSolicitacao)
          : "";
        const dataPrevisao = item.dataPrevisao
          ? formatarDataParaInput(item.dataPrevisao)
          : "";
        const dataLiberacao = item.dataLiberacao
          ? formatarDataParaInput(item.dataLiberacao)
          : "";
        const dataCadastro = item.dataCadastro
          ? formataData(item.dataCadastro)
          : "Não informado";
        const finalizarId = `finalizar-${i}`;

        const row =
          idTabela === "tabelaHistoricoAgendamento"
            ? `
          <tr>
            <td>
              <button class="btn btn-link p-0 text-decoration-none end-id" id="textoParaCopiar" data-id="${
                item.endId
              }">
                ${item.endId}
              </button>
              <i class="fa-regular fa-copy btnCopiar" title="Copiar" data-id="${
                item.endId
              }"></i>
            </td>
            <td>
              <select disabled class="form-select border-0 bg-light p-2">
                <option value="status">${item.statusAgendamento}</option>
              </select>
              <button class="btn iniciar-btn p-0 border-0 bg-transparent ml-2" 
                style="display:${
                  ["Em andamento", "Concluído"].includes(item.statusAgendamento)
                    ? "none"
                    : ""
                };" 
                data-id-botao="${item.endId}">
                <i class="fa-solid fa-circle-play"></i>
              </button>
            </td>
            <td>
              ${
                dataSolicitacao
                  ? `<input 
                      type="date" 
                      class="form-control text-center" 
                      value="${dataSolicitacao}" 
                      disabled
                    />`
                  : renderInputDate(
                      "data-solicitacao",
                      item.endId,
                      item.statusAgendamento
                    )
              }
            </td>
            <td>
              ${
                dataPrevisao
                  ? `<input 
                      type="date" 
                      class="form-control text-center" 
                      value="${dataPrevisao}" 
                      disabled
                    />`
                  : renderInputDate(
                      "data-previsao",
                      item.endId,
                      item.statusAgendamento
                    )
              }
            </td>
            <td>
              ${
                dataLiberacao
                  ? `<input 
                      type="date" 
                      class="form-control text-center" 
                      value="${dataLiberacao}" 
                      disabled
                    />`
                  : renderInputDate(
                      "data-liberacao",
                      item.endId,
                      item.statusAgendamento
                    )
              }
            </td>
            <td>
              <button class="btn btn-primary finalizar-btn" data-id-botao="${
                item.endId
              }">
                Finalizar
              </button>
            </td>
          </tr>`
            : `
          <tr>
            <td>${item.endId}</td>
            <td>${item.demanda}</td>
            <td>${item.siteId}</td>
            <td>${item.municipio}</td>
            <td style="text-align: center; vertical-align: middle;">
              <a href="${item.linkLocalizacao || ""}" target="_blank">${
                item.linkLocalizacao
                  ? '<img width="30" height="auto" src="img/mapa-icon.png" alt="address--v1"/>'
                  : "Não disponível"
              }</a>
            </td>
            <td>${item.observacoes || ""}</td>
            <td>${dataCadastro}</td>
            <td>
              <button class="btn btn-primary finalizar-btn" data-id="${
                item.endId
              }" id="${finalizarId}">Finalizar</button>
            </td>
          </tr>`;

        document.querySelectorAll(".btnCopiar").forEach((button) => {
          button.addEventListener("click", function () {
            const endId = this.getAttribute("data-id");
            const textoParaCopiarPuro = document.querySelector(
              `button[data-id="${endId}"]`
            ).textContent;
            const textoParaCopiar = textoParaCopiarPuro.trim();

            navigator.clipboard
              .writeText(textoParaCopiar)
              .then(function () {})
              .catch(function (err) {
                console.error("Erro ao tentar copiar o texto: ", err);
              });
          });
        });

        tbody.insertAdjacentHTML("beforeend", row);
      });

      const pagination =
        idTabela === "tabelaHistoricoAgendamento"
          ? "pagination-controls-agendamento"
          : "pagination-controls";
      const funcaoPreencher =
        idTabela === "tabelaHistoricoAgendamento"
          ? preencherTabelaAcesso
          : preencherTabela;

      renderizarBotoesPaginacao(
        pagination,
        funcaoPreencher,
        dados.pageable.pageNumber,
        dados.totalPages
      );
    })
    .catch((error) => {
      console.error("Erro ao buscar dados:", error);
      alert("Erro ao carregar os dados. Atualize a tela apertando 'F5'.");
    })
    .finally(() => {
      loadingOverlay.style.display = "none";
    });
}

function buscaEnId(secao) {
  const botaoBuscar = event.target;
  botaoBuscar.disabled = true;
  botaoBuscar.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Buscando...';

  const secaoId = document.querySelector(`#${secao}`);

  console.log(secaoId);
  const endId = secaoId.querySelector(".editarEndId").value;

  if (!endId) {
    alert("Por favor, informe o END ID.");
    botaoBuscar.disabled = false;
    botaoBuscar.innerHTML =
      '<i class="fa-solid fa-magnifying-glass"></i>⠀Buscar';
    return;
  }

  fetch(`${host}/cadastroEndIds/${endId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar dados. Verifique o END ID informado.");
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("editarSiteId").value = data.siteId || "";
      document.getElementById("editarDemanda").value = data.demanda || "";
      document.getElementById("editarDetentora").value =
        data.detentora.detentora || "";
      document.getElementById("editarIdDetentora").value =
        data.detentora.idDetentora || "";
      document.getElementById("editarOperadora").value =
        data.cedente.operadora || "";
      document.getElementById("editarIdOperadora").value =
        data.cedente.idOperadora || "";
      document.getElementById("editarLogradouro").value =
        data.endereco.logradouro || "";
      document.getElementById("editarNumero").value =
        data.endereco.numero || "";
      document.getElementById("editarBairro").value =
        data.endereco.bairro || "";
      document.getElementById("editarMunicipio").value =
        data.endereco.municipio || "";
      document.getElementById("editarEstado").value =
        data.endereco.estado || "";
      document.getElementById("editarCep").value = data.endereco.cep || "";
      document.getElementById("editarLatitude").value =
        data.endereco.latitude || "";
      document.getElementById("editarLongitude").value =
        data.endereco.longitude || "";
      document.getElementById("editarObservacoes").value =
        data.observacoes || "";
      document.getElementById("editarLocalizacao").value =
        data.linkLocalizacao || "";

      botaoBuscar.disabled = false;
      botaoBuscar.innerHTML =
        '<i class="fa-solid fa-magnifying-glass"></i>⠀Buscar';
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert(
        "Não foi possível buscar os dados. Verifique o console para mais detalhes."
      );
      botaoBuscar.disabled = false;
      botaoBuscar.innerHTML =
        '<i class="fa-solid fa-magnifying-glass"></i>⠀Buscar';
    });
}


function buscaAcesso(secao) {
  const botaoBuscar = event.target;
  botaoBuscar.disabled = true;
  botaoBuscar.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Buscando...';

  const secaoId = document.querySelector(`#${secao}`);

  console.log(secaoId);
  const endId = secaoId.querySelector(".editarEndIdAcesso").value;

  if (!endId) {
    alert("Por favor, informe o END ID.");
    botaoBuscar.disabled = false;
    botaoBuscar.innerHTML =
      '<i class="fa-solid fa-magnifying-glass"></i>⠀Buscar';
    return;
  }

  fetch(`${host}/cadastroEndIds/${endId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar dados. Verifique o END ID informado.");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data)
      document.getElementById("editarSiteIdAcesso").value = 
        data.siteId || "";
      document.getElementById("editarDemandaAcesso").value =
        data.demanda || "";
      document.getElementById("editarDetentoraAcesso").value =
        data.detentora.detentora || "";
      document.getElementById("editarIdDetentoraAcesso").value =
        data.detentora.idDetentora || "";
      document.getElementById("editarOperadoraAcesso").value =
        data.cedente.operadora || "";
      document.getElementById("editarIdOperadoraAcesso").value =
        data.cedente.idOperadora || "";
      document.getElementById("editarLogradouroAcesso").value =
        data.endereco.logradouro || "";
      document.getElementById("editarNumeroAcesso").value =
        data.endereco.numero || "";
      document.getElementById("editarBairroAcesso").value =
        data.endereco.bairro || "";
      document.getElementById("editarMunicipioAcesso").value =
        data.endereco.municipio || "";
      document.getElementById("editarEstadoAcesso").value =
        data.endereco.estado || "";
      document.getElementById("editarCepAcesso").value = data.endereco.cep || "";
      document.getElementById("editarLatitudeAcesso").value =
        data.endereco.latitude || "";
      document.getElementById("editarLongitudeAcesso").value =
        data.endereco.longitude || "";
      document.getElementById("editarObservacoesAcesso").value =
        data.observacoes || "";
      document.getElementById("editarLocalizacaoAcesso").value =
        data.linkLocalizacao || "";

      botaoBuscar.disabled = false;
      botaoBuscar.innerHTML =
        '<i class="fa-solid fa-magnifying-glass"></i>⠀Buscar';
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert(
        "Não foi possível buscar os dados. Verifique o console para mais detalhes."
      );
      botaoBuscar.disabled = false;
      botaoBuscar.innerHTML =
        '<i class="fa-solid fa-magnifying-glass"></i>⠀Buscar';
    });
}