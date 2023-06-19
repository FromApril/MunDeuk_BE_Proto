import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

@Injectable()
export class UploadService {
  private clientInstance: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    this.clientInstance = createClient(
      this.configService.get("SUPABASE_URL"),
      this.configService.get("SUPABASE_KEY"),
    );
  }

  async uploadImage({
    file,
    contentType,
  }: { file: Buffer | string; contentType: string }): Promise<{
    data: {
      path: string;
    } | null;
    error: any;
  }> {
    const key = `${Date.now().toString()}`;

    const { data, error } = await this.clientInstance.storage
      .from("template")
      .upload(`public/${key}`, file, {
        cacheControl: "3600",
        contentType,
        upsert: true,
      });

    return {
      data,
      error,
    };
  }
}
