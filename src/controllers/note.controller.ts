import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import GetNoteDTO from "src/dtos/GetNote.dto";
import LocationDTO from "src/dtos/Location.dto";
import NoteDTO from "src/dtos/Note.dto";
import NoteRepository from "src/repositories/Note.repository";
import NoteViewerService from "src/services/NoteViewer.service";
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('note')
@ApiTags('note')
class NoteController {
  constructor(
    private noteRepository: NoteRepository,
    private noteViewerService: NoteViewerService,
  ) {}

  @Get()
  getNote(@Query() getNote: GetNoteDTO): Promise<NoteDTO[]> {
    return this.noteRepository.findNotesWithInDistance(getNote)
  }

  @Post()
  createNotes(@Body() noteDTO: NoteDTO): Promise<void> {
    return this.noteViewerService.save(noteDTO);
  }
}

export default NoteController;
