import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AppService } from './app.service';
import { CodeChangedPayload, JoinAck, JoinPayload, RoomEvents } from './types';

@WebSocketGateway({ cors: { origin: '*' }, serveClient: false, path: '/' })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private appService: AppService) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage(RoomEvents.JOIN)
  async join(client: Socket, payload: JoinPayload): Promise<JoinAck> {
    return this.appService.join(this.server, client, payload);
  }

  @SubscribeMessage(RoomEvents.CODE_CHANGED)
  handleCodeChange(client: Socket, payload: CodeChangedPayload): void {
    this.appService.updateCodeChanges(client, payload);
  }

  handleDisconnect(client: Socket) {
    console.log(client.id, ' disconnected');
  }

  handleConnection(client: Socket) {
    console.log(client.id, ' connected');
  }
}
