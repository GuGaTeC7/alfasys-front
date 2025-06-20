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
    } else if (etapa === "vistoria") {
      finalizaVistoria(endId);
    }
    else if (etapa === "Kit-Tssr") {
      finalizaKitTssr(endId);
    }
    else if (etapa === "sci-inclusao") {
      finalizaSciInclusao(endId);
    }
    else if (etapa === "obra") {
      finalizaObra(endId);
    }
    else if (etapa === "sci-exclusão") {
      finalizaSciExclusao(endId);
    }
    else if (etapa === "agendamento-obra") {
      finalizaAgendamentoObra(endId);
    }
    else if (etapa === "todos-projetos") {
      finalizaProjeto(endId);
    }

    } else if (action === "iniciar") {
    if (etapa === "agendamento") {
      iniciaAgendamento(endId);
    } else if (etapa === "vistoria") {
      iniciaVistoria(endId);
    }
    else if (etapa === "Kit-Tssr") {
      iniciaTssr(endId);
    }
    else if (etapa === "sci-inclusao") {
      iniciaInclusao(endId);
    }
    else if (etapa === "obra") {
      iniciaObra(endId);
    }
    else if (etapa === "sci-exclusão") {
      iniciaExclusao(endId);
    }
    else if (etapa === "agendamento-obra") {
      iniciaAgendamentoObra(endId);
    }
    else if (etapa === "todos-projetos") {
      iniciaProjeto(endId);
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
  totalPages,
  ...args // Permite passar argumentos extras
) {
  const paginationControls = document.getElementById(idPaginationControls);
  paginationControls.innerHTML = ""; // Limpa botões antigos

  const maxButtons = 5; // Número máximo de botões a serem exibidos
  let startPage = Math.max(0, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxButtons);

  // Ajusta a faixa de exibição se estiver perto do final
  if (endPage - startPage < maxButtons) {
    startPage = Math.max(0, endPage - maxButtons);
  }

  // Ícone de "Voltar 10 páginas"
  if (currentPage > 0) {
    const prevJumpButton = document.createElement("button");
    prevJumpButton.className = "btn btn-sm btn-light mx-1";
    prevJumpButton.textContent = "«";
    
    prevJumpButton.addEventListener("click", () => {
      const prevPage = Math.max(currentPage - 10, 0); // Volta 10 páginas ou para a primeira página
      tabelaFunction(prevPage, ...args);
    });

    paginationControls.appendChild(prevJumpButton);
  }

  // Botões de página dinâmicos (5 botões agora)
  for (let i = startPage; i < endPage; i++) {
    const button = document.createElement("button");
    button.className = `btn btn-sm ${i === currentPage ? "btn-primary" : "btn-light"} mx-1`;
    button.textContent = i + 1;
    button.addEventListener("click", () => tabelaFunction(i, ...args));
    paginationControls.appendChild(button);
  }

  // Ícone de "Pular 10 páginas"
  if (currentPage < totalPages - 1) {
    const nextJumpButton = document.createElement("button");
    nextJumpButton.className = "btn btn-sm btn-light mx-1";
    nextJumpButton.textContent = "»";
    
    nextJumpButton.addEventListener("click", () => {
      const nextPage = Math.min(currentPage + 10, totalPages - 1); // Pula 10 páginas ou vai para última disponível
      tabelaFunction(nextPage, ...args);
    });

    paginationControls.appendChild(nextJumpButton);
  }
}



function filtrarTabela(page = 0, secao, idTabela) {
  const loadingOverlay = document.getElementById("loading-overlay");
  const tbody = document.querySelector(`#${idTabela} tbody`);
  const secaoId = document.getElementById(secao);

  // Obtém os valores dos campos de pesquisa
  const pesquisaCampos = {
    endId: secaoId.querySelector("#pesquisaEndId").value.trim(),
    [secao === "todos-agendamentos" ? "statusAgendamento" : "siteId"]: secaoId
      .querySelector(
        `${
          secao === "todos-agendamentos"
            ? "#pesquisaStatusAgendamento"
            : "#pesquisaSiteId"
        }`
      )
      .value.trim(),
    municipio: secaoId.querySelector("#pesquisaMunicipio").value.trim(),
  };

  // Monta os parâmetros da URL
  const params = montarParametros(pesquisaCampos, page);

  // Define a URL com base no ID da tabela
  const endpoint =
    idTabela === "tabelaHistoricoAgendamento"
      ? `${host}/cadastroEndIds/buscar-agendamento`
      : `${host}/cadastroEndIds/buscar-endid`;

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
      renderizarTabela(dados, idTabela, tbody);
      renderizarBotoesPaginacao(
        idTabela === "tabelaHistoricoAgendamento"
          ? "pagination-controls-agendamento"
          : "pagination-controls",
        idTabela === "tabelaHistoricoAgendamento"
          ? preencherTabelaAcesso
          : preencherTabela,
        dados.pageable.pageNumber,
        dados.totalPages
      );
      exibirTotalResultados(
        `${
          idTabela === "tabelaHistoricoAgendamento"
            ? "total-pesquisa-agendamento"
            : "total-pesquisa"
        }`,
        dados.totalElements
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



function exibirTotalResultados(elementoId, total) {
  const totalPesquisaElement = document.getElementById(`${elementoId}`);

  // Limpa o conteúdo anterior
  totalPesquisaElement.innerHTML = "";

  // Cria o elemento <p>
  const p = document.createElement("p");
  p.textContent = `Total de registros encontrados: ${total}`;

  totalPesquisaElement.appendChild(p);
}

function montarParametros(pesquisaCampos, page) {
  const params = new URLSearchParams();
  if (pesquisaCampos.endId)
    params.append("endId", pesquisaCampos.endId.toUpperCase());
  if (pesquisaCampos.siteId)
    params.append("siteId", pesquisaCampos.siteId.toUpperCase());
  if (pesquisaCampos.municipio)
    params.append("municipio", pesquisaCampos.municipio.toUpperCase());
  if (pesquisaCampos.statusAgendamento)
    params.append("status", pesquisaCampos.statusAgendamento.toUpperCase());
  params.append("page", page);
  params.append("size", pageSize);
  return params;
}

function renderizarTabela(dados, idTabela, tbody) {
  tbody.innerHTML = ""; // Limpa a tabela antes de preencher

  if (!dados.content || dados.content.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center">Nenhum dado encontrado.</td></tr>`;
    return;
  }

  dados.content.forEach((item, i) => {
    const row =
      idTabela === "tabelaHistoricoAgendamento"
        ? criarLinhaHistoricoAgendamento(item, i)
        : criarLinhaCadastroEndId(item, i);

    tbody.insertAdjacentHTML("beforeend", row);
  });

  configurarEventosCopiar();
}

function criarLinhaHistoricoAgendamento(item, i) {
  const dataSolicitacao = item.dataSolicitacao
    ? formatarDataParaInput(item.dataSolicitacao)
    : "";
  const dataPrevisao = item.dataPrevisao
    ? formatarDataParaInput(item.dataPrevisao)
    : "";
  const dataLiberacao = item.dataLiberacao
    ? formatarDataParaInput(item.dataLiberacao)
    : "";

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
      <td>${renderInputDate(
        "data-solicitacao",
        item.endId,
        item.statusAgendamento,
        dataSolicitacao
      )}</td>
      <td>${renderInputDate(
        "data-previsao",
        item.endId,
        item.statusAgendamento,
        dataPrevisao
      )}</td>
      <td>${renderInputDate(
        "data-liberacao",
        item.endId,
        item.statusAgendamento,
        dataLiberacao
      )}</td>
      <td>
        <button class="btn btn-primary finalizar-btn" data-id-botao="${
          item.endId
        }" 
          ${
            item.statusAgendamento === "Não iniciado" ||
            item.statusAgendamento === "Concluído"
              ? "disabled"
              : ""
          }>
          Finalizar
        </button>
      </td>
      <td style="text-align: center;">
        <i class="fa-solid fa-comments" style="font-size: 1.7rem; color: ${
          item.reset ? "#007bff" : "rgba(0, 123, 255, 0.46)"
        };" 
          ${
            item.observacoes
              ? `onclick="alert('${item.observacoes}');"`
              : 'style="cursor: none !important;"'
          }>
        </i>
      </td>
    </tr>
  `;
}

function criarLinhaCadastroEndId(item, i) {
  const dataCadastro = item.dataCadastro
    ? formataData(item.dataCadastro)
    : "Não informado";
  const finalizarId = `finalizar-${i}`;

  return `
    <tr>
      <td>${item.endId}</td>
      <td>${item.demanda}</td>
      <td>${item.siteId}</td>
      <td>${item.municipio}</td>
      <td style="text-align: center; vertical-align: middle;">
        <a href="${item.linkLocalizacao || ""}" target="_blank">
          ${
            item.linkLocalizacao
              ? '<img width="30" height="auto" src="img/mapa-icon.png" alt="address--v1"/>'
              : "Não disponível"
          }
        </a>
      </td>
      <td>${item.observacoes || ""}</td>
      <td>${dataCadastro}</td>
    </tr>
  `;
}

// function renderInputDate(nome, endId, statusAgendamento, dataValor = "") {
//   return dataValor
//     ? `<input type="date" class="form-control text-center" value="${dataValor}" disabled id="${nome}-${endId}" />`
//     : `<input type="date" class="form-control text-center" id="${nome}-${endId}" ${
//         statusAgendamento === "Em andamento" ? "disabled" : ""
//       } />`;
// }

function configurarEventosCopiar() {
  document.querySelectorAll(".btnCopiar").forEach((button) => {
    button.addEventListener("click", function () {
      const endId = this.getAttribute("data-id");
      const textoParaCopiarPuro = document
        .querySelector(`button[data-id="${endId}"]`)
        .textContent.trim();

      navigator.clipboard
        .writeText(textoParaCopiarPuro)
        .catch((err) => console.error("Erro ao tentar copiar o texto: ", err));
    });
  });
}

function enviarData(endId, dateInput, action, etapa) {
  console.log(`Data enviada: ${dateInput} (End ID: ${endId}, Ação: ${action})`);

  // Verifica se a data está em formato válido
  const dataValida = !isNaN(new Date(dateInput).getTime());
  if (!dataValida) {
    alert("Formato de data inválido.");
    return;
  }

  // Mapeamento dinâmico de ações para endpoints
  const endpointMap = {
    "data-solicitacao": {
      payloadKey: "dataSolicitacao",
      url: `${host}/cadastroEndIds/agendamento-parcial/${endId}`,
    },
    "data-previsao": {
      payloadKey: "dataPrevisao",
      url: `${host}/cadastroEndIds/agendamento-parcial/${endId}`,
    },
    "data-liberacao": {
      payloadKey: "dataLiberacao",
      url: `${host}/cadastroEndIds/agendamento-parcial/${endId}`,
    },
    "data-realizacao": {
      payloadKey: "dataRealizacao",
      url: `${host}/vistorias/${endId}`,
    },
    "data-prevista": {
      payloadKey: "dataPrevista",
      url: `${host}/tssrs/${endId}`,
    },
    "data-realizada": {
      payloadKey: "dataRealizacao",
      url: `${host}/tssrs/${endId}`,
    },
    "data-envio-inclusao": {
      payloadKey: "dataEnvio",
      url: `${host}/sciInclusao/${endId}`,
    },
    "data-aprovacao-inclusao": {
      payloadKey: "dataAprovacao",
      url: `${host}/sciInclusao/${endId}`,
    },
    "inicio-previsto": {
      payloadKey: "dataInicio",
      url: `${host}/obras/${endId}`,
    },
    "data-final": {
      payloadKey: "dataFinalizacao",
      url: `${host}/obras/${endId}`,
    },
    "data-envio": {
      payloadKey: "dataEnvio",
      url: `${host}/sciExclusao/${endId}`,
    },
    "data-aprovacao": {
      payloadKey: "dataAprovacao",
      url: `${host}/sciExclusao/${endId}`,
    },
    "ultima-cobranca": {
      payloadKey: "ultimaCobranca",
      url: `${host}/sciExclusao/${endId}`,
    },
    "data-solicitacao-obra": {
      payloadKey: "dataSolicitacao",
      url: `${host}/obras/agendamento/${endId}`,
    },
    "data-previsao-obra": {
      payloadKey: "dataPrevisao",
      url: `${host}/obras/agendamento/${endId}`,
    },
    "data-liberacao-obra": {
      payloadKey: "dataLiberacao",
      url: `${host}/obras/agendamento/${endId}`,
    },
    "data-entrada": {
      payloadKey: "dataEntrada",
      url: `${host}/projetos/${endId}`,
    },
    "data-aprovacao-projeto": {
      payloadKey: "dataAprovacao",
      url: `${host}/projetos/${endId}`,
    },
  };

  // Valida se a ação está mapeada
  const endpointConfig = endpointMap[action];
  if (!endpointConfig) {
    console.error("Ação inválida ou não mapeada.");
    alert("Ação inválida. Verifique o código.");
    return;
  }

  // Cria o payload dinamicamente
  const payload = endpointConfig.payloadKey
    ? { [endpointConfig.payloadKey]: dateInput }
    : null;

  // Realiza o fetch para o endpoint correto
  fetch(endpointConfig.url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: payload ? JSON.stringify(payload) : null,
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 403) {
          alert("Você não tem permissão para realizar esta ação.");
          throw new Error("Permissão negada (403).");
        }
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
      // Atualiza diretamente o valor do input correspondente
      const inputField = document.getElementById(`data-${action}-${endId}`);
      if (inputField) {
        inputField.value = dateInput;
        inputField.setAttribute("disabled", "true"); // Desativa o campo após envio
      }

      // Oculta o botão correspondente
      const button = document.querySelector(
        `i[data-action="${action}"][data-id="${endId}"]`
      );
      if (button) {
        button.style.display = "none";
      } else {
        console.warn("Botão não encontrado! Mas a operação continua.");
      }

      alert("Data enviada com sucesso!");
      console.log("Resposta do servidor:", dados);

      // 👉 HABILITA O SELECT DO PARECER
      if (etapa === "vistoria" && action === "data-realizacao") {
        const selectParecer = document.getElementById(`select-parecer-${endId}`);
        if (selectParecer) {
          selectParecer.removeAttribute("disabled");
        }
      }

      if (etapa === "kit-tssr") {
        // Pega os valores dos dois campos de data
        const dataPrevista = document.getElementById(`data-prevista-${endId}`)?.value;
        const dataRealizada = document.getElementById(`data-realizada-${endId}`)?.value;

        // Verifica se ambos estão preenchidos
        if (dataPrevista && dataRealizada) {
          const selectParecer = document.getElementById(`select-parecer-${endId}`);
          if (selectParecer) {
            selectParecer.removeAttribute("disabled");
          }
        }
      }

      
      // Atualiza a tabela correspondente à etapa
      if (etapa === "obra") {
        const paginacao = document.getElementById("pagination-controls-obra");
        const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
        preencherTabelaObra(paginaAtual - 1); // Atualiza a tabela de obras
      } else if (etapa === "vistoria") {
        const paginacao = document.getElementById("pagination-controls-vistoria");
        const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
        preencherTabelaVistoria(paginaAtual - 1); // Atualiza a tabela de vistorias
      } else if (etapa === "kit-tssr") {
        const paginacao = document.getElementById("pagination-controls-Tssr");
        const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
        preencherTabelaKitTssr(paginaAtual - 1); // Atualiza a tabela de Kit TSSR
      } else if (etapa === "cadastro-feito") {
        const paginacao = document.getElementById("pagination-controls");
        const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
        preencherTabela(paginaAtual - 1); // Atualiza a tabela geral
      } else if (etapa === "sci-exclusão") {
        const paginacao = document.getElementById("pagination-controls-exclusao");
        const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
        preencherTabelaSciExclusao(paginaAtual - 1); // Atualiza a tabela de SCI Exclusão
      } else if (etapa === "sci-inclusao") {
        const paginacao = document.getElementById("pagination-controls-inclusao");
        const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
        preencherTabelaSciInclusao(paginaAtual - 1); // Atualiza a tabela de SCI Inclusão
      } else if (etapa === "projetos") {
        const paginacao = document.getElementById("pagination-controls-projeto");
        const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
        preencherTabelaProjetos(paginaAtual - 1); // Atualiza a tabela de projetos
      } else if (etapa === "agendamento") {
        const paginacao = document.getElementById("pagination-controls-agendamento");
        const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
        preencherTabelaAcesso(paginaAtual - 1); // Atualiza a tabela de acesso
      } else if (etapa === "agendamento-obra") {
        const paginacao = document.getElementById("pagination-controls-agendamento-obra");
        const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
        preencherTabelaAcessoObra(paginaAtual - 1); // Atualiza a tabela de acesso 
      } else if (etapa === "todos-projetos") {
        const paginacao = document.getElementById("pagination-controls-projeto");
        const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
        preencherTabelaProjetos(paginaAtual - 1); // Atualiza a tabela de acesso 
      } else {
        console.warn(`Nenhuma ação definida para a etapa: ${etapa}`);
      }
    })
    .catch((error) => {
      console.error("Erro ao enviar a data:", error);
      if (error.message !== "Permissão negada (403).") {
        alert(`Erro ao enviar a data: ${error.message}`);
      }
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
      console.log(data);
      document.getElementById("editarSiteIdAcesso").value = data.siteId || "";
      document.getElementById("editarDemandaAcesso").value = data.demanda || "";
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
      document.getElementById("editarCepAcesso").value =
        data.endereco.cep || "";
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



function enviarParecer(endId, parecerSelecionado, etapa) {
  console.log(
    `Parecer enviado: ${parecerSelecionado} (End ID: ${endId}, Etapa: ${etapa})`
  );

  if (!parecerSelecionado) {
    alert("Por favor, selecione um parecer válido.");
    return;
  }

  const endpointMap = {
    "vistoria": {
      payloadKey: "parecer",
      url: `${host}/vistorias/${endId}`,
    },
    "kit-tssr": {
      payloadKey: "parecer",
      url: `${host}/tssrs/${endId}`,
    },
  };

  const endpointConfig = endpointMap[etapa];
  if (!endpointConfig) {
    console.error("Etapa inválida ou não mapeada.");
    alert("Etapa inválida. Verifique o código.");
    return;
  }

  const payload = { [endpointConfig.payloadKey]: parecerSelecionado };

  fetch(endpointConfig.url, {
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
          if (response.status === 403) {
            throw new Error("Você não tem permissão para realizar esta ação.");
          }
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
      const selectField = document.getElementById(`select-parecer-${endId}`);
      if (selectField) {
        selectField.value = parecerSelecionado;
        selectField.setAttribute("disabled", "true");
      }

      const button = document.querySelector(
        `button[data-id-botao="${endId}"]`
      );
      if (button) {
        button.style.display = "none";
      }

      alert("Parecer enviado com sucesso!");
      console.log("Resposta do servidor:", dados);

      if (etapa === "vistoria") {
        const paginacao = document.getElementById(
          "pagination-controls-vistoria"
        );
        const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
        preencherTabelaVistoria(paginaAtual - 1);
      } else if (etapa === "kit-tssr") {
        const paginacao = document.getElementById(
          "pagination-controls-Tssr"
        );
        const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
        preencherTabelaKitTssr(paginaAtual - 1);
      } else {
        console.warn(`Nenhuma ação definida para a etapa: ${etapa}`);
      }
    })
    .catch((erro) => {
      console.error("Erro ao enviar parecer:", erro);
      alert(erro.message); // Mensagem específica exibida para o usuário
    });
}



function enviarWorkflow(endId, cadastroWorkflowSelecionado, etapa) {
  console.log(
    `Cadastro Workflow enviado: ${cadastroWorkflowSelecionado} (End ID: ${endId}, Etapa: ${etapa})`
  );

  if (!cadastroWorkflowSelecionado) {
    alert("Por favor, selecione um cadastro workflow válido.");
    return;
  }

  // Mapeamento dinâmico de etapas para endpoints
  const endpointMap = {
    "sci-exclusão": {
      payloadKey: "cadastroWorkflow",
      url: `${host}/sciExclusao/${endId}`,
    },
    // Outros tipos de etapa podem ser adicionados aqui
  };

  // Valida se a etapa está mapeada
  const endpointConfig = endpointMap[etapa];
  if (!endpointConfig) {
    console.error("Etapa inválida ou não mapeada.");
    alert("Etapa inválida. Verifique o código.");
    return;
  }

  // Cria o payload dinamicamente
  const payload = { [endpointConfig.payloadKey]: cadastroWorkflowSelecionado };

  // Realiza o fetch para o endpoint correto
  fetch(endpointConfig.url, {
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
          if (response.status === 403) {
            throw new Error("Você não tem permissão para realizar esta ação.");
          }
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
      // Atualiza o campo correspondente
      const selectField = document.getElementById(`select-workflow-${endId}`);
      if (selectField) {
        selectField.value = cadastroWorkflowSelecionado;
        selectField.setAttribute("disabled", "true"); // Desativa o campo após envio
      }

      // Oculta ou desativa os botões relacionados (se necessário)
      const button = document.querySelector(
        `button[data-id-botao="${endId}"]`
      );
      if (button) {
        button.style.display = "none";
      }

      alert("Cadastro Workflow enviado com sucesso!");
      console.log("Resposta do servidor:", dados);

      // Atualiza a tabela correspondente à etapa
      if (etapa === "sci-exclusão") {
        const paginacao = document.getElementById("pagination-controls-exclusao");
        const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
        preencherTabelaSciExclusao();
      } else {
        console.warn(`Nenhuma ação definida para a etapa: ${etapa}`);
      }
    })
    .catch((erro) => {
      console.error("Erro ao enviar Cadastro Workflow:", erro);
      if (erro.message === "Você não tem permissão para realizar esta ação.") {
        alert(erro.message);
      } else {
        alert(`Erro ao enviar Cadastro Workflow: ${erro.message}`);
      }
    });
}




function enviarCodigoSCI(endId, codigo, etapa) {
  console.log(`Código enviado: ${codigo} (End ID: ${endId}, etapa: ${etapa})`);

  if (!codigo) {
    alert("Por favor, forneça um código válido.");
    return;
  }

  // Mapeamento dinâmico de etapas para endpoints e chaves de payload
  const endpointMap = {
    "sci-exclusão": {
      payloadKey: "codExclusao",
      url: `${host}/sciExclusao/${endId}`,
    },
    "sci-inclusao": {
      payloadKey: "codInclusao",
      url: `${host}/sciInclusao/${endId}`,
    },
  };

  // Valida se o etapa está mapeado
  const endpointConfig = endpointMap[etapa];
  if (!endpointConfig) {
    console.error("etapa inválido ou não mapeado.");
    alert("etapa inválido. Verifique o código.");
    return;
  }

  // Cria o payload dinamicamente
  const payload = { [endpointConfig.payloadKey]: codigo };

  // Realiza o fetch para o endpoint correto
  fetch(endpointConfig.url, {
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
          if (response.status === 403) {
            throw new Error("Você não tem permissão para realizar esta ação.");
          }
          throw new Error(
            `${response.status} - ${response.statusText}: ${err.message || "Erro desconhecido"}`
          );
        });
      }
      return response.json();
    })
    .then((dados) => {
      // Atualiza o campo correspondente
      const inputField = document.getElementById(`${endpointConfig.payloadKey}-${endId}`);
      if (inputField) {
        inputField.setAttribute("disabled", "true"); // Desativa o campo após envio
      }

      // Oculta ou desativa os botões relacionados
      const button = document.querySelector(
        `i.btnEnviarCodInclusao[data-id="${endId}"], i.btnEnviarCodExclusao[data-id="${endId}"]`
      );
      if (button) {
        button.style.display = "none";
      }

      alert(`Código de ${etapa === "sci-exclusao" ? "exclusão" : "inclusão"} enviado com sucesso!`);
      console.log("Resposta do servidor:", dados);

      // Atualiza elementos específicos do etapa
      if (etapa === "sci-exclusao") {
        const paginacao = document.getElementById("pagination-controls-exclusao");
        const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
        preencherTabelaSciExclusao(paginaAtual - 1); // Atualiza a tabela de SCI Exclusão
      } else if (etapa === "sci-inclusao") {
        const paginacao = document.getElementById("pagination-controls-inclusao");
        const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
        preencherTabelaSciInclusao(paginaAtual - 1); // Atualiza a tabela de SCI Inclusão
      } else {
        console.warn(`Nenhuma ação definida para o etapa: ${etapa}`);
      }
    })
    .catch((erro) => {
      console.error(`Erro ao enviar código de ${etapa === "sci-exclusao" ? "exclusão" : "inclusão"}:`, erro);
      if (erro.message === "Você não tem permissão para realizar esta ação.") {
        alert(erro.message);
      } else {
        alert(`Erro ao enviar o código de ${etapa === "sci-exclusao" ? "exclusão" : "inclusão"}. Tente novamente.`);
      }
    });
}

