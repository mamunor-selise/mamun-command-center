import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type DatabaseType = 'mongodb' | 'postgresql' | 'mysql' | 'sqlite';

export interface FieldSchema {
  name: string;
  type: string;
  nullable: boolean;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
}

export interface TableSchema {
  name: string;
  displayName: string;
  type: 'table' | 'collection';
  fields: FieldSchema[];
}

export interface Condition {
  id: string;
  field: string;
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains' | 'in' | 'isNull' | 'isNotNull';
  value: any;
  logicalOperator: 'AND' | 'OR';
}

export interface JoinCondition {
  id: string;
  type: 'INNER' | 'LEFT' | 'RIGHT';
  targetTable: string;
  leftField: string;
  rightField: string;
}

export interface AggregationCondition {
  id: string;
  field: string;
  function: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';
  alias?: string;
}

export interface SortCondition {
  id: string;
  field: string;
  direction: 'ASC' | 'DESC';
}

export interface QueryResultData {
  executionStats: {
    executionTimeMs: number;
    rowsReturned: number;
    dbType: string;
    fromTable: string;
  };
  data: Record<string, any>[];
}

@Injectable({
  providedIn: 'root'
})
export class QueryBuilderService {
  private platformId = inject(PLATFORM_ID);

  selectedDb = signal<DatabaseType>('mongodb');
  tables = signal<TableSchema[]>([]);
  isLoadingSchema = signal<boolean>(false);

  fromTable = signal<string>('users');
  selectedFields = signal<string[]>([]);
  conditions = signal<Condition[]>([]);
  joins = signal<JoinCondition[]>([]);
  aggregations = signal<AggregationCondition[]>([]);
  sorts = signal<SortCondition[]>([]);
  limit = signal<number>(50);

