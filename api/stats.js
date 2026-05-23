import { MongoClient } from 'mongodb';

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  // Using 'test' as your database name as you provided
  const db = client.db('test'); 
  cachedDb = db;
  return db;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const db = await connectToDatabase();

    // Fetch counts from your collections
    const [empCount, taskCount] = await Promise.all([
      db.collection('employees').countDocuments(), // Change 'employees' if different
      db.collection('tasks').countDocuments()      // Change 'tasks' if different
    ]);

    res.status(200).json({
      totalEmployees: empCount,
      activeTasks: taskCount,
      avgPerformance: 92 // Static for now
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}