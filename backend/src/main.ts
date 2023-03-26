import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import * as cookieParser from 'cookie-parser';
import * as ExpressSession from 'express-session';
import * as passport from 'passport';
import { AppModule } from 'src/app.module';
import { Config } from 'src/config.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertTime } from 'src/utils/time';
import { SocketAdapter } from './chat/socketAdapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Define websocket settings for the chat page
  app.useWebSocketAdapter(new SocketAdapter(app));

  const config = app.get(ConfigService<Config>);
  const prisma = app.get(PrismaService);

  await prisma.enableShutdownHooks(app);

  setupSwagger(app);
  setupSession(app, config, prisma);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(config.getOrThrow('BACKEND_PORT'));
}

function setupSwagger(app: NestExpressApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ft_transcendence')
    .setDescription('The ft_transcendence API description')
    .setVersion('1.0')
    .addTag(
      'Authentication',
      'Authentication endpoints that are not tied to a specific authentication method',
    )
    .addTag(
      'Authentication/42',
      'Authentication endpoints for the 42 OAuth2 API',
    )
    .addTag(
      'Authentication/Github',
      'Authentication endpoints for the Github OAuth2 API',
    )
    .addTag('Authentication/TOTP', '2-step authentication')
    .addTag('Matches', 'Manipulate matches')
    .addTag('Users', 'Manipulate users')
    .addTag('Docker', 'Endpoints that are relevant to Docker containers')
    .addTag('Avatar', 'Upload user avatars')
    .addTag('Achivement', 'Manipulate achievement')
    .addTag('Statistique', 'Get statistique from match')
    .addTag('Game', 'Create a game vs a friends')
    .addTag('Friend', 'Add friends')
    .build();

  const swagger = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('swagger', app, swagger);
}

function setupSession(
  app: NestExpressApplication,
  config: ConfigService<Config>,
  prisma: PrismaService,
) {
  const session = ExpressSession({
    resave: false,
    saveUninitialized: false,
    secret: config.getOrThrow('SESSION_SECRET'),
    cookie: {
      maxAge: convertTime({ days: 3 }),
      sameSite: 'lax',
      secure: false,
      path: '/',
    },
    store: new PrismaSessionStore(prisma, {}),
  });

  app.use(session);
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());
}

bootstrap();
