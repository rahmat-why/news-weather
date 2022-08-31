import {
  showKota,
  showMessage,
  showProvinsi,
  updateSubscriber,
} from "../controllers/NewsWeatherController.js";
import { sendMessage } from "../controllers/WhatsappController.js";
import { Subscriber } from "../models/newsWeatherModel.js";

export async function generateListKotaMessage(provinsi_id) {
  const allKota = await showKota(provinsi_id);
  var listKota = "\n";
  const messages = await showMessage("MSG03");

  for (let i in allKota) {
    const kota = allKota[i];

    listKota += "\n";
    listKota += `${kota.kota_id}. `;
    listKota += kota.name;
  }

  for (let i in messages) {
    const contentText = messages[i].content_text;
    contentText.text = contentText.text.replace(/%list_kota%/, listKota);
  }

  return messages[0];
}

async function selectKotaStage(subscriber, message_id, subscriberMessage) {
  // To check whether the "message from subscriber" is a number
  if (+subscriberMessage) {
    const allProvinsi = await showProvinsi(subscriber.pulau_id);
    for (let i in allProvinsi) {
      // Sama dengannya 2 karena match antara string dengan number
      if (subscriberMessage == allProvinsi[i].provinsi_id) {
        var provinsi_id = allProvinsi[i].provinsi_id;

        await updateSubscriber(subscriber.telp, { provinsi_id });
        const message = await generateListKotaMessage(provinsi_id);
        await sendMessage(subscriber.telp, message.content_text);

        const result = await Subscriber.update(
          { state_id: "STATE3" },
          { where: { telp: subscriber.telp }, returning: true, plain: true } // https://stackoverflow.com/a/40543424
        );

        console.log({ result });
        return result;
      }
    }
    await sendMessage(subscriber.telp, {
      text: "Provinsi tidak ditemukan\nKetik */list provinsi* untuk melihat daftar provinsi dan cara memilihnya",
    });
  } else {
    await sendMessage(subscriber.telp, {
      text: "Maaf, input yang kamu masukkan salah\nKetik */list provinsi* untuk melihat daftar provinsi dan cara memilihnya",
    });
  }
}

export default selectKotaStage;
