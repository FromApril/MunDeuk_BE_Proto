import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";
export interface APIResponse<T = unknown> {
  success: boolean;
  data: T | null;
  msg: string | null;
}

export function parseToResponse<T>(data: T): APIResponse<T> {
  return {
    success: true,
    data,
    msg: null,
  };
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => parseToResponse(data)));
  }
}
