import { User } from "./User";

export type Message = {
	author: User;
	data: string;
	timestamp: Date;
}

export type MemberType = {
	memberId: number;
	isOnline: boolean;
	modes: string;
}

export type ChatRoomType = {
	name: string;
	owner: number;
	modes: string;
	password: string;
	userLimit: number;
	members: MemberType[];
	messages: Message[];
	bannedUsers: number[];
}
