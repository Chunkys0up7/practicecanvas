describe('Dashboard E2E', () => {
  it('loads and displays projects', () => {
    cy.visit('/');
    cy.contains('Dashboard');
    cy.get('[data-testid^="project-card-"]').should('exist');
  });
}); 