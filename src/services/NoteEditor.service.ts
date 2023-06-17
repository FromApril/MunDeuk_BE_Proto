import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import {
  DeleteNoteDTO,
  SaveNoteDetailDTO,
} from "src/controllers/note/note.dtos";
import NoteDTO from "src/dtos/Note.dto";
import { PrismaService } from "src/prisma/prisma.service";
import NoteRepository from "src/repositories/Note.repository";

@Injectable()
class NoteEditorService {
  constructor(
    @Inject(PrismaService)
    private readonly prismaService: PrismaService,
    @Inject(NoteRepository)
    private readonly noteRepository: NoteRepository,
  ) {}

  async save(noteDTO: SaveNoteDetailDTO): Promise<void> {
    const { writerId, id, content, ...note } = noteDTO;

    await this.prismaService.note.upsert({
      where: {
        id: id ?? BigInt(0),
      },
      update: {
        ...note,
        content: content as Prisma.JsonValue,
      },
      create: {
        ...note,
        content: content as Prisma.JsonValue,
        writer: {
          connect: {
            id: writerId,
          },
        },
      },
    });
  }

  async markAllRead({
    viewerId,
    noteIdList,
  }: {
    noteIdList: bigint[];
    viewerId: bigint;
  }) {
    await this.prismaService.$transaction([
      this.prismaService.locker.update({
        where: {
          ownerId: viewerId,
        },
        data: {
          viewedNoteIdList: {
            push: noteIdList,
          },
        },
      }),
      ...noteIdList.map((noteId) =>
        this.prismaService.note.update({
          where: {
            id: noteId,
          },
          data: {
            viewCount: {
              increment: 1,
            },
          },
        }),
      ),
    ]);
  }

  async delete({ memberId, noteId }: DeleteNoteDTO) {
    await this.prismaService.note.findFirstOrThrow({
      where: { id: noteId, writerId: memberId },
    });

    await this.noteRepository.softDelete(noteId);
  }
}

export default NoteEditorService;
