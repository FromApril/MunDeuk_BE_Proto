import { Injectable } from "@nestjs/common";
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
    private readonly prismaService: PrismaService,
    private readonly noteRepository: NoteRepository,
  ) {}

  async save(noteDTO: SaveNoteDetailDTO): Promise<void> {
    const { writerId, id, ...note } = noteDTO;

    await this.prismaService.$transaction(async (tx) => {
      // @TODO: 잘못 삭제 위험
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

  async delete({ memberId, noteId }: DeleteNoteDTO) {
    await this.prismaService.note.findFirstOrThrow({
      where: { id: noteId, writerId: memberId },
    });

    await this.noteRepository.softDelete(noteId);
  }
}

export default NoteEditorService;
