// cypress/support/e2e.js
// Aquí puedes incluir configuraciones globales o comandos personalizados de Cypress

// Ejemplo de un comando personalizado
Cypress.Commands.add('login', (email, password) => {
    cy.visit('/');
    cy.get('input[name=email]').type(email);
    cy.get('input[name=password]').type(password);
    cy.get('button[type=submit]').click();
  });
  