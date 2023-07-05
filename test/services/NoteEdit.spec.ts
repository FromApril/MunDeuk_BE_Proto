import { TestingModule, Test } from "@nestjs/testing";
import { Member, Note, NoteState } from "@prisma/client";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";
import NoteRepository from "src/repositories/Note.repository";
import { RepositoryModule } from "src/repositories/repository.module";
import NoteViewerService from "src/services/NoteViewer.service";
import { generateMember } from "test/mocks/member.mock";
import { generateNote } from "test/mocks/note.mock";
import { ServiceModule } from "../../src/services/service.module";
import NoteEditorService from "src/services/NoteEditor.service";
import MemberActionOnNoteService from "../../src/services/MemberActionOnNote.service";
import LockerService from "src/services/Locker.service";
import { plainToInstance } from "class-transformer";
import { SaveNoteDetailDTO } from "src/controllers/note/note.dtos";
import { UploadService } from "src/upload/upload.service";
import UploaderServiceMock from "test/mocks/uploader.mock";

describe("쪽지 편집", () => {
  let noteEditorService: NoteEditorService;
  let prismaService: PrismaService;
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
    noteEditorService = module.get<NoteEditorService>(NoteEditorService);

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
      data: Array.from({ length: 10 }).map(() =>
        generateNote({ writerId: member.id }),
      ),
    });

    notes = await prismaService.note.findMany({
      where: {
        writerId: member.id,
      },
    });
  });

  it("쪽지 업데이트 가능!", async () => {
    const note = notes[0];
    note.content = { text: `${note.content} hello world` };

    await noteEditorService.save(note as any);

    const foundNote = await prismaService.note.findUnique({
      where: {
        id: note.id,
      },
    });

    expect(foundNote.content).toMatchObject(note.content);
  });

  it("쪽지 생성 가능!", async () => {
    const newNote = plainToInstance(
      SaveNoteDetailDTO,
      generateNote({ writerId: member.id }),
    );

    await noteEditorService.save(newNote);

    const foundNote = await prismaService.note.findFirst({
      where: {
        writerId: member.id,
        latitude: newNote.latitude,
        longitude: newNote.longitude,
      },
    });

    expect(foundNote).toBeDefined();
    expect(foundNote.content).toMatchObject(JSON.parse(newNote.content));
  });

  it("쪽지 삭제 가능!", async () => {
    await noteEditorService.delete({
      memberId: member.id,
      noteId: notes[0].id,
    });

    const foundNote = await prismaService.note.findUnique({
      where: {
        id: notes[0].id,
      },
    });

    expect(foundNote.noteState).toBe(NoteState.DELETED);
  });
});
