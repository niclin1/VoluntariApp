import database from "infra/database";

// GET  /api/v1/usuario
// POST /api/v1/usuario
// GET returns a list of usuarios.
// POST creates a new usuario and returns the created record.
async function usuario(req, res) {
   // Configura o CORS
  res.setHeader('Access-Control-Allow-Origin', '*') // ou uma origem específica
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Responde ao preflight (requisição OPTIONS do browser)
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  if (req.method === "GET") {
    try {
      const usuarios = await database.query({
        text: `
          SELECT
            id,
            nome AS "name",
            email,
            initials,
            city,
            state,
            member_since AS "memberSince",
            interest_area AS "interestArea",
            availability,
            modality,
            total_hours AS "totalHours",
            criado_em
          FROM usuarios
          ORDER BY criado_em DESC
        `,
      });

      return res.status(200).json(usuarios ?? []);
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }

  if (req.method === "POST") {
    const {
      name,
      nome,
      email,
      initials,
      city,
      state,
      memberSince,
      interestArea,
      availability,
      modality,
      totalHours,
    } = req.body ?? {};

    const finalName = name ?? nome;
    if (!finalName || !email) {
      return res
        .status(400)
        .json({ error: "Campos obrigatórios não informados: name/nome e email." });
    }

    try {
      const inserted = await database.query({
        text: `
          INSERT INTO usuarios (
            nome,
            email,
            initials,
            city,
            state,
            member_since,
            interest_area,
            availability,
            modality,
            total_hours
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
          RETURNING
            id,
            nome AS "name",
            email,
            initials,
            city,
            state,
            member_since AS "memberSince",
            interest_area AS "interestArea",
            availability,
            modality,
            total_hours AS "totalHours",
            criado_em
        `,
        values: [
          finalName,
          email,
          initials ?? null,
          city ?? null,
          state ?? null,
          memberSince ?? null,
          interestArea ?? null,
          availability ?? null,
          modality ?? null,
          totalHours ?? null,
        ],
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

  // res.setHeader("Allow", ["GET", "POST"]);
  // return res.status(405).end(`Method ${req.method} Not Allowed`);
  return res.status(405).json({ error: `salve` });
}

export default usuario;
