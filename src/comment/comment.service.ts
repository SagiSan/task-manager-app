import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    taskId: number,
    userId: number,
  ) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }

    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        taskId,
        userId,
      },
    });
  }

  async getCommentsForTask(taskId: number) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }

    return this.prisma.comment.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
