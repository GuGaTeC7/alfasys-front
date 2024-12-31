// Função para realizar o cadastro
function realizarCadastro() {
  // Coleta os valores dos campos
  const endId = document.getElementById("endId").value;
  const siteId = document.getElementById("siteId").value;
  const demanda = document.getElementById("demanda").value;
  const observacoes = document.getElementById("observacoes").value;
  const localizacao = document.getElementById("localizacao").value;

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
    !longitude ||
    !localizacao
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
    localizacao: localizacao || null,
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

// Atualiza END ID
function atualizaEndId(secao) {
  const secaoId = document.querySelector(`#${secao}`);

  if (!secaoId) {
    console.error(`Seção com ID '${secao}' não encontrada no DOM.`);
    return;
  }

  const endIdInput = secaoId.querySelector(".editarEndId");
  if (!endIdInput) {
    console.error(
      "Elemento .editarEndId não encontrado na seção especificada."
    );
    return;
  }

  const endId = endIdInput.value;
  if (!endId) {
    alert("Por favor, informe o END ID para poder atualizar.");
    return;
  }

  const botaoAtualizar = document.querySelector("#salvarEndIdNovo");
  if (botaoAtualizar) {
    botaoAtualizar.disabled = true;
    botaoAtualizar.textContent = "Alterando...";
  }

  const payload = {
    endId: endId,
    siteId: secaoId.querySelector("#editarSiteId")?.value || "",
    demanda: secaoId.querySelector("#editarDemanda")?.value || "",
    observacoes: secaoId.querySelector("#editarObservacoes")?.value || "",
    linkLocalizacao: secaoId.querySelector("#editarLocalizacao")?.value || "",
    detentora: {
      idDetentora: secaoId.querySelector("#editarIdDetentora")?.value || "",
      detentora: secaoId.querySelector("#editarDetentora")?.value || "",
    },
    cedente: {
      idOperadora: secaoId.querySelector("#editarIdOperadora")?.value || "",
      operadora: secaoId.querySelector("#editarOperadora")?.value || "",
    },
    endereco: {
      logradouro: secaoId.querySelector("#editarLogradouro")?.value || "",
      numero: secaoId.querySelector("#editarNumero")?.value || "",
      bairro: secaoId.querySelector("#editarBairro")?.value || "",
      municipio: secaoId.querySelector("#editarMunicipio")?.value || "",
      estado: secaoId.querySelector("#editarEstado")?.value || "",
      cep: secaoId.querySelector("#editarCep")?.value || "",
      latitude: parseFloat(
        secaoId.querySelector("#editarLatitude")?.value || 0
      ),
      longitude: parseFloat(
        secaoId.querySelector("#editarLongitude")?.value || 0
      ),
    },
  };

  console.log(
    "Payload preparado para envio:",
    JSON.stringify(payload, null, 2)
  );

  fetch(`${host}/cadastroEndIds/${endId}`, {
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
        throw new Error(`Erro ao atualizar os dados: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dados retornados pelo servidor:", data);
      alert("Dados atualizados com sucesso!");
      resetarCampos(secao);
    })
    .catch((error) => {
      console.error("Erro durante a atualização dos dados:", error);
      alert("Erro ao atualizar os dados. Veja os detalhes no console.");
    })
    .finally(() => {
      if (botaoAtualizar) {
        botaoAtualizar.disabled = false;
        botaoAtualizar.textContent = "Salvar";
      }
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

}

function preencherTabela(page = 0) {
  const loadingOverlay = document.getElementById("loading-overlay");
  const tbody = document.querySelector("#tabelaHistorico tbody");

  loadingOverlay.style.display = "block";

  fetch(`${host}/cadastroEndIds?page=${page}&size=${pageSize}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao buscar dados.");
      return response.json();
    })
    .then((dados) => {
      tbody.innerHTML = "";

      dados.content.forEach((item, i) => {
        const dataCadastro = item.dataCadastro
          ? formataData(item.dataCadastro)
          : "Não informado";
        const finalizarId = `finalizar-${i}`;

        const row = `
          <tr>
            <td>${item.endId}</td>
            <td>${item.demanda}</td>
            <td>${item.siteId}</td>
            <td>${item.municipio}</td>
            <td style="text-align: center; vertical-align: middle;">
              <a href="${item.linkLocalizacao || "#"}" target="_blank" style="text-decoration:none; color: #012970;">
                ${
                  item.linkLocalizacao
                    ? '<img width="30" height="auto" src="img/mapa-icon.png" alt="address--v1"/>'
                    : "Não informado"
                }
              </a>
            </td>
            <td>${item.observacoes || ""}</td>
            <td>${dataCadastro}</td>
          </tr>`;

        tbody.insertAdjacentHTML("beforeend", row);
      });

      renderizarBotoesPaginacao("pagination-controls", preencherTabela, dados.pageable.pageNumber, dados.totalPages);
    })
    .catch((error) => {
      console.error("Erro ao buscar dados:", error);
      alert("Erro ao carregar os dados. Atualize a tela apertando 'F5'.");
    })
    .finally(() => {
      loadingOverlay.style.display = "none";
    });
}

// Selecione o link "Histórico de cadastros" e "Editar Cadastro"
const historicoLink = document.querySelector("a[href='#cadastro-feito']");
// Adicione o evento de clique ao link de "Histórico de cadastros"
historicoLink.addEventListener("click", function (event) {
  preencherTabela(); // Função chamada ao clicar no link
});

// Adiciona o evento ao botão resetar
document
  .getElementById("botaoResetar")
  .addEventListener("click", resetarCampos("cadastro-fazer"));
