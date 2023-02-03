import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementDTO } from './dto/achievement.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsAdmin } from './guard';
import { IsAuthenticatedGuard } from 'src/auth/auth.guard';

@UseGuards(IsAuthenticatedGuard)
@Controller('achievements')
@ApiTags('Achievement')
export class AchievementController {
	constructor(private AchivService : AchievementService) {}

	@Post("")
	@ApiOperation({
		summary: 'Get all achievements',
		responses : {
			'401' : {
				description: 'Not authorized',
			},
			'200' : {
				description: 'Succes',
			},
		},
	})
	allAchievement(){
		return (this.AchivService.allAchievement());
	}

	@HttpCode(HttpStatus.CREATED)
	@IsAdmin()
	@Post("/add")
	addAchievement(@Body() dto : AchievementDTO){
			return (this.AchivService.addAchievement(dto));
	}

	@HttpCode(HttpStatus.OK)
	@IsAdmin()
	@Patch(":id")
	updateAchievement(@Param('id', ParseIntPipe) achvId : number, @Body() dto : AchievementDTO){
			return (this.AchivService.updateAchievement(achvId, dto));
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@IsAdmin()
	@Delete(":id")
	deleteAchievement(@Param('id', ParseIntPipe) achId : number){
			return (this.AchivService.deleteAchievement(achId));
	}

	@HttpCode(HttpStatus.OK)
	@Post(":id")
	userAchievement(@Param('id', ParseIntPipe) id : number){
		return (this.AchivService.userAchievement(id));
	}

	@HttpCode(HttpStatus.OK)
	@IsAdmin()
	@Post("/add/:userId/:achievementId")
	addToUser(@Param('userId', ParseIntPipe) userId : number, @Param('achievementId', ParseIntPipe) achId : number){
		return (this.AchivService.addToUser(userId, achId));
	}

}
