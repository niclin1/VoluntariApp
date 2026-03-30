import database from "infra/database";

export default async function ong(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      const result = await database.query({
        text: `SELECT id, nome, localidade, email, telefone, criado_em FROM ongs ORDER BY criado_em DESC`
      });
      return res.status(200).json(result.rows || result);
    } catch (error) {
      console.error("Error fetching ongs:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }

  if (req.method === "POST") {
    const { nome, localidade, email, telefone } = req.body ?? {};

    if (!nome || !localidade || !email || !telefone) {
      return res.status(400).json({ error: "Os campos nome, localidade, email e telefone são obrigatórios." });
    }

    try {
      const inserted = await database.query({
        text: `
          INSERT INTO ongs (nome, localidade, email, telefone)
          VALUES ($1, $2, $3, $4)
          RETURNING id, nome, localidade, email, telefone, criado_em
        `,
        values: [nome, localidade, email, telefone]
      });
      
      const createdOng = inserted.rows ? inserted.rows[0] : inserted[0];
      return res.status(201).json(createdOng);
    } catch (error) {
      console.error("Error creating ong:", error);
      if (error.code === '23505') { // Unique violation
        return res.status(409).json({ error: "Já existe uma ONG com este email." });
      }
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }

  return res.status(405).json({ error: "Método não permitido." });
}
