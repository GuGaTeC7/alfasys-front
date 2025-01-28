// Manipula somente a exibição do campo dinâmico
document.getElementById('remove-cargo').addEventListener('click', function () {
    document.getElementById('dynamic-field').innerHTML = `
        <div class="input-box">
            <label for="cargo-antigo">Remover cargo</label>
            <select id="cargo-antigo" name="cargo-antigo" required>
                <option value="">Selecione...</option>
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

document.getElementById('add-cargo').addEventListener('click', function () {
    document.getElementById('dynamic-field').innerHTML = `
        <div class="input-box">
            <label for="cargo-novo">Adicionar cargo</label>
            <select id="cargo-novo" name="cargo-novo" required>
                <option value="">Selecione...</option>
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
        // Alteração no trecho da função que valida se o usuário tem cargos
        .then((users) => {
            const user = users.find((u) => u.email === email);
            if (!user) {
                throw new Error('Usuário não encontrado.');
            }
        
            // Se o usuário não tem cargos, exibe a mensagem no campo "cargo atual"
            if (!user.cargos || user.cargos.length === 0) {
                document.getElementById('cargo-atual').value = 'O usuário não tem cargos existentes';
                // Torna visível a opção de adicionar um cargo
                document.getElementById('add-cargo').style.display = 'block';  // Torna o botão visível
            } else {
                // Se o usuário tiver cargos, preenche o campo com os cargos existentes
                const cargoAtual = user.cargos
                    .map((cargo) => `${cargo.id} - ${cargo.nome}`)
                    .join(', ');
        
                document.getElementById('cargo-atual').value = cargoAtual;
            }
        
            document.getElementById('email').disabled = true;
            document.querySelector('.search-button').disabled = true;
        })        
        .catch((error) => {
            console.error(error);
            alert('Erro: ' + error.message);
        });
});

// Adicionar cargo (POST)
document.getElementById('add-cargo').addEventListener('click', function () {
    const email = document.getElementById('email').value;
    const cargoNovo = document.getElementById('cargo-novo')?.value;

    if (!cargoNovo) {        
        return;
    }

    // Requisição para buscar o ID do usuário pelo e-mail
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
            const user = users.find((u) => u.email === email);
            if (!user) {
                throw new Error('Usuário não encontrado.');
            }

            // Realiza o POST para adicionar o cargo
            fetch(`${host}/users/${user.id}/cargos/${cargoNovo}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Erro ao adicionar o cargo.');
                    }
                    alert('Cargo adicionado com sucesso!');
                })
                .catch((error) => {
                    console.error(error);
                    alert('Erro: ' + error.message);
                });
        })
        .catch((error) => {
            console.error(error);
            alert('Erro: ' + error.message);
        });
});

// POST - Adicionar cargo
document.getElementById('dynamic-field').addEventListener('change', function () {
    const cargoNovo = document.getElementById('cargo-novo')?.value;
    if (!cargoNovo) return; // Evita execução sem valor

    const email = document.getElementById('email').value;
    if (!email) {
        alert('Email inválido ou não preenchido.');
        return;
    }

    fetch(`${host}/users`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((users) => {
            const user = users.find((u) => u.email === email);
            if (!user) throw new Error('Usuário não encontrado.');

            return fetch(`${host}/users/${user.id}/cargos/${cargoNovo}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        })
        .then((response) => {
            if (!response.ok) throw new Error('Erro ao adicionar cargo.');
            alert('Cargo adicionado com sucesso!');
            location.reload(); // Recarrega a página
        })
        .catch((error) => {
            console.error(error);
            alert('Erro: ' + error.message);
        });
});

// DELETE - Remover cargo
document.getElementById('dynamic-field').addEventListener('change', function () {
    const cargoAntigo = document.getElementById('cargo-antigo')?.value;
    if (!cargoAntigo) return; // Evita execução sem valor

    const email = document.getElementById('email').value;
    if (!email) {
        alert('Email inválido ou não preenchido.');
        return;
    }

    fetch(`${host}/users`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((users) => {
            const user = users.find((u) => u.email === email);
            if (!user) throw new Error('Usuário não encontrado.');

            return fetch(`${host}/users/${user.id}/cargos/${cargoAntigo}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        })
        .then((response) => {
            if (!response.ok) throw new Error('Erro ao remover cargo.');
            alert('Cargo removido com sucesso!');
            location.reload(); // Recarrega a página
        })
        .catch((error) => {
            console.error(error);
            alert('Erro: ' + error.message);
        });
});



