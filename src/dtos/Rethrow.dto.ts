import { ApiProperty } from "@nestjs/swagger";
import LocationDTO from "./Location.dto";
import NoteIdentityDTO from "./NoteIdentity.dto";

class RethrowDTO {
  @ApiProperty({
    type: NoteIdentityDTO,
  })
  identity: NoteIdentityDTO;

  @ApiProperty({
    type: LocationDTO,
  })
  location: LocationDTO;
}

export default RethrowDTO;
