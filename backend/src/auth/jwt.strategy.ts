import { Injectable, ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { Request as RequestType } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
	constructor (config: ConfigService, private prisma: PrismaService){
		super({
			jwtFromRequest : ExtractJwt.fromExtractors([
				JwtStrategy.fromCookie,
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			  ]),// MEMO http://www.passportjs.org/packages/passport-jwt/#extracting-the-jwt-from-the-request
			ignoreExpiration:false,
			secretOrKey: config.get('JWT_SECRET'),
		});
	}

	private static fromCookie(req : RequestType): string | null {
		if ( req.cookies && 'access_token' in req.cookies) {
			return req.cookies.access_token;
		}
		return null;
	}
	
	async validate(payload : {id : number}){
		const user = await this.prisma.user.findUnique({
			where :{
				id : payload.id,
			}
		});
		return user;
	}

}
