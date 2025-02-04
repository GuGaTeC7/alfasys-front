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
  const totalPesquisado = document.getElementById("total-pesquisa-agendamento");

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
      totalPesquisado.innerHTML = ""; // Limpa a tabela

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

        console.log(item);

        // Monta a linha da tabela
        const row = `
          <tr style="${
            item.statusAgendamento === "Não iniciado" && item.reset === true
              ? "background-color: #f75c577d;"
              : ""
          }">
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
                      id="data-solicitacao-${item.endId}"
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
                      id="data-previsao-${item.endId}"
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
                      id="data-liberacao-${item.endId}"
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
              }" ${
          item.statusAgendamento === "Não iniciado" ||
          item.statusAgendamento === "Concluído"
            ? "disabled"
            : ""
        }>
                Finalizar
              </button>
            </td>
            <td style="text-align: center;">
              <i 
                class="fa-solid fa-comments" 
                style="font-size: 1.7rem; color: ${
                  item.reset ? "#007bff" : "rgba(0, 123, 255, 0.46)"
                }; 
                ${
                  item.observacoes
                    ? `cursor: pointer;"`
                    : 'cursor: not-allowed;"'
                }" 
                ${
                  item.observacoes
                    ? `onclick="alert('${item.observacoes}');"`
                    : 'style="cursor: none !important;"'
                }>
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


// Função para renderizar botões de páginação
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


// Função para iniciar um agendamento
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

      // Envia a mensagem de início
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
        titulo: "Agendamento iniciado",
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
      const paginacao = document.getElementById(
        "pagination-controls-agendamento"
      );
      const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
      preencherTabelaAcesso(paginaAtual - 1);
    })
    .catch((error) => {
      console.error("Erro durante a atualização dos dados:", error);
      if (error.message !== "Você não tem permissão para realizar esta ação.") {
        alert("Erro ao iniciar.");
      }
    });
}




