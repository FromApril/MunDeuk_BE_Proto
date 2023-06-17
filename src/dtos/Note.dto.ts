import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
  ApiResponseProperty,
} from "@nestjs/swagger";
import { Note, NoteState } from "@prisma/client";
import { Exclude, Expose, Type } from "class-transformer";
import Noticeable from "src/interfaces/Noticeable.interface";

@Exclude()
class NoteDTO extends Noticeable implements Note {
  @Expose()
  @ApiProperty({
    type: String,
    isArray: true,
  })
  imageUrls: string[];

  @Expose()
  @ApiPropertyOptional({
    enum: NoteState,
  })
  noteState: NoteState;

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
    type: JSON,
  })
  content: string;

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
