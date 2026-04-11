import database from 'infra/database';
import { hashPassword } from 'infra/password';
import { generateToken } from 'infra/jwt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      nome,
      email,
      password,
      city,
      state,
      interestArea,
      availability,
      modality,
    } = req.body;

    // Validations
    if (!nome || !email || !password || !city || !state) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    const existingUserResult = await database.query({
      text: 'SELECT id FROM usuarios WHERE email = $1',
      values: [email.toLowerCase()],
    });

    if (existingUserResult.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUserResult = await database.query({
      text: `
        INSERT INTO usuarios (
          nome,
          email,
          password,
          city,
          state,
          "interestArea",
          availability,
          modality,
          role,
          "totalHours",
          "memberSince"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()::date)
        RETURNING id, nome, email, role, "createdAt"
      `,
      values: [
        nome,
        email.toLowerCase(),
        hashedPassword,
        city,
        state,
        interestArea || "Não informado",
        availability || "Não informado",
        modality || "Não informado",
        req.body.role === 'ong' ? 'ong' : 'volunteer', // Use front-end override if passed!
        0,
      ],
    });

    const newUser = newUserResult[0]; // If database.query returns the array directly

    // Generate JWT token
    const token = await generateToken({ // Must await! generateToken is async using jose natively!
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });
    
    // Auto-login the user inside Registration by configuring the cookie!
    res.setHeader('Set-Cookie',
        `token=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXPIRATION_NUMBER}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
    );

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
