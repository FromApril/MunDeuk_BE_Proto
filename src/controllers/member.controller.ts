import { Body, Controller, Post } from "@nestjs/common";
import { ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import MemberDTO from "src/dtos/Member.dto";
import NoteDTO from "src/dtos/Note.dto";
import { PrismaService } from "src/prisma/prisma.service";

@ApiTags("member")
@Controller('member')
class MemberController {
  constructor(
    private prismaService: PrismaService,
  ) {}

  @Post('/') 
  async createMember(@Body() createDTO: MemberDTO): Promise<MemberDTO> {
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
