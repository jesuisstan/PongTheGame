import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { Auth42Guard } from "./auth42.guard";

const CLIENT_URL = "http://localhost:3000";

@Controller("/auth")
export class Auth42Controller {

	@Get("42")
	@UseGuards(Auth42Guard)
	async login() {

	}

	@Get("42/callback")
	@UseGuards(Auth42Guard)
	async callback(@Res() res: Response) {
		return res.redirect(`${CLIENT_URL}/profile`);
	}

	@Get("logout")
	async logout(@Res() res: Response) {
		// TODO log user out
		return res.redirect(`${CLIENT_URL}/login`);
	}

	@Get("getuser")
	async profile(@Req() req: Request) {
		return req.user;
	}
}
