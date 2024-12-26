// Adiciona evento ao botão "Buscar Agendamento"
document
  .getElementById("button-buscar-agendamento")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const botaoBuscar = this;

    botaoBuscar.disabled = true;
    botaoBuscar.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Buscando...';

    // Simula o processo de busca com um delay
    setTimeout(() => {
      botaoBuscar.disabled = false;
      botaoBuscar.innerHTML =
        '<i class="fa-solid fa-magnifying-glass"></i>⠀Buscar';
    }, 3000);
  });

// Função para preencher a tabela de agendamentos
function preencherTabelaAcesso(page = 0) {
  const loadingOverlay = document.getElementById("loading-overlay");
  const tbody = document.querySelector("#tabelaHistoricoAgendamento tbody");

  loadingOverlay.style.display = "block";

  fetch(`${host}/cadastroEndIds/agendamentos?page=${page}&size=${pageSize}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao buscar dados.");
      return response.json();
    })
    .then((dados) => {
      tbody.innerHTML = ""; // Limpa a tabela

      dados.content.forEach((item) => {
        const dataSolicitacao = item.dataSolicitacao
          ? formatarDataParaInput(item.dataSolicitacao)
          : "";
        const dataPrevisao = item.dataPrevisao
          ? formatarDataParaInput(item.dataPrevisao)
          : "";
        const dataLiberacao = item.dataLiberacao
          ? formatarDataParaInput(item.dataLiberacao)
          : "";

        // Monta a linha da tabela
        const row = `
          <tr>
            <td>
              <button class="btn btn-link p-0 text-decoration-none end-id" data-id="${
                item.endId
              }">
                ${item.endId}
              </button>
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
                  : renderInputDate("data-solicitacao", item.endId)
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
                  : renderInputDate("data-previsao", item.endId)
              }
            </td>
            <td>
              <input 
                type="date" 
                class="form-control ${dataLiberacao ? "text-center" : ""}" 
                value="${dataLiberacao}" 
                ${dataLiberacao ? "disabled" : ""}
              />
            </td>
            <td>
              <button class="btn btn-primary finalizar-btn" data-id-botao="${
                item.endId
              }">
                Finalizar
              </button>
            </td>
          </tr>`;
        tbody.insertAdjacentHTML("beforeend", row);
      });

      renderizarBotoesPaginacao(
        "pagination-controls-agendamento",
        preencherTabelaAcesso,
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

// Função para renderizar o input de data com ícone de envio
function renderInputDate(action, endId) {
  return `
    <div class="input-icon-group">
      <input type="date" class="form-control" />
      <i class="fa-sharp-duotone fa-solid fa-square-arrow-up-right" 
        data-action="${action}" 
        data-id="${endId}"></i>
    </div>`;
}

// Função para exibir uma confirmação
function exibirConfirmacao(mensagem, onConfirm) {
  dismissAlert();

  const alertDiv = document.createElement("div");
  alertDiv.className = "custom-alert";
  Object.assign(alertDiv.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "300px",
    padding: "15px",
    backgroundColor: "rgba(1, 41, 112, 0.9)",
    color: "#ffffff",
    borderRadius: "5px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    zIndex: "1000",
    textAlign: "center",
  });

  alertDiv.innerHTML = `
    <h6 style="font-size: 1.3rem;">${mensagem}</h6>
    <button class="btn btn-light mt-2" id="cancel-button">Cancelar</button>
    <button class="btn btn-warning text-white mt-2" id="confirm-button">Confirmar</button>
  `;
  document.body.appendChild(alertDiv);

  document
    .getElementById("cancel-button")
    .addEventListener("click", dismissAlert);
  document.getElementById("confirm-button").addEventListener("click", () => {
    onConfirm();
    dismissAlert();
  });
}

function iniciaAgendamento(endId) {
  const payload = {
    statusAgendamento: "Em andamento",
  };
  fetch(`${host}/cadastroEndIds/agendamento-parcial/${endId}`, {
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
      const paginacao = document.getElementById(
        "pagination-controls-agendamento"
      );
      const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
      preencherTabelaAcesso(paginaAtual - 1);
    })
    .catch((error) => {
      console.error("Erro durante a atualização dos dados:", error);
      alert("Erro ao iniciar.");
    });
}

// function atualizaAgendamento(secao) {
//   const secaoId = document.querySelector(`#${secao}`);

