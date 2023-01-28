import axios from 'axios';

export function getWeather(lat, long, timezone) {
  return axios
    .get(
      'https://api.open-meteo.com/v1/forecast?latitude=41.41&longitude=2.15&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&windspeed_unit=ms&timeformat=unixtime',
      {
        params: {
          latitude: lat,
          longitude: long,
          timezone,
        },
      }
    )
    .then(data => {
      // console.log(data.data.daily);
      // return data;
      return {
        current: parseCurrentWeather(data.data),
        daily: parseDailyWeather(data.data),
        // hourly: parseHourlyWeather(data),
      };
    });
}

function parseCurrentWeather({ current_weather, daily }) {
  const {
    temperature: currentTemp,
    windspeed: windSpeed,
    weathercode: iconCode,
  } = current_weather;
  const {
    temperature_2m_max: [maxTemp],
    temperature_2m_min: [minTemp],
    apparent_temperature_max: [maxFeelsLike],
    apparent_temperature_min: [minFeelsLike],
    precipitation_sum: [precip],
  } = daily;
  return {
    currentTemp: Math.round(currentTemp),
    highTemp: Math.round(maxTemp),
    lowTemp: Math.round(minTemp),
    highFeelsLike: Math.round(maxFeelsLike),
    lowFeelsLike: Math.round(minFeelsLike),
    windSpeed: Math.round(windSpeed),
    precip,
    iconCode,
  };
}

function parseDailyWeather({ daily }) {
  return daily.time.map((time, index) => {
    return {
      timestamp: time * 1000,
      iconCode: daily.weathercode[index],
      maxTemp: Math.round(daily.temperature_2m_max[index]),
      // minTemp: Math.round(daily.temperature_2m_min[index]),
    };
  });
}

// NOTE: Stopped video at 33:58
