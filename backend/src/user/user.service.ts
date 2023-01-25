import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

type Find<T> = Promise<T | null>;

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) { }

	private async findOne(where: Prisma.UserWhereUniqueInput) {
		return this.prisma.user.findUnique({ where });
	}

	async findUserById(id: number): Find<User> {
		return this.findOne({ id });
	}

	async findUserByNickname(nickname: string): Find<User> {
		return this.findOne({ nickname });
	}

	async findUserByIntraId(id: number) {
		return this.findOne({ intra_id: id });
	}
}
