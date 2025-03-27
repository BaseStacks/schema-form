describe('validation', () => {
    it('should validate the form', () => {
        cy.visit('http://localhost:3000/basic');
        cy.get('button[type="submit"]').click();

        cy.get('.field-error').should('have.length', 2);
        cy.get('.field-error').eq(0).should('have.text', 'Username is required');
        cy.get('.field-error').eq(1).should('have.text', 'Password is required');
    });
});
