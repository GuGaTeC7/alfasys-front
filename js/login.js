const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const toggleContainer = document.querySelector(".toggle");
const loginButton = document.querySelector(".form-container.sign-in button[type='submit']");
const signupButton = document.querySelector(".form-container.sign-up button[type='submit']");
const registerToggleBtn = document.querySelector(".toggle-panel.toggle-right button.hidden");
const loginToggleBtn = document.querySelector(".toggle-panel.toggle-left button.hidden");

// Adiciona ou remove classes "active-tim" ou "active-claro"
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
  toggleContainer.classList.remove("active-tim");
  toggleContainer.classList.add("active-claro");

  signupButton.classList.add("btn-claro");
  loginButton.classList.remove("btn-tim");

  registerToggleBtn.classList.add("btn-claro");
  loginToggleBtn.classList.remove("btn-tim");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
  toggleContainer.classList.remove("active-claro");
  toggleContainer.classList.add("active-tim");

  loginButton.classList.add("btn-tim");
  signupButton.classList.remove("btn-claro");

  loginToggleBtn.classList.add("btn-tim");
  registerToggleBtn.classList.remove("btn-claro");
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

  
  function togglePasswordVisibility(passwordId, toggleIconId) {
    const passwordInput = document.getElementById(passwordId);
    const toggleIcon = document.getElementById(toggleIconId);
  
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
  
    
  
      function signup(event) {
        event.preventDefault(); // Previne o comportamento padrão do formulário
      
        // Seleciona os campos de entrada de email e senha
        const email = document.querySelector("#register-email").value;
        const password = document.querySelector("#register-password").value;
        const alertError = document.querySelector(".alert-error");
        const signupButton = event.target.querySelector("button[type='submit']");
      
        // Limpa mensagens de erro anteriores
        alertError.classList.remove("show");
        alertError.textContent = "";
      
        // Ativa estado de carregamento no botão
        signupButton.textContent = "Carregando...";
        signupButton.disabled = true;
      
        // Faz a requisição para o backend
        fetch("https://alfasys-back-production.up.railway.app/users/login", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            senha: password,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Verifique suas credenciais.");
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
            // Exibe mensagem de erro
            alertError.classList.add("show");
            alertError.textContent =
              "Erro: " + error.message || "Erro ao fazer login.";
      
            // Restaura o estado do botão
            signupButton.textContent = "Entrar";
            signupButton.disabled = false;
          });
      }
      