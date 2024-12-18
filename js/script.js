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
console.log(decodedToken);

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

document.querySelectorAll(".end-id").forEach((button) => {
  button.addEventListener("click", (event) => {
    const endId = event.target.getAttribute("data-id");

    const alertDiv = document.createElement("div");
    alertDiv.className = "alert-container";

    alertDiv.style.position = "fixed";
    alertDiv.style.top = "50%";
    alertDiv.style.left = "50%";
    alertDiv.style.transform = "translate(-50%, -50%)";
    alertDiv.style.width = "86%"; /* 7% em cada lado */
    alertDiv.style.maxWidth = "900px";
    alertDiv.style.padding = "30px";
    alertDiv.style.backgroundColor = "#012970";
    alertDiv.style.color = "#ffffff";
    alertDiv.style.border = "2px solid #012970";
    alertDiv.style.borderRadius = "15px";
    alertDiv.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)";
    alertDiv.style.zIndex = "1000";
    alertDiv.style.overflow = "hidden";

    alertDiv.innerHTML = `
            <strong style="display: block; text-align: center; margin-bottom: 20px; font-size: 1.5em;">Detalhes do Projeto: ${endId}</strong>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                <ul style="flex: 1; padding-left: 20px; font-size: 1em; list-style: none;">
                    <li><strong>Site ID:</strong> Projeto Exemplo</li>
                    <li><strong>Demanda:</strong> Empresa A</li>
                    <li><strong>Detentora:</strong> 01/01/2024</li>
                    <li><strong>ID Detentora:</strong> 31/12/2024</li>
                    <li><strong>Operadora cedente:</strong> Em Andamento</li>
                    <li><strong>ID Operadora:</strong> Este é um projeto de exemplo para fins demonstrativos.</li>
                    <li><strong>Logradouro:</strong> Rua Vinte</li>
                    <li><strong>Número:</strong> 20</li>
                </ul>
                <ul style="flex: 1; padding-right: 20px; font-size: 1em; list-style: none;">
                    <li><strong>Bairro:</strong> Bairro Vinte</li>
                    <li><strong>Município:</strong> Vinte</li>
                    <li><strong>Estado:</strong> SP</li>
                    <li><strong>CEP:</strong> 0800081</li>
                    <li><strong>Latitude:</strong> -1240</li>
                    <li><strong>Longitude:</strong> 8158</li>
                    <li><strong>Observações:</strong> sem observações adicionais</li>
                    <li><strong>Status do agendamento:</strong> Em Andamento</li>
                </ul>

            </div>
        `;

    const closeButton = document.createElement("button");
    closeButton.innerText = "Fechar";
    closeButton.style.marginTop = "20px";
    closeButton.style.padding = "12px 20px";
    closeButton.style.backgroundColor = "#ffffff";
    closeButton.style.border = "2px solid #ffffff";
    closeButton.style.color = "#012970";
    closeButton.style.cursor = "pointer";
    closeButton.style.borderRadius = "10px";
    closeButton.style.display = "block";
    closeButton.style.marginLeft = "auto";
    closeButton.style.marginRight = "auto";

    closeButton.addEventListener("click", () => {
      alertDiv.remove();
    });

    alertDiv.appendChild(closeButton);
    document.body.appendChild(alertDiv);

    window.scrollTo(
      0,
      alertDiv.getBoundingClientRect().top + window.scrollY - 100
    );
  });
});

