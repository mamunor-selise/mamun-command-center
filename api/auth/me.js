import { connectToDatabase, verifyToken } from '../_db.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: { message: 'Method Not Allowed' } });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: { message: 'Unauthorized or expired session.' } });
  }

  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ $or: [{ id: payload.id }, { email: payload.email }] });
    if (!user) {
      return res.status(404).json({ error: { message: 'User account not found.' } });
    }

    const safeUser = {
      id: user.id || user._id?.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    return res.status(200).json({
      success: true,
      user: safeUser
    });
  } catch (error) {
    console.error('MongoDB Me Route Error:', error);
    return res.status(500).json({
      error: { message: error.message || 'Database error verifying session.' }
    });
  }
}
