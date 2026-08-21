const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://mamunorselise:Z3xxMP1KoVJIODlu@cluster0.e6whmmx.mongodb.net/mamun_command_center?retryWrites=true&w=majority&appName=Cluster0";

async function testMongo() {
  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB Atlas!");
    const db = client.db('mamun_command_center');
    const users = db.collection('users');
    const count = await users.countDocuments();
    console.log("Current users count in MongoDB Atlas:", count);

    const sample = await users.find({}).limit(5).toArray();
    console.log("Sample users:", sample);
  } catch (err) {
    console.error("MongoDB Atlas connection error:", err);
  } finally {
    await client.close();
  }
}

testMongo();
