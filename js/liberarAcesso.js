document.getElementById("button-buscar-agendamento").addEventListener("click", function (event) {
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


// Função para buscar dados e preencher a tabela
function preencherTabelaAcesso() {
  const loadingOverlay = document.getElementById("loading-overlay"); // Seleciona o overlay
  const tbody = document.querySelector("table tbody");

  // Exibe o overlay
  loadingOverlay.style.display = "block";

  fetch(`${host}/cadastroEndIds`, {
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

      // Preenche a tabela com os dados recebidos
      dados.forEach((item) => {
        const row = `
          <tr>
            <td>${item.endId}</td>
            <td>${item.demanda}</td>
            <td>${item.siteId}</td>
            <td>${item.detentora.detentora}</td>
            <td>${item.detentora.idDetentora}</td>
            <td>${item.cedente.operadora}</td>
            <td>${item.cedente.idOperadora}</td>
            <td>${item.endereco.logradouro}</td>
            <td>${item.endereco.numero}</td>
            <td>${item.endereco.bairro}</td>
            <td>${item.endereco.municipio}</td>
            <td>${item.endereco.estado}</td>
            <td>${item.endereco.cep}</td>
            <td>${item.endereco.latitude}</td>
            <td>${item.endereco.longitude}</td>
            <td>${item.observacoes || "Nenhuma"}</td>
            <td>
              <button
                class="btn btn-primary finalizar-btn"
                data-id="${item.id}"
              >
                Finalizar
              </button>
            </td>
          </tr>`;
        tbody.insertAdjacentHTML("beforeend", row);
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar dados:", error);
      alert("Erro ao carregar os dados. Tente novamente.");
    })
    .finally(() => {
      // Oculta o overlay
      loadingOverlay.style.display = "none";
    });
}