function preencherTabelaStatus(page = 0) {
  const loadingOverlay = document.getElementById("loading-overlay");
  const tbody = document.querySelector("#tabelaStatus tbody");
  const totalPesquisado = document.getElementById("total-pesquisa-status");

  loadingOverlay.style.display = "block";

  fetch(`${host}/cadastroEndIds/etapas?page=${page}&size=${pageSize}`, {
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
              <td>${item.etapa}</td>
              <td>${item.status}</td>
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
        "pagination-controls-status",
        preencherTabelaStatus,
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

// Função para filtrar a tabela de status
function filtrarTabelaStatus(page = 0, secao, idTabela) {
  const loadingOverlay = document.getElementById("loading-overlay");
  const tbody = document.querySelector(`#${idTabela} tbody`);
  const secaoId = document.getElementById(secao);

  // Obtém os valores dos campos de pesquisa
  const pesquisaCampos = {
    endId: secaoId.querySelector("#pesquisaEndIdStatus").value.trim(),
    etapa: secaoId.querySelector("#pesquisaEtapaStatus").value.trim(),
    status: secaoId.querySelector("#pesquisaSituacaoStatus").value.trim(),
  };

  // Monta os parâmetros da URL
  const params = montarParametrosStatus(pesquisaCampos, page);

  // Define o endpoint base
  const endpoint = `${host}/cadastroEndIds/buscar-etapas`;

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
      renderizarTabelaStatus(dados, idTabela, tbody); // Chama a função adaptada
      renderizarBotoesPaginacao(
        "pagination-controls-status",
        filtrarTabelaStatus,
        dados.pageable.pageNumber,
        dados.totalPages,
        secao, // Argumento extra
        idTabela // Argumento extra
      );
      exibirTotalResultados("total-pesquisa-status", dados.totalElements);
    })
    .catch((error) => {
      console.error("Erro ao buscar dados:", error);
      alert("Erro ao carregar os dados. Atualize a tela apertando 'F5'.");
    })
    .finally(() => {
      loadingOverlay.style.display = "none";
    });
}

// Função para montar os parâmetros de busca
function montarParametrosStatus(pesquisaCampos, page) {
  const params = new URLSearchParams();
  if (pesquisaCampos.endId)
    params.append("endId", pesquisaCampos.endId.toUpperCase());
  if (pesquisaCampos.etapa)
    params.append("etapa", pesquisaCampos.etapa.toUpperCase());
  if (pesquisaCampos.status)
    params.append("status", pesquisaCampos.status.toUpperCase());
  params.append("page", page);
  params.append("size", pageSize);
  return params;
}

// Função para renderizar a tabela de status
function renderizarTabelaStatus(dados, idTabela, tbody) {
  tbody.innerHTML = ""; // Limpa a tabela antes de preencher

  if (!dados.content || dados.content.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center">Nenhum dado encontrado.</td></tr>`;
    return;
  }

  console.log(dados)

  dados.content.forEach((item, i) => {
    const row = criarLinhaStatus(item, i);
    tbody.insertAdjacentHTML("beforeend", row);
  });

  configurarEventosCopiar();
}

// Função para criar uma linha da tabela de status
function criarLinhaStatus(item, i) {
  const dataCadastro = item.dataCadastro
    ? formatarDataParaInput(item.dataCadastro)
    : "";

  return `
      <tr style="${
        item.situacao === "Pendente" ? "background-color: #ffcc00;" : ""
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
        <td>${item.etapa}</td>
        <td>${item.status}</td>
      </tr>
    `;
}

// Selecione o link "Histórico de agendamentos" e "Editar agendamento"
const historicoLinkStatus = document.querySelector("a[href='#status']");

// Adicione o evento de clique ao link de "Histórico de agendamentos"
historicoLinkStatus.addEventListener("click", function (event) {
  preencherTabelaStatus(); // Função chamada ao clicar no link
});

// Função para mostrar mais do end ID
document.querySelector("#tabelaStatus").addEventListener("click", (event) => {
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
