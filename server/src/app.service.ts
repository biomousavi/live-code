import * as nanoid from 'nanoid';
import { Socket, Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { CodeChangedPayload, JoinAck, JoinPayload, ParticipantsPayload, RoomEvents } from './types';
const changes = new Map();

@Injectable()
export class AppService {
  async join(server: Server, client: Socket, payload: JoinPayload): Promise<JoinAck> {
    try {
      const ack: JoinAck = {
        status: 'ok',
        roomId: payload.roomId,
      };

      if (payload.roomId === 'new') {
        // create new room id
        payload.roomId = nanoid.nanoid(6);

        // update ack roomId
        ack.roomId = payload.roomId;
      }

      // check if changes exists
      if (changes.has(payload.roomId)) {
        ack.changes = changes.get(payload.roomId);
      }

      // join the user to room
      await client.join(payload.roomId);

      // update participants
      await this.updateParticipants(server, payload.roomId);

      // update participants on disconnect
      client.on('disconnect', () => this.updateParticipants(server, payload.roomId));

      return ack;
    } catch (error) {
      return { status: 'error' };
    }
  }

  async updateParticipants(server: Server, roomId: string): Promise<void> {
    // get the room participants
    const sockets = await server.in(roomId).fetchSockets();

    // extract the length of sockets
    const payload: ParticipantsPayload = { count: sockets.length };

    // fire participants event
    server.in(roomId).emit(RoomEvents.PARTICIPANTS, payload);
  }

  async updateCodeChanges(client: Socket, payload: CodeChangedPayload) {
    // cache changes
    changes.set(payload.roomId, payload);

    // send the code changes to other participants
    client.broadcast.in(payload.roomId).emit(RoomEvents.CODE_CHANGES, payload);
  }
}
