import { TestingModule, Test } from "@nestjs/testing";
import { Member, Note, SavedNoteState } from "@prisma/client";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";
import { RepositoryModule } from "src/repositories/repository.module";
import { generateMember } from "test/mocks/member.mock";
import { generateNote } from "test/mocks/note.mock";
import { ServiceModule } from "../../src/services/service.module";
import MemberActionOnNoteService from "../../src/services/MemberActionOnNote.service";
import MemberRepository from "src/repositories/Member.repository";
import { UploadService } from "src/upload/upload.service";
import UploaderServiceMock from "test/mocks/uploader.mock";

describe("맴버 액션", () => {
  let memberActionOnNoteService: MemberActionOnNoteService;
  let prismaService: PrismaService;
  let memberRepository: MemberRepository;
  let member: Member;
  let notes: Note[];
  let viewer: Member;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RepositoryModule, ServiceModule, PrismaModule],
    })
      .overrideProvider(UploadService)
      .useClass(UploaderServiceMock)
      .compile();

    prismaService = module.get<PrismaService>(PrismaService);
    memberActionOnNoteService = module.get<MemberActionOnNoteService>(
      MemberActionOnNoteService,
    );
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

  it("좋아요!", async () => {
    expect(notes[0].likeCount).toBe(0);
    await memberActionOnNoteService.like({
      viewerId: viewer.id,
      noteId: notes[0].id,
      like: true,
    });

    const foundNote = await prismaService.note.findUnique({
      where: {
        id: notes[0].id,
      },
    });

    expect(foundNote).toBeDefined();
    expect(foundNote.likeCount).toBe(1);
  });

  it("쪽지 신고!", async () => {
    const noteId = notes[1].id;
    const viewerId = viewer.id;
    await memberActionOnNoteService.report({
      viewerId,
      noteId,
    });

    const { lockerId } = await memberRepository.getLockerId(viewerId);
    const foundNote = await prismaService.savedNote.findUnique({
      where: {
        lockerId_noteId: {
          lockerId,
          noteId,
        },
      },
    });

    expect(foundNote).toBeDefined();
    expect(foundNote?.status).toBe(SavedNoteState.REPORTED);
  });
});
