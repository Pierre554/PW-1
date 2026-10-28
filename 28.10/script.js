
const formulario = document.getElementById("meuFormulario");
const listaUsuarios = document.getElementById("listaUsuarios");
const tabela = document.getElementById("tabelaCadastros");
const mensagemLista = document.getElementById("mensagemLista");
const contador = document.getElementById("contador");
const mensagem = document.getElementById("mensagem");

let usuarios = [];

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = "mensagem " + tipo;
}

function atualizarLista() {
    listaUsuarios.replaceChildren();

    usuarios.forEach((usuario, indice) => {
        const linha = document.createElement("tr");

        const dados = [
            usuario.nome,
            usuario.email,
            usuario.telefone,
            usuario.usuario
        ];

        dados.forEach((valor) => {
            const celula = document.createElement("td");
            celula.textContent = valor;
            linha.appendChild(celula);
        });

        const celulaAcao = document.createElement("td");
        const botao = document.createElement("button");

        botao.type = "button";
        botao.textContent = "Excluir";
        botao.className = "btn-excluir";
        botao.setAttribute(
            "aria-label",
            "Excluir cadastro de " + usuario.nome
        );

        botao.addEventListener("click", () => {
            usuarios.splice(indice, 1);
            atualizarLista();
            mostrarMensagem("Cadastro excluído com sucesso.", "sucesso");
        });

        celulaAcao.appendChild(botao);
        linha.appendChild(celulaAcao);
        listaUsuarios.appendChild(linha);
    });

    tabela.hidden = usuarios.length === 0;
    mensagemLista.hidden = usuarios.length > 0;

    contador.textContent =
        usuarios.length +
        (usuarios.length === 1 ? " usuário" : " usuários");
}

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const nascimento = document.getElementById("nascimento").value;
    const genero = document.getElementById("genero").value;
    const email = document.getElementById("email").value.trim().toLowerCase();
    const telefone = document.getElementById("telefone").value.trim();
    const cep = document.getElementById("cep").value.trim();
    const rua = document.getElementById("rua").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const complemento = document.getElementById("complemento").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const estado = document.getElementById("estado").value;
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha =
        document.getElementById("confirmarSenha").value;

    if (nome.length < 3) {
        mostrarMensagem("Digite seu nome completo corretamente.", "erro");
        return;
    }

    if (nascimento &&
        new Date(nascimento + "T00:00:00") > new Date()) {
        mostrarMensagem(
            "A data de nascimento não pode ser futura.",
            "erro"
        );
        return;
    }

    if (senha.length < 8) {
        mostrarMensagem(
            "A senha precisa ter pelo menos 8 caracteres.",
            "erro"
        );
        return;
    }

    if (senha !== confirmarSenha) {
        mostrarMensagem("As senhas não são iguais.", "erro");
        return;
    }

    if (!/^[a-zA-Z0-9._-]{3,}$/.test(usuario)) {
        mostrarMensagem(
            "O usuário deve ter 3 ou mais caracteres e usar apenas letras, números, ponto, hífen ou sublinhado.",
            "erro"
        );
        return;
    }

    const emailExiste = usuarios.some(
        (item) => item.email === email
    );

    const usuarioExiste = usuarios.some(
        (item) => item.usuario.toLowerCase() === usuario.toLowerCase()
    );

    if (emailExiste) {
        mostrarMensagem("Este e-mail já está cadastrado.", "erro");
        return;
    }

    if (usuarioExiste) {
        mostrarMensagem("Este nome de usuário já está em uso.", "erro");
        return;
    }

    const novoUsuario = {
        nome,
        nascimento,
        genero,
        email,
        telefone,
        cep,
        rua,
        numero,
        complemento,
        cidade,
        estado,
        usuario
    };

    // A senha não é armazenada na lista de cadastros.
    usuarios.push(novoUsuario);

    atualizarLista();
    formulario.reset();

    mostrarMensagem(
        "Usuário cadastrado com sucesso!",
        "sucesso"
    );

    document.querySelector(".lista-cadastros").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

formulario.addEventListener("reset", function () {
    mensagem.className = "mensagem";
    mensagem.textContent = "";
});

document.getElementById("telefone").addEventListener("input", function () {
    let numeros = this.value.replace(/\D/g, "").slice(0, 11);

    if (numeros.length > 10) {
        numeros = numeros.replace(
            /^(\d{2})(\d{5})(\d{4})$/,
            "($1) $2-$3"
        );
    } else if (numeros.length > 6) {
        numeros = numeros.replace(
            /^(\d{2})(\d{4})(\d{0,4})$/,
            "($1) $2-$3"
        );
    } else if (numeros.length > 2) {
        numeros = numeros.replace(
            /^(\d{2})(\d*)$/,
            "($1) $2"
        );
    }

    this.value = numeros;
});

document.getElementById("cep").addEventListener("input", function () {
    let numeros = this.value.replace(/\D/g, "").slice(0, 8);

    if (numeros.length > 5) {
        numeros = numeros.replace(/^(\d{5})(\d{1,3})$/, "$1-$2");
    }

    this.value = numeros;
});

atualizarLista();
