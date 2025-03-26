document.getElementById('getWeatherBtn').addEventListener('click', function() {
    console.log('Кнопка нажата'); 

    const cityInput = document.getElementById('cityInput').value.trim();
    if (!cityInput) {
        alert('Пожалуйста, введите город или координаты.');
        return;
    }

    const apiKey = 'cdef745ca2ca42169f4203300252402'; 
    const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityInput}&days=3&lang=ru`;

    console.log('Отправка запроса:', apiUrl); 

    const xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl, true);
    xhr.onload = function() {
        console.log('Ответ получен:', xhr.status); 
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            console.log('Данные:', data); 
            if (data.location && data.current) { 
                displayWeather(data);
                displayForecast(data.forecast.forecastday); 
            } else {
                displayError('Ошибка при получении данных.');
            }
        } else if (xhr.status === 403) {
            displayError('Ошибка 403: Доступ запрещён. Проверьте API ключ или лимиты запросов.');
        } else {
            console.error('Ошибка:', xhr.statusText); 
            displayError('Город не найден или произошла ошибка при запросе.');
        }
    };
    xhr.onerror = function() {
        console.error('Ошибка при запросе к API.'); 
        displayError('Произошла ошибка при запросе к API.');
    };
    xhr.send();
});

function displayWeather(data) {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = `
        <h2>${data.location.name}, ${data.location.country}</h2>
        <p>Температура: ${data.current.temp_c}°C (${data.current.temp_f}°F)</p>
        <p>Ощущается как: ${data.current.feelslike_c}°C (${data.current.feelslike_f}°F)</p>
        <p>Влажность: ${data.current.humidity}%</p>
        <p>Скорость ветра: ${data.current.wind_kph} км/ч</p>
        <p>Направление ветра: ${data.current.wind_dir}</p>
        <p>Атмосферное давление: ${data.current.pressure_mb} мбар</p>
        <p>Состояние: ${data.current.condition.text}</p>
        <img class="weather-icon" src="https:${data.current.condition.icon}" alt="${data.current.condition.text}">
    `;
}

function displayForecast(forecastDays) {
    const forecastInfo = document.getElementById('forecastInfo');
    forecastInfo.innerHTML = '<h3>Прогноз на 3 дня:</h3>';

    forecastDays.forEach(day => {
        forecastInfo.innerHTML += `
            <div class="forecast-day">
                <p><strong>${new Date(day.date).toLocaleDateString('ru-RU')}</strong></p>
                <p>Макс. температура: ${day.day.maxtemp_c}°C</p>
                <p>Мин. температура: ${day.day.mintemp_c}°C</p>
                <p>Состояние: ${day.day.condition.text}</p>
                <img class="forecast-icon" src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
            </div>
        `;
    });
}

function displayError(message) {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = `<p class="error">${message}</p>`;
    document.getElementById('forecastInfo').innerHTML = ''; 
}