import { Module } from "@nestjs/common";
import NoteViewerService from "./NoteViewer.service";
import NoteEditorService from "./NoteEditor.service";

@Module({
  providers: [NoteViewerService, NoteEditorService],
  exports: [NoteViewerService, NoteEditorService],
})
export class ServiceModule {}
