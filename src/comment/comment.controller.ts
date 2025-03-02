import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtCookieGuard } from '../auth/jwt-cookie.guard';
import { Request } from 'express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { GetCommentsDto } from './dto/get-comments.dto';

interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
    role: string;
  };
}
@ApiTags('comments')
@ApiBearerAuth()
@Controller('comments')
@UseGuards(JwtCookieGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':taskId')
  @ApiOperation({ summary: 'Create a comment for a specific task' })
  @ApiResponse({ status: 201, description: 'Comment successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async createComment(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user['userId'];
    return this.commentService.createComment(createCommentDto, taskId, userId);
  }

  @Get(':taskId')
  @ApiOperation({
    summary: 'Get all comments for a specific task with pagination',
  })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully.' })
  async getComments(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Query() query: GetCommentsDto,
  ) {
    return this.commentService.getCommentsForTask(
      taskId,
      query.page,
      query.limit,
    );
  }
}
