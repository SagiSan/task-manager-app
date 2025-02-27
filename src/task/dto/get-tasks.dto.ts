import { IsOptional, IsEnum, IsDateString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Status, Priority } from '@prisma/client';

export class GetTasksDto {
  @ApiPropertyOptional({
    description: 'Filter tasks by status',
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status, {
    message: 'Status must be one of: pending, in_progress, completed',
  })
  status?: Status;

  @ApiPropertyOptional({
    description: 'Filter tasks by priority',
    enum: Priority,
  })
  @IsOptional()
  @IsEnum(Priority, { message: 'Priority must be one of: low, medium, high' })
  priority?: Priority;

  @ApiPropertyOptional({
    description: 'Filter tasks by due date (ISO date string)',
    example: '2023-12-31',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Due date must be a valid ISO date string' })
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'Sort order for tasks',
    enum: ['asc', 'desc'],
    default: 'asc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'Sort order must be asc or desc' })
  sortOrder?: 'asc' | 'desc';
}
