import { Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";

export function generateMember(
  model?: Partial<Prisma.MemberCreateManyInput>,
): Prisma.MemberCreateManyInput {
  return {
    email: faker.internet.email(),
    password: faker.string.uuid(),
    nickname: faker.string.uuid(),

    ...(model ?? {}),
  };
}
