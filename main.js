import { ICON_MAP } from './iconMap';
import { getWeather } from './weather';

getWeather(41.41, 2.15, Intl.DateTimeFormat().resolvedOptions().timeZone)
  .then(renderWeather)
  .catch(e => {
    console.log(e);
    alert('Error getting weather');
  });

function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
  document.body.classList.remove('blurred');
}

function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

function $(selector, parent = document) {
  return parent.querySelector(`[data-${selector}]`);
}

function getIconURL(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`;
}

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

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
const dailySection = $('day-section');
const dayCardTemplate = document.getElementById('day-card-template');
function renderDailyWeather(daily) {
  dailySection.innerHTML = '';
  daily.forEach(day => {
    const element = dayCardTemplate.content.cloneNode(true);
    setValue('temp', day.maxTemp, { parent: element });
    setValue('day', DAY_FORMATTER.format(day.timestamp), { parent: element });
    // element.querySelector('[data-icon]').src = getIconURL(day.iconCode);
    $('icon', element).src = getIconURL(day.iconCode);
    dailySection.append(element);
  });
}

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: 'numeric' });
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
    setValue('time', HOUR_FORMATTER.format(hour.timestamp), { parent: element });
    element.querySelector('[data-icon]').src = getIconURL(hour.iconCode);
    // $('icon', element).src = getIconURL(hour.iconCode);
    hourlySection.append(element);
  }
}
