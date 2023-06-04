import { TestingModule, Test } from "@nestjs/testing";
import { Member, Note } from "@prisma/client";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";
import NoteRepository from "src/repositories/Note.repository";
import { RepositoryModule } from "src/repositories/repository.module";
import NoteViewerService from "src/services/NoteViewer.service";
import { generateMember } from "test/mocks/member.mock";
import { generateNote } from "test/mocks/note.mock";
import { ServiceModule } from '../../src/services/service.module';

describe("쪽지 조회 서비스", () => {
  let noteViewerService: NoteViewerService;
  let prismaService: PrismaService;
  let member: Member;
  let notes: Note[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RepositoryModule, ServiceModule,PrismaModule],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    noteViewerService = module.get<NoteViewerService>(NoteViewerService);

    member = await prismaService.member.create({
      data: {
        ...generateMember(),
        locker: {
          create: {}
        }
      }
    });

    await prismaService.note.createMany({
      data: Array.from({length: 10}).map(() => generateNote({writerId: member.id})),
    });

    notes = await prismaService.note.findMany({
      where: {
        writerId: member.id,
      }
    });
  });

  it("자세히 보기 진행시 조회한 목록에 해당 쪽지가 추가된다.", async () => {
    const { viewedNoteIdList:prevNoteIdList } = await prismaService.locker.findUnique({ 
      where: {
        ownerId: member.id,
      },select: {
        viewedNoteIdList: true,
      }
    });
    expect(prevNoteIdList).not.toContain(notes[0].id);

    await noteViewerService.detail({
      noteId: notes[0].id,
      memberId: member.id,
    });

    const {viewedNoteIdList: afterNoteIdList} = await prismaService.locker.findUnique({
      where: {
        ownerId: member.id,
      },
      select:{
        viewedNoteIdList: true,
      }
    });

    expect(afterNoteIdList).toContain(notes[0].id);
  })
});
