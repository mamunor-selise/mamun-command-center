import { MongoClient } from 'mongodb';
import crypto from 'crypto';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://mamunorselise:Z3xxMP1KoVJIODlu@cluster0.e6whmmx.mongodb.net/mamun_command_center?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = 'mamun_command_center';

let cachedClient = global.mongoClient;
let cachedDb = global.mongoDb;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI, {
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000
  });

  await client.connect();
  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;
  global.mongoClient = client;
  global.mongoDb = db;

  return { client, db };
}

// Password hashing utility using SHA-512 with salt
export function hashPassword(password, salt) {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: generatedSalt };
}

export function verifyPassword(password, hash, salt) {
  const check = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return check === hash;
}

// Simple JWT / Auth Token generator
export function createToken(user) {
  const payload = {
    id: user.id || user._id?.toString(),
    email: user.email,
    name: user.name,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  const str = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto.createHmac('sha256', process.env.JWT_SECRET || 'mcc_secret_key_2026').update(str).digest('hex');
  return `${str}.${signature}`;
}

export function verifyToken(tokenStr) {
  if (!tokenStr) return null;
  try {
    const parts = tokenStr.split('.');
    if (parts.length !== 2) return null;
    const [str, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', process.env.JWT_SECRET || 'mcc_secret_key_2026').update(str).digest('hex');
    if (signature !== expectedSig) return null;
    
    const payload = JSON.parse(Buffer.from(str, 'base64').toString('utf-8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch (e) {
    return null;
  }
}