function finalizaAgendamento(endId) {
  // Obtém os valores das datas
  const dataSolicitacao = document.getElementById(
    `data-solicitacao-${endId}`
  )?.value;
  const dataPrevisao = document.getElementById(`data-previsao-${endId}`)?.value;
  const dataLiberacao = document.getElementById(
    `data-liberacao-${endId}`
  )?.value;

  // Verifica se todas as datas estão preenchidas
  if (!dataSolicitacao || !dataPrevisao || !dataLiberacao) {
    alert(
      "Todas as datas (Solicitação, Previsão e Liberação) devem estar preenchidas."
    );
    return; // Interrompe a execução se as datas não forem válidas
  }

  // Adiciona o overlay de carregamento
  const loadingOverlay = document.getElementById("loading-overlay");
  loadingOverlay.style.display = "block";

  // Monta o payload para finalizar o agendamento
  const payload = {
    statusAgendamento: "Concluído",
  };

  // Realiza a requisição para finalizar o agendamento
  fetch(`${host}/cadastroEndIds/agendamento-parcial/${endId}`, {
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
    .then(() => {
      // Após finalizar o agendamento, envia o endId para a página "Vistoria"
      const vistoriaPayload = {
        endId: endId, // Inclui o ID
        status: "Não iniciado", // Define o status explicitamente
      };

      return fetch(`${host}/vistorias/${endId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vistoriaPayload),
      });
    })
    .then((response) => {
      if (response.status === 403) {
        throw new Error("Você não tem permissão para realizar esta ação.");
      }
      if (!response.ok) {
        throw new Error(`Erro ao enviar o End ID para vistoria: ${response.statusText}`);
      }
      return atualizarEtapa(endId, 2);
    })
    .then((data) => {
      console.log("End ID enviado com sucesso, com status 'Não Iniciado':", data);

      // Envia a mensagem de conclusão
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
        titulo: "Agendamento finalizado",
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
      alert(
        "Acesso Vistoria finalizada, enviada para Vistoria e etapa atualizada com sucesso!"
      );

      // Atualiza a tabela na página atual
      const paginacao = document.getElementById(
        "pagination-controls-agendamento"
      );
      const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
      preencherTabelaAcesso(paginaAtual - 1);
    })
    .catch((error) => {
      if (error.message === "Você não tem permissão para realizar esta ação.") {
        alert(error.message);
      } else {
        console.error("Erro durante a finalização e envio para vistoria:", error);
        alert("Erro ao finalizar e enviar o End ID para vistoria.");
      }
    })
    .finally(() => {
      // Remove o overlay de carregamento
      loadingOverlay.style.display = "none";
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



// Função para atualizar um end ID
function atualizarNovoAcesso(secao) {
  const secaoId = document.querySelector(`#${secao}`);

  if (!secaoId) {
    console.error(`Seção com ID '${secao}' não encontrada no DOM.`);
    return;
  }

  const endIdInput = secaoId.querySelector(".editarEndIdAcesso");
  if (!endIdInput) {
    console.error(
      "Elemento .editarEndIdAcesso não encontrado na seção especificada."
    );
    return;
  }

  const endId = endIdInput.value;
  if (!endId) {
    alert("Por favor, informe o END ID para poder atualizar.");
    return;
  }

  const botaoAtualizar = document.querySelector("#salvarAcessoNovo");
  if (botaoAtualizar) {
    botaoAtualizar.disabled = true;
    botaoAtualizar.textContent = "Alterando...";
  }

  const payload = {
    endId: endId,
    siteId: secaoId.querySelector("#editarSiteIdAcesso")?.value || "",
    demanda: secaoId.querySelector("#editarDemandaAcesso")?.value || "",
    observacoes: secaoId.querySelector("#editarObservacoesAcesso")?.value || "",
    detentora: {
      idDetentora:
        secaoId.querySelector("#editarIdDetentoraAcesso")?.value || "",
      detentora: secaoId.querySelector("#editarDetentoraAcesso")?.value || "",
    },
    cedente: {
      idOperadora:
        secaoId.querySelector("#editarIdOperadoraAcesso")?.value || "",
      operadora: secaoId.querySelector("#editarOperadoraAcesso")?.value || "",
    },
    linkLocalizacao:
      secaoId.querySelector("#editarLocalizacaoAcesso")?.value || "",
    endereco: {
      logradouro: secaoId.querySelector("#editarLogradouroAcesso")?.value || "",
      numero: secaoId.querySelector("#editarNumeroAcesso")?.value || "",
      bairro: secaoId.querySelector("#editarBairroAcesso")?.value || "",
      municipio: secaoId.querySelector("#editarMunicipioAcesso")?.value || "",
      estado: secaoId.querySelector("#editarEstadoAcesso")?.value || "",
      cep: secaoId.querySelector("#editarCepAcesso")?.value || "",
      latitude: parseFloat(
        secaoId.querySelector("#editarLatitudeAcesso")?.value || 0
      ),
      longitude: parseFloat(
        secaoId.querySelector("#editarLongitudeAcesso")?.value || 0
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


// Delegação de eventos para os ícones de enviar data
document.querySelector("#tabelaHistoricoAgendamento").addEventListener("click", (event) => {
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
        () => enviarData(endId, dateInput, action, "agendamento")
      );
    }
  });


// // Busca rápida de informações do END ID
document.querySelector("#tabelaHistoricoAgendamento").addEventListener("click", (event) => {
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
document.querySelector("#tabelaHistoricoAgendamento tbody").addEventListener("click", (event) => {
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
        `Tem certeza que deseja concluir o END ID <strong>${endId}</strong>?`,
        () => confirmAlert("finalizar", endId, "agendamento")
      );
    }
  });

// Selecione o link "Histórico de agendamentos" e "Editar agendamento"
const historicoLinkAgendamento = document.querySelector("a[href='#todos-agendamentos']");

// Adicione o evento de clique ao link de "Histórico de agendamentos"
historicoLinkAgendamento.addEventListener("click", function (event) {
  preencherTabelaAcesso(); // Função chamada ao clicar no link
});

// Adiciona o evento ao botão resetar
document.getElementById("botaoResetar").addEventListener("click", resetarCampos("cadastro-fazer"));


function filtrarTabelaAgendamento(page = 0, secao, idTabela) {
  const loadingOverlay = document.getElementById("loading-overlay");
  const tbody = document.querySelector(`#${idTabela} tbody`);
  const secaoId = document.getElementById(secao);

  // Obtém os valores dos campos de pesquisa
  const pesquisaCampos = {
      endId: secaoId.querySelector("#pesquisaEndIdAg").value.trim(),
      status: secaoId.querySelector("#pesquisaStatusAgendamentoo").value.trim(),
      municipio: secaoId.querySelector("#pesquisaMunicipioo").value.trim(),
  };

  // Monta os parâmetros da URL
  const params = montarParametrosAgendamento(pesquisaCampos, page);
  const endpoint = `${host}/cadastroEndIds/buscar-agendamento`;

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
          renderizarTabelaAgendamento(dados, idTabela, tbody);
          renderizarBotoesPaginacao(
              "pagination-controls-agendamento",
              filtrarTabelaAgendamento,
              dados.pageable.pageNumber,
              dados.totalPages,
              secao,
              idTabela
          );
          exibirTotalResultados("total-pesquisa-agendamento", dados.totalElements);
      })
      .catch((error) => {
          console.error("Erro ao buscar dados:", error);
          alert("Erro ao carregar os dados. Atualize a tela apertando 'F5'.");
      })
      .finally(() => {
          loadingOverlay.style.display = "none";
      });
}

function montarParametrosAgendamento(pesquisaCampos, page) {
  const params = new URLSearchParams();
  if (pesquisaCampos.endId) params.append("endId", pesquisaCampos.endId.toUpperCase());
  if (pesquisaCampos.status) params.append("status", pesquisaCampos.status.toUpperCase());
  if (pesquisaCampos.municipio) params.append("municipio", pesquisaCampos.municipio.toUpperCase());
  params.append("page", page);
  params.append("size", pageSize);
  return params;
}

function renderizarTabelaAgendamento(dados, idTabela, tbody) {
  tbody.innerHTML = ""; // Limpa a tabela antes de preencher

  if (!dados.content || dados.content.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center">Nenhum dado encontrado.</td></tr>`;
      return;
  }

  dados.content.forEach((item, i) => {
      const row = criarLinhaAgendamento(item, i);
      tbody.insertAdjacentHTML("beforeend", row);
  });

  configurarEventosCopiar(); // Chama a função para configurar os eventos de copiar

}

function criarLinhaAgendamento(item, i) {
  const dataSolicitacao = item.dataSolicitacao ? formatarDataParaInput(item.dataSolicitacao) : "";
  const dataPrevisao = item.dataPrevisao ? formatarDataParaInput(item.dataPrevisao) : "";
  const dataLiberacao = item.dataLiberacao ? formatarDataParaInput(item.dataLiberacao) : "";

  return `
    <tr style="${
            item.statusAgendamento === "Não iniciado" && item.reset === true
              ? "background-color: #f75c577d;"
              : ""
          }">
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
                      id="data-solicitacao-${item.endId}"
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
                      id="data-previsao-${item.endId}"
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
                      id="data-liberacao-${item.endId}"
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
              }" ${
          item.statusAgendamento === "Não iniciado" ||
          item.statusAgendamento === "Concluído"
            ? "disabled"
            : ""
        }>
                Finalizar
              </button>
            </td>
            <td style="text-align: center;">
              <i 
                class="fa-solid fa-comments" 
                style="font-size: 1.7rem; color: ${
                  item.reset ? "#007bff" : "rgba(0, 123, 255, 0.46)"
                }; 
                ${
                  item.observacoes
                    ? `cursor: pointer;"`
                    : 'cursor: not-allowed;"'
                }" 
                ${
                  item.observacoes
                    ? `onclick="alert('${item.observacoes}');"`
                    : 'style="cursor: none !important;"'
                }>
              </i>
            </td>
          </tr>`;
}
