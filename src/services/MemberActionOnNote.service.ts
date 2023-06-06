import LikeNoteDTO from "src/dtos/LikeNote.dto";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, SavedNoteState } from "@prisma/client";
import MemberRepository from "src/repositories/Member.repository";
import NoteRepository from "src/repositories/Note.repository";
import NoteIdentityDTO from "src/dtos/NoteIdentity.dto";
import SavedNoteRepository from "src/repositories/SavedNote.repository";

class MemberActionOnNoteService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly memberRepository: MemberRepository,
    private readonly noteRepository: NoteRepository,
    private readonly savedNoteRepository: SavedNoteRepository,
  ) {}

  // 좋아요
  async like({ viewerId, noteId, like }: LikeNoteDTO) {
    const { lockerId } = await this.memberRepository.getLockerId(viewerId);

    let savedNoteState: SavedNoteState = SavedNoteState.LIKE;
    let updateLikeCountQuery = this.noteRepository.likeQuery(noteId);

    if (like === false) {
      savedNoteState = SavedNoteState.UN_LIKE;
      updateLikeCountQuery = this.noteRepository.unlikeQuery(noteId);
    }

    await this.prismaService.$transaction([
      this.prismaService.savedNote.upsert(
        this.savedNoteRepository.upsertQuery({
          lockerId,
          noteId,
          savedNoteState,
        }),
      ),
      this.prismaService.note.update(updateLikeCountQuery),
    ]);
  }

  // 신고
  async report({ viewerId, noteId }: NoteIdentityDTO) {
    const { lockerId } = await this.memberRepository.getLockerId(viewerId);

    this.prismaService.savedNote.create({
      data: {
        lockerId,
        noteId,
        status: SavedNoteState.REPORTED,
      },
    });
  }
}

export default MemberActionOnNoteService;
