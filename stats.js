import { MongoClient } from 'mongodb';

// Cache the connection for serverless "warm starts"
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('your_database_name'); // Replace with your DB name
  cachedDb = db;
  return db;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const db = await connectToDatabase();
    
    // We run multiple aggregations at once
    const [empCount, taskStats, perfStats] = await Promise.all([
      db.collection('employees').countDocuments(),
      db.collection('tasks').countDocuments({ status: 'active' }), // Adjust "status" field name
      db.collection('employees').aggregate([
        { $group: { _id: null, avgPerf: { $avg: "$performance" } } }
      ]).toArray()
    ]);

    res.status(200).json({
      totalEmployees: empCount,
      activeTasks: taskStats,
      avgPerformance: perfStats[0]?.avgPerf ? Math.round(perfStats[0].avgPerf) : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
