import {
  Body,
  Controller,
  Get,
  Put,
  Post,
  Query,
  Param,
  Delete,
  Patch,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import LocationDTO from "src/dtos/Location.dto";
import NoteDTO from "src/dtos/Note.dto";
import NoteRepository from "src/repositories/Note.repository";
import NoteViewerService from "src/services/NoteViewer.service";
import NoteEditorService from "src/services/NoteEditor.service";
import {
  ApiBody,
  ApiConsumes,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  SaveNoteDetailDTO,
  GetNoteDTO,
  GetNoteDetailDTO,
  DeleteNoteDTO,
  CreateNoteDetailDTO,
} from "./note.dtos";
import { plainToInstance } from "class-transformer";
import LikeNoteDTO from "src/dtos/LikeNote.dto";
import MemberActionOnNoteService from "../../services/MemberActionOnNote.service";
import NoteIdentityDTO from "src/dtos/NoteIdentity.dto";
import LockerService from "src/services/Locker.service";
import RethrowDTO from "src/dtos/Rethrow.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { UploadService } from "src/upload/upload.service";

@Controller("note")
@ApiTags("note")
class NoteController {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly noteViewerService: NoteViewerService,
    private readonly noteEditorService: NoteEditorService,
    private readonly lockerService: LockerService,
    private readonly memberActionOnNoteService: MemberActionOnNoteService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  @ApiResponse({
    type: NoteDTO,
    isArray: true,
  })
  getNoteList(@Query() getNote: GetNoteDTO): Promise<NoteDTO[]> {
    return this.noteRepository.findNotesWithInDistance(getNote);
  }

  @Get(":noteId")
  @ApiResponse({
    type: NoteDTO,
  })
  getNote(
    @Param("noteId") noteId: number,
    @Query("memberId") memberId?: number,
  ): Promise<NoteDTO> {
    return this.noteViewerService.detail(
      plainToInstance(GetNoteDetailDTO, {
        noteId,
        memberId,
      }),
    );
  }

  @Post()
  async createNotes(@Body() noteDTO: CreateNoteDetailDTO): Promise<void> {
    await this.noteEditorService.save(noteDTO);
  }
  @Post("withImage")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    isArray: true,
    schema: {
      type: "object",
      properties: {
        files: {
          maxItems: 3,
          type: "string",
          format: "binary",
        },
        content: {
          type: "json",
          format: "json",
        },
        latitude: {
          type: "number",
        },
        longitude: {
          type: "number",
        },
        writerId: {
          type: "bigint",
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor("files", 3, {
      limits: {
        fileSize: 1024 * 1024 * 2,
      },
    }),
  )
  async createNotesWithImage(
    @Body() noteDTO: CreateNoteDetailDTO,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<void> {
    await this.noteEditorService.save(noteDTO, files);
  }

  @Post("image")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    isArray: true,
    schema: {
      type: "object",
      properties: {
        files: {
          maxItems: 3,
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor("files", 3, {
      limits: {
        fileSize: 1024 * 1024 * 2,
      },
    }),
  )
  async uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    const imgurls: string[] = [];

    await Promise.all(
      files.map(async (file) => {
        const { data, error } = await this.uploadService.uploadImage({
          file: file.buffer,
          contentType: file.mimetype,
          fileName: file.filename,
        });
        console.log(error);
        imgurls.push(data.path);
      }),
    );

    return imgurls;
  }

  @Post("like")
  async likeNote(@Body() likeNote: LikeNoteDTO): Promise<void> {
    await this.memberActionOnNoteService.like(likeNote);
  }

  @Post("throw")
  async rethrowNote(@Body() rethrowDTO: RethrowDTO): Promise<void> {
    await this.lockerService.rethrow(rethrowDTO);
  }

  @Post("report")
  async reportNote(@Body() noteIdentityDTO: NoteIdentityDTO): Promise<void> {
    await this.memberActionOnNoteService.report(noteIdentityDTO);
  }

  @Put("withImage")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    isArray: true,
    schema: {
      type: "object",
      properties: {
        files: {
          maxItems: 3,
          type: "string",
          format: "binary",
        },
        content: {
          type: "json",
          format: "json",
        },
        latitude: {
          type: "number",
        },
        longitude: {
          type: "number",
        },
        writerId: {
          type: "bigint",
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor("files", 3, {
      limits: {
        fileSize: 1024 * 1024 * 2,
      },
    }),
  )
  async replaceNote(
    @Body() noteDTO: SaveNoteDetailDTO,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<void> {
    await this.noteEditorService.save(noteDTO, files);
  }

  @Patch("subscribe")
  async subscribeNote(@Body() noteIdentifyDTO: NoteIdentityDTO): Promise<void> {
    await this.lockerService.subscribe(noteIdentifyDTO);
  }

  @Patch("unsubscribe")
  async unsubscribeNote(
    @Body() noteIdentifyDTO: NoteIdentityDTO,
  ): Promise<void> {
    await this.lockerService.unsubscribe(noteIdentifyDTO);
  }

  @Delete()
  deleteNote(@Body() noteDTO: DeleteNoteDTO): Promise<void> {
    return this.noteEditorService.delete(noteDTO);
  }
}

export default NoteController;
