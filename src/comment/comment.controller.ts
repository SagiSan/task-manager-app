import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';

interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
    role: string;
  };
}

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly prisma: PrismaService,
  ) {}

  @Post(':taskId')
  async createComment(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    return this.commentService.createComment(createCommentDto, taskId, userId);
  }

  @Get(':taskId')
  async getComments(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.commentService.getCommentsForTask(taskId);
  }
}
