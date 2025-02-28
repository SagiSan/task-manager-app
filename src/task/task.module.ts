import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@Module({
  controllers: [TaskController],
  providers: [TaskService, WebsocketGateway],
})
export class TaskModule {}
