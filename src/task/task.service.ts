import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, userId: number) {
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
        createdById: userId,
      },
    });
  }

  async getTasks(userId: number, query: GetTasksDto) {
    const { page, limit, sortOrder } = query;
    const whereClause: any = { createdById: userId };

    if (query.status) {
      whereClause.status = query.status;
    }
    if (query.priority) {
      whereClause.priority = query.priority;
    }
    if (query.dueDate) {
      whereClause.dueDate = { lte: new Date(query.dueDate) };
    }

    const orderBy = { createdAt: sortOrder || 'desc' };

    if (page && limit) {
      const skip = (Number(page) - 1) * Number(limit);
      const tasks = await this.prisma.task.findMany({
        where: whereClause,
        orderBy,
        skip,
        take: Number(limit),
      });
      const total = await this.prisma.task.count({ where: whereClause });
      return { tasks, total };
    } else {
      const tasks = await this.prisma.task.findMany({
        where: whereClause,
        orderBy,
      });
      return { tasks, total: tasks.length };
    }
  }

  async getTaskById(taskId: number, userId: number) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, createdById: userId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async updateTask(
    taskId: number,
    updateData: Partial<CreateTaskDto>,
    userId: number,
  ) {
    await this.getTaskById(taskId, userId);
    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...updateData,
        dueDate: updateData.dueDate ? new Date(updateData.dueDate) : null,
      },
    });

    this.websocketGateway.server.emit('task_update', updatedTask);
    return updatedTask;
  }

  async deleteTask(taskId: number, userId: number) {
    await this.getTaskById(taskId, userId);
    return this.prisma.$transaction([
      this.prisma.comment.deleteMany({
        where: { taskId },
      }),
      this.prisma.task.delete({
        where: { id: taskId },
      }),
    ]);
  }
}
