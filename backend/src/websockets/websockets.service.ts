import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';

@Injectable()
export class WebsocketsService {
    private sockets : Socket[] = [];
    // private 

    constructor(
        private readonly jwt: JwtService,
        private readonly prismaService: PrismaService,
        private readonly config : ConfigService,
    ) {}

    async registerSocket(socket : any) {
        socket.on('close', () => {
            this.sockets = this.sockets.filter((s : any) => s !== socket);
        });
        const token = socket.handshake.auth.token;
        if (!token) {
            console.log("error1")
            this.send(socket, 'error', 'No token found');
            socket.disconnect()
            return;
        }
        try {
            const verify = this.jwt.verify(token, {secret : this.config.get('JWT_SECRET')});
            if (!verify || !verify.id)
            {
                console.log("error2")
                this.send(socket, 'error', 'No user found');
                socket.disconnect()
                return;
            }
            const user = await this.prismaService.user.findUnique({
                where: { id: verify.id },
            });
            if (!user) {
                console.log("error3")
                this.send(socket, 'error', 'No user cookie');
                socket.disconnect();
                return;
            }
            if (this.getSockets([user.id]).length > 0) {
                this.send(socket, 'error', {
                    message: 'You are already connected',
                });
                socket.disconnect();
                return;
            }

            // await this.prismaService.user.update({
                // where: { id: user.id },
                // data: { status: 'ONLINE' },
            // });
            // this.sendToAll(this.sockets, 'user-status', {
                // id: user.id,
                // status: 'ONLINE',
            // });
            socket['user'] = user;
            this.sockets.push(socket);
        } catch (e) {
            console.log(e)
            this.send(socket, 'error', { message: 'Invalid session cookie' });
            socket.disconnect();
            return;
        }
    }

    async unregisterSocket(socket: any) {
        this.sockets = this.sockets.filter((s) => s !== socket);
        // const actions = this._socketsOnClose.get(socket);
        // if (actions) {
        //     actions.forEach((action) => action());
        // }
        // if (!socket.user) return;
        // await this.prismaService.user.update({
        //     where: { id: socket.user.id },
        //     // data: { status: 'OFFLINE' },
        // });
        // this.broadcast('user-status', {
        //     id: socket.user.id,
        //     // status: 'OFFLINE',
        // });
    }

    send(client: any, event: string, data: any) {
        client.send(JSON.stringify({ event: event, data: data }));
    }

    getSockets(usersId: number[]) {
        return this.sockets.filter((socket : any) => {
            return usersId.includes(socket.user.id);
        });
    }

    sendToAllUsers(usersId: number[], event: string, data: any) {
        const receivers = this.getSockets(usersId);
        this.sendToAll(receivers, event, data);
    }

    sendToAll(sockets: any[], event: string, data: any) {
        sockets.forEach((socket) => {
            this.send(socket, event, data);
        });
    }

    broadcast(event: string, data: any) {
        this.sendToAll(this.sockets, event, data);
    }
}