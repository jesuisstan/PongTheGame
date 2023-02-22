import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppModule } from 'src/app.module';
import { ConfigService } from '@nestjs/config';
import { AchievementDTO } from 'src/achievement/dto/achievement.dto';
import { SocketAdapter } from 'src/chat/socketAdapter';

function JWT_access(id: number) {
  const jwt: JwtService = new JwtService();
  const config: ConfigService = new ConfigService();
  const secret = config.get('JWT_SECRET');

  const token = jwt.signAsync(
    { id: id },
    {
      expiresIn: '15m',
      secret: secret,
    },
  );
  return token;
}

async function create_user(prisma: PrismaService) {
  if ((await prisma.user.findMany({})).length == 0) {
    // MEMO User 1 create
    await prisma.user.create({
      data: {
        nickname: 'Admin1',
        username: 'Admin1',
        profileId: '41',
        provider: '41',
        role: 'ADMIN',
      },
    });
    // MEMO User 2 create
    await prisma.user.create({
      data: {
        nickname: 'Admin2',
        username: 'Admin2',
        profileId: '42',
        provider: '42',
        role: 'USER',
      },
    });
  }
}

describe('Appe@e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  jest.setTimeout(9999);
  beforeAll(async () => {
    const refModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = refModule.createNestApplication();
    app.useWebSocketAdapter(new SocketAdapter(app));
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await create_user(prisma);
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    prisma = app.get(PrismaService);
    // await prisma.cleanDb();
    app.close();
  });

  // describe('All test', async () => {
  describe('Match', () => {
    // it('Should thrown not connected', async () => {
    //   return pactum.spec().post('/match').expectStatus(401);
    // });
    // it('Should thrown no body send', async () => {
    //   const token = await JWT_access(2);
    //   return pactum
    //     .spec()
    //     .post('/match')
    //     .withHeaders({
    //       Authorization: 'Bearer ' + token,
    //     })
    //     .expectStatus(400);
    // });
    // it('Should thrown only 1 users send', async () => {
    //   const token = await JWT_access(2);
    //   return pactum
    //     .spec()
    //     .post('/match')
    //     .withHeaders({
    //       Authorization: 'Bearer ' + token,
    //     })
    //     .withBody({
    //       user1: 1,
    //     })
    //     .expectStatus(400);
    // });
    // it('Should thrown bad id send', async () => {
    //   const token = await JWT_access(2);
    //   return pactum
    //     .spec()
    //     .post('/match')
    //     .withHeaders({
    //       Authorization: 'Bearer ' + token,
    //     })
    //     .withBody({
    //       user1: 15,
    //     })
    //     .expectStatus(400);
    // });
    // it('Should thrown the same users send 2 times', async () => {
    //   const token = await JWT_access(2);
    //   return pactum
    //     .spec()
    //     .post('/match')
    //     .withHeaders({
    //       Authorization: 'Bearer ' + token,
    //     })
    //     .withBody({
    //       user1: 1,
    //       user2: 1,
    //     })
    //     .expectStatus(400);
    // });
    // it('Should works', async () => {
    //   const token = await JWT_access(2);
    //   return pactum
    //     .spec()
    //     .post('/match')
    //     .withHeaders({
    //       Authorization: 'Bearer ' + token,
    //     })
    //     .withBody({
    //       user1: 1,
    //       user2: 2,
    //     })
    //     .expectStatus(201);
    // });
    describe('mine', () => {
      it('Should thrown not connected', async () => {
        return pactum.spec().get('/match/mine').expectStatus(401);
      });
      // it('Should thrown no match play', async () => {
      //   const token = await JWT_access(2);
      //   return pactum.spec().get('/match/mine').withHeaders(
      //     {
      //       Authorization : 'Bearer ' + token,
      //     }).expectStatus(404);
      // })
    });
    describe(':id', () => {
      it('should thrown not connected', async () => {
        return pactum.spec().get('/match/0').expectStatus(401);
      });
      it('Should thrown with a bad id', async () => {
        const token = await JWT_access(2);
        return pactum
          .spec()
          .get('/match/0')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .expectStatus(404);// Why 401
      });
      // it('Should work', async () => {
      //   const token = await JWT_access(2);
      //   return pactum.spec().get('/match/2').withHeaders({
      //     Authorization : 'Bearer ' + token,
      //   }).expectStatus(200);// MEMO ???
      // })
    });
  });
  describe('Users', () => {
    describe(':id', () => {
      // it('Should thrown not connected', async () => {
      //   return pactum.spec().get('/user/1',).expectStatus(401);
      // });
      it('Should thrown with a bad id', async () => {
        const token = await JWT_access(2);
        return pactum
          .spec()
          .get('/user/0')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .expectStatus(404);
      });
      it('Should work', async () => {
        const token = await JWT_access(2);
        return pactum
          .spec()
          .get('/user/1')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .expectStatus(200);
      });
    });
    describe('setnickname', () => {
      it('Should thrown not connected', async () => {
        return pactum.spec().patch('/user/setnickname').expectStatus(401);
      });
      it('Should thrown no body', async () => {
        const token = await JWT_access(2);
        return pactum
          .spec()
          .patch('/user/setnickname')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .expectStatus(400);
      });
      it('Should work', async () => {
        const token = await JWT_access(2);
        return pactum
          .spec()
          .patch('/user/setnickname')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .withBody({
            nickname: 'test',
          })
          .expectStatus(200);
      });
      it('Should thrown change with same nickname', async () => {
        const token = await JWT_access(2);
        return pactum
          .spec()
          .patch('/user/setnickname')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .withBody({
            nickname: 'test',
          })
          .expectStatus(400);
      });
      it('', async () => {
        const token = await JWT_access(2);
        return pactum
          .spec()
          .patch('/user/setnickname')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .withBody({
            nickname: 'Admin2',
          })
          .expectStatus(200);
      });
    });
    // describe('2fa', () => {
    //   it('Should thrown not connected', async () => {
    //     return pactum.spec().patch('/user/2fa').expectStatus(401);
    //   });
    //   // it('Should thrown no body', async () => {// MEMO No error because DTO dont have notempty
    //   //   const token = await JWT_access(2);
    //   //   return pactum.spec().patch('/user/2fa',).withHeaders({
    //   //     Authorization : 'Bearer ' + token,}).expectStatus(400);
    //   // });
    //   it('Should work', async () => {
    //     const token = await JWT_access(2);
    //     return pactum
    //       .spec()
    //       .patch('/user/2fa')
    //       .withHeaders({
    //         Authorization: 'Bearer ' + token,
    //       })
    //       .withBody({
    //         enabled: true,
    //       })
    //       .expectStatus(200);
    //   });
    // });
  });
  describe('Achievement', () => {
    const dto: AchievementDTO = {
      Name: 'Test',
      Title: 'Test',
      Description: 'Test achievement',
    };
    it('Should thrown not connected', async () => {
      return pactum.spec().post('/achievements').expectStatus(401);
    });
    it('Should work', async () => {
      const token = await JWT_access(2);
      return pactum
        .spec()
        .post('/achievements')
        .withHeaders({
          Authorization: 'Bearer ' + token,
        })
        .expectStatus(201);
    });
    describe('add (admin only)', () => {
      it('Should thrown not connected', async () => {
        return pactum.spec().post('/achievements/add').expectStatus(401);
      });
      it('Should thrown not admin', async () => {
        const token = await JWT_access(2);
        return pactum
          .spec()
          .post('/achievements/add')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .expectStatus(403);
      });
      it('Should thrown no body send', async () => {
        const token = await JWT_access(1);
        return pactum
          .spec()
          .post('/achievements/add')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .expectStatus(400);
      });
      it('Should work', async () => {
        const token = await JWT_access(1);
        return pactum
          .spec()
          .post('/achievements/add')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('achievementId', 'id');
      });
      it('Should thrown achievement exist', async () => {
        const token = await JWT_access(1);
        return pactum
          .spec()
          .post('/achievements/add')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .withBody(dto)
          .expectStatus(403); //TODO change the execption code NOT 403
      });
    });
    describe('modif (admin only)', () => {
      it('Should thrown not connected', async () => {
        return pactum.spec().patch('/achievements/1').expectStatus(401);
      });
      it('Should thrown not admin', async () => {
        const token = await JWT_access(2);
        return pactum
          .spec()
          .patch('/achievements/2')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .expectStatus(403);
      });
      it('Should thrown bad id send', async () => {
        const token = await JWT_access(1);
        return pactum
          .spec()
          .patch('/achievements/999999')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .expectStatus(400);
      });
      it('Should thrown no body send', async () => {
        const token = await JWT_access(1);
        return pactum
          .spec()
          .patch('/achievements/$S{achievementId}')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .expectStatus(400);
      });
      it('Should work', async () => {
        const token = await JWT_access(1);
        return pactum
          .spec()
          .patch('/achievements/$S{achievementId}')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .withBody({
            Name: 'Modif',
            Description: dto.Description,
            Title: dto.Title,
          })
          .expectStatus(200);
      });
    });
    describe('Add to user (admin only)', () => {
      it('Should thrown not connected', async () => {
        return pactum
          .spec()
          .post('/achievements/add/0/$S{achievementId}')
          .expectStatus(401);
      });
      it('Should thrown not admin', async () => {
        const token = await JWT_access(2);
        return pactum
          .spec()
          .post('/achievements/add/0/$S{achievementId}')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .expectStatus(403);
      });
      it('Should thrown bad user id send', async () => {
        const token = await JWT_access(1);
        return pactum
          .spec()
          .post('/achievements/add/0/$S{achievementId}')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .expectStatus(403);
      });
      it('Should thrown bad achievement id send', async () => {
        const token = await JWT_access(1);
        return pactum
          .spec()
          .post('/achievements/add/1/0')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .expectStatus(403);
      });
      it('Should work', async () => {
        const token = await JWT_access(1);
        return pactum
          .spec()
          .post('/achievements/add/2/$S{achievementId}')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .expectStatus(403);
      });
    });
    describe('get user achievement', () => {
      it('Should thrown not connected', async () => {
        return pactum.spec().post('/achievements/0').expectStatus(401);
      });
      it('Should thrown bad id send', async () => {
        const token = await JWT_access(2);
        return pactum
          .spec()
          .post('/achievements/0')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .expectStatus(403); //TODO change the execption code NOT 403
      });
      it('Should work', async () => {
        const token = await JWT_access(2);
        return pactum
          .spec()
          .post('/achievements/2')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .expectStatus(200);
      });
    });
    describe('delete (admin only)', () => {
      it('Should thrown not connected', async () => {
        return pactum.spec().delete('/achievements/0').expectStatus(401);
      });
      it('Should thrown not admin', async () => {
        const token = await JWT_access(2);
        return pactum
          .spec()
          .delete('/achievements/0')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .expectStatus(403);
      });
      it('Should thrown bad id send', async () => {
        const token = await JWT_access(1);
        return pactum
          .spec()
          .delete('/achievements/0')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .expectStatus(403);
      });
      it('Should work', async () => {
        const token = await JWT_access(1);
        return pactum
          .spec()
          .delete('/achievements/$S{achievementId}')
          .withHeaders({
            Authorization: 'Bearer ' + token,
          })
          .expectStatus(204);
      });
    });
  });
});
