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
  UseInterceptors,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtCookieGuard } from '../auth/jwt-cookie.guard';
import { Request } from 'express';
import { GetTasksDto } from './dto/get-tasks.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';

interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
    role: string;
  };
}

@ApiTags('tasks')
@ApiBearerAuth()
@UseInterceptors(LoggingInterceptor)
@Controller('tasks')
@UseGuards(JwtCookieGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user['userId'];
    return this.taskService.createTask(createTaskDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get tasks for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully.' })
  async getTasks(@Req() req: RequestWithUser, @Query() query: GetTasksDto) {
    const userId = req.user.userId;
    return this.taskService.getTasks(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by its ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async getTask(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user['userId'];
    return this.taskService.getTaskById(id, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: Partial<CreateTaskDto>,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user['userId'];
    return this.taskService.updateTask(id, updateTaskDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user['userId'];
    return this.taskService.deleteTask(id, userId);
  }
}
