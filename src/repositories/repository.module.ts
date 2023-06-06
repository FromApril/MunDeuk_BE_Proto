import { Module } from "@nestjs/common";
import MemberRepository from "./Member.repository";
import NoticeRepository from "./Notice.repository";
import NoteRepository from "./Note.repository";
import SavedNoteRepository from "./SavedNote.repository";

@Module({
  providers: [
    MemberRepository,
    NoticeRepository,
    NoteRepository,
    SavedNoteRepository,
  ],
  exports: [
    MemberRepository,
    NoticeRepository,
    NoteRepository,
    SavedNoteRepository,
  ],
})
export class RepositoryModule {}
