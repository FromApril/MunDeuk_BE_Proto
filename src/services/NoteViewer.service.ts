import { Inject, Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import NoteDTO from "src/dtos/Note.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { GetNoteDetailDTO } from "src/controllers/note/note.dtos";

@Injectable()
class NoteViewerService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}

  async detail({ noteId, memberId }: GetNoteDetailDTO): Promise<NoteDTO> {
    const note = await this.prismaService.note.findUniqueOrThrow({
      where: {
        id: noteId,
      },
    });

    if (memberId) {
      await this.prismaService.locker.update({
        where: {
          ownerId: memberId,
        },
        data: {
          viewedNoteIdList: {
            push: note.id,
          },
        },
      });
    }

    return plainToInstance(NoteDTO, note);
  }
}

export default NoteViewerService;
