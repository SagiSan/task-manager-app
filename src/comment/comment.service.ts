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

  async getCommentsForTask(taskId: number, page?: number, limit?: number) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }

    if (page && limit) {
      const skip = (Number(page) - 1) * Number(limit);
      const comments = await this.prisma.comment.findMany({
        where: { taskId },
        orderBy: { createdAt: 'asc' },
        skip,
        take: Number(limit),
      });
      const total = await this.prisma.comment.count({ where: { taskId } });
      return { comments, total };
    } else {
      const comments = await this.prisma.comment.findMany({
        where: { taskId },
        orderBy: { createdAt: 'asc' },
      });
      return { comments, total: comments.length };
    }
  }
}
