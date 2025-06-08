describe("Sign Up Page", () => {
  beforeEach(() => {
    cy.visit("/sign-up");
  });

  it("should display all form elements correctly", () => {
    // Verificar se o título está presente
    cy.contains("Criar conta").should("be.visible");
    cy.contains("Preencha os dados abaixo para criar sua conta").should(
      "be.visible"
    );

    // Verificar se todos os campos estão presentes
    cy.get('[data-cy="name-input"]').should("be.visible");
    cy.get('[data-cy="email-input"]').should("be.visible");
    cy.get('[data-cy="phone-input"]').should("be.visible");
    cy.get('[data-cy="password-input"]').should("be.visible");
    cy.get('[data-cy="confirm-password-input"]').should("be.visible");
    cy.get('[data-cy="terms-checkbox"]').should("be.visible");
    cy.get('[data-cy="submit-button"]').should("be.visible").and("be.disabled");
  });

  it("should enable submit button only when all fields are filled and terms are accepted", () => {
    // Verificar que o botão está desabilitado inicialmente
    cy.get('[data-cy="submit-button"]').should("be.disabled");

    // Preencher todos os campos
    cy.get('[data-cy="name-input"]').type("João Silva");
    cy.get('[data-cy="email-input"]').type("joao@example.com");
    cy.get('[data-cy="phone-input"]').type("(11) 99999-9999");
    cy.get('[data-cy="password-input"]').type("senha123");
    cy.get('[data-cy="confirm-password-input"]').type("senha123");

    // Botão ainda deve estar desabilitado sem aceitar os termos
    cy.get('[data-cy="submit-button"]').should("be.disabled");

    // Aceitar os termos
    cy.get('[data-cy="terms-checkbox"]').click();

    // Agora o botão deve estar habilitado
    cy.get('[data-cy="submit-button"]').should("not.be.disabled");
  });

  it("should toggle password visibility", () => {
    // Verificar que o campo de senha está com type="password"
    cy.get('[data-cy="password-input"]').should(
      "have.attr",
      "type",
      "password"
    );

    // Clicar no botão para mostrar a senha
    cy.get('[data-cy="toggle-password-visibility"]').click();

    // Verificar que o campo agora tem type="text"
    cy.get('[data-cy="password-input"]').should("have.attr", "type", "text");

    // Clicar novamente para ocultar
    cy.get('[data-cy="toggle-password-visibility"]').click();

    // Verificar que voltou para type="password"
    cy.get('[data-cy="password-input"]').should(
      "have.attr",
      "type",
      "password"
    );
  });

  it("should toggle confirm password visibility", () => {
    // Verificar que o campo de confirmação está com type="password"
    cy.get('[data-cy="confirm-password-input"]').should(
      "have.attr",
      "type",
      "password"
    );

    // Clicar no botão para mostrar a senha
    cy.get('[data-cy="toggle-confirm-password-visibility"]').click();

    // Verificar que o campo agora tem type="text"
    cy.get('[data-cy="confirm-password-input"]').should(
      "have.attr",
      "type",
      "text"
    );

    // Clicar novamente para ocultar
    cy.get('[data-cy="toggle-confirm-password-visibility"]').click();

    // Verificar que voltou para type="password"
    cy.get('[data-cy="confirm-password-input"]').should(
      "have.attr",
      "type",
      "password"
    );
  });
  it("should validate form inputs", () => {
    // Testar validação de email
    cy.get('[data-cy="email-input"]').type("email-invalido");
    cy.get('[data-cy="email-input"]').should("have.attr", "type", "email");

    // Testar placeholder dos campos
    cy.get('[data-cy="name-input"]').should(
      "have.attr",
      "placeholder",
      "Seu nome completo"
    );
    cy.get('[data-cy="email-input"]').should(
      "have.attr",
      "placeholder",
      "seu@email.com"
    );
    cy.get('[data-cy="phone-input"]').should(
      "have.attr",
      "placeholder",
      "(11) 99999-9999"
    );
  });

  it("should have working social login buttons", () => {
    cy.get('[data-cy="google-signup-button"]')
      .should("be.visible")
      .and("contain", "Google");
    cy.get('[data-cy="facebook-signup-button"]')
      .should("be.visible")
      .and("contain", "Facebook");
  });

  it("should have working terms and privacy links", () => {
    cy.get('[data-cy="terms-link"]')
      .should("be.visible")
      .and("contain", "termos de uso");
    cy.get('[data-cy="privacy-link"]')
      .should("be.visible")
      .and("contain", "política de privacidade");
  });

  it("should navigate to sign-in page when clicking the sign-in link", () => {
    cy.get('[data-cy="sign-in-link"]')
      .should("be.visible")
      .and("contain", "Entrar");
    cy.get('[data-cy="sign-in-link"]').click();
    cy.url().should("include", "/sign-in");
  });

  it("should complete full form submission flow", () => {
    // Preencher todo o formulário com dados válidos
    cy.get('[data-cy="name-input"]').type("Maria Silva");
    cy.get('[data-cy="email-input"]').type("maria@example.com");
    cy.get('[data-cy="phone-input"]').type("(11) 98765-4321");
    cy.get('[data-cy="password-input"]').type("senhaSegura123");
    cy.get('[data-cy="confirm-password-input"]').type("senhaSegura123");
    cy.get('[data-cy="terms-checkbox"]').click();

    // Verificar que o botão está habilitado
    cy.get('[data-cy="submit-button"]').should("not.be.disabled");

    // Simular clique no botão de envio (nota: isso irá chamar a função registerUserHandler)
    cy.get('[data-cy="submit-button"]').click();

    // Nota: Aqui você pode adicionar verificações adicionais dependendo do comportamento
    // esperado após o envio do formulário (redirecionamento, mensagens, etc.)
  });

  it("should maintain form state when typing", () => {
    const testData = {
      name: "Carlos Santos",
      email: "carlos@test.com",
      phone: "(21) 99888-7777",
      password: "minhasenha456@M",
      confirmPassword: "minhasenha456@M",
    };

    // Preencher os campos e verificar se os valores são mantidos
    cy.get('[data-cy="name-input"]')
      .type(testData.name)
      .should("have.value", testData.name);
    cy.get('[data-cy="email-input"]')
      .type(testData.email)
      .should("have.value", testData.email);
    cy.get('[data-cy="phone-input"]')
      .type(testData.phone)
      .should("have.value", testData.phone);
    cy.get('[data-cy="password-input"]')
      .type(testData.password)
      .should("have.value", testData.password);
    cy.get('[data-cy="confirm-password-input"]')
      .type(testData.confirmPassword)
      .should("have.value", testData.confirmPassword);
  });

  it("should have proper accessibility attributes", () => {
    // Verificar se os campos têm labels associados
    cy.get('[data-cy="name-input"]').should("have.attr", "id", "name");
    cy.get('[data-cy="email-input"]').should("have.attr", "id", "email");
    cy.get('[data-cy="phone-input"]').should("have.attr", "id", "phone");
    cy.get('[data-cy="password-input"]').should("have.attr", "id", "password");
    cy.get('[data-cy="confirm-password-input"]').should(
      "have.attr",
      "id",
      "confirm-password"
    );
    cy.get('[data-cy="terms-checkbox"]').should("have.attr", "id", "terms");

    // Verificar se existem labels para cada campo
    cy.get('label[for="name"]').should("exist");
    cy.get('label[for="email"]').should("exist");
    cy.get('label[for="phone"]').should("exist");
    cy.get('label[for="password"]').should("exist");
    cy.get('label[for="confirm-password"]').should("exist");
    cy.get('label[for="terms"]').should("exist");
  });

  it("should format phone number automatically", () => {
    // Testar formatação gradual do telefone
    cy.get('[data-cy="phone-input"]').type("11");
    cy.get('[data-cy="phone-input"]').should("have.value", "11");

    cy.get('[data-cy="phone-input"]').clear().type("1199");
    cy.get('[data-cy="phone-input"]').should("have.value", "(11) 99");

    cy.get('[data-cy="phone-input"]').clear().type("11999");
    cy.get('[data-cy="phone-input"]').should("have.value", "(11) 999");

    cy.get('[data-cy="phone-input"]').clear().type("1199999");
    cy.get('[data-cy="phone-input"]').should("have.value", "(11) 99999");

    cy.get('[data-cy="phone-input"]').clear().type("119999912");
    cy.get('[data-cy="phone-input"]').should("have.value", "(11) 99999-12");

    cy.get('[data-cy="phone-input"]').clear().type("11999991234");
    cy.get('[data-cy="phone-input"]').should("have.value", "(11) 99999-1234");

    // Testar que não aceita mais de 11 dígitos
    cy.get('[data-cy="phone-input"]').clear().type("119999912345");
    cy.get('[data-cy="phone-input"]').should("have.value", "(11) 99999-1234");

    // Testar que remove caracteres não numéricos
    cy.get('[data-cy="phone-input"]').clear().type("11abc99999def1234");
    cy.get('[data-cy="phone-input"]').should("have.value", "(11) 99999-1234");
  });

  it.only("should send clean phone number to backend on form submission", () => {
    // Interceptar a chamada da API para verificar os dados enviados
    cy.intercept("POST", "**/api/users/create", (req) => {
      // Verificar se o telefone enviado contém apenas números
      expect(req.body.phone).to.match(/^\d{10,11}$/);
      expect(req.body.phone).to.not.include("(");
      expect(req.body.phone).to.not.include(")");
      expect(req.body.phone).to.not.include("-");
      expect(req.body.phone).to.not.include(" ");

      req.reply({
        statusCode: 200,
        body: { success: true, message: "Usuário criado com sucesso" },
      });
    }).as("sign-up");

    // Preencher formulário com telefone formatado
    cy.get('[data-cy="name-input"]').type("João Silva");
    cy.get('[data-cy="email-input"]').type("joao@example.com");
    cy.get('[data-cy="phone-input"]').type("11999991234"); // Será formatado para (11) 99999-1234
    cy.get('[data-cy="password-input"]').type("MinhaSenh@123");
    cy.get('[data-cy="confirm-password-input"]').type("MinhaSenh@123");
    cy.get('[data-cy="terms-checkbox"]').click();

    // Verificar que o campo mostra formatado
    cy.get('[data-cy="phone-input"]').should("have.value", "(11) 99999-1234");

    // Enviar formulário
    cy.get('[data-cy="submit-button"]').click();

    // Verificar se a chamada foi feita com o telefone limpo
    cy.wait("@createUser");
  });
});
