import { Note } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";
import Noticeable from "src/interfaces/Noticeable.interface";

@Exclude()
class NoteDTO extends Noticeable implements Note {
  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  content: string;

  @Expose()
  isDeleted: boolean;

  @Expose()
  viewCount: number;

  @Expose()
  likeCount: number;

  @Expose()
  latitude: number;

  @Expose()
  longitude: number;

  @Expose()
  radius: number;

  id: bigint;
  writerId: bigint;
}

export default NoteDTO;
