import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import LoginDTO from "src/dtos/Login.dto";
import MemberDTO from "src/dtos/member.dto";
import { PrismaService } from "src/prisma.service";

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