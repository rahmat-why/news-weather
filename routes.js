import { Router } from "express";
import response from "./response.js";
import * as WhatsappController from "./controllers/WhatsappController.js";
import * as EtlWeatherController from "./controllers/EtlWeatherController.js";
import notifySubscribers from "./functions/notifySubscribers.js";

const router = Router();

router.post("/webhook", WhatsappController.webhook);
router.post("/etl-weather", EtlWeatherController.etlWeather);
router.post("/notify-subscriber", notifySubscribers);

router.all("*", (req, res) => {
  response(res, 404, false, "The requested url cannot be found.");
});

export default router;
