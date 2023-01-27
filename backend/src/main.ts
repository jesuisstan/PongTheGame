import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ExpressSession from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';
import { deserializeUser, serializeUser } from './auth/42/auth42.serializer';
import { Config } from './config.interface';
import { PrismaService } from './prisma.service';
import { convertTime } from './utils/time';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService<Config>);
  const prisma = app.get(PrismaService);

  await prisma.enableShutdownHooks(app);

  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);

  const session = makeSession(config.getOrThrow('SESSION_SECRET'));
  const port = config.getOrThrow('BACKEND_PORT');

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(session);
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port);
}

function makeSession(secret: string) {
  return ExpressSession({
    resave: false,
    saveUninitialized: false,
    secret: secret,
    cookie: {
      maxAge: convertTime({ days: 3 }),
      sameSite: 'lax',
      secure: false,
      path: '/',
    },
  });
}

bootstrap();
