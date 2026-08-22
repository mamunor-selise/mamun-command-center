import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiTrendsService, AiBuzzword, TrendingAiTool, StoreAiTool } from '../../../../core/services/ai-trends.service';

@Component({
  selector: 'app-ai-trends-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header banner with OpenRouter AI badge & controls -->
      <div class="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-900/30 to-slate-900/50 border border-purple-500/20 dark:border-purple-500/30 backdrop-blur-md shadow-xs">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center space-x-2.5">
            <div class="h-9 w-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-lg font-bold border border-purple-500/30">
              🤖
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white tracking-tight">AI Tools Pulse</h3>
              <span class="text-[10px] text-purple-600 dark:text-purple-300 font-semibold">
                Powered by OpenRouter API
              </span>
            </div>
          </div>

          <button
            (click)="aiTrendsService.refreshViaOpenRouter()"
            [disabled]="aiTrendsService.isRefreshingOpenRouter()"
            class="px-3 py-1.5 text-xs font-semibold rounded-xl text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
            title="Refresh trends from OpenRouter"
          >
            <span [class.animate-spin]="aiTrendsService.isRefreshingOpenRouter()">🔄</span>
            <span class="hidden sm:inline">{{ aiTrendsService.isRefreshingOpenRouter() ? 'Refreshing...' : 'AI Refresh' }}</span>
          </button>
        </div>
      </div>

      @if (aiTrendsService.errorMsg()) {
        <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center justify-between">
          <span>⚠️ {{ aiTrendsService.errorMsg() }}</span>
          <button (click)="aiTrendsService.errorMsg.set(null)" class="text-amber-500 hover:text-amber-700 font-bold ml-2">✕</button>
        </div>
      }

      <!-- THREE VERTICAL SECTIONS CONTAINER (Top Card = Buzzword this week) -->
      <div class="flex flex-col space-y-6">
        
        <!-- CARD 1 (TOP CARD): 🔥 BUZZWORD THIS WEEK -->
        <div class="bg-white dark:bg-slate-800/60 border border-purple-500/30 dark:border-purple-500/40 rounded-2xl p-4 shadow-sm dark:shadow-none transition-all">
          <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/60">
            <div class="flex items-center space-x-2">
              <div class="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-base font-bold">
                🔥
              </div>
              <div>
                <div class="flex items-center space-x-1.5">
                  <h3 class="text-xs font-bold text-slate-900 dark:text-white">Buzzword this Week</h3>
                  <span class="px-1.5 py-0.5 text-[8px] font-extrabold uppercase rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    TOP CARD
                  </span>
                </div>
                <p class="text-[10px] text-slate-500 dark:text-slate-400">Click item for full details</p>
              </div>
            </div>
            <span class="text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
              {{ aiTrendsService.buzzwords().length }} Trends
            </span>
          </div>

          <!-- Buzzword Scrollable Clean List -->
          <div class="mt-2 max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50 custom-scrollbar">
            @for (bw of aiTrendsService.buzzwords(); track bw.id) {
              <div
                (click)="selectedBuzzword.set(bw)"
                class="group py-2.5 px-2 hover:bg-purple-500/10 rounded-lg transition-colors cursor-pointer flex items-center justify-between"
              >
                <div class="flex items-center space-x-2.5 overflow-hidden">
                  <span class="text-xs font-bold text-amber-500 flex-shrink-0">🔥</span>
                  <div class="truncate">
                    <h4 class="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                      {{ bw.title }}
                    </h4>
                    <p class="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {{ bw.category }} • "{{ bw.tagline }}"
                    </p>
                  </div>
                </div>

                <div class="flex items-center space-x-1.5 flex-shrink-0 ml-2">
                  <span class="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    📈 {{ bw.trendScore }}
                  </span>
                  <span class="text-xs text-purple-600 dark:text-purple-400 font-bold">→</span>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- CARD 2: ⚡ TRENDING AI TOOLS -->
        <div class="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 shadow-sm dark:shadow-none transition-all">
          <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/60">
            <div class="flex items-center space-x-2">
              <div class="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-base font-bold">
                ⚡
              </div>
              <div>
                <h3 class="text-xs font-bold text-slate-900 dark:text-white">Trending AI Tools</h3>
                <p class="text-[10px] text-slate-500 dark:text-slate-400">Click item to view & launch ↗</p>
              </div>
            </div>
            <span class="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
              {{ aiTrendsService.trendingTools().length }} Tools
            </span>
          </div>

          <!-- Tools Scrollable Clean List -->
          <div class="mt-2 max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50 custom-scrollbar">
            @for (tool of aiTrendsService.trendingTools(); track tool.id) {
              <div
                (click)="selectedTrendingTool.set(tool)"
                class="group py-2.5 px-2 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer flex items-center justify-between"
              >
                <div class="flex items-center space-x-2.5 overflow-hidden">
                  <span class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 w-5 flex-shrink-0 text-center">#{{ tool.trendingRank }}</span>
                  <span class="text-base flex-shrink-0">{{ tool.icon }}</span>
                  <div class="truncate">
                    <h4 class="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {{ tool.name }}
                    </h4>
                    <span class="text-[10px] text-slate-500 dark:text-slate-400">
                      {{ tool.category }} • ⭐ {{ tool.rating }}
                    </span>
                  </div>
                </div>

                <div class="flex items-center space-x-2 flex-shrink-0 ml-2">
                  <span class="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {{ tool.pricing }}
                  </span>
                  <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400">↗</span>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- CARD 3: 🛍️ AI TOOLS STORE -->
        <div class="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 shadow-sm dark:shadow-none transition-all">
          <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/60">
            <div class="flex items-center space-x-2">
              <div class="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-base font-bold">
                🛍️
              </div>
              <div>
                <h3 class="text-xs font-bold text-slate-900 dark:text-white">AI Tools Store</h3>
                <p class="text-[10px] text-slate-500 dark:text-slate-400">Curated directory</p>
              </div>
            </div>

            <button
              (click)="showAddModal.set(true)"
              class="px-2 py-1 text-[10px] font-semibold rounded-lg text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all flex items-center space-x-1 cursor-pointer"
            >
              <span>➕</span>
              <span>Submit</span>
            </button>
          </div>

          <!-- Search & Filter Controls -->
          <div class="mt-3 space-y-2">
            <div class="relative w-full">
              <input
                type="text"
                [ngModel]="aiTrendsService.searchQuery()"
                (ngModelChange)="aiTrendsService.searchQuery.set($event)"
                placeholder="Search store..."
                class="w-full pl-7 pr-3 py-1 text-xs rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <span class="absolute left-2.5 top-1.5 text-xs text-slate-400">🔍</span>
            </div>

            <!-- Category Pills -->
            <div class="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none">
              @for (cat of aiTrendsService.categories(); track cat) {
                <button
                  (click)="aiTrendsService.selectedCategory.set(cat)"
                  [class.bg-emerald-600]="aiTrendsService.selectedCategory() === cat"
                  [class.text-white]="aiTrendsService.selectedCategory() === cat"
                  [class.bg-slate-100]="aiTrendsService.selectedCategory() !== cat"
                  [class.dark:bg-slate-800]="aiTrendsService.selectedCategory() !== cat"
                  [class.text-slate-700]="aiTrendsService.selectedCategory() !== cat"
                  [class.dark:text-slate-300]="aiTrendsService.selectedCategory() !== cat"
                  class="px-2 py-0.5 text-[10px] font-medium rounded transition-colors whitespace-nowrap cursor-pointer"
                >
                  {{ cat }}
                </button>
              }
            </div>
          </div>

          <!-- Store Scrollable Clean List -->
          <div class="mt-2 max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50 custom-scrollbar">
            @for (tool of aiTrendsService.filteredStoreTools(); track tool.id) {
              <div
                (click)="selectedStoreTool.set(tool)"
                class="group py-2 px-2 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer flex items-center justify-between"
              >
                <div class="flex items-center space-x-2.5 overflow-hidden">
                  <span class="text-base flex-shrink-0">{{ tool.icon }}</span>
                  <div class="truncate">
                    <h4 class="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {{ tool.name }}
                    </h4>
                    <span class="text-[10px] text-slate-500 dark:text-slate-400">
                      {{ tool.category }} • ⭐ {{ tool.rating }}
                    </span>
                  </div>
                </div>

                <div class="flex items-center space-x-2 flex-shrink-0 ml-2">
                  <span class="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {{ tool.pricing }}
                  </span>
                  <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">↗</span>
                </div>
              </div>
            } @empty {
              <div class="py-6 text-center text-slate-500 dark:text-slate-400 text-xs">
                No tools match your search.
              </div>
            }
          </div>
        </div>

      </div>
    </div>

    <!-- MODAL 1: BUZZWORD DETAILS MODAL -->
    @if (selectedBuzzword(); as bw) {
      <div class="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white dark:bg-slate-900 border border-purple-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
          <div class="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 text-[10px] font-semibold rounded bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                  {{ bw.category }}
                </span>
                <span class="text-xs font-bold text-amber-600 dark:text-amber-400">
                  📈 {{ bw.trendScore }} score
                </span>
              </div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mt-1.5">
                🔥 {{ bw.title }}
              </h3>
            </div>
            <button (click)="selectedBuzzword.set(null)" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold cursor-pointer">✕</button>
          </div>

          <div class="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <p class="font-medium text-purple-600 dark:text-purple-300 italic text-sm">
              "{{ bw.tagline }}"
            </p>

            <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
              <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide">Description</h4>
              <p class="text-slate-700 dark:text-slate-300">{{ bw.description }}</p>
            </div>

            @if (bw.whyItMatters) {
              <div class="bg-purple-500/10 p-3.5 rounded-xl border border-purple-500/20">
                <strong class="text-purple-600 dark:text-purple-400 font-bold block mb-0.5">Why it matters:</strong>
                <p class="text-slate-800 dark:text-slate-200">{{ bw.whyItMatters }}</p>
              </div>
            }

            @if (bw.keyTakeaway) {
              <div class="bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/20">
                <strong class="text-amber-600 dark:text-amber-400 font-bold block mb-0.5">Key takeaway:</strong>
                <p class="text-slate-800 dark:text-slate-200">{{ bw.keyTakeaway }}</p>
              </div>
            }
          </div>

          <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              (click)="selectedBuzzword.set(null)"
              class="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-md cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    }

    <!-- MODAL 2: TRENDING TOOL DETAILS MODAL -->
    @if (selectedTrendingTool(); as tool) {
      <div class="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white dark:bg-slate-900 border border-indigo-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
          <div class="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div class="flex items-center space-x-3">
              <span class="text-3xl">{{ tool.icon }}</span>
              <div>
                <span class="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  #{{ tool.trendingRank }} Trending Tool
                </span>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">
                  {{ tool.name }}
                </h3>
              </div>
            </div>
            <button (click)="selectedTrendingTool.set(null)" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold cursor-pointer">✕</button>
          </div>

          <div class="space-y-3 text-xs">
            <div class="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Category: <strong>{{ tool.category }}</strong></span>
              <span>Rating: <strong>⭐ {{ tool.rating }}</strong></span>
              <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold">{{ tool.pricing }}</span>
            </div>

            <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <h4 class="font-bold text-slate-900 dark:text-white text-xs mb-1">About Tool</h4>
              <p class="text-slate-700 dark:text-slate-300 leading-relaxed">{{ tool.description }}</p>
            </div>

            <div class="flex flex-wrap gap-1.5 pt-1">
              @for (tag of tool.tags; track tag) {
                <span class="px-2.5 py-1 text-[10px] rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 font-medium">
                  #{{ tag }}
                </span>
              }
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              (click)="selectedTrendingTool.set(null)"
              class="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              Close
            </button>

            <button
              (click)="aiTrendsService.openToolInNewTab(tool.url)"
              class="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Open Tool Website</span>
              <span>↗</span>
            </button>
          </div>
        </div>
      </div>
    }

    <!-- MODAL 3: STORE TOOL DETAILS MODAL -->
    @if (selectedStoreTool(); as tool) {
      <div class="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
          <div class="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div class="flex items-center space-x-3">
              <span class="text-3xl">{{ tool.icon }}</span>
              <div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">
                  {{ tool.name }}
                </h3>
                <span class="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                  {{ tool.category }} Store Directory
                </span>
              </div>
            </div>
            <button (click)="selectedStoreTool.set(null)" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold cursor-pointer">✕</button>
          </div>

          <div class="space-y-3 text-xs">
            <div class="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Rating: <strong>⭐ {{ tool.rating }}</strong></span>
              <span class="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-semibold">{{ tool.pricing }}</span>
            </div>

            <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <h4 class="font-bold text-slate-900 dark:text-white text-xs mb-1">Tool Summary</h4>
              <p class="text-slate-700 dark:text-slate-300 leading-relaxed">{{ tool.description }}</p>
            </div>

            <div class="flex flex-wrap gap-1.5 pt-1">
              @for (tag of tool.tags; track tag) {
                <span class="px-2.5 py-1 text-[10px] rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 font-medium">
                  #{{ tag }}
                </span>
              }
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              (click)="selectedStoreTool.set(null)"
              class="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              Close
            </button>

            <button
              (click)="aiTrendsService.openToolInNewTab(tool.url)"
              class="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Visit Tool Website</span>
              <span>↗</span>
            </button>
          </div>
        </div>
      </div>
    }

    <!-- SUBMIT CUSTOM TOOL MODAL -->
    @if (showAddModal()) {
      <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h4 class="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <span>🛍️</span>
              <span>Submit Tool to AI Store</span>
            </h4>
            <button (click)="showAddModal.set(false)" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">✕</button>
          </div>

          <form (submit)="submitNewTool($event)" class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tool Name</label>
              <input
                type="text"
                [(ngModel)]="newTool.name"
                name="toolName"
                required
                placeholder="e.g. Supabase AI"
                class="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  [(ngModel)]="newTool.category"
                  name="toolCategory"
                  class="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Productivity">Productivity</option>
                  <option value="LLM">LLM</option>
                  <option value="Research">Research</option>
                  <option value="Audio">Audio</option>
                  <option value="Video">Video</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pricing</label>
                <select
                  [(ngModel)]="newTool.pricing"
                  name="toolPricing"
                  class="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Free">Free</option>
                  <option value="Freemium">Freemium</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Website URL</label>
              <input
                type="url"
                [(ngModel)]="newTool.url"
                name="toolUrl"
                required
                placeholder="https://example.com"
                class="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea
                [(ngModel)]="newTool.description"
                name="toolDesc"
                rows="3"
                placeholder="Brief summary of tool capabilities..."
                class="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            <div class="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                (click)="showAddModal.set(false)"
                class="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md"
              >
                Add Tool to Store
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class AiTrendsSectionComponent {
  aiTrendsService = inject(AiTrendsService);

  showAddModal = signal<boolean>(false);
  selectedBuzzword = signal<AiBuzzword | null>(null);
  selectedTrendingTool = signal<TrendingAiTool | null>(null);
  selectedStoreTool = signal<StoreAiTool | null>(null);

  newTool: Partial<StoreAiTool> = {
    name: '',
    category: 'Development',
    description: '',
    url: '',
    pricing: 'Freemium',
    icon: '🚀',
    tags: ['New Tool'],
    rating: 5.0
  };

  async submitNewTool(e: Event) {
    e.preventDefault();
    if (!this.newTool.name || !this.newTool.url) return;
    const success = await this.aiTrendsService.addCustomTool(this.newTool);
    if (success) {
      this.showAddModal.set(false);
      this.newTool = {
        name: '',
        category: 'Development',
        description: '',
        url: '',
        pricing: 'Freemium',
        icon: '🚀',
        tags: ['New Tool'],
        rating: 5.0
      };
    }
  }
}
