import { faker } from "@faker-js/faker";

export function createUser() {
  return {
    name: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

export const testUser = {
  email: "test@example.com",
  password: "123456",
};
