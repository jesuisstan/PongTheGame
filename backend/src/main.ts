import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ExpressSession from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';
import { Config } from './config.interface';
import { PrismaService } from './prisma.service';
import { convertTime } from './utils/time';


const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_HOST = 'localhost',
} = process.env;

process.env.DATABASE_URL ??= `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/pong?schema=public`;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService<Config>);
  const prisma = app.get(PrismaService);

  await prisma.enableShutdownHooks(app);

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
