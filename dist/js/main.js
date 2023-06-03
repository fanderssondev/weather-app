import { getWeather } from './weather';
import { ICON_MAP } from './iconMap';

// https://open-meteo.com/en/docs#latitude=41.41&longitude=2.15&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&windspeed_unit=ms&timeformat=unixtime&timezone=Europe%2FBerlin

navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

function positionSuccess({ coords }) {
  getWeather(
    coords.latitude,
    coords.longitude,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
    .then(renderWeather)
    .catch(e => {
      console.log(e);
      alert('Error getting weather.');
    });
}

function positionError() {
  alert(
    'There was an error getting your location. Please allow use of location and refresh the page.'
  );
}

function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
  document.body.classList.remove('blurred');
}

// Set value of data attribute
function setValue(selector, value, { parent = document } = {}) {
  return (parent.querySelector(`[data-${selector}]`).textContent = value);
}

// Get data attribute
function $(selector, parent = document) {
  return parent.querySelector(`[data-${selector}]`);
}

// Get the icon
// BUG Incorrect file path
function getIconURL(iconCode) {
  return `./dist/icons/${ICON_MAP.get(iconCode)}.svg`;
}

// Render the current weather
const currentIcon = $('current-icon');
function renderCurrentWeather(current) {
  currentIcon.src = getIconURL(current.iconCode);
  setValue('current-temp', current.currentTemp);
  setValue('current-high', current.highTemp);
  setValue('current-low', current.lowTemp);
  setValue('current-fl-high', current.highFeelsLike);
  setValue('current-fl-low', current.lowFeelsLike);
  setValue('current-wind', current.windSpeed);
  setValue('current-precip', current.precip);
}

// Render the daily weather
const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
const dailySection = $('day-section');
const dayCardTemplate = document.getElementById('day-card-template');
function renderDailyWeather(daily) {
  dailySection.innerHTML = '';
  daily.forEach(day => {
    const element = dayCardTemplate.content.cloneNode(true);
    setValue('temp', day.maxTemp, { parent: element });
    setValue('day', DAY_FORMATTER.format(day.timestamp), { parent: element });
    $('icon', element).src = getIconURL(day.iconCode);
    dailySection.append(element);
  });
}

// Render the hourly weather
const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, {
  hour12: false,
  timeStyle: 'short',
});
const hourlySection = $('hour-section');
const hourRowTemplate = document.getElementById('hour-row-template');
function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = '';
  hourly.forEach(hour => {
    const element = hourRowTemplate.content.cloneNode(true);
    setValue('temp', hour.temp, { parent: element });
    setValue('fl-temp', hour.feelsLike, { parent: element });
    setValue('wind', hour.windSpeed, { parent: element });
    setValue('precip', hour.precip, { parent: element });
    setValue('day', DAY_FORMATTER.format(hour.timestamp), { parent: element });
    setValue('time', HOUR_FORMATTER.format(hour.timestamp), {
      parent: element,
    });
    $('icon', element).src = getIconURL(hour.iconCode);
    hourlySection.append(element);
  });
}
