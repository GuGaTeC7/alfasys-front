document.getElementById("button-buscar-projeto").addEventListener("click", function (event) {
    event.preventDefault(); // Previne o comportamento padrão do botão, como submissão de formulário.
  
    const botaoBuscar = this; // Referência ao botão
    botaoBuscar.disabled = true; // Desabilita o botão temporariamente
    botaoBuscar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Buscando...';
  
    // Simula o processo de busca com um delay de 3 segundos
    setTimeout(() => {
      botaoBuscar.disabled = false; // Habilita o botão novamente
      botaoBuscar.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>⠀Buscar'; // Restaura o conteúdo original do botão
    }, 3000);
  });
