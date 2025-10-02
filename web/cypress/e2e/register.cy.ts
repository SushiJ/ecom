import { createUser } from "../support/generate";

let user: ReturnType<typeof createUser>;
describe("Registration", () => {
	beforeEach(() => {
		cy.visit("/");
	});
	user = createUser();
	it("should register a new user", () => {
		cy.findByRole("button", { name: /login/i }).click();
		cy.findByText(/sign up/i).click();

		cy.findByLabelText(/name/i).type(user.name);
		cy.findByLabelText(/email/i).type(user.email);
		cy.findByLabelText("Password").type(user.password);
		cy.findByLabelText("Confirm password").type(user.password);
		cy.findByText(/sign up/i).click();
		cy.url().should("eq", `${Cypress.config().baseUrl}/login`);
	});
	it("should error out when registering the same user", () => {
		cy.findByRole("button", { name: /login/i }).click();
		cy.findByText(/sign up/i).click();

		cy.findByLabelText(/name/i).type(user.name);
		cy.findByLabelText(/email/i).type(user.email);
		cy.findByLabelText("Password").type(user.password);
		cy.findByLabelText("Confirm password").type(user.password);
		cy.findByText(/sign up/i).click();
		cy.url().should("have.string", "register");
		cy.findByText(/user already exists/i).should("be.visible");
	});
});
