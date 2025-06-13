describe('File Explorer E2E', () => {
  it('displays files and directories and allows navigation', () => {
    cy.visit('/');
    cy.contains('Explorer');
    cy.get('[data-testid="file-explorer"]').should('exist');
    cy.get('[data-testid^="file-name-"]').should('have.length.greaterThan', 0);
    cy.get('[data-testid^="file-name-"]').first().click();
  });
}); 