import { Module } from '@nestjs/common';
import MemberController from './member.controller';
import { RepositoryModule } from 'src/repositories/repository.module';

@Module({
  imports: [
    RepositoryModule
  ],
  controllers: [MemberController]
})
export class ControllersModule {}
