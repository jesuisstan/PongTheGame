import { Module } from '@nestjs/common';
import { AuthProvider } from '../auth.provider';
import { SessionModule } from '../session/session.module';
import { Auth42Controller } from './auth42.controller';
import { Auth42Service } from './auth42.service';
import { Auth42Strategy } from './auth42.strategy';

@Module({
  controllers: [Auth42Controller],
  providers: [
    Auth42Strategy,
    {
      provide: AuthProvider,
      useClass: Auth42Service,
    },
  ],
  imports: [SessionModule],
})
export class Auth42Module {}
