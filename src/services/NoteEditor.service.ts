import { Injectable } from "@nestjs/common";
import { SaveNoteDetailDTO } from "src/controllers/note/note.dtos";
import NoteDTO from "src/dtos/Note.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
class NoteEditorService {
  constructor(private readonly prismaService: PrismaService) {}

  async save(noteDTO: SaveNoteDetailDTO): Promise<void> {
    const { writerId, id, ...note } = noteDTO;

    await this.prismaService.$transaction(async (tx) => {
      const upsertedNote = await tx.note.upsert({
        where: {
          id,
        },
        update: note,
        create: {
          ...note,
          radius: 1,
          writer: {
            connect: {
              id: writerId,
            },
          },
        },
      });

      await tx.locker.update({
        where: { ownerId: writerId },
        data: {
          viewedNoteIdList: {
            push: upsertedNote.id,
          },
        },
      });
    });
  }
}

export default NoteEditorService;
