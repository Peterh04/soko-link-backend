import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "localhost",
    dialect: "postgres",
    logging: console.log,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connectionn has been established successfully!");
  } catch (err) {
    console.error("Unable to connect", err);
  }
})();

export default sequelize;
