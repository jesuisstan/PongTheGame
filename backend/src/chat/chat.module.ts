import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { WebsocketsModule } from 'src/websockets/websockets.module';

@Module({
  providers: [ChatGateway, ChatService],
  imports : [WebsocketsModule]
})
export class ChatModule {}
