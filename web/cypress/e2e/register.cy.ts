import { user } from "../support/generate";

describe("Registration", () => {
	it("should register a new user", () => {
		cy.visit("/");

		cy.findByRole("button", { name: /login/i }).click();
		cy.findByText(/sign up/i).click();

		cy.findByLabelText(/name/i).type(user.name);
		cy.findByLabelText(/email/i).type(user.email);
		cy.findByLabelText("Password").type(user.password);
		cy.findByLabelText("Confirm password").type(user.password);
		cy.findByText(/sign up/i).click();
		cy.url().should("eq", `${Cypress.config().baseUrl}/login`);
	});
});
