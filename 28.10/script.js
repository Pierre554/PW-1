
const formulario = document.getElementById("formulario");
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const idade = document.getElementById("idade");
const senha = document.getElementById("senha");
const aceite = document.getElementById("aceite");
const mensagem = document.getElementById("mensagem");
const preencher = document.getElementById("preencher");

// Exibe mensagens na tela
function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = tipo;
}

// Preenche os campos com dados de exemplo
preencher.addEventListener("click", function () {
    nome.value = "Ana Oliveira";
    email.value = "ana@exemplo.com";
    idade.value = 22;
    senha.value = "senha123";
    aceite.checked = true;

    mostrarMensagem(
        "Exemplo preenchido! Você pode editar os dados.",
        "sucesso"
    );
});

// Validação e envio do formulário
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nomeDigitado = nome.value.trim();
    const idadeDigitada = Number(idade.value);

    if (nomeDigitado.length < 3) {
        mostrarMensagem(
            "Digite seu nome completo ou um nome com pelo menos 3 caracteres.",
            "erro"
        );
        nome.focus();
        return;
    }

    if (
        !Number.isInteger(idadeDigitada) ||
        idadeDigitada < 1 ||
        idadeDigitada > 120
    ) {
        mostrarMensagem(
            "Digite uma idade válida entre 1 e 120 anos.",
            "erro"
        );
        idade.focus();
        return;
    }

    if (senha.value.length < 6) {
        mostrarMensagem(
            "A senha precisa ter pelo menos 6 caracteres.",
            "erro"
        );
        senha.focus();
        return;
    }

    if (!aceite.checked) {
        mostrarMensagem(
            "Você precisa concordar com os termos de uso.",
            "erro"
        );
        aceite.focus();
        return;
    }

    mostrarMensagem(
        `Cadastro de ${nomeDigitado} validado com sucesso!`,
        "sucesso"
    );

    console.log("Dados do formulário:", {
        nome: nomeDigitado,
        email: email.value,
        idade: idadeDigitada
    });
});
