describe('Pruebas de Login', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit('/login');
      });
    
    //PRUEBAS NEGATIVAS
    it('Debe mostrar un mensaje de error con credenciales inválidas', () => {
        cy.get('form > [type="text"]').type('correoincorrecto@gmail.com');
        cy.get('.password-container > input').type('contraseñaincorrecta123');
        cy.get('.button-primary').click();

        cy.contains('Credenciales incorrectas', { timeout: 10000 }).should('be.visible');
    });
});
