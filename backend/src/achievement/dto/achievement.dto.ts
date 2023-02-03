import { IsNotEmpty, IsString } from "class-validator";

export class AchievementDTO { // MEMO Modif this for future constraint

	@IsString()
	@IsNotEmpty()
	Name :string;

	@IsString()
	@IsNotEmpty()
	Title : string;

	@IsString()
	@IsNotEmpty()
	Description : string;
}