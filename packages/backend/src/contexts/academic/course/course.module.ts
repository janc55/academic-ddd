import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseService } from './application/course.service';
import { COURSE_REPOSITORY } from './domain/course.repository';
import { CourseTypeOrmRepository } from './infrastructure/course-typeorm.repository';
import { CourseEntity } from './infrastructure/persistence/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity])],
  providers: [
    CourseService,
    {
      provide: COURSE_REPOSITORY,
      useClass: CourseTypeOrmRepository,
    },
  ],
  exports: [CourseService],
})
export class CourseModule {}
