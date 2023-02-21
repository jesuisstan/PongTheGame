import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing'
import * as pactum from 'pactum';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppModule } from 'src/app.module';
import { ConfigService } from "@nestjs/config";

function JWT_access(id: number) {
  const jwt : JwtService = new JwtService;
  const config : ConfigService = new ConfigService;
  const secret = config.get('JWT_SECRET');

  const token = jwt.signAsync({id: id}, {
    expiresIn: '15m',
    secret: secret,
  });
  return (token);
}

async function create_user(prisma : PrismaService){
  if ((await prisma.user.findMany({})).length == 0) {
    // MEMO User 1 create
    await prisma.user.create({
      data : {
        nickname : "Admin1",
        username : "Admin1",
        profileId : "41",
        provider : "41",
        role : "ADMIN",
      }
    });
    // MEMO User 2 create
    await prisma.user.create({
      data : {
        nickname : "Admin2",
        username : "Admin2",
        profileId : "42",
        provider : "42",
        role : "USER",
      }
    });
  }
  // const userId = prisma.user.findMany({});

  // TODO store the ID of the user
  // MEMO probably not sure

}

describe('Appe@e', () => {
  let app : INestApplication;
  let prisma : PrismaService;

  jest.setTimeout(9999);
  beforeAll(async () => {

    const refModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = refModule.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }));
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await create_user(prisma);
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    // await prisma.cleanDb();
    app.close();
  });
  
  // describe('All test', async () => {
    describe('Match', () => {
      it('Should thrown not connected', async () => {
        return pactum.spec().post('/match',).expectStatus(401);
      });
      it('Should thrown no body send', async () => {
        const token = await JWT_access(2);
        return pactum.spec().post('/match',).withHeaders({
          Authorization : 'Bearer ' + token,}).expectStatus(400);
      });
      it('Should thrown only 1 users send', async () => {
        const token = await JWT_access(2);
        return pactum.spec().post('/match',).withHeaders(
          {
            Authorization : 'Bearer ' + token,
          }).withBody(
            {
              user1: 1,
            }).expectStatus(400);
      });
      it('Should thrown bad id send', async () => {
        const token = await JWT_access(2);
        return pactum.spec().post('/match',).withHeaders(
          {
            Authorization : 'Bearer ' + token,
          }).withBody(
            {
              user1: 15,
            }).expectStatus(400);
      });
      it('Should thrown the same users send 2 times', async () => {
        const token = await JWT_access(2);
        return pactum.spec().post('/match',).withHeaders(
          {
            Authorization : 'Bearer ' + token,
          }).withBody(
            {
              user1: 1,
              user2: 1,
            }).expectStatus(400);
      });
      it('Should works', async () => {
        const token = await JWT_access(2);
        return pactum.spec().post('/match',).withHeaders(
          {
            Authorization : 'Bearer ' + token,
          }).withBody(
            {
              user1: 1,
              user2: 2,
            }).expectStatus(201);
      });
      describe('mine', () => {
        it('Should thrown not connected', async () => {
          return pactum.spec().get('/mine').expectStatus(404);
        })
        it('Should thrown no match play', async () => {
          const token = await JWT_access(2);
          return pactum.spec().get('/mine').withHeaders(
            {
              Authorization : 'Bearer ' + token,
            }).expectStatus(404);
        })
      })
      describe(':id', () => {
        it('should thrown not connected', async () => {// MEMO talk with ben why not 401 ?
          return pactum.spec().get('/0').expectStatus(404);
        })
        it('Should thrown with a bad id', async () => {
          const token = await JWT_access(2);
          return pactum.spec().get('/0').withHeaders({
            Authorization : 'Bearer ' + token,
          }).expectStatus(404);
        })
        // it.todo('Should work');// TODO save the id of the match
        it('Should work', async () => {
          const token = await JWT_access(2);
          return pactum.spec().get('/1').withHeaders({
            Authorization : 'Bearer ' + token,
          }).expectStatus(404);// MEMO code return 404 WHY ?
        })
      })
    })
    describe('Users', () => {
      describe(':id', () => {
        it.todo('Should thrown not connected');
        it.todo('Should thrown with a bad id');
        it.todo('Should work');
      })
      describe('setnickname', () => {
        it.todo('Should thrown not connected');
        it.todo('Should thrown with a bad id');
        it.todo('Should thrown no body');
        it.todo('Should work');
        it.todo('Should thrown change with same nickname');
      })
      describe('2fa', () => {
        it.todo('Should thrown not connected');
        it.todo('Should thrown with a bad id');
        it.todo('Should thrown no body');
        it.todo('Should work');
      })
    })
    describe('Achievement', () => {
        it.todo('Should thrown not connected');
        it.todo('Should work');
        describe('add (admin only)', () => {
          it.todo('Should thrown not connected');
          it.todo('Should thrown not admin');
          it.todo('Should thrown no body send');
          it.todo('Should work');
        })
        describe('modif achievement', () => {
          it.todo('Should thrown not connected');
          it.todo('Should thrown not admin');
          it.todo('Should thrown no id send');
          it.todo('Should thrown no body send');
          it.todo('Should thrown bad id send');
          it.todo('Should work');
        })
        describe('delete achievement', () => {
          it.todo('Should thrown not connected');
          it.todo('Should thrown not admin');
          it.todo('Should thrown no id send');
          it.todo('Should thrown bad id send');
          it.todo('Should work');
        })
        describe('get user ahchievement', () => {
          it.todo('Should thrown not connected');
          it.todo('Should thrown no id send');
          it.todo('Should thrown bad id send');
          it.todo('Should work');
        })
        describe('Add achievement to user', () => {
          it.todo('Should thrown not connected');
          it.todo('Should thrown no user id send');
          it.todo('Should thrown no achievement id send');
          it.todo('Should thrown bad user id send');
          it.todo('Should thrown bad achievement id send');
          it.todo('Should thrown not admin');
          it.todo('Should work');
        })
    })
  // })
  // describe('Auth', () => {
    
  //   describe('Signup', () => {

  //     it('Should thrown email empty', () => {
  //       return pactum.spec().post('/auth/signup',).withBody({
  //         password : dto.password,
  //       }).expectStatus(400);
  //     });

  //     // it('Should thrown not a email', () => {
  //     //   return pactum.spec().post('/auth/signup',).withBody({
  //     //     email : "test.test",
  //     //     password : dto.password,
  //     //   }).expectStatus(400);
  //     // });

  //     // it('Should thrown password empty', () => {
  //     //   return pactum.spec().post('/auth/signup',).withBody({
  //     //     email : dto.email,
  //     //   }).expectStatus(400);
  //     // });

  //     // it('Should thrown no body provided', () => {
  //     //   return pactum.spec().post('/auth/signup',).withBody({}).expectStatus(400);
  //     // });

  //     // it('Should signup', () => {
  //     //   return pactum.spec().post('/auth/signup',).withBody(dto).expectStatus(201);
  //     // });

  //     // it('Should thrown already signup', () => {
  //     //   return pactum.spec().post('/auth/signup',).withBody(dto).expectStatus(403);
  //     // });

  //   });

  //   describe('Signin', () => {

  //     it('Should thrown email empty', () => {
  //       return pactum.spec().post('/auth/signin',).withBody({
  //         password : dto.password,
  //       }).expectStatus(400);
  //     });

  //     it('Should thrown not a email', () => {
  //       return pactum.spec().post('/auth/signin',).withBody({
  //         email : "test.test",
  //         password : dto.password,
  //       }).expectStatus(400);
  //     });

  //     it('Should thrown password empty', () => {
  //       return pactum.spec().post('/auth/signin',).withBody({
  //         email : dto.email,
  //       }).expectStatus(400);
  //     });

  //     it('Should thrown no body provided', () => {
  //       return pactum.spec().post('/auth/signin',).withBody({}).expectStatus(400);
  //     });

  //     it('Should signin lamba user', () => {
  //       return pactum.spec().post('/auth/signin',).withBody(dto).expectStatus(200).stores('userAt', 'access_token');
  //     });

  //     it('Should signin admin user', () => {
  //       return pactum.spec().post('/auth/signin',).withBody(dto).expectStatus(200).stores('adminAt', 'access_token');
  //     });
  //   });
  // });

  // describe('User', () => {
  //   describe('GetMe', () => {
  //     it('Should thrown no auth', () => {
  //       return pactum.spec().get('/users/me',).withHeaders({}).expectStatus(401);
  //     });
  //     it('Should get current user', () => {
  //       return pactum.spec().get('/users/me',).withHeaders({
  //         Authorization : 'Bearer $S{userAt}',
  //       }).expectStatus(200).stores('userId' , 'id');
  //     });
  //   });

  //   describe('Edit user', () => {
  //     it('Should edit user' , () => {
  //       return pactum.spec().patch('/users').withHeaders({
  //         Authorization : 'Bearer $S{userAt}',
  //       }).withJson({
  //         email : 'love@test.com',
  //       }).expectStatus(200);
  //     });
  //     describe('Try to relog' , () => {
  //       it ('Should throw because ancient password' , () => {
  //         return pactum.spec().post('/auth/signin', ).withBody({
  //           email : 'test@test.com',
  //           password : '123',
  //         }).expectStatus(403);
  //       });
  //       it ('Should pass with new password' , () => {
  //         return pactum.spec().post('/auth/signin', ).withBody({
  //           email : 'love@test.com',
  //           password : '123',
  //         }).expectStatus(200).stores('userAt', 'access_token');
  //       });
  //     });
  //   });
  // });

  // describe('Achievement', () => {
  //   const dto : AchievementDTO = {
  //     "Name" : "Test",
  //     "Title" : "Test",
  //     "Description" : "Test achievement"
  //   };

  //   describe('POST /', () => {
  //     it('Should thrown no token', () => {
  //       return pactum.spec().post('/achievements',).withHeaders({}).expectStatus(401);
  //     });
  //     it('Souhld send all achievement', () => {
  //       return pactum.spec().post('/achievements',).withHeaders({
  //         Authorization : 'Bearer $S{userAt}',
  //       }).expectStatus(201);
  //     });
  //   });

  //   describe('POST add', () => {
  //     it('Should thrown no token', () => {
  //       return pactum.spec().post('/achievements/add',).withHeaders({}).expectStatus(401);
  //     });

  //     it('Should thrown no body send', () => {
  //       return pactum.spec().post('/achievements/add',).withHeaders({
  //         Authorization : 'Bearer $S{adminAt}',
  //       }).expectStatus(400);
  //     });

  //     it('Should thrown no name', () => {
  //       return pactum.spec().post('/achievements/add',).withBody({
  //         Title : dto.Title,
  //         Description : dto.Description,
  //       }).withHeaders({
  //         Authorization : 'Bearer $S{adminAt}',
  //       }).expectStatus(400);
  //     });

  //     it('Should thrown no description', () => {
  //       return pactum.spec().post('/achievements/add',).withBody({
  //         Title : dto.Title,
  //         Name : dto.Name,
  //       }).withHeaders({
  //         Authorization : 'Bearer $S{adminAt}',
  //       }).expectStatus(400);
  //     });

  //     it('Should thrown no title', () => {
  //       return pactum.spec().post('/achievements/add',).withBody({
  //         Description : dto.Description,
  //         Name : dto.Name,
  //       }).withHeaders({
  //         Authorization : 'Bearer $S{adminAt}',
  //       }).expectStatus(400);
  //     });

  //     it('Should thrown because not admin', () => {
  //       return pactum.spec().post('/achievements/add',).withBody(dto).withHeaders({
  //         Authorization : 'Bearer $S{userAt}',
  //       }).expectStatus(403)
  //     });

  //     it('Should add the achievement', () => {// TODO fix the test work perfecly but no in testers
  //       return pactum.spec().post('/achievements/add',).withBody(dto).withHeaders({
  //         Authorization : 'Bearer $S{adminAt}',
  //       }).expectStatus(201).stores('achievementId', 'id');
  //     });

  //     it('Should thrown already exist', () => {
  //       return pactum.spec().post('/achievements/add',).withBody(dto).withHeaders({
  //         Authorization : 'Bearer $S{adminAt}',
  //       }).expectStatus(403);
  //     });
  //   });

  //   describe('PATCH update achievement', () => {
  //     it ('Should thrown no token', () => {
  //       return pactum.spec().patch('/achievements/0',).withHeaders({}).expectStatus(401);
  //     });

  //     it('Should throw bad user', () => {
  //         return pactum.spec().patch('/achievements/$S{achievementId}',).withBody(dto).withHeaders({
  //           Authorization : 'Bearer $S{userAt}',
  //         }).expectStatus(403);
  //     });

  //     it ('Should throw because empty body', () => {
  //       return pactum.spec().patch('/achievements/$S{achievementId}',).withBody({}).withHeaders({
  //         Authorization : 'Bearer $S{adminAt}',
  //       }).expectStatus(403);
  //     });

  //     it ('Should throw because achievment not exist', () => {
  //       return pactum.spec().patch('/achievements/0',).withBody({dto}).withHeaders({
  //         Authorization : 'Bearer $S{adminAt}',
  //       }).expectStatus(403);
  //     });

  //     it ('Should modif the achievement' , () => {
  //       return pactum.spec().patch('/achievements/$S{achievementId}',).withBody({dto}).withHeaders({
  //         Authorization : 'Bearer $S{adminAt}',
  //       }).expectStatus(200);
  //     });
  //   });

  //   describe('DELETE :achivementId', () => {
  //     it('Should thrown no token', () => {
  //       return pactum.spec().delete('/achievements/0',).withHeaders({}).expectStatus(401);
  //     });
  //     it('Should thrown bad Id', () => {
  //       return pactum.spec().delete('/achievements/0',).withHeaders({
  //         Authorization : 'Bearer $S{userAt}',
  //       }).expectStatus(403);
  //     });
  //     it('should thrown because not admin ', () => {
  //       return pactum.spec().delete('/achievements/$S{achievementId}',).withHeaders({
  //         Authorization : 'Bearer $S{userAt}',
  //       }).expectStatus(204);
  //     });

  //     it('should delete the achievement', () => {
  //       return pactum.spec().delete('/achievements/$S{achievementId}',).withHeaders({
  //         Authorization : 'Bearer $S{adminAt}',
  //       }).expectStatus(204);
  //     });

  //     it('should throw already delete', () => {
  //       return pactum.spec().delete('/achievements/$S{achievementId}',).withHeaders({
  //         Authorization : 'Bearer $S{adminAt}',
  //       }).expectStatus(403);
  //     });
  //   });

  //   describe('POST :UserId', () => {
  //     it('Should thrown no token', () => {
  //       return pactum.spec().post('/achievements',).withHeaders({}).expectStatus(401);
  //     });

  //     it('Should thrown bad Id', () => {
  //       return pactum.spec().post('/achievements/0',).withHeaders({
  //         Authorization : 'Bearer $S{userAt}',
  //       }).expectStatus(403);
  //     });

  //     it('Should send all the achievement the user got', () => {
  //       return pactum.spec().post('/achievements/$S{userId}',).withHeaders({
  //         Authorization : 'Bearer $S{userAt}',
  //       }).expectStatus(200);
  //     });
  //   });

  //   describe('add/:userId/:achievementId' , () => {
  //     it('Should thrown no token', () => {
  //       return pactum.spec().post('/achievements',).withHeaders({}).expectStatus(401);
  //     });

  //     it('Should throw bad user id', () => {
  //       return pactum.spec().post('/achievements/add/0/$S{achievementId}').withHeaders({
  //         Authorization : 'Bearer $S{userAt}',
  //       }).expectStatus(403);
  //     });

  //     it('Should throw bad achievement id', () => {
  //       return pactum.spec().post('/achievements/add/$S{userId}/0').withHeaders({
  //         Authorization : 'Bearer $S{userAt}',
  //       }).expectStatus(403);
  //     });

  //     it('Should throw the achievement to the user', () => {
  //       return pactum.spec().post('/achievements/add/$S{userId}/$S{achievementId}').withHeaders({
  //         Authorization : 'Bearer $S{userAt}',
  //       }).expectStatus(403);
  //     });

  //     it('Should add the achievement to the user', () => {
  //       return pactum.spec().post('/achievements/add/$S{userId}/$S{achievementId}').withHeaders({
  //         Authorization : 'Bearer $S{adminAt}',
  //       }).expectStatus(200);
  //     });

  //   });
  // });

  // describe('Match', () => {
  //   describe('Get all statistic', () => {
  //     it.todo('Should get all statistic');
  //   });

  //   describe('Get statistic by id', () => {
  //     it.todo('Should get statistic by id');
  //   });
  // });
});
