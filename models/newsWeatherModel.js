// import sequelize 
import { Sequelize } from "sequelize";
// import connection 
import database from "../config/database.js";

const Kota = database.define('kota', {
    kota_id: {
        primaryKey: true,
        type: Sequelize.STRING,
    },
    provinsi_id: Sequelize.STRING,
    name: Sequelize.STRING
});

const Provinsi = database.define('provinsi', {
    provinsi_id: {
      primaryKey: true,
      type: Sequelize.STRING,
    },
    pulau_id: Sequelize.STRING,
    name: Sequelize.STRING
});

const Pulau = database.define('pulau', {
    pulau_id: {
      primaryKey: true,
      type: Sequelize.STRING,
    },
    name: Sequelize.STRING
});

const NextState = database.define('next_states', {
    id: {
      primaryKey: true,
      type: Sequelize.STRING,
    },
    name: Sequelize.STRING,
    current_states: Sequelize.STRING,
    next_states: Sequelize.STRING
});

const Message = database.define('messages', {
    message_id: {
      primaryKey: true,
      type: Sequelize.STRING,
    },
    content: Sequelize.STRING
});

const Weather = database.define('weathers', {
  weather_id: {
    primaryKey: true,
    type: Sequelize.STRING,
  },
  kota_id: Sequelize.STRING,
  weather: Sequelize.STRING,
  date: Sequelize.STRING
});

const Subscriber = database.define('subscribers', {
  telp: {
    primaryKey: true,
    type: Sequelize.STRING,
  },
  name: Sequelize.STRING,
  state_id: Sequelize.STRING,
  pulau_id: Sequelize.STRING,
  provinsi_id: Sequelize.STRING,
  kota_id: Sequelize.STRING
});

export {
    Kota,
    Provinsi,
    Pulau,
    NextState,
    Message,
    Weather,
    Subscriber
};