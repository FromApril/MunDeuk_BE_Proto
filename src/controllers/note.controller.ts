import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import LocationDTO from "src/dtos/Location.dto";
import NoteDTO from "src/dtos/Note.dto";
import NoteRepository from "src/repositories/Note.repository";
import NoteViewerService from "src/services/NoteViewer.service";

@Controller('note')
class NoteController {
  constructor(
    private noteRepository: NoteRepository,
    private noteViewerService: NoteViewerService,
  ) {}

  @Get("/:memberId")
  getNote(@Param("memberId") memberId: number, @Query() location: LocationDTO) {
    return this.noteRepository.findNotesWithInDistance({
      memberId,
      ...location,
    })
  }

  @Post()
  createNotes(@Body() noteDTO: NoteDTO) {
    return this.noteViewerService.save(noteDTO);
  }
}

export default NoteController;
