/* eslint-disable */
require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public serverPort() {
    return this.getValue('PORT', false) || 3000;
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getCorsOrigin() {
    return this.getValue('CORS_ORIGIN').split(',');
  }
}

const requiredConfig = [
  'MONGO_URL',
  'MORALIS_KEY',
  'RPC',
  'TOKEN_ADDRESS',
  'COHORT_ADDRESS',
  'CORS_ORIGIN',
  'JWT_TOKEN_EXPIRES_IN',
  'JWT_TOKEN_ISSUER',
  'JWT_TOKEN_SECRET',
  'ESSENTIAL_TOKEN_LIFE',
];

const configService = new ConfigService(process.env).ensureValues(
  requiredConfig,
);

export { configService };
