import { Module } from "@nestjs/common";
import { RepositoryModule } from "src/repositories/repository.module";
import { ServiceModule } from "src/services/service.module";
import MemberController from "./member/member.controller";
import NoteController from "./note/note.controller";

@Module({
  imports: [RepositoryModule, ServiceModule],
  controllers: [MemberController, NoteController],
})
export class ControllersModule {}
