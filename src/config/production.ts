import { registerAs } from '@nestjs/config';

export default registerAs('production', () => ({
  mongodbConnectionUrl: process.env.PRODUCTION_MONGODB_CONNECTION_URL,
}));
