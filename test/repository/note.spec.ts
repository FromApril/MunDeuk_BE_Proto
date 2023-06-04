import { Test, TestingModule } from "@nestjs/testing";
import { Member, Note } from "@prisma/client";
import LocationDTO from "src/dtos/Location.dto";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";
import NoteRepository from "src/repositories/Note.repository";
import { RepositoryModule } from "src/repositories/repository.module";
import { generateLocation } from "test/mocks/location.mock";
import { generateMember } from "test/mocks/member.mock";
import { generateNote } from "test/mocks/note.mock";
import { getDistance } from "test/utils/math";

describe("쪽지 스펙", () => {
  let prismaService: PrismaService;
  let noteRepository: NoteRepository;
  let member: Member;
  let notes: Note[];

  beforeAll(async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports: [RepositoryModule, PrismaModule],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    noteRepository = module.get<NoteRepository>(NoteRepository);

    member = await prismaService.member.create({
      data: generateMember(),
    });

    await prismaService.note.createMany({
      data: Array.from({length: 10}).map(() => generateNote({writerId: member.id})),
    });

    notes = await prismaService.note.findMany({
      where: {
        writerId: member.id,
      }
    });
  })

  it("거리 내 조회가 가능합니다.", async () => {
    const location = generateLocation();
    const searchSize = 4; 
    const radius = 1;
    const noteDTOList = await noteRepository.findNotesWithInDistance({
      ...location,
      size: searchSize,
      radius,
    });

    expect(noteDTOList.length).toBe(searchSize);
    expect(noteDTOList.every((note) => {
      return getDistance(note, location) < radius * 1000;
    }));

  });
});

function getDistance(from:LocationDTO, to: LocationDTO): number {
  return Math.sqrt(
    Math.pow((from.longitude - to.longitude), 2)
    + Math.pow((from.latitude - to.latitude), 2)
  );
}