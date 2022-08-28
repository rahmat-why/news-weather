import response from "./../response.js";
import request from "request";
import {
  Message,
  NextState,
  Pulau,
  Subscriber,
} from "../models/newsWeatherModel.js";
import { showMessage } from "./NewsWeatherController.js";
import startStage from "../functions/startStage.js";

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

    console.log("Response Body:", response.body);
    console.log("Response:", response);
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
  let subscriber = await Subscriber.findOrCreate({
    where: { telp },
    include: [
      {
        model: NextState,
        include: [
          {
            model: Message,
          },
        ],
      },
      {
        model: Pulau,
      },
    ],
    defaults: {
      telp,
      name,
      state_id: null,
      pulau_id: null,
      provinsi_id: null,
      kota_id: null,
    },
  });
  let messages;

  if (subscriber.next_state) {
    messages = JSON.parse(subscriber.next_state.message.content);
  } else {
    // Because after a new subscriber is created
    // the response will be an array of subscriber object
    // hence we have to access it with subscriber[0]
    subscriber = subscriber[0];
    messages = await showMessage("MSG01");
  }
  const startStageResult = await startStage(subscriber, messages);
  res.send(startStageResult);
};
