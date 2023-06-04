import { Body, Controller, Post } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import MemberDTO from "src/dtos/Member.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Controller('member')
class MemberController {
  constructor(
    private prismaService: PrismaService,
  ) {}

  @Post('/') 
  async createMember(@Body() createDTO: MemberDTO) {
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
