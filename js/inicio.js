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



document.getElementById('notification-icon').addEventListener('click', function() {
  fetch(`${host}/mensagens?page=0&size=10`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao carregar as notificações');
    }
    return response.json();
  })
  .then(data => {
    console.log('Dados recebidos:', data);
    const notificationList = document.querySelector('#notification-list');
    notificationList.innerHTML = '';

    if (data.content && Array.isArray(data.content) && data.content.length > 0) {
      data.content.forEach(message => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'd-flex', 'align-items-center');

        // Verificando se a mensagem foi marcada como lida no localStorage
        const isRead = localStorage.getItem(`notification_${message.id}_read`) === 'true';
        const iconClass = isRead ? 'bx-check-circle text-success' : 'bx-error-circle text-warning';

        listItem.innerHTML = `
          <div class="mr-3">
            <span class="notification-icon" data-id="${message.id}">
              <i class="bx ${iconClass}"></i>
            </span>
          </div>
          <div>
            <h6 class="text-dark mb-1">${message.titulo}</h6>
            <small class="text-muted">${message.conteudo}</small><br />
            <small class="text-muted">${message.dataFormatada}</small>
          </div>
        `;

        listItem.querySelector('.notification-icon').addEventListener('click', function() {
          const mensagensId = this.dataset.id;

          try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const usersId = decodedToken.id || decodedToken.userId || "0";

            const payload = { lida: true };

            fetch(`${host}/mensagens/${mensagensId}/usuarios/${usersId}/lida`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            })
            .then(response => {
              if (response.ok) {
                // Atualizando o ícone localmente e no localStorage
                this.innerHTML = '<i class="bx bx-check-circle text-success"></i>';
                console.log(`Mensagem ${mensagensId} marcada como lida para usuário ${usersId}.`);

                // Salvando o estado no localStorage
                localStorage.setItem(`notification_${mensagensId}_read`, 'true');

                location.reload();  // Recarregar a página após sucesso
              } else {
                console.error('Erro ao marcar como lida:', response.statusText);
              }
            })
            .catch(error => {
              console.error('Erro na requisição PATCH:', error);
            });
          } catch (error) {
            console.error('Erro ao processar o token:', error);
          }
        });

        notificationList.appendChild(listItem);
      });
    } else {
      notificationList.innerHTML = '<li class="list-group-item text-muted">Nenhuma notificação encontrada.</li>';
    }
  })
  .catch(error => {
    console.error('Erro ao buscar notificações:', error);
  });
});




document.addEventListener('DOMContentLoaded', function() {
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const usersId = decodedToken.id || decodedToken.userId || "0";  // Pegando o ID corretamente
  const mensagensId = document.getElementById('notification-badge');

  fetch(`${host}/mensagens/nao-visualizadas/${usersId}`, {
    method: 'GET',  // Método GET explicitamente declarado
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
      // Outros cabeçalhos, se necessário
    }
  })
  .then(response => response.json())
  .then(data => {
      mensagensId.textContent = data;  // Atualiza o número de notificações
  })
  .catch(error => {
      console.error('Erro ao obter as notificações:', error);
  });
})  
