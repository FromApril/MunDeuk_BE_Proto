import { ApiProperty } from "@nestjs/swagger";
import NoteIdentityDTO from "./NoteIdentity.dto";

class LikeNoteDTO extends NoteIdentityDTO {
  @ApiProperty({
    type: Boolean,
  })
  like: boolean;
}

export default LikeNoteDTO;
