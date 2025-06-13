describe('Error Handling E2E', () => {
  it('shows an error banner when project fetch fails', () => {
    cy.intercept('GET', '/api/projects', { forceNetworkError: true }).as('getProjects');
    cy.visit('/');
    cy.get('.bg-red-600').should('contain.text', 'Failed to load projects');
  });
}); 