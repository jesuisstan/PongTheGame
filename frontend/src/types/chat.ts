import { User } from "./User";

export type Message = {
	author: User,
	data: string;
}

export type ChatRoomType = {
	name: string;
	modes: string;
	password: string;
	userLimit: number;
	users: { [nick: string]: { modes: string; lastPinged: Date } };
	messages: Message[];
	bannedNicks: string[];
}