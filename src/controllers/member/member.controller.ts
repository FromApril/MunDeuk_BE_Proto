import { Body, Controller, Post } from "@nestjs/common";
import { ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import MemberDTO from "src/dtos/Member.dto";
import NoteDTO from "src/dtos/Note.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { PostMemberDTO } from "./member.dtos";

@ApiTags("member")
@Controller('member')
class MemberController {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  @Post('/')
  @ApiResponse({
    type: MemberDTO,
  })
  async createMember(@Body() createDTO: PostMemberDTO) {
    const member = await this.prismaService.member.create({
      data: {
        ...createDTO,
        locker: {
          create: {
          }
        }
      }
    });

    return plainToInstance(MemberDTO, member);
  }
}

export default MemberController;
