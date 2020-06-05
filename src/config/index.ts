import { config } from "dotenv";

// set NODE_ENV to development by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

config();

export default {
  port: Number.parseInt(process.env.PORT, 10),
  mongoURL: process.env.MONGODB_URI,
};
