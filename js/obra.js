function preencherTabelaObra(page = 0) {
  const loadingOverlay = document.getElementById("loading-overlay");
  const tbody = document.querySelector("#obra tbody");
  const totalPesquisado = document.getElementById("total-pesquisa-obra");

  loadingOverlay.style.display = "block";

  fetch(`${host}/obras?page=${page}&size=${pageSize}`, {
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
        const dataInicio = item.dataInicio
          ? formatarDataParaInput(item.dataInicio)
          : "";

        const dataFinalizacao = item.dataFinalizacao
          ? formatarDataParaInput(item.dataFinalizacao)
          : "";

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
        <button class="btn btn-link p-0 text-decoration-none ver-mais" data-id="${
          item.endId
        }">
          <i class="fa-solid fa-book"></i> 
        </button>
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
                    dataInicio
                      ? `<input 
                          type="date" 
                          class="form-control text-center" 
                          value="${dataInicio}" 
                          disabled
                          id="inicio-previsto-${item.endId}"
                        />`
                      : renderInputDateObra(
                          "inicio-previsto",
                          item.endId,
                          item.status
                        )
                  }
                </td>
                <td>
                  ${
                    dataFinalizacao
                      ? `<input 
                          type="date" 
                          class="form-control text-center" 
                          value="${dataFinalizacao}" 
                          disabled
                          id="data-final-${item.endId}"
                        />`
                      : renderInputDateObra(
                          "data-final",
                          item.endId,
                          item.status
                        )
                  }
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

      // Renderizar botões de paginação
      renderizarBotoesPaginacao(
        "pagination-controls-obra",
        preencherTabelaObra,
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

// FUNÇÃO PARA INICIAR OBRA
function iniciaObra(endId) {
  const payload = {
    status: "Em andamento",
  };

  fetch(`${host}/obras/${endId}`, {
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

      // Envia a mensagem de início da obra
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
        titulo: "Obra iniciada",
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
      const paginacao = document.getElementById("pagination-controls-obra");
      const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
      preencherTabelaObra(paginaAtual - 1);
    })
    .catch((error) => {
      console.error("Erro durante a atualização dos dados:", error);
      if (error.message !== "Você não tem permissão para realizar esta ação.") {
        alert("Erro ao iniciar a obra.");
      }
    });
}

function finalizaObra(endId) {
  const dataInicio = document.getElementById(`inicio-previsto-${endId}`)?.value;
  const dataFinalizacao = document.getElementById(`data-final-${endId}`)?.value;

  if (!dataInicio || !dataFinalizacao) {
    alert("A data de envio e data de aprovação devem estar preenchidas.");
    return;
  }

  if (
    isNaN(new Date(dataInicio).getTime()) ||
    isNaN(new Date(dataFinalizacao).getTime())
  ) {
    alert("As datas fornecidas são inválidas.");
    return;
  }

  // Adiciona o overlay de carregamento
  const loadingOverlay = document.getElementById("loading-overlay");
  loadingOverlay.style.display = "block";

  const selectElement = document.querySelector(
    `select[data-id-botao="${endId}"]`
  );
  const selectStatus = selectElement?.value || "Status desconhecido";

  const payload = {
    status: "Concluído",
    resultado: selectStatus,
    dataInicio: dataInicio,
    dataFinalizacao: dataFinalizacao,
  };

  console.log("Payload enviado:", payload);

  fetch(`${host}/obras/${endId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      console.log("Resposta recebida:", response);
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

      // Após finalizar Obra, envia o endId para o Sci-Exclusão com status "Não iniciado"
      const payloadExclusao = {
        endId: endId,
        status: "Não iniciado",
      };

      // Envia para o Sci-Inclusão
      return fetch(`${host}/sciExclusao/${endId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadExclusao),
      });
    })
    .then((response) => {
      if (response.status === 403) {
        throw new Error("Você não tem permissão para realizar esta ação.");
      }
      if (!response.ok) {
        throw new Error(
          `Erro ao enviar para Sci-Exclusão: ${response.statusText}`
        );
      }
      return atualizarEtapa(endId, 8);
    })
    .then(() => {
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
        titulo: "Obra finalizada",
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
        "Obra finalizada, enviada para Sci-Exclusão, etapa atualizada e mensagem enviada com sucesso!"
      );

      // Atualiza a tabela na página atual
      const paginacao = document.getElementById("pagination-controls-obra");
      const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
      preencherTabelaObra(paginaAtual - 1);
    })
    .catch((error) => {
      if (error.message === "Você não tem permissão para realizar esta ação.") {
        alert(error.message);
      } else {
        console.error("Erro ao finalizar a obra:", error);
        alert(
          "Erro ao finalizar a obra. Verifique as informações e tente novamente."
        );
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

// Botões de alert para Finalizar e Iniciar
document.querySelector("#obra tbody").addEventListener("click", (event) => {
  const button = event.target.closest("[data-id-botao]");
  if (!button) return; // Se não clicar em um botão relevante, retorna

  const endId = button.getAttribute("data-id-botao");

  if (button.classList.contains("iniciar-btn")) {
    // Lógica para o botão "Iniciar"
    exibirConfirmacao("Tem certeza que deseja <b>iniciar</b> essa etapa?", () =>
      confirmAlert("iniciar", endId, "obra")
    );
  } else if (button.classList.contains("finalizar-btn")) {
    // Lógica para o botão "Finalizar"
    exibirConfirmacao(
      `Tem certeza que deseja concluir o END ID <strong>${endId}</strong>?`,
      () => confirmAlert("finalizar", endId, "obra")
    );
  }
});

// Delegação de eventos para os ícones de enviar data
document
  .querySelector("#tabelaHistoricoObra")
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
        () => enviarData(endId, dateInput, action, "obra")
      );
    }
  });

