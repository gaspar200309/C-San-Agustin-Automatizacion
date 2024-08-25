describe('Pruebas de Login', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit('/login');
      });
    //PRUEBAS POSITIVAS
    it('Debe iniciar sesión correctamente con credenciales válidas', () => {
        cy.get('[type="text"]').type('gaspararmando44@gmail.com');
        cy.get('.password-container > input').type('armando1gaspar');
        cy.get('.button-primary').click();

        cy.wait('@loginRequest').then((interception) => {
            // Check the response to ensure it's what you expect
            expect(interception.response.statusCode).to.eq(200);
        });
        cy.url().should('include', '/home');
    });
    //PRUEBAS NEGATIVAS
    it('Debe mostrar un mensaje de error con credenciales inválidas', () => {
        cy.get('[type="text"]').type('correoincorrecto@gmail.com');
        cy.get('.password-container > input').type('contraseñaincorrecta123');
        cy.get('.button-primary').click();

        cy.get('.error-message').should('contain', 'Credenciales incorrectas');
        cy.contains('Credenciales incorrectas').should('be.visible');
    });
});
