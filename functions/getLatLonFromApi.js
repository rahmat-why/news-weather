import { promisify } from "util";
import request from "request";

const asyncRequest = promisify(request);

async function getLatLonFromApi(cityName) {
  const apiId = process.env.OPENPOSITION_KEY;
  
  const response = await asyncRequest(
    `http://api.positionstack.com/v1/forward?access_key=${apiId}&query=${cityName}`
  );

  return JSON.parse(response.body);
}

export default getLatLonFromApi;
