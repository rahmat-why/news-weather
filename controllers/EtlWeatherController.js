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
import getLatLonFromApi from "../functions/getLatLonFromApi.js";
import timeFormatter from "../functions/timeFormatter.js";
import { Message, WeatherNotification, Kota } from "../models/newsWeatherModel.js";

export const etlWeather = async () => {
  try {
    const show_subscriber = await showSubscriber();
    const templateMessage = await Message.findOne({
      where: { message_id: "MSG05" },
    });

    for (let i = 0; i < show_subscriber.length; i++) {
      const subscriber = show_subscriber[i];
      const get_kota = await getKota(subscriber.kota_id);
      const data = await getWeatherFromApi(get_kota.latitude, get_kota.longitude);
      const ct = timeFormatter(data.dt); // ct = current time
      console.log(JSON.stringify([data, get_kota.latitude, get_kota.longitude]))
      if (data === null) {
        return false
      }
      
      var newTemplateMessage = templateMessage.content;
      newTemplateMessage = newTemplateMessage.replace(
        /%name%/,
        subscriber.name
      );
      newTemplateMessage = newTemplateMessage.replace(/%time%/, ct);
      newTemplateMessage = newTemplateMessage.replace(/%city_name%/, get_kota.name);
      newTemplateMessage = newTemplateMessage.replace(
        /%weather%/,
        data.weather[0].main
      );
      newTemplateMessage = newTemplateMessage.replace(
        /%temperature%/,
        parseFloat(data.main.temp-273,15).toFixed(2)
      );

      const now = new Date();
      await WeatherNotification.findOrCreate({
        where: { 
          telp: subscriber.telp,
          schedule_time: date.format(now, 'YYYY-MM-DD HH:mm:ss'),
        },
        defaults: {
          telp: subscriber.telp,
          text: newTemplateMessage,
          kota_id: subscriber.kota_id,
          schedule_time: date.format(now, 'YYYY-MM-DD HH:mm:ss'),
          createdAt: date.format(now, 'YYYY-MM-DD HH:mm:ss'),
          updatedAt: date.format(now, 'YYYY-MM-DD HH:mm:ss')
        }
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

export const etlLatLon = async (req, res) => {
  const kota = await Kota.findAll({
    where: {
      latitude: null 
    }
  })
  for (let i = 0; i < kota.length; i++) {
    const data = await getLatLonFromApi(kota[i].name);
    var latitude = data.data[0].latitude
    var longitude = data.data[0].longitude

    if (data.data[0] === undefined) {
      await Kota.update({
        latitude: 0,
        longitude: 0
      }, {
        where: {
          kota_id: kota[i].kota_id,
        },
      });

      return false
    }

    await Kota.update({
      latitude: latitude,
      longitude: longitude
    }, {
      where: {
        kota_id: kota[i].kota_id,
      },
    });
  }
};
