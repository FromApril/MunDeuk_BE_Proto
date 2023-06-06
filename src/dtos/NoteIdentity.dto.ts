import { ApiProperty } from "@nestjs/swagger";

class NoteIdentityDTO {
  @ApiProperty({
    type: BigInt,
  })
  viewerId: bigint;

  @ApiProperty({
    type: BigInt,
  })
  noteId: bigint;
}

export default NoteIdentityDTO;
