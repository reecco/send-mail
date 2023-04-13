import { config } from "dotenv";

config();

export default {
  PORT: process.env.PORT || "3000",
  USER:  process.env.EMAIL_USER,
  PASSWORD: process.env.EMAIL_PASSWORD,
  TOKEN: process.env.TOKEN,
  SECRET_JWT: process.env.SECRET_JWT
}