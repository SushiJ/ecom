import { testUser } from "../support/generate";

describe("Login page", () => {
	it("logs in successfully with valid credentials", () => {
		cy.visit("/login");
		cy.findByLabelText(/email/i).type(testUser.email);
		cy.findByLabelText(/password/i).type(testUser.password);
		cy.findByText(/sign in/i).click();

		cy.url().should("eql", `${Cypress.config().baseUrl}/`);
		cy.findByText(/logged in successfully/i).should("be.visible");
		cy.getCookie("citrus").then((cookie) => {
			expect(cookie).to.exist;
			expect(cookie.value).to.have.length.greaterThan(1);
		});
	});
});
