import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import * as cookieParser from 'cookie-parser';
import * as ExpressSession from 'express-session';
import helmet from 'helmet';
import * as passport from 'passport';
import { AppModule } from 'src/app.module';
import { Config, NodeEnv } from 'src/config.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertTime } from 'src/utils/time';
import { SocketAdapter } from './chat/socketAdapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(ConfigService<Config>);
  const prisma = app.get(PrismaService);

  // Define websocket settings for the chat page
  app.useWebSocketAdapter(new SocketAdapter(app));

  await prisma.enableShutdownHooks(app);

  setupSwagger(app);
  setupSession(app, config, prisma);
  setupCors(app, config);

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(3000);
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
    .addTag('Friends', 'Add friends')
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

function setupCors(app: NestExpressApplication, config: ConfigService<Config>) {
  const env = config.getOrThrow<NodeEnv>('NODE_ENV');

  switch (env) {
    case 'development':
      app.enableCors({
        credentials: true,
        origin: config.getOrThrow('FRONTEND_URL'),
      });
      break;
    case 'production':
      app.set('trust proxy', 1);
      app.setGlobalPrefix('/api');
      break;
  }
}

bootstrap();
