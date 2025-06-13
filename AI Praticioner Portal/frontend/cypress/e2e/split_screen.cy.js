describe('Split-Screen Code/Test E2E', () => {
  it('shows code and test editors side by side or stacked', () => {
    cy.visit('/');
    cy.get('[data-testid^="file-name-main.py"]').click();
    cy.get('[data-testid^="file-name-test_main.py"]').click();
    cy.get('.flex-1.relative').within(() => {
      cy.get('.monaco-editor').should('have.length.greaterThan', 1);
    });
  });
}); 