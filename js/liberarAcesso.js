document
  .getElementById("button-buscar-agendamento")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Previne o comportamento padrão do botão, como submissão de formulário.

    const botaoBuscar = this; // Referência ao botão
    botaoBuscar.disabled = true; // Desabilita o botão temporariamente
    botaoBuscar.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Buscando...';

    // Simula o processo de busca com um delay de 3 segundos
    setTimeout(() => {
      botaoBuscar.disabled = false; // Habilita o botão novamente
      botaoBuscar.innerHTML =
        '<i class="fa-solid fa-magnifying-glass"></i>⠀Buscar'; // Restaura o conteúdo original do botão
    }, 3000);
  });

// Função para buscar dados e preencher a tabela
function preencherTabelaAcesso(page = 0) {
  const loadingOverlay = document.getElementById("loading-overlay");
  const tbody = document.querySelector("#tabelaHistoricoAgendamento tbody");

  loadingOverlay.style.display = "block";

  fetch(`${host}/cadastroEndIds/agendamentos?page=${page}&size=${pageSize}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar dados.");
      }
      return response.json();
    })
    .then((dados) => {
      tbody.innerHTML = ""; // Limpa a tabela antes de preencher

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
              <button class="btn iniciar-btn p-0 border-0 bg-transparent ml-2" style="display:${
                item.statusAgendamento === "Em andamento" ||
                item.statusAgendamento === "Concluído"
                  ? "none"
                  : ""
              };" data-id-botao="${item.endId}">
                <i class="fa-solid fa-circle-play"></i>
              </button>
            </td>
            <td>
              <div class="input-icon-group">
                <input 
                  type="date" 
                  class="form-control ${dataSolicitacao ? "text-center" : ""}" 
                  value="${dataSolicitacao}" 
                  ${dataSolicitacao ? "disabled" : ""}
                />
                <i class="fa-sharp-duotone fa-solid fa-square-arrow-up-right"></i>
              </div>
            </td>
            <td>
              <div class="input-icon-group">
                <input 
                  type="date" 
                  class="form-control ${dataPrevisao ? "text-center" : ""}" 
                  value="${dataPrevisao}" 
                  ${dataPrevisao ? "disabled" : ""}
                />
                <i class="fa-sharp-duotone fa-solid fa-square-arrow-up-right"></i>
              </div>
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

function iniciaAgendamento(endId) {
  const payload = {
    statusAgendamento: "Em andamento",
  };
  fetch(`${host}/cadastroEndIds/agendamento/${endId}`, {
    method: "PUT",
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

function atualizaAgendamento(secao) {
  const secaoId = document.querySelector(`#${secao}`);

  if (!secaoId) {
    console.error(`Seção com ID '${secao}' não encontrada no DOM.`);
    return;
  }

  const endIdInput = secaoId.querySelector(".editarEndId");
  if (!endIdInput) {
    console.error(
      "Elemento .editarEndId não encontrado na seção especificada."
    );
    return;
  }

  const endId = endIdInput.value;
  if (!endId) {
    alert("Por favor, informe o END ID para poder atualizar.");
    return;
  }

  const botaoAtualizar = document.querySelector("#salvarEndIdNovo");
  if (botaoAtualizar) {
    botaoAtualizar.disabled = true;
    botaoAtualizar.textContent = "Alterando...";
  }

  const payload = {
    endId: endId,
    siteId: secaoId.querySelector("#editarSiteId")?.value || "",
    demanda: secaoId.querySelector("#editarDemanda")?.value || "",
    observacoes: secaoId.querySelector("#editarObservacoes")?.value || "",
    linkLocalizacao: secaoId.querySelector("#editarLocalizacao")?.value || "",
    detentora: {
      idDetentora: secaoId.querySelector("#editarIdDetentora")?.value || "",
      detentora: secaoId.querySelector("#editarDetentora")?.value || "",
    },
    cedente: {
      idOperadora: secaoId.querySelector("#editarIdOperadora")?.value || "",
      operadora: secaoId.querySelector("#editarOperadora")?.value || "",
    },
    endereco: {
      logradouro: secaoId.querySelector("#editarLogradouro")?.value || "",
      numero: secaoId.querySelector("#editarNumero")?.value || "",
      bairro: secaoId.querySelector("#editarBairro")?.value || "",
      municipio: secaoId.querySelector("#editarMunicipio")?.value || "",
      estado: secaoId.querySelector("#editarEstado")?.value || "",
      cep: secaoId.querySelector("#editarCep")?.value || "",
      latitude: parseFloat(
        secaoId.querySelector("#editarLatitude")?.value || 0
      ),
      longitude: parseFloat(
        secaoId.querySelector("#editarLongitude")?.value || 0
      ),
    },
  };

  console.log(
    "Payload preparado para envio:",
    JSON.stringify(payload, null, 2)
  );

  fetch(`${host}/cadastroEndIds/${endId}`, {
    method: "PUT",
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
      alert("Dados atualizados com sucesso!");
      resetarCampos(secao);
    })
    .catch((error) => {
      console.error("Erro durante a atualização dos dados:", error);
      alert("Erro ao atualizar os dados. Veja os detalhes no console.");
    })
    .finally(() => {
      if (botaoAtualizar) {
        botaoAtualizar.disabled = false;
        botaoAtualizar.textContent = "Salvar";
      }
    });
}

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

// Funções de delegação de eventos para os botões "Iniciar" e "Finalizar"
document
  .querySelector("#tabelaHistoricoAgendamento tbody")
  .addEventListener("click", (event) => {
    const endId = event.target
      .closest("[data-id-botao]")
      .getAttribute("data-id-botao"); // Melhor maneira de capturar o 'data-id'

    if (event.target.closest(".iniciar-btn")) {
      // Verificando se o alvo é o botão 'iniciar-btn'
      // Lógica para o botão "Iniciar"
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
      alertDiv.innerHTML = `
      <h6 style="font-size: 1.3rem;">Tem certeza que deseja <b>iniciar</b> essa etapa?</h6>
      <button class="btn btn-light mt-2" id="cancel-button">Cancelar</button>
      <button class="btn btn-warning text-white mt-2" id="confirm-button">Iniciar</button>
    `;
      document.body.appendChild(alertDiv);

      // Adicionando o evento de click para o botão de "Cancelar"
      document.getElementById("cancel-button").addEventListener("click", () => {
        dismissAlert();
      });

      // Adicionando o evento de click para o botão de "Iniciar"
      document
        .getElementById("confirm-button")
        .addEventListener("click", () => {
          // Chamando confirmAlert diretamente aqui para o botão "Iniciar"
          confirmAlert("iniciar", endId, "agendamento");
        });
    } else if (event.target.closest(".finalizar-btn")) {
      // Verificando se o alvo é o botão 'finalizar-btn'
      // Lógica para o botão "Finalizar"
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
      alertDiv.innerHTML = `
      <h6 style="font-size: 1.3rem;">Tem certeza que deseja enviar o END ID <strong>${endId}?</strong></h6>
      <button class="btn btn-light mt-2" id="cancel-button">Cancelar</button>
      <button class="btn btn-warning text-white mt-2" id="confirm-button">Enviar</button>
    `;
      document.body.appendChild(alertDiv);

      // Adicionando o evento de click para o botão de "Cancelar"
      document.getElementById("cancel-button").addEventListener("click", () => {
        dismissAlert();
      });

      // Adicionando o evento de click para o botão de "Finalizar"
      document
        .getElementById("confirm-button")
        .addEventListener("click", () => {
          // Chamando confirmAlert diretamente aqui para o botão "Finalizar"
          confirmAlert("finalizar", endId, "agendamento");
        });
    }
  });

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
