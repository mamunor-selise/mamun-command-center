import { Component, inject, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../../core/services/quiz.service';
import { QuizQuestion, QuizResult } from '../../core/models/quiz.model';

@Component({
  selector: 'app-quiz-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 text-slate-800 dark:text-slate-200 selection:bg-amber-500 selection:text-white">
      <!-- HEADER & TOP CONTROLS -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🧪</span> Quiz & Knowledge Test Engine
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Test your knowledge against 207 curated questions across Set 1 (96 Qs) & Set 2 (111 Qs - Level 1 to 5 Mastery).
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button 
            (click)="activeTab = 'test'" 
            [class.bg-amber-600]="activeTab === 'test'"
            [class.text-white]="activeTab === 'test'"
            [class.bg-slate-100]="activeTab !== 'test'"
            [class.dark:bg-slate-800]="activeTab !== 'test'"
            [class.text-slate-700]="activeTab !== 'test'"
            [class.dark:text-slate-300]="activeTab !== 'test'"
            class="text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>🎯</span> Quiz Mode
          </button>

          <button 
            (click)="activeTab = 'flashcards'" 
            [class.bg-amber-600]="activeTab === 'flashcards'"
            [class.text-white]="activeTab === 'flashcards'"
            [class.bg-slate-100]="activeTab !== 'flashcards'"
            [class.dark:bg-slate-800]="activeTab !== 'flashcards'"
            [class.text-slate-700]="activeTab !== 'flashcards'"
            [class.dark:text-slate-300]="activeTab !== 'flashcards'"
            class="text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>📇</span> Flashcards ({{ quizService.allQuestions.length }} Qs)
          </button>

          <button 
            (click)="activeTab = 'history'" 
            [class.bg-amber-600]="activeTab === 'history'"
            [class.text-white]="activeTab === 'history'"
            [class.bg-slate-100]="activeTab !== 'history'"
            [class.dark:bg-slate-800]="activeTab !== 'history'"
            [class.text-slate-700]="activeTab !== 'history'"
            [class.text-slate-700]="activeTab !== 'history'"
            [class.dark:text-slate-300]="activeTab !== 'history'"
            class="text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>📊</span> Test History ({{ quizService.resultsHistory().length }})
          </button>
        </div>
      </div>

      <!-- OVERVIEW STATS CARDS -->
      <div *ngIf="!isQuizActive" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg font-bold">
            📚
          </div>
          <div>
            <div class="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total Q&A Bank</div>
            <div class="text-lg font-extrabold text-slate-900 dark:text-white">207 Questions</div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg font-bold">
            🏆
          </div>
          <div>
            <div class="text-[11px] font-medium text-slate-500 dark:text-slate-400">Avg Mastery Score</div>
            <div class="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
              {{ averageScore() }}%
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg font-bold">
            🎓
          </div>
          <div>
            <div class="text-[11px] font-medium text-slate-500 dark:text-slate-400">Curriculum Levels</div>
            <div class="text-lg font-extrabold text-slate-900 dark:text-white">5 Mastery Levels</div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg font-bold">
            ⚡
          </div>
          <div>
            <div class="text-[11px] font-medium text-slate-500 dark:text-slate-400">Tests Saved in DB</div>
            <div class="text-lg font-extrabold text-slate-900 dark:text-white">
              {{ quizService.resultsHistory().length }} Saved
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 1: QUIZ SETUP / RUNNER -->
      <div *ngIf="activeTab === 'test'">
        <!-- QUIZ SETUP CARD (When Quiz is not active) -->
        <div *ngIf="!isQuizActive" class="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-3xl mx-auto">
          <div class="text-center space-y-1">
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">🚀 Configure Your Quiz Test</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Select Question Paper Set, Level, Topics, and Timer to start practicing.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <!-- Question Paper Set Selection -->
            <div class="md:col-span-2">
              <label class="block font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Select Question Paper Set</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                  (click)="onPaperSetChange('set2')"
                  [class.border-amber-500]="selectedPaperSet === 'set2'"
                  [class.bg-amber-100]="selectedPaperSet === 'set2'"
                  [class.dark:bg-amber-950]="selectedPaperSet === 'set2'"
                  [class.border-slate-300]="selectedPaperSet !== 'set2'"
                  [class.dark:border-slate-700]="selectedPaperSet !== 'set2'"
                  class="p-4 rounded-xl border text-left transition-all hover:border-amber-400 flex flex-col justify-between space-y-1"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-slate-900 dark:text-white">📄 Set 2: AI & LLM 5-Level Mastery</span>
                    <span class="bg-amber-500 text-white font-extrabold px-2 py-0.5 rounded text-[10px]">111 Qs</span>
                  </div>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400">
                    Comprehensive 5-level curriculum: Basic (20), Intermediate (20), Advanced (21), Pro (20), Ecosystem (30).
                  </p>
                </button>

                <button 
                  (click)="onPaperSetChange('set1')"
                  [class.border-amber-500]="selectedPaperSet === 'set1'"
                  [class.bg-amber-100]="selectedPaperSet === 'set1'"
                  [class.dark:bg-amber-950]="selectedPaperSet === 'set1'"
                  [class.border-slate-300]="selectedPaperSet !== 'set1'"
                  [class.dark:border-slate-700]="selectedPaperSet !== 'set1'"
                  class="p-4 rounded-xl border text-left transition-all hover:border-amber-400 flex flex-col justify-between space-y-1"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-slate-900 dark:text-white">📄 Set 1: LLM Core Fundamentals</span>
                    <span class="bg-indigo-500 text-white font-extrabold px-2 py-0.5 rounded text-[10px]">96 Qs</span>
                  </div>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400">
                    Core concepts from Q&A Bank: Architecture, Attention, Sampling, Fine-tuning, RAG & Safety.
                  </p>
                </button>
              </div>
            </div>

            <!-- Level Filter (Applies to Set 2) -->
            <div *ngIf="selectedPaperSet === 'set2'">
              <label class="block font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Level Filter</label>
              <select 
                [(ngModel)]="selectedLevel" 
                class="w-full bg-slate-50 dark:bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white font-medium"
              >
                <option *ngFor="let lvl of levelOptions" [value]="lvl">{{ lvl }}</option>
              </select>
            </div>

            <!-- Category Filter -->
            <div [class.md:col-span-2]="selectedPaperSet === 'set1'">
              <label class="block font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Topic Category</label>
              <select 
                [(ngModel)]="selectedCategory" 
                class="w-full bg-slate-50 dark:bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white font-medium"
              >
                <option *ngFor="let cat of categoryOptions" [value]="cat">
                  {{ cat }} {{ getCategoryCountText(cat) }}
                </option>
              </select>
            </div>

            <!-- Question Count -->
            <div class="md:col-span-2">
              <label class="block font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Number of Questions</label>
              <select 
                [(ngModel)]="selectedCount" 
                class="w-full bg-slate-50 dark:bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white font-medium"
              >
                <option [ngValue]="5">⚡ 5 Questions (Quick Quiz)</option>
                <option [ngValue]="10">🎯 10 Questions (Standard Test)</option>
                <option [ngValue]="20">🔥 20 Questions (Extended Test)</option>
                <option [ngValue]="50">🚀 50 Questions (Comprehensive Challenge)</option>
                <option [ngValue]="selectedPaperSet === 'set2' ? 111 : 96">🏆 All Questions in Paper Set (Full Mastery Challenge)</option>
              </select>
            </div>
          </div>

          <!-- Timer & Randomize Toggles -->
          <div class="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div class="flex items-center gap-2">
              <input type="checkbox" id="enableTimer" [(ngModel)]="enableTimer" class="w-4 h-4 accent-amber-600 rounded cursor-pointer" />
              <label for="enableTimer" class="font-medium cursor-pointer">Enable Timed Mode (30 seconds per question)</label>
            </div>

            <div class="flex items-center gap-2">
              <input type="checkbox" id="randomizeOrder" [(ngModel)]="randomizeOrder" class="w-4 h-4 accent-amber-600 rounded cursor-pointer" />
              <label for="randomizeOrder" class="font-medium cursor-pointer">Shuffle Question Order</label>
            </div>
          </div>

          <div class="flex justify-center pt-2">
            <button 
              (click)="startQuiz()" 
              class="w-full md:w-auto px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2"
            >
              <span>🚀</span> Start Quiz Test
            </button>
          </div>
        </div>

        <!-- ACTIVE QUIZ ENGINE UI -->
        <div *ngIf="isQuizActive" class="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6 max-w-3xl mx-auto">
          <!-- Top Bar: Progress & Timer -->
          <div class="flex items-center justify-between text-xs pb-3 border-b border-slate-200 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <span class="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-2.5 py-1 rounded-lg">
                Question {{ currentQuestionIndex + 1 }} of {{ currentQuestions.length }}
              </span>
              <span *ngIf="currentQuestion?.level" class="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold px-2.5 py-1 rounded-lg">
                {{ currentQuestion?.level }}
              </span>
              <span class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium px-2.5 py-1 rounded-lg">
                {{ currentQuestion?.category }}
              </span>
            </div>

            <div *ngIf="enableTimer" class="flex items-center gap-1.5 font-mono text-xs font-bold" [class.text-rose-500]="timeRemaining <= 10" [class.text-slate-700]="timeRemaining > 10" [class.dark:text-slate-300]="timeRemaining > 10">
              <span>⏱️</span>
              <span>{{ formatTime(timeRemaining) }}</span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div class="bg-amber-500 h-full transition-all duration-300 rounded-full" [style.width.%]="((currentQuestionIndex + 1) / currentQuestions.length) * 100"></div>
          </div>

          <!-- Question Title -->
          <div class="space-y-2 py-2">
            <div class="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Q{{ currentQuestionIndex + 1 }}.
            </div>
            <h3 class="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {{ currentQuestion?.question }}
            </h3>
          </div>

          <!-- Options Grid -->
          <div class="space-y-3">
            <button 
              *ngFor="let option of currentQuestion?.options; let i = index" 
              (click)="selectOption(option)" 
              [class.border-amber-500]="userAnswers[currentQuestion?.id || ''] === option"
              [class.bg-amber-100]="userAnswers[currentQuestion?.id || ''] === option"
              [class.text-amber-900]="userAnswers[currentQuestion?.id || ''] === option"
              [class.dark:text-amber-200]="userAnswers[currentQuestion?.id || ''] === option"
              [class.border-slate-200]="userAnswers[currentQuestion?.id || ''] !== option"
              [class.dark:border-slate-800]="userAnswers[currentQuestion?.id || ''] !== option"
              [class.bg-slate-50]="userAnswers[currentQuestion?.id || ''] !== option"
              [class.dark:bg-slate-900]="userAnswers[currentQuestion?.id || ''] !== option"
              class="w-full text-left p-4 rounded-xl border text-xs md:text-sm font-medium transition-all hover:border-amber-400 flex items-start gap-3 group"
            >
              <span class="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                {{ getOptionLabel(i) }}
              </span>
              <span class="flex-1 mt-0.5 leading-relaxed">{{ option }}</span>
            </button>
          </div>

          <!-- Navigation Controls -->
          <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
            <button 
              (click)="prevQuestion()" 
              [disabled]="currentQuestionIndex === 0"
              class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-40 transition-colors"
            >
              ⬅️ Previous
            </button>

            <div class="text-slate-500">
              Answered {{ getAnsweredCount() }} of {{ currentQuestions.length }}
            </div>

            <button 
              *ngIf="currentQuestionIndex < currentQuestions.length - 1" 
              (click)="nextQuestion()" 
              class="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all shadow-md"
            >
              Next ➡️
            </button>

            <button 
              *ngIf="currentQuestionIndex === currentQuestions.length - 1" 
              (click)="submitQuiz()" 
              class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-600/20"
            >
              🏁 Submit Quiz
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 2: FLASHCARDS STUDY MODE -->
      <div *ngIf="activeTab === 'flashcards'" class="space-y-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <span class="font-semibold text-slate-600 dark:text-slate-400">Paper Set:</span>
            <select 
              [(ngModel)]="flashcardPaperSet" 
              (change)="onFlashcardPaperChange()"
              class="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 outline-none font-semibold"
            >
              <option value="all">All Questions (207 Qs)</option>
              <option value="set2">Set 2: 5-Level Mastery (111 Qs)</option>
              <option value="set1">Set 1: LLM Fundamentals (96 Qs)</option>
            </select>
          </div>

          <div class="w-full sm:w-64 relative">
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              placeholder="🔍 Search Q&A concepts..." 
              class="w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-amber-500 text-xs"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            *ngFor="let q of filteredFlashcards(); let i = index" 
            (click)="toggleFlashcard(q.id)" 
            class="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-60 group relative select-none"
          >
            <div>
              <div class="flex items-center justify-between mb-2 gap-1">
                <span *ngIf="q.level" class="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded truncate">
                  {{ q.level }}
                </span>
                <span *ngIf="!q.level" class="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded truncate">
                  {{ q.category }}
                </span>
                <span class="text-[10px] text-slate-400 font-mono shrink-0">Q{{ i + 1 }}</span>
              </div>
              
              <h4 class="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {{ q.question }}
              </h4>
            </div>

            <!-- Flips to reveal answer -->
            <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <div *ngIf="!flippedCards.has(q.id)" class="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center justify-between">
                <span>💡 Click card to reveal answer</span>
                <span>🔄</span>
              </div>
              <div *ngIf="flippedCards.has(q.id)" class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold leading-relaxed animate-fadeIn">
                <span class="font-bold uppercase text-[10px] block text-slate-400 mb-0.5">Answer:</span>
                {{ q.correctAnswer }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: TEST HISTORY -->
      <div *ngIf="activeTab === 'history'" class="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>📊</span> MongoDB Atlas Saved Test Performance Log
        </h3>

        <div *ngIf="quizService.resultsHistory().length === 0" class="text-center py-8 text-xs text-slate-500">
          No quiz history recorded yet. Complete a quiz to view performance stats synced to database!
        </div>

        <div *ngIf="quizService.resultsHistory().length > 0" class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th class="pb-3">Date</th>
                <th class="pb-3">Paper Set</th>
                <th class="pb-3">Topic / Level</th>
                <th class="pb-3">Score</th>
                <th class="pb-3">Accuracy</th>
                <th class="pb-3">Time Spent</th>
                <th class="pb-3">Badge</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr *ngFor="let res of quizService.resultsHistory()" class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-3 font-mono text-slate-600 dark:text-slate-400">{{ res.date | date:'short' }}</td>
                <td class="py-3 font-bold text-slate-900 dark:text-white">{{ res.paperTitle || res.paperSet }}</td>
                <td class="py-3 font-semibold text-slate-800 dark:text-slate-200">{{ res.categoryFilter }}</td>
                <td class="py-3 font-bold text-slate-900 dark:text-white">{{ res.correctAnswers }} / {{ res.totalQuestions }}</td>
                <td class="py-3">
                  <span [class.text-emerald-500]="res.scorePercentage >= 80" [class.text-amber-500]="res.scorePercentage >= 60 && res.scorePercentage < 80" [class.text-rose-500]="res.scorePercentage < 60" class="font-bold">
                    {{ res.scorePercentage }}%
                  </span>
                </td>
                <td class="py-3 font-mono text-slate-500">{{ formatTime(res.timeSpentSeconds) }}</td>
                <td class="py-3 font-bold">
                  <span *ngIf="res.scorePercentage >= 90">🏆 LLM Master</span>
                  <span *ngIf="res.scorePercentage >= 75 && res.scorePercentage < 90">🥇 AI Expert</span>
                  <span *ngIf="res.scorePercentage >= 60 && res.scorePercentage < 75">🥈 Proficient</span>
                  <span *ngIf="res.scorePercentage < 60">🥉 Learner</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- RESULTS MODAL -->
      <div *ngIf="showResultsModal" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white dark:bg-slate-900 w-full max-w-xl p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
          <div class="text-center space-y-2">
            <div class="text-4xl">
              <span *ngIf="lastResult?.scorePercentage! >= 80">🎉</span>
              <span *ngIf="lastResult?.scorePercentage! >= 60 && lastResult?.scorePercentage! < 80">👍</span>
              <span *ngIf="lastResult?.scorePercentage! < 60">💡</span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">Quiz Test Completed!</h3>
            <p class="text-xs text-slate-500">Performance summary for {{ lastResult?.paperTitle }} (Saved to Database).</p>
          </div>

          <!-- Circular Score Card -->
          <div class="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-center">
            <div class="text-4xl font-extrabold" [class.text-emerald-500]="lastResult?.scorePercentage! >= 80" [class.text-amber-500]="lastResult?.scorePercentage! >= 60 && lastResult?.scorePercentage! < 80" [class.text-rose-500]="lastResult?.scorePercentage! < 60">
              {{ lastResult?.scorePercentage }}%
            </div>
            <div class="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
              {{ lastResult?.correctAnswers }} out of {{ lastResult?.totalQuestions }} Correct Answers
            </div>
            <div class="text-[11px] text-slate-500 mt-0.5">
              Completed in {{ formatTime(lastResult?.timeSpentSeconds || 0) }}
            </div>
          </div>

          <!-- Detailed Answer Breakdown List -->
          <div class="space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Answer Review</h4>
              
              <!-- Filter Tabs: All / Incorrect Only / Correct Only -->
              <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[11px]">
                <button 
                  (click)="modalFilter = 'all'"
                  [class.bg-white]="modalFilter === 'all'"
                  [class.dark:bg-slate-700]="modalFilter === 'all'"
                  [class.text-slate-900]="modalFilter === 'all'"
                  [class.dark:text-white]="modalFilter === 'all'"
                  [class.font-bold]="modalFilter === 'all'"
                  [class.shadow-sm]="modalFilter === 'all'"
                  class="px-2.5 py-1 rounded-lg transition-all text-slate-600 dark:text-slate-400"
                >
                  All ({{ currentQuestions.length }})
                </button>
                <button 
                  (click)="modalFilter = 'incorrect'"
                  [class.bg-rose-600]="modalFilter === 'incorrect'"
                  [class.text-white]="modalFilter === 'incorrect'"
                  [class.font-bold]="modalFilter === 'incorrect'"
                  class="px-2.5 py-1 rounded-lg transition-all text-rose-600 dark:text-rose-400"
                >
                  ❌ Incorrect ({{ getIncorrectCount() }})
                </button>
                <button 
                  (click)="modalFilter = 'correct'"
                  [class.bg-emerald-600]="modalFilter === 'correct'"
                  [class.text-white]="modalFilter === 'correct'"
                  [class.font-bold]="modalFilter === 'correct'"
                  class="px-2.5 py-1 rounded-lg transition-all text-emerald-600 dark:text-emerald-400"
                >
                  ✓ Correct ({{ getCorrectCount() }})
                </button>
              </div>
            </div>

            <div class="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              <div 
                *ngFor="let q of filteredModalQuestions()" 
                class="p-4 rounded-xl border text-xs space-y-2 transition-all" 
                [class.border-emerald-300]="userAnswers[q.id] === q.correctAnswer" 
                [class.dark:border-emerald-800]="userAnswers[q.id] === q.correctAnswer"
                [class.bg-emerald-50]="userAnswers[q.id] === q.correctAnswer" 
                [class.dark:bg-emerald-950]="userAnswers[q.id] === q.correctAnswer"
                [class.border-rose-300]="userAnswers[q.id] !== q.correctAnswer" 
                [class.dark:border-rose-800]="userAnswers[q.id] !== q.correctAnswer"
                [class.bg-rose-50]="userAnswers[q.id] !== q.correctAnswer"
                [class.dark:bg-rose-950]="userAnswers[q.id] !== q.correctAnswer"
              >
                <div class="flex items-start justify-between gap-2">
                  <span class="font-bold text-slate-900 dark:text-white leading-snug">
                    Q{{ getOriginalQuestionIndex(q) + 1 }}. {{ q.question }}
                  </span>
                  <span *ngIf="userAnswers[q.id] === q.correctAnswer" class="bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded text-[10px] shrink-0">
                    ✓ Correct
                  </span>
                  <span *ngIf="userAnswers[q.id] !== q.correctAnswer" class="bg-rose-600/20 text-rose-700 dark:text-rose-300 font-bold px-2.5 py-0.5 rounded text-[10px] shrink-0">
                    ✕ Incorrect
                  </span>
                </div>

                <div class="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <div class="text-[11px] flex items-start gap-1.5">
                    <span class="text-slate-500 font-semibold shrink-0">Your Choice:</span>
                    <strong [class.text-emerald-700]="userAnswers[q.id] === q.correctAnswer" [class.dark:text-emerald-400]="userAnswers[q.id] === q.correctAnswer" [class.text-rose-700]="userAnswers[q.id] !== q.correctAnswer" [class.dark:text-rose-400]="userAnswers[q.id] !== q.correctAnswer" class="font-bold">
                      {{ userAnswers[q.id] || 'Not answered' }}
                    </strong>
                  </div>

                  <div *ngIf="userAnswers[q.id] !== q.correctAnswer" class="text-[11px] flex items-start gap-1.5 bg-emerald-500/10 p-2 rounded-lg text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-500/20">
                    <span class="shrink-0">✅ Correct Answer:</span>
                    <span>{{ q.correctAnswer }}</span>
                  </div>
                </div>
              </div>

              <div *ngIf="filteredModalQuestions().length === 0" class="text-center py-6 text-xs text-slate-500">
                No questions found for this filter.
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button (click)="showResultsModal = false" class="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              Close Review
            </button>
            <button (click)="showResultsModal = false; startQuiz()" class="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md">
              🔄 Retake Test
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class QuizTestComponent implements OnDestroy {
  quizService = inject(QuizService);

  activeTab: 'test' | 'flashcards' | 'history' = 'test';

  // Paper Set & Filter Setup Options
  selectedPaperSet: 'set1' | 'set2' = 'set2';
  levelOptions: string[] = [];
  categoryOptions: string[] = [];
  selectedLevel = 'All Levels';
  selectedCategory = 'All Categories';
  selectedCount = 10;
  enableTimer = false;
  randomizeOrder = true;

  // Active quiz state
  isQuizActive = false;
  currentQuestions: QuizQuestion[] = [];
  currentQuestionIndex = 0;
  userAnswers: { [questionId: string]: string } = {};

  // Timer state
  timerInterval: any = null;
  timeRemaining = 0;
  startTime = 0;

  // Results state
  showResultsModal = false;
  lastResult: QuizResult | null = null;
  modalFilter: 'all' | 'incorrect' | 'correct' = 'all';

  // Flashcards state
  flashcardPaperSet = 'set2';
  searchQuery = '';
  flippedCards = new Set<string>();

  constructor() {
    this.updateFilters();
  }

  onPaperSetChange(set: 'set1' | 'set2') {
    this.selectedPaperSet = set;
    this.updateFilters();
  }

  updateFilters() {
    this.levelOptions = this.quizService.getLevelsForPaper(this.selectedPaperSet);
    this.categoryOptions = this.quizService.getCategories(this.selectedPaperSet);
    this.selectedLevel = 'All Levels';
    this.selectedCategory = 'All Categories';
  }

  get currentQuestion(): QuizQuestion | null {
    return this.currentQuestions[this.currentQuestionIndex] || null;
  }

  averageScore(): number {
    const list = this.quizService.resultsHistory();
    if (list.length === 0) return 85;
    const sum = list.reduce((acc, curr) => acc + curr.scorePercentage, 0);
    return Math.round(sum / list.length);
  }

  getCategoryCountText(cat: string): string {
    if (cat === 'All Categories') return ``;
    const counts = this.quizService.getCategoryCounts(this.selectedPaperSet);
    return `(${counts[cat] || 0} Qs)`;
  }

  startQuiz() {
    this.currentQuestions = this.quizService.getQuestions(
      this.selectedPaperSet,
      this.selectedCategory,
      this.selectedLevel,
      this.selectedCount,
      this.randomizeOrder
    );
    this.currentQuestionIndex = 0;
    this.userAnswers = {};
    this.isQuizActive = true;
    this.showResultsModal = false;
    this.startTime = Date.now();

    if (this.enableTimer) {
      this.timeRemaining = this.currentQuestions.length * 30; // 30s per question
      this.startTimer();
    }
  }

  selectOption(option: string) {
    if (this.currentQuestion) {
      this.userAnswers[this.currentQuestion.id] = option;
    }
  }

  getOptionLabel(index: number): string {
    return ['A', 'B', 'C', 'D'][index] || '';
  }

  getAnsweredCount(): number {
    return Object.keys(this.userAnswers).length;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.currentQuestions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitQuiz() {
    this.stopTimer();
    const timeSpentSeconds = Math.round((Date.now() - this.startTime) / 1000);

    let correctCount = 0;
    this.currentQuestions.forEach(q => {
      if (this.userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / this.currentQuestions.length) * 100);

    const paperTitle = this.selectedPaperSet === 'set2' 
      ? 'Set 2: 5-Level Mastery' 
      : 'Set 1: LLM Fundamentals';

    const result: QuizResult = {
      id: 'res-' + Date.now(),
      date: new Date().toISOString(),
      paperSet: this.selectedPaperSet,
      paperTitle: paperTitle,
      totalQuestions: this.currentQuestions.length,
      correctAnswers: correctCount,
      scorePercentage: scorePercentage,
      timeSpentSeconds: timeSpentSeconds,
      categoryFilter: this.selectedLevel !== 'All Levels' ? this.selectedLevel : this.selectedCategory
    };

    this.quizService.saveResult(result);
    this.lastResult = result;
    this.isQuizActive = false;
    this.modalFilter = 'all';
    this.showResultsModal = true;
  }

  private startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        this.stopTimer();
        this.submitQuiz();
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(totalSeconds: number): string {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Flashcards helpers
  onFlashcardPaperChange() {
    this.flippedCards.clear();
  }

  toggleFlashcard(id: string) {
    if (this.flippedCards.has(id)) {
      this.flippedCards.delete(id);
    } else {
      this.flippedCards.add(id);
    }
  }

  filteredFlashcards(): QuizQuestion[] {
    let list = this.quizService.allQuestions;
    if (this.flashcardPaperSet === 'set1') {
      list = this.quizService.set1Questions;
    } else if (this.flashcardPaperSet === 'set2') {
      list = this.quizService.set2Questions;
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(item => 
        item.question.toLowerCase().includes(q) || 
        item.correctAnswer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.level && item.level.toLowerCase().includes(q))
      );
    }
    return list;
  }

  getCorrectCount(): number {
    return this.currentQuestions.filter(q => this.userAnswers[q.id] === q.correctAnswer).length;
  }

  getIncorrectCount(): number {
    return this.currentQuestions.length - this.getCorrectCount();
  }

  filteredModalQuestions(): QuizQuestion[] {
    if (this.modalFilter === 'incorrect') {
      return this.currentQuestions.filter(q => this.userAnswers[q.id] !== q.correctAnswer);
    }
    if (this.modalFilter === 'correct') {
      return this.currentQuestions.filter(q => this.userAnswers[q.id] === q.correctAnswer);
    }
    return this.currentQuestions;
  }

  getOriginalQuestionIndex(q: QuizQuestion): number {
    return this.currentQuestions.findIndex(item => item.id === q.id);
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}
