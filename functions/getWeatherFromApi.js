import { promisify } from "util";
import request from "request";

const asyncRequest = promisify(request);

async function getWeatherFromApi(cityName) {
  const apiId = process.env.OPENWEATHERMAP_KEY;

  const response = await asyncRequest(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiId}`
  );

  return JSON.parse(response.body);
}

export default getWeatherFromApi;
