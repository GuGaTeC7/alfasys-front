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
      resetarCampos("cadastro-fazer"); // Reseta os campos após o sucesso
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

function preencherTabela() {
  const loadingOverlay = document.getElementById("loading-overlay");
  const tbody = document.querySelector("table tbody");

  loadingOverlay.style.display = "block";

  fetch(`${host}/cadastroEndIds`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao buscar dados.");
      return response.json();
    })
    .then((dados) => {
      tbody.innerHTML = "";

      const formataData = (data) => {
        if (!Array.isArray(data) || data.length !== 3) return "Data inválida";
        const [ano, mes, dia] = data;
        return `${String(dia).padStart(2, "0")}/${String(mes).padStart(
          2,
          "0"
        )}/${ano}`;
      };

      dados.forEach((item, i) => {
        const dataCadastro = item.dataCadastro
          ? formataData(item.dataCadastro)
          : "Não informado";
        const finalizarId = `finalizar-${i}`;

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
            <td>${item.observacoes || ""}</td>
            <td>${dataCadastro}</td>
            <td>
              <button class="btn btn-primary finalizar-btn" data-id="${
                item.endId
              }" id="${finalizarId}">
                Finalizar
              </button>
            </td>
          </tr>`;

        tbody.insertAdjacentHTML("beforeend", row);

        const button = document.getElementById(finalizarId);
        button.addEventListener("click", (event) => {
          const endId = event.target.getAttribute("data-id");
          const alertDiv = document.createElement("div");
          alertDiv.className = "custom-alert";
          alertDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 300px; padding: 15px; background-color: rgba(1, 41, 112, 0.9);
            color: #ffffff; border-radius: 5px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 1000; text-align: center;
          `;
          alertDiv.innerHTML = `
            <strong>Tem certeza que deseja finalizar o END ID ${endId}?</strong><br>
            <button class="btn btn-light mt-2" onclick="dismissAlert()">Cancelar</button>
            <button class="btn btn-warning text-white mt-2" onclick="confirmFinalizar('${endId}')">Confirmar</button>
          `;
          document.body.appendChild(alertDiv);
        });
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar dados:", error);
      alert("Erro ao carregar os dados. Atualize a tela.");
    })
    .finally(() => {
      loadingOverlay.style.display = "none";
    });
}

let globalId = null;

function buscaEnId() {
  const botaoBuscar = event.target;
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

      globalId = data.id;
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

function atualizaEndId() {
  const endId = document.getElementById("editarEndId").value;

  console.log("Iniciando atualização do END ID...");
  console.log("Global ID capturado:", globalId);

  if (!endId) {
    alert("Por favor, informe o END ID antes de atualizar.");
    console.warn("Tentativa de atualização sem informar o END ID.");
    return;
  }

  // Referência ao botão
  const botaoAtualizar = document.querySelector(
    'button[onclick="atualizaEndId()"]'
  );
  botaoAtualizar.disabled = true; // Desabilita o botão
  botaoAtualizar.textContent = "Alterando..."; // Altera o texto do botão

  const payload = {
    endId: document.getElementById("editarEndId").value,
    siteId: document.getElementById("editarSiteId").value,
    demanda: document.getElementById("editarDemanda").value,
    observacoes: document.getElementById("editarObservacoes").value,
    detentora: {
      idDetentora: document.getElementById("editarIdDetentora").value,
      detentora: document.getElementById("editarDetentora").value,
    },
    cedente: {
      idOperadora: document.getElementById("editarIdOperadora").value,
      operadora: document.getElementById("editarOperadora").value,
    },
    endereco: {
      logradouro: document.getElementById("editarLogradouro").value,
      numero: document.getElementById("editarNumero").value,
      bairro: document.getElementById("editarBairro").value,
      municipio: document.getElementById("editarMunicipio").value,
      estado: document.getElementById("editarEstado").value,
      cep: document.getElementById("editarCep").value,
      latitude: parseFloat(document.getElementById("editarLatitude").value),
      longitude: parseFloat(document.getElementById("editarLongitude").value),
    },
  };

  console.log(
    "Payload preparado para envio:",
    JSON.stringify(payload, null, 2)
  );

  fetch(`${host}/cadastroEndIds/SPLUE_0001`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      console.log("Resposta da requisição recebida:", response);
      if (!response.ok) {
        console.error(
          "Erro na resposta do servidor:",
          response.status,
          response.statusText
        );
        throw new Error(`Erro ao atualizar os dados: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dados retornados pelo servidor:", data);
      alert("Dados atualizados com sucesso!");
      resetarCampos("cadastro-editar");
    })
    .catch((error) => {
      console.error("Erro durante a atualização dos dados:", error);
      alert("Erro ao atualizar os dados. Detalhes no console.");
    })
    .finally(() => {
      botaoAtualizar.disabled = false; // Reabilita o botão
      botaoAtualizar.textContent = "Salvar"; // Restaura o texto original do botão
    });
}

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
