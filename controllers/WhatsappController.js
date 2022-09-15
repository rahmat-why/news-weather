import request from "request";
import { Kota, Pulau, Subscriber, WeatherNotification } from "../models/newsWeatherModel.js";
import { showNextState } from "./NewsWeatherController.js";
import selectPulauStage, {
  generateListPulauMessage,
} from "../functions/selectPulauStage.js";
import selectProvinsiStage, {
  generateListProvinsiMessage,
} from "../functions/selectProvinsiStage.js";
import selectKotaStage, {
  generateListKotaMessage,
} from "../functions/selectKotaStage.js";
import finalStage from "../functions/finalStage.js";
import timeFormatter from "../functions/timeFormatter.js";

export const sendMessage = async (receiver, content_text) => {
  console.log(receiver, content_text);
  const url = "https://api.angel-ping.my.id/chats/send";
  const option = {
    headers: {
      "angel-key": "ECOM.c9dc7e39c892544e815",
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

    return response
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

  if (subscriberMessage === "/set-kota") {
    await Subscriber.destroy({ where: { telp } });
  }

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
  const show_next_state = await showNextState(subscriber.state_id);

  if (subscriberMessage.includes("/list")) {
    var payload = subscriberMessage.split(" ")[1];

    if (payload) {
      payload = payload.toLowerCase();

      if (payload === "pulau") {
        const messages = await generateListPulauMessage();
        await sendMessage(subscriber.telp, messages[1].content_text);
      } else if (payload === "provinsi") {
        if (subscriber.pulau_id) {
          const message = await generateListProvinsiMessage(
            subscriber.pulau_id
          );
          return sendMessage(subscriber.telp, message.content_text);
        } else {
          return sendMessage(subscriber.telp, {
            text: "Kamu belum bisa mengakses fitur ini",
          });
        }
      } else if (payload === "kota") {
        if (subscriber.provinsi_id && subscriber.pulau_id) {
          const message = await generateListKotaMessage(subscriber.provinsi_id);
          return sendMessage(subscriber.telp, message.content_text);
        } else {
          return sendMessage(subscriber.telp, {
            text: "Kamu belum bisa mengakses fitur ini",
          });
        }
      } else {
        await sendMessage(subscriber.telp, {
          text: "ini adalah list command dengan payload " + payload,
        });
      }
    } else {
      await sendMessage(subscriber.telp, {
        text: "ini adalah list command",
      });
    }
    return true;
  }
  if (subscriberMessage === "/getweather") {
    if (subscriber.kota_id) {
      const last_weather = await WeatherNotification.findOne({
        where: { telp: subscriber.telp },
      });

      if (last_weather === null) {
        await sendMessage(subscriber.telp, {
          text: `silahkan cobalagi nanti`,
        });

        return false
      }

      const message = JSON.parse(last_weather.text)
      for (let i = 0; i < message.length; i++) {
        await sendMessage(subscriber.telp, message[i].content_text); 
      }
    } else {
      await sendMessage(subscriber.telp, {
        text: `Kamu belum subscribe`,
      });
    }
    return 1;
  }
  if (subscriberMessage === "/help") {
    return sendMessage(subscriber.telp, {
      text: "Untuk feedback boleh banget disampaikan disini https://docs.google.com/forms/d/e/1FAIpQLSfeONuWyIXHIhfzqkinaOY16PTZ0JskThD8shEXxBH38oFqqA/viewform",
    });
  }
  if (subscriber.kota_id)
    return sendMessage(subscriber.telp, {
      text: `Halo ${subscriber.name}, berikut list perintah yang tersedia\n\n/getweather - melihat cuaca saat ini\n/help - panduan penggunaan bot\n\n untuk feedback boleh banget nih sampaikan disini https://docs.google.com/forms/d/e/1FAIpQLSfeONuWyIXHIhfzqkinaOY16PTZ0JskThD8shEXxBH38oFqqA/viewform`,
    });
  const nextState = show_next_state.next_state;

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
