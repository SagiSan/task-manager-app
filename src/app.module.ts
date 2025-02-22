import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, TaskModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
