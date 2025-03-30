describe('Simple Field Visibility', () => {
    beforeEach(() => {
        cy.visit('/field-visibility');
    });

    it('should show the visible field and hide the hidden field', () => {
        // Visible field should be present
        cy.contains('Visible Field').should('be.visible');
        cy.get('input[placeholder="This field is always visible"]').should('be.visible');

        // Hidden field should not be present
        cy.contains('Hidden Field').should('not.exist');
        cy.get('input[placeholder="This field is conditionally visible"]').should('not.exist');
    });

    it('should validate visible field on submit', () => {
        // Try to submit without filling the required field
        cy.get('button[type="submit"]').click();
        cy.contains('This field is required').should('be.visible');

        // Fill the field and submit
        cy.get('input[placeholder="This field is always visible"]').type('test value');
        cy.get('button[type="submit"]').click();
        cy.contains('This field is required').should('not.exist');
    });
});
