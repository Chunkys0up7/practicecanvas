describe('Component Library E2E', () => {
  it('loads and displays components', () => {
    cy.visit('/components');
    cy.contains('Component Library');
    cy.get('[data-testid^="component-card-"]').should('exist');
  });
}); 