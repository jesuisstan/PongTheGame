import { Module } from '@nestjs/common';
import { SessionSerializer } from './session.serializer';

@Module({
  providers: [SessionSerializer],
})
export class SessionModule {}
