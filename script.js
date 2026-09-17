async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();
    const error = document.getElementById("error");

    if (city === "") {
        error.textContent = "Please enter a city name.";
        return;
    }

    error.textContent = "Loading...";

    try {

        // Find the city
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const locationData = await locationResponse.json();

        if (!locationData.results) {
            error.textContent = "City not found. Please try another city.";
            return;
        }

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Get weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto`
        );

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Display city
        document.getElementById("city").textContent =
            `${location.name}, ${location.country}`;

        // Display date
        document.getElementById("date").textContent =
            new Date().toDateString();

        // Display temperature
        document.getElementById("temperature").textContent =
            Math.round(current.temperature_2m);

        // Display humidity
        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m}%`;

        // Display wind
        document.getElementById("wind").textContent =
            `${current.wind_speed_10m} km/h`;

        // Display feels like
        document.getElementById("feelsLike").textContent =
            `${Math.round(current.apparent_temperature)}°C`;

        // Display weather condition
        document.getElementById("condition").textContent =
            getWeatherCondition(current.weather_code);

        error.textContent = "";

    } catch (err) {

        error.textContent =
            "Something went wrong. Please check your internet connection.";

    }
}


// Convert weather code into a readable condition
function getWeatherCondition(code) {

    if (code === 0) {
        return "☀️ Clear Sky";
    }

    if (code >= 1 && code <= 3) {
        return "⛅ Partly Cloudy";
    }

    if (code >= 45 && code <= 48) {
        return "🌫️ Foggy";
    }

    if (code >= 51 && code <= 67) {
        return "🌧️ Rainy";
    }

    if (code >= 71 && code <= 77) {
        return "❄️ Snowy";
    }

    if (code >= 80 && code <= 82) {
        return "🌦️ Rain Showers";
    }

    if (code >= 95) {
        return "⛈️ Thunderstorm";
    }

    return "🌤️ Unknown";
}


// Press Enter to search
document.getElementById("cityInput").addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});
