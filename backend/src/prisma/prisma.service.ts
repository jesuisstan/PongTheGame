import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// see https://docs.nestjs.com/recipes/prisma#use-prisma-client-in-your-nestjs-services
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      datasources : {
        db : {
          url : process.env.DATABASE_URL,
        }
      }
    })
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async function () {
      await app.close();
    });
  }

  cleanDb(){
    return this.$transaction([
      this.achievement.deleteMany(),
      this.friends.deleteMany(),
      this.match.deleteMany(),
      this.user.deleteMany(),
      this.matchEntry.deleteMany(),
      this.session.deleteMany(),
    ]);
  }
}
