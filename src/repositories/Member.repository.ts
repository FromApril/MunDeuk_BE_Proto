import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "src/prisma/prisma.service";
import MemberDTO from "src/dtos/Member.dto";
import LoginDTO from "src/dtos/Login.dto";

@Injectable()
class MemberRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByNickname({ nickname }: { nickname: string }): Promise<MemberDTO> {
    const foundMember = await this.prismaService.member.findFirst({
      where: {
        nickname,
      },
    });

    return plainToInstance(MemberDTO, foundMember);
  }

  async getAuthenticated({
    email,
    password,
  }: LoginDTO): Promise<MemberDTO | null> {
    const foundMember = await this.prismaService.member.findUnique({
      where: {
        email,
      },
    });

    if (!foundMember) {
      return null;
    }

    if (foundMember.password !== password) {
      throw new Error("비번틀림");
    }

    return plainToInstance(MemberDTO, foundMember);
  }

  async getLockerId(memberId: bigint) {
    const { id: lockerId } = await this.prismaService.locker.findUniqueOrThrow({
      where: {
        ownerId: memberId,
      },
      select: {
        id: true,
      },
    });

    return { lockerId };
  }
}

export default MemberRepository;
