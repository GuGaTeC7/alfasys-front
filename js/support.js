document.getElementById('remove-cargo').addEventListener('click', function() {
    document.getElementById('dynamic-field').innerHTML = `
        <div class="input-box">
            <label for="cargo-antigo">Remover cargo</label>
            <select id="cargo-antigo" name="cargo-antigo" required>
                <option value="1">1 - Acesso Vistoria</option>
                <option value="2">2 - Vistoria</option>
                <option value="3">3 - Kit Tssr</option>
                <option value="4">4 - Sci de Inclusao</option>
                <option value="5">5 - Projeto</option>
                <option value="6">6 - Acesso Obra</option>
                <option value="7">7 - Obra</option>
                <option value="8">8 - Sci de Exclusão</option>
                <option value="9">9 - Admin</option>
            </select>
        </div>
    `;
});

document.getElementById('add-cargo').addEventListener('click', function() {
    document.getElementById('dynamic-field').innerHTML = `
        <div class="input-box">
            <label for="cargo-novo">Adicionar cargo</label>
            <select id="cargo-novo" name="cargo-novo" required>
                <option value="1">1 - Acesso Vistoria</option>
                <option value="2">2 - Vistoria</option>
                <option value="3">3 - Kit Tssr</option>
                <option value="4">4 - Sci de Inclusao</option>
                <option value="5">5 - Projeto</option>
                <option value="6">6 - Acesso Obra</option>
                <option value="7">7 - Obra</option>
                <option value="8">8 - Sci de Exclusão</option>
                <option value="9">9 - Admin</option>
            </select>
        </div>
    `;
});

document.querySelector('.search-button').addEventListener('click', function () {
    const email = document.getElementById('email').value;

    // Validação do campo de e-mail
    if (!email) {
        alert('Por favor, insira um e-mail.');
        return;
    }

    // Consulta ao servidor para buscar o usuário
    fetch(`${host}/users?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Usuário não encontrado ou erro no servidor.');
        }
        return response.json();
    })
    .then((user) => {
        if (!user || !user.id || !user.cargos || user.cargos.length === 0) {
            throw new Error('Usuário não possui cargos cadastrados.');
        }

        // Preenche o campo de cargos
        const cargoAtual = user.cargos
            .map((cargo) => `${cargo.id} - ${cargo.nome}`)
            .join(', ');

        document.getElementById('email').disabled = true; // Bloqueia o campo de e-mail
        document.querySelector('.search-button').disabled = true; // Bloqueia o botão de busca
        const cargoAtualField = document.querySelector('#dynamic-field');
        cargoAtualField.innerHTML = `
            <div class="input-box">
                <label for="cargo-atual">Cargo atual</label>
                <input id="cargo-atual" name="cargo-atual" value="${cargoAtual}" disabled>
            </div>
        `;
    })
    .catch((error) => {
        console.error(error);
        alert('Erro: ' + error.message);
    });
});