import { ApiProperty, ApiQuery } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";

class LocationDTO {

  @ApiProperty({
    description: "위도",
    type: Number,
  })
  @Type(() => Number)
  latitude: number;

  @ApiProperty({
    description: '경도',
    type: Number,
  })
  @Type(() => Number)
  longitude: number;
}

export default LocationDTO
