import { User } from "./User";

export type Message = {
	author: User,
	data: string;
}