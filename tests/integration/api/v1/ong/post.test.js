import database from "infra/database";

describe("POST /api/v1/ong", () => {
  beforeAll(async () => {
    // Clean up before tests
    await database.query("DELETE FROM ongs;");
  });

  afterAll(async () => {
    // Optionally clean up after tests or let the next suite handle it
    await database.query("DELETE FROM ongs;");
  });

  it("should create a new ONG and return 201", async () => {
    const response = await fetch("http://localhost:3000/api/v1/ong", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: "ONG Teste",
        localidade: "São Paulo - SP",
        email: "contato@ongteste.org",
        telefone: "11999999999",
      }),
    });

    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody).toHaveProperty("id");
    expect(responseBody.nome).toBe("ONG Teste");
    expect(responseBody.email).toBe("contato@ongteste.org");
    expect(responseBody.localidade).toBe("São Paulo - SP");
    expect(responseBody.telefone).toBe("11999999999");
  });

  it("should fail when missing required fields", async () => {
    const response = await fetch("http://localhost:3000/api/v1/ong", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: "ONG Teste 2",
        // localidade missing
      }),
    });

    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.error).toBeDefined();
  });
});
