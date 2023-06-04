import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import NoteDTO from "src/dtos/Note.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
class NoteViewerService {
  constructor(
    private prismaService: PrismaService
  ) {}

  async save(noteDTO: NoteDTO): Promise<void> {
    const {writerId, id, ...note} = noteDTO;

    await this.prismaService.$transaction(async (tx) => {
      const upsertedNote = await tx.note.upsert({
        where: {
          id
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
          }
        }
      });
    });
  }

  async detail({
    noteId,
    memberId,
  }: {
    noteId: bigint;
    memberId?: bigint;
  }): Promise<NoteDTO> { 
    const note = await this.prismaService.note.findUniqueOrThrow({
      where: {
        id: noteId,
      }
    });

    if (memberId) {
      await this.prismaService.locker.update({
        where: {
          ownerId: memberId,
        },
        data: {
          viewedNoteIdList: {
            push: note.id,
          }
        }
      })
    }

    return plainToInstance(NoteDTO, note);
  }
}

export default NoteViewerService;
