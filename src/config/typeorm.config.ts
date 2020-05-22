import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'saif1234',
  database: 'NestJsApp',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: false,
};
