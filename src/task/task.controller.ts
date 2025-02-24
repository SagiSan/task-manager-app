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
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtCookieGuard } from '../auth/jwt-cookie.guard';
import { Request } from 'express';
import { GetTasksDto } from './dto/get-tasks.dto';

interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
    role: string;
  };
}

@Controller('tasks')
@UseGuards(JwtCookieGuard)
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
  async getTasks(@Req() req: RequestWithUser, @Query() query: GetTasksDto) {
    const userId = req.user.userId;
    return this.taskService.getTasks(userId, query);
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
