import { Module } from "@nestjs/common";
import NoteViewerService from "./NoteViewer.service";
import NoteEditorService from "./NoteEditor.service";
import MemberActionOnNoteService from "./MemberActionOnNote.service";
import { RepositoryModule } from "src/repositories/repository.module";

@Module({
  imports: [RepositoryModule],
  providers: [NoteViewerService, NoteEditorService, MemberActionOnNoteService],
  exports: [NoteViewerService, NoteEditorService, MemberActionOnNoteService],
})
export class ServiceModule {}
