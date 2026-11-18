
const weatherTypes = {
    0: ["Céu limpo", "☀️"],
    1: ["Predominantemente limpo", "🌤️"],
    2: ["Parcialmente nublado", "⛅"],
    3: ["Nublado", "☁️"],
    45: ["Neblina", "🌫️"],
    48: ["Neblina", "🌫️"],
    51: ["Garoa leve", "🌦️"],
    53: ["Garoa moderada", "🌦️"],
    55: ["Garoa intensa", "🌧️"],
    61: ["Chuva leve", "🌧️"],
    63: ["Chuva moderada", "🌧️"],
    65: ["Chuva forte", "⛈️"],
    71: ["Neve leve", "🌨️"],
    73: ["Neve moderada", "🌨️"],
    75: ["Neve forte", "❄️"],
    80: ["Pancadas de chuva", "🌦️"],
    81: ["Chuva moderada", "🌧️"],
    82: ["Chuva forte", "⛈️"],
    95: ["Trovoadas", "⛈️"],
    96: ["Trovoadas com granizo", "⛈️"],
    99: ["Tempestade forte", "⛈️"]
};

function getWeather(code) {
    return weatherTypes[code] || ["Condição desconhecida", "🌡️"];
}

function formatDate(date) {
    return new Date(date + "T12:00:00")
        .toLocaleDateString("pt-BR", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit"
        });
}

async function searchCity() {
    const cityName = document.getElementById("cityInput").value.trim();

    if (!cityName) {
        alert("Digite uma cidade!");
        return;
    }

    try {
        document.getElementById("status").textContent = "Buscando cidade...";

        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=pt&format=json`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.results || !data.results.length) {
            throw new Error("Cidade não encontrada!");
        }

        const location = data.results[0];

        loadWeather(
            location.latitude,
            location.longitude,
            location.name,
            location.admin1 || location.country || ""
        );

    } catch (error) {
        alert(error.message);
    }
}

async function loadWeather(lat, lon, city, region = "") {
    try {
        document.getElementById("status").textContent = "Atualizando clima...";

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=7`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.current) {
            throw new Error("Dados indisponíveis");
        }

        const current = data.current;
        const weather = getWeather(current.weather_code);

        document.getElementById("city").textContent =
            "📍 " + city + (region ? ", " + region : "");

        document.getElementById("date").textContent =
            new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long"
            });

        document.getElementById("temperature").textContent =
            Math.round(current.temperature_2m) + "°";

        document.getElementById("condition").textContent =
            weather[0] + " • Sensação de " +
            Math.round(current.apparent_temperature) + "°C";

        document.getElementById("weatherIcon").textContent =
            current.is_day ? weather[1] :
            (current.weather_code === 0 ? "🌙" : weather[1]);

        document.getElementById("humidity").textContent =
            current.relative_humidity_2m + "%";

        document.getElementById("wind").textContent =
            current.wind_speed_10m + " km/h";

        document.getElementById("rain").textContent =
            current.precipitation + " mm";

        const forecast = document.getElementById("forecast");
        forecast.innerHTML = "";

        data.daily.time.forEach((date, i) => {
            const condition = getWeather(data.daily.weather_code[i]);

            const card = document.createElement("div");
            card.className = "day";

            card.innerHTML = `
                <p>${i === 0 ? "Hoje" : formatDate(date)}</p>
                <div class="icon">${condition[1]}</div>
                <p class="max">${Math.round(data.daily.temperature_2m_max[i])}°</p>
                <p class="min">${Math.round(data.daily.temperature_2m_min[i])}°</p>
                <p style="font-size:12px;margin-top:12px;color:#b5d5e9">
                    💧 ${data.daily.precipitation_probability_max[i] ?? 0}%
                </p>
            `;

            forecast.appendChild(card);
        });

        document.getElementById("status").textContent =
            "Atualizado às " + new Date().toLocaleTimeString("pt-BR");

    } catch (error) {
        document.getElementById("status").textContent =
            "Erro ao carregar a previsão do tempo.";

        console.error(error);
    }
}

// Pesquisa pelo Enter
document.getElementById("cityInput").addEventListener("keydown", event => {
    if (event.key === "Enter") searchCity();
});

// Localização automática
function useLocation() {
    if (!navigator.geolocation) {
        loadWeather(-23.7, -46.4, "Rio Grande da Serra", "SP");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            loadWeather(
                position.coords.latitude,
                position.coords.longitude,
                "Sua localização"
            );
        },
        () => {
            loadWeather(-23.7, -46.4, "Rio Grande da Serra", "SP");
        }
    );
}

useLocation();
