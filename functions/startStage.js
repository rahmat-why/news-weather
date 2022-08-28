import { sendMessage } from "../controllers/WhatsappController.js";
import { Pulau, Subscriber } from "../models/newsWeatherModel.js";

async function startStage(subscriber, messages) {
  const allPulau = await Pulau.findAll();
  let listPulau = "";

  allPulau.forEach((pulau) => {
    listPulau += "\n";
    listPulau += "- ";
    listPulau += pulau.name;
  });
  messages[0].content_text.text = messages[0].content_text.text.replace(
    /%push_name%/,
    subscriber.name
  );
  messages[1].content_text.text = messages[1].content_text.text.replace(
    /%list_pulau%/,
    listPulau
  );
  // messages.forEach(async (message) => {
  //   await sendMessage(subscriber.telp, message.content_text);
  // });
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

export default startStage;
