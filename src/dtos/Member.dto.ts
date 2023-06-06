import { Member } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

@Exclude()
class MemberDTO implements Member {
  password: string;
  createdAt: Date;
  updatedAt: Date;

  @Expose()
  @ApiProperty({
    type: BigInt,
  })
  id: bigint;

  @Expose()
  @ApiProperty({
    type: String,
  })
  email: string;

  @Expose()
  @ApiProperty({
    type: String,
  })
  nickname: string;
}

export default MemberDTO;
