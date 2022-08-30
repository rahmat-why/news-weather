import {
  executeMessage,
  showMessage,
} from "../controllers/NewsWeatherController.js";
import { sendMessage } from "../controllers/WhatsappController.js";
import { Pulau, Subscriber } from "../models/newsWeatherModel.js";

async function selectPulauStage(subscriber, message_id) {
  const allPulau = await Pulau.findAll();
  const messages = await showMessage(message_id);
  console.log(messages);
  var listPulau =
    "\nKirim pulaumu sesuai angka\nKetik 1 untuk Jawa, 2 untuk Sulawesi, dst\n";

  allPulau.forEach((pulau) => {
    listPulau += "\n";
    listPulau += `${pulau.pulau_id}. `;
    listPulau += pulau.name;
  });
  for (let i in messages) {
    var contentText = messages[i].content_text;
    contentText.text = contentText.text.replace(/%list_pulau%/, listPulau);
    contentText.text = contentText.text.replace(/%push_name%/, subscriber.name);
    
    await sendMessage(subscriber.telp, contentText);
  }

  const result = await Subscriber.update(
    {
      state_id: "STATE1",
    },
    {
      where: { telp: subscriber.telp },
    }
  );
  return result;
}

export default selectPulauStage;
