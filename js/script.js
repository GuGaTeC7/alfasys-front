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

// Dados do user
const decodedToken = jwt_decode(token);

userName.innerHTML = `${decodedToken.nome
  .split(" ")
  .slice(0, 2)
  .join(" ")}`;
nomeUserInfo.innerHTML = decodedToken.nome;
cargoInfo.innerHTML = decodedToken.cargo;
cargoHeader.innerHTML = decodedToken.cargo;

searchIcon.addEventListener("click", () => {
  input.classList.toggle("active");
});

userImg.addEventListener("click", () => {
  profile.classList.add("show");

  document.addEventListener("click", (e) => {
    if (
      e.target.tagName != "IMG" &&
      e.target != !userImg &&
      e.target.tagName != "H6"
    ) {
      profile.classList.remove("show");
    }
  });
});
userName.addEventListener("click", () => {
  profile.classList.add("show");
  document.addEventListener("click", (e) => {
    if (
      e.target.tagName != "H6" &&
      e.target != !userName &&
      e.target.tagName != "IMG"
    ) {
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