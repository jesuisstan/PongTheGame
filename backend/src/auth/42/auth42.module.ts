import { Module } from '@nestjs/common';
import { Auth42Controller } from './auth42.controller';
import { Auth42Strategy } from './auth42.strategy';
import { SessionModule } from '../session/session.module';

@Module({
  controllers: [Auth42Controller],
  providers: [Auth42Strategy],
  imports: [SessionModule],
})
export class Auth42Module {}
