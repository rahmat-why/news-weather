import response from "./../response.js";
import {
  Kota,
  Provinsi,
  Pulau,
  Message,
  NextState,
  Weather,
  Subscriber,
} from "../models/newsWeatherModel.js";
import { sendMessage } from "./WhatsappController.js";
import request from "request";

export const storeWeather = async (kota_id, weather, date) => {
  try {
    const show_weather = await showWeather(kota_id, date);
    if (show_weather.length > 0) {
      return false;
    }

    var store_weather = await Weather.create({
      kota_id: kota_id,
      weather: weather,
      date: date,
    });

    return 1;
  } catch (error) {
    console.log(error);
  }

  return 1;
};

export const showKota = async (provinsi_id) => {
  try {
    const show_kota = await Kota.findAll({
      where: {
        provinsi_id: provinsi_id,
      },
    });

    return show_kota;
  } catch (error) {
    console.log(error);
  }
};

export const getKota = async (kota_id) => {
  try {
    const get_kota = await Kota.findOne({
      where: {
        kota_id: kota_id,
      },
    });

    return get_kota;
  } catch (error) {
    console.log(error);
  }
};

export const showProvinsi = async (pulau_id) => {
  try {
    const show_kota = await Provinsi.findAll({
      where: {
        pulau_id: pulau_id,
      },
    });

    return show_kota;
  } catch (error) {
    console.log(error);
  }
};

export const showPulau = async (req, res) => {
  try {
    const show_kota = await Pulau.findAll({});
    res.json(show_kota);
  } catch (error) {
    console.log(error);
  }
};

export const showNextState = async (state_id) => {
  try {
    var next_states = await NextState.findAll({
      where: {
        current_state: state_id,
      },
    });

    return next_states[0];
  } catch (error) {
    console.log(error);
  }
};

export const showMessage = async (message_id) => {
  var messages = await Message.findOne({
    where: {
      message_id: message_id,
    },
  });

  return JSON.parse(messages.content);
};

export const showSubscriber = async () => {
  var subscriber = await Subscriber.findAll({});

  return subscriber;
};

export const executeMessage = async (message_id, telp) => {
  let show_message = await showMessage(message_id);
  for (let i in show_message) {
    var content_text = show_message[i].content_text;
    await sendMessage(telp, content_text);
  }

  return 1;
};

export const showWeather = async (kota_id, date) => {
  try {
    const show_weather = await Weather.findAll({
      where: {
        kota_id: kota_id,
        date: date,
      },
    });

    return show_weather;
  } catch (error) {
    console.log(error);
  }
};

export const updateSubscriber = async (telp, update) => {
  await Subscriber.update(update, {
    where: {
      telp: telp,
    },
  });

  return 1;
};
