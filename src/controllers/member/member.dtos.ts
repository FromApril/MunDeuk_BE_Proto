import { ApiProperty } from "@nestjs/swagger";

export class PostMemberDTO {
  @ApiProperty({
    type: String,
  })
  email: string;

  @ApiProperty({
    type: String,
  })
  nickname: string;

  @ApiProperty({
    type: String,
  })
  password: string;
}
