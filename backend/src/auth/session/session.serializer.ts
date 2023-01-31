import { PassportSerializer } from '@nestjs/passport';

type TID = any;

type DoneSerialize = (err: any, id?: TID) => void;
type DoneDeserialize = (err: any, user?: Express.User) => void;

export class SessionSerializer extends PassportSerializer {
  override async serializeUser(user: any, done: DoneSerialize) {
    done(null, user);
  }

  override async deserializeUser(payload: any, done: DoneDeserialize) {
    done(null, payload);
  }
}
