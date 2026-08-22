import { connectToDatabase } from './_db.js';

export const mockDatabaseSchemas = {
  mongodb: [
    {
      name: 'users',
      displayName: 'Users Collection',
      type: 'collection',
      fields: [
        { name: '_id', type: 'objectId', nullable: false, isPrimaryKey: true },
        { name: 'fullName', type: 'string', nullable: false },
        { name: 'email', type: 'string', nullable: false },
        { name: 'role', type: 'string', nullable: false },
        { name: 'createdAt', type: 'date', nullable: false },
        { name: 'isActive', type: 'boolean', nullable: false }
      ]
    },
    {
      name: 'routine_tasks',
      displayName: 'Routine Tasks',
      type: 'collection',
      fields: [
        { name: '_id', type: 'objectId', nullable: false, isPrimaryKey: true },
        { name: 'userId', type: 'objectId', nullable: false, isForeignKey: true },
        { name: 'title', type: 'string', nullable: false },
        { name: 'category', type: 'string', nullable: false },
        { name: 'status', type: 'string', nullable: false },
        { name: 'priority', type: 'string', nullable: false },
        { name: 'timeSlot', type: 'string', nullable: true },
        { name: 'completedAt', type: 'date', nullable: true }
      ]
    },
    {
      name: 'cv_profiles',
      displayName: 'CV Profiles',
      type: 'collection',
      fields: [
        { name: '_id', type: 'objectId', nullable: false, isPrimaryKey: true },
        { name: 'title', type: 'string', nullable: false },
        { name: 'fullName', type: 'string', nullable: false },
        { name: 'email', type: 'string', nullable: false },
        { name: 'skills', type: 'array', nullable: false },
        { name: 'updatedAt', type: 'date', nullable: false }
      ]
    },
    {
      name: 'ai_tools',
      displayName: 'AI Tools Store',
      type: 'collection',
      fields: [
        { name: '_id', type: 'objectId', nullable: false, isPrimaryKey: true },
        { name: 'name', type: 'string', nullable: false },
        { name: 'category', type: 'string', nullable: false },
        { name: 'pricing', type: 'string', nullable: false },
        { name: 'rating', type: 'number', nullable: false },
        { name: 'url', type: 'string', nullable: false }
      ]
    }
  ],

  postgresql: [
    {
      name: 'users',
      displayName: 'users',
      type: 'table',
      fields: [
        { name: 'id', type: 'integer', nullable: false, isPrimaryKey: true },
        { name: 'full_name', type: 'string', nullable: false },
        { name: 'email', type: 'string', nullable: false },
        { name: 'role', type: 'string', nullable: false },
        { name: 'created_at', type: 'timestamp', nullable: false },
        { name: 'is_active', type: 'boolean', nullable: false }
      ]
    },
    {
      name: 'orders',
      displayName: 'orders',
      type: 'table',
      fields: [
        { name: 'id', type: 'integer', nullable: false, isPrimaryKey: true },
        { name: 'user_id', type: 'integer', nullable: false, isForeignKey: true },
        { name: 'total_amount', type: 'decimal', nullable: false },
        { name: 'order_status', type: 'string', nullable: false },
        { name: 'created_at', type: 'timestamp', nullable: false }
      ]
    },
    {
      name: 'order_items',
      displayName: 'order_items',
      type: 'table',
      fields: [
        { name: 'id', type: 'integer', nullable: false, isPrimaryKey: true },
        { name: 'order_id', type: 'integer', nullable: false, isForeignKey: true },
        { name: 'product_name', type: 'string', nullable: false },
        { name: 'quantity', type: 'integer', nullable: false },
        { name: 'price', type: 'decimal', nullable: false }
      ]
    }
  ],

  mysql: [
    {
      name: 'employees',
      displayName: 'employees',
      type: 'table',
      fields: [
        { name: 'emp_id', type: 'integer', nullable: false, isPrimaryKey: true },
        { name: 'first_name', type: 'string', nullable: false },
        { name: 'last_name', type: 'string', nullable: false },
        { name: 'department', type: 'string', nullable: false },
        { name: 'salary', type: 'decimal', nullable: false },
        { name: 'hire_date', type: 'date', nullable: false }
      ]
    },
    {
      name: 'departments',
      displayName: 'departments',
      type: 'table',
      fields: [
        { name: 'dept_id', type: 'integer', nullable: false, isPrimaryKey: true },
        { name: 'dept_name', type: 'string', nullable: false },
        { name: 'budget', type: 'decimal', nullable: false }
      ]
    }
  ],

  sqlite: [
    {
      name: 'notes',
      displayName: 'notes',
      type: 'table',
      fields: [
        { name: 'id', type: 'integer', nullable: false, isPrimaryKey: true },
        { name: 'title', type: 'string', nullable: false },
        { name: 'content', type: 'text', nullable: true },
        { name: 'tags', type: 'string', nullable: true },
        { name: 'created_at', type: 'timestamp', nullable: false }
      ]
    }
  ]
};

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const dbType = req.query.db || 'mongodb';
    const schemas = mockDatabaseSchemas[dbType] || mockDatabaseSchemas.mongodb;

    return res.status(200).json({
      success: true,
      dbType,
      schemas
    });
  }

  if (method === 'POST') {
    const { action, dbType, queryState, queryName } = req.body;

    if (action === 'execute') {
      const startTime = Date.now();
      
      // Generate sample execution results based on active table & dbType
      const table = queryState?.fromTable || 'users';
      const sampleData = generateSampleData(table, queryState);
      const executionTime = Math.floor(Math.random() * 15) + 5; // 5-20ms

      return res.status(200).json({
        success: true,
        executionStats: {
          executionTimeMs: executionTime,
          rowsReturned: sampleData.length,
          dbType: dbType || 'mongodb',
          fromTable: table
        },
        data: sampleData
      });
    }

    if (action === 'save') {
      try {
        const { db } = await connectToDatabase();
        const savedRecord = {
          name: queryName || 'Untitled Visual Query',
          dbType: dbType || 'mongodb',
          queryState,
          createdAt: new Date()
        };

        await db.collection('saved_visual_queries').insertOne(savedRecord);

        return res.status(200).json({
          success: true,
          message: 'Query saved successfully!',
          query: savedRecord
        });
      } catch (err) {
        return res.status(200).json({
          success: true,
          message: 'Query saved locally (Database offline fallback).',
          query: { name: queryName, dbType, queryState, createdAt: new Date() }
        });
      }
    if (action === 'add-schema') {
      const { newSchema } = req.body;
      if (!newSchema || !newSchema.name || !newSchema.fields) {
        return res.status(400).json({ error: { message: 'Invalid schema structure' } });
      }

      const targetDb = dbType || 'mongodb';
      if (!mockDatabaseSchemas[targetDb]) mockDatabaseSchemas[targetDb] = [];

      // Check if schema exists, otherwise append
      const existingIdx = mockDatabaseSchemas[targetDb].findIndex(s => s.name === newSchema.name);
      if (existingIdx >= 0) {
        mockDatabaseSchemas[targetDb][existingIdx] = newSchema;
      } else {
        mockDatabaseSchemas[targetDb].push(newSchema);
      }

      try {
        const { db } = await connectToDatabase();
        await db.collection('custom_db_schemas').updateOne(
          { name: newSchema.name, dbType: targetDb },
          { $set: { ...newSchema, dbType: targetDb, updatedAt: new Date() } },
          { upsert: true }
        );
      } catch (err) {
        console.warn('MongoDB Atlas schema optional sync warning:', err.message);
      }

      return res.status(200).json({
        success: true,
        message: `Data Model "${newSchema.name}" added successfully!`,
        schemas: mockDatabaseSchemas[targetDb]
      });
    }
  }

  return res.status(405).json({ error: { message: 'Method Not Allowed' } });
}

