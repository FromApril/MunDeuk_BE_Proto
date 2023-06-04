import { ApiProperty, ApiResponse, ApiResponseProperty } from "@nestjs/swagger";
import { Note } from "@prisma/client";
import { Exclude, Expose, Type } from "class-transformer";
import Noticeable from "src/interfaces/Noticeable.interface";

@Exclude()
class NoteDTO extends Noticeable implements Note {
  @ApiResponseProperty({
  })
  @Expose()
  createdAt: Date;

  @ApiResponseProperty({
  })
  @Expose()
  updatedAt: Date;

  @ApiResponseProperty({
  })
  @Expose()
  content: string;

  @ApiResponseProperty({
  })
  @Expose()
  isDeleted: boolean;

  @ApiResponseProperty({
  })
  @Expose()
  viewCount: number;

  @ApiResponseProperty({
  })
  @Expose()
  likeCount: number;

  @ApiResponseProperty({
  })
  @Expose()
  latitude: number;

  @ApiResponseProperty({
  })
  @Expose()
  longitude: number;

  id: BigInt;
  radius: number;
  writerId: BigInt;
}

export default NoteDTO;
