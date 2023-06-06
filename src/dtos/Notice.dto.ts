import { Notification, NotificationType } from "@prisma/client";
import { ApiProperty, ApiResponse, ApiResponseProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
class NoticeDTO implements Notification {
  @Expose()
  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;

  @Expose()
  @ApiProperty({
    type: String,
  })
  title: string;

  @Expose()
  @ApiProperty({
    type: String,
  })
  detail: string;

  @Expose()
  @ApiProperty({
    type: NotificationType,
  })
  notificationType: NotificationType;

  @Expose()
  @ApiProperty({
    type: String,
  })
  notificationDetail: string;

  id: bigint;
  noticeableId: bigint;
  notifiedMemberId: bigint;

  static createDTO({
    title,
    detail,
    notificationType,
    notificationDetail,
  }: {
    title: string;
    detail: string;
    notificationType: NotificationType;
    notificationDetail: string;
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
