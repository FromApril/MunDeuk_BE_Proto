import { SavedNoteState } from "@prisma/client";
import NoteIdentityDTO from "./NoteIdentity.dto";

type SubscribeAction =
  | typeof SavedNoteState.SUBSCRIBE
  | typeof SavedNoteState.UN_SUBSCRIBE;

class SubscribeDTO extends NoteIdentityDTO {
  action?: SubscribeAction;
}

export default SubscribeDTO;
