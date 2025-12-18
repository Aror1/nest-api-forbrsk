import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './articles.entity';
import { Redis } from 'ioredis';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  providers: [
    ArticlesService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: (): Redis => {
        return new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: 6379,
        });
      },
    },
  ],
  controllers: [ArticlesController],
})
export class ArticlesModule {}