// Função para mostrar mais do end ID
document
  .querySelector("#tabelaHistoricoObra")
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

// Selecione o link "Obra"
const historicoLinkObra = document.querySelector("a[href='#obra']");

// Adicione o evento de clique ao link de "Obra"
historicoLinkObra.addEventListener("click", function (event) {
  preencherTabelaObra(); // Função chamada ao clicar no link
});

// Função para renderizar o input de data com ícone de envio
function renderInputDateObra(action, endId, status) {
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

function filtrarTabelaObra(
  page = 0,
  secao = "obra",
  idTabela = "tabelaHistoricoObra"
) {
  const loadingOverlay = document.getElementById("loading-overlay");
  const tbody = document.querySelector(`#${idTabela} tbody`);
  const secaoId = document.getElementById(secao);

  // Obtém os valores dos campos de pesquisa
  const pesquisaCampos = {
    endId: secaoId.querySelector("#pesquisaEndIdObra").value.trim(),
    status: secaoId.querySelector("#pesquisaStatusObra").value.trim(),
    dataFinalizacao: secaoId.querySelector("#pesquisaDataFinal").value.trim(),
  };

  // Verifica se a data foi informada e a formata corretamente
  if (pesquisaCampos.dataFinalizacao) {
    // Se o campo já for no formato correto, basta usá-lo diretamente
    pesquisaCampos.dataFinalizacao = pesquisaCampos.dataFinalizacao;
  }

  // Monta os parâmetros da URL
  const params = montarParametrosObra(pesquisaCampos, page);

  // Define a URL para buscar obras
  const endpoint = `${host}/obras/buscar`;

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
      renderizarTabelaObra(dados, idTabela, tbody);
      renderizarBotoesPaginacao(
        "pagination-controls-obra",
        preencherTabelaObra,
        dados.pageable.pageNumber,
        dados.totalPages,
        secao, // Argumento extra
        idTabela // Argumento extra
      );
      exibirTotalResultados("total-pesquisa-obra", dados.totalElements);
    })
    .catch((error) => {
      console.error("Erro ao buscar dados:", error);
      alert("Erro ao carregar os dados. Atualize a tela apertando 'F5'.");
    })
    .finally(() => {
      loadingOverlay.style.display = "none";
    });
}

function montarParametrosObra(pesquisaCampos, page) {
  const params = new URLSearchParams();
  if (pesquisaCampos.endId)
    params.append("endId", pesquisaCampos.endId.toUpperCase());
  if (pesquisaCampos.status)
    params.append("status", pesquisaCampos.status.toUpperCase());
  if (pesquisaCampos.dataFinalizacao)
    params.append("dataFinalizacao", pesquisaCampos.dataFinalizacao); // A data final já no formato adequado
  params.append("page", page);
  params.append("size", pageSize);
  return params;
}

function renderizarTabelaObra(dados, idTabela, tbody) {
  tbody.innerHTML = ""; // Limpa a tabela antes de preencher

  if (!dados.content || dados.content.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center">Nenhum dado encontrado.</td></tr>`;
    return;
  }

  dados.content.forEach((item, i) => {
    const row =
      idTabela === "tabelaHistoricoObra"
        ? criarLinhaHistoricoObra(item, i)
        : criarLinhaCadastroEndId(item, i); // Caso genérico

    tbody.insertAdjacentHTML("beforeend", row);
  });

  configurarEventosCopiar();
}

function criarLinhaHistoricoObra(item) {
  const dataInicio = item.dataInicio
    ? formatarDataParaInput(item.dataInicio)
    : "";
  const dataFinalizacao = item.dataFinalizacao
    ? formatarDataParaInput(item.dataFinalizacao)
    : "";

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
        <button class="btn btn-link p-0 text-decoration-none ver-mais" data-id="${
          item.endId
        }">
          <i class="fa-solid fa-book"></i> 
        </button>
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
          dataInicio
            ? `<input 
                type="date" 
                class="form-control text-center" 
                value="${dataInicio}" 
                disabled
                id="inicio-previsto-${item.endId}"
              />`
            : renderInputDateObra("inicio-previsto", item.endId, item.status)
        }
      </td>
      <td>
        ${
          dataFinalizacao
            ? `<input 
                type="date" 
                class="form-control text-center" 
                value="${dataFinalizacao}" 
                disabled
                id="data-final-${item.endId}"
              />`
            : renderInputDateObra("data-final", item.endId, item.status)
        }
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
    </tr>
  `;
}

// Função de Reset para Obra
document
  .querySelector("#tabelaHistoricoObra")
  .addEventListener("click", (event) => {
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
    <h3 style="font-size: 1.3rem;">Tem certeza que deseja resetar a Obra ID <strong>${endId}</strong>?</h3>
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
      resetarObra(endId); // Chama a função para resetar a obra
      alertDiv.remove(); // Remove o alerta de confirmação
    });

    // Event Listener para o botão "Cancelar"
    document.getElementById("cancelReset").addEventListener("click", () => {
      alertDiv.remove(); // Remove o alerta de confirmação
    });
  });

function resetarObra(endId) {
  const observacao = prompt("Deixe uma observação para o reset da obra:");

  const payload = {
    status: "Não iniciado",
    dataSolicitacao: null,
    dataPrevisao: null,
    dataLiberacao: null,
    reset: 1,
    observacoes: observacao,
  };

  console.log("Payload enviado:", payload);

  fetch(`${host}/obras/agendamento/${endId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
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
      console.log("Resposta do servidor:", data);
      alert("A Obra foi resetada com sucesso!");

      // Agora, vamos buscar o ID correspondente ao End ID antes de deletar
      fetch(`${host}/obras?endId=${endId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Erro ao buscar ID da obra.");
          return response.json();
        })
        .then((dados) => {
          const obra = dados.content.find((item) => item.endId === endId);
          if (!obra || !obra.id) {
            throw new Error("ID da obra não encontrado.");
          }

          // Agora deletamos a obra correspondente ao ID encontrado
          return fetch(`${host}/obras/${obra.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        })
        .then((response) => {
          if (!response.ok) throw new Error("Erro ao deletar obra.");
          preencherTabelaObra(); // Atualiza a tabela
        })
        .catch((error) => {
          console.error("Erro ao deletar a obra:", error);
          alert("Erro ao deletar a obra.");
        });
        return atualizarEtapa(endId, 6);
    })
    .catch((error) => {
      console.error("Erro ao resetar os dados:", error);
      alert("Erro ao resetar a obra.");
    });
}

document
  .querySelector("#tabelaHistoricoObra")
  .addEventListener("click", (event) => {
    const target = event.target.closest(".ver-mais");
    if (!target) return;

    const loadingOverlay = document.getElementById("loading-overlay");
    const endId = target.getAttribute("data-id");

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

    if (!token) {
      console.error("Token de autenticação não encontrado!");
      loadingOverlay.style.display = "none";
      return;
    }

    fetch(`${host}/projetos/informacoes-ligacao/${endId}`, {
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
                <li><strong>Status ligação:</strong> ${
                  dados.statusLigacao ?? ""
                }</li>
                <li><strong>Concessionária:</strong> ${
                  dados.concessionaria ?? ""
                }</li>
                <li><strong>Leitura inicial:</strong> ${
                  dados.leituraInicial ?? ""
                }</li>
                <li><strong>Número Medidor:</strong> ${
                  dados.numeroMedidor ?? ""
                }</li>
                <li><strong>Número de instalação:</strong> ${
                  dados.numeroInstalacao ?? ""
                }</li>
                <li><strong>Número de fases:</strong> ${
                  dados.numeroDeFases ?? ""
                }</li>
            </ul>
            <ul style="flex: 1; padding-right: 20px; font-size: 1em; list-style: none;">
                <li><strong>Regional:</strong> ${dados.regional ?? ""}</li>
                <li><strong>Unidade:</strong> ${dados.unidade ?? ""}</li>
                <li><strong>CNPJ UC:</strong> ${dados.cnpjUc ?? ""}</li>
                <li><strong>Tipo de tensão:</strong> ${
                  dados.tipoTensao ?? ""
                }</li>
                <li><strong>Previsão de ligação:</strong> ${
                  formataData(dados.previsaoLigacao) ?? ""
                }</li>
                <li><strong>Data de ligação:</strong> ${
                  formataData(dados.dataLigacao) ?? ""
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
  });
