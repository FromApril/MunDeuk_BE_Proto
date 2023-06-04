import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Note } from '@prisma/client';
import NoteDTO from "src/dtos/Note.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
class NoteRepository {
  constructor(private prismaService:PrismaService){}

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

  async findNearNotesWithFilter({
    memberId,
    latitude,
    longitude,
    radius = 1,
    size = 10
  }: { 
    memberId: number,
    latitude: number,
    longitude: number,
    radius?: number, // killometers
    size?: number,
  }):Promise<NoteDTO[]> {
    const noteList = await this.prismaService.$transaction(async (tx) => {
      const { viewedNoteIdList } = await tx.locker.findUnique({ 
        where: { ownerId: memberId },
        select: { 
          viewedNoteIdList: true
        }
      });

      return await tx.$queryRaw<Note[]>`SELECT * from "Note" n
        where n.id not in (${viewedNoteIdList})
          and ST_DWithin(ST_MakePoint(longitude, latitude), ST_MakePoint(${longitude}, ${latitude})::geography, ${radius} * 1000)
        limit ${size}
      `;
    });
    
    return noteList.map((note) => plainToInstance(NoteDTO, note));
  }
}

export default NoteRepository;
