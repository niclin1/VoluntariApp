import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from 'infra/jwt';
import database from 'infra/database';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
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
      return res.status(401).json({ error: 'Você precisa estar logado.' });
    }

    const decoded = await verifyToken(token);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    const { trabalho_id } = req.body;

    if (!trabalho_id) {
      return res.status(400).json({ error: 'O ID da vaga é obrigatório.' });
    }

    const result = await database.query({
      text: `
        DELETE FROM inscricoes 
        WHERE voluntario_id = $1 AND trabalho_id = $2
        RETURNING id
      `,
      values: [decoded.id, trabalho_id],
    });

    if (result.length === 0 && (!result.rows || result.rows.length === 0)) {
      return res.status(404).json({ error: 'Inscrição não encontrada.' });
    }

    return res.status(200).json({ message: 'Inscrição cancelada com sucesso.' });
  } catch (error: any) {
    console.error('Quit error:', error);
    res.status(500).json({ error: 'Erro interno ao cancelar a inscrição.' });
  }
}
