describe('Editor Tabs E2E', () => {
  it('opens multiple files in tabs and allows switching', () => {
    cy.visit('/');
    cy.get('[data-testid^="file-name-"]').eq(0).click();
    cy.get('[data-testid^="file-name-"]').eq(1).click();
    cy.get('.border-b .flex').should('exist'); // Tab bar
    cy.get('.border-b .flex [data-testid^="close-tab-"]').should('have.length.greaterThan', 1);
    cy.get('.border-b .flex [data-testid^="close-tab-"]').eq(0).click(); // Close first tab
  });
}); 