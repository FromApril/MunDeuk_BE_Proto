import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import LocationDTO from "../../dtos/Location.dto";

export class GetNoteDTO extends LocationDTO {
  @ApiPropertyOptional({
    description: "조회하는 맴버의 아이디",
    type: BigInt,
  })
  @Type(() => BigInt)
  memberId?: bigint;
}

export class GetNoteWithLocationDTO extends LocationDTO {
  @ApiPropertyOptional({
    description: "조회하는 맴버의 아이디",
    type: BigInt,
  })
  @Type(() => BigInt)
  memberId?: bigint;

  @ApiPropertyOptional({
    description: "조회하는 맴버의 아이디",
    type: Number,
  })
  @Type(() => Number)
  radius?: number;

  @ApiPropertyOptional({
    description: "조회하는 맴버의 아이디",
    type: Number,
  })
  @Type(() => Number)
  size?: number;
}

export class GetNoteDetailDTO {
  @ApiPropertyOptional({
    description: "조회하는 맴버의 아이디",
    type: BigInt,
  })
  @Type(() => BigInt)
  memberId?: bigint;

  @ApiProperty({
    description: "조회하는 쪽지의 아이디",
    type: BigInt,
  })
  @Type(() => BigInt)
  noteId: bigint;
}

export class DeleteNoteDTO {
  @ApiPropertyOptional({
    description: "조회하는 맴버의 아이디",
    type: BigInt,
  })
  @Type(() => BigInt)
  memberId: bigint;

  @ApiProperty({
    description: "조회하는 쪽지의 아이디",
    type: BigInt,
  })
  @Type(() => BigInt)
  noteId: bigint;
}

export class CreateNoteDetailDTO {
  @ApiProperty({
    type: JSON,
  })
  content: string;

  @ApiProperty({
    type: Number,
  })
  @Type(() => Number)
  latitude: number;

  @ApiProperty({
    type: Number,
  })
  @Type(() => Number)
  longitude: number;

  @ApiProperty({
    type: BigInt,
  })
  @Type(() => BigInt)
  writerId: bigint;
}

export class SaveNoteDetailDTO extends CreateNoteDetailDTO {
  @ApiPropertyOptional({
    type: BigInt,
  })
  id?: bigint;

  @ApiPropertyOptional({
    type: BigInt,
  })
  ownerId?: bigint;

  @ApiPropertyOptional({
    type: BigInt,
  })
  originId?: bigint;
}
