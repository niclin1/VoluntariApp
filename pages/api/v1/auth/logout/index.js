export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Clear the JWT token cookie by setting Max-Age to 0
  res.setHeader(
    'Set-Cookie',
    `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${
      process.env.NODE_ENV === 'production' ? '; Secure' : ''
    }`
  );

  return res.status(200).json({ message: 'Logout successful' });
}