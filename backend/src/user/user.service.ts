import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

type Find<T> = Promise<T | null>;

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) { }

	async findUserById(id: number): Find<User> {
		return this.prisma.user.findUnique({
			where: { id },
		});
	}

	async findUserByNickname(nickname: string): Find<User> {
		return this.prisma.user.findUnique({
			where: { nickname },
		});
	}
}
