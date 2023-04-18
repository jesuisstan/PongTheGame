import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Config } from 'src/config.interface';

// see https://docs.nestjs.com/recipes/prisma#use-prisma-client-in-your-nestjs-services
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(config: ConfigService<Config>) {
    super({
      datasources: {
        db: {
          url: config.getOrThrow('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async function () {
      await app.close();
    });
  }

  cleanDb() {
    return this.$transaction([
      this.achievement.deleteMany(),
      this.match.deleteMany(),
      this.user.deleteMany(),
      this.matchEntry.deleteMany(),
      this.chatRoom.deleteMany(),
      this.session.deleteMany(),
    ]);
  }
}
