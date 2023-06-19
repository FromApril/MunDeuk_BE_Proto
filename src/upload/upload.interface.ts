export interface IUploadService {
  uploadImage(params: {
    file: Buffer | string;
    contentType: string;
  }): Promise<IUploadImageResponse>;
}

export interface IUploadImageResponse {
  data: {
    path: string;
  } | null;
  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  error: any;
}
