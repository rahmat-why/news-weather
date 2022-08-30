import request from "request";
import { Kota, Subscriber } from "../models/newsWeatherModel.js";
import { showNextState } from "./NewsWeatherController.js";
import selectPulauStage from "../functions/selectPulauStage.js";
import selectProvinsiStage from "../functions/selectProvinsiStage.js";
import selectKotaStage from "../functions/selectKotaStage.js";
import finalStage from "../functions/finalStage.js";
import timeFormatter from "../functions/timeFormatter.js";

export const sendMessage = async (receiver, content_text) => {
  console.log(receiver, content_text);
  const url = "https://api.angel-ping.my.id/chats/send";
  const option = {
    headers: {
      "angel-key": "ECOM.c9dc7e29c8dg44e30F",
      "Content-Type": "application/json",
    },
    body: {
      receiver: receiver,
      message: content_text,
    },
    json: true,
  };
  request.post(url, option, (error, response) => {
    if (error) throw new Error(error);

    // console.log("Response Body:", response.body);
    // console.log("Response:", response);
    console.log(response.body.message);
  });

  //   request(options, function (error, response) {
  //     if (error) throw new Error(error);
  //     console.log("Response Body:", response.body);
  //     console.log("Response:", response);
  //   });

  return 1;
};

export const webhook = async (req, res) => {
  const { telp, name, message: subscriberMessage, fromMe, id } = req.body.key;

  var subscriber = await Subscriber.findOrCreate({
    where: { telp },
    defaults: {
      telp,
      name,
      state_id: null,
      pulau_id: null,
      provinsi_id: null,
      kota_id: null,
    },
  });

  // The response will be an array of subscriber object
  // hence we have to access it with subscriber[0]
  var subscriber = subscriber[0];

  if (subscriberMessage === "/getweather") {
    if (subscriber.kota_id) {
      const kota_id = subscriber.kota_id;
      const subscriberCity = await Kota.findOne({ where: { kota_id } });
      const cityName = subscriberCity.name
        .toLowerCase()
        .replace("kabupaten", "") // karena jika query dengan kabupaten hasilnya = kota tidak ditemukan
        .trim();
      const apiId = process.env.OPENWEATHERMAP_KEY;

      request(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiId}`,

        (err, response, data) => {
          if (err) {
            return console.log(err);
          }
          data = JSON.parse(data); // Cause the response data is a string
          const ct = timeFormatter(data.dt); // ct = current time
          var weatherToday = "";
          weatherToday += `Kota: ${data.name}\n`;
          weatherToday += `Keadaan: ${data.weather[0].main}\n`;
          weatherToday += `Temperatur: ${data.main.temp}`;
          return sendMessage(subscriber.telp, {
            text: `Cuaca Hari Ini\nLast Updated: ${ct}\n\n${weatherToday}`,
          });
        }
      );
    } else {
      sendMessage(subscriber.telp, {
        text: "Kamu belum subscribe",
      });
    }

    return 1;
  }

  const show_next_state = await showNextState(subscriber.state_id);
  // const execute_message = await executeMessage(show_next_state.message_id, telp)

  var update = {
    state_id: show_next_state.next_state,
  };
  // const update_subscriber = await updateSubscriber(telp, update);

  // res.json(show_next_state);

  const nextState = show_next_state.next_state;
  console.log(show_next_state.message_id);
  console.log(nextState);
  // FUNCTION REGEX PULAU
  if (nextState === "STATE1")
    await selectPulauStage(subscriber, show_next_state.message_id);
  // FUNCTION REGEX PROVINSI BERDASARKAN PULAU
  else if (nextState === "STATE2") {
    const result = await selectProvinsiStage(
      subscriber,
      show_next_state.message_id,
      subscriberMessage
    );
    res.json(result);
  }
  // FUNCTION REGEX KOTA BERDASARKAN PROVINSI
  else if (nextState === "STATE3") {
    await selectKotaStage(
      subscriber,
      show_next_state.message_id,
      subscriberMessage
    );
  }
  // FUNCTION UPDATE PULAU, PROVINSI, KOTA SUBSCRIBER
  else if (nextState === "STATE4") {
    await finalStage(subscriber, show_next_state.message_id, subscriberMessage);
  }

  return false;
};
