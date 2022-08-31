import {
  showKota,
  showMessage,
  updateSubscriber,
} from "../controllers/NewsWeatherController.js";
import { sendMessage } from "../controllers/WhatsappController.js";
import { Subscriber } from "../models/newsWeatherModel.js";

async function finalStage(subscriber, message_id, subscriberMessage) {
  // To check whether the "message from subscriber" is a number
  if (+subscriberMessage) {
    const allKota = await showKota(subscriber.provinsi_id);

    for (let i in allKota) {
      // Sama dengannya 2 karena match antara string dengan number
      if (subscriberMessage == allKota[i].kota_id) {
        await updateSubscriber(subscriber.telp, {
          kota_id: allKota[i].kota_id,
        });
        const messages = await showMessage(message_id);

        for (let i in messages) {
          const contentText = messages[i].content_text;
          await sendMessage(subscriber.telp, contentText);
        }

        const result = await Subscriber.update(
          { state_id: "STATE4" },
          { where: { telp: subscriber.telp }, returning: true, plain: true } // https://stackoverflow.com/a/40543424
        );

        console.log({ result });
        return result;

        return 1;
      }
    }

    await sendMessage(subscriber.telp, {
      text: "Kota tidak ditemukan\nKetik */list kota* untuk melihat daftar kota dan cara memilihnya",
    });
  } else {
    await sendMessage(subscriber.telp, {
      text: "Maaf, input yang kamu masukkan salah\nKetik */list kota* untuk melihat daftar kota dan cara memilihnya",
    });
  }
}

export default finalStage;
