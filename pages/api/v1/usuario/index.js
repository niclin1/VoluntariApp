import database from "infra/database";

// POST /api/v1/usuario
// Body: { nome: string, email: string }
// Creates a new usuario and returns the created record.
async function usuario(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { nome, email } = req.body ?? {};

  if (!nome || !email) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios não informados: nome e email." });
  }

  try {
    const inserted = await database.query({
      text: "INSERT INTO usuarios (nome, email) VALUES ($1, $2) RETURNING id, nome, email, criado_em",
      values: [nome, email],
    });

    return res.status(201).json(inserted?.[0] ?? null);
  } catch (error) {
    // unique_violation
    if (error?.code === "23505") {
      return res.status(409).json({ error: "Email já cadastrado." });
    }

    console.error("Error creating usuario:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export default usuario;
