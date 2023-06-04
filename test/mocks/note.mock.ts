import { Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";

export function generateNote(
  model: Partial<Prisma.NoteCreateManyInput> & { 
    writerId: BigInt;
  }
): Prisma.NoteCreateManyInput{
  return {
    content: faker.lorem.paragraph(),
    latitude: faker.location.latitude({
      max: 11,
      min: 10
    }),
    longitude: faker.location.longitude({
      max: 11,
      min: 10,
    }),
    radius: faker.number.int({min: 1, max: 2}),
    isDeleted: false,
    ...model,
  }
}
