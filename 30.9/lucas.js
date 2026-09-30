let segundos = 0;
let intervalo = null;

const display = document.getElementById("display");
const iniciar = document.getElementById("iniciar");
const pausar = document.getElementById("pausar");
const zerar = document.getElementById("zerar");

function atualizar() {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const seg = segundos % 60;

    display.textContent =
        String(horas).padStart(2, "0") + ":" +
        String(minutos).padStart(2, "0") + ":" +
        String(seg).padStart(2, "0");
}

iniciar.onclick = function () {

    if (intervalo !== null) {
        return;
    }

    intervalo = setInterval(function () {
        segundos++;
        atualizar();
    }, 1000);
};

pausar.onclick = function () {

    clearInterval(intervalo);
    intervalo = null;
};

zerar.onclick = function () {

    clearInterval(intervalo);
    intervalo = null;

    segundos = 0;

    atualizar();
};

atualizar();
