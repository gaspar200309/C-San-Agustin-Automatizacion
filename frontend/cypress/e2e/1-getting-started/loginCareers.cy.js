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

    //PRUEBAS POSITIVAS
    it('Debe iniciar sesión correctamente con credenciales válidas', () => {
        cy.get('form > [type="text"]').type('Gaspar');
        cy.get('.password-container > input').type('armando1gaspar');
        cy.get('.button-primary').click();
        cy.url({ timeout: 10000 }).should('include', '/listForm');

    });
});
