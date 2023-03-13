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
	users: {
		[nick: string]: {
		  isOnline: boolean;
		  modes: string;
		  lastPinged: Date;
		}
	  };
	messages: Message[];
	bannedNicks: string[];
}

export type MemberType = {
	[nick: string]: {
		isOnline: boolean;
		modes: string;
		lastPinged: Date;
	  }	
}
