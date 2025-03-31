describe('Custom Field Component', () => {
    beforeEach(() => {
        cy.visit('/custom-field-component');
    });

    it('should validate required fields and show error messages', () => {
    // Submit form without filling any fields
        cy.get('button[type="submit"]').click();

        // Check error messages for required fields
        cy.get('.field-error').should('have.length', 3);
        cy.get('input[name="username"]').parent().find('.field-error').should('exist');
        cy.get('input[name="password"]').parent().find('.field-error').should('exist');
        cy.get('input[name="agreeTermAndConditions"]').parent().next('.field-error').should('exist');
    });

    it('should validate custom checkbox component', () => {
    // Fill in valid data for text fields
        cy.get('input[name="username"]').type('valid');
        cy.get('input[name="password"]').type('password123');
        cy.get('input[name="repeatPassword"]').type('password123');

        // Submit without checking the checkbox
        cy.get('button[type="submit"]').click();
        cy.get('.field-error').should('contain', 'You must agree to terms and conditions');

        // Check the checkbox and submit
        cy.get('input[name="agreeTermAndConditions"]').check();
        cy.get('button[type="submit"]').click();
        cy.get('.field-error').should('not.exist');
    });

    it('should successfully submit the form with valid data', () => {
    // Fill all fields with valid data
        cy.get('input[name="username"]').type('valid');
        cy.get('input[name="password"]').type('password123');
        cy.get('input[name="repeatPassword"]').type('password123');
        cy.get('input[name="agreeTermAndConditions"]').check();

        // Submit the form and verify no error messages
        cy.get('button[type="submit"]').click();
        cy.get('.field-error').should('not.exist');
    });
});
