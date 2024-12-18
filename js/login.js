const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

// Adiciona ou remove a classe "active" para alternar entre telas de login e registro
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// Validação do formulário de login
document
  .getElementById("signin-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, insira um e-mail válido.");
      return;
  }

    // Chama a função de login
    login(event);
  });

  function login(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário
  
    // Seleciona os campos de entrada de email e senha
    const iemail = document.querySelector("#login-email");
    const ipassword = document.querySelector("#login-password");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const alertError = document.querySelector(".alert-error");
    const loginButton = event.target.querySelector("button[type='submit']");
  
    // Limpa erros anteriores
    iemail.classList.remove("error");
    ipassword.classList.remove("error");
    emailError.style.display = "none";
    passwordError.style.display = "none";
    alertError.classList.remove("show");
    alertError.textContent = "";
  
    // Ativa estado de carregamento no botão
    loginButton.textContent = "Carregando...";
    loginButton.disabled = true;
  
    fetch("https://alfasys-back-production.up.railway.app/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: iemail.value,
        senha: ipassword.value,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Verifique suas credenciais");
        }
        return response.json();
      })
      .then((data) => {
        if (data.token) {
          const token = data.token;
  
          // Armazena o token no localStorage
          localStorage.setItem("token", token);
  
          // Redireciona para a página inicial
          window.location.href = "/index.html";
        } else {
          throw new Error("Token não encontrado.");
        }
      })
      .catch((error) => {
        // Exibe mensagem de erro e aplica estilos
        iemail.classList.add("error");
        ipassword.classList.add("error");
  
        // Exibe alerta estilizado
        alertError.classList.add("show");
        alertError.textContent =
          "Erro: " + error.message || "Credenciais incorretas.";
  
        // Restaura o estado do botão
        loginButton.textContent = "Entrar";
        loginButton.disabled = false;
      });
  }

//MOSTRAR SENHA
      function togglePasswordVisibility() {
        const passwordInput = document.getElementById('login-password');
        const toggleIcon = document.getElementById('toggle-password');

        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          toggleIcon.classList.remove('fa-eye');
          toggleIcon.classList.add('fa-eye-slash');
        } else {
          passwordInput.type = 'password';
          toggleIcon.classList.remove('fa-eye-slash');
          toggleIcon.classList.add('fa-eye');
        }
      }
  
  
