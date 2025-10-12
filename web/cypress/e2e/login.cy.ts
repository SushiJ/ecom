import { testUser } from "../support/generate";

describe("Login page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });
  it("logs in successfully with valid credentials", () => {
    cy.findByLabelText(/email/i).type(testUser.email);
    cy.findByLabelText(/password/i).type(testUser.password);
    cy.findByText(/sign in/i).click();

    cy.url().should("eql", `${Cypress.config().baseUrl}/`);
    cy.findByText(/logged in successfully/i).should("be.visible");
    cy.getCookie("citrus").then(cookie => {
      expect(cookie).to.exist;
      expect(cookie.value).to.have.length.greaterThan(1);
    });
  });
  it("should error out when user doesn't exist", () => {
    const wrong_email_user = {
      email: "testing123@email.com",
    };
    cy.findByLabelText(/email/i).type(wrong_email_user.email);
    cy.findByLabelText(/password/i).type(testUser.password);
    cy.findByText(/sign in/i).click();

    cy.url().should("eql", `${Cypress.config().baseUrl}/login`);
    cy.findByText(/invalid credentials/i).should("be.visible");
  });
  it("should error out when user doesn't exist", () => {
    const wrong_pass_user = {
      password: "1234566788",
    };
    cy.findByLabelText(/email/i).type(testUser.email);
    cy.findByLabelText(/password/i).type(wrong_pass_user.password);
    cy.findByText(/sign in/i).click();

    cy.url().should("eql", `${Cypress.config().baseUrl}/login`);
    cy.findByText(/invalid credentials/i).should("be.visible");
  });
});