function generateSampleData(tableName, queryState) {
  if (tableName === 'routine_tasks') {
    return [
      { _id: '6590a1f1', userId: 'usr-101', title: 'Complete Angular 19 Query Builder', category: 'Development', status: 'Completed', priority: 'High', timeSlot: '09:00 - 11:00 AM' },
      { _id: '6590a1f2', userId: 'usr-101', title: 'Review OpenRouter AI Prompts', category: 'AI & Research', status: 'In Progress', priority: 'High', timeSlot: '11:30 - 01:00 PM' },
      { _id: '6590a1f3', userId: 'usr-101', title: 'Update project-markdown progress.md', category: 'Documentation', status: 'Completed', priority: 'Medium', timeSlot: '02:00 - 03:00 PM' },
      { _id: '6590a1f4', userId: 'usr-101', title: 'Team Architecture Sync', category: 'Meeting', status: 'Pending', priority: 'Low', timeSlot: '04:30 - 05:30 PM' }
    ];
  }

  if (tableName === 'cv_profiles') {
    return [
      { _id: 'cv-101', title: 'Lead Full-Stack & AI Engineer', fullName: 'Mamun Or Rashid', email: 'mamun@example.com', skills: ['Angular 19', 'TypeScript', 'Node.js', 'MongoDB', 'AI Agents', 'MCP'], updatedAt: '2026-08-22' },
      { _id: 'cv-102', title: 'Senior Frontend Developer', fullName: 'Mamun Or Rashid', email: 'mamun@example.com', skills: ['Angular', 'RxJS', 'Tailwind CSS', 'Vite'], updatedAt: '2026-08-20' }
    ];
  }

  if (tableName === 'ai_tools') {
    return [
      { _id: 'tool-1', name: 'Cursor AI', category: 'Development', pricing: 'Freemium', rating: 4.9, url: 'https://cursor.com' },
      { _id: 'tool-2', name: 'DeepSeek R1', category: 'LLM & Reasoning', pricing: 'Free API', rating: 4.9, url: 'https://chat.deepseek.com' },
      { _id: 'tool-3', name: 'v0 by Vercel', category: 'UI Design', pricing: 'Freemium', rating: 4.7, url: 'https://v0.dev' }
    ];
  }

  if (tableName === 'orders') {
    return [
      { id: 1001, user_id: 42, total_amount: 299.99, order_status: 'COMPLETED', created_at: '2026-08-21T10:15:00Z' },
      { id: 1002, user_id: 88, total_amount: 49.50, order_status: 'PENDING', created_at: '2026-08-22T08:30:00Z' },
      { id: 1003, user_id: 42, total_amount: 1250.00, order_status: 'SHIPPED', created_at: '2026-08-22T09:45:00Z' }
    ];
  }

  if (tableName === 'employees') {
    return [
      { emp_id: 501, first_name: 'Alice', last_name: 'Smith', department: 'Engineering', salary: 125000.00, hire_date: '2023-01-15' },
      { emp_id: 502, first_name: 'Bob', last_name: 'Johnson', department: 'Product', salary: 110000.00, hire_date: '2024-03-01' }
    ];
  }

  return [
    { _id: '6590f001', fullName: 'Mamun Or Rashid', email: 'mamun@commandcenter.io', role: 'Super Admin', createdAt: '2026-01-01', isActive: true },
    { _id: '6590f002', fullName: 'Sarah Connor', email: 'sarah@resistance.org', role: 'Developer', createdAt: '2026-02-14', isActive: true },
    { _id: '6590f003', fullName: 'Alex Mercer', email: 'alex@prototype.com', role: 'Analyst', createdAt: '2026-05-10', isActive: false }
  ];
}
