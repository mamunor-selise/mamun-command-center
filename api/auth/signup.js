import { connectToDatabase, hashPassword, createToken } from '../_db.js';

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

  const { name, email, password } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ error: { message: 'Full name is required.' } });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: { message: 'Please provide a valid email address.' } });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: { message: 'Password must be at least 6 characters long.' } });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: { message: 'An account with this email already exists in MongoDB.' } });
    }

    // Hash password
    const { hash, salt } = hashPassword(password);
    const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    
    const newUser = {
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hash,
      salt: salt,
      createdAt: new Date().toISOString()
    };

    await usersCollection.insertOne(newUser);

    const safeUser = {
      id: userId,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt
    };

    const token = createToken(safeUser);

    return res.status(201).json({
      success: true,
      message: 'User account registered in MongoDB Atlas successfully.',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('MongoDB Signup Error:', error);
    return res.status(500).json({
      error: { message: error.message || 'Database error occurred during signup.' }
    });
  }
}
