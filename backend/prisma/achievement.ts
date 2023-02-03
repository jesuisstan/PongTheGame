import { Achievement, Prisma } from "@prisma/client";
import { prisma } from "./seed";

export async function insert_achievement(){
	console.log("Creation achievement");
	const achievements : Prisma.AchievementCreateInput[] = [
		{Name : "Login", Title : "First Login", Description : "You'r login for the first time"},
		{Name : "Newbie", Title : "First Game", Description : "You play your first Game."},
		{Name : "Player", Title : "Play 10 Games", Description : "You play 10 Games."},
		{Name : "Challenger", Title : "Play 100 Games", Description : "You play 100 Games."},
		{Name : "Red", Title : "Win One Game", Description : "Congrats, You win your first Game0."},
		{Name : "Master", Title : "Win 10 Games", Description : "Congrats, You win 10 Games"},
		{Name : "Super Saiyen", Title : "Win 100 Games", Description : "Congrats, You win 100 Games"},
		{Name : "Custom", Title : "Change Avatar", Description : "You change your profile"},
		{Name : "ModUser", Title : "use 2 differents Game mod", Description : "Play 2 game mod differents"}, // MEMO Not sur to keep it
		{Name : "FriendOfMaurice", Title : "Get One Friend", Description : "get at leats one Friend"},
		{Name : "Super Popstart", Title : "More Friends", Description : "Get 42 Friends"},
		{Name : "I See U", Title : "Be Admin", Description : "The dark side is not for everyone."},
		{Name : "Collector", Title : "Achievements everywhere", Description : "Get 10 achievements"},
		{Name : "I'm your Father", Title : "Achievements everywhere * 2", Description : "Get 20 Achievement"},
		// {Name : "", Title : "", Description : ""},
	];

	for (let i = 0; i < achievements.length; i++) {
		const achievement : Achievement = await prisma.achievement.create({
			data: achievements[i],
		});
		console.log(`Achievement ${achievement.Name} create at id: ${achievement.id} `);
	}

}