import {
  Body,
  Controller,
  Get,
  Put,
  Post,
  Query,
  Param,
  Delete,
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

@Controller("note")
@ApiTags("note")
class NoteController {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly noteViewerService: NoteViewerService,
    private readonly noteEditorService: NoteEditorService,
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
  createNotes(@Body() noteDTO: SaveNoteDetailDTO): Promise<void> {
    return this.noteEditorService.save(noteDTO);
  }

  @Put()
  replaceNote(@Body() noteDTO: NoteDTO): Promise<void> {
    return this.noteEditorService.save(noteDTO);
  }

  @Delete()
  deleteNote(@Body() noteDTO: DeleteNoteDTO): Promise<void> {
    return this.noteEditorService.delete(noteDTO);
  }
}

export default NoteController;
