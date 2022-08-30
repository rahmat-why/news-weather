import {
  showMessage,
  showProvinsi,
  updateSubscriber,
} from "../controllers/NewsWeatherController.js";
import { sendMessage } from "../controllers/WhatsappController.js";
import { Pulau, Subscriber } from "../models/newsWeatherModel.js";

async function selectProvinsiStage(subscriber, message_id, subscriberMessage) {
  // To check whether the "message from subscriber" is a number
  if (+subscriberMessage) {
    const allPulau = await Pulau.findAll();
    for (let i in allPulau) {
      // Sama dengannya 2 karena match antara string dengan number
      if (subscriberMessage == allPulau[i].pulau_id) {
        await updateSubscriber(subscriber.telp, {
          pulau_id: allPulau[i].pulau_id,
        });
        const allProvinsi = await showProvinsi(allPulau[i].pulau_id);
        var listProvinsi = "\n";
        const messages = await showMessage(message_id);

        for (let i in allProvinsi) {
          const provinsi = allProvinsi[i];

          listProvinsi += "\n";
          listProvinsi += `${provinsi.provinsi_id}. `;
          listProvinsi += provinsi.name;
        }

        for (let i in messages) {
          const contentText = messages[i].content_text;

          contentText.text = contentText.text.replace(
            /%list_provinsi%/,
            listProvinsi
          );
          await sendMessage(subscriber.telp, contentText);
        }
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
      text: "Kirim yang benar",
    });
  }
}

export default selectProvinsiStage;
