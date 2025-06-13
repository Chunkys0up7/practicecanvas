describe('Test Runner E2E', () => {
  it('runs tests and displays results', () => {
    cy.visit('/');
    cy.get('[data-testid^="file-name-test_main.py"]').click();
    cy.contains('Run Tests').click();
    cy.get('.bg-gray-900').should('contain.text', 'Passed').or('contain.text', 'Failed');
  });
}); 