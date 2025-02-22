import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(createTaskDto: CreateTaskDto, userId: number) {
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        createdById: userId,
      },
    });
  }

  async getTasks(userId: number) {
    return this.prisma.task.findMany({
      where: { createdById: userId },
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
      data: updateData,
    });
  }

  async deleteTask(taskId: number, userId: number) {
    await this.getTaskById(taskId, userId);
    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}
