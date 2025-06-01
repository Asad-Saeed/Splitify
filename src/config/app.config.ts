export const APP_CONFIG = () => {
  return {
    APP_NAME: process.env['APP_NAME'],
    APP_PORT: process.env['APP_PORT'],
    APP_EMAIL: {
      SUPPORT_EMAIL: process.env['SUPPORT_EMAIL'],
    },
  };
};
