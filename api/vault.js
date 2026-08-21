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

  // Verify Bearer Auth Token (Fallback to 'guest' if unauthenticated)
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';
  const authUser = verifyToken(token);

  const userId = authUser ? (authUser.id || authUser.email) : 'guest';

  try {
    const { db } = await connectToDatabase();
    const vaultCollection = db.collection('vault_items');

    // 1. GET: Fetch encrypted vault items for user
    if (req.method === 'GET') {
      const items = await vaultCollection.find({ userId }).toArray();
      return res.status(200).json({ success: true, items });
    }

    // 2. POST / PUT: Create / update encrypted vault item
    if (req.method === 'POST' || req.method === 'PUT') {
      const item = req.body || {};
      if (!item.title || !item.encryptedPayload) {
        return res.status(400).json({ error: { message: 'Invalid payload: title and encryptedPayload required.' } });
      }

      item.userId = userId;
      item.updatedAt = new Date().toISOString();

      if (!item.id) {
        item.id = 'vitem-' + Date.now();
        item.createdAt = new Date().toISOString();
      }

      await vaultCollection.updateOne(
        { id: item.id, userId },
        { $set: item },
        { upsert: true }
      );

      return res.status(200).json({ success: true, item });
    }

    // 3. DELETE: Delete vault item
    if (req.method === 'DELETE') {
      const { id } = req.query || req.body || {};
      if (!id) {
        return res.status(400).json({ error: { message: 'Vault Item ID required.' } });
      }

      await vaultCollection.deleteOne({ id, userId });
      return res.status(200).json({ success: true, message: 'Vault item deleted.' });
    }

    return res.status(405).json({ error: { message: 'Method Not Allowed' } });
  } catch (error) {
    console.error('MongoDB Vault API Error:', error);
    return res.status(500).json({
      error: { message: error.message || 'Database error processing vault item.' }
    });
  }
}
