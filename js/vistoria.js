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

        // Verifica se o parecer está definido
        const parecerDisabled = item.status !== "Em andamento" || item.parecer;

        // Monta a linha da tabela
        const row = `
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
              dataRealizacao
                ? `<input 
                    type="date" 
                    class="form-control text-center" 
                    value="${dataRealizacao}" 
                    disabled
                    id="data-realizacao-${item.endId}"
                  />`
                : renderInputDateVistoria(
                    "data-realizacao",
                    item.endId,
                    item.status
                    
                  )
            }
          </td>
          <td>
            <select class="form-select border-0 bg-light p-2" id="select-parecer-${item.endId}" 
              ${parecerDisabled ? "disabled" : ""}>
              <option value="" selected>Selecione um parecer</option>
              <option value="Viável" ${
                item.parecer === "Viável" ? "selected" : ""
              }>Viável</option>
              <option value="Inviável" ${
                item.parecer === "Inviável" ? "selected" : ""
              }>Inviável</option>
            </select>
            ${item.parecer === "Inviável" && item.status === "Concluído" ? `<button class="btn p-0 border-0 bg-transparent btn-reverterVistoria" data-id="${item.endId}"><i class="fa-solid fa-rotate-left"></i></button>` : ""}
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
          const textoParaCopiar = document.querySelector(`button[data-id="${endId}"]`).textContent.trim();
          navigator.clipboard.writeText(textoParaCopiar).catch((err) => console.error("Erro ao copiar: ", err));
        });
      });

      document.querySelectorAll(".btn-reverterVistoria").forEach((button) => {
        button.addEventListener("click", function () {
          const endId = this.getAttribute("data-id");
          const payload = { status: "Em andamento", dataRealizacao: "", parecer: "" };
          
          fetch(`${host}/vistorias/${endId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          })
          .then(response => {
            if (!response.ok) throw new Error("Erro ao reverter status.");
            return response.json();
          })
          .then(() => {
            alert("Status revertido com sucesso!");
            preencherTabelaVistoria(page);
          })
          .catch(error => {
            console.error("Erro ao reverter status:", error);
            alert("Erro ao reverter status. Tente novamente.");
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


// FUNÇÃO PARA INICIAR VISTORIA
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

      // Envia a mensagem de início da vistoria
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

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const usuarioNome = decodedToken.nome || "Usuário Desconhecido";

      const payloadMensagem = {
        titulo: "Vistoria iniciada",
        conteudo: `${usuarioNome} iniciou ${endId}`,
        dataFormatada: dataFormatada,
        user: {
          id: 2,
          nome: usuarioNome,
          senha: null,
          email: null,
          telefone: null,
          cargo: null,
          operadoras: null
        },
        cargo: null
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
      const paginacao = document.getElementById("pagination-controls-vistoria");
      const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
      preencherTabelaVistoria(paginaAtual - 1);
    })
    .catch((error) => {
      console.error("Erro durante a atualização dos dados:", error);
      if (error.message !== "Você não tem permissão para realizar esta ação.") {
        alert("Erro ao iniciar a vistoria.");
      }
    });
}



