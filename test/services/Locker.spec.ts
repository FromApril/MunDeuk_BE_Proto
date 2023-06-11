import { TestingModule, Test } from "@nestjs/testing";
import { Member, Note, SavedNoteState } from "@prisma/client";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";
import { RepositoryModule } from "src/repositories/repository.module";
import { generateMember } from "test/mocks/member.mock";
import { generateNote } from "test/mocks/note.mock";
import { ServiceModule } from "../../src/services/service.module";
import MemberRepository from "src/repositories/Member.repository";
import LockerService from "src/services/Locker.service";

describe("보관함 액션", () => {
  let lockerService: LockerService;
  let prismaService: PrismaService;
  let memberRepository: MemberRepository;
  let member: Member;
  let notes: Note[];
  let viewer: Member;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RepositoryModule, ServiceModule, PrismaModule],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    lockerService = module.get<LockerService>(LockerService);
    memberRepository = module.get<MemberRepository>(MemberRepository);

    member = await prismaService.member.create({
      data: {
        ...generateMember(),
        locker: {
          create: {},
        },
      },
    });

    viewer = await prismaService.member.create({
      data: {
        ...generateMember(),
        locker: {
          create: {},
        },
      },
    });

    await prismaService.note.createMany({
      data: Array.from({ length: 2 }).map(() =>
        generateNote({ writerId: member.id }),
      ),
    });

    notes = await prismaService.note.findMany({
      where: {
        writerId: member.id,
      },
    });
  });

  it("보관함에 담기!", async () => {
    const viewerId = viewer.id;
    const noteId = notes[0].id;

    await lockerService.subscribe({
      viewerId,
      noteId,
    });

    const { lockerId } = await memberRepository.getLockerId(viewerId);
    let foundNote = await prismaService.savedNote.findUnique({
      where: {
        lockerId_noteId: {
          lockerId,
          noteId,
        },
      },
    });

    expect(foundNote).toBeDefined();
    expect(foundNote.status).toBe(SavedNoteState.SUBSCRIBE);

    await lockerService.unsubscribe({
      viewerId,
      noteId,
    });

    foundNote = await prismaService.savedNote.findUnique({
      where: {
        lockerId_noteId: {
          lockerId,
          noteId,
        },
      },
    });

    expect(foundNote).toBeDefined();
    expect(foundNote.status).toBe(SavedNoteState.UN_SUBSCRIBE);
  });
});
