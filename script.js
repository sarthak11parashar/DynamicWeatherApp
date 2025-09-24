const apiKey = "91cec1df99d27436dac4289ac5199d82";

const cityEl = document.getElementById("city");
const tempEl = document.getElementById("temperature");
const conditionEl = document.getElementById("condition");
const forecastEl = document.getElementById("forecast");
const refreshBtn = document.getElementById("refreshBtn");
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

function getWeather(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => showWeather(data))
        .catch(err => {
            cityEl.textContent = "Unable to get weather data.";
            console.error("Weather fetch error:", err);
        });
}

function getWeatherByCity(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                showWeather(data);
            } else {
                cityEl.textContent = "City not found!";
                tempEl.textContent = "";
                conditionEl.textContent = "";
                forecastEl.textContent = "";
            }
        })
        .catch(err => {
            cityEl.textContent = "Unable to get weather data.";
            console.error("Weather fetch error:", err);
        });
}

function showWeather(data) {
    cityEl.textContent = `${data.name}, ${data.sys.country}`;
    tempEl.textContent = `Temperature: ${data.main.temp}°C`;
    conditionEl.textContent = `Condition: ${data.weather[0].main}`;
    forecastEl.textContent = `Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} m/s`;
}

function getLocation() {
    if (!navigator.geolocation) {
        cityEl.textContent = "Geolocation not supported by this browser.";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            getWeather(latitude, longitude);
        },
        error => {
            cityEl.textContent = "Location access denied.";
            console.error("Geolocation error:", error);
        }
    );
}

refreshBtn.addEventListener("click", getLocation);

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    }
});

getLocation();
