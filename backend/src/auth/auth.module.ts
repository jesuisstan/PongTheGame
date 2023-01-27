import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Auth42Module } from './42/auth42.module';
import { SessionSerializer } from './session-serializer';

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
    Auth42Module,
  ],
  providers: [SessionSerializer],
})
export class AuthModule {}
