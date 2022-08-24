import request from "request";
import {
  getKota,
  showSubscriber,
  storeWeather,
} from "./NewsWeatherController.js";
import date from "date-and-time";
import schedule from "node-schedule";
import { sendMessage } from "./WhatsappController.js";

export const etlWeather = async () => {
  try {
    const show_subscriber = await showSubscriber();
    for (let i = 0; i < show_subscriber.length; i++) {
      const get_kota = await getKota(show_subscriber[i].kota_id);

      var options = {
        method: "GET",
        url:
          "https://api.openweathermap.org/data/2.5/weather?q=" +
          get_kota.name +
          "&appid=" +
          process.env.OPENWEATHERMAP_KEY,
        headers: {
          "Content-Type": "application/json",
        },
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);

        var response = JSON.parse(response.body);
        var weather = response.weather[0].main;
        const now = new Date();
        let current_time = date.format(now, "YYYY-MM-DD HH:mm:ss");
        console.log([show_subscriber[i].kota_id, weather, current_time]);
        storeWeather(show_subscriber[i].kota_id, weather, current_time);

        return 1;
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const sendCustomMessage = async (req, res) => {
  const subscribers = await showSubscriber();
  const phoneNumber = subscribers[0].telp;

  sendMessage(phoneNumber, {
    text: "p",
  });
};

const job = schedule.scheduleJob("*/1 * * * *", function () {
  etlWeather();
  console.log("etlWeather()");
});
