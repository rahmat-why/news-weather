// import sequelize
import { Sequelize } from "sequelize";
// import connection
import database from "../config/database.js";

const Kota = database.define("kota", {
  kota_id: {
    primaryKey: true,
    type: Sequelize.STRING,
  },
  provinsi_id: Sequelize.STRING,
  name: Sequelize.STRING,
});

const Provinsi = database.define("provinsi", {
  provinsi_id: {
    primaryKey: true,
    type: Sequelize.STRING,
  },
  pulau_id: Sequelize.STRING,
  name: Sequelize.STRING,
});

const Pulau = database.define(
  "pulau",
  {
    pulau_id: {
      primaryKey: true,
      type: Sequelize.STRING,
    },
    name: Sequelize.STRING,
  },
  {
    freezeTableName: true, // https://stackoverflow.com/a/23187186 to prevent sequelize from automatically add "s" to the table name
  }
);

const NextState = database.define(
  "next_states",
  {
    id: {
      primaryKey: true,
      type: Sequelize.STRING,
    },
    name: Sequelize.STRING,
    current_state: Sequelize.STRING,
    next_state: Sequelize.STRING,
  },
  { timestamps: false }
);

const Message = database.define(
  "messages",
  {
    message_id: {
      primaryKey: true,
      type: Sequelize.STRING,
    },
    content: Sequelize.STRING,
  },
  { timestamps: false }
);

const Weather = database.define("weathers", {
  weather_id: {
    primaryKey: true,
    type: Sequelize.STRING,
  },
  kota_id: Sequelize.STRING,
  weather: Sequelize.STRING,
  date: Sequelize.STRING,
});

const Subscriber = database.define("subscribers", {
  telp: {
    primaryKey: true,
    type: Sequelize.STRING,
  },
  name: Sequelize.STRING,
  state_id: Sequelize.STRING,
  pulau_id: Sequelize.STRING,
  provinsi_id: Sequelize.STRING,
  kota_id: Sequelize.STRING,
});

Subscriber.hasOne(NextState, {
  foreignKey: "current_state",
});
NextState.belongsTo(Subscriber, {
  foreignKey: "current_state",
});

Pulau.hasOne(Subscriber, {
  foreignKey: "pulau_id",
});
Subscriber.belongsTo(Pulau, {
  foreignKey: "pulau_id",
});
Message.hasOne(NextState, {
  foreignKey: "message_id",
});
NextState.belongsTo(Message, {
  foreignKey: "message_id",
});

export { Kota, Provinsi, Pulau, NextState, Message, Weather, Subscriber };
