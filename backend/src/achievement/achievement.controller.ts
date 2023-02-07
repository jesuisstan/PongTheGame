import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementDTO } from './dto/achievement.dto';
import { ApiOperation, ApiTags, DocumentBuilder } from '@nestjs/swagger';
import { IsAdmin } from './guard/isadmin.guard';
import { IsAuthenticatedGuard } from '../auth/auth.guard';

const options = new DocumentBuilder().addSecurity('basic', {
	type: 'http',
	scheme: 'basic',
  });

@UseGuards(IsAuthenticatedGuard)
@Controller('achievements')
@ApiTags('Achievement')
export class AchievementController {
	constructor(private AchivService : AchievementService) {}

	@Post("")
	@ApiOperation({
		summary: 'Get all achievements',
		responses : {
			'403' : {
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
	@ApiOperation({
		summary: 'Add achivement',
		security : [{"baseUserSecutity" : ["Admin"]}],
		responses : {
			'401' : {
				description: 'Not authorized',
			},
			'403' : {
				description: 'Achievement already exist',
			},
			'201' : {
				description: 'Succes',
			},
		},
	})
	addAchievement(@Body() dto : AchievementDTO){
			return (this.AchivService.addAchievement(dto));
	}

	@HttpCode(HttpStatus.OK)
	@IsAdmin()
	@Patch(":id")
	@ApiOperation({
		summary: 'Modif achivement',
		security : [{"baseUserSecutity" : ["Admin"]}],
		parameters: [{name : 'id', in : 'query'}],
		responses : {
			'401' : {
				description: 'Not authorized',
			},
			'403' : {
				description: 'Achievement not found',
			},
			'200' : {
				description: 'Succes',
			},
		},
	})
	updateAchievement(@Param('id', ParseIntPipe) achvId : number, @Body() dto : AchievementDTO){
			return (this.AchivService.updateAchievement(achvId, dto));
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@IsAdmin()
	@Delete(":id")
	@ApiOperation({
		summary: 'Delete achivement',
		security : [{"baseUserSecutity" : ["Admin"]}],
		parameters: [{name : 'id', in : 'query'}],
		responses : {
			'401' : {
				description: 'Not authorized',
			},
			'403' : {
				description: 'Achievement not found',
			},
			'204' : {
				description: 'Succes',
			},
		},
	})
	deleteAchievement(@Param('id', ParseIntPipe) achId : number){
			return (this.AchivService.deleteAchievement(achId));
	}

	@HttpCode(HttpStatus.OK)
	@Post(":id")
	@ApiOperation({
		summary: 'Get user achivement',
		parameters: [{name : 'id', in : 'query'}],
		responses : {
			'401' : {
				description: 'Not authorized',
			},
			'403' : {
				description: 'User not found',
			},
			'200' : {
				description: 'Succes',
			},
		},
	})
	userAchievement(@Param('id', ParseIntPipe) id : number){
		return (this.AchivService.userAchievement(id));
	}

	@HttpCode(HttpStatus.OK)
	@IsAdmin()
	@Post("/add/:userId/:achievementId")
	@ApiOperation({
		summary: 'Add achievement to user',
		security : [{"User" : ["Admin"]}],
		parameters: [{name : 'userId', in : 'query'},{name : 'achievementId', in : 'query'}],
		responses : {
			'401' : {
				description: 'Not authorized',
			},
			'403' : {
				description: 'User not found or Achievement not foudn',
			},
			'200' : {
				description: 'Succes',
			},
		},
	})
	addToUser(@Param('userId', ParseIntPipe) userId : number, @Param('achievementId', ParseIntPipe) achId : number){
		return (this.AchivService.addToUser(userId, achId));
	}

}
