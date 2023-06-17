import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RepositoryModule } from "./repositories/repository.module";
import { ControllersModule } from "./controllers/controllers.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ServiceModule } from "./services/service.module";
import { ConfigModule } from "@nestjs/config";
import { UploadService } from "./upload/upload.service";

@Module({
  imports: [
    RepositoryModule,
    ControllersModule,
    PrismaModule,
    ServiceModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UploadService],
})
export class AppModule {}
