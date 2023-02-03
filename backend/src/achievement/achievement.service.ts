import { ForbiddenException, Injectable } from '@nestjs/common';
import { Achievement } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { AchievementDTO } from './dto/achievement.dto';

@Injectable()
export class AchievementService {
	constructor (private prisma: PrismaService) {}

	async allAchievement() { // TODO add Promise state
		const all_achievement = this.prisma.achievement.findMany({
			select :{
				id : true,
				Name : true,
				Description : true,
			}
		});
		return all_achievement;
	}

	async addAchievement(dto : AchievementDTO) : Promise<{'id' : number}> {
		try {
			const achievement : Achievement = await this.prisma.achievement.create({
				data : {
					Name : dto.Name,
					Title : dto.Title,
					Description : dto.Description,
				},
			});
			return {'id' : achievement.id};
		}
		catch (error) {
			if (error instanceof PrismaClientKnownRequestError){
				if (error.code == 'P2002'){
					throw new ForbiddenException(
						'Achievement Exist',
					);
				}
			}
			throw error;
		}
	}

	async updateAchievement(achId : number, data : AchievementDTO) { // TODO add Promise state
		try {
			await this.prisma.achievement.update({
				where : {
					id : achId,
				},
				data : data,
			});
		}
		catch (error){
			if (error instanceof PrismaClientKnownRequestError){
				if (error.code == 'P2025')
				throw new ForbiddenException(
					'Achievement not found',
				);
			}
		}
	}

	async deleteAchievement(achId : number) : Promise<void> {
		try {
				await this.prisma.achievement.delete({
				where: {
					id : achId,
				}
			});
			}
		catch(error){
			if (error instanceof PrismaClientKnownRequestError){
				if (error.code == 'P2025')
				throw new ForbiddenException(// TODO modif not a forbidden exepction
					'Achievement not found',
				);
			}
		}
			return ;
	}

	async userAchievement(id : number) { // TODO add Promise state
			const user = await this.prisma.user.findUnique({
				where : {
					id : id,
				},
				select: {
					achievement : true,
				},
			});
			if (!user)
				throw new ForbiddenException("User not found");// TODO modif not a forbidden exepction
			return user;
	}

	async addToUser(userId : number, achievementId : number) { // TODO Add promise state
		const userAchivement = await this.prisma.user.findUnique({
			where : {
				id : userId,
			}, 
			select : {
				achievement : true,
			}});
		if (!userAchivement)
			throw new ForbiddenException("User not found");// TODO modif not a forbidden exepction

		// const title : string = userAchivement.achievement.find(Achievement => Achievement.id == achievementId).Title;
		const title : any = userAchivement.achievement;
		console.log(title);
		// if (title)
		// 	throw new ForbiddenException(`User already got the achivement '${title}'`,);// TODO modif not a forbidden exepction
		
		try {
			const achievement : Achievement = await this.prisma.achievement.update({
				where : {
					id : achievementId,
				},
				data : {
					userId : userId,
				},
			});
			return achievement;
			}
			catch (error) {
				if (error instanceof PrismaClientKnownRequestError){
					if (error.code == 'P2025')
						throw new ForbiddenException('Achivement not found',);// TODO modif not a forbidden exepction
				}
			}
	}

}
