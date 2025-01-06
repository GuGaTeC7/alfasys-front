function preencherTabelaVistoria(page = 0) {
  const loadingOverlay = document.getElementById("loading-overlay");
  const tbody = document.querySelector("#vistoria tbody");
  const totalPesquisado = document.getElementById("total-pesquisa-vistoria");

  loadingOverlay.style.display = "block";

  fetch(`${host}/vistorias?page=${page}&size=${pageSize}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao buscar dados.");
      return response.json();
    })
    .then((dados) => {
      tbody.innerHTML = ""; // Limpa a tabela
      totalPesquisado.innerHTML = ""; // Limpa a tabela

      dados.content.forEach((item) => {
        const dataRealizacao = item.dataRealizacao
          ? formatarDataParaInput(item.dataRealizacao)
          : "";

        // Monta a linha da tabela
        const row = `
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
                <option value="status">${item.status}</option>
              </select>
              <button class="btn iniciar-btn p-0 border-0 bg-transparent ml-2" 
                style="display:${
                  ["Em andamento", "Concluído"].includes(item.status)
                    ? "none"
                    : ""
                };" 
                data-id-botao="${item.endId}">
                <i class="fa-solid fa-circle-play"></i>
              </button>
            </td>
            <td>
            ${
              dataRealizacao
                ? `<input 
                    type="date" 
                    class="form-control text-center" 
                    value="${dataRealizacao}" 
                    disabled
                    id="data-realizacao-${item.endId}"
                  />`
                : renderInputDate(
                    "data-realizacao",
                    item.endId,
                    item.status
                    
                  )
            }
          </td>
          <td>
            <select class="form-select border-0 bg-light p-2" id="select-status-${
              item.endId
            }" 
              ${item.status !== "Em andamento" ? "disabled" : ""}>
              <option value="" selected>Selecione uma opção</option>
              <option value="viavel">Viável</option>
              <option value="inviavel">Inviável</option>
            </select>
          </td>
          <td>
            <button class="btn btn-primary finalizar-btn" data-id-botao="${
              item.endId
            }" 
            ${item.status !== "Em andamento" ? "disabled" : ""}>
            Finalizar
          </button>
          <i 
            class="fa-solid fa-rotate-left btnResetar" 
            title="Resetar End ID" 
            data-id="${item.endId}" 
            style="cursor: pointer; margin-left: 8px;">
          </i>
        </td>
      </tr>`;

        tbody.insertAdjacentHTML("beforeend", row);
      });

      // Adicionar eventListener para cada botão "Copiar Texto"
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

      renderizarBotoesPaginacao(
        "pagination-controls-vistoria",
        preencherTabelaVistoria,
        dados.pageable.pageNumber,
        dados.totalPages
      );
    })
    .catch((error) => {
      console.error("Erro ao buscar dados:", error);
      alert("Erro ao carregar os dados. Tente novamente.");
    })
    .finally(() => {
      loadingOverlay.style.display = "none";
    });
}

//FUNÇÃO PARA INICIAR VISTORIA//
function iniciaVistoria(endId) {
  const payload = {
    status: "Em andamento",
  };
  fetch(`${host}/vistorias/${endId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      console.log("Resposta da requisição recebida:", response);
      if (!response.ok) {
        throw new Error(`Erro ao atualizar os dados: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dados retornados pelo servidor:", data);
      const botaoIniciar = document.querySelector(`[data-id-botao="${endId}"]`);
      botaoIniciar.style.display = "none";
      const paginacao = document.getElementById("pagination-controls-vistoria");
      const paginaAtual = paginacao.querySelector(".btn-primary").textContent;

      preencherTabelaVistoria(paginaAtual - 1);
    })
    .catch((error) => {
      console.error("Erro durante a atualização dos dados:", error);
      alert("Erro ao iniciar.");
    });
}

//FINALIZAR VISTORIA//
function finalizaVistoria(endId) {
  // Obtém os valores das datas e do status
  const dataRealizacao = document.getElementById(
    `data-realizacao-${endId}`
  )?.value;
  const selectStatus = document.getElementById(`select-status-${endId}`)?.value;

  // Verifica se todas as datas estão preenchidas
  if (!dataRealizacao) {
    alert("A data de realização deve estar preenchida.");
    return; // Interrompe a execução se a data não for válida
  }

  // Verifica se o campo de status está preenchido
  if (!selectStatus || selectStatus === "") {
    alert("Por favor, selecione algum parecer (Viável ou Inviável).");
    return; // Interrompe a execução se o status não for selecionado
  }

  // Monta o payload
  const payload = {
    status: "Concluído",
    resultado: selectStatus, // Adiciona o status selecionado ao payload
  };

  // Realiza a requisição
  fetch(`${host}/vistorias/${endId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      console.log("Resposta da requisição recebida:", response);
      if (!response.ok) {
        throw new Error(`Erro ao atualizar os dados: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dados retornados pelo servidor:", data);

      // Atualiza a tabela na página atual
      const paginacao = document.getElementById("pagination-controls-vistoria");
      const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
      preencherTabelaVistoria(paginaAtual - 1);
    })
    .catch((error) => {
      console.error("Erro durante a atualização dos dados:", error);
      alert("Erro ao finalizar a vistoria.");
    });
}

// Função para renderizar o input de data com ícone de envio
function renderInputDate(action, endId, status) {
  if (status === "Não iniciado") {
    return `
      <div class="input-icon-group">
        <input 
          type="date" 
          class="form-control" 
          disabled
        />
        <i class="fa-sharp-duotone fa-solid fa-square-arrow-up-right" 
          data-action="${action}" 
          data-id="${endId}"></i>
      </div>`;
  }
  return `
      <div class="input-icon-group">
        <input 
          type="date" 
          class="form-control" 
        />
        <i class="fa-sharp-duotone fa-solid fa-square-arrow-up-right" 
          data-action="${action}" 
          data-id="${endId}"></i>
      </div>`;
}

// Delegação de eventos para os botões na tabela

document.querySelector("#vistoria tbody").addEventListener("click", (event) => {
  const button = event.target.closest("[data-id-botao]");
  if (!button) return; // Se não clicar em um botão relevante, retorna

  const endId = button.getAttribute("data-id-botao");

  if (button.classList.contains("iniciar-btn")) {
    // Lógica para o botão "Iniciar"
    exibirConfirmacao("Tem certeza que deseja <b>iniciar</b> essa etapa?", () =>
      confirmAlert("iniciar", endId, "vistoria")
    );
  } else if (button.classList.contains("finalizar-btn")) {
    // Lógica para o botão "Finalizar"
    exibirConfirmacao(
      `Tem certeza que deseja concluir o END ID <strong>${endId}</strong>?`,
      () => confirmAlert("finalizar", endId, "vistoria")
    );
  }
});

// Selecione o link "Histórico de cadastros" e "Editar Cadastro"
const historicoLinkVistoria = document.querySelector("a[href='#vistoria']");

// Adicione o evento de clique ao link de "Histórico de cadastros"
historicoLinkVistoria.addEventListener("click", function (event) {
  preencherTabelaVistoria(); // Função chamada ao clicar no link
});

document.querySelector("#tabelaVistoria").addEventListener("click", (event) => {
  const loadingOverlay = document.getElementById("loading-overlay");

  // Verifica se o elemento clicado possui a classe `end-id`
  if (event.target.classList.contains("end-id")) {
    const endId = event.target.getAttribute("data-id");

    if (!loadingOverlay) {
      console.error("Elemento de loadingOverlay não encontrado!");
      return;
    }

    loadingOverlay.style.display = "block";

    // Criação do elemento de alerta
    const alertDiv = document.createElement("div");
    alertDiv.className = "alert-container";
    alertDiv.style.position = "fixed";
    alertDiv.style.top = "50%";
    alertDiv.style.left = "50%";
    alertDiv.style.transform = "translate(-50%, -50%)";
    alertDiv.style.width = "86%";
    alertDiv.style.maxWidth = "900px";
    alertDiv.style.padding = "30px";
    alertDiv.style.backgroundColor = "#012970";
    alertDiv.style.color = "#ffffff";
    alertDiv.style.border = "2px solid #012970";
    alertDiv.style.borderRadius = "15px";
    alertDiv.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)";
    alertDiv.style.zIndex = "1000";
    alertDiv.style.overflow = "hidden";
    alertDiv.style.display = "flex";
    alertDiv.style.justifyContent = "center";
    alertDiv.style.alignItems = "center";
    alertDiv.style.flexDirection = "column";

    // Verificação do token de autenticação
    if (!token) {
      console.error("Token de autenticação não encontrado!");
      loadingOverlay.style.display = "none";
      return;
    }

    fetch(`${host}/cadastroEndIds/${endId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao buscar dados.");
        return response.json();
      })
      .then((dados) => {
        alertDiv.innerHTML = `
          <h1 style="display: block; text-align: center; margin-bottom: 25px; font-size: 1.5em; width: 100%;">
            Detalhes do END ID: <b>${endId}</b>
          </h1>
          <div style="display: flex; flex-wrap: wrap; gap: 70px;">
              <ul style="flex: 1; padding-left: 20px; font-size: 1em; list-style: none;">
                  <li><strong>Site ID:</strong> ${dados.siteId}</li>
                  <li><strong>Demanda:</strong> ${dados.demanda}</li>
                  <li><strong>Detentora:</strong> ${dados.detentora.detentora}</li>
                  <li><strong>ID Detentora:</strong> ${dados.detentora.idDetentora}</li>
                  <li><strong>Operadora cedente:</strong> ${dados.cedente.operadora}</li>
                  <li><strong>ID Operadora:</strong> ${dados.cedente.idOperadora}</li>
                  <li><strong>Logradouro:</strong> ${dados.endereco.logradouro}</li>
                  <li><strong>Número:</strong> ${dados.endereco.numero}</li>
              </ul>
              <ul style="flex: 1; padding-right: 20px; font-size: 1em; list-style: none;">
                  <li><strong>Bairro:</strong> ${dados.endereco.bairro}</li>
                  <li><strong>Município:</strong> ${dados.endereco.municipio}</li>
                  <li><strong>Estado:</strong> ${dados.endereco.estado}</li>
                  <li><strong>CEP:</strong> ${dados.endereco.cep}</li>
                  <li><strong>Latitude:</strong> ${dados.endereco.latitude}</li>
                  <li><strong>Longitude:</strong> ${dados.endereco.longitude}</li>
                  <li><strong>Observações:</strong> ${dados.observacoes}</li>
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
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        alert("Erro ao carregar os dados. Atualize a tela apertando 'F5'.");
      })
      .finally(() => {
        loadingOverlay.style.display = "none";
      });
  }
});

// Função de Reset
document.querySelector("#tabelaVistoria").addEventListener("click", (event) => {
  const button = event.target.closest(".btnResetar");
  if (!button) return; // Se não clicar em um botão relevante, retorna

  const endId = button.getAttribute("data-id");

  // Criação do alerta personalizado
  const alertDiv = document.createElement("div");
  alertDiv.className = "alert-container";
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

  alertDiv.innerHTML = `
    <h3 style="font-size: 1.3rem;">Tem certeza que deseja resetar o End ID <strong>${endId}</strong>?</h3>
    <button class="btn btn-light mt-2" id="cancelReset">
      Cancelar
    </button>
    <button class="btn btn-warning text-white mt-2" id="confirmReset">
      Confirmar
    </button>
  `;

  document.body.appendChild(alertDiv);

  // Event Listener para o botão "Confirmar"
  document.getElementById("confirmReset").addEventListener("click", () => {
    resetarVistoria(endId); // Chama a função para resetar a vistoria
    alertDiv.remove(); // Remove o alerta de confirmação
  });

  // Event Listener para o botão "Cancelar"
  document.getElementById("cancelReset").addEventListener("click", () => {
    alertDiv.remove(); // Remove o alerta de confirmação
  });
});

function resetarVistoria(endId) {
  const observacao = prompt("Deixe uma observação:");

  const payload = {
    statusAgendamento: "Não iniciado",
    dataSolicitacao: null,
    dataPrevisao: null,
    dataLiberacao: null,
    reset: true,
    observacoesAgendamento: observacao,
  };
  // Verifique se o método correto é PATCH ou PUT no seu backend
  fetch(`${host}/cadastroEndIds/agendamento/${endId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload), // Enviar um objeto vazio, caso o backend exija um corpo
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(
            `Erro ao resetar os dados: ${
              errorData.message || response.statusText
            }`
          );
        });
      }
      return response.json();
    })
    .then((data) => {
      alert("O End ID foi resetado com sucesso!"); // Alerta de sucesso
      preencherTabelaVistoria(); // Atualiza a tabela
    })
    .catch((error) => {
      console.error("Erro ao resetar os dados:", error);
      alert("Erro ao resetar o processo.");
    });
}

// Delegação de eventos para os ícones de enviar data
document
  .querySelector("#tabelaVistoria")
  .addEventListener("click", (event) => {
    const target = event.target;

    if (target.classList.contains("fa-square-arrow-up-right")) {
      const action = target.getAttribute("data-action");
      const endId = target.getAttribute("data-id"); // Identifica o End ID
      const dateInput = target.previousElementSibling.value; // Obtém o valor da data
      const dataFormatada = formataData(dateInput.split("-"));

      // Verifica se a data foi preenchida
      if (!dateInput) {
        alert("Por favor, preencha a data antes de enviá-la.");
        return;
      }

      // Exibe a confirmação antes de enviar
      exibirConfirmacao(
        `Tem certeza que deseja enviar a data ${dataFormatada}?`,
        () => enviarData(endId, dateInput, action, "vistoria")
      );
    }
  });