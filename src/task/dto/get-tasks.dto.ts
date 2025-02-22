import { IsOptional, IsEnum, IsDateString, IsIn } from 'class-validator';
import { Status, Priority } from '@prisma/client';

export class GetTasksDto {
  @IsOptional()
  @IsEnum(Status, {
    message: 'Status must be one of: pending, in_progress, completed',
  })
  status?: Status;

  @IsOptional()
  @IsEnum(Priority, { message: 'Priority must be one of: low, medium, high' })
  priority?: Priority;

  @IsOptional()
  @IsDateString({}, { message: 'Due date must be a valid ISO date string' })
  dueDate?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'Sort order must be asc or desc' })
  sortOrder?: 'asc' | 'desc';
}
