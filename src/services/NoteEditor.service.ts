import { Injectable } from "@nestjs/common";
import NoteDTO from "src/dtos/Note.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
class NoteEditorService {
  constructor(private readonly prismaService: PrismaService ) {}

  async save(noteDTO: NoteDTO ): Promise<void> {
    const { writerId, id, ...note } = noteDTO;

    await this.prismaService.$transaction(async (tx) => {
      const upsertedNote = await tx.note.upsert({
        where: {
          id,
        },
        update: note,
        create: {
          ...note,
          writerId,
        },
      });

      if (!noteDTO.isChecked) {
        return;
      }

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

