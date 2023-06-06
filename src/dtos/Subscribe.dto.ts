import { SavedNoteState } from "@prisma/client";
import NoteIdentityDTO from "./NoteIdentity.dto";
import { ApiProperty } from "@nestjs/swagger";

type SubscribeAction =
  | typeof SavedNoteState.SUBSCRIBE
  | typeof SavedNoteState.UN_SUBSCRIBE;

class SubscribeDTO extends NoteIdentityDTO {
  @ApiProperty({
    type: BigInt,
  })
  action?: SubscribeAction;
}

export default SubscribeDTO;
