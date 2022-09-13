import {
  showMessage,
  showProvinsi,
  updateSubscriber,
} from "../controllers/NewsWeatherController.js";
import { sendMessage } from "../controllers/WhatsappController.js";
import { Pulau, Subscriber } from "../models/newsWeatherModel.js";

export async function generateListProvinsiMessage(pulau_id) {
  const allProvinsi = await showProvinsi(pulau_id);
  var listProvinsi = "\n";
  const messages = await showMessage("MSG02");

  for (let i in allProvinsi) {
    const provinsi = allProvinsi[i];

    listProvinsi += "\n";
    listProvinsi += `${provinsi.provinsi_id}. `;
    listProvinsi += provinsi.name;
  }

  for (let i in messages) {
    var contentText = messages[i].content_text;
    contentText.text = contentText.text.replace(
      /%list_provinsi%/,
      listProvinsi
    );
  }

  return messages[0];
}

async function selectProvinsiStage(subscriber, message_id, subscriberMessage) {
  // To check whether the "message from subscriber" is a number
  if (+subscriberMessage) {
    const allPulau = await Pulau.findAll();
    for (let i in allPulau) {
      // Sama dengannya 2 karena match antara string dengan number
      if (subscriberMessage == allPulau[i].pulau_id) {
        const message = await generateListProvinsiMessage(allPulau[i].pulau_id);
        await updateSubscriber(subscriber.telp, {
          pulau_id: allPulau[i].pulau_id,
        });
        await sendMessage(subscriber.telp, message.content_text);

        const result = await Subscriber.update(
          { state_id: "STATE2" },
          { where: { telp: subscriber.telp } }
        );

        return result;
      }
    }
    await sendMessage(subscriber.telp, { text: "Pulau tidak ditemukan" });
  } else {
    await sendMessage(subscriber.telp, {
      text: "Maaf, input yang kamu masukkan salah\nKetik */list pulau* untuk melihat daftar pulau dan cara memilihnya",
    });
  }
}

export default selectProvinsiStage;
