/*

// Adiciona evento ao botão "Buscar Agendamento"
document
  .getElementById("button-buscar-informacoes")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const botaoBuscar = this;

    botaoBuscar.disabled = true;
    botaoBuscar.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Buscando...';

    // Simula o processo de busca com um delay
    setTimeout(() => {
      botaoBuscar.disabled = false;
      botaoBuscar.innerHTML =
        '<i class="fa-solid fa-magnifying-glass"></i>⠀Buscar';
    }, 3000);
  });


function cadastrarInformacoesLigacao() {
    // Coleta os valores dos campos
    const endId = document.getElementById("endIdLigacao").value;
    const statusLigacao = document.getElementById("statusLigacao").value;
    const concessionaria = document.getElementById("concessionaria").value;
    const previsaoLigacao = document.getElementById("previsaoLigacao").value;
    const numeroMedidor = document.getElementById("numeroMedidor").value;
    const numeroInstalacao = document.getElementById("numeroInstalacao").value;
    const numeroFases = document.getElementById("numeroFases").value;
    const leituraInicial = document.getElementById("leituraInicial").value;
    const regional = document.getElementById("regional").value;
    const unidade = document.getElementById("unidade").value;
    const cnpjUc = document.getElementById("cnpjUc").value;
    const tipoTensao = document.getElementById("tipoTensao").value;
  
    // Validação dos campos obrigatórios
    if (
      !endId ||
      !statusLigacao ||
      !concessionaria ||
      !previsaoLigacao ||
      !numeroMedidor ||
      !numeroInstalacao ||
      !numeroFases ||
      !leituraInicial ||
      !regional ||
      !unidade ||
      !cnpjUc
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
  
    // Estrutura do payload
    const payload = {
        informacoesLigacao: {
            statusLigacao,
            concessionaria,
            previsaoLigacao,
            numeroMedidor,
            numeroInstalacao,
            numeroDeFases,
            leituraInicial,
            dataLigacao
      },
      endId,
    };
  
    // Referência ao botão
    const botaoSalvar = document.querySelector('button[onclick="cadastrarInformacoesLigacao()"]');
    botaoSalvar.disabled = true; // Desabilita o botão
    botaoSalvar.textContent = "Salvando..."; // Altera o texto do botão
  
    // Envia a requisição para o servidor
    fetch(`${host}/projetos/${endId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Informações de ligação cadastradas com sucesso:", data);
        alert("Cadastro realizado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao cadastrar informações de ligação:", error);
        alert("Erro ao realizar o cadastro. Tente novamente.");
      })
      .finally(() => {
        botaoSalvar.disabled = false; // Reabilita o botão
        botaoSalvar.textContent = "Salvar"; // Restaura o texto original do botão
      });
  }
  


  function buscaInformacoes(secao) {
    const botaoBuscar = event.target;
    botaoBuscar.disabled = true;
    botaoBuscar.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Buscando...';
  
    const secaoId = document.querySelector(`#${secao}`);
    const endId = secaoId.querySelector("#endIdLigacao").value;
  
    if (!endId) {
      alert("Por favor, informe o END ID.");
      botaoBuscar.disabled = false;
      botaoBuscar.innerHTML =
        '<i class="fa-solid fa-magnifying-glass"></i> Buscar';
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
  
        document.getElementById("concessionaria").value =
          data.informacoesLigacao.concessionaria || "";
        document.getElementById("previsaoLigacao").value =
          data.informacoesLigacao.previsaoLigacao || "";
        document.getElementById("numeroMedidor").value =
          data.informacoesLigacao.numeroMedidor || "";
        document.getElementById("numeroInstalacao").value =
          data.informacoesLigacao.numeroInstalacao || "";
        document.getElementById("numeroFases").value =
          data.informacoesLigacao.numeroDeFases || "";
        document.getElementById("leituraInicial").value =
          data.informacoesLigacao.leituraInicial || "";
        document.getElementById("regional").value =
          data.informacoesLigacao.regional || "";
        document.getElementById("unidade").value =
          data.informacoesLigacao.unidade || "";
        document.getElementById("cnpjUc").value =
          data.informacoesLigacao.cnpjUc || "";
        document.getElementById("tipoTensao").value =
          data.informacoesLigacao.tipoTensao || "";
        document.getElementById("statusLigacao").value =
          data.informacoesLigacao.statusLigacao || "";
  
        botaoBuscar.disabled = false;
        botaoBuscar.innerHTML =
          '<i class="fa-solid fa-magnifying-glass"></i> Buscar';
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert(
          "Não foi possível buscar os dados. Verifique o console para mais detalhes."
        );
        botaoBuscar.disabled = false;
        botaoBuscar.innerHTML =
          '<i class="fa-solid fa-magnifying-glass"></i> Buscar';
      });
  }
  \*/