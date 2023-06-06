import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpAdapterHost,
} from "@nestjs/common";
import { parseError } from "./exception.util";

@Catch()
export class DefaultExceptionFilter<T> implements ExceptionFilter {
  constructor(private readonly httpAdaptorHost: HttpAdapterHost) {}

  catch(exception: T, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdaptorHost;
    const context = host.switchToHttp();
    const error = parseError(exception);

    httpAdapter.reply(context.getResponse(), error, error.status);
  }
}
