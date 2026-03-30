import database from '../../../infra/database';
import { comparePassword } from '../../../infra/password';
import { generateToken } from '../../../infra/jwt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validations
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const userResult = await database.query({
      text: 'SELECT id, nome, email, password, role FROM usuarios WHERE email = $1',
      values: [email.toLowerCase()],
    });

    if (userResult.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userResult[0];

    // Compare password
    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
