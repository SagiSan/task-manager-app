import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Allow frontend (change for production)
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('new_task')
  handleNewTask(@MessageBody() task: any) {
    console.log('New task received:', task);
    this.server.emit('task_update', task);
  }

  @SubscribeMessage('update_task')
  handleUpdateTask(@MessageBody() task: any) {
    console.log('Task updated:', task);
    this.server.emit('task_update', task);
  }
}
