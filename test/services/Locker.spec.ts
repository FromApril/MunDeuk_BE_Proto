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
import { generateLocation } from "test/mocks/location.mock";
import { UploadService } from "src/upload/upload.service";
import UploaderServiceMock from "test/mocks/uploader.mock";

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
    })
      .overrideProvider(UploadService)
      .useClass(UploaderServiceMock)
      .compile();

    prismaService = module.get<PrismaService>(PrismaService);
    memberRepository = module.get<MemberRepository>(MemberRepository);
    lockerService = module.get<LockerService>(LockerService);

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

    const { lockerId } = await memberRepository.getLockerId(viewerId);
    await lockerService.subscribe({
      viewerId,
      noteId,
    });

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

  it("보관함에서 떤지기!", async () => {
    const viewerId = viewer.id;
    const { id: noteId, content: noteContent } = notes[1];
    const location = generateLocation();

    await lockerService.rethrow({
      identity: {
        noteId,
        viewerId,
      },
      location,
    });

    const foundNote = await prismaService.note.findFirst({
      where: {
        longitude: location.longitude,
        latitude: location.latitude,
        writerId: viewerId,
      },
    });

    expect(foundNote).toBeDefined();
    expect(foundNote.content).toBe(noteContent);
  });
});
