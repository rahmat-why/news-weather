import "dotenv/config";
import express from "express";
import nodeCleanup from "node-cleanup";
import routes from "./routes.js";
import cors from "cors";
import { scheduleJob } from "node-schedule";
import { etlWeather } from "./controllers/EtlWeatherController.js";
import notifySubscribers from "./functions/notifySubscribers.js";

const app = express();

const host = process.env.HOST || undefined
const port = parseInt(process.env.PORT ?? 3003)

const corsOptions = {
  credentials: true,
  origin: "http://localhost:3000",
};

scheduleJob("0 0 01 * * *", async () => await etlWeather()); // setiap jam 1 malam
scheduleJob("* * * * *", async () => await notifySubscribers()); // setiap menit

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", cors(corsOptions), routes);

const listenerCallback = () => {
  console.log(
    `Server is listening on http://${host ? host : "localhost"}:${port}`
  );
};

if (host) {
  app.listen(port, host, listenerCallback);
} else {
  app.listen(port, listenerCallback);
}

export default app;
