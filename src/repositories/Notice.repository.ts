import { Injectable } from "@nestjs/common";
import NoticeDTO from "src/dtos/Notice.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
class NoticeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async publish({
    listenerIdList,
    noticeableId,
    title,
    detail,
    notificationType,
    notificationDetail,
  }: Pick<
    NoticeDTO,
    "title" | "detail" | "notificationType" | "notificationDetail"
  > & {
    listenerIdList: bigint[];
    noticeableId: bigint;
  }): Promise<void> {
    await this.prismaService.notification.createMany({
      data: listenerIdList.map((notifiedMemberId) => ({
        title,
        detail,
        noticeableId,
        notificationType,
        notifiedMemberId,
        notificationDetail,
      })),
    });
  }
}

export default NoticeRepository;
