import LikeNoteDTO from "src/dtos/LikeNote.dto";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, SavedNoteState } from "@prisma/client";
import MemberRepository from "../../dist/repositories/Member.repository";
import NoteRepository from "src/repositories/Note.repository";
import NoteIdentityDTO from "src/dtos/NoteIdentity.dto";

class MemberActionOnNoteService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly memberRepository: MemberRepository,
    private readonly noteRepository: NoteRepository,
  ) {}

  // 좋아요
  async like({ memberId, noteId, like }: LikeNoteDTO) {
    const { lockerId } = await this.memberRepository.getLockerId(memberId);

    let savedNoteState: SavedNoteState = SavedNoteState.LIKE;
    let updateLikeCountQuery = this.noteRepository.likeQuery(noteId);

    if (like === false) {
      savedNoteState = SavedNoteState.UN_LIKE;
      updateLikeCountQuery = this.noteRepository.unlikeQuery(noteId);
    }

    await this.prismaService.$transaction([
      this.prismaService.savedNote.upsert(
        this.saveToLikedNoteQuery({
          lockerId,
          noteId,
          savedNoteState,
        }),
      ),
      this.prismaService.note.update(updateLikeCountQuery),
    ]);
  }

  // 신고
  async report({ memberId, noteId }: NoteIdentityDTO) {
    const { lockerId } = await this.memberRepository.getLockerId(memberId);

    this.prismaService.savedNote.create({
      data: {
        lockerId,
        noteId,
        status: SavedNoteState.REPORTED,
      },
    });
  }

  // 숨기기

  private saveToLikedNoteQuery({
    lockerId,
    noteId,
    savedNoteState,
  }: {
    lockerId: bigint;
    noteId: bigint;
    savedNoteState: SavedNoteState;
  }): Prisma.SavedNoteUpsertArgs {
    return {
      where: {
        lockerId_noteId: {
          lockerId,
          noteId,
        },
      },
      update: {
        status: savedNoteState,
      },
      create: {
        status: savedNoteState,
        lockerId,
        noteId,
      },
    };
  }
}

export default MemberActionOnNoteService;
