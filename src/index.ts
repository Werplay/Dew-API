import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { configService } from './config/configuration';
//import * as compression from 'compression';
var compression = require('compression');
const CORS_ORIGIN = configService.getCorsOrigin();

const expressServer = express();
const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.use(compression());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    // origin: CORS_ORIGIN,
    // credentials: true,
  });
  await app.init();
};

export const api = functions
  .runWith({
    timeoutSeconds: 300,
    memory: '1GB',
  })
  .region('asia-east1')
  .https.onRequest(async (request, response) => {
    await createFunction(expressServer);
    expressServer(request, response);
  });

async function bootstrap(runLocal: Boolean) {
  if (runLocal) {
    const app = await NestFactory.create(AppModule);
    app.use(compression());
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors();

    // Loading port and starting Server
    const _port = 3000;
    await app.listen(_port);
    console.log('-> Server listening at Port : ', _port);
  }
}
bootstrap(false);
