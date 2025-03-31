describe('validation with default messages', () => {
    beforeEach(() => {
        cy.visit('/validation-with-default-messages');
    });

    it('should display default validation messages for required fields', () => {
    // Submit the form without filling any fields
        cy.get('button[type="submit"]').click();

        // Check error messages for required fields
        cy.get('.field-error').should('have.length', 3);
        cy.get('.field-error').eq(0).should('have.text', 'default.messages.common.required');
        cy.get('.field-error').eq(1).should('have.text', 'default.messages.common.required');
        cy.get('.field-error').eq(2).should('have.text', 'default.messages.array.required');
    });

    it('should validate minLength for text input', () => {
    // Enter a short name
        cy.get('input[name="fullName"]').type('ab');
        cy.get('button[type="submit"]').click();
    
        // Check minLength error message
        cy.get('.field-error').eq(0).should('have.text', 'default.messages.common.minLength: 3');
    });

    it('should validate array minLength', () => {
    // Fill in required fields but with insufficient array items
        cy.get('input[name="fullName"]').type('John Doe');
        cy.get('select[name="gender"]').select('male');
    
        // Add only one item to the array (less than required minimum of 2)
        cy.get('button').contains('Add').click();
        cy.get('input[name="socialLinks[0].value"]').type('https://example.com');
    
        cy.get('button[type="submit"]').click();
    
        // Check for array minLength error
        cy.get('.field-error').should('contain', 'default.messages.array.minLength: 2');
    });
});
