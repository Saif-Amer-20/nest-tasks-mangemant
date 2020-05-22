import { User } from './../auth/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status=:status', { status });
    }
    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const task = await query.getMany();
    return task;
  }

  async createTask(createTaskDTO: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDTO;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();
    delete task.user;
    return task;
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const result = await this.findOne({ where: { id: id, userId: user.id } });
    if (!result) {
      throw new NotFoundException(`The ID "${id}" Not Found`);
    }
    return result;
  }

  async deleteTask(id: number, user: User): Promise<string> {
    const result = await this.delete({ id: id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return 'The record delete successfully';
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const result = await this.getTaskById(id, user);
    if (!result) {
      throw new NotFoundException(`The ID "${id}" Not Found`);
    }
    result.status = status;
    result.save();
    return result;
  }
}
