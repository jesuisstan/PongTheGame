import { Module } from '@nestjs/common';
import { SessionSerializer } from './session.serializer';
import { SessionService } from './session.service';

@Module({
  providers: [SessionService, SessionSerializer],
  exports: [SessionService],
})
export class SessionModule {}
