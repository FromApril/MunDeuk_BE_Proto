import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import LocationDTO from "../../dtos/Location.dto";
import { Note } from "@prisma/client";

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

export class SaveNoteDetailDTO {
  @ApiProperty({
    type: String,
  })
  content: string;

  @ApiProperty({
    type: Number,
  })
  latitude: number;

  @ApiProperty({
    type: Number,
  })
  longitude: number;

  @ApiProperty({
    type: BigInt,
  })
  writerId: bigint;

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
