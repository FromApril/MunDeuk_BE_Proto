import { Member } from "@prisma/client";
import { Exclude, Expose } from 'class-transformer';

@Exclude()
class MemberDTO implements Member {
  id: bigint;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  @Expose()
  email: string;

  @Expose()
  nickname: string;
}

export default MemberDTO;
