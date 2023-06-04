import { ApiPropertyOptional } from "@nestjs/swagger";
import LocationDTO from "./Location.dto";
import { Type } from "class-transformer";

class GetNoteDTO extends LocationDTO {
  @ApiPropertyOptional({
    "description": "조회하는 맴버의 이름",
    "type": String,
  })
  @Type(() => BigInt)
  memberId?: BigInt;
}

export default GetNoteDTO;
