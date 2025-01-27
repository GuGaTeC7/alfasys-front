// Seleciona todos os elementos de botão com o ícone inicial
const buttons = document.querySelectorAll('.list-group-item .bx-error-circle');

// Adiciona um evento de clique para cada botão
buttons.forEach(button => {
  button.parentElement.addEventListener('click', () => {
    // Verifica se o ícone atual é o de erro
    if (button.classList.contains('bx-error-circle')) {
      // Altera para o ícone de sucesso
      button.classList.remove('bx-error-circle', 'text-warning');
      button.classList.add('bx-check-circle', 'text-success');
    } else {
      // Altera de volta para o ícone de erro (opcional, caso queira alternar novamente)
      button.classList.remove('bx-check-circle', 'text-success');
      button.classList.add('bx-error-circle', 'text-warning');
    }
  });
});

let userImg = document.querySelector(".user-img");
let userName = document.querySelector("#nomeUserHeader");
let nomeUserInfo = document.querySelector("#nomeUserInfo");
let cargoInfo = document.querySelector("#cargoInfo");
let cargoHeader = document.querySelector("#cargoHeader");
let profile = document.querySelector(".profile");
let menu = document.querySelector("#menu");
let main = document.querySelector(".main");
let sidebar = document.querySelector(".sidebar");
let searchIcon = document.querySelector(".search-icon");
let input = document.querySelector(".input");
let noticeIcon = document.querySelector(".notice-icon");
let notice = document.querySelector(".notice");

// Decodificar o token JWT
const decodedToken = jwt_decode(token);

// Preencher o nome do usuário
userName.innerHTML = `${decodedToken.nome.split(" ").slice(0, 2).join(" ")}`;
nomeUserInfo.innerHTML = decodedToken.nome;

// Obter o ID do usuário do token
const userId = decodedToken.userId || decodedToken.id;

// Função para buscar o cargo do usuário com autorização
async function fetchUserData(userId) {
  try {
    const response = await fetch(`${host}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados do usuário: ${response.status}`);
    }

    const userData = await response.json();

    // Extrair o cargo do array "cargos"
    const cargo = userData.cargos && userData.cargos.length > 0 ? userData.cargos[0] : "Cargo não encontrado";

    // Atualizar os campos no front-end
    cargoInfo.innerHTML = cargo;
    cargoHeader.innerHTML = cargo;
  } catch (error) {
    console.error("Erro ao buscar o cargo do usuário:", error.message);
  }
}

// Buscar os dados do usuário se o ID existir
if (userId) {
  fetchUserData(userId);
} else {
  console.error("ID do usuário não encontrado no token.");
}

// Interatividade do menu
searchIcon.addEventListener("click", () => {
  input.classList.toggle("active");
});

userImg.addEventListener("click", () => {
  profile.classList.add("show");
  document.addEventListener("click", (e) => {
    if (!profile.contains(e.target) && e.target !== userImg) {
      profile.classList.remove("show");
    }
  });
});

userName.addEventListener("click", () => {
  profile.classList.add("show");
  document.addEventListener("click", (e) => {
    if (!profile.contains(e.target) && e.target !== userName) {
      profile.classList.remove("show");
    }
  });
});

noticeIcon.addEventListener("click", () => {
  notice.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" && e.target != !noticeIcon) {
      notice.classList.remove("show");
    }
  });
});

menu.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  main.classList.toggle("active");
});

let navbarBrand = document.querySelector(".navbar-brand");

navbarBrand.addEventListener("click", (e) => {
  e.preventDefault();
  location.reload();
});


// Botão para fazer logout
document.getElementById("logout").addEventListener("click", function () {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

// Botão para fazer logout
document.getElementById("configs").addEventListener("click", function () {
  window.location.href = "configs.html";
});

// Botão para fazer logout
document.getElementById("support").addEventListener("click", function () {
  window.location.href = "support.html";
});