  queryResult = signal<QueryResultData | null>(null);
  isExecuting = signal<boolean>(false);
  errorMsg = signal<string | null>(null);
  savedQueries = signal<any[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadSchemas('mongodb');
    }
  }

  // Active table schema definition
  activeTableSchema = computed(() => {
    const tableList = this.tables();
    const active = this.fromTable();
    return tableList.find(t => t.name === active) || tableList[0] || null;
  });

  // Native MongoDB Aggregation Pipeline preview generator
  generatedMongoPipeline = computed(() => {
    const pipeline: any[] = [];
    const table = this.fromTable();
    const conds = this.conditions();
    const jns = this.joins();
    const aggs = this.aggregations();
    const srts = this.sorts();
    const fields = this.selectedFields();
    const maxRows = this.limit();

    // 1. $match stage
    if (conds.length > 0) {
      const matchObj: Record<string, any> = {};
      conds.forEach(c => {
        if (!c.field) return;
        let opVal: any = c.value;
        if (c.operator === 'equals') opVal = c.value;
        else if (c.operator === 'notEquals') opVal = { $ne: c.value };
        else if (c.operator === 'greaterThan') opVal = { $gt: isNaN(Number(c.value)) ? c.value : Number(c.value) };
        else if (c.operator === 'lessThan') opVal = { $lt: isNaN(Number(c.value)) ? c.value : Number(c.value) };
        else if (c.operator === 'contains') opVal = { $regex: c.value, $options: 'i' };
        else if (c.operator === 'isNull') opVal = null;
        else if (c.operator === 'isNotNull') opVal = { $ne: null };
        else if (c.operator === 'in') opVal = { $in: String(c.value).split(',').map(v => v.trim()) };

        matchObj[c.field] = opVal;
      });
      pipeline.push({ $match: matchObj });
    }

    // 2. $lookup stage (Joins)
    if (jns.length > 0) {
      jns.forEach(j => {
        if (j.targetTable && j.leftField && j.rightField) {
          pipeline.push({
            $lookup: {
              from: j.targetTable,
              localField: j.leftField,
              foreignField: j.rightField,
              as: `${j.targetTable}_joined`
            }
          });
        }
      });
    }

    // 3. $group stage (Aggregations)
    if (aggs.length > 0) {
      const groupObj: Record<string, any> = { _id: null };
      aggs.forEach(a => {
        const aliasName = a.alias || `${a.function.toLowerCase()}_${a.field}`;
        if (a.function === 'COUNT') groupObj[aliasName] = { $sum: 1 };
        else if (a.function === 'SUM') groupObj[aliasName] = { $sum: `$${a.field}` };
        else if (a.function === 'AVG') groupObj[aliasName] = { $avg: `$${a.field}` };
        else if (a.function === 'MIN') groupObj[aliasName] = { $min: `$${a.field}` };
        else if (a.function === 'MAX') groupObj[aliasName] = { $max: `$${a.field}` };
      });
      pipeline.push({ $group: groupObj });
    }

    // 4. $sort stage
    if (srts.length > 0) {
      const sortObj: Record<string, number> = {};
      srts.forEach(s => {
        if (s.field) sortObj[s.field] = s.direction === 'ASC' ? 1 : -1;
      });
      pipeline.push({ $sort: sortObj });
    }

    // 5. $limit stage
    if (maxRows > 0) {
      pipeline.push({ $limit: maxRows });
    }

    // 6. $project stage
    if (fields.length > 0 && aggs.length === 0) {
      const projObj: Record<string, number> = {};
      fields.forEach(f => projObj[f] = 1);
      pipeline.push({ $project: projObj });
    }

    return JSON.stringify(pipeline, null, 2);
  });

  // Native SQL Query preview generator
  generatedSqlQuery = computed(() => {
    const table = this.fromTable();
    const conds = this.conditions();
    const jns = this.joins();
    const aggs = this.aggregations();
    const srts = this.sorts();
    const fields = this.selectedFields();
    const maxRows = this.limit();

    let selectClause = '*';
    if (aggs.length > 0) {
      selectClause = aggs.map(a => `${a.function}(${a.field}) AS ${a.alias || a.function.toLowerCase() + '_' + a.field}`).join(', ');
    } else if (fields.length > 0) {
      selectClause = fields.join(', ');
    }

    let sql = `SELECT ${selectClause}\nFROM ${table}`;

    // JOINS
    jns.forEach(j => {
      if (j.targetTable && j.leftField && j.rightField) {
        sql += `\n${j.type} JOIN ${j.targetTable} ON ${table}.${j.leftField} = ${j.targetTable}.${j.rightField}`;
      }
    });

    // WHERE
    if (conds.length > 0) {
      const whereParts = conds.map(c => {
        if (!c.field) return '';
        let valStr = typeof c.value === 'string' ? `'${c.value}'` : c.value;
        if (c.operator === 'equals') return `${c.field} = ${valStr}`;
        if (c.operator === 'notEquals') return `${c.field} != ${valStr}`;
        if (c.operator === 'greaterThan') return `${c.field} > ${c.value}`;
        if (c.operator === 'lessThan') return `${c.field} < ${c.value}`;
        if (c.operator === 'contains') return `${c.field} LIKE '%${c.value}%'`;
        if (c.operator === 'isNull') return `${c.field} IS NULL`;
        if (c.operator === 'isNotNull') return `${c.field} IS NOT NULL`;
        if (c.operator === 'in') return `${c.field} IN (${c.value})`;
        return '';
      }).filter(Boolean);

      if (whereParts.length > 0) {
        sql += `\nWHERE ${whereParts.join(' AND ')}`;
      }
    }

    // ORDER BY
    if (srts.length > 0) {
      const sortParts = srts.map(s => `${s.field} ${s.direction}`);
      sql += `\nORDER BY ${sortParts.join(', ')}`;
    }

    // LIMIT
    if (maxRows > 0) {
      sql += `\nLIMIT ${maxRows}`;
    }

    return sql + ';';
  });

  async setDatabase(dbType: DatabaseType) {
    this.selectedDb.set(dbType);
    await this.loadSchemas(dbType);
  }

  async loadSchemas(dbType: DatabaseType) {
    this.isLoadingSchema.set(true);
    this.errorMsg.set(null);
    try {
      const res = await fetch(`/api/query-builder?db=${dbType}`);
      if (res.ok) {
        const result = await res.json();
        if (result.schemas && result.schemas.length > 0) {
          this.tables.set(result.schemas);
          const firstTable = result.schemas[0].name;
          this.fromTable.set(firstTable);
          this.selectedFields.set(result.schemas[0].fields.map((f: any) => f.name));
        }
      }
    } catch (err: any) {
      this.errorMsg.set('Failed to load database schema: ' + err.message);
    } finally {
      this.isLoadingSchema.set(false);
    }
  }

  onTableSelect(tableName: string) {
    this.fromTable.set(tableName);
    const schema = this.tables().find(t => t.name === tableName);
    if (schema) {
      this.selectedFields.set(schema.fields.map(f => f.name));
    } else {
      this.selectedFields.set([]);
    }
    this.conditions.set([]);
    this.joins.set([]);
    this.aggregations.set([]);
    this.sorts.set([]);
  }

  toggleFieldSelect(fieldName: string) {
    const current = this.selectedFields();
    if (current.includes(fieldName)) {
      this.selectedFields.set(current.filter(f => f !== fieldName));
    } else {
      this.selectedFields.set([...current, fieldName]);
    }
  }

  selectAllFields() {
    const schema = this.activeTableSchema();
    if (schema) {
      this.selectedFields.set(schema.fields.map(f => f.name));
    }
  }

  deselectAllFields() {
    this.selectedFields.set([]);
  }

  // Condition Management
  addCondition() {
    const schema = this.activeTableSchema();
    const defaultField = schema ? schema.fields[0]?.name || '' : '';
    const newCond: Condition = {
      id: 'cond-' + Date.now(),
      field: defaultField,
      operator: 'equals',
      value: '',
      logicalOperator: 'AND'
    };
    this.conditions.set([...this.conditions(), newCond]);
  }

  removeCondition(id: string) {
    this.conditions.set(this.conditions().filter(c => c.id !== id));
  }

  updateCondition(id: string, partial: Partial<Condition>) {
    this.conditions.set(
      this.conditions().map(c => (c.id === id ? { ...c, ...partial } : c))
    );
  }

  // Join Management
  addJoin() {
    const otherTable = this.tables().find(t => t.name !== this.fromTable());
    const newJoin: JoinCondition = {
      id: 'join-' + Date.now(),
      type: 'LEFT',
      targetTable: otherTable ? otherTable.name : '',
      leftField: '_id',
      rightField: 'userId'
    };
    this.joins.set([...this.joins(), newJoin]);
  }

  removeJoin(id: string) {
    this.joins.set(this.joins().filter(j => j.id !== id));
  }

  // Aggregation Management
  addAggregation() {
    const schema = this.activeTableSchema();
    const defaultField = schema ? schema.fields[0]?.name || '' : '';
    const newAgg: AggregationCondition = {
      id: 'agg-' + Date.now(),
      field: defaultField,
      function: 'COUNT'
    };
    this.aggregations.set([...this.aggregations(), newAgg]);
  }

  removeAggregation(id: string) {
    this.aggregations.set(this.aggregations().filter(a => a.id !== id));
  }

  // Sort Management
  addSort() {
    const schema = this.activeTableSchema();
    const defaultField = schema ? schema.fields[0]?.name || '' : '';
    const newSort: SortCondition = {
      id: 'sort-' + Date.now(),
      field: defaultField,
      direction: 'ASC'
    };
    this.sorts.set([...this.sorts(), newSort]);
  }

  removeSort(id: string) {
    this.sorts.set(this.sorts().filter(s => s.id !== id));
  }

  async executeQuery() {
    this.isExecuting.set(true);
    this.errorMsg.set(null);
    try {
      const queryState = {
        fromTable: this.fromTable(),
        selectedFields: this.selectedFields(),
        conditions: this.conditions(),
        joins: this.joins(),
        aggregations: this.aggregations(),
        sorts: this.sorts(),
        limit: this.limit()
      };

      const res = await fetch('/api/query-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'execute',
          dbType: this.selectedDb(),
          queryState
        })
      });

      if (res.ok) {
        const result = await res.json();
        this.queryResult.set({
          executionStats: result.executionStats,
          data: result.data
        });
      }
    } catch (err: any) {
      this.errorMsg.set('Execution error: ' + err.message);
    } finally {
      this.isExecuting.set(false);
    }
  }

  async saveQuery(queryName: string) {
    try {
      const queryState = {
        fromTable: this.fromTable(),
        selectedFields: this.selectedFields(),
        conditions: this.conditions(),
        joins: this.joins(),
        aggregations: this.aggregations(),
        sorts: this.sorts(),
        limit: this.limit()
      };

      const res = await fetch('/api/query-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          dbType: this.selectedDb(),
          queryName,
          queryState
        })
      });

      if (res.ok) {
        const result = await res.json();
        this.savedQueries.set([...this.savedQueries(), result.query]);
        return true;
      }
    } catch (err: any) {
      console.warn('Save query error:', err);
    }
    return false;
  }

  async addCustomSchema(newSchema: TableSchema) {
    const current = this.tables();
    const existingIdx = current.findIndex(s => s.name === newSchema.name);
    let updated: TableSchema[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = newSchema;
    } else {
      updated = [...current, newSchema];
    }

    this.tables.set(updated);
    this.onTableSelect(newSchema.name);

    // Background sync to API
    try {
      fetch('/api/query-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-schema',
          dbType: this.selectedDb(),
          newSchema
        })
      }).catch(err => console.warn('Backend schema sync warning:', err));
    } catch (e) {}

    return true;
  }

  resetCanvas() {
    const schema = this.activeTableSchema();
    if (schema) {
      this.selectedFields.set(schema.fields.map(f => f.name));
    } else {
      this.selectedFields.set([]);
    }
    this.conditions.set([]);
    this.joins.set([]);
    this.aggregations.set([]);
    this.sorts.set([]);
    this.queryResult.set(null);
  }
}
