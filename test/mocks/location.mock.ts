import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import LocationDTO from "src/dtos/Location.dto";

export function generateLocation(): LocationDTO {
  return plainToInstance(LocationDTO, {
    latitude: faker.location.latitude({
      max: 11,
      min: 10,
    }),
    longitude: faker.location.longitude({
      max: 11,
      min: 10,
    }),
  });
}