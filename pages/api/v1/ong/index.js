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
        return res.status(409).json({ error: "Já existe uma ONG com este email." });                                                                                 }
      return res.status(500).json({ error: "Erro interno no servidor." });      
    }
  }

  // PUT: Atualizar os dados de uma ONG
  if (req.method === "PUT") {
    const { id, nome, localidade, telefone } = req.body ?? {};

    if (!id || !nome || !localidade || !telefone) {
      return res.status(400).json({ error: "Os campos id, nome, localidade e telefone são obrigatórios." });
    }

    try {
      const updated = await database.query({
        text: `
          UPDATE ongs
          SET nome = $1, localidade = $2, telefone = $3
          WHERE id = $4
          RETURNING id, nome, localidade, email, telefone, criado_em
        `,
        values: [nome, localidade, telefone, id]
      });

      const updatedOng = updated.rows ? updated.rows[0] : updated[0];

      if (!updatedOng) {
        return res.status(404).json({ error: "ONG não encontrada." });
      }

      return res.status(200).json(updatedOng);
    } catch (error) {
      console.error("Error updating ong:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }

  // DELETE: Remover uma ONG
  if (req.method === "DELETE") {
    const { id } = req.query ?? {};

    if (!id) {
      return res.status(400).json({ error: "ID da ONG é obrigatório para deletar." });
    }

    try {
      const deleted = await database.query({
        text: `DELETE FROM ongs WHERE id = $1 RETURNING id`,
        values: [id]
      });

      const deletedOng = deleted.rows ? deleted.rows[0] : deleted[0];

      if (!deletedOng) {
        return res.status(404).json({ error: "ONG não encontrada." });
      }

      return res.status(200).json({ message: "ONG removida com sucesso." });
    } catch (error) {
      console.error("Error deleting ong:", error);
      return res.status(500).json({ error: "Erro interno no servidor ao tentar deletar a ONG." });
    }
  }

  return res.status(405).json({ error: "Método não permitido." });
}
