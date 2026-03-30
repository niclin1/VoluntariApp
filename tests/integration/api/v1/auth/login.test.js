import database from '@/infra/database';
import { hashPassword } from '@/infra/password';

describe('POST /api/v1/auth/login', () => {
  beforeEach(async () => {
    // Clean up test data
    await database.query({
      text: 'DELETE FROM usuarios WHERE email = $1',
      values: ['login-test@example.com'],
    });

    // Create test user
    const hashedPassword = await hashPassword('password123');
    await database.query({
      text: `
        INSERT INTO usuarios (
          nome, email, password, city, state, role, totalHours, memberSince
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()::date)
      `,
      values: [
        'Test User',
        'login-test@example.com',
        hashedPassword,
        'São Paulo',
        'SP',
        'volunteer',
        0,
      ],
    });
  });

  test('should login successfully with correct credentials', async () => {
    const res = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'login-test@example.com',
        password: 'password123',
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.token).toBeDefined();
    expect(data.user.email).toBe('login-test@example.com');
    expect(data.message).toBe('Login successful');
  });

  test('should reject login with incorrect password', async () => {
    const res = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'login-test@example.com',
        password: 'wrongpassword',
      }),
    });

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toContain('Invalid email or password');
  });

  test('should reject login with non-existent email', async () => {
    const res = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'password123',
      }),
    });

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toContain('Invalid email or password');
  });

  test('should reject login without required fields', async () => {
    const res = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'login-test@example.com',
        // missing password
      }),
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Email and password are required');
  });
});
