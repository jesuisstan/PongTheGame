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
				JwtStrategy.test,
				JwtStrategy.extractJWT,
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			  ]),// MEMO http://www.passportjs.org/packages/passport-jwt/#extracting-the-jwt-from-the-request
			ignoreExpiration:false,
			secretOrKey: config.get('JWT_SECRET'),
		});
	}

	private static extractJWT(req : RequestType): string | null {
		console.log(req.cookies);
		// console.log(res);
		// if ( req.cookies && 'access_token' in req.cookies && req.cookies.user_token.length > 0) {
		// 	return req.cookies.access_token;
		// }
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

	// var cookieExtractor = function(req) {
	// 	var token = null;
	// 	if (req && req.cookies)
	// 	{
	// 		token = req.cookies['jwt'];
	// 	}
	// 	return token;
	// };
	private static test(req : RequestType) : any {
		console.log(req.cookies);
		// var token = null;
		// if (req && req.cookies)
		// {
		// 	token = req.cookies['jwt'];
		// }
		// return token;
	};
}
