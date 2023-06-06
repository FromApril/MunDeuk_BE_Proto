import SubscribeDTO from "src/dtos/Subscribe.dto";
import { PrismaService } from "src/prisma/prisma.service";
import MemberRepository from "src/repositories/Member.repository";
import SavedNoteRepository from "src/repositories/SavedNote.repository";
import { SavedNoteState } from "@prisma/client";
import NoteIdentityDTO from "src/dtos/NoteIdentity.dto";

class LockerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly memberRepository: MemberRepository,
    private readonly savedNoteRepository: SavedNoteRepository,
  ) {}

  subscribe({ viewerId, noteId }: NoteIdentityDTO) {
    return this.updateSubscription({
      viewerId,
      noteId,
      action: SavedNoteState.SUBSCRIBE,
    });
  }

  async unsubscribe({ viewerId, noteId }: NoteIdentityDTO) {
    return this.updateSubscription({
      viewerId,
      noteId,
      action: SavedNoteState.UN_SUBSCRIBE,
    });
  }

  private async updateSubscription({ viewerId, noteId, action }: SubscribeDTO) {
    const { lockerId } = await this.memberRepository.getLockerId(viewerId);

    await this.prismaService.savedNote.upsert(
      this.savedNoteRepository.upsertQuery({
        lockerId,
        noteId,
        savedNoteState: action,
      }),
    );
  }
}

export default LockerService;
