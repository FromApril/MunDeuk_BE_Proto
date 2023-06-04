import { Body, Controller, Post } from "@nestjs/common";
import MemberDTO from "../dtos/member.dto";
import { PrismaService } from "../prisma/prisma.service";
import { plainToInstance } from "class-transformer";

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
