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
} from "@nestjs/common";
import LocationDTO from "src/dtos/Location.dto";
import NoteDTO from "src/dtos/Note.dto";
import NoteRepository from "src/repositories/Note.repository";
import NoteViewerService from "src/services/NoteViewer.service";
import NoteEditorService from "src/services/NoteEditor.service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  SaveNoteDetailDTO,
  GetNoteDTO,
  GetNoteDetailDTO,
  DeleteNoteDTO,
} from "./note.dtos";
import { plainToInstance } from "class-transformer";
import LikeNoteDTO from "src/dtos/LikeNote.dto";
import MemberActionOnNoteService from "../../services/MemberActionOnNote.service";
import NoteIdentityDTO from "src/dtos/NoteIdentity.dto";
import LockerService from "src/services/Locker.service";
import RethrowDTO from "src/dtos/Rethrow.dto";

@Controller("note")
@ApiTags("note")
class NoteController {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly noteViewerService: NoteViewerService,
    private readonly noteEditorService: NoteEditorService,
    private readonly lockerService: LockerService,
    private readonly memberActionOnNoteService: MemberActionOnNoteService,
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
  async createNotes(@Body() noteDTO: SaveNoteDetailDTO): Promise<void> {
    await this.noteRepository.save(noteDTO);
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

  @Put()
  async replaceNote(@Body() noteDTO: NoteDTO): Promise<void> {
    await this.noteRepository.save(noteDTO);
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
