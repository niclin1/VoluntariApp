import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from 'infra/jwt';
import database from 'infra/database';

export default async function authMe(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    // Pegar o token do cookie (em ambiente de prod, isso é mais seguro)
    // Alguns sistemas podem mandar via Header de Authorization (Bearer)
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

    // Verificar o token JWT
    const decoded = await verifyToken(token);
    
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    // Buscar no banco as informações mais atualizadas
    const result = await database.query({
      text: `
        SELECT
          id, nome, initials, email, city, state,
          "interestArea", "memberSince", availability,
          modality, "totalHours", role
        FROM usuarios
        WHERE id = $1
      `,
      values: [decoded.id],
    });

    if (result.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const { ...user } = result[0];

    const historicoResult = await database.query({
      text: `
        SELECT 
          t.id, t.titulo, o.nome as ong_nome, t.disponibilidade, t.carga_horaria, t.categoria 
        FROM inscricoes i
        JOIN trabalhos t ON i.trabalho_id = t.id
        JOIN ongs o ON t.ong_id = o.id
        WHERE i.voluntario_id = $1
        ORDER BY i.dt_inscricao DESC
      `,
      values: [decoded.id],
    });

    user.historico = historicoResult.map((h: any) => ({
      id: h.id.toString(),
      title: h.titulo,
      ong: h.ong_nome,
      period: h.disponibilidade,
      hours: h.carga_horaria,
      category: h.categoria,
      icon: h.categoria === 'Educação' ? '📚' : h.categoria === 'Saúde' ? '💚' : h.categoria === 'Meio Ambiente' ? '🌱' : '🤝'
    }));

    user.totalHours = user.historico.reduce((acc: number, h: any) => acc + (h.hours || 0), 0);

    return res.status(200).json(user);

  } catch (error) {
    console.error('Error on me endpoint:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
