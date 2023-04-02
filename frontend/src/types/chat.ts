import { User } from "./User";

export type Message = {
	author: User;
	data: string;
	timestamp: Date;
}

export type ChatRoomType = {
	name: string;
	modes: string;
	password: string;
	userLimit: number;
	members: {
		id: number;
		isOnline: boolean;
		modes: string;
	}
	messages: Message[];
	bannedUsers: number[];
}

export type MemberType = {
		id: number;
		isOnline: boolean;
		modes: string;
}
