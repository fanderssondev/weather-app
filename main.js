import { getWeather } from './weather';

getWeather(41.41, 2.15, Intl.DateTimeFormat().resolvedOptions().timeZone).then(
  result => {
    console.log(data);
  }
);
