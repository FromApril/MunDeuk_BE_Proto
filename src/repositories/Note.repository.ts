import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Note } from '@prisma/client';
import NoteDTO from "src/dtos/Note.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
class NoteRepository {
  constructor(private prismaService:PrismaService){}

  async findNotesWithInDistance({
    memberId,
    latitude,
    longitude,
    size = 10,
    radius = 2,
  }: { 
    latitude: number,
    longitude: number,
    memberId?: bigint,
    radius?: number,
    size?: number,
  }):Promise<NoteDTO[]> {
    return await this.prismaService.$transaction(async (tx) => {
      let viewNoteIdList:BigInt[] = [BigInt(0)];

      if (memberId) {
        viewNoteIdList = await (await tx.locker.findUnique({ 
          where: { ownerId: memberId },
          select: { 
            viewedNoteIdList: true
          }
        })).viewedNoteIdList;
      }

      const noteList = await tx.$queryRaw<Note[]>`SELECT * from "Note"
        where CAST(id as varchar) not in (${viewNoteIdList.map(x => x.toString()).join(', ')})
          and ST_DWithin(ST_MakePoint(longitude, latitude), ST_MakePoint(${longitude}, ${latitude}), ${radius} * 1000)
        limit ${size}
      `;

      return noteList.map((note) => plainToInstance(NoteDTO, note));
    });
  }
}

export default NoteRepository;
