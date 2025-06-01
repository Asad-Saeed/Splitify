// Register the configuration as a provider

import { registerAs } from '@nestjs/config';

export const DATABASE_CONFIG = registerAs('DATABASE', () => {
  return {
    MONGO_URI: process.env['MONGO_URI'],
    MONGO_DB_NAME: process.env['MONGO_DB_NAME'],
    getMongoUri: () => {
      return `${process.env['MONGO_URI']}/${process.env['MONGO_DB_NAME']}`;
    },
    isLocal() {
      return process.env['NODE_ENV'] === 'local';
    },
    isProduction() {
      return process.env['NODE_ENV'] === 'production';
    },
    isDevelopment() {
      return process.env['NODE_ENV'] === 'development';
    },
    isStaging() {
      return process.env['NODE_ENV'] === 'staging';
    },
    isTest() {
      return process.env['NODE_ENV'] === 'test';
    },
  };
});
