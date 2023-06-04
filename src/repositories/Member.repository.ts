import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from 'src/prisma/prisma.service';
import MemberDTO from 'src/dtos/Member.dto';
import LoginDTO from "src/dtos/Login.dto";

@Injectable()
class MemberRepository {
  constructor(private prismaService:PrismaService){}

  async findByNickname({nickname}:{nickname: string}): Promise<MemberDTO>{
    const foundMember = await this.prismaService.member.findFirst({
      where: {
        nickname,
      }
    });

    return plainToInstance(MemberDTO, foundMember);
  }

  async getAuthenticated({email, password}: LoginDTO): Promise<MemberDTO | null> {
    const foundMember = await this.prismaService.member.findUnique({
      where: {
        email,
      }
    });

    if (!foundMember) {
      return null;
    }

    if(foundMember.password !== password) {
      throw new Error("비번틀림");
    }

    return plainToInstance(MemberDTO, foundMember);
  }
}

export default MemberRepository;