import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ExpressSession from "express-session";
import * as passport from 'passport';
import { AppModule } from './app.module';
import { deserializeUser, serializeUser } from './auth/42/auth42.serializer';
import { Config } from './config.interface';
import { convertTime } from "./utils/time";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService<Config>);

  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);

  app.enableCors({
    origin: [
      "http://localhost:3000/*",
      "http://localhost:3080/*",
      "https://api.intra.42.fr/*",
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  });

  const session = makeSession();

  app.use(session);
  app.use(passport.initialize());
  app.use(passport.session());

  const port = configService.getOrThrow('BACKEND_PORT');
  await app.listen(port);
}

function makeSession() {
  return ExpressSession({
    resave: false,
    saveUninitialized: false,
    secret: "hello world", // TODO use config
    cookie: {
      maxAge: convertTime({ days: 3 }),
      sameSite: "lax",
      secure: false,
      path: "/",
    },
  });
}

bootstrap();