document.querySelectorAll(".btn-outline-primary").forEach((button) => {
  button.addEventListener("click", (event) => {
    const endId = event.target
      .closest("tr")
      .querySelector(".end-id")
      .getAttribute("data-id");

    const alertDiv = document.createElement("div");
    alertDiv.className = "alert-container";

    alertDiv.style.position = "fixed";
    alertDiv.style.top = "50%";
    alertDiv.style.left = "50%";
    alertDiv.style.transform = "translate(-50%, -50%)";
    alertDiv.style.width = "86%"; /* 7% em cada lado */
    alertDiv.style.maxWidth = "900px";
    alertDiv.style.padding = "30px";
    alertDiv.style.backgroundColor = "#012970";
    alertDiv.style.color = "#ffffff";
    alertDiv.style.border = "2px solid #012970";
    alertDiv.style.borderRadius = "15px";
    alertDiv.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)";
    alertDiv.style.zIndex = "1000";
    alertDiv.style.overflow = "hidden";

    alertDiv.innerHTML = `
            <strong style="display: block; text-align: center; margin-bottom: 20px; font-size: 1.5em;">Informações de ligação do projeto: ${endId}</strong>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            <ul style="flex: 1; padding-left: 20px; font-size: 1em; list-style: none;">
                <li><strong>ENDEREÇO ID:</strong> </li>
                <li><strong>SITE ID:</strong> </li>
                <li><strong>Leitura Inicial:</strong> </li>
                <li><strong>Concessionária:</strong> </li>
                <li><strong>Regional:</strong> </li>
                <li><strong>CEP:</strong> </li>
                <li><strong>UF:</strong> </li>
                <li><strong>Cidade:</strong> </li>
                <li><strong>Endereço:</strong> </li>
                <li><strong>Número:</strong> </li>
                <li><strong>Bairro:</strong> </li>
                <li><strong>Complemento:</strong> </li>
            </ul>
            <ul style="flex: 1; padding-right: 20px; font-size: 1em; list-style: none;">
                <li><strong>CNPJ:</strong></li>
                <li><strong>CMPJ DA UC SOLICITADA:</strong> </li> 
                <li><strong>Previsão de Ligação:</strong> </li>
                <li><strong>Número Medidor:</strong> </li>
                <li><strong>Tipo de Tensão:</strong> </li>
                <li><strong>Unidade:</strong> </li>
                <li><strong>Número de Instalação:</strong> </li>
                <li><strong>Número de Fases:</strong> </li>
            </li>
        </ul>
    </div>
        `;

    const closeButton = document.createElement("button");
    closeButton.innerText = "Fechar";
    closeButton.style.marginTop = "20px";
    closeButton.style.padding = "12px 20px";
    closeButton.style.backgroundColor = "#ffffff";
    closeButton.style.border = "2px solid #ffffff";
    closeButton.style.color = "#012970";
    closeButton.style.cursor = "pointer";
    closeButton.style.borderRadius = "10px";
    closeButton.style.display = "block";
    closeButton.style.marginLeft = "auto";
    closeButton.style.marginRight = "auto";

    closeButton.addEventListener("click", () => {
      alertDiv.remove();
    });

    alertDiv.appendChild(closeButton);
    document.body.appendChild(alertDiv);

    window.scrollTo(
      0,
      alertDiv.getBoundingClientRect().top + window.scrollY - 100
    );
  });
});

document.querySelectorAll(".finalizar-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const endId = event.target.getAttribute("data-id");

    const alertDiv = document.createElement("div");
    alertDiv.className = "custom-alert";

    alertDiv.style.position = "fixed";
    alertDiv.style.top = "50%";
    alertDiv.style.left = "50%";
    alertDiv.style.transform = "translate(-50%, -50%)";
    alertDiv.style.width = "300px";
    alertDiv.style.padding = "15px";
    alertDiv.style.backgroundColor = "rgba(1, 41, 112, 0.9)";
    alertDiv.style.color = "#ffffff";
    alertDiv.style.borderRadius = "5px";
    alertDiv.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)";
    alertDiv.style.zIndex = "1000";
    alertDiv.style.textAlign = "center";
    alertDiv.innerHTML = `
        <strong>Tem certeza que deseja enviar o END ID ${endId}?</strong><br>
        <button class="btn btn-light mt-2" onclick="dismissAlert()">Cancelar</button>
        <button class="btn btn-warning text-white mt-2" onclick="confirmAlert('${endId}')">Enviar</button>
      `;

    document.body.appendChild(alertDiv);
  });
 });

function dismissAlert() {
  const alertDiv = document.querySelector(".custom-alert");
  if (alertDiv) {
    alertDiv.remove();
  }
}

function confirmAlert(endId) {
  alert(`END ID ${endId} enviado com sucesso.`);
  dismissAlert();
}

document.getElementById("logout").addEventListener("click", function () {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

document.querySelectorAll(".iniciar-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const endId = event.target.getAttribute("data-id");

    const alertDiv = document.createElement("div");
    alertDiv.className = "custom-alert";

    alertDiv.style.position = "fixed";
    alertDiv.style.top = "50%";
    alertDiv.style.left = "50%";
    alertDiv.style.transform = "translate(-50%, -50%)";
    alertDiv.style.width = "300px";
    alertDiv.style.padding = "15px";
    alertDiv.style.backgroundColor = "rgba(1, 41, 112, 0.9)";
    alertDiv.style.color = "#ffffff";
    alertDiv.style.borderRadius = "5px";
    alertDiv.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)";
    alertDiv.style.zIndex = "1000";
    alertDiv.style.textAlign = "center";
    alertDiv.innerHTML = `
        <strong>Tem certeza que deseja iniciar essa etapa?</strong><br>
        <button class="btn btn-light mt-2" onclick="dismissAlert()">Não</button>
        <button class="btn btn-warning text-white mt-2" onclick="confirmAlert('${endId}')">Iniciar</button>
      `;

    document.body.appendChild(alertDiv);
  });
});

function dismissAlert() {
  const alertDiv = document.querySelector(".custom-alert");
  if (alertDiv) {
    alertDiv.remove();
  }
}

function confirmAlert(endId) {
  alert(`Etapa iniciada com sucesso.`);
  dismissAlert();
}
