import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from 'infra/jwt';
import database from 'infra/database';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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
      return res.status(401).json({ error: 'Você precisa estar logado para se candidatar.' });
    }

    const decoded = await verifyToken(token);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    if (decoded.role === 'ong') {
      return res.status(403).json({ error: 'Apenas perfis de voluntário podem se candidatar às vagas.' });
    }

    const { trabalho_id } = req.body;

    if (!trabalho_id) {
      return res.status(400).json({ error: 'O ID da vaga é obrigatório.' });
    }

    // Check if the work exists
    const workExists = await database.query({
      text: 'SELECT id FROM trabalhos WHERE id = $1',
      values: [trabalho_id],
    });

    if (workExists.length === 0) {
      return res.status(404).json({ error: 'Vaga não encontrada.' });
    }

    // Apply
    await database.query({
      text: `
        INSERT INTO inscricoes (voluntario_id, trabalho_id, status)
        VALUES ($1, $2, 'pendente')
      `,
      values: [decoded.id, trabalho_id],
    });

    return res.status(201).json({ message: 'Inscrição realizada com sucesso! A ONG avaliará o seu perfil.' });

  } catch (error: any) {
    if (error.constraint === 'unique_inscricao') {
      return res.status(409).json({ error: 'Você já está inscrito nesta oportunidade!' });
    }
    console.error('Apply error:', error);
    res.status(500).json({ error: 'Erro interno ao processar a inscrição.' });
  }
}
