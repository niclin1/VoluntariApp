import database from '@/infra/database';

describe('POST /api/v1/auth/register', () => {
  beforeEach(async () => {
    // Clean up test data
    await database.query({
      text: 'DELETE FROM usuarios WHERE email IN ($1, $2)',
      values: ['test@example.com', 'test2@example.com'],
    });
  });

  test('should register a new user and return JWT token', async () => {
    const res = await fetch('http://localhost:3000/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        city: 'São Paulo',
        state: 'SP',
        interestArea: 'Education',
        availability: 'Full-time',
        modality: 'On-site',
      }),
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.token).toBeDefined();
    expect(data.user.email).toBe('test@example.com');
    expect(data.user.role).toBe('volunteer');
  });

  test('should reject registration with weak password', async () => {
    const res = await fetch('http://localhost:3000/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Test User',
        email: 'test@example.com',
        password: '123',
        city: 'São Paulo',
        state: 'SP',
      }),
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('at least 6 characters');
  });

  test('should reject duplicate email registration', async () => {
    // First registration
    await fetch('http://localhost:3000/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Test User',
        email: 'test2@example.com',
        password: 'password123',
        city: 'São Paulo',
        state: 'SP',
      }),
    });

    // Second registration with same email
    const res = await fetch('http://localhost:3000/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Another User',
        email: 'test2@example.com',
        password: 'password456',
        city: 'Rio de Janeiro',
        state: 'RJ',
      }),
    });

    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toContain('already registered');
  });

  test('should reject missing required fields', async () => {
    const res = await fetch('http://localhost:3000/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Test User',
        // missing email and password
      }),
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Missing required fields');
  });
});
