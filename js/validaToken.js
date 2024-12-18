const token = localStorage.getItem("token");

if (!token) {
  console.log("Token nulo ou ausente.");
  window.location.href = "/login.html";
} else {
  fetch(`${host}/users/valida-token`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 403) {
        // Redireciona para a página de login se o status for 403
        console.log("Token inválido ou expirado!");
        localStorage.removeItem("token");
        window.location.href = "/login.html";
      } else if (response.status === 200) {
        // console.log("Token válido! Acesso permitido.");
      } else {
        // console.log("Erro inesperado na validação do token:", response.status);
        localStorage.removeItem("token");
        window.location.href = "/login.html";
      }
    })
    .catch((error) => {
      console.error("Erro ao validar o token:", error);
      localStorage.removeItem("token");
      window.location.href = "/login.html";
    });
 }
