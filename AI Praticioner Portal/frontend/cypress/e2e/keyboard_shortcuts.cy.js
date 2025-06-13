describe('Keyboard Shortcuts E2E', () => {
  it('saves a file with Ctrl+S', () => {
    cy.visit('/');
    cy.get('[data-testid^="file-name-main.py"]').click();
    cy.get('.monaco-editor textarea').type('print(123)', { force: true });
    cy.get('body').type('{ctrl}s');
    cy.get('.text-blue-500').should('not.exist'); // Dirty indicator disappears
  });
}); 