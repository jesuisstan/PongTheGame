type TID = any;

type DoneSerialize = (err: any, id?: TID) => void;
type DoneDeserialize = (err: any, user?: Express.User) => void;

export function serializeUser(user: Express.User, done: DoneSerialize) {
	done(null, user);
}

export function deserializeUser(id: TID, done: DoneDeserialize) {
	done(null, id);
}
