import { faker } from "@faker-js/faker";

export const user = {
	name: faker.internet.username({
		firstName: "test",
		lastName: "testington",
	}),
	email: faker.internet.email(),
	password: faker.internet.password(),
};

export const testUser = {
	email: "test@example.com",
	password: "123456",
};
