import { Controller } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({
    cors: {
        origin : true,
    }
})

@Controller('game')
export class GameGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly gameService : GameService) {}
}