//   if (!secaoId) {
//     console.error(`Seção com ID '${secao}' não encontrada no DOM.`);
//     return;
//   }

//   const endIdInput = secaoId.querySelector(".editarEndId");
//   if (!endIdInput) {
//     console.error(
//       "Elemento .editarEndId não encontrado na seção especificada."
//     );
//     return;
//   }

//   const endId = endIdInput.value;
//   if (!endId) {
//     alert("Por favor, informe o END ID para poder atualizar.");
//     return;
//   }

//   const botaoAtualizar = document.querySelector("#salvarEndIdNovo");
//   if (botaoAtualizar) {
//     botaoAtualizar.disabled = true;
//     botaoAtualizar.textContent = "Alterando...";
//   }

//   const payload = {
//     endId: endId,
//     siteId: secaoId.querySelector("#editarSiteId")?.value || "",
//     demanda: secaoId.querySelector("#editarDemanda")?.value || "",
//     observacoes: secaoId.querySelector("#editarObservacoes")?.value || "",
//     linkLocalizacao: secaoId.querySelector("#editarLocalizacao")?.value || "",
//     detentora: {
//       idDetentora: secaoId.querySelector("#editarIdDetentora")?.value || "",
//       detentora: secaoId.querySelector("#editarDetentora")?.value || "",
//     },
//     cedente: {
//       idOperadora: secaoId.querySelector("#editarIdOperadora")?.value || "",
//       operadora: secaoId.querySelector("#editarOperadora")?.value || "",
//     },
//     endereco: {
//       logradouro: secaoId.querySelector("#editarLogradouro")?.value || "",
//       numero: secaoId.querySelector("#editarNumero")?.value || "",
//       bairro: secaoId.querySelector("#editarBairro")?.value || "",
//       municipio: secaoId.querySelector("#editarMunicipio")?.value || "",
//       estado: secaoId.querySelector("#editarEstado")?.value || "",
//       cep: secaoId.querySelector("#editarCep")?.value || "",
//       latitude: parseFloat(
//         secaoId.querySelector("#editarLatitude")?.value || 0
//       ),
//       longitude: parseFloat(
//         secaoId.querySelector("#editarLongitude")?.value || 0
//       ),
//     },
//   };

//   console.log(
//     "Payload preparado para envio:",
//     JSON.stringify(payload, null, 2)
//   );

//   fetch(`${host}/cadastroEndIds/${endId}`, {
//     method: "PUT",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   })
//     .then((response) => {
//       console.log("Resposta da requisição recebida:", response);
//       if (!response.ok) {
//         throw new Error(`Erro ao atualizar os dados: ${response.statusText}`);
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log("Dados retornados pelo servidor:", data);
//       alert("Dados atualizados com sucesso!");
//       resetarCampos(secao);
//     })
//     .catch((error) => {
//       console.error("Erro durante a atualização dos dados:", error);
//       alert("Erro ao atualizar os dados. Veja os detalhes no console.");
//     })
//     .finally(() => {
//       if (botaoAtualizar) {
//         botaoAtualizar.disabled = false;
//         botaoAtualizar.textContent = "Salvar";
//       }
//     });
// }

// Função para enviar a data ao backend

