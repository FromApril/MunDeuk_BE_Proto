import { Module } from "@nestjs/common";
import NoteViewerService from "./NoteViewer.service";

@Module({
  providers: [NoteViewerService],
  exports: [NoteViewerService],
})
export class ServiceModule {}
