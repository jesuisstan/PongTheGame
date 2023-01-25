import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, StrategyOptions } from "passport-42";

@Injectable()
export class Auth42Strategy extends PassportStrategy(Strategy, "42") {
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

	// TODO
	async validate(accessToken: string, refreshToken: string, profile: any) {
		delete profile._raw;
		delete profile._json
		console.log(profile);
		return profile;
	}
}
