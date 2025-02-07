import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();
console.log('From Config', process.env.DEVELOPMENT_MONGODB_CONNECTION_URL);
export default registerAs('development', () => ({
  mongodbConnectionUrl: process.env.DEVELOPMENT_MONGODB_CONNECTION_URL,
}));
