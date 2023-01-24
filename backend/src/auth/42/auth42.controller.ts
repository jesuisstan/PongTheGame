import { Controller, Get } from "@nestjs/common";

@Controller("/auth/42")
export class Auth42Controller {

	@Get("login")
	async login() {
		return "Hello";
	}

	@Get("callback")
	async callback() {}

	@Get("logout")
	async logout() {}
}
