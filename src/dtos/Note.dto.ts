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

  id: bigint;
  writerId: bigint;
  latitude: number;
  longitude: number;
  radius: number;
}

export default NoteDTO;
