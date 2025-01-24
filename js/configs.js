function realizarCadastroUsuario() {
    // Coleta os valores dos campos
    const nome = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;
    const telefone = document.getElementById("phone").value;
    const cargo = document.getElementById("cargo").value;

    // Validação dos campos obrigatórios
    if (!nome || !email || !senha || !telefone || !cargo) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Referência ao botão
    const botaoSalvar = document.querySelector('button[onclick="realizarCadastroUsuario()"]');
    botaoSalvar.disabled = true; // Desabilita o botão
    botaoSalvar.textContent = "Cadastrando..."; // Altera o texto do botão

    // Estrutura do payload
    const payload = {
      nome: nome,
      email: email,
      senha: senha,
      telefone: telefone,
      cargo: {id: parseInt(cargo)},
      operadoras: [{ id: 1 }, { id: 2 }],
    };

    // Envia a requisição para o servidor
    fetch(`${host}/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Falha ao cadastrar usuário.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Usuário cadastrado com sucesso:", data);
        alert("Usuário cadastrado com sucesso!")
      })
      .catch((error) => {
        console.error("Erro ao realizar cadastro:", error);
        alert("Erro ao conectar ao servidor. Tente novamente mais tarde.");
      })
      .finally(() => {
        botaoSalvar.disabled = false; // Reabilita o botão
        botaoSalvar.textContent = "Cadastrar"; // Restaura o texto original do botão
      });
  }