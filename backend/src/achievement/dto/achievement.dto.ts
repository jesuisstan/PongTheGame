import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class AchievementDTO {

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		description : 'Name of the Achievement',
		type: String,
	})
	Name :string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		description : 'Title achievement',
		type: String,
	})
	Title : string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		description : 'Achievement description',
		type: String,
	})
	Description : string;
}