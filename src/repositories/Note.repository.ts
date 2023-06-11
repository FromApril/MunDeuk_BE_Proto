import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Note, Prisma } from "@prisma/client";
import NoteDTO from "src/dtos/Note.dto";
import { PrismaService } from "src/prisma/prisma.service";
import {
  GetNoteWithLocationDTO,
  SaveNoteDetailDTO,
} from "src/controllers/note/note.dtos";

@Injectable()
class NoteRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findNotesWithInDistance({
    latitude,
    longitude,
    memberId,
    size = 10,
    radius = 2,
  }: GetNoteWithLocationDTO): Promise<NoteDTO[]> {
    return await this.prismaService.$transaction(async (tx) => {
      let viewNoteIdList: BigInt[] = [BigInt(0)];

      if (memberId) {
        viewNoteIdList = (
          await tx.locker.findUnique({
            where: { ownerId: memberId },
            select: {
              viewedNoteIdList: true,
            },
          })
        ).viewedNoteIdList;
      }

      const noteList = await tx.$queryRaw<Note[]>`SELECT * from "Note"
        where CAST(id as varchar) not in (${viewNoteIdList
          .map((x) => x.toString())
          .join(", ")})
          and ST_DWithin(ST_MakePoint(longitude, latitude), ST_MakePoint(${longitude}, ${latitude}), ${radius} * 1000)
          and "isDeleted" = false
        limit ${size}
      `;

      return noteList.map((note) => plainToInstance(NoteDTO, note));
    });
  }

  async softDelete(noteId: bigint) {
    await this.prismaService.note.update({
      where: { id: noteId },
      data: {
        isDeleted: true,
      },
    });
  }

  async save(noteDTO: SaveNoteDetailDTO): Promise<Note> {
    const { writerId, id, ...note } = noteDTO;

    return await this.prismaService.note.upsert({
      where: {
        id: id ?? BigInt(0),
      },
      update: note,
      create: {
        ...note,
        writer: {
          connect: {
            id: writerId,
          },
        },
      },
    });
  }

  likeQuery(noteId: bigint): Prisma.NoteUpdateArgs {
    return {
      where: { id: noteId },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    };
  }

  unlikeQuery(noteId: bigint): Prisma.NoteUpdateArgs {
    return {
      where: { id: noteId },
      data: {
        likeCount: {
          decrement: 1,
        },
      },
    };
  }
}

export default NoteRepository;
