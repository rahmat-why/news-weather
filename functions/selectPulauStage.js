import {
  executeMessage,
  showMessage,
} from "../controllers/NewsWeatherController.js";
import { sendMessage } from "../controllers/WhatsappController.js";
import { Pulau, Subscriber } from "../models/newsWeatherModel.js";

// Karena parameter subscriberName hanya digunakan pada fungsi selectPulauStage
export async function generateListPulauMessage(subscriberName = undefined) {
  const allPulau = await Pulau.findAll();
  const messages = await showMessage("MSG01");

  var listPulau =
    "\nKirim pulau sesuai angka\nKetik 1 untuk Jawa, 2 untuk Sulawesi, dst\n";

  allPulau.forEach((pulau) => {
    listPulau += "\n";
    listPulau += `${pulau.pulau_id}. `;
    listPulau += pulau.name;
  });
  for (let i in messages) {
    var contentText = messages[i].content_text; // This store a reference to message[i].content_text

    contentText.text = contentText.text.replace(/%list_pulau%/, listPulau);
    contentText.text = contentText.text.replace(/%push_name%/, subscriberName);
  }

  return messages;
}

async function selectPulauStage(subscriber, message_id) {
  const messages = await generateListPulauMessage(subscriber.name);

  for (let i in messages) {
    await sendMessage(subscriber.telp, messages[i].content_text);
  }
  const result = await Subscriber.update(
    { state_id: "STATE1" },
    { where: { telp: subscriber.telp } }
  );

  return result;
}

export default selectPulauStage;
