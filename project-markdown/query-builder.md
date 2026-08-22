# Multi-Database Query Builder - Comprehensive Plan

**Document Version:** 1.0  
**Last Updated:** 2026-08-22  
**Project Type:** Full-Stack Web Application  
**Target Audience:** Developers, Data Analysts, DBA

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Data Model](#data-model)
5. [Feature Set](#feature-set)
6. [Implementation Phases](#implementation-phases)
7. [Database Translation Layer](#database-translation-layer)
8. [UI/UX Components](#uiux-components)
9. [API Endpoints](#api-endpoints)
10. [Database Specific Features](#database-specific-features)
11. [Development Timeline](#development-timeline)
12. [Testing Strategy](#testing-strategy)
13. [Deployment](#deployment)

---

## 1. Project Overview

### Vision
Build a visual, drag-and-drop query builder that supports multiple database systems (MongoDB, PostgreSQL, MySQL, SQLite) without requiring users to write raw SQL or aggregation pipelines.

### Goals
- ✅ Eliminate manual SQL/pipeline writing
- ✅ Support 4 major database engines
- ✅ Provide real-time query preview
- ✅ Enable query sharing and versioning
- ✅ Support complex joins, aggregations, and filtering
- ✅ Visual query composition with drag-and-drop
- ✅ Export queries in native format (SQL, MongoDB JSON)

### Key Benefits
| Benefit | Impact |
|---------|--------|
| No SQL Knowledge Required | Lower learning curve |
| Visual Composition | Faster query building |
| Multi-DB Support | Single tool for entire stack |
| Real-time Preview | Immediate feedback |
| Query Versioning | Collaboration & audit trail |
| Export Capability | Integration with external tools |

---

## 2. Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Drag & Drop  │  │   Query      │  │   Visual     │           │
│  │ Canvas       │  │   Builder    │  │   SQL/JSON   │           │
│  │ (React DnD)  │  │   UI         │  │   Preview    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    API Layer (Node.js/Express)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Query        │  │ Database     │  │ Schema       │           │
│  │ Endpoints    │  │ Connection   │  │ Introspection│           │
│  │              │  │ Management   │  │              │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              Query Translation Layer (Core Logic)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ MongoDB      │  │ PostgreSQL   │  │ MySQL/SQLite │           │
│  │ Translator   │  │ Translator   │  │ Translator   │           │
│  │              │  │              │  │              │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              Database Layer (Connection Pools)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ MongoDB      │  │ PostgreSQL   │  │ MySQL/SQLite │           │
│  │ Driver       │  │ Driver       │  │ Driver       │           │
│  │              │  │              │  │              │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

### Layered Architecture

```
Layer 1: Presentation (UI)
├── Query Canvas (Drag & Drop)
├── Field Selector
├── Condition Builder
├── Join Manager
└── Result Viewer

Layer 2: State Management
├── Redux/Zustand
├── Query State
├── Database State
└── UI State

Layer 3: API Gateway
├── REST Endpoints
├── WebSocket (Real-time)
└── GraphQL (Optional)

Layer 4: Business Logic
├── Query Validator
├── Query Executor
├── Result Parser
└── Query Optimizer

Layer 5: Translation Engine
├── Abstract Query Model
├── MongoDB Translator
├── PostgreSQL Translator
├── MySQL/SQLite Translator
└── Query Validator per DB

Layer 6: Data Access
├── Connection Manager
├── Transaction Handler
├── Query Executor
└── Result Mapper
```

---

## 3. Technology Stack

### Frontend
- **Framework:** React 18+
- **State Management:** Redux Toolkit / Zustand
- **UI Library:** Tailwind CSS + shadcn/ui
- **Drag & Drop:** React Beautiful DnD / dnd-kit
- **Query Preview:** Monaco Editor / Ace Editor
- **Visualization:** Recharts / Chart.js
- **HTTP Client:** Axios / Fetch API
- **Build Tool:** Vite / Webpack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js / Fastify
- **Database Drivers:**
  - MongoDB: `mongodb` / `mongoose`
  - PostgreSQL: `pg` / `sequelize`
  - MySQL: `mysql2` / `sequelize`
  - SQLite: `better-sqlite3` / `sqlite3`
- **ORM/Query Builder:** Prisma / TypeORM (Optional)
- **Validation:** Joi / Zod
- **Logging:** Winston / Pino
- **Testing:** Jest / Vitest

### Database
- **Query Storage:** PostgreSQL / MongoDB
- **Cache:** Redis (optional)
- **Message Queue:** RabbitMQ / Bull (for async execution)

### DevOps & Deployment
- **Containerization:** Docker
- **Orchestration:** Kubernetes (optional)
- **CI/CD:** GitHub Actions / GitLab CI
- **Hosting:** AWS / GCP / Azure

---

## 4. Data Model

### Complete TypeScript Data Model

```typescript
// ============================================
// 1. DATABASE CONFIGURATION
// ============================================
interface DatabaseConfig {
  id: string;
  type: 'mongodb' | 'postgresql' | 'mysql' | 'sqlite';
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl?: boolean;
  connectionTimeout?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// 2. SCHEMA DEFINITIONS
// ============================================
interface Field {
  id: string;
  name: string;
  displayName: string;
  type: FieldType;
  nullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  foreignKeyRef?: ForeignKeyReference;
  defaultValue?: any;
  indexed: boolean;
  columnSize?: number;
  precision?: number;
  scale?: number;
}

type FieldType = 
  | 'string' | 'number' | 'integer' | 'boolean' | 'date' 
  | 'timestamp' | 'json' | 'array' | 'objectId' | 'decimal'
  | 'text' | 'bigint' | 'smallint' | 'float' | 'double'
  | 'uuid' | 'enum' | 'interval' | 'binary';

interface ForeignKeyReference {
  table: string;
  field: string;
  onDelete?: 'CASCADE' | 'RESTRICT' | 'SET NULL' | 'NO ACTION';
  onUpdate?: 'CASCADE' | 'RESTRICT' | 'SET NULL' | 'NO ACTION';
}

interface Table {
  id: string;
  name: string;
  displayName: string;
  type: 'table' | 'collection' | 'view';
  dbType: 'mongodb' | 'postgresql' | 'mysql' | 'sqlite';
  fields: Field[];
  indexes: Index[];
  primaryKey?: string[];
  constraints: TableConstraint[];
  createdAt: Date;
  updatedAt: Date;
}

interface Index {
  name: string;
  fields: string[];
  unique: boolean;
  sparse?: boolean; // MongoDB specific
}

interface TableConstraint {
  name: string;
  type: 'UNIQUE' | 'CHECK' | 'FOREIGN_KEY' | 'PRIMARY_KEY';
  fields: string[];
}

// ============================================
// 3. QUERY BUILDER COMPONENTS
// ============================================
interface Condition {
  id: string;
  field: string;
  operator: OperatorType;
  value: any;
  valueType: FieldType;
  logicalOperator: 'AND' | 'OR';
  negate?: boolean;
  caseSensitive?: boolean; // for string operations
}

type OperatorType = 
  // Comparison
  | 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' 
  | 'greaterThanOrEqual' | 'lessThanOrEqual'
  // String
  | 'contains' | 'startsWith' | 'endsWith' | 'regex' | 'exactMatch'
  // Array/In
  | 'in' | 'notIn' | 'exists' | 'notExists'
  // Range
  | 'between' | 'notBetween'
  // Null
  | 'isNull' | 'isNotNull'
  // MongoDB specific
  | 'size' | 'all' | 'elemMatch' | 'type' | 'where';

interface Join {
  id: string;
  type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL' | 'CROSS';
  table: string;
  alias?: string;
  onConditions: {
    leftTable: string;
    leftField: string;
    operator: string;
    rightTable: string;
    rightField: string;
  }[];
}

interface Sort {
  id: string;
  field: string;
  direction: 'ASC' | 'DESC';
  priority: number;
  nullsFirst?: boolean;
}

interface Aggregation {
  id: string;
  field: string;
  function: AggregationType;
  alias?: string;
  distinct?: boolean;
}

type AggregationType = 
  | 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX' 
  | 'STDDEV' | 'VARIANCE' | 'FIRST' | 'LAST'
  | 'CONCAT' | 'ARRAY_AGG' | 'JSON_AGG';

interface GroupBy {
  fields: string[];
  having?: Condition[];
}

interface Window {
  id: string;
  field: string;
  function: AggregationType;
  partition: string[];
  order: Sort[];
  frame?: {
    mode: 'ROWS' | 'RANGE';
    start: 'UNBOUNDED PRECEDING' | 'CURRENT ROW' | number;
    end: 'UNBOUNDED FOLLOWING' | 'CURRENT ROW' | number;
  };
  alias?: string;
}

// ============================================
// 4. MAIN QUERY STRUCTURE
// ============================================
interface QueryBuilder {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  
  // Core
  databaseId: string;
  fromTable: string;
  fromTableAlias?: string;
  
  // Selection
  selectFields: SelectField[] | '*';
  selectDistinct: boolean;
  
  // Filtering
  conditions: Condition[];
  conditionGroups?: ConditionGroup[];
  
  // Joins
  joins: Join[];
  
  // Aggregation & Grouping
  aggregations?: Aggregation[];
  groupBy?: GroupBy;
  window?: Window[];
  
  // Sorting
  sorts: Sort[];
  
  // Pagination
  limit?: number;
  offset?: number;
  
  // Execution
  timeout?: number;
  maxRows?: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastExecutedAt?: Date;
  executionCount: number;
  
  // Versioning
  version: number;
  parentVersion?: string;
}

interface SelectField {
  name: string;
  alias?: string;
  distinct?: boolean;
  expression?: string; // for computed fields
}

interface ConditionGroup {
  id: string;
  conditions: Condition[];
  operator: 'AND' | 'OR';
  negate?: boolean;
}

// ============================================
// 5. EXECUTION & RESULTS
// ============================================
interface QueryExecution {
  id: string;
  queryId: string;
  executedAt: Date;
  status: 'pending' | 'executing' | 'success' | 'error' | 'cancelled';
  result?: QueryResult;
  executionTime: number; // ms
  rowsAffected: number;
  error?: ExecutionError;
}

interface QueryResult {
  data: Record<string, any>[];
  columns: ColumnMetadata[];
  totalRows: number;
  pageNumber?: number;
  pageSize?: number;
  hasMore?: boolean;
  stats?: ExecutionStats;
}

interface ColumnMetadata {
  name: string;
  type: FieldType;
  displayName: string;
  width?: number;
  sortable: boolean;
  filterable: boolean;
}

interface ExecutionStats {
  queryTime: number;
  fetchTime: number;
  parseTime: number;
  rowsScanned: number;
  rowsReturned: number;
  indexUsed?: string[];
  executionPlan?: any;
}

interface ExecutionError {
  code: string;
  message: string;
  details?: any;
  suggestion?: string;
}

// ============================================
// 6. DRAG & DROP STATE
// ============================================
interface DragDropElement {
  id: string;
  type: 'table' | 'field' | 'join' | 'condition' | 'aggregation';
  data: any;
  position: {
    x: number;
    y: number;
  };
  dimensions?: {
    width: number;
    height: number;
  };
  connectedElements?: string[]; // for visualization
}

interface CanvasState {
  elements: DragDropElement[];
  selectedElement?: string;
  zoom: number;
  pan: { x: number; y: number };
}

// ============================================
// 7. WORKSPACE & PROJECT
// ============================================
interface QueryBuilderWorkspace {
  id: string;
  name: string;
  description?: string;
  selectedDatabase: DatabaseConfig;
  queryBuilders: QueryBuilder[];
  tables: Table[];
  elements: DragDropElement[];
  canvasState: CanvasState;
  history: QueryBuilder[];
  historyIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  workspaces: QueryBuilderWorkspace[];
  databases: DatabaseConfig[];
  sharedQueries: SharedQuery[];
  team?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface SharedQuery {
  id: string;
  queryId: string;
  sharedBy: string;
  sharedWith: string[];
  permission: 'read' | 'write';
  expiresAt?: Date;
}

// ============================================
// 8. API RESPONSE TYPES
// ============================================
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: {
    timestamp: Date;
    version: string;
  };
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// ============================================
// 9. EXPORT FORMATS
// ============================================
interface QueryExport {
  format: 'sql' | 'mongodb' | 'json' | 'python' | 'javascript';
  query: string;
  metadata?: {
    database: string;
    version: string;
    exportedAt: Date;
  };
}
```

---

## 5. Feature Set

### Phase 1: Core Features (MVP)
- [ ] Database connection management (MongoDB, PostgreSQL, MySQL, SQLite)
- [ ] Schema introspection and table discovery
- [ ] Basic SELECT queries with filtering
- [ ] Simple conditions (equals, contains, between)
- [ ] Single table queries
- [ ] Basic sorting and limiting
- [ ] Query execution and result display
- [ ] SQL/MongoDB preview
- [ ] Query save and load

### Phase 2: Intermediate Features
- [ ] JOIN operations (INNER, LEFT, RIGHT, FULL)
- [ ] Aggregations (COUNT, SUM, AVG, MIN, MAX)
- [ ] GROUP BY with HAVING
- [ ] Compound conditions with AND/OR
- [ ] Query history and versioning
- [ ] Drag & drop query builder UI
- [ ] Query templates
- [ ] Export to SQL/JSON
- [ ] Query sharing

### Phase 3: Advanced Features
- [ ] Window functions
- [ ] Subqueries and CTEs (WITH clauses)
- [ ] Complex joins and aliases
- [ ] Union/Intersect operations
- [ ] Full-text search
- [ ] Query optimization suggestions
- [ ] Execution plans visualization
- [ ] Query performance analysis
- [ ] Saved query collections
- [ ] Query scheduling

### Phase 4: Enterprise Features
- [ ] Multi-user collaboration
- [ ] Role-based access control
- [ ] Audit logging
- [ ] Query approval workflows
- [ ] API for programmatic access
- [ ] Integration with BI tools
- [ ] Advanced monitoring and alerts
- [ ] Data lineage tracking

---

## 6. Implementation Phases

### Phase 1: Foundation (Weeks 1-4)
**Duration:** 4 weeks  
**Deliverables:** MVP with basic querying

#### Week 1: Project Setup & Database Layer
- Setup project structure (frontend/backend separation)
- Configure TypeScript, linting, testing
- Implement database connection managers
- Create schema introspection logic
- Set up basic Express API
- Database connection pooling

**Tasks:**
```
[Backend]
- Initialize Node.js project with TypeScript
- Set up database drivers (mongodb, pg, mysql2, sqlite3)
- Create DatabaseConnector class
- Implement SchemaIntrospector
- Setup environment configuration
- Create unit tests for drivers

[Frontend]
- Setup React + Vite project
- Configure Redux/Zustand
- Setup Tailwind CSS
- Create project structure
```

#### Week 2: API Layer & Database Translation Core
- Build REST API endpoints
- Implement query translation engine core
- Create abstract query model
- Build MongoDB query translator
- Build PostgreSQL/MySQL query translator
- Setup error handling and logging

**Tasks:**
```
[Backend]
- Create API routes structure
- Implement QueryValidator class
- Create AbstractQueryTranslator
- Implement MongoDBTranslator
- Implement SQLTranslator (for PG, MySQL, SQLite)
- Create QueryExecutor class
- Setup error handling middleware
- Implement result parsing
```

#### Week 3: Frontend UI & State Management
- Build basic query builder UI
- Implement field selector
- Create condition builder component
- Setup state management
- Build result viewer
- Create query preview (SQL/MongoDB)

**Tasks:**
```
[Frontend]
- Create QueryBuilder component
- Create FieldSelector component
- Create ConditionBuilder component
- Create ResultViewer component
- Setup Redux/Zustand store
- Create API service layer (axios/fetch)
- Build basic styling with Tailwind
```

#### Week 4: Integration & Testing
- Connect frontend to backend
- End-to-end testing
- Performance optimization
- Documentation
- Bug fixes

**Tasks:**
```
[Full-Stack]
- Integration testing
- E2E test scenarios
- Performance profiling
- Security review (SQL injection, etc.)
- Documentation
- Demo preparation
```

### Phase 2: Drag & Drop & Advanced Features (Weeks 5-8)

#### Week 5: Drag & Drop Implementation
- Integrate React Beautiful DnD or dnd-kit
- Implement visual query canvas
- Build table/field dragging
- Create connection visualization

#### Week 6: Joins & Multi-table Queries
- Implement JOIN logic in translators
- Create JOIN UI builder
- Test complex joins across databases
- Optimize join translation

#### Week 7: Aggregations & Grouping
- Implement aggregation functions
- Build GROUP BY logic
- Create HAVING clause support
- Test aggregations across databases

#### Week 8: Query Management
- Implement save/load functionality
- Create query versioning
- Build query history
- Add query sharing

---

## 7. Database Translation Layer

### Translation Strategy

```
User Input (UI)
    ↓
Abstract Query Model
    ├─→ MongoDB Translator → MongoDB Query (Aggregation Pipeline)
    ├─→ PostgreSQL Translator → PostgreSQL SQL
    ├─→ MySQL Translator → MySQL SQL
    └─→ SQLite Translator → SQLite SQL
    ↓
Query Executor
    ↓
Result Parser
    ↓
Normalized Results
```

### MongoDB Translator Example

```typescript
class MongoDBTranslator {
  translate(query: QueryBuilder): MongoDBQuery {
    const pipeline = [];
    
    // $match stage (WHERE)
    if (query.conditions.length > 0) {
      pipeline.push({
        $match: this.translateConditions(query.conditions)
      });
    }
    
    // $lookup stage (JOINs)
    if (query.joins.length > 0) {
      query.joins.forEach(join => {
        pipeline.push(this.translateJoin(join));
      });
    }
    
    // $group stage (GROUP BY)
    if (query.groupBy) {
      pipeline.push(this.translateGroupBy(query.groupBy));
    }
    
    // $sort stage (ORDER BY)
    if (query.sorts.length > 0) {
      pipeline.push({
        $sort: this.translateSorts(query.sorts)
      });
    }
    
    // $skip and $limit (LIMIT/OFFSET)
    if (query.offset) {
      pipeline.push({ $skip: query.offset });
    }
    if (query.limit) {
      pipeline.push({ $limit: query.limit });
    }
    
    // $project stage (SELECT)
    pipeline.push({
      $project: this.translateSelectFields(query.selectFields)
    });
    
    return { pipeline, collectionName: query.fromTable };
  }

  private translateConditions(conditions: Condition[]): object {
    // Convert conditions to MongoDB query operators
    // Handle: $eq, $ne, $gt, $lt, $gte, $lte, $in, $nin, $regex, etc.
  }

  private translateJoin(join: Join): object {
    // Convert to $lookup stage
    // Handle different join types
  }
}
```

### SQL Translator Example

```typescript
class SQLTranslator {
  translate(query: QueryBuilder): SQLQuery {
    let sql = 'SELECT ';
    
    // SELECT clause
    if (query.selectDistinct) {
      sql += 'DISTINCT ';
    }
    sql += this.translateSelectFields(query.selectFields);
    
    // FROM clause
    sql += `\nFROM ${query.fromTable}`;
    
    // JOIN clauses
    query.joins.forEach(join => {
      sql += `\n${this.translateJoin(join)}`;
    });
    
    // WHERE clause
    if (query.conditions.length > 0) {
      sql += `\nWHERE ${this.translateConditions(query.conditions)}`;
    }
    
    // GROUP BY clause
    if (query.groupBy) {
      sql += `\nGROUP BY ${query.groupBy.fields.join(', ')}`;
      if (query.groupBy.having) {
        sql += `\nHAVING ${this.translateConditions(query.groupBy.having)}`;
      }
    }
    
    // ORDER BY clause
    if (query.sorts.length > 0) {
      sql += `\nORDER BY ${this.translateSorts(query.sorts)}`;
    }
    
    // LIMIT/OFFSET clause
    if (query.limit) {
      sql += `\nLIMIT ${query.limit}`;
    }
    if (query.offset) {
      sql += `\nOFFSET ${query.offset}`;
    }
    
    return { sql, parameters: this.extractParameters(query) };
  }
}
```

### Operator Mapping

```typescript
const OperatorMap = {
  // Comparison
  'equals': {
    mongodb: '$eq',
    sql: '=',
    sqlLike: '='
  },
  'notEquals': {
    mongodb: '$ne',
    sql: '!=',
    sqlLike: '!='
  },
  'greaterThan': {
    mongodb: '$gt',
    sql: '>',
    sqlLike: '>'
  },
  'lessThan': {
    mongodb: '$lt',
    sql: '<',
    sqlLike: '<'
  },
  'contains': {
    mongodb: '$regex',
    sql: 'LIKE',
    sqlLike: 'LIKE'
  },
  'in': {
    mongodb: '$in',
    sql: 'IN',
    sqlLike: 'IN'
  },
  'between': {
    mongodb: '$gte/$lte',
    sql: 'BETWEEN',
    sqlLike: 'BETWEEN'
  },
  'isNull': {
    mongodb: '$eq: null',
    sql: 'IS NULL',
    sqlLike: 'IS NULL'
  }
};
```

---

## 8. UI/UX Components

### Component Hierarchy

```
App
├── DatabaseSelector
│   └── DatabaseList
│       └── DatabaseCard
├── WorkspacePanel
│   ├── TableExplorer
│   │   └── TableList
│   │       └── TableFields
│   └── SavedQueries
├── QueryBuilder
│   ├── Canvas (Drag & Drop)
│   │   ├── TableNode
│   │   ├── JoinEdges
│   │   └── ConditionNode
│   ├── Sidebar
│   │   ├── SelectFields
│   │   ├── Conditions
│   │   ├── Joins
│   │   ├── Aggregations
│   │   └── Sorting
│   └── Preview
│       ├── SQLPreview
│       └── MongoDBPreview
├── ResultViewer
│   ├── DataTable
│   ├── Pagination
│   └── Export
└── QueryHistory
```

### Key Components

#### 1. Canvas Component
```typescript
// Visual drag-and-drop area
interface CanvasProps {
  tables: Table[];
  joins: Join[];
  onTableDrop: (table: Table, position: Position) => void;
  onConnect: (source: Table, target: Table) => void;
}
```

#### 2. FieldSelector Component
```typescript
// Select which fields to return
interface FieldSelectorProps {
  table: Table;
  selectedFields: string[];
  onFieldToggle: (field: string) => void;
  onSelectAll: () => void;
}
```

#### 3. ConditionBuilder Component
```typescript
// Build WHERE/HAVING clauses
interface ConditionBuilderProps {
  fields: Field[];
  conditions: Condition[];
  onAddCondition: (condition: Condition) => void;
  onUpdateCondition: (id: string, condition: Condition) => void;
  onRemoveCondition: (id: string) => void;
}
```

#### 4. JoinBuilder Component
```typescript
// Manage table joins
interface JoinBuilderProps {
  tables: Table[];
  joins: Join[];
  onAddJoin: (join: Join) => void;
  onUpdateJoin: (id: string, join: Join) => void;
  onRemoveJoin: (id: string) => void;
}
```

#### 5. ResultViewer Component
```typescript
// Display query results
interface ResultViewerProps {
  result: QueryResult;
  isLoading: boolean;
  error?: ExecutionError;
  onExport: (format: ExportFormat) => void;
  onPageChange: (page: number) => void;
}
```

---

## 9. API Endpoints

### Database Management
```
POST   /api/databases                    - Create database connection
GET    /api/databases                    - List all databases
GET    /api/databases/:id                - Get database details
PUT    /api/databases/:id                - Update database
DELETE /api/databases/:id                - Delete database
POST   /api/databases/:id/test           - Test connection
```

### Schema Operations
```
GET    /api/databases/:id/tables         - List all tables
GET    /api/databases/:id/tables/:table  - Get table schema
GET    /api/databases/:id/tables/:table/fields - Get table fields
POST   /api/databases/:id/refresh-schema - Refresh schema cache
```

### Query Operations
```
POST   /api/queries                      - Create new query
GET    /api/queries                      - List queries
GET    /api/queries/:id                  - Get query details
PUT    /api/queries/:id                  - Update query
DELETE /api/queries/:id                  - Delete query
POST   /api/queries/:id/execute          - Execute query
POST   /api/queries/:id/preview          - Get query preview (SQL/JSON)
POST   /api/queries/:id/export           - Export query
POST   /api/queries/:id/duplicate        - Clone query
GET    /api/queries/:id/history          - Get query history
```

### Workspace Operations
```
POST   /api/workspaces                   - Create workspace
GET    /api/workspaces                   - List workspaces
GET    /api/workspaces/:id               - Get workspace
PUT    /api/workspaces/:id               - Update workspace
DELETE /api/workspaces/:id               - Delete workspace
```

### Sharing & Collaboration
```
POST   /api/queries/:id/share            - Share query
GET    /api/queries/:id/shared-with      - Get share info
DELETE /api/queries/:id/share/:userId    - Revoke access
```

---

## 10. Database Specific Features

### MongoDB
- ✅ Aggregation pipelines
- ✅ $lookup (joins)
- ✅ $group with $sum, $avg, $min, $max
- ✅ $match with regex
- ✅ Nested document queries
- ✅ Array operations ($elemMatch, $size, $all)
- ✅ Text search
- ⚠️ Transactions (limited)

### PostgreSQL
- ✅ Full SQL support
- ✅ Window functions
- ✅ CTEs (WITH clauses)
- ✅ JSON/JSONB operators
- ✅ Array operations
- ✅ Full-text search
- ✅ CASE expressions
- ✅ Set operations (UNION, INTERSECT)

### MySQL
- ✅ Standard SQL
- ✅ Subqueries
- ✅ GROUP_CONCAT
- ✅ JSON functions
- ✅ Window functions (8.0+)
- ⚠️ Limited full-text search

### SQLite
- ✅ Basic SQL
- ✅ Window functions
- ✅ CTEs (3.8.3+)
- ✅ JSON1 extension
- ⚠️ No true transactions

---

## 11. Development Timeline

| Phase | Duration | Start | End | Team |
|-------|----------|-------|-----|------|
| **Phase 1: MVP** | 4 weeks | Week 1 | Week 4 | 2-3 devs |
| **Phase 2: Advanced** | 4 weeks | Week 5 | Week 8 | 2-3 devs |
| **Phase 3: Enterprise** | 4 weeks | Week 9 | Week 12 | 3-4 devs |
| **Phase 4: Polish** | 2 weeks | Week 13 | Week 14 | Full team |

**Total Development Time:** 14 weeks (~3 months)

### Critical Path
1. Database drivers setup → 1 week
2. Translation engine → 2 weeks
3. Frontend integration → 1 week
4. UI components → 2 weeks
5. Testing & optimization → 1 week

---

## 12. Testing Strategy

### Unit Testing
```typescript
// Example: Test MongoDB translator
describe('MongoDBTranslator', () => {
  it('should translate simple WHERE clause', () => {
    const query: QueryBuilder = { /* ... */ };
    const translator = new MongoDBTranslator();
    const result = translator.translate(query);
    expect(result.pipeline[0].$match).toEqual({ age: { $gt: 18 } });
  });

  it('should translate JOINs to $lookup', () => { /* ... */ });
  it('should translate aggregations to $group', () => { /* ... */ });
});
```

### Integration Testing
```typescript
// Test full query execution flow
describe('Query Execution', () => {
  it('should execute MongoDB query and return results', async () => {
    // Setup test database
    // Create test data
    // Execute query
    // Verify results
  });
});
```

### E2E Testing
```typescript
// Playwright/Cypress tests
describe('Query Builder E2E', () => {
  it('should build and execute query via UI', async () => {
    // Navigate to app
    // Select database
    // Drag table
    // Add conditions
    // Click execute
    // Verify results
  });
});
```

### Performance Testing
- Query execution time benchmarks
- Large dataset handling (100k+ rows)
- Concurrent execution stress tests
- Memory leak detection

### Security Testing
- SQL injection prevention
- NoSQL injection prevention
- XSS protection
- Authentication/authorization

---

## 13. Deployment

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: querybuilder
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### CI/CD Pipeline

```yaml
# GitHub Actions example
name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: docker build -t query-builder .
      - run: docker push ...
```

---

## Appendix

### A. Directory Structure

```
query-builder/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── databases.ts
│   │   │   │   ├── queries.ts
│   │   │   │   └── workspace.ts
│   │   │   └── middleware/
│   │   ├── services/
│   │   │   ├── DatabaseService.ts
│   │   │   ├── QueryService.ts
│   │   │   └── ExecutorService.ts
│   │   ├── translators/
│   │   │   ├── AbstractTranslator.ts
│   │   │   ├── MongoDBTranslator.ts
│   │   │   ├── PostgreSQLTranslator.ts
│   │   │   ├── MySQLTranslator.ts
│   │   │   └── SQLiteTranslator.ts
│   │   ├── models/
│   │   │   ├── Database.ts
│   │   │   ├── Query.ts
│   │   │   └── Execution.ts
│   │   ├── config/
│   │   ├── utils/
│   │   └── app.ts
│   ├── tests/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Canvas/
│   │   │   ├── FieldSelector/
│   │   │   ├── ConditionBuilder/
│   │   │   ├── ResultViewer/
│   │   │   └── QueryBuilder/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── styles/
│   │   └── App.tsx
│   ├── tests/
│   └── package.json
├── docker-compose.yml
├── Dockerfile
└── README.md
```

### B. Key Metrics & KPIs

| Metric | Target | Monitoring |
|--------|--------|-----------|
| Query Execution Time | < 2s for 100k rows | APM tool |
| API Response Time | < 200ms | Monitoring |
| Uptime | 99.9% | Uptime robot |
| Test Coverage | > 80% | Jest/Coverage |
| Query Success Rate | > 98% | Logging |

### C. Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Translation bugs | High | Extensive testing, peer review |
| Performance issues | High | Load testing, query optimization |
| Database connection failures | Medium | Retry logic, connection pooling |
| Data loss | High | Backups, transactions |
| Security vulnerabilities | High | Security audit, penetration testing |

---

## Conclusion

This comprehensive query builder will provide a powerful, user-friendly interface for querying multiple database systems. The phased approach ensures MVP delivery within 4 weeks while building toward enterprise-grade features.

**Next Steps:**
1. Approve architecture and tech stack
2. Setup development environment
3. Begin Phase 1 implementation
4. Daily standups and weekly reviews

---

**Document Owner:** Development Team  
**Last Review:** 2026-08-22  
**Next Review:** Upon Phase 1 completion
