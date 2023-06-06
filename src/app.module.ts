import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RepositoryModule } from "./repositories/repository.module";
import { ControllersModule } from "./controllers/controllers.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ServiceModule } from "./services/service.module";

@Module({
  imports: [RepositoryModule, ControllersModule, PrismaModule, ServiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
