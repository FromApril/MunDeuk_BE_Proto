import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { PrismaService } from "./prisma/prisma.service";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { DefaultExceptionFilter } from "./exception/exception.filter";
import { ResponseInterceptor } from "./response/response.interceptor";

declare global {
  interface BigInt {
    toJSON: () => string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new DefaultExceptionFilter(httpAdapterHost));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.use(helmet());

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const config = new DocumentBuilder()
    .setTitle("Mundeuk API")
    .setDescription("문득 떠오르네요")
    .setVersion("1.0")
    .addTag("Mundeuk")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}
bootstrap();
