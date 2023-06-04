import { Module } from '@nestjs/common';
import MemberController from './member.controller';
import { RepositoryModule } from 'src/repositories/repository.module';
import NoteController from './note.controller';
import { ServiceModule } from 'src/services/service.module';

@Module({
  imports: [
    RepositoryModule,
    ServiceModule,
  ],
  controllers: [
    MemberController, 
    NoteController,
  ]
})
export class ControllersModule {}
