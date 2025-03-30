describe('Conditioned Field Visibility', () => {
    beforeEach(() => {
        cy.visit('/field-visibility-conditioned');
    });

    it('should initially hide the email field', () => {
        // Email field should not be visible initially
        cy.contains('Email').should('not.exist');
    });

    it('should show email field when newsletter checkbox is checked', () => {
        // Check the newsletter checkbox
        cy.contains('Receive newsletter').click();

        // Email field should now be visible
        cy.contains('Email').should('be.visible');
        cy.get('input[placeholder="Enter your email"]').should('be.visible');
    });

    it('should validate email field when visible and submitted', () => {
        // Check the newsletter checkbox
        cy.contains('Receive newsletter').click();

        // Try to submit without filling email
        cy.get('button[type="submit"]').click();
        cy.contains('Email is required').should('be.visible');

        // Enter invalid email
        cy.get('input[placeholder="Enter your email"]').type('invalid-email');
        cy.get('button[type="submit"]').click();
        cy.contains('Invalid email address').should('be.visible');

        // Enter valid email
        cy.get('input[placeholder="Enter your email"]').clear();
        cy.get('input[placeholder="Enter your email"]').type('test@example.com');
        cy.get('button[type="submit"]').click();
        cy.contains('Email is required').should('not.exist');
        cy.contains('Invalid email address').should('not.exist');
    });

    it('should hide email field when newsletter checkbox is unchecked', () => {
        // Check and then uncheck the newsletter checkbox
        cy.contains('Receive newsletter').click();
        cy.contains('Email').should('be.visible');

        cy.contains('Receive newsletter').click();
        cy.contains('Email').should('not.exist');
    });
});
