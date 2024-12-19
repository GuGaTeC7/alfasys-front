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
  const botaoSalvar = document.querySelector(
    'button[onclick="realizarCadastro()"]'
  );
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

document.addEventListener("DOMContentLoaded", () => {
  let globalId = null; // Variável global para armazenar o ID retornado

  // Evento de clique no botão "Buscar"
  document
    .getElementById("button-buscar-endid")
    .addEventListener("click", function (event) {
      event.preventDefault();

      const botaoBuscar = this;
      botaoBuscar.disabled = true;
      botaoBuscar.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Buscando...';

      const endId = document.getElementById("editarEndId").value;

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
            throw new Error(
              "Erro ao buscar dados. Verifique o END ID informado."
            );
          }
          return response.json();
        })
        .then((data) => {
          // Preenchendo os campos com os dados retornados
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

          globalId = data.id; // Armazena o ID globalmente

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
    });

  document
    .querySelector("#salvarEndIdNovo")
    .addEventListener("click", function (event) {
      event.preventDefault();

      const endId = document.getElementById("editarEndId").value;

      if (!endId) {
        alert("Por favor, informe o END ID antes de atualizar.");
        return;
      }

      // Criando o payload com a estrutura correta
      const payload = {
        endId: document.getElementById("editarEndId").value,
        siteId: document.getElementById("editarSiteId").value,
        demanda: document.getElementById("editarDemanda").value,
        observacoes: document.getElementById("editarObservacoes").value,
        detentora: {
          id: 8, // Esse valor parece fixo, ajuste conforme necessário
          idDetentora: document.getElementById("editarIdDetentora").value,
          detentora: document.getElementById("editarDetentora").value,
        },
        cedente: {
          id: 8, // Esse valor também parece fixo
          idOperadora: document.getElementById("editarIdOperadora").value,
          operadora: document.getElementById("editarOperadora").value,
        },
        endereco: {
          id: 8, // Esse valor também parece fixo
          logradouro: document.getElementById("editarLogradouro").value,
          numero: document.getElementById("editarNumero").value,
          bairro: document.getElementById("editarBairro").value,
          municipio: document.getElementById("editarMunicipio").value,
          estado: document.getElementById("editarEstado").value,
          cep: document.getElementById("editarCep").value,
          latitude: parseFloat(document.getElementById("editarLatitude").value),
          longitude: parseFloat(
            document.getElementById("editarLongitude").value
          ),
        },
      };

      // Realizando a requisição PUT
      fetch(`${host}/cadastroEndIds/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro ao atualizar os dados.");
          }
          return response.json();
        })
        .then((data) => {
          alert("Dados atualizados com sucesso!");
          console.log("Resposta do servidor:", data);
        })
        .catch((error) => {
          console.error("Erro:", error);
          alert("Erro: " + error.message); // Exibe a mensagem do erro

          alert(
            "Não foi possível atualizar os dados. Verifique o console para mais detalhes."
          );
        });
    });
});

// Selecione o link "Histórico de cadastros"
const historicoLink = document.querySelector("a[href='#cadastro-feito']");

// Adicione o evento de clique
historicoLink.addEventListener("click", function (event) {
  // Chama a função para preencher a tabela ao clicar no link
  preencherTabela();
});

// Adiciona o evento ao botão resetar
document
  .getElementById("botaoResetar")
  .addEventListener("click", resetarCampos);
