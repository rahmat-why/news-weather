import { sendMessage } from "../controllers/WhatsappController.js";
import { Pulau } from "../models/newsWeatherModel.js";

async function selectPulauStage(subscriber, messages, subscriberMessage) {
  // To check whether the "message from subscriber" is a number
  if (+subscriberMessage) {
    const allPulau = await Pulau.findAll();
    console.log(typeof allPulau);
  } else {
    console.log("Kirim yang benar");
    // await sendMessage(subscriber, {
    //   text: "Kirim id pulau yang benar",
    // });
  }
}

export default selectPulauStage;
