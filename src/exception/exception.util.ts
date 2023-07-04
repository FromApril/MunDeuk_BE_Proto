import { HttpException } from "@nestjs/common";

export const ErrorMessageEnum = {
  UNKNOWN: "서버측 에러입니다.",
  TRY_AGAIN: "현재 서버가 바쁩니다. 조금 이따 다시 시도해 주세요.",
  SEARCH_ENGINE_BUSY:
    "많은 검색이 몰려 응답을 생성하지 못했습니다. 조금 이따 다시 시도해 주세요.",
} as const;

export interface ErrorObj {
  readonly name: string;
  readonly stack: string;
  readonly status: number;
  readonly message: string;
}

export function parseError(error: unknown): ErrorObj {
  let message: string = ErrorMessageEnum.UNKNOWN;
  let name = "unknown";
  let stack = "";
  let status = 500;

  if (error instanceof HttpException) {
    if (error.getStatus() === 503) {
      message = ErrorMessageEnum.SEARCH_ENGINE_BUSY;
      status = 429;
    } else {
      message = error.message;
      status = error.getStatus();
    }
    stack = error.stack;
  } else if (error instanceof Error) {
    message = error.message;
    name = error.name;
    stack = error.stack;
  }

  console.error(`[ERROR]: ${message} | ${stack}`);

  return {
    name,
    status,
    stack,
    message,
  };
}
