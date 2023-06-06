import { Module } from "@nestjs/common";
import MemberRepository from "./Member.repository";
import NoticeRepository from "./Notice.repository";
import NoteRepository from "./Note.repository";

@Module({
  providers: [MemberRepository, NoticeRepository, NoteRepository],
  exports: [MemberRepository, NoticeRepository, NoteRepository],
})
export class RepositoryModule {}
