import { Module } from "@nestjs/common";
import { RepositoryModule } from "src/repositories/repository.module";
import { ServiceModule } from "src/services/service.module";
import MemberController from "./member/member.controller";
import NoteController from "./note/note.controller";
import { UploadService } from "src/upload/upload.service";

@Module({
  imports: [RepositoryModule, ServiceModule],
  controllers: [MemberController, NoteController],
  providers: [UploadService],
})
export class ControllersModule {}
