import timeFormatter from "date-and-time";
import { sendMessage } from "../controllers/WhatsappController.js";
import { WeatherNotification } from "../models/newsWeatherModel.js";
import { Op } from 'sequelize'
import date from "date-and-time";

function jsonEscape(str) {
  return str.replace(/\\n/g, "\\\\n");
}
function messageEscape(str) {
  return str.replace(/\\n/g, "\n");
}

async function notifySubscribers() {
  const now = new Date();
  const notifications = await WeatherNotification.findAll({ 
    where: { 
      response: null,
      schedule_time: {
        [Op.lte]: date.format(now, 'YYYY-MM-DD HH:mm:ss')
      }
    } 
  });

  notifications.forEach(async (n) => {
    var textMessage = JSON.parse(jsonEscape(n.text))[0];

    textMessage.content_text.text = messageEscape(
      textMessage.content_text.text
    );
    await sendMessage(n.telp, textMessage.content_text);

    await WeatherNotification.update(
      { response: 1 }, 
    {
      where: {
        id: n.id,
      },
    });
  });
}

export default notifySubscribers;