function finalizaVistoria(endId) {
  const dataRealizacao = document.getElementById(
    `data-realizacao-${endId}`
  )?.value;
  const parecer = document.getElementById(`select-parecer-${endId}`)?.value;

  if (!dataRealizacao) {
    alert("A data de realização deve estar preenchida.");
    return;
  }

  if (!parecer || parecer === "") {
    alert("Por favor, selecione algum parecer (Viável ou Inviável).");
    return;
  }

  const loadingOverlay = document.getElementById("loading-overlay");
  loadingOverlay.style.display = "block";

  const payloadVistoria = {
    status: "Concluído"
  };

  fetch(`${host}/vistorias/${endId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payloadVistoria),
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
    .then(() => {
      const payloadKitTssr = {
        endId: endId,
        status: "Não iniciado"
      };

      // Se o parecer for "Inviável", apenas finaliza aqui
      if (parecer === "Inviável") {
        return enviarMensagemFinalizacao(endId);
      }

      return fetch(`${host}/tssrs/${endId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadKitTssr),
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao enviar para Kit-Tssr: ${response.statusText}`);
        }
        // Atualiza a etapa para o valor 4
        return atualizarEtapa(endId, 4);
      })
      .then(() => enviarMensagemFinalizacao(endId));
      })
      .then(() => {
      alert("Kit-TSSR finalizado com sucesso!");
      const paginacao = document.getElementById("pagination-controls-vistoria");
      const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
      preencherTabelaVistoria(paginaAtual - 1);
    })
    .catch((error) => {
      alert(error.message || "Erro ao processar a solicitação.");
    })
    .finally(() => {
      loadingOverlay.style.display = "none";
    });
}

function enviarMensagemFinalizacao(endId) {
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
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
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
      operadoras: null
    },
    cargo: null
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


// Função para renderizar o input de data com ícone de envio
function renderInputDateVistoria(action, endId, status) {
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


  function filtrarTabelaVistoria(page = 0, secao, idTabela) {
    const loadingOverlay = document.getElementById("loading-overlay");
    const tbody = document.querySelector(`#${idTabela} tbody`);
    const secaoId = document.getElementById(secao);
  
    // Obtém os valores dos campos de pesquisa
    const pesquisaCampos = {
      endId: secaoId.querySelector("#pesquisaEndIdVistoria").value.trim(),
      status: secaoId.querySelector("#pesquisaStatusVistoria").value.trim(),
      parecer: secaoId.querySelector("#pesquisaParecerVistoria").value.trim(),
    };
  
    // Monta os parâmetros da URL
    const params = montarParametrosVistoria(pesquisaCampos, page);
  
    // Define o endpoint base
    const endpoint = `${host}/vistorias/buscar`;
  
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
        renderizarTabelaVistoria(dados, idTabela, tbody); // Chama a função adaptada
        renderizarBotoesPaginacao(
          "pagination-controls-vistoria",
          filtrarTabelaVistoria,
          dados.pageable.pageNumber,
          dados.totalPages,
          secao, // Argumento extra
          idTabela // Argumento extra
        );        
        exibirTotalResultados("total-pesquisa-vistoria", dados.totalElements);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        alert("Erro ao carregar os dados. Atualize a tela apertando 'F5'.");
      })
      .finally(() => {
        loadingOverlay.style.display = "none";
      });
  }

  
  function montarParametrosVistoria(pesquisaCampos, page) {
    const params = new URLSearchParams();
    if (pesquisaCampos.endId) params.append("endId", pesquisaCampos.endId.toUpperCase());
    if (pesquisaCampos.status) params.append("status", pesquisaCampos.status.toUpperCase());
    if (pesquisaCampos.parecer) params.append("parecer", pesquisaCampos.parecer.toUpperCase());
    params.append("page", page);
    params.append("size", pageSize); // Certifique-se de que a variável `pageSize` está definida corretamente
    return params;
  }
  

  function renderizarTabelaVistoria(dados, idTabela, tbody) {
    tbody.innerHTML = ""; // Limpa a tabela antes de preencher
  
    if (!dados.content || dados.content.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center">Nenhum dado encontrado.</td></tr>`;
      return;
    }
  
    dados.content.forEach((item, i) => {
      const row = criarLinhaVistoria(item, i); // Chama a função para criar a linha
      tbody.insertAdjacentHTML("beforeend", row);
    });
  
    configurarEventosCopiar(); // Chama a função para configurar os eventos de copiar

    document.querySelectorAll(".btn-reverterVistoria").forEach((button) => {
      button.addEventListener("click", function () {
        const endId = this.getAttribute("data-id");
        const payload = { status: "Em andamento", dataRealizacao: "", parecer: "" };
        
        fetch(`${host}/vistorias/${endId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })
        .then(response => {
          if (!response.ok) throw new Error("Erro ao reverter status.");
          return response.json();
        })
        .then(() => {
          alert("Status revertido com sucesso!");
          preencherTabelaVistoria(page);
        })
        .catch(error => {
          console.error("Erro ao reverter status:", error);
          alert("Status Revertido, por favor atualize a página!");
        });
      });
    });
  }
  

  function criarLinhaVistoria(item, i) {
    const dataRealizacao = item.dataRealizacao ? formatarDataParaInput(item.dataRealizacao) : "";
    const parecerDisabled = item.status !== "Em andamento" || item.parecer;
  
    return `
      <tr>
        <td>
          ${item.id}
        </td>
        <td>
          <button class="btn btn-link p-0 text-decoration-none end-id" id="textoParaCopiar" data-id="${item.endId}">
            ${item.endId}
          </button>
          <i class="fa-regular fa-copy btnCopiar" title="Copiar" data-id="${item.endId}"></i>
        </td>
        <td>
          <select disabled class="form-select border-0 bg-light p-2">
            <option value="status">${item.status}</option>
          </select>
          <button class="btn iniciar-btn p-0 border-0 bg-transparent ml-2" 
            style="display:${["Em andamento", "Concluído"].includes(item.status) ? "none" : ""};" 
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
              : renderInputDateVistoria("data-realizacao", item.endId, item.status)
          }
        </td>
        <td>
          <select class="form-select border-0 bg-light p-2" id="select-parecer-${item.endId}" 
            ${parecerDisabled ? "disabled" : ""}>
            <option value="" selected>Selecione um parecer</option>
            <option value="Viável" ${item.parecer === "Viável" ? "selected" : ""}>Viável</option>
            <option value="Inviável" ${item.parecer === "Inviável" ? "selected" : ""}>Inviável</option>
          </select>
          ${item.parecer === "Inviável" && item.status === "Concluído" ? `<button class="btn p-0 border-0 bg-transparent btn-reverterVistoria" data-id="${item.endId}"><i class="fa-solid fa-rotate-left"></i></button>` : ""}
        </td>
        <td>
          <button class="btn btn-primary finalizar-btn" data-id-botao="${item.endId}" 
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
  }
  
  
  
  document
  .querySelector("#tabelaVistoria")
  .addEventListener("change", (event) => {
    const target = event.target;

    if (target.tagName === "SELECT" && target.id.startsWith("select-parecer-")) {
      const endId = target.id.split("-")[2]; // Obtém o End ID
      const parecerSelecionado = target.value; // Obtém o valor selecionado

      if (!parecerSelecionado) {
        alert("Por favor, selecione um parecer válido.");
        return;
      }

      // Exibe a confirmação antes de enviar
      exibirConfirmacao(
        `Tem certeza que deseja definir o parecer como "${parecerSelecionado}"?`,
        () => enviarParecer(endId, parecerSelecionado, "vistoria")
      );
    }
  });
  

// Adiciona o End ID diretamente na tabela ou processa de outra forma
function processarEndIdParaVistoria(endId) {
  console.log(`End ID recebido para vistoria: ${endId}`);
  // Lógica adicional para tratar ou exibir o End ID
}

// Atualize a lógica da página conforme necessário
document.addEventListener("DOMContentLoaded", () => {
  // Essa lógica é executada quando a página é carregada
  console.log("Página de Vistoria carregada. Aguardando novos End IDs");
});

