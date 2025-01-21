async function preencherInicio() {
  const url = `${host}/cadastroEndIds/quantidades`; // Substitua `host` pela variável correta

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Substitua por sua lógica de autenticação
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar dados da API");
    }

    const data = await response.json();

    // Mapeamento entre as etapas retornadas pela API e as classes HTML
    const mappings = {
      "Total EndIDs Cadastrados": "cadastro1",
      "Acesso Vistoria": "agendamento1",
      "SCI de Inclusão": "inclusão1",
      "SCI de Exclusão": "exclusão1",
      "Acesso Obra": "acessoObra1",
      "Kit TSSR": "kit1",
      "Vistoria": "vistoria1",
      "Obra": "obra1",
      "Projeto": "projeto1",
    };

    // Define todos os valores iniciais como 0 encontrados
    Object.values(mappings).forEach((className) => {
      const element = document.querySelector(`.icon.${className} ~ .desc h5`);
      if (element) {
        element.textContent = "0 encontrado(s)";
      }
    });

    // Atualiza as quantidades no HTML com base no mapeamento
    data.forEach((item) => {
      const className = mappings[item.etapa];
      if (className) {
        const element = document.querySelector(`.icon.${className} ~ .desc h5`);
        if (element) {
          element.textContent = `${item.quantidade} encontrado(s)`;
        }
      }
    });
  } catch (error) {
    console.error("Erro ao preencher os dados:", error);
  }
}

// Exemplo de chamada
preencherInicio();



// Lógica para lidar com as notificações
document.getElementById('notification-icon').addEventListener('click', function() {
  // Fazendo a requisição GET para o endpoint de mensagens
  fetch(`${host}/mensagens?page=0&size=10`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
      .then(response => response.json()) // Converte a resposta em JSON
      .then(data => {
        console.log(data); // Verifique os dados da resposta no console
        const notificationList = document.querySelector('#notification-list');
        notificationList.innerHTML = ''; // Limpa as notificações anteriores
        
        if (Array.isArray(data) && data.length > 0) {
            data.forEach(message => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item', 'd-flex', 'align-items-center');
                
                // Definindo o conteúdo de cada notificação
                listItem.innerHTML = `
                    <div class="mr-3">
                        <span><i class="bx bx-error-circle text-warning"></i></span>
                    </div>
                    <div>
                        <h6 class="text-dark">${message.titulo}</h6>
                        <small class="text-muted">${message.conteudo}</small><br />
                        <small class="text-muted">${message.dataFormatada}</small>
                    </div>
                `;
                notificationList.appendChild(listItem);
            });
        } else {
            console.log("Nenhuma notificação encontrada.");
        }
    })
  })
    