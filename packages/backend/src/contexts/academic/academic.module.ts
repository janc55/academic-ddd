import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { ScheduleModule } from './schedule/schedule.module';
import { CourseModule } from './course/course.module';
<<<<<<< HEAD
import { DepartmentModule } from './department/department.module'; // <-- ESTO

@Module({
  imports: [StudentModule, ScheduleModule, CourseModule, DepartmentModule], // <-- Y ESTO
  exports: [StudentModule, ScheduleModule, CourseModule, DepartmentModule],
})
export class AcademicModule {}
=======

@Module({
  imports: [StudentModule, ScheduleModule, CourseModule],
  exports: [StudentModule, ScheduleModule, CourseModule],
})
export class AcademicModule {}
>>>>>>> 00efccea6476f5df81d3370e2033824234b5dd82
