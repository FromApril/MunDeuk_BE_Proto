import SubscribeDTO from "src/dtos/Subscribe.dto";
import { PrismaService } from "src/prisma/prisma.service";
import MemberRepository from "src/repositories/Member.repository";
import SavedNoteRepository from "src/repositories/SavedNote.repository";
import { SavedNoteState } from "@prisma/client";
import NoteIdentityDTO from "src/dtos/NoteIdentity.dto";
import RethrowDTO from "src/dtos/Rethrow.dto";
import NoteRepository from "src/repositories/Note.repository";
import { Inject } from "@nestjs/common";

class LockerService {
  constructor(
    @Inject(PrismaService)
    private readonly prismaService: PrismaService,
    @Inject(NoteRepository)
    private readonly noteRepository: NoteRepository,
    @Inject(MemberRepository)
    private readonly memberRepository: MemberRepository,
    @Inject(SavedNoteRepository)
    private readonly savedNoteRepository: SavedNoteRepository,
  ) {}

  async subscribe({ viewerId, noteId }: NoteIdentityDTO) {
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

    const { content, writerId, ownerId, originId, imageUrls } =
      await this.prismaService.note.findUniqueOrThrow({
        where: {
          id: noteId,
        },
        select: {
          content: true,
          writerId: true,
          ownerId: true,
          originId: true,
          imageUrls: true,
        },
      });

    await this.noteRepository.save({
      writerId: viewerId,
      longitude,
      latitude,
      content: content as any,
      ownerId: ownerId ?? writerId,
      originId: originId ?? noteId,
      imageUrls,
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
