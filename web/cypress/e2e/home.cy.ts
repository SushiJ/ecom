describe("Home Page", () => {
	it("shows a list of products when data is available", () => {
		cy.visit("/");
		cy.title().should("equal", "Shopp-e");
        cy.get("h1").should("have.text", "Latest Products");

		cy.get("[data-cy=product-list]").should("have.length.greaterThan", 0);
	});
});
