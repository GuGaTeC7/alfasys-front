// Função para coletar os dados e fazer a requisição
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
  
    // Validação dos campos obrigatórios (exceto observações)
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
      return; // Interrompe a execução da função se algum campo obrigatório não foi preenchido
    }
  
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
      body: JSON.stringify(payload), // Envia o payload estruturado
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Cadastro realizado com sucesso:", data);
        alert("Cadastro realizado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao realizar cadastro:", error);
        alert("Erro ao realizar cadastro, tente novamente.");
      });
  }
