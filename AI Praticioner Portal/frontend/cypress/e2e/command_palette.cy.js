describe('Command Palette E2E', () => {
  it('opens the command palette and executes a command', () => {
    cy.visit('/');
    cy.get('body').type('{ctrl}p');
    cy.get('input[placeholder*="command"]').type('Save File');
    cy.contains('Save File').click();
    cy.get('.bg-gray-800').should('exist'); // Palette closes
  });
}); 