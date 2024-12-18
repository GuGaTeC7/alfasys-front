// Função para realizar o cadastro
function realizarCadastro() {
  // Coleta os valores dos campos
  const endId = document.getElementById("endId").value;
  const siteId = document.getElementById("siteId").value;
  const demanda = document.getElementById("demanda").value;
  const observacoes = document.getElementById("observacoes").value;

  const idDetentora = document.getElementById("idDetentora").value;
  const detentora = document.getElementById("detentora").value;

  const idOperadora = document.getElementById("idOperadora").value;
  const operadora = document.getElementById("operadoraCedente").value;

  const logradouro = document.getElementById("logradouro").value;
  const numero = document.getElementById("numero").value;
  const bairro = document.getElementById("bairro").value;
  const municipio = document.getElementById("municipio").value;
  const estado = document.getElementById("estado").value;
  const cep = document.getElementById("cep").value;

  const latitude = document.getElementById("latitude").value;
  const longitude = document.getElementById("longitude").value;

  // Validação dos campos obrigatórios
  if (
    !endId ||
    !siteId ||
    !demanda ||
    !idDetentora ||
    !detentora ||
    !idOperadora ||
    !operadora ||
    !logradouro ||
    !numero ||
    !bairro ||
    !municipio ||
    !estado ||
    !cep ||
    !latitude ||
    !longitude
  ) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  // Referência ao botão
  const botaoSalvar = document.querySelector('button[onclick="realizarCadastro()"]');
  botaoSalvar.disabled = true; // Desabilita o botão
  botaoSalvar.textContent = "Cadastrando..."; // Altera o texto do botão

  // Estrutura do payload
  const payload = {
    endId: endId,
    siteId: siteId,
    demanda: demanda,
    observacoes: observacoes || null,
    detentora: {
      idDetentora: idDetentora,
      detentora: detentora,
    },
    cedente: {
      idOperadora: idOperadora,
      operadora: operadora,
    },
    endereco: {
      logradouro: logradouro,
      numero: numero,
      bairro: bairro,
      municipio: municipio,
      estado: estado,
      cep: cep,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    },
  };

  // Envia a requisição para o servidor
  fetch(`${host}/cadastroEndIds`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Cadastro realizado com sucesso:", data);
      alert("Cadastro realizado com sucesso!");
      resetarCampos(); // Reseta os campos após o sucesso
      preencherTabela(); // Atualiza a tabela com os novos dados
    })
    .catch((error) => {
      console.error("Erro ao realizar cadastro:", error);
      alert("Erro ao atualizar os dados. Tente novamente.");
    })
    .finally(() => {
      botaoSalvar.disabled = false; // Reabilita o botão
      botaoSalvar.textContent = "Salvar"; // Restaura o texto original do botão
    });
}

// Função para resetar todos os campos
function resetarCampos() {
  // Seleciona todos os inputs dentro do formulário
  const inputs = document.querySelectorAll("#cadastro-fazer input");

  // Itera sobre os inputs e zera seus valores
  inputs.forEach((input) => {
    input.value = "";
  });

  console.log("Todos os campos foram resetados.");
}

// Função para buscar dados e preencher a tabela
function preencherTabela() {
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
      const tbody = document.querySelector("table tbody");
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
    });
}

// Chama a função ao carregar a página
document.addEventListener("DOMContentLoaded", preencherTabela);

// Adiciona o evento ao botão resetar
document.getElementById("botaoResetar").addEventListener("click", resetarCampos);
