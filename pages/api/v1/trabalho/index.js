import database from "infra/database";

export default async function trabalho(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Lista todos os trabalhos (ou filtrados por ong_id)
  if (req.method === "GET") {
    const { ong_id, id } = req.query;

    try {
      let queryText = `
        SELECT t.*, o.nome as ong_nome, o.email as ong_email, o.localidade as ong_city, o.telefone as ong_phone, o.criado_em as ong_since
        FROM trabalhos t
        JOIN ongs o ON t.ong_id = o.id
      `;
      let queryValues = [];

      if (id) {
        queryText += ` WHERE t.id = $1`;
        queryValues.push(id);
      } else if (ong_id) {
        queryText += ` WHERE t.ong_id = $1`;
        queryValues.push(ong_id);
      }

      if (!id) {
        queryText += ` ORDER BY t.criado_em DESC`;
      }      const result = await database.query({
        text: queryText,
        values: queryValues
      });
      return res.status(200).json(result.rows || result);
    } catch (error) {
      console.error("Error fetching works:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }

  // POST: Criar um novo trabalho (vaga)
  if (req.method === "POST") {
    const { ong_id, titulo, descricao, n_vagas, categoria, disponibilidade, carga_horaria } = req.body ?? {};

    if (!ong_id || !titulo || !descricao || !n_vagas || !categoria || !disponibilidade || carga_horaria === undefined) {
      return res.status(400).json({ error: "Todos os campos (ong_id, titulo, descricao, n_vagas, categoria, disponibilidade, carga_horaria) são obrigatórios." });
    }

    try {
      const inserted = await database.query({
        text: `
          INSERT INTO trabalhos (ong_id, titulo, descricao, n_vagas, categoria, disponibilidade, carga_horaria)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `,
        values: [ong_id, titulo, descricao, n_vagas, categoria, disponibilidade, carga_horaria]
      });
      
      const createdWork = inserted.rows ? inserted.rows[0] : inserted[0];       
      return res.status(201).json(createdWork);
    } catch (error) {
      console.error("Error creating work:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });      
    }
  }

  // PUT: PUT: Atualizar um trabalho existente (vaga)
  if (req.method === "PUT") {
    const { id, titulo, descricao, n_vagas, categoria, disponibilidade, carga_horaria } = req.body ?? {};

    if (!id || !titulo || !descricao || !n_vagas || !categoria || !disponibilidade || carga_horaria === undefined) {
      return res.status(400).json({ error: "O campo ID e todos os outros campos são obrigatórios." });
    }

    try {
      const updated = await database.query({
        text: `
          UPDATE trabalhos
          SET titulo = $1, descricao = $2, n_vagas = $3, categoria = $4, disponibilidade = $5, carga_horaria = $6
          WHERE id = $7
          RETURNING *
        `,
        values: [titulo, descricao, n_vagas, categoria, disponibilidade, carga_horaria, id]
      });

      const updatedRow = updated.rows ? updated.rows[0] : updated[0];

      if (!updatedRow) {
         return res.status(404).json({ error: "Vaga não encontrada ou ID inválido." });
      }

      return res.status(200).json(updatedRow);
    } catch (error) {
      console.error("Error updating work:", error);
      return res.status(500).json({ error: "Erro ao atualizar a vaga." });
    }
  }

  // DELETE: Remover um trabalho (vaga)
  if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "ID da vaga é obrigatório para deletar." });
    }

    try {
      const deleted = await database.query({
        text: `DELETE FROM trabalhos WHERE id = $1 RETURNING *`,
        values: [id]
      });

      const deletedRow = deleted.rows ? deleted.rows[0] : deleted[0];

      if (!deletedRow) {
         return res.status(404).json({ error: "Vaga não encontrada ou ID inválido." });
      }

      return res.status(200).json({ message: "Vaga removida com sucesso.", deleted: deletedRow });
    } catch (error) {
      console.error("Error deleting work:", error);
      return res.status(500).json({ error: "Erro ao remover a vaga." });
    }
  }

  return res.status(405).json({ error: "Método não permitido." });
}