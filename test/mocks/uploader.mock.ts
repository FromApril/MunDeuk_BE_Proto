import {
  IUploadImageResponse,
  IUploadService,
} from "src/upload/upload.interface";

class UploaderServiceMock implements IUploadService {
  async uploadImage(params: {
    file: string | Buffer;
    contentType: string;
  }): Promise<IUploadImageResponse> {
    return {
      data: {
        path: "helloworld",
      },
      error: null,
    };
  }
}

export default UploaderServiceMock;
