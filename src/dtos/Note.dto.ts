import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
  ApiResponseProperty,
} from "@nestjs/swagger";
import { Note } from "@prisma/client";
import { Exclude, Expose, Type } from "class-transformer";
import Noticeable from "src/interfaces/Noticeable.interface";

@Exclude()
class NoteDTO extends Noticeable implements Note {
  @Expose()
  @ApiPropertyOptional({
    type: Date,
  })
  createdAt: Date;

  @Expose()
  @ApiPropertyOptional({
    type: Date,
  })
  updatedAt: Date;

  @Expose()
  @ApiProperty({
    type: String,
  })
  content: string;

  @Expose()
  @ApiProperty({
    type: Boolean,
  })
  isDeleted: boolean;

  @Expose()
  @ApiProperty({
    type: Number,
  })
  viewCount: number;

  @Expose()
  @ApiProperty({
    type: Number,
  })
  likeCount: number;

  @Expose()
  @ApiProperty({
    type: Number,
  })
  latitude: number;

  @Expose()
  @ApiProperty({
    type: Number,
  })
  longitude: number;

  @Expose()
  @ApiPropertyOptional({
    type: BigInt,
  })
  id: bigint;
  radius: number;
  writerId: bigint;
  ownerId: bigint;
  originId: bigint;
}

export default NoteDTO;
