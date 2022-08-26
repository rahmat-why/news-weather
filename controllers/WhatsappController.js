import response from "./../response.js";
import request from "request";
import {
  Message,
  NextState,
  Pulau,
  Subscriber,
} from "../models/newsWeatherModel.js";

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
  const { telp, name, message: userMessage, fromMe, id } = req.body.key;
  const subscriber = await Subscriber.findOne({
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
  });
  if (subscriber) {
    const messages = JSON.parse(subscriber.next_state.message.content);
    messages.forEach(async (message) => {
      message.content_text.text = message.content_text.text.replace(
        /%push_name%/,
        subscriber.name
      );
      res.send(subscriber);
      // const response = await sendMessage(subscriber.telp, message.content_text);
      // res.send(response);
    });
    res.send(subscriber);
  } else {
    res.status(500).send({ message: "Subscriber does not exist" });
    // const newSubscriber = await Subscriber.findOrCreate({
    //   where: {
    //     telp,
    //   },
    //   defaults: {
    //     telp,
    //     name,
    //     state_id: null,
    //     pulau_id: null,
    //     provinsi_id: null,
    //     kota_id: null,
    //   },
    // });
    // console.log(newSubscriber);
  }
};
