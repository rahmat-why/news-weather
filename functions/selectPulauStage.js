import { Pulau } from "../models/newsWeatherModel";

async function selectPulauStage() {
  const allPulau = await Pulau.findAll();
  console.log(typeof allPulau);
}
