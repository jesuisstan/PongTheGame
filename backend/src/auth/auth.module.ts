import { Module } from '@nestjs/common';
import { Auth42Module } from './42/auth42.module';

@Module({
  imports: [Auth42Module]
})
export class AuthModule {}
