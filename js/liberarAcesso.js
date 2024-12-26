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
              <button class="btn btn-link p-0 text-decoration-none end-id" data-id="${item.endId}">
                ${item.endId}
              </button>
            </td>
            <td>
              <select disabled class="form-select border-0 bg-light p-2">
                <option value="status">${item.statusAgendamento}</option>
              </select>
              <button class="btn iniciar-btn p-0 border-0 bg-transparent ml-2">
                <i class="fa-solid fa-circle-play"></i>
              </button>
            </td>
            <td>
              <input 
                type="date" 
                class="form-control ${dataSolicitacao ? 'text-center' : ''}" 
                value="${dataSolicitacao}" 
                ${dataSolicitacao ? "disabled" : ""}
              />
            </td>
            <td>
              <input 
                type="date" 
                class="form-control ${dataPrevisao ? 'text-center' : ''}" 
                value="${dataPrevisao}" 
                ${dataPrevisao ? "disabled" : ""}
              />
            </td>
            <td>
              <input 
                type="date" 
                class="form-control ${dataLiberacao ? 'text-center' : ''}" 
                value="${dataLiberacao}" 
                ${dataLiberacao ? "disabled" : ""}
              />
            </td>
            <td>
              <button class="btn btn-primary finalizar-btn" data-id="${item.endId}">
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
