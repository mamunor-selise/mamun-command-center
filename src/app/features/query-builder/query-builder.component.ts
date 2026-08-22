import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QueryBuilderService, DatabaseType, FieldSchema } from '../../core/services/query-builder.service';

@Component({
  selector: 'app-query-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- TOP CONTROL HEADER BANNER -->
      <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center space-x-3">
            <div class="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-cyan-500/20">
              ⚡
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Visual Multi-Database Query Builder
              </h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Drag, filter, join, and translate queries visually into native MongoDB Pipelines & SQL.
              </p>
            </div>
          </div>

          <!-- DB ENGINE SELECTION PILLS -->
          <div class="flex items-center space-x-1.5 p-1 bg-slate-100 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
            <button
              (click)="qbService.setDatabase('mongodb')"
              [class]="qbService.selectedDb() === 'mongodb' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'"
              class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>🍃</span>
              <span>MongoDB</span>
            </button>

            <button
              (click)="qbService.setDatabase('postgresql')"
              [class]="qbService.selectedDb() === 'postgresql' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'"
              class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>🐘</span>
              <span>PostgreSQL</span>
            </button>

            <button
              (click)="qbService.setDatabase('mysql')"
              [class]="qbService.selectedDb() === 'mysql' ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'"
              class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>🐬</span>
              <span>MySQL</span>
            </button>

            <button
              (click)="qbService.setDatabase('sqlite')"
              [class]="qbService.selectedDb() === 'sqlite' ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'"
              class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>📦</span>
              <span>SQLite</span>
            </button>
          </div>
        </div>

        <!-- ACTION CONTROLS BAR -->
        <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center space-x-2">
            <button
              (click)="qbService.executeQuery()"
              [disabled]="qbService.isExecuting()"
              class="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <span [class.animate-spin]="qbService.isExecuting()">⚡</span>
              <span>{{ qbService.isExecuting() ? 'Executing...' : 'Run Query' }}</span>
            </button>

            <button
              (click)="qbService.resetCanvas()"
              class="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
            >
              <span>🔄 Reset</span>
            </button>

            <button
              (click)="showSaveModal.set(true)"
              class="px-3 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
            >
              <span>💾 Save Query</span>
            </button>
          </div>

          <!-- Active Output Mode Selector -->
          <div class="flex items-center space-x-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              (click)="activeTab.set('preview')"
              [class]="activeTab() === 'preview' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400'"
              class="px-3 py-1 font-semibold rounded-lg transition-colors cursor-pointer"
            >
              💻 Native Code
            </button>

            <button
              (click)="activeTab.set('results')"
              [class]="activeTab() === 'results' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400'"
              class="px-3 py-1 font-semibold rounded-lg transition-colors cursor-pointer"
            >
              📊 Results Data
            </button>
          </div>
        </div>
      </div>

      <!-- MAIN WORKSPACE: 3-COLUMN GRID LAYOUT -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- COLUMN 1: SCHEMA & COLLECTION EXPLORER (3 cols) -->
        <div class="lg:col-span-3 space-y-4">
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                <span>🗄️</span>
                <span>Schema Explorer</span>
              </h3>
              <div class="flex items-center space-x-1">
                <button
                  (click)="showSchemaModal.set(true)"
                  class="px-1.5 py-0.5 text-[9px] font-bold rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/25 transition-all flex items-center space-x-0.5 cursor-pointer"
                  title="Create custom table/collection schema"
                >
                  <span>➕ Add Model</span>
                </button>
                <span class="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {{ qbService.selectedDb() }}
                </span>
              </div>
            </div>

            <!-- Table List -->
            <div class="space-y-1">
              <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Select Source Table / Collection
              </span>

              @for (tbl of qbService.tables(); track tbl.name) {
                <button
                  (click)="qbService.onTableSelect(tbl.name)"
                  [class]="qbService.fromTable() === tbl.name ? 'bg-indigo-600 text-white font-semibold' : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'"
                  class="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-between cursor-pointer group"
                >
                  <span class="truncate flex items-center space-x-2">
                    <span>{{ tbl.type === 'collection' ? '🍃' : '📋' }}</span>
                    <span>{{ tbl.displayName }}</span>
                  </span>
                  <span class="text-[10px] opacity-70">({{ tbl.fields.length }})</span>
                </button>
              }
            </div>

            <!-- Active Table Fields Inspection -->
            @if (qbService.activeTableSchema(); as schema) {
              <div class="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Fields in {{ schema.name }}
                </span>

                <div class="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  @for (field of schema.fields; track field.name) {
                    <div
                      (click)="qbService.toggleFieldSelect(field.name)"
                      [class]="qbService.selectedFields().includes(field.name) ? 'bg-indigo-500/10 border-indigo-500/30' : 'border-slate-100 dark:border-slate-800'"
                      class="px-2.5 py-1.5 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between text-xs cursor-pointer select-none"
                    >
                      <div class="flex items-center space-x-2 truncate">
                        <input
                          type="checkbox"
                          [checked]="qbService.selectedFields().includes(field.name)"
                          class="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span class="font-medium text-slate-800 dark:text-slate-200 truncate">{{ field.name }}</span>
                      </div>

                      <div class="flex items-center space-x-1 flex-shrink-0">
                        @if (field.isPrimaryKey) {
                          <span class="text-[8px] font-bold px-1 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">PK</span>
                        }
                        @if (field.isForeignKey) {
                          <span class="text-[8px] font-bold px-1 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400">FK</span>
                        }
                        <span class="text-[9px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                          {{ field.type }}
                        </span>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>

        <!-- COLUMN 2: VISUAL QUERY CANVAS & CONTROLS (6 cols) -->
        <div class="lg:col-span-5 space-y-6">

          <!-- SECTION 1: FIELD SELECTION ($project / SELECT) -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <div class="flex items-center space-x-2">
                <span class="text-sm">📌</span>
                <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Select Output Fields ({{ qbService.selectedFields().length }})
                </h4>
              </div>

              <div class="flex items-center space-x-2">
                <button (click)="qbService.selectAllFields()" class="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Select All
                </button>
                <span class="text-slate-300 dark:text-slate-700">|</span>
                <button (click)="qbService.deselectAllFields()" class="text-[10px] font-semibold text-slate-500 hover:underline">
                  Clear
                </button>
              </div>
            </div>

            <div class="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto custom-scrollbar">
              @for (field of qbService.selectedFields(); track field) {
                <span
                  (click)="qbService.toggleFieldSelect(field)"
                  class="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 cursor-pointer hover:bg-indigo-500/25 transition-all"
                >
                  <span>{{ field }}</span>
                  <span class="text-indigo-500 font-bold hover:text-red-500">✕</span>
                </span>
              } @empty {
                <span class="text-xs text-slate-400 italic">No fields selected (Will output ALL fields '*')</span>
              }
            </div>
          </div>

          <!-- SECTION 2: FILTER CONDITIONS ($match / WHERE) -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <div class="flex items-center space-x-2">
                <span class="text-sm">🔍</span>
                <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Filter Conditions (WHERE / $match)
                </h4>
              </div>

              <button
                (click)="qbService.addCondition()"
                class="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all flex items-center space-x-1 cursor-pointer"
              >
                <span>➕ Add Filter</span>
              </button>
            </div>

            <div class="space-y-2">
              @for (cond of qbService.conditions(); track cond.id) {
                <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
                  <!-- Field -->
                  <select
                    [ngModel]="cond.field"
                    (ngModelChange)="qbService.updateCondition(cond.id, { field: $event })"
                    class="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none text-xs font-medium"
                  >
                    @for (f of activeFields; track f.name) {
                      <option [value]="f.name">{{ f.name }}</option>
                    }
                  </select>

                  <!-- Operator -->
                  <select
                    [ngModel]="cond.operator"
                    (ngModelChange)="qbService.updateCondition(cond.id, { operator: $event })"
                    class="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none text-xs font-medium"
                  >
                    <option value="equals">=</option>
                    <option value="notEquals">!=</option>
                    <option value="greaterThan">&gt;</option>
                    <option value="lessThan">&lt;</option>
                    <option value="contains">CONTAINS</option>
                    <option value="in">IN (list)</option>
                    <option value="isNull">IS NULL</option>
                    <option value="isNotNull">IS NOT NULL</option>
                  </select>

                  <!-- Value Input -->
                  @if (cond.operator !== 'isNull' && cond.operator !== 'isNotNull') {
                    <input
                      type="text"
                      [ngModel]="cond.value"
                      (ngModelChange)="qbService.updateCondition(cond.id, { value: $event })"
                      placeholder="Value..."
                      class="flex-1 min-w-0 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-xs"
                    />
                  }

                  <!-- Delete -->
                  <button
                    (click)="qbService.removeCondition(cond.id)"
                    class="text-slate-400 hover:text-red-500 font-bold p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              } @empty {
                <div class="py-4 text-center text-slate-400 text-xs italic">
                  No filters applied. Click "+ Add Filter" to filter rows.
                </div>
              }
            </div>
          </div>

          <!-- SECTION 3: TABLE JOINS ($lookup / JOIN) -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <div class="flex items-center space-x-2">
                <span class="text-sm">🔗</span>
                <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Table Joins ($lookup / JOIN)
                </h4>
              </div>

              <button
                (click)="qbService.addJoin()"
                class="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all flex items-center space-x-1 cursor-pointer"
              >
                <span>➕ Add Join</span>
              </button>
            </div>

            <div class="space-y-2">
              @for (j of qbService.joins(); track j.id) {
                <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
                  <span class="text-[10px] font-bold text-purple-600 dark:text-purple-400">LEFT JOIN</span>

                  <select
                    [(ngModel)]="j.targetTable"
                    class="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  >
                    @for (tbl of qbService.tables(); track tbl.name) {
                      <option [value]="tbl.name">{{ tbl.name }}</option>
                    }
                  </select>

                  <span class="text-slate-400 text-[10px]">ON</span>

                  <input
                    type="text"
                    [(ngModel)]="j.leftField"
                    placeholder="Local field (_id)"
                    class="w-24 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  />

                  <span class="text-slate-400 text-[10px]">=</span>

                  <input
                    type="text"
                    [(ngModel)]="j.rightField"
                    placeholder="Foreign field (userId)"
                    class="w-24 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  />

                  <button (click)="qbService.removeJoin(j.id)" class="text-slate-400 hover:text-red-500 font-bold p-1 cursor-pointer">✕</button>
                </div>
              } @empty {
                <div class="py-3 text-center text-slate-400 text-xs italic">
                  No table joins configured.
                </div>
              }
            </div>
          </div>

          <!-- SECTION 4: AGGREGATIONS & GROUPING ($group / GROUP BY) -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <div class="flex items-center space-x-2">
                <span class="text-sm">📐</span>
                <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Aggregations & Functions (GROUP BY)
                </h4>
              </div>

              <button
                (click)="qbService.addAggregation()"
                class="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all flex items-center space-x-1 cursor-pointer"
              >
                <span>➕ Add Aggregation</span>
              </button>
            </div>

            <div class="space-y-2">
              @for (agg of qbService.aggregations(); track agg.id) {
                <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
                  <select
                    [(ngModel)]="agg.function"
                    class="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold"
                  >
                    <option value="COUNT">COUNT</option>
                    <option value="SUM">SUM</option>
                    <option value="AVG">AVG</option>
                    <option value="MIN">MIN</option>
                    <option value="MAX">MAX</option>
                  </select>

                  <select
                    [(ngModel)]="agg.field"
                    class="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  >
                    @for (f of activeFields; track f.name) {
                      <option [value]="f.name">{{ f.name }}</option>
                    }
                  </select>

                  <input
                    type="text"
                    [(ngModel)]="agg.alias"
                    placeholder="Alias name..."
                    class="flex-1 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  />

                  <button (click)="qbService.removeAggregation(agg.id)" class="text-slate-400 hover:text-red-500 font-bold p-1 cursor-pointer">✕</button>
                </div>
              } @empty {
                <div class="py-3 text-center text-slate-400 text-xs italic">
                  No aggregations applied.
                </div>
              }
            </div>
          </div>

          <!-- SECTION 5: SORTING & ROW LIMIT ($sort / ORDER BY / LIMIT) -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <div class="flex items-center space-x-2">
                <span class="text-sm">🔀</span>
                <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Sorting & Row Limit (ORDER BY / LIMIT)
                </h4>
              </div>

              <div class="flex items-center space-x-2">
                <span class="text-xs text-slate-500 font-semibold">Limit Rows:</span>
                <input
                  type="number"
                  [ngModel]="qbService.limit()"
                  (ngModelChange)="qbService.limit.set($event)"
                  min="1"
                  max="1000"
                  class="w-16 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold text-center"
                />
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-semibold text-slate-400 uppercase">Sort Order</span>
                <button
                  (click)="qbService.addSort()"
                  class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  + Add Sort Rule
                </button>
              </div>

              @for (srt of qbService.sorts(); track srt.id) {
                <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
                  <select
                    [(ngModel)]="srt.field"
                    class="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  >
                    @for (f of activeFields; track f.name) {
                      <option [value]="f.name">{{ f.name }}</option>
                    }
                  </select>

                  <select
                    [(ngModel)]="srt.direction"
                    class="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold"
                  >
                    <option value="ASC">ASC (Ascending)</option>
                    <option value="DESC">DESC (Descending)</option>
                  </select>

                  <button (click)="qbService.removeSort(srt.id)" class="text-slate-400 hover:text-red-500 font-bold p-1 cursor-pointer">✕</button>
                </div>
              }
            </div>
          </div>

        </div>

        <!-- COLUMN 3: LIVE PREVIEW & RESULTS EXECUTION OUTPUT (4 cols) -->
        <div class="lg:col-span-4 space-y-4">

          @if (activeTab() === 'preview') {
            <!-- NATIVE CODE PREVIEW TAB -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div class="flex items-center space-x-2">
                  <span class="text-base">{{ qbService.selectedDb() === 'mongodb' ? '🍃' : '🐘' }}</span>
                  <div>
                    <h3 class="text-xs font-bold text-white uppercase tracking-wider">
                      Translated Native Code
                    </h3>
                    <span class="text-[10px] text-slate-400">
                      {{ qbService.selectedDb() === 'mongodb' ? 'MongoDB Aggregation Pipeline' : 'ANSI SQL Statement' }}
                    </span>
                  </div>
                </div>

                <button
                  (click)="copyCodeToClipboard()"
                  class="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer flex items-center space-x-1"
                >
                  <span>{{ copySuccess() ? '✓ Copied' : '📋 Copy' }}</span>
                </button>
              </div>

              <div class="relative">
                <pre class="text-xs font-mono bg-slate-950 p-4 rounded-xl text-emerald-400 overflow-x-auto max-h-[500px] border border-slate-800/80 custom-scrollbar whitespace-pre-wrap leading-relaxed">
                  {{ qbService.selectedDb() === 'mongodb' ? qbService.generatedMongoPipeline() : qbService.generatedSqlQuery() }}
                </pre>
              </div>

              <div class="pt-2 flex justify-between items-center text-[10px] text-slate-500">
                <span>Real-time AST generator active</span>
                <button (click)="downloadCode()" class="text-indigo-400 hover:underline cursor-pointer">
                  📥 Download File
                </button>
              </div>
            </div>
          }

          @if (activeTab() === 'results') {
            <!-- RESULTS DATA TAB -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
              <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h3 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                    <span>📊</span>
                    <span>Query Results</span>
                  </h3>
                  @if (qbService.queryResult(); as res) {
                    <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      Executed in {{ res.executionStats.executionTimeMs }}ms ({{ res.executionStats.rowsReturned }} rows)
                    </span>
                  }
                </div>

                <button
                  (click)="qbService.executeQuery()"
                  class="px-2 py-1 text-[10px] font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                >
                  🔄 Refresh
                </button>
              </div>

              @if (qbService.queryResult(); as res) {
                <div class="max-h-[480px] overflow-auto border border-slate-100 dark:border-slate-800 rounded-xl custom-scrollbar">
                  <table class="w-full text-left text-xs">
                    <thead class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold sticky top-0">
                      <tr>
                        @for (key of getResultKeys(res.data); track key) {
                          <th class="p-2.5 border-b border-slate-200 dark:border-slate-700 font-mono text-[11px] whitespace-nowrap">
                            {{ key }}
                          </th>
                        }
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                      @for (row of res.data; track $index) {
                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          @for (key of getResultKeys(res.data); track key) {
                            <td class="p-2.5 text-slate-700 dark:text-slate-300 font-mono text-[11px] truncate max-w-[150px]">
                              {{ formatCellValue(row[key]) }}
                            </td>
                          }
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              } @else {
                <div class="py-12 text-center text-slate-400 space-y-2">
                  <div class="text-3xl">⚡</div>
                  <p class="text-xs font-medium">No results loaded yet.</p>
                  <button
                    (click)="qbService.executeQuery()"
                    class="px-3 py-1.5 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer shadow-sm"
                  >
                    Run Query Now
                  </button>
                </div>
              }
            </div>
          }

        </div>
      </div>
    </div>

    <!-- SAVE QUERY MODAL -->
    @if (showSaveModal()) {
      <div class="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white dark:bg-slate-900 border border-indigo-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h4 class="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <span>💾</span>
              <span>Save Visual Query</span>
            </h4>
            <button (click)="showSaveModal.set(false)" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">✕</button>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Query Name</label>
            <input
              type="text"
              [(ngModel)]="queryName"
              placeholder="e.g. Completed Routine Tasks Filter"
              class="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div class="pt-2 flex justify-end space-x-2">
            <button
              (click)="showSaveModal.set(false)"
              class="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              (click)="confirmSaveQuery()"
              class="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md"
            >
              Save to Catalog
            </button>
          </div>
        </div>
      </div>
    }

    <!-- DEFINE CUSTOM DATA MODEL MODAL -->
    @if (showSchemaModal()) {
      <div class="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white dark:bg-slate-900 border border-indigo-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h4 class="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <span>➕</span>
              <span>Define Custom Data Model ({{ qbService.selectedDb() }})</span>
            </h4>
            <button (click)="showSchemaModal.set(false)" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">✕</button>
          </div>

          <!-- MODE SELECTOR TABS -->
          <div class="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              (click)="schemaInputMode.set('fields')"
              [class]="schemaInputMode() === 'fields' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400'"
              class="flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer"
            >
              📝 Field Builder
            </button>

            <button
              (click)="schemaInputMode.set('json')"
              [class]="schemaInputMode() === 'json' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400'"
              class="flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer"
            >
              📋 Import Raw JSON / Schema
            </button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Table / Collection Name
              </label>
              <input
                type="text"
                [(ngModel)]="newSchemaName"
                placeholder="e.g. customers, products, analytics_logs"
                class="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            @if (schemaInputMode() === 'fields') {
              <!-- Field Definitions -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Field Schema Definitions ({{ newSchemaFields.length }})
                  </label>
                  <button
                    (click)="addNewSchemaField()"
                    class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    + Add Field
                  </button>
                </div>

                <div class="max-h-48 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                  @for (f of newSchemaFields; track $index) {
                    <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
                      <input
                        type="text"
                        [(ngModel)]="f.name"
                        placeholder="Field name..."
                        class="flex-1 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono"
                      />

                      <select
                        [(ngModel)]="f.type"
                        class="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                      >
                        <option value="string">string</option>
                        <option value="number">number</option>
                        <option value="integer">integer</option>
                        <option value="boolean">boolean</option>
                        <option value="date">date</option>
                        <option value="objectId">objectId</option>
                        <option value="decimal">decimal</option>
                        <option value="json">json</option>
                      </select>

                      <button
                        (click)="removeNewSchemaField($index)"
                        class="text-slate-400 hover:text-red-500 font-bold p-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  }
                </div>
              </div>
            } @else {
              <!-- Raw JSON Importer Tab -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Paste Raw JSON Document or JSON Schema
                  </label>
                  <span class="text-[10px] text-slate-400">Auto-Detect Types</span>
                </div>

                <textarea
                  [(ngModel)]="rawJsonInput"
                  rows="6"
                  placeholder='Paste JSON sample data or JSON schema here... e.g.&#10;{&#10;  "id": "usr-101",&#10;  "name": "Alex Mercer",&#10;  "balance": 1450.50,&#10;  "isVerified": true,&#10;  "created_at": "2026-08-22"&#10;}'
                  class="w-full p-3 text-xs font-mono rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 focus:outline-none focus:border-indigo-500 custom-scrollbar leading-relaxed"
                ></textarea>

                @if (jsonParseError()) {
                  <p class="text-xs font-semibold text-red-500 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                    ⚠️ {{ jsonParseError() }}
                  </p>
                }

                @if (jsonParseSuccess()) {
                  <p class="text-xs font-semibold text-emerald-500 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                    ✓ {{ jsonParseSuccess() }}
                  </p>
                }

                <button
                  (click)="parseJsonSchema()"
                  class="w-full py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>⚡</span>
                  <span>Auto-Detect & Infer Schema from JSON</span>
                </button>
              </div>
            }
          </div>

          <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
            <button
              (click)="showSchemaModal.set(false)"
              class="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              (click)="confirmCreateSchema()"
              class="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md"
            >
              Create & Query Data Model
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class QueryBuilderComponent {
  qbService = inject(QueryBuilderService);

  activeTab = signal<'preview' | 'results'>('preview');
  showSaveModal = signal<boolean>(false);
  showSchemaModal = signal<boolean>(false);
  copySuccess = signal<boolean>(false);
  queryName = '';

  schemaInputMode = signal<'fields' | 'json'>('fields');
  rawJsonInput = '';
  jsonParseError = signal<string | null>(null);
  jsonParseSuccess = signal<string | null>(null);

  newSchemaName = '';
  newSchemaFields = [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'created_at', type: 'date' }
  ];

  addNewSchemaField() {
    this.newSchemaFields.push({ name: '', type: 'string' });
  }

  removeNewSchemaField(index: number) {
    if (this.newSchemaFields.length > 1) {
      this.newSchemaFields.splice(index, 1);
    }
  }

  parseJsonSchema() {
    this.jsonParseError.set(null);
    this.jsonParseSuccess.set(null);

    if (!this.rawJsonInput || !this.rawJsonInput.trim()) {
      this.jsonParseError.set('Please paste a valid JSON document or JSON schema.');
      return;
    }

    try {
      let parsed = JSON.parse(this.rawJsonInput.trim());

      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          this.jsonParseError.set('JSON array is empty.');
          return;
        }
        parsed = parsed[0];
      }

      const inferredFields: { name: string; type: string }[] = [];

      if (parsed.properties && typeof parsed.properties === 'object') {
        if (parsed.title && !this.newSchemaName) {
          this.newSchemaName = String(parsed.title);
        }
        for (const [key, propObj] of Object.entries<any>(parsed.properties)) {
          const typeStr = propObj?.type || 'string';
          let inferredType = 'string';
          if (typeStr === 'integer' || typeStr === 'number') inferredType = 'number';
          else if (typeStr === 'boolean') inferredType = 'boolean';
          else if (typeStr === 'array' || typeStr === 'object') inferredType = 'json';
          inferredFields.push({ name: key, type: inferredType });
        }
      } else if (typeof parsed === 'object' && parsed !== null) {
        for (const [key, val] of Object.entries(parsed)) {
          let inferredType = 'string';
          if (typeof val === 'number') {
            inferredType = Number.isInteger(val) ? 'integer' : 'decimal';
          } else if (typeof val === 'boolean') {
            inferredType = 'boolean';
          } else if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
            inferredType = 'json';
          } else if (typeof val === 'string') {
            if (key === '_id' || (key.toLowerCase().includes('id') && val.length === 24)) {
              inferredType = 'objectId';
            } else if (!isNaN(Date.parse(val)) && (val.includes('-') || val.includes('T'))) {
              inferredType = 'date';
            } else {
              inferredType = 'string';
            }
          }
          inferredFields.push({ name: key, type: inferredType });
        }
      }

      if (inferredFields.length > 0) {
        this.newSchemaFields = inferredFields;
        this.jsonParseSuccess.set(`Successfully inferred ${inferredFields.length} fields from JSON! Switched to Field Builder.`);
        setTimeout(() => this.schemaInputMode.set('fields'), 700);
      } else {
        this.jsonParseError.set('No valid fields could be extracted from the JSON.');
      }
    } catch (err: any) {
      this.jsonParseError.set('Invalid JSON syntax: ' + err.message);
    }
  }

  async confirmCreateSchema() {
    // If user pasted raw JSON in raw mode without hitting auto-detect button, run parseJsonSchema first
    if (this.schemaInputMode() === 'json' && this.rawJsonInput && this.rawJsonInput.trim()) {
      this.parseJsonSchema();
    }

    let targetName = this.newSchemaName ? this.newSchemaName.trim() : '';
    if (!targetName) {
      targetName = 'custom_model_' + Math.floor(Math.random() * 899 + 100);
    }

    let cleanFields = this.newSchemaFields
      .filter(f => f.name && f.name.trim().length > 0)
      .map(f => ({ name: f.name.trim(), type: f.type, nullable: true }));

    if (cleanFields.length === 0) {
      cleanFields = [
        { name: '_id', type: 'objectId', nullable: false },
        { name: 'name', type: 'string', nullable: true },
        { name: 'created_at', type: 'date', nullable: true }
      ];
    }

    const isMongo = this.qbService.selectedDb() === 'mongodb';
    const newSchema = {
      name: targetName.toLowerCase().replace(/\s+/g, '_'),
      displayName: targetName,
      type: (isMongo ? 'collection' : 'table') as 'collection' | 'table',
      fields: cleanFields
    };

    await this.qbService.addCustomSchema(newSchema);

    // Close modal & reset form
    this.showSchemaModal.set(false);
    this.newSchemaName = '';
    this.rawJsonInput = '';
    this.jsonParseError.set(null);
    this.jsonParseSuccess.set(null);
    this.newSchemaFields = [
      { name: 'id', type: 'string' },
      { name: 'name', type: 'string' },
      { name: 'created_at', type: 'date' }
    ];
  }

  get activeFields(): FieldSchema[] {
    return this.qbService.activeTableSchema()?.fields || [];
  }

  getResultKeys(data: Record<string, any>[]): string[] {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }

  formatCellValue(val: any): string {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  }

  copyCodeToClipboard() {
    const code = this.qbService.selectedDb() === 'mongodb'
      ? this.qbService.generatedMongoPipeline()
      : this.qbService.generatedSqlQuery();

    navigator.clipboard.writeText(code);
    this.copySuccess.set(true);
    setTimeout(() => this.copySuccess.set(false), 2000);
  }

  downloadCode() {
    const isMongo = this.qbService.selectedDb() === 'mongodb';
    const code = isMongo ? this.qbService.generatedMongoPipeline() : this.qbService.generatedSqlQuery();
    const ext = isMongo ? 'json' : 'sql';
    const filename = `query-${this.qbService.fromTable()}.${ext}`;

    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async confirmSaveQuery() {
    if (!this.queryName) return;
    const ok = await this.qbService.saveQuery(this.queryName);
    if (ok) {
      this.showSaveModal.set(false);
      this.queryName = '';
    }
  }
}
