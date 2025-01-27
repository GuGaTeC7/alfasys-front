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

    // Validação do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }

    // Requisição para buscar todos os usuários
    fetch(`${host}/users`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Erro ao buscar usuários.');
            }
            return response.json();
        })
        .then((users) => {
            // Filtra o usuário pelo e-mail
            const user = users.find((u) => u.email === email);
            if (!user) {
                throw new Error('Usuário não encontrado.');
            }

            if (!user.cargos || user.cargos.length === 0) {
                throw new Error('Usuário não possui cargos cadastrados.');
            }

            // Preenche os cargos no campo
            const cargoAtual = user.cargos
                .map((cargo) => `${cargo.id} - ${cargo.nome}`)
                .join(', ');

            document.getElementById('email').disabled = true;
            document.querySelector('.search-button').disabled = true;
            document.getElementById('cargo-atual').value = cargoAtual;
        })
        .catch((error) => {
            console.error(error);
            alert('Erro: ' + error.message);
        });
});
