import { Module } from "@nestjs/common";
import NoteViewerService from "./NoteViewer.service";
import NoteEditorService from "./NoteEditor.service";
import MemberActionOnNoteService from "./MemberActionOnNote.service";
import { RepositoryModule } from "src/repositories/repository.module";
import LockerService from "./Locker.service";

@Module({
  imports: [RepositoryModule],
  providers: [
    NoteViewerService,
    NoteEditorService,
    MemberActionOnNoteService,
    LockerService,
  ],
  exports: [
    NoteViewerService,
    NoteEditorService,
    MemberActionOnNoteService,
    LockerService,
  ],
})
export class ServiceModule {}
