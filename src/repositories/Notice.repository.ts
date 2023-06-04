import { Injectable } from "@nestjs/common";
import NoticeDTO from "../dtos/Notice.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
class NoticeRepository {
  constructor(private prismaService: PrismaService) {}

  async publish({ listenerIdList, noticeableId, title, detail, notificationType, notificationDetail} : Pick<NoticeDTO, 'title'|'detail'|'notificationType'|'notificationDetail'> & {
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
      }))
    });
  }
}

export default NoticeRepository;
