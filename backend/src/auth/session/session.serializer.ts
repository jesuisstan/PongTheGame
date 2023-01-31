import { PassportSerializer } from '@nestjs/passport';

type TID = any;

type DoneSerialize = (err: any, id?: TID) => void;
type DoneDeserialize = (err: any, user?: Express.User) => void;

export class SessionSerializer extends PassportSerializer {
  override async serializeUser(user: any, done: DoneSerialize) {
    // TODO put user in database and return 'real' application user
    console.log('serializeUser', user);

    done(null, user);
  }

  override async deserializeUser(payload: any, done: DoneDeserialize) {
    // TODO retrieve user from database
    console.log('deserializeUser', payload);

    done(null, payload);
  }
}
