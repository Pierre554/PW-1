const numeroInput = document.getElementById("numero");
const botaoFalar = document.getElementById("botaoFalar");
const resultado = document.getElementById("resultado");

const unidades = [
"zero",
"um",
"dois",
"três",
"quatro",
"cinco",
"seis",
"sete",
"oito",
"nove"
];

const especiais = [
"dez",
"onze",
"doze",
"treze",
"quatorze",
"quinze",
"dezesseis",
"dezessete",
"dezoito",
"dezenove"
];

const dezenas = [
"",
"",
"vinte",
"trinta",
"quarenta",
"cinquenta",
"sessenta",
"setenta",
"oitenta",
"noventa"
];

const centenas = [
"",
"cento",
"duzentos",
"trezentos",
"quatrocentos",
"quinhentos",
"seiscentos",
"setecentos",
"oitocentos",
"novecentos"
];

function numeroPorExtenso(numero) {

if (numero < 10) {
    return unidades[numero];
}

if (numero < 20) {
    return especiais[numero - 10];
}

if (numero < 100) {
    const dezena = Math.floor(numero / 10);
    const unidade = numero % 10;

    if (unidade === 0) {
        return dezenas[dezena];
    }

    return dezenas[dezena] + " e " + unidades[unidade];
}

if (numero < 1000) {
    if (numero === 100) {
        return "cem";
    }

    const centena = Math.floor(numero / 100);
    const resto = numero % 100;

    if (resto === 0) {
        return centenas[centena];
    }

    return centenas[centena] + " e " + numeroPorExtenso(resto);
}

if (numero < 1000000) {

    const milhares = Math.floor(numero / 1000);
    const resto = numero % 1000;

    let textoMilhar;

    if (milhares === 1) {
        textoMilhar = "mil";
    } else {
        textoMilhar = numeroPorExtenso(milhares) + " mil";
    }

    if (resto === 0) {
        return textoMilhar;
    }

    return textoMilhar + " e " + numeroPorExtenso(resto);
}

return "Número muito grande";


}

function falarNumero() {

const valor = numeroInput.value;

if (valor === "") {
    alert("Digite um número!");
    numeroInput.focus();
    return;
}

const numero = Number(valor);

if (numero < 0) {
    alert("Digite um número positivo!");
    return;
}

if (numero >= 1000000) {
    alert("Digite um número menor que 1.000.000.");
    return;
}

const extenso = numeroPorExtenso(numero);

resultado.textContent =
    numero.toLocaleString("pt-BR") + " — " + extenso;

window.speechSynthesis.cancel();

const voz = new SpeechSynthesisUtterance(extenso);

voz.lang = "pt-BR";
voz.rate = 0.9;
voz.pitch = 1;
voz.volume = 1;

window.speechSynthesis.speak(voz);


}

botaoFalar.addEventListener("click", falarNumero);

numeroInput.addEventListener("keydown", function(event) {

if (event.key === "Enter") {
    falarNumero();
}


});