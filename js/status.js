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
          const dataCadastro = item.dataCadastro
            ? formatarDataParaInput(item.dataCadastro)
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
  
    dados.content.forEach((item, i) => {
      const row = criarLinhaStatus(item, i);
      tbody.insertAdjacentHTML("beforeend", row);
    });
  
    configurarEventosCopiar();
  }
  
  // Função para criar uma linha da tabela de status
  function criarLinhaStatus(item, i) {
    const dataCadastro = item.dataCadastro ? formatarDataParaInput(item.dataCadastro) : "";
  
    return `
      <tr style="${item.situacao === "Pendente" ? "background-color: #ffcc00;" : ""}">
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
      </tr>
    `;
  }


  // Selecione o link "Histórico de agendamentos" e "Editar agendamento"
const historicoLinkStatus = document.querySelector("a[href='#status']");

// Adicione o evento de clique ao link de "Histórico de agendamentos"
historicoLinkStatus.addEventListener("click", function (event) {
  preencherTabelaStatus(); // Função chamada ao clicar no link
});
  