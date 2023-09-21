const weatherBody = document.querySelector('.weather-body');
const select = document.querySelector('#city-select');

function getCurrentLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      let point = `${latitude},${longitude}`;

      getWeather(point)
        .then((result) => applyWeather(result))
        .catch((err) => {
          alert(`Ups...Something fallen (${err.name})`);
        });
    });
  } else {
    alert('You turned off geolocation. Please turn it on.');
  }
}

getCurrentLocation();

async function getWeather(city) {
  const request = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=9177fdbc25c84170a25170317231909&q=${city}&days=7&aqi=no&alerts=no`
  );

  const result = await request.json();

  return result;
}

function formatUnitHoursText(item, now) {
  let unitHoursText = '';

  if (String(new Date(item.time).getHours()).length === 2) {
    unitHoursText = `${new Date(item.time).getHours()}:00`;
  } else {
    unitHoursText = `0${new Date(item.time).getHours()}:00`;
  }

  if (new Date(item.time).getHours() === now.getHours()) {
    unitHoursText = 'now';
  }

  return unitHoursText;
}

function makeHourForecast(result) {
  const forecastList = document.querySelector('.forecast__list');

  let hourForecast = result.forecast.forecastday[0].hour;
  let now = new Date(Date.now());

  hourForecast.map((item) => {
    const forecastUnit = document.createElement('li');
    forecastUnit.classList.add('forecast__unit');

    const unitHours = document.createElement('span');
    unitHours.classList.add('unit__time');

    const unitTemperature = document.createElement('span');
    unitTemperature.classList.add('unit__temperature');

    unitHours.innerText = formatUnitHoursText(item, now);
    unitTemperature.innerText = `${item.temp_c.toFixed(0)}°`;

    forecastUnit.append(unitHours, unitTemperature);
    forecastList.append(forecastUnit);
  });
}

function makeDayForecast(result) {
  const daysList = document.querySelector('.days__list');
  daysList.innerHTML = null;

  result.forecast.forecastday.map((day) => {
    const dayItem = document.createElement('li');
    dayItem.classList.add('days__item');

    const dayOfweek = document.createElement('span');
    dayOfweek.classList.add('day-of-week');

    const resultDay = new Date(Date.parse(day.date));
    const monthsArr = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    dayOfweek.innerText = `${resultDay.getDate()}  ${
      monthsArr[resultDay.getMonth()]
    }`;

    const dayCondition = document.createElement('span');
    dayCondition.classList.add('day-condition');
    dayCondition.innerText = day.day.condition.text;

    const dayTemperature = document.createElement('span');
    dayTemperature.classList.add('temperature');
    dayTemperature.innerText = `H: ${day.day.mintemp_c.toFixed(
      0
    )}° L: ${day.day.maxtemp_c.toFixed(0)}°`;

    dayItem.append(dayOfweek, dayCondition, dayTemperature);
    daysList.append(dayItem);
  });
}

function applyWeather(result) {
  const location = document.querySelector('.location');
  const currentTemp = document.querySelector('.current-temperature');
  const feelsLikeTemp = document.querySelector('.feels-like');
  const conditionText = document.querySelector('.condition-text');
  const todayMaxMinTemp = document.querySelector('.today__max-min');

  location.innerText = result.location.name;
  currentTemp.innerText = `${result.current.temp_c.toFixed(0)}°C`;
  feelsLikeTemp.innerText = `Feels like ${result.current.feelslike_c.toFixed(
    0
  )}°C`;
  conditionText.innerText = result.current.condition.text;
  todayMaxMinTemp.innerText = `H:${result.forecast.forecastday[0].day.maxtemp_c.toFixed(
    0
  )}° L:${result.forecast.forecastday[0].day.mintemp_c.toFixed(0)}°`;

  makeHourForecast(result);
  makeDayForecast(result);
}

select.addEventListener('change', (e) => {
  if (e.target.value == 'auto') {
    getCurrentLocation();
  } else {
    getWeather(e.target.value).then((result) => applyWeather(result));
  }
});

////////////////// Menu work /////////////////////
const menu = document.querySelector('.weather-menu');
const burger = document.querySelector('.menu-burger');

burger.addEventListener('click', () => {
  menu.classList.toggle('active');
  burger.classList.toggle('active');
  weatherBody.classList.toggle('lock');
});
