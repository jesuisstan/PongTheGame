import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { SessionSerializer } from './session.serializer';
import { SessionService } from './session.service';

@Module({
  providers: [SessionSerializer, SessionService],
  imports: [UserModule],
  exports: [SessionService],
})
export class SessionModule {}
