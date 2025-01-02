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

        // Monta a linha da tabela
        const row = `
            <tr>
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
                  dataRealizacao
                    ? `<input 
                        type="date" 
                        class="form-control text-center" 
                        value="${dataRealizacao}" 
                        disabled
                        id="data-realizacao-${item.endId}"
                      />`
                    : renderInputDate(
                        "data-readata-realizacao",
                        item.endId,
                        item.status
                      )
                }
              </td>
              <td>
                <select class="form-select border-0 bg-light p-2" id="select-status-${
                item.endId
                        }" ${
                item.status === "Não iniciado" || item.status === "Concluído"
                    ? "disabled"
                    : ""
                }>
                    <option value="" selected>
                    Selecione uma opção
                    </option>
                    <option value="viavel">Viável</option>
                    <option value="inviavel">Inviável</option>
                </select>
              </td>
              <td>
                <button class="btn btn-primary finalizar-btn" data-id-botao="${item.endId}" ${
                  item.status === "Não iniciado" || item.status === "Concluído"
                    ? "disabled"
                    : ""
                }>
                  Finalizar
                </button>
                <i 
                  class="fa-solid fa-rotate-left btnResetar" 
                  title="Resetar End ID" 
                  data-id="${item.endId}" 
                  style="cursor: pointer; margin-left: 8px;"></i>
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

      renderizarBotoesPaginacao(
        "pagination-controls-vistoria",
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
      if (!response.ok) {
        throw new Error(`Erro ao atualizar os dados: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dados retornados pelo servidor:", data);
      const botaoIniciar = document.querySelector(`[data-id-botao="${endId}"]`);
      botaoIniciar.style.display = "none";
      const paginacao = document.getElementById("pagination-controls-vistoria");
      const paginaAtual = paginacao.querySelector(".btn-primary").textContent;

      preencherTabelaVistoria(paginaAtual - 1);
    })
    .catch((error) => {
      console.error("Erro durante a atualização dos dados:", error);
      alert("Erro ao iniciar.");
    });
}

// function finalizaVistoria(endId) {
//   // Obtém os valores das datas
//   const dataRealizacao = document.getElementById(
//     `data-realizacao-${endId}`
//   )?.value;

//   const selectStatus = document.getElementById(
//     `select-status-${endId}`
//   )?.value;

//   // Verifica se todas as datas estão preenchidas
//   if (!dataRealizacao || selectStatus) {
//     alert(
//       "Todas as datas (Solicitação, Previsão e Liberação) devem estar preenchidas."
//     );
//     return; // Interrompe a execução se as datas não forem válidas
//   }

//   // Monta o payload
//   const payload = {
//     status: "Concluído",
//   };

//   // Realiza a requisição
//   fetch(`${host}/cadastroEndIds/agendamento-parcial/${endId}`, {
//     method: "PATCH",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   })
//     .then((response) => {
//       console.log("Resposta da requisição recebida:", response);
//       if (!response.ok) {
//         throw new Error(`Erro ao atualizar os dados: ${response.statusText}`);
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log("Dados retornados pelo servidor:", data);

//       // Atualiza a tabela na página atual
//       const paginacao = document.getElementById(
//         "pagination-controls-agendamento"
//       );
//       const paginaAtual = paginacao.querySelector(".btn-primary").textContent;
//       preencherTabelaAcesso(paginaAtual - 1);
//     })
//     .catch((error) => {
//       console.error("Erro durante a atualização dos dados:", error);
//       alert("Erro ao iniciar.");
//     });
// }

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



