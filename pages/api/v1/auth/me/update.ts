import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from 'infra/jwt';
import database from 'infra/database';

export default async function updateMe(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const cookie = req.headers.cookie;
    let token = null;

    if (cookie) {
      const tokenMatch = cookie.match(/token=([^;]+)/);
      token = tokenMatch ? tokenMatch[1] : null;
    }

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const decoded = await verifyToken(token);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    const { nome, city, state, interestArea, availability, modality } = req.body;

    if (!nome || !city || !state || !interestArea || !availability || !modality) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const updated = await database.query({
      text: `
        UPDATE usuarios
        SET nome = $1, city = $2, state = $3, "interestArea" = $4, availability = $5, modality = $6
        WHERE id = $7
        RETURNING id, nome, city, state, "interestArea", availability, modality
      `,
      values: [nome, city, state, interestArea, availability, modality, decoded.id],
    });

    if (updated.length === 0 && (!updated.rows || updated.rows.length === 0)) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const user = updated.rows ? updated.rows[0] : updated[0];

    return res.status(200).json(user);

  } catch (error) {
    console.error('Error on update me endpoint:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
