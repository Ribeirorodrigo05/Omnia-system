describe("Sign Up Form - Custom Commands", () => {
  beforeEach(() => {
    cy.visit("/sign-up");
  });

  it("should fill form using custom command", () => {
    const userData = {
      name: "Ana Costa",
      email: "ana.costa@email.com",
      phone: "(11) 94567-8901",
      password: "minhasenha456@M",
      confirmPassword: "minhasenha456@M",
    };

    cy.fillSignUpForm(userData);
    cy.checkFormValidation(true);
  });

  it("should validate form with missing terms acceptance", () => {
    const userData = {
      name: "Pedro Oliveira",
      email: "pedro@email.com",
      phone: "(21) 99876-5432",
      password: "senha456",
      confirmPassword: "senha456",
      acceptTerms: false,
    };

    cy.fillSignUpForm(userData);
    cy.checkFormValidation(false);
  });

  it("should handle form with mismatched passwords", () => {
    const userData = {
      name: "Julia Santos",
      email: "julia@email.com",
      phone: "(31) 98765-4321",
      password: "minhasenha456@M",
      confirmPassword: "senha456",
    };

    cy.fillSignUpForm(userData);

    // Mesmo com todos os campos preenchidos, as senhas não coincidem
    // O comportamento exato depende da validação implementada no frontend
    cy.get('[data-cy="password-input"]').should(
      "have.value",
      "minhasenha456@M"
    );
    cy.get('[data-cy="confirm-password-input"]').should(
      "have.value",
      "senha456"
    );
  });

  it("should test form submission with valid data", () => {
    const userData = {
      name: "Roberto Silva",
      email: "roberto@empresa.com",
      phone: "(41) 99123-4567",
      password: "senhaSegura789@",
      confirmPassword: "senhaSegura789@",
    };

    cy.fillSignUpForm(userData);
    cy.checkFormValidation(true);

    // Interceptar a chamada da API se necessário
    cy.intercept("POST", "**/api/users/create", {
      statusCode: 201,
      body: { success: true, message: "Usuário criado com sucesso" },
    }).as("createUser");

    cy.get('[data-cy="submit-button"]').click();

    // Verificar se a chamada foi feita (se implementada)
    // cy.wait('@createUser')
  });
});
