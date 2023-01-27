import { Module } from '@nestjs/common';
import { Auth42Controller } from './42/auth42.controller';
import { Auth42Strategy } from './42/auth42.strategy';

@Module({
  controllers: [Auth42Controller],
  providers: [Auth42Strategy],
})
export class AuthModule {}