function enviarData(endId, dateInput, action) {
  console.log(`Data enviada: ${dateInput} (End ID: ${endId})`);

  // Verifica se a data está em formato válido
  const dataValida = !isNaN(new Date(dateInput).getTime());
  if (!dataValida) {
    alert("Formato de data inválido.");
    return;
  }

  const payload =
    action === "data-solicitacao"
      ? { dataSolicitacao: dateInput }
      : { dataPrevisao: dateInput };

  fetch(`${host}/cadastroEndIds/agendamento-parcial/${endId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(
            `${response.status} - ${response.statusText}: ${
              err.message || "Erro desconhecido"
            }`
          );
        });
      }

      return response.json();
    })
    .then((dados) => {
      // Captura o botão pelo seletor baseado nos atributos
      const button = document.querySelector(
        `i[data-action="${action}"][data-id="${endId}"]`
      );

      // Verifica se o botão foi encontrado e o oculta
      if (button) {
        button.style.display = "none"; // Oculta o botão
      } else {
        console.warn("Botão não encontrado! Mas a operação continua.");
      }

      // Garantir que paginação está funcionando corretamente
      const paginacao = document.getElementById(
        "pagination-controls-agendamento"
      );
      const paginaAtual = parseInt(
        paginacao.querySelector(".btn-primary").textContent,
        10
      );
      if (!isNaN(paginaAtual)) {
        preencherTabelaAcesso(paginaAtual - 1); // Preenche a tabela com base na página atual
      } else {
        console.error("Erro ao obter a página atual.");
      }

      alert("Data enviada com sucesso!");
      console.log("Resposta do servidor:", dados);
    })
    .catch((error) => {
      console.error("Erro ao enviar a data:", error);
      alert("Erro ao enviar a data. Tente novamente.");
    });
}

// Delegação de eventos para os ícones de enviar data
document
  .querySelector("#tabelaHistoricoAgendamento")
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
        () => enviarData(endId, dateInput, action)
      );
    }
  });

// Busca rápida de informações do END ID
// Delegação de eventos no contêiner pai (exemplo: o `tbody` da tabela)
document
  .querySelector("#tabelaHistoricoAgendamento")
  .addEventListener("click", (event) => {
    const loadingOverlay = document.getElementById("loading-overlay");
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

// Delegação de eventos para os botões na tabela
document
  .querySelector("#tabelaHistoricoAgendamento tbody")
  .addEventListener("click", (event) => {
    const button = event.target.closest("[data-id-botao]");
    if (!button) return; // Se não clicar em um botão relevante, retorna

    const endId = button.getAttribute("data-id-botao");

    if (button.classList.contains("iniciar-btn")) {
      // Lógica para o botão "Iniciar"
      exibirConfirmacao(
        "Tem certeza que deseja <b>iniciar</b> essa etapa?",
        () => confirmAlert("iniciar", endId, "agendamento")
      );
    } else if (button.classList.contains("finalizar-btn")) {
      // Lógica para o botão "Finalizar"
      exibirConfirmacao(
        `Tem certeza que deseja enviar o END ID <strong>${endId}</strong>?`,
        () => confirmAlert("finalizar", endId, "agendamento")
      );
    }
  });

// Função para exibir uma confirmação
function exibirConfirmacao(mensagem, onConfirm) {
  // Remove alertas existentes antes de criar um novo
  dismissAlert();

  const alertDiv = document.createElement("div");
  alertDiv.className = "custom-alert";
  Object.assign(alertDiv.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "300px",
    padding: "15px",
    backgroundColor: "rgba(1, 41, 112, 0.9)",
    color: "#ffffff",
    borderRadius: "5px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    zIndex: "1000",
    textAlign: "center",
  });

  alertDiv.innerHTML = `
    <h6 style="font-size: 1.3rem;">${mensagem}</h6>
    <button class="btn btn-light mt-2" id="cancel-button">Cancelar</button>
    <button class="btn btn-warning text-white mt-2" id="confirm-button">Confirmar</button>
  `;
  document.body.appendChild(alertDiv);

  // Evento para cancelar
  document
    .getElementById("cancel-button")
    .addEventListener("click", dismissAlert);

  // Evento para confirmar
  document.getElementById("confirm-button").addEventListener("click", () => {
    onConfirm();
    dismissAlert();
  });
}

// Selecione o link "Histórico de cadastros" e "Editar Cadastro"
const historicoLinkAgendamento = document.querySelector(
  "a[href='#todos-agendamentos']"
);

// Adicione o evento de clique ao link de "Histórico de cadastros"
historicoLinkAgendamento.addEventListener("click", function (event) {
  preencherTabelaAcesso(); // Função chamada ao clicar no link
});

// Adiciona o evento ao botão resetar
document
  .getElementById("botaoResetar")
  .addEventListener("click", resetarCampos("cadastro-fazer"));
