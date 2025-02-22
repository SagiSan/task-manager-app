import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
    role: string;
  };
}

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user['userId'];
    return this.taskService.createTask(createTaskDto, userId);
  }

  @Get()
  async getTasks(@Req() req: RequestWithUser) {
    const userId = req.user['userId'];
    return this.taskService.getTasks(userId);
  }

  @Get(':id')
  async getTask(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user['userId'];
    return this.taskService.getTaskById(id, userId);
  }

  @Put(':id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: Partial<CreateTaskDto>,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user['userId'];
    return this.taskService.updateTask(id, updateTaskDto, userId);
  }

  @Delete(':id')
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user['userId'];
    return this.taskService.deleteTask(id, userId);
  }
}
