function preencherTabelaKitTssr(page = 0) {
  const loadingOverlay = document.getElementById("loading-overlay");
  const tbody = document.querySelector("#kit-tssr tbody");
  const totalPesquisado = document.getElementById("total-pesquisa-Tssr");

  loadingOverlay.style.display = "block";

  fetch(`${host}/tssrs?page=${page}&size=${pageSize}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao buscar dados.");
      return response.json();
    })
    .then((dados) => {
      tbody.innerHTML = "";
      totalPesquisado.innerHTML = "";

      dados.content.forEach((item) => {
        const dataPrevista = item.dataPrevista
          ? formatarDataParaInput(item.dataPrevista)
          : "";
        const dataRealizacao = item.dataRealizacao
          ? formatarDataParaInput(item.dataRealizacao)
          : "";
        const parecerDisabled = item.status !== "Em andamento" || item.parecer;

        const row = `
          <tr>
            <td>${item.id}</td>
            <td>
              <button class="btn btn-link p-0 text-decoration-none end-id" data-id="${
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
                  dataPrevista
                    ? `<input 
                        type="date" 
                        class="form-control text-center" 
                        value="${dataPrevista}" 
                        disabled
                        id="data-prevista-${item.endId}"
                      />`
                    : renderInputDateTssr(
                        "data-prevista",
                        item.endId,
                        item.status
                      )
                }
              </td>
              <td>
                ${
                  dataRealizacao
                    ? `<input 
                        type="date" 
                        class="form-control text-center" 
                        value="${dataRealizacao}" 
                        disabled
                        id="data-realizada-${item.endId}"
                      />`
                    : renderInputDateTssr(
                        "data-realizada",
                        item.endId,
                        item.status
                      )
                }
              </td>
            <td>
              <select class="form-select border-0 bg-light p-2" id="select-parecer-${
                item.endId
              }" ${!(dataPrevista && dataRealizacao) ? "disabled" : ""}>
                <option value="" selected>Selecione um parecer</option>
                <option value="Viável" ${
                  item.parecer === "Viável" ? "selected" : ""
                }>Viável</option>
                <option value="Inviável" ${
                  item.parecer === "Inviável" ? "selected" : ""
                }>Inviável</option>
              </select>
              ${
                item.parecer === "Inviável" && item.status === "Concluído"
                  ? `<button class="btn p-0 border-0 bg-transparent btn-reverter" data-id="${item.endId}"><i class="fa-solid fa-rotate-left"></i></button>`
                  : ""
              }
            </td>
            <td>
              <button class="btn btn-primary finalizar-btn" data-id-botao="${
                item.endId
              }" ${
          item.status !== "Em andamento" ? "disabled" : ""
        }>Finalizar</button>
            </td>
          </tr>`;

        tbody.insertAdjacentHTML("beforeend", row);
      });

      document.querySelectorAll(".btnCopiar").forEach((button) => {
        button.addEventListener("click", function () {
          const endId = this.getAttribute("data-id");
          const textoParaCopiar = document
            .querySelector(`button[data-id="${endId}"]`)
            .textContent.trim();
          navigator.clipboard
            .writeText(textoParaCopiar)
            .catch((err) => console.error("Erro ao copiar: ", err));
        });
      });

      document.querySelectorAll(".btn-reverter").forEach((button) => {
        button.addEventListener("click", function () {
          const endId = this.getAttribute("data-id");
          const payload = {
            status: "Em andamento",
            dataRealizacao: "",
            dataPrevista: "",
            parecer: "",
          };

          fetch(`${host}/tssrs/${endId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          })
            .then((response) => {
              if (!response.ok) throw new Error("Erro ao reverter status.");
              return response.json();
            })
            .then(() => {
              alert("Status revertido com sucesso!");
              preencherTabelaKitTssr(page);
            })
            .catch((error) => {
              console.error("Erro ao reverter status:", error);
              alert("Erro ao reverter status. Tente novamente.");
            });
        });
      });

      renderizarBotoesPaginacao(
        "pagination-controls-Tssr",
        preencherTabelaKitTssr,
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

// Iniciar Kit Tssr
function iniciaTssr(endId) {
  const payload = {
    status: "Em andamento",
  };

  fetch(`${host}/tssrs/${endId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      console.log("Resposta da requisição recebida:", response);

      // Verifica se a resposta não está OK
      if (!response.ok) {
        if (response.status === 403) {
          // Caso o erro seja de permissão
          alert("Você não tem permissão para realizar esta ação.");
        } else {
          // Para outros erros
          throw new Error(`Erro ao atualizar os dados: ${response.statusText}`);
        }
      }

      return response.json();
    })
    .then((data) => {
      console.log("Dados retornados pelo servidor:", data);

      // Envia a mensagem de início do Tssr
      const now = new Date();
      now.setHours(now.getHours() - 3); // Ajustando UTC-3 para horário de Brasília

      const dataFormatada = [
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds(),
      ];

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const usuarioNome = decodedToken.nome || "Usuário Desconhecido";

      const payloadMensagem = {
        titulo: "Kit Tssr iniciado",
        conteudo: `${usuarioNome} iniciou ${endId}`,
        dataFormatada: dataFormatada,
        user: {
          id: 2,
          nome: usuarioNome,
          senha: null,
          email: null,
          telefone: null,
          cargo: null,
          operadoras: null,
        },
        cargo: null,
      };

      // Envia a mensagem
      return fetch(`${host}/mensagens`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadMensagem),
      });
    })
    .then(() => {
      // Oculta o botão de iniciar
      const botaoIniciar = document.querySelector(`[data-id-botao="${endId}"]`);
      botaoIniciar.style.display = "none";

      // Atualiza a tabela na página atual
      const paginacao = document.getElementById("pagination-controls-Tssr");
      const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
      preencherTabelaKitTssr(paginaAtual - 1);
    })
    .catch((error) => {
      console.error("Erro durante a atualização dos dados:", error);
      if (error.message !== "Você não tem permissão para realizar esta ação.") {
        alert("Erro ao iniciar o Kit Tssr.");
      }
    });
}

// Finalizar Kit Tssr
function finalizaKitTssr(endId) {
  // Obtém os valores das datas e do parecer
  const dataPrevista = document.getElementById(`data-prevista-${endId}`)?.value;
  const dataRealizacao = document.getElementById(
    `data-realizada-${endId}`
  )?.value;
  const parecer = document.getElementById(`select-parecer-${endId}`)?.value;

  // Verifica se todas as datas estão preenchidas
  if (!dataRealizacao || !dataPrevista) {
    alert("A data de realização e data prevista devem estar preenchidas.");
    return;
  }

  // Verifica se o parecer está preenchido
  if (!parecer || parecer === "") {
    alert("Por favor, selecione algum parecer (Viável ou Inviável).");
    return;
  }

  // Adiciona o overlay de carregamento
  const loadingOverlay = document.getElementById("loading-overlay");
  loadingOverlay.style.display = "block";

  // Monta o payload para atualizar o status
  const payload = {
    status: "Concluído",
    resultado: parecer,
  };

  // Atualiza o status do Kit-TSSR
  fetch(`${host}/tssrs/${endId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (response.status === 403) {
        throw new Error("Você não tem permissão para realizar esta ação.");
      }
      if (!response.ok) {
        throw new Error(`Erro ao atualizar os dados: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dados retornados pelo servidor:", data);

      // Se o parecer for "Inviável", apenas finaliza aqui
      if (parecer === "Inviável") {
        return enviarMensagemFinalizacaoKit(endId);
      }

      // Caso contrário, envia para o Sci-Inclusão
      const payloadInclusao = {
        endId: endId,
        status: "Não iniciado",
      };

      return fetch(`${host}/sciInclusao/${endId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadInclusao),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Erro ao enviar para Sci-Inclusão: ${response.statusText}`
            );
          }

          // Atualiza a etapa para o valor 4
          return atualizarEtapa(endId, 4);
        })
        .then(() => enviarMensagemFinalizacaoKit(endId));
    })
    .then(() => {
      alert("Kit-TSSR finalizado com sucesso!");

      // Atualiza a tabela na página atual
      const paginacao = document.getElementById("pagination-controls-Tssr");
      const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
      preencherTabelaKitTssr(paginaAtual - 1);
    })
    .catch((error) => {
      console.error("Erro durante a atualização dos dados:", error);
      alert(error.message || "Erro ao finalizar Kit-TSSR.");
    })
    .finally(() => {
      // Remove o overlay de carregamento
      loadingOverlay.style.display = "none";
    });
}

// Função para enviar mensagem de finalização
function enviarMensagemFinalizacaoKit(endId) {
  const now = new Date();
  now.setHours(now.getHours() - 3); // Ajustando UTC-3 para horário de Brasília

  const dataFormatada = [
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds(),
  ];

  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const usuarioNome = decodedToken.nome || "Usuário Desconhecido";

  const payloadMensagem = {
    titulo: "Kit-TSSR finalizado",
    conteudo: `${usuarioNome} finalizou ${endId}`,
    dataFormatada: dataFormatada,
    user: {
      id: 2,
      nome: usuarioNome,
      senha: null,
      email: null,
      telefone: null,
      cargo: null,
      operadoras: null,
    },
    cargo: null,
  };

  return fetch(`${host}/mensagens`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payloadMensagem),
  });
}

// Função para atualizar a etapa
function atualizarEtapa(endId, novaEtapaId) {
  const payloadEtapa = {
    etapa: {
      id: novaEtapaId,
    },
  };

  return fetch(`${host}/cadastroEndIds/etapa/${endId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payloadEtapa),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro ao atualizar a etapa: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Etapa atualizada com sucesso:", data);
    });
}

// Delegação de eventos para os botões na tabela
document.querySelector("#kit-tssr tbody").addEventListener("click", (event) => {
  const button = event.target.closest("[data-id-botao]");
  if (!button) return; // Se não clicar em um botão relevante, retorna

  const endId = button.getAttribute("data-id-botao");

  if (button.classList.contains("iniciar-btn")) {
    // Lógica para o botão "Iniciar"
    exibirConfirmacao("Tem certeza que deseja <b>iniciar</b> essa etapa?", () =>
      confirmAlert("iniciar", endId, "Kit-Tssr")
    );
  } else if (button.classList.contains("finalizar-btn")) {
    // Lógica para o botão "Finalizar"
    exibirConfirmacao(
      `Tem certeza que deseja concluir o END ID <strong>${endId}</strong>?`,
      () => confirmAlert("finalizar", endId, "Kit-Tssr")
    );
  }
});

// Delegação de evento para ver end ID na tabela
document
  .querySelector("#tabelaHistoricoKitTssr")
  .addEventListener("click", (event) => {
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
                  <li><strong>Detentora:</strong> ${
                    dados.detentora.detentora
                  }</li>
                  <li><strong>ID Detentora:</strong> ${
                    dados.detentora.idDetentora
                  }</li>
                  <li><strong>Operadora cedente:</strong> ${
                    dados.cedente.operadora
                  }</li>
                  <li><strong>ID Operadora:</strong> ${
                    dados.cedente.idOperadora
                  }</li>
                  <li><strong>Logradouro:</strong> ${
                    dados.endereco.logradouro
                  }</li>
                  <li><strong>Número:</strong> ${dados.endereco.numero}</li>
              </ul>
              <ul style="flex: 1; padding-right: 20px; font-size: 1em; list-style: none;">
                  <li><strong>Bairro:</strong> ${dados.endereco.bairro}</li>
                  <li><strong>Município:</strong> ${
                    dados.endereco.municipio
                  }</li>
                  <li><strong>Estado:</strong> ${dados.endereco.estado}</li>
                  <li><strong>CEP:</strong> ${dados.endereco.cep}</li>
                  <li><strong>Latitude:</strong> ${
                    dados.endereco.latitude || ""
                  }</li>
                  <li><strong>Longitude:</strong> ${
                    dados.endereco.longitude || ""
                  }</li>
                  <li><strong>Observações:</strong> ${
                    dados.observacoes || ""
                  }</li>
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

// Selecione o link "Kit Tssr"
const historicoLinkKitTssr = document.querySelector("a[href='#kit-tssr']");

// Adicione o evento de clique ao link de "Kit Tssr"
historicoLinkKitTssr.addEventListener("click", function (event) {
  preencherTabelaKitTssr(); // Função chamada ao clicar no link
});

// Delegação de eventos para os ícones de enviar data
document
  .querySelector("#tabelaHistoricoKitTssr")
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
        () => enviarData(endId, dateInput, action, "kit-tssr")
      );
    }
  });

// Função para renderizar o input de data com ícone de envio
function renderInputDateTssr(action, endId, status) {
  if (status === "Em andamento" ? "" : "disabled") {
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

function filtrarTabelaKitTssr(page = 0, secao, idTabela) {
  const loadingOverlay = document.getElementById("loading-overlay");
  const tbody = document.querySelector(`#${idTabela} tbody`);
  const secaoId = document.getElementById(secao);

  // Obtém os valores dos campos de pesquisa
  const pesquisaCampos = {
    endId: secaoId.querySelector("#pesquisaEndIdKitTssr").value.trim(),
    status: secaoId.querySelector("#pesquisaStatusKitTssr").value.trim(),
    parecer: secaoId.querySelector("#pesquisaParecerKitTssr").value.trim(),
  };

  // Monta os parâmetros da URL
  const params = montarParametrosKitTssr(pesquisaCampos, page);

  // Define o endpoint base
  const endpoint = `${host}/tssrs/buscar`;

  loadingOverlay.style.display = "block";

  // Realiza a requisição e manipula a resposta
  fetch(`${endpoint}?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao buscar dados.");
      return response.json();
    })
    .then((dados) => {
      renderizarTabelaKitTssr(dados, idTabela, tbody); // Chama a função adaptada
      renderizarBotoesPaginacao(
        "pagination-controls-Tssr",
        filtrarTabelaKitTssr,
        dados.pageable.pageNumber,
        dados.totalPages,
        secao, // Argumento extra
        idTabela // Argumento extra
      );
      exibirTotalResultados("total-pesquisa-Tssr", dados.totalElements);
    })
    .catch((error) => {
      console.error("Erro ao buscar dados:", error);
      alert("Erro ao carregar os dados. Atualize a tela apertando 'F5'.");
    })
    .finally(() => {
      loadingOverlay.style.display = "none";
    });
}

function montarParametrosKitTssr(pesquisaCampos, page) {
  const params = new URLSearchParams();
  if (pesquisaCampos.endId)
    params.append("endId", pesquisaCampos.endId.toUpperCase());
  if (pesquisaCampos.status)
    params.append("status", pesquisaCampos.status.toUpperCase());
  if (pesquisaCampos.parecer)
    params.append("parecer", pesquisaCampos.parecer.toUpperCase());
  params.append("page", page);
  params.append("size", pageSize);
  return params;
}

function renderizarTabelaKitTssr(dados, idTabela, tbody) {
  tbody.innerHTML = ""; // Limpa a tabela antes de preencher

  if (!dados.content || dados.content.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center">Nenhum dado encontrado.</td></tr>`;
    return;
  }

  dados.content.forEach((item, i) => {
    const row =
      idTabela === "tabelaHistoricoKitTssr"
        ? criarLinhaKitTssr(item, i)
        : idTabela === "tabelaHistoricoInclusao"
        ? criarLinhaHistoricoInclusao(item, i)
        : idTabela === "tabelaHistoricoAgendamento"
        ? criarLinhaHistoricoAgendamento(item, i)
        : criarLinhaCadastroEndId(item, i);

    tbody.insertAdjacentHTML("beforeend", row);
  });

  configurarEventosCopiar();

  document.querySelectorAll(".btn-reverter").forEach((button) => {
    button.addEventListener("click", function () {
      const endId = this.getAttribute("data-id");
      const payload = {
        status: "Em andamento",
        dataRealizacao: "",
        dataPrevista: "",
        parecer: "",
      };

      fetch(`${host}/tssrs/${endId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Erro ao reverter status.");
          return response.json();
        })
        .then(() => {
          alert("Status revertido com sucesso!");
          preencherTabelaKitTssr(page);
        })
        .catch((error) => {
          console.error("Erro ao reverter status:", error);
          alert("Status Revertido, por favor atualize a página!");
          preencherTabelaKitTssr(page);
        });
    });
  });
}

function criarLinhaKitTssr(item, i) {
  const dataPrevista = item.dataPrevista
    ? formatarDataParaInput(item.dataPrevista)
    : "";
  const dataRealizacao = item.dataRealizacao
    ? formatarDataParaInput(item.dataRealizacao)
    : "";

  // Verifica se o parecer está definido
  const parecerDisabled = item.status !== "Em andamento" || item.parecer;

  return `
    <tr>
      <td>
        ${item.id}
      </td>
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
            ["Em andamento", "Concluído"].includes(item.status) ? "none" : ""
          };" 
          data-id-botao="${item.endId}">
          <i class="fa-solid fa-circle-play"></i>
        </button>
      </td>
      <td>
        ${
          dataPrevista
            ? `<input 
              type="date" 
              class="form-control text-center" 
              value="${dataPrevista}" 
              disabled
              id="data-prevista-${item.endId}"
            />`
            : renderInputDateTssr("data-prevista", item.endId, item.status)
        }
      </td>
      <td>
        ${
          dataRealizacao
            ? `<input 
              type="date" 
              class="form-control text-center" 
              value="${dataRealizacao}" 
              disabled
              id="data-realizada-${item.endId}"
            />`
            : renderInputDateTssr("data-realizada", item.endId, item.status)
        }
      </td>
      <td>
        <select class="form-select border-0 bg-light p-2" id="select-parecer-${
          item.endId
        }" 
          ${!(dataPrevista && dataRealizacao) ? "disabled" : ""}>
          <option value="" selected>Selecione um parecer</option>
          <option value="Viável" ${
            item.parecer === "Viável" ? "selected" : ""
          }>Viável</option>
          <option value="Inviável" ${
            item.parecer === "Inviável" ? "selected" : ""
          }>Inviável</option>
        </select>
        ${
          item.parecer === "Inviável" && item.status === "Concluído"
            ? `<button class="btn p-0 border-0 bg-transparent btn-reverter" data-id="${item.endId}"><i class="fa-solid fa-rotate-left"></i></button>`
            : ""
        }
      </td>
      <td>
        <button class="btn btn-primary finalizar-btn" data-id-botao="${
          item.endId
        }" 
          ${item.status !== "Em andamento" ? "disabled" : ""}>
          Finalizar
        </button>
      </td>
    </tr>
  `;
}

document
  .querySelector("#tabelaHistoricoKitTssr")
  .addEventListener("change", (event) => {
    const target = event.target;

    if (
      target.tagName === "SELECT" &&
      target.id.startsWith("select-parecer-")
    ) {
      const endId = target.id.split("-")[2]; // Obtém o End ID
      const parecerSelecionado = target.value; // Obtém o valor selecionado

      if (!parecerSelecionado) {
        alert("Por favor, selecione um parecer válido.");
        return;
      }

      // Exibe a confirmação antes de enviar
      exibirConfirmacao(
        `Tem certeza que deseja definir o parecer como "${parecerSelecionado}"?`,
        () => enviarParecer(endId, parecerSelecionado, "kit-tssr")
      );
    }
  });

// Adiciona o End ID diretamente na tabela ou processa de outra forma
function processarEndIdParaKitTssr(endId) {
  console.log(`End ID recebido para Kit-Tssr: ${endId}`);
  // Lógica adicional para tratar ou exibir o End ID
}

// Atualize a lógica da página conforme necessário
document.addEventListener("DOMContentLoaded", () => {
  // Essa lógica é executada quando a página é carregada
  console.log("Página de Kit-Tssr carregada. Aguardando novos End IDs.");
});
