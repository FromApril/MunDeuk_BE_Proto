import { Transform, Type } from "class-transformer";

class LocationDTO {
  @Type(() => Number)
  latitude: number;
  @Type(() => Number)
  longitude: number;
}

export default LocationDTO
