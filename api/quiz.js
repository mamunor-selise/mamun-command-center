import { connectToDatabase, verifyToken } from './_db.js';

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

  // Verify Auth Token
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';
  const authUser = verifyToken(token);

  const userId = authUser ? (authUser.id || authUser.email) : 'guest';

  try {
    const { db } = await connectToDatabase();
    const quizCollection = db.collection('quiz_results');

    // 1. GET: Fetch Quiz Results for user
    if (req.method === 'GET') {
      const results = await quizCollection
        .find({ userId })
        .sort({ date: -1 })
        .limit(50)
        .toArray();

      return res.status(200).json({ results });
    }

    // 2. POST: Save new Quiz Result
    if (req.method === 'POST') {
      const newResult = {
        ...req.body,
        userId,
        createdAt: new Date().toISOString()
      };

      await quizCollection.insertOne(newResult);
      return res.status(201).json({ message: 'Quiz result saved to MongoDB Atlas successfully.', result: newResult });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('Quiz API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
