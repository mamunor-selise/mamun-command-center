import { connectToDatabase, verifyPassword, createToken } from '../_db.js';

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method Not Allowed' } });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: { message: 'Email and password are required.' } });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: { message: 'Invalid email or password.' } });
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      return res.status(401).json({ error: { message: 'Invalid email or password.' } });
    }

    const safeUser = {
      id: user.id || user._id?.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    const token = createToken(safeUser);

    return res.status(200).json({
      success: true,
      message: 'Signed in successfully via MongoDB Atlas.',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('MongoDB Signin Error:', error);
    return res.status(500).json({
      error: { message: error.message || 'Database error occurred during signin.' }
    });
  }
}
