import { registerAs } from '@nestjs/config';

export const CRON_CONFIG = registerAs('CRON', () => {
  return {
    RUN_ON_BOOTSTRAP: true,
  };
});
