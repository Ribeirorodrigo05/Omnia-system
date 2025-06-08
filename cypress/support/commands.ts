/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to fill the sign-up form
Cypress.Commands.add(
  "fillSignUpForm",
  (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    acceptTerms?: boolean;
  }) => {
    cy.get('[data-cy="name-input"]').type(userData.name);
    cy.get('[data-cy="email-input"]').type(userData.email);
    // Para o telefone, digitamos apenas os números, a formatação será automática
    const phoneNumbers = userData.phone.replace(/\D/g, "");
    cy.get('[data-cy="phone-input"]').type(phoneNumbers);
    cy.get('[data-cy="password-input"]').type(userData.password);
    cy.get('[data-cy="confirm-password-input"]').type(userData.confirmPassword);

    if (userData.acceptTerms !== false) {
      cy.get('[data-cy="terms-checkbox"]').click();
    }
  }
);

// Custom command to check form validation state
Cypress.Commands.add("checkFormValidation", (shouldBeValid: boolean) => {
  if (shouldBeValid) {
    cy.get('[data-cy="submit-button"]').should("not.be.disabled");
  } else {
    cy.get('[data-cy="submit-button"]').should("be.disabled");
  }
});

declare global {
  namespace Cypress {
    interface Chainable {
      fillSignUpForm(userData: {
        name: string;
        email: string;
        phone: string;
        password: string;
        confirmPassword: string;
        acceptTerms?: boolean;
      }): Chainable<void>;
      checkFormValidation(shouldBeValid: boolean): Chainable<void>;
    }
  }
}
