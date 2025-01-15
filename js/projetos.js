document.getElementById("button-buscar-projeto").addEventListener("click", function (event) {
    event.preventDefault(); // Previne o comportamento padrão do botão, como submissão de formulário.
  
    const botaoBuscar = this; // Referência ao botão
    botaoBuscar.disabled = true; // Desabilita o botão temporariamente
    botaoBuscar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Buscando...';
  
    // Simula o processo de busca com um delay de 3 segundos
    setTimeout(() => {
      botaoBuscar.disabled = false; // Habilita o botão novamente
      botaoBuscar.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>⠀Buscar'; // Restaura o conteúdo original do botão
    }, 3000);
  });


  function preencherTabelaProjetos(page = 0) {
    const loadingOverlay = document.getElementById("loading-overlay");
    const tbody = document.querySelector("#tabelaHistoricoProjetos tbody");
    const totalPesquisado = document.getElementById("total-pesquisa-projeto");
  
    loadingOverlay.style.display = "block";
  
    fetch(`${host}/projetos?page=${page}&size=${pageSize}`, {
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
            const dataEntrada = item.dataEntrada
              ? formatarDataParaInput(item.dataEntrada)
              : "";
  
            const dataAprovacao = item.dataAprovacao
              ? formatarDataParaInput(item.dataAprovacao)
              : "";  
  // Monta a linha da tabela
  const row = `
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
        ${dataEntrada ? `<input type="date" class="form-control text-center" value="${dataEntrada}" disabled id="data-entrada-${item.endId}" />` : renderInputDateProjetos("data-entrada", item.endId, item.status)}
      </td>
      <td>
        ${dataAprovacao ? `<input type="date" class="form-control text-center" value="${dataAprovacao}" disabled id="data-aprovacao-projeto-${item.endId}" />` : renderInputDateProjetos("data-aprovacao-projeto", item.endId, item.status)}
      </td>
      <td>
        <button class="btn btn-primary finalizar-btn" data-id-botao="${item.endId}" ${item.status === "Não iniciado" || item.status === "Concluído" ? "disabled" : ""}>
          Finalizar
        </button>
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
  
  
  // Renderiza botões de paginação
  renderizarBotoesPaginacao(
    "pagination-controls-projeto",
    preencherTabelaProjetos,
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
function iniciaProjeto(endId) {
  const payload = {
    status: "Em andamento",
  };
  fetch(`${host}/projetos/${endId}`, {
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
      const botaoIniciar = document.querySelector(`[data-id-botao="${endId}"]`);
      botaoIniciar.style.display = "none";
      const paginacao = document.getElementById("pagination-controls-projeto");
      const paginaAtual = paginacao.querySelector(".btn-primary").textContent;

      preencherTabelaProjetos(paginaAtual - 1);
    })
    .catch((error) => {
      console.error("Erro durante a atualização dos dados:", error);
      if (error.message !== "Você não tem permissão para realizar esta ação.") {
        alert("Erro ao iniciar.");
      }
    });
}

  
  
// Finalizar Projeto
function finalizaProjeto(endId) {
  // Obtém os valores das datas e do status
  const dataEntrada = document.getElementById(`data-entrada-${endId}`)?.value;
  const dataAprovacao = document.getElementById(`data-aprovacao-projeto-${endId}`)?.value;

  // Verifica se todas as datas estão preenchidas
  if (!dataEntrada || !dataAprovacao) {
    alert("A data de realização e data prevista devem estar preenchidas.");
    return; // Interrompe a execução se a data não for válida
  }

  // Monta o payload
  const payload = {
    status: "Concluído",
  };

  // Realiza a requisição
  fetch(`${host}/projetos/${endId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      console.log("Resposta da requisição recebida:", response);
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

      // Após finalizar o Projeto, envia o endId para o Agendamento com status "Não iniciado"
      const payloaAcessoObra = {
        statusAgendamento: "Não iniciado",
        status: "Não Iniciado",
      };

      // Envia para Acesso Obra
      return fetch(`${host}/obras/agendamento/${endId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloaAcessoObra),
      });
    })
    .then((response) => {
      if (response.status === 403) {
        throw new Error("Você não tem permissão para realizar esta ação.");
      }
      if (!response.ok) {
        throw new Error(`Erro ao enviar para Acesso Obra: ${response.statusText}`);
      }
      return atualizarEtapa(endId, 6);
    })
    .then((data) => {
      console.log("End ID enviado com sucesso, com status 'Não Iniciado':", data);
      alert("Projeto finalizado, enviada para Acesso Obra e etapa atualizada com sucesso!");

      // Atualiza a tabela na página atual
      const paginacao = document.getElementById("pagination-controls-projeto");
      const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
      preencherTabelaProjetos(paginaAtual - 1);
    })
    .catch((error) => {
      if (error.message === "Você não tem permissão para realizar esta ação.") {
        alert(error.message);
      } else {
        console.error("Erro durante a atualização dos dados:", error);
        alert("Erro ao finalizar o Projeto.");
      }
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
      if (response.status === 403) {
        throw new Error("Você não tem permissão para realizar esta ação.");
      }
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
  document.querySelector("#tabelaHistoricoProjetos tbody").addEventListener("click", (event) => {
    const button = event.target.closest("[data-id-botao]");
    if (!button) return; // Se não clicar em um botão relevante, retorna
  
    const endId = button.getAttribute("data-id-botao");
  
    if (button.classList.contains("iniciar-btn")) {
      // Lógica para o botão "Iniciar"
      exibirConfirmacao("Tem certeza que deseja <b>iniciar</b> essa etapa?", () =>
        confirmAlert("iniciar", endId, "todos-projetos")
      );
    } else if (button.classList.contains("finalizar-btn")) {
      // Lógica para o botão "Finalizar"
      exibirConfirmacao(
        `Tem certeza que deseja concluir o END ID <strong>${endId}</strong>?`,
        () => confirmAlert("finalizar", endId, "todos-projetos")
      );
    }
  });
  
  
  
  // Delegação de evento para ver end ID na tabela
  document.querySelector("#tabelaHistoricoProjetos").addEventListener("click", (event) => {
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
  
  
  // Selecione o link "Kit Tssr"
  const historicoLinkProjeto = document.querySelector("a[href='#todos-projetos']");
  
  
  // Adicione o evento de clique ao link de "Kit Tssr"
  historicoLinkProjeto.addEventListener("click", function (event) {
    preencherTabelaProjetos(); // Função chamada ao clicar no link
  });
  
  
  // Delegação de eventos para os ícones de enviar data
  document.querySelector("#tabelaHistoricoProjetos").addEventListener("click", (event) => {
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
        () => enviarData(endId, dateInput, action, "todos-projetos")
      );
    }
  });
  
  
  // Função para renderizar o input de data com ícone de envio
  function renderInputDateProjetos(action, endId, status) {
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
  


function filtrarTabelaProjeto(page = 0, secao, idTabela) {
  const loadingOverlay = document.getElementById("loading-overlay");
  const tbody = document.querySelector(`#${idTabela} tbody`);
  const secaoId = document.getElementById(secao);

  // Obtém os valores dos campos de pesquisa
  const pesquisaCampos = {
    endId: secaoId.querySelector("#pesquisaEndIdProjeto").value.trim(),
    status: secaoId.querySelector("#pesquisaStatusProjeto").value.trim(),
  };

  // Monta os parâmetros da URL
  const params = montarParametrosProjetos(pesquisaCampos, page);

  // Define o endpoint base
  const endpoint = `${host}/projetos/buscar`;

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
      renderizarTabelaProjetos(dados, idTabela, tbody); // Chama a função adaptada
      renderizarBotoesPaginacao(
        "pagination-controls-projeto",
        filtrarTabelaProjeto,
        dados.pageable.pageNumber,
        dados.totalPages,
        secao, // Argumento extra
        idTabela // Argumento extra
      );
      exibirTotalResultados("total-pesquisa-projeto", dados.totalElements);
    })
    .catch((error) => {
      console.error("Erro ao buscar dados:", error);
      alert("Erro ao carregar os dados. Atualize a tela apertando 'F5'.");
    })
    .finally(() => {
      loadingOverlay.style.display = "none";
    });
}

function montarParametrosProjetos(pesquisaCampos, page) {
  const params = new URLSearchParams();
  if (pesquisaCampos.endId) params.append("endId", pesquisaCampos.endId.toUpperCase());
  if (pesquisaCampos.status) params.append("status", pesquisaCampos.status.toUpperCase());
  params.append("page", page);
  params.append("size", pageSize); // Certifique-se de que a variável `pageSize` está definida corretamente
  return params;
}

function renderizarTabelaProjetos(dados, idTabela, tbody) {
  tbody.innerHTML = ""; // Limpa a tabela antes de preencher

  if (!dados.content || dados.content.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center">Nenhum dado encontrado.</td></tr>`;
    return;
  }

  dados.content.forEach((item, i) => {
    const row = criarLinhaProjeto(item, i); // Chama a função para criar a linha
    tbody.insertAdjacentHTML("beforeend", row);
  });

  configurarEventosCopiar(); // Chama a função para configurar os eventos de copiar
}

function criarLinhaProjeto(item, i) {
  const dataEntrada = item.dataEntrada ? formatarDataParaInput(item.dataEntrada) : "";
  const dataAprovacao = item.dataAprovacao ? formatarDataParaInput(item.dataAprovacao) : "";

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
      </td>
      <td>
        <select disabled class="form-select border-0 bg-light p-2">
          <option value="status">${item.status}</option>
        </select>
      </td>
      <td>
        ${
          dataEntrada
            ? `<input 
                type="date" 
                class="form-control text-center" 
                value="${dataEntrada}" 
                disabled
                id="data-entrada-${item.endId}"
              />`
            : renderInputDateProjetos("data-entrada", item.endId, item.status)
        }
      </td>
      <td>
        ${
          dataAprovacao
            ? `<input 
                type="date" 
                class="form-control text-center" 
                value="${dataAprovacao}" 
                disabled
                id="data-aprovacao-projeto-${item.endId}"
              />`
            : renderInputDateProjetos("data-aprovacao-projeto", item.endId, item.status)
        }
      </td>
      <td>
        <button class="btn btn-primary finalizar-btn" data-id-botao="${item.endId}" 
          ${item.status === "Não iniciado" || item.status === "Concluído" ? "disabled" : ""}>
          Finalizar
        </button>
      </td>
    </tr>`;
}

// Adiciona o End ID diretamente na tabela ou processa de outra forma
function processarEndIdParaProjetos(endId) {
  console.log(`End ID recebido para Projetos: ${endId}`);
  // Lógica adicional para tratar ou exibir o End ID
}

// Atualize a lógica da página conforme necessário
document.addEventListener("DOMContentLoaded", () => {
  // Essa lógica é executada quando a página é carregada
  console.log("Página de Projetos carregada. Aguardando novos End IDs.");
});
