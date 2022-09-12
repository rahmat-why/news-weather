import request from "request";
import {
  getKota,
  showMessage,
  showSubscriber,
  storeWeather,
} from "./NewsWeatherController.js";
import date from "date-and-time";
import { sendMessage } from "./WhatsappController.js";
import getWeatherFromApi from "../functions/getWeatherFromApi.js";
import timeFormatter from "../functions/timeFormatter.js";
import { Message, WeatherNotification } from "../models/newsWeatherModel.js";

export const etlWeather = async () => {
  try {
    const show_subscriber = await showSubscriber();
    const templateMessage = await Message.findOne({
      where: { message_id: "MSG05" },
    });

    for (let i = 0; i < show_subscriber.length; i++) {
      const subscriber = show_subscriber[i];
      const get_kota = await getKota(subscriber.kota_id);
      const data = await getWeatherFromApi(get_kota.name);
      const ct = timeFormatter(data.dt); // ct = current time

      if (data === null) {
        return false
      }
      
      var newTemplateMessage = templateMessage.content;
      newTemplateMessage = newTemplateMessage.replace(
        /%name%/,
        subscriber.name
      );
      newTemplateMessage = newTemplateMessage.replace(/%time%/, ct);
      newTemplateMessage = newTemplateMessage.replace(/%city_name%/, data.name);
      newTemplateMessage = newTemplateMessage.replace(
        /%weather%/,
        data.weather[0].main
      );
      newTemplateMessage = newTemplateMessage.replace(
        /%temperature%/,
        data.main.temp
      );

      await WeatherNotification.create({
        telp: subscriber.telp,
        text: newTemplateMessage,
        kota_id: subscriber.kota_id,
        schedule_time: "06:00:00",
      });
      console.log("Notification was saved to the database!");
    }
  } catch (error) {
    console.log(error);
  }
};

export const sendCustomMessage = async (req, res) => {
  const subscribers = await showSubscriber();
  const messageInDatabase = await showMessage("MSG01");
  // // const message_parse = JSON.parse(messageInDatabase.content);
  // // console.log(message_parse[0].content_text.text);

  // //   const content_text = {
  // //     text: "p_2",
  // //   };
  subscribers.forEach(async (subscriber) => {
    messageInDatabase.forEach(async (msg) => {
      msg.content_text.text = msg.content_text.text.replace(
        /%push_name%/,
        subscriber.name
      );
      const response = await sendMessage(subscriber.telp, msg.content_text);
      console.log(response.body);
    });
  });
};
