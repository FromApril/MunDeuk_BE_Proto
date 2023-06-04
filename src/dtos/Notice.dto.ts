import {Notification, NotificationType} from "@prisma/client"
import { Exclude, Expose } from "class-transformer";

@Exclude()
class NoticeDTO implements Notification {
  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  title: string;

  @Expose()
  detail: string;

  @Expose()
  notificationType: NotificationType;

  @Expose()
  notificationDetail: string;

  id: BigInt;
  noticeableId: BigInt;
  notifiedMemberId: BigInt;

  static createDTO({title, detail, notificationType, notificationDetail}: {
    title: string ;
    detail: string;
    notificationType: NotificationType;
    notificationDetail:string
  }) {
    const notice = new NoticeDTO();
    notice.title = title;
    notice.detail = detail;
    notice.notificationType = notificationType;
    notice.notificationDetail = notificationDetail;

    return notice;
  }
}

export default NoticeDTO;
