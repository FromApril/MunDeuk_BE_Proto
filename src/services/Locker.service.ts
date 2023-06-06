import SubscribeDTO from "src/dtos/Subscribe.dto";
import { PrismaService } from "src/prisma/prisma.service";
import MemberRepository from "src/repositories/Member.repository";
import SavedNoteRepository from "src/repositories/SavedNote.repository";
import { SavedNoteState } from "@prisma/client";
import NoteIdentityDTO from "src/dtos/NoteIdentity.dto";
import RethrowDTO from "src/dtos/Rethrow.dto";
import NoteRepository from "src/repositories/Note.repository";

class LockerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly noteRepository: NoteRepository,
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

  async rethrow({ location, identity }: RethrowDTO) {
    const { viewerId, noteId } = identity;
    const { longitude, latitude } = location;

    const { content, writerId, ownerId, originId } =
      await this.prismaService.note.findUniqueOrThrow({
        where: {
          id: noteId,
        },
        select: {
          content: true,
          writerId: true,
          ownerId: true,
          originId: true,
        },
      });

    await this.noteRepository.save({
      writerId: viewerId,
      longitude,
      latitude,
      content,
      ownerId: ownerId ?? writerId,
      originId: originId ?? noteId,
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
