describe('Agent Tools E2E', () => {
  it('shows agent tools and allows interaction', () => {
    cy.visit('/');
    cy.get('[data-testid^="file-name-main.py"]').click();
    cy.contains('Tools').click();
    cy.get('.grid-cols-2 button').should('have.length.greaterThan', 0);
    cy.get('.grid-cols-2 button').first().click();
  });
}); 