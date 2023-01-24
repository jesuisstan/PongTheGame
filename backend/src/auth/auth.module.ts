import { Module } from "@nestjs/common";
import { Auth42Controller } from "./42/auth42.controller";

@Module({
	controllers: [Auth42Controller]
})
export class AuthModule {
}
