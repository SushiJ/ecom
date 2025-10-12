describe("Product page", () => {
  it("shows a list of products when data is available", () => {
    cy.visit("/");
    cy.findByText(/latest products/i).should("be.visible");

    cy.get("[data-cy=product-list]").should("have.length.greaterThan", 0);
  });
});
