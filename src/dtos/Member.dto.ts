import { Member } from "@prisma/client";
import { Exclude, Expose } from 'class-transformer';

@Exclude()
class MemberDTO implements Member {
  password: string;
  createdAt: Date;
  updatedAt: Date;

  @Expose()
  id: BigInt;

  @Expose()
  email: string;

  @Expose()
  nickname: string;
}

export default MemberDTO;
