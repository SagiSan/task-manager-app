import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

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

    const sortOrder = query.sortOrder || 'desc';

    return this.prisma.task.findMany({
      where: whereClause,
      orderBy: {
        createdAt: sortOrder,
      },
    });
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
    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...updateData,
        dueDate: updateData.dueDate ? new Date(updateData.dueDate) : null,
      },
    });
  }

  async deleteTask(taskId: number, userId: number) {
    await this.getTaskById(taskId, userId);
    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}
