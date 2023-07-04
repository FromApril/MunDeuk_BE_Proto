import { NoteState, Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";
const emotions = ["Depressed", "Flutter", "Glad", "Touched"];
export function generateNote(
  model?: Partial<Prisma.NoteCreateManyInput> & {
    writerId: bigint;
  },
): Prisma.NoteCreateManyInput {
  return {
    content: JSON.stringify({
      text: faker.lorem.paragraph(),
      emotion: faker.helpers.arrayElement(emotions),
    }),
    latitude: faker.location.latitude({
      max: 11,
      min: 10,
    }),
    longitude: faker.location.longitude({
      max: 11,
      min: 10,
    }),
    noteState: NoteState.ACTIVE,
    ...model,
  };
}
