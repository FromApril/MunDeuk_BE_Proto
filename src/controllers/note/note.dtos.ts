import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import LocationDTO from "../../dtos/Location.dto";

export class GetNoteDTO extends LocationDTO {
  @ApiPropertyOptional({
    "description": "조회하는 맴버의 아이디",
    "type": BigInt,
  })
  @Type(() => BigInt)
  memberId?: bigint;
}

export class GetNoteDetailDTO {

  @ApiPropertyOptional({
    "description": "조회하는 맴버의 아이디",
    "type": BigInt,
  })
  @Type(() => BigInt)
  memberId?: bigint;

  @ApiProperty({
    "description": "조회하는 맴버의 아이디",
    "type": BigInt,
  })
  @Type(() => BigInt)
  noteId: bigint;
}

