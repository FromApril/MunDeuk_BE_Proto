import { NoteState, Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";
const emotions = ["Depressed", "Flutter", "Glad", "Touched"];
export function generateNote(
  model?: Partial<Prisma.NoteCreateManyInput> & {
    writerId: bigint;
  },
): Prisma.NoteCreateManyInput {
  return {
    content: {
      text: faker.lorem.paragraph(),
      emotion: faker.helpers.arrayElement(emotions),
    },
    latitude: faker.location.latitude({
      max: 38,
      min: 37,
    }),
    longitude: faker.location.longitude({
      max: 127,
      min: 126,
    }),
    noteState: NoteState.ACTIVE,
    ...model,
  };
}
