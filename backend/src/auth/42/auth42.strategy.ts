import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport"
import { Strategy, StrategyOptions } from "passport-oauth2"

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, "42") {
	constructor(readonly config: ConfigService<Record<string, string>>) {
		super({
			authorizationURL: "https://api.intra.42.fr/oauth/authorize",
			tokenURL: "https://api.intra.42.fr/oauth/token",
			clientID: config.getOrThrow("42_CLIENT_ID"),
			clientSecret: config.getOrThrow("42_CLIENT_SECRET"),
			callbackURL: config.getOrThrow("42_CALLBACK_URL"),
			state: true,
		} as StrategyOptions);
	}

	async validate(accessToken: string, refreshToken: string, profile: any) {
		console.log(profile);
	}
}
