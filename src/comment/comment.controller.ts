import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtCookieGuard } from '../auth/jwt-cookie.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
    role: string;
  };
}

@Controller('comments')
@UseGuards(JwtCookieGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

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
