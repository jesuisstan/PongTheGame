import { Controller, Get, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthGuard } from "../auth.guard";
import { Auth42Guard } from "./auth42.guard";

const CLIENT_URL = "http://localhost:3000";

@Controller("/auth")
export class Auth42Controller {

	@Get("42")
	@UseGuards(Auth42Guard)
	async login() { }

	@Get("42/callback")
	@UseGuards(Auth42Guard)
	async callback(@Res() res: Response) {
		return res.redirect(`${CLIENT_URL}/profile`);
	}

	@Get("logout")
	async logout(@Req() req: Request, @Res() res: Response) {
		await new Promise<void>(function (resolve, reject) {
			req.session.destroy(function (err) {
				if (err) {
					return reject(err);
				}
				return resolve();
			});
		});

		return res.clearCookie("connect.sid").redirect(`${CLIENT_URL}/login`);
	}

	@Get("getuser")
	@UseGuards(AuthGuard)
	async profile(@Req() req: Request) {
		if (req.user !== undefined)
			return req.user;
		throw new UnauthorizedException();
	}
}
