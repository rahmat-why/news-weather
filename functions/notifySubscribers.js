import timeFormatter from "date-and-time";
import { sendMessage } from "../controllers/WhatsappController.js";
import { WeatherNotification } from "../models/newsWeatherModel.js";

function jsonEscape(str) {
  return str.replace(/\\n/g, "\\\\n");
}
function messageEscape(str) {
  return str.replace(/\\n/g, "\n");
}

async function notifySubscribers() {
  const format = "HH:mm:ss";
  const currentTimeInString = timeFormatter.format(new Date(), format);
  const notifications = await WeatherNotification.findAll();

  notifications.forEach(async (n) => {
    const notificationTime = timeFormatter.parse(n.schedule_time, format);
    const currentTime = timeFormatter.parse(currentTimeInString, format);

    const shouldItPosted = notificationTime - currentTime < 0;

    if (shouldItPosted) {
      var textMessage = JSON.parse(jsonEscape(n.text))[0];

      textMessage.content_text.text = messageEscape(
        textMessage.content_text.text
      );
      await sendMessage(n.telp, textMessage.content_text);
    }
  });
}

export default notifySubscribers;
