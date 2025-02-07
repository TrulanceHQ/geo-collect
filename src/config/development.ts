import { registerAs } from '@nestjs/config';
import *  as dotenv from "dotenv";

// dotenv.config()

// console.log(process.env.DEV_MONGODB_CONNECTION_URL)
export default registerAs('development', () => ({
  mongodbConnectionUrl: process.env.DEV_MONGODB_CONNECTION_URL,
}));
