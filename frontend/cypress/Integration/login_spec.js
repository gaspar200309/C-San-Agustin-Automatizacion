describe('Pruebas de Login', () => {
    it('Debe iniciar sesión correctamente con credenciales válidas', () => {
        cy.visit('/');
        cy.get('input[name=email]').type('gaspararmando44@gmail.com');
        cy.get('input[name=password]').type('armando1gaspar');
        cy.get('button[type=submit]').click();

        cy.url().should('include', '/home');
    });

    it('Debe mostrar un mensaje de error con credenciales inválidas', () => {
        cy.visit('/');
        cy.get('input[name=email]').type('correoincorrecto@gmail.com');
        cy.get('input[name=password]').type('contraseñaincorrecta123');
        cy.get('button[type=submit]').click();

        cy.contains('Credenciales incorrectas').should('be.visible');
    });
});
