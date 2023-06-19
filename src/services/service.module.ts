import { Module } from "@nestjs/common";
import NoteViewerService from "./NoteViewer.service";
import NoteEditorService from "./NoteEditor.service";
import MemberActionOnNoteService from "./MemberActionOnNote.service";
import { RepositoryModule } from "src/repositories/repository.module";
import LockerService from "./Locker.service";
import { UploadService } from "src/upload/upload.service";

@Module({
  imports: [RepositoryModule],
  providers: [
    NoteViewerService,
    NoteEditorService,
    MemberActionOnNoteService,
    LockerService,
    UploadService,
  ],
  exports: [
    NoteViewerService,
    NoteEditorService,
    MemberActionOnNoteService,
    LockerService,
  ],
})
export class ServiceModule {}
