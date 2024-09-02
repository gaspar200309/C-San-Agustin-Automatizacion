describe('Pruebas de Login y Formulario de Universidad', () => { //Nombre de la funcionalidad 
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit('/login');
    });

    // PRUEBAS POSITIVAS
    //casos de prueba
    it('Debe iniciar sesión correctamente con credenciales válidas y completar el formulario de Universidad', () => {
        cy.get('form > [type="text"]', { timeout: 15000 }).type('Gaspar');
        cy.get('.password-container > input', { timeout: 15000 }).type('armando1gaspar');
        cy.get('.button-primary', { timeout: 15000 }).click();
        
        cy.url({ timeout: 20000 }).should('include', '/listForm');

        cy.wait(2000);  

        cy.get('.card1', { timeout: 15000 }).contains('Formulario de Universidad').click();

        cy.wait(2000); 

        cy.get('input[name="nombre"]', { timeout: 15000 }).type('USIP (Universidad Simón I. Patiño)');
        
        cy.wait(2000);

        cy.get('.direccion-group').eq(0).within(() => {
            cy.get('input[name="direccion"]', { timeout: 15000 }).type('Dirección 1');
            cy.get('input[name="telefono"]', { timeout: 15000 }).type('123456789');
            cy.get('input[name="correo"]', { timeout: 15000 }).type('correo1@universidad.com');
        });
        
        cy.wait(2000); 

        cy.get('select[name="tipoEscuela"]', { timeout: 15000 }).select('Universidad');

        cy.wait(2000); 

        cy.get('select[name="esPublica"]', { timeout: 15000 }).select('publica');

        cy.wait(2000);      

        cy.get('input[name="enlace"]', { timeout: 15000 }).type('http://www.universidadprueba.com');

        cy.wait(2000); 

        /* cy.fixture('Ceiam.png').then(fileContent => {
            cy.get('.form-input-file').attachFile({
                fileContent,
                fileName: 'Ceiam.png',
                mimeType: 'image/png'
            });
        });
 */
        cy.get('button[type="submit"]', { timeout: 15000 }).click();

        cy.url({ timeout: 20000 }).should('include', '/listForm');
    });
}); 