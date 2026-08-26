import { Component, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface LlmStep {
  id: number;
  shortTitle: string;
  fullTitle: string;
  badge: string;
  icon: string;
  summary: string;
  details: string[];
  keyConcept: string;
  formula?: string;
  colorTheme: {
    badgeBg: string;
    badgeText: string;
    border: string;
    activeTab: string;
    accent: string;
  };
}

@Component({
  selector: 'app-llm-explanation-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-none overflow-hidden transition-all">
      
      <!-- Card Header -->
      <div class="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-900/20 via-purple-900/10 to-slate-900/40 backdrop-blur-md">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-start space-x-3">
            <div class="h-10 w-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl font-bold border border-indigo-500/30 flex-shrink-0">
              🧠
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                  MCC-6
                </span>
                <span class="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  LLM Core Architecture
                </span>
              </div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
                How LLM Works? (5-Step Interactive Guide)
              </h2>
            </div>
          </div>

          <!-- Top Controls -->
          <div class="flex items-center space-x-2">
            <button
              (click)="toggleAutoPlay()"
              class="px-3 py-1.5 text-xs font-semibold rounded-xl text-white transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
              [ngClass]="isPlaying() ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-500'"
            >
              <span>{{ isPlaying() ? '⏸ Pause' : '▶ Auto Play' }}</span>
            </button>

            <button
              (click)="showArchitectureModal.set(true)"
              class="px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center space-x-1 cursor-pointer"
            >
              <span>🖼️ View Diagram</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content Container -->
      <div class="p-5 space-y-6">

        <!-- 5-Step Stepper Navigation Bar -->
        <div class="grid grid-cols-5 gap-1.5 sm:gap-2">
          @for (step of steps; track step.id) {
            <button
              (click)="selectStep(step.id)"
              [ngClass]="{
                'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700': activeStepId() === step.id
              }"
              class="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-left transition-all cursor-pointer flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-600"
            >
              <div class="flex items-center justify-between">
                <span class="text-[10px] sm:text-xs font-extrabold text-slate-400 dark:text-slate-500">
                  0{{ step.id }}
                </span>
                <span class="text-xs sm:text-sm">{{ step.icon }}</span>
              </div>
              <p class="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 truncate mt-1">
                {{ step.shortTitle }}
              </p>
            </button>
          }
        </div>

        <!-- Active Step Header Banner -->
        @if (currentStep(); as step) {
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border" [ngClass]="step.colorTheme.border">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div class="flex items-center space-x-2">
                  <span class="px-2 py-0.5 text-[9px] font-bold uppercase rounded" [ngClass]="[step.colorTheme.badgeBg, step.colorTheme.badgeText]">
                    Step {{ step.id }} of 5 • {{ step.badge }}
                  </span>
                  @if (step.formula) {
                    <span class="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-900/60 px-2 py-0.5 rounded">
                      {{ step.formula }}
                    </span>
                  }
                </div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white mt-1 flex items-center space-x-2">
                  <span>{{ step.icon }}</span>
                  <span>{{ step.fullTitle }}</span>
                </h3>
                <p class="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {{ step.summary }}
                </p>
              </div>

              <!-- Navigation Controls -->
              <div class="flex items-center space-x-2 flex-shrink-0 self-end md:self-center">
                <button
                  (click)="prevStep()"
                  [disabled]="activeStepId() === 1"
                  class="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold"
                >
                  ← Prev
                </button>
                <span class="text-xs font-bold text-slate-400">
                  {{ activeStepId() }} / 5
                </span>
                <button
                  (click)="nextStep()"
                  [disabled]="activeStepId() === 5"
                  class="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>

          <!-- Step Details & Interactive Simulation Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <!-- Left Column: Key Concept Bullet Points -->
            <div class="lg:col-span-5 space-y-4">
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <span>💡</span>
                  <span>Key Concepts</span>
                </h4>
                
                <p class="text-xs font-medium text-indigo-600 dark:text-indigo-300 italic bg-indigo-500/10 p-2.5 rounded-lg border border-indigo-500/20">
                  "{{ step.keyConcept }}"
                </p>

                <ul class="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  @for (detail of step.details; track detail) {
                    <li class="flex items-start space-x-2">
                      <span class="text-indigo-500 font-bold mt-0.5">•</span>
                      <span class="leading-relaxed">{{ detail }}</span>
                    </li>
                  }
                </ul>
              </div>
            </div>

            <!-- Right Column: Interactive Sandbox Visualizer per Step -->
            <div class="lg:col-span-7">
              <div class="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-4">
                
                <!-- STEP 1 INTERACTIVE DEMO: TOKENIZER -->
                @if (activeStepId() === 1) {
                  <div class="space-y-3">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span class="text-xs font-bold text-amber-400 flex items-center space-x-1">
                        <span>🔤</span>
                        <span>Interactive Tokenizer (Encoding / Decoding)</span>
                      </span>
                      <span class="text-[10px] text-slate-400 font-mono">Byte-Pair Encoding</span>
                    </div>

                    <div>
                      <label class="block text-[10px] font-semibold text-slate-400 mb-1">Input Text Prompt:</label>
                      <input
                        type="text"
                        [ngModel]="samplePrompt()"
                        (ngModelChange)="samplePrompt.set($event)"
                        class="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400 font-mono"
                        placeholder="Type something..."
                      />
                    </div>

                    <!-- Token Chips Output -->
                    <div>
                      <span class="block text-[10px] font-semibold text-slate-400 mb-1">
                        1. Encoded Tokens (Subword Segmentation & Numerical IDs):
                      </span>
                      <div class="flex flex-wrap gap-1.5 p-2 bg-slate-950 rounded-lg border border-slate-800 min-h-[50px]">
                        @for (tok of tokens(); track tok.id) {
                          <div class="px-2 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center space-x-1">
                            <span class="font-bold">"{{ tok.text }}"</span>
                            <span class="text-[9px] text-amber-400/70 bg-amber-950/60 px-1 rounded">ID: {{ tok.id }}</span>
                          </div>
                        }
                      </div>
                    </div>

                    <div>
                      <span class="block text-[10px] font-semibold text-slate-400 mb-1">
                        2. Decoded Output Text:
                      </span>
                      <div class="p-2 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400">
                        {{ samplePrompt() }}
                      </div>
                    </div>
                  </div>
                }

                <!-- STEP 2 INTERACTIVE DEMO: EMBEDDINGS & POSITIONAL VECTOR -->
                @if (activeStepId() === 2) {
                  <div class="space-y-3">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span class="text-xs font-bold text-blue-400 flex items-center space-x-1">
                        <span>📍</span>
                        <span>Vector Addition: Embedding + Positional Encoding</span>
                      </span>
                      <span class="text-[10px] text-slate-400 font-mono">Vector Dimension d=4</span>
                    </div>

                    <div class="space-y-2 text-xs font-mono">
                      @for (item of vectorData(); track item.word) {
                        <div class="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                          <div class="flex items-center justify-between text-slate-300">
                            <span class="font-bold text-blue-300">Word: "{{ item.word }}" (Pos {{ item.pos }})</span>
                          </div>
                          
                          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
                            <div class="p-1.5 rounded bg-slate-900 border border-slate-800">
                              <span class="text-slate-400 block text-[9px]">Token Embedding:</span>
                              <span class="text-indigo-300 font-bold">[{{ item.embedding.join(', ') }}]</span>
                            </div>

                            <div class="p-1.5 rounded bg-slate-900 border border-slate-800">
                              <span class="text-slate-400 block text-[9px]">+ Positional Encoding:</span>
                              <span class="text-cyan-300 font-bold">[{{ item.posEnc.join(', ') }}]</span>
                            </div>

                            <div class="p-1.5 rounded bg-blue-950/40 border border-blue-800/60">
                              <span class="text-blue-400 block text-[9px] font-bold">= Final Vector Input:</span>
                              <span class="text-emerald-400 font-bold">[{{ item.finalVec.join(', ') }}]</span>
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }

                <!-- STEP 3 INTERACTIVE DEMO: MULTI-HEAD SELF ATTENTION HEATMAP -->
                @if (activeStepId() === 3) {
                  <div class="space-y-3">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span class="text-xs font-bold text-purple-400 flex items-center space-x-1">
                        <span>👁️</span>
                        <span>Self-Attention Matrix Heatmap</span>
                      </span>
                      <div class="flex space-x-1">
                        <button
                          (click)="selectedHead.set(1)"
                          [class.bg-purple-600]="selectedHead() === 1"
                          [class.bg-slate-800]="selectedHead() !== 1"
                          class="px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer"
                        >Head 1 (Syntax)</button>
                        <button
                          (click)="selectedHead.set(2)"
                          [class.bg-purple-600]="selectedHead() === 2"
                          [class.bg-slate-800]="selectedHead() !== 2"
                          class="px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer"
                        >Head 2 (Semantics)</button>
                      </div>
                    </div>

                    <p class="text-[10px] text-slate-400">
                      Hover or click tokens to see how much attention each word pays to others:
                    </p>

                    <!-- Attention Matrix Table -->
                    <div class="overflow-x-auto">
                      <table class="w-full text-center text-xs font-mono">
                        <thead>
                          <tr>
                            <th class="p-1.5 text-left text-slate-500">Query \\ Key</th>
                            @for (w of words(); track w) {
                              <th class="p-1.5 text-purple-300 font-bold">{{ w }}</th>
                            }
                          </tr>
                        </thead>
                        <tbody>
                          @for (qWord of words(); track qWord; let i = $index) {
                            <tr class="border-t border-slate-800/60">
                              <td class="p-1.5 text-left font-bold text-purple-300">{{ qWord }}</td>
                              @for (kWord of words(); track kWord; let j = $index) {
                                <td class="p-1.5">
                                  <div
                                    class="py-1 px-1.5 rounded text-[11px] font-bold transition-all"
                                    [style.backgroundColor]="getAttentionBg(i, j)"
                                    [style.color]="getAttentionTextColor(i, j)"
                                  >
                                    {{ getAttentionScore(i, j) }}
                                  </div>
                                </td>
                              }
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                }

                <!-- STEP 4 INTERACTIVE DEMO: QKV MATRICES -->
                @if (activeStepId() === 4) {
                  <div class="space-y-3">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span class="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                        <span>⚡</span>
                        <span>QKV Attention Calculation Breakdown</span>
                      </span>
                      <span class="text-[10px] text-slate-400 font-mono">Softmax(Q · Kᵀ / √d_k) · V</span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
                      <div class="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                        <span class="text-amber-400 font-bold text-[11px] block">🔍 Query (Q)</span>
                        <p class="text-[10px] text-slate-400">What token is looking for:</p>
                        <div class="text-amber-300 text-[10px]">Q = W_q × Vector</div>
                        <div class="p-1.5 bg-slate-900 rounded text-amber-200 text-[10px]">[0.82, 0.45, 0.19]</div>
                      </div>

                      <div class="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                        <span class="text-cyan-400 font-bold text-[11px] block">🔑 Key (K)</span>
                        <p class="text-[10px] text-slate-400">Features token offers:</p>
                        <div class="text-cyan-300 text-[10px]">K = W_k × Vector</div>
                        <div class="p-1.5 bg-slate-900 rounded text-cyan-200 text-[10px]">[0.75, 0.50, 0.10]</div>
                      </div>

                      <div class="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                        <span class="text-emerald-400 font-bold text-[11px] block">💎 Value (V)</span>
                        <p class="text-[10px] text-slate-400">Actual content info:</p>
                        <div class="text-emerald-300 text-[10px]">V = W_v × Vector</div>
                        <div class="p-1.5 bg-slate-900 rounded text-emerald-200 text-[10px]">[0.90, 0.12, 0.88]</div>
                      </div>
                    </div>

                    <div class="p-3 bg-emerald-950/30 border border-emerald-800/60 rounded-lg text-xs font-mono space-y-1.5">
                      <div class="flex items-center justify-between text-emerald-300 font-bold">
                        <span>1. Dot-Product (Q · Kᵀ): 0.859</span>
                        <span>2. Scaled (/ √d_k): 0.496</span>
                      </div>
                      <div class="flex items-center justify-between text-emerald-400">
                        <span>3. Softmax Weight: 0.621 (62.1% Attention)</span>
                        <span>4. Weighted Value Output Generated!</span>
                      </div>
                    </div>
                  </div>
                }

                <!-- STEP 5 INTERACTIVE DEMO: OUTCOME GENERATION (LOGITS & SOFTMAX) -->
                @if (activeStepId() === 5) {
                  <div class="space-y-3">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span class="text-xs font-bold text-rose-400 flex items-center space-x-1">
                        <span>🎯</span>
                        <span>Next-Token Probability Generator (Softmax)</span>
                      </span>
                      <span class="text-[10px] text-slate-400 font-mono">Autoregressive Loop</span>
                    </div>

                    <p class="text-[10px] text-slate-400">
                      Given prompt context, model calculates Logits and applies Softmax to sample the next token:
                    </p>

                    <!-- Vocab Probability Bars -->
                    <div class="space-y-2 text-xs font-mono">
                      @for (candidate of nextTokenCandidates(); track candidate.word) {
                        <div class="p-2 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                          <div class="flex items-center justify-between">
                            <span class="font-bold text-slate-200">
                              "{{ candidate.word }}"
                              @if (candidate.selected) {
                                <span class="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded ml-1 font-sans">
                                  ✓ Sampled Token
                                </span>
                              }
                            </span>
                            <span class="text-slate-400 text-[10px]">
                              Logit: {{ candidate.logit }} → {{ candidate.prob }}%
                            </span>
                          </div>
                          
                          <!-- Progress Bar -->
                          <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              class="h-full rounded-full transition-all duration-500"
                              [class.bg-emerald-500]="candidate.selected"
                              [class.bg-rose-500]="!candidate.selected"
                              [style.width.%]="candidate.prob"
                            ></div>
                          </div>
                        </div>
                      }
                    </div>

                    <!-- Autoregressive Stream Demo -->
                    <div class="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <button
                        (click)="generateNextTokenStep()"
                        class="px-3 py-1.5 text-xs font-bold rounded-lg text-white bg-rose-600 hover:bg-rose-500 transition-all cursor-pointer shadow-sm flex items-center space-x-1"
                      >
                        <span>🎲 Sample Next Word</span>
                      </button>
                      
                      <div class="text-xs font-mono text-slate-300">
                        Generated Sequence: <span class="text-emerald-400 font-bold">"How LLM works {{ generatedText() }}"</span>
                      </div>
                    </div>
                  </div>
                }

              </div>
            </div>

          </div>
        }

      </div>
    </div>

    <!-- TRANSFORMER ARCHITECTURE DIAGRAM MODAL -->
    @if (showArchitectureModal()) {
      <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white dark:bg-slate-900 border border-indigo-500/30 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
          
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                Jira Reference: MCC-6
              </span>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Transformer Architecture Diagram (Encoder & Decoder)
              </h3>
            </div>
            <button (click)="showArchitectureModal.set(false)" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl font-bold cursor-pointer">✕</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <!-- Attached Image -->
            <div class="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-center">
              <img
                src="assets/images/transformer-architecture.png"
                alt="Transformer Architecture Diagram from MCC-6"
                class="max-h-[450px] object-contain rounded-lg shadow-md"
              />
            </div>

            <!-- Architectural Breakdown & 5-Step Mapping -->
            <div class="space-y-4 text-xs">
              <div class="bg-indigo-500/10 p-3.5 rounded-xl border border-indigo-500/20 text-indigo-900 dark:text-indigo-200">
                <strong class="font-bold block mb-1">Architecture Summary:</strong>
                <p class="leading-relaxed">
                  The original <em>"Attention Is All You Need"</em> Transformer consists of an <strong>Encoder</strong> stack (processing input sequence) and a <strong>Decoder</strong> stack (generating output sequence autoregressively).
                </p>
              </div>

              <div class="space-y-2 text-slate-700 dark:text-slate-300">
                <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide">
                  Mapping 5 Steps to Diagram:
                </h4>
                
                <div class="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <span class="font-bold text-amber-600 dark:text-amber-400 block">1. Encoding / Decoding:</span>
                  <span>Inputs & Output Tokens entering the bottom and leaving the top.</span>
                </div>

                <div class="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <span class="font-bold text-blue-600 dark:text-blue-400 block">2. Preparing Text:</span>
                  <span>Input Embedding & Positional Encodings summed together before layer stacks.</span>
                </div>

                <div class="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <span class="font-bold text-purple-600 dark:text-purple-400 block">3. Multi-Head Attention:</span>
                  <span>Self-Attention and Masked Multi-Head Attention blocks in Encoder & Decoder.</span>
                </div>

                <div class="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <span class="font-bold text-emerald-600 dark:text-emerald-400 block">4. QKV Matrices:</span>
                  <span>Internal dot-product query, key, value calculations inside attention layers.</span>
                </div>

                <div class="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <span class="font-bold text-rose-600 dark:text-rose-400 block">5. Outcome Generation:</span>
                  <span>Linear Layer + Softmax producing Output Probabilities for token sampling.</span>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              (click)="showArchitectureModal.set(false)"
              class="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md cursor-pointer"
            >
              Close Diagram
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class LlmExplanationCardComponent implements OnDestroy {
  activeStepId = signal<number>(1);
  isPlaying = signal<boolean>(false);
  showArchitectureModal = signal<boolean>(false);
  selectedHead = signal<number>(1);
  
  samplePrompt = signal<string>('How LLM works?');
  generatedText = signal<string>('by processing context');

  private timerId: any = null;

  steps: LlmStep[] = [
    {
      id: 1,
      shortTitle: 'Encoding/Decoding',
      fullTitle: '1. Encoding & Decoding (Tokenization)',
      badge: 'Step 1: Input/Output Translation',
      icon: '🔤',
      formula: 'Text ↔ Tokens [ID1, ID2, ...]',
      summary: 'Translating human text into numerical token IDs (Encoding) and converting output token IDs back into human text (Decoding).',
      keyConcept: 'LLMs cannot process raw strings directly; they operate purely on integer token IDs created via subword tokenization.',
      details: [
        'Encoding breaks raw text into subwords or words using algorithms like Byte-Pair Encoding (BPE).',
        'Each unique subword maps to a specific integer ID in a fixed vocabulary index (e.g. 50,000+ words).',
        'Decoding performs the reverse transformation at the final stage to stream natural language output.'
      ],
      colorTheme: {
        badgeBg: 'bg-amber-500/20',
        badgeText: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-500/30',
        activeTab: 'bg-amber-500/10',
        accent: 'amber'
      }
    },
    {
      id: 2,
      shortTitle: 'Preparing Text',
      fullTitle: '2. Preparing Text (Embedding + Positional Vector)',
      badge: 'Step 2: Vectorization & Order',
      icon: '📍',
      formula: 'Input = Embedding(token) + PositionalEncoding(pos)',
      summary: 'Converting numerical token IDs into dense semantic vectors and adding positional encodings so the model knows word order.',
      keyConcept: 'Self-attention is order-agnostic by default; positional encodings inject essential word-sequence awareness into vectors.',
      details: [
        'Token IDs are mapped to high-dimensional embedding vectors (e.g. 768 or 4096 numerical values).',
        'Positional vectors (sine/cosine waves or Rotary Encodings/RoPE) are added directly to token vectors.',
        'This allows the model to differentiate between "dog bit man" and "man bit dog".'
      ],
      colorTheme: {
        badgeBg: 'bg-blue-500/20',
        badgeText: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-500/30',
        activeTab: 'bg-blue-500/10',
        accent: 'blue'
      }
    },
    {
      id: 3,
      shortTitle: 'Multi-Head Attention',
      fullTitle: '3. (Self-Attention) Multi-Head Attention',
      badge: 'Step 3: Contextual Weighting',
      icon: '👁️',
      formula: 'MultiHead(Q,K,V) = Concat(head_1, ..., head_h)W^O',
      summary: 'Calculating dynamic relationships between every pair of words across parallel attention heads.',
      keyConcept: 'Multi-head attention lets the model simultaneously focus on syntax, semantics, and reference relationships.',
      details: [
        'Tokens dynamically attend to surrounding tokens to determine exact contextual meaning.',
        'Multiple heads run in parallel, each learning distinct relational patterns (e.g., pronoun resolution, subject-verb agreement).',
        'Produces rich, context-aware representation vectors for every position in the sequence.'
      ],
      colorTheme: {
        badgeBg: 'bg-purple-500/20',
        badgeText: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-500/30',
        activeTab: 'bg-purple-500/10',
        accent: 'purple'
      }
    },
    {
      id: 4,
      shortTitle: 'QKV Matrices',
      fullTitle: '4. (QKV) Query, Key & Value Matrices',
      badge: 'Step 4: Mathematical Attention Mechanism',
      icon: '⚡',
      formula: 'Attention(Q,K,V) = Softmax(Q·Kᵀ / √d_k) · V',
      summary: 'Transforming input vectors into Query, Key, and Value projections to compute exact attention relevance matrix.',
      keyConcept: 'Queries ask questions, Keys offer index matches, and Values hold the actual contextual information transmitted.',
      details: [
        'Query (Q): Represents what the current token is seeking contextually.',
        'Key (K): Represents what features or attributes other tokens possess.',
        'Value (V): Contains the actual vector payload to blend based on dot-product similarity (Q · Kᵀ).'
      ],
      colorTheme: {
        badgeBg: 'bg-emerald-500/20',
        badgeText: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-500/30',
        activeTab: 'bg-emerald-500/10',
        accent: 'emerald'
      }
    },
    {
      id: 5,
      shortTitle: 'Outcome Generate',
      fullTitle: '5. Outcome Generation (Logits, Softmax & Next-Token Sampling)',
      badge: 'Step 5: Output Prediction',
      icon: '🎯',
      formula: 'Probability = Softmax(Linear(DecoderOutput))',
      summary: 'Projecting hidden states to vocabulary logits, calculating probabilities via Softmax, and sampling the next token.',
      keyConcept: 'LLMs generate text one token at a time autoregressively by appending each predicted token back into the prompt.',
      details: [
        'The final decoder representation passes through a linear layer outputting raw logit scores for every token in vocabulary.',
        'Softmax converts logits into normalized probability distribution summing to 1.0.',
        'Sampling strategies (temperature, top-k, top-p) select the output token, looping back for the next iteration.'
      ],
      colorTheme: {
        badgeBg: 'bg-rose-500/20',
        badgeText: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-500/30',
        activeTab: 'bg-rose-500/10',
        accent: 'rose'
      }
    }
  ];

  currentStep = computed(() => {
    const id = this.activeStepId();
    return this.steps.find(s => s.id === id) || this.steps[0];
  });

  tokens = computed(() => {
    const prompt = this.samplePrompt() || 'How LLM works?';
    // Simple mock tokenizer for visualization
    const words = prompt.trim().split(/(\s+|[^\w\s])/).filter(w => w.length > 0);
    return words.map((w, i) => ({
      id: 1000 + (i * 147) % 8900,
      text: w
    }));
  });

  vectorData = computed(() => {
    const prompt = this.samplePrompt() || 'How LLM works?';
    const words = prompt.trim().split(/\s+/).slice(0, 3);
    return words.map((word, idx) => {
      const emb = [
        +((idx + 1) * 0.45).toFixed(2),
        +((idx + 1) * -0.22).toFixed(2),
        +((idx + 1) * 0.81).toFixed(2),
        +((idx + 1) * 0.14).toFixed(2)
      ];
      const posEnc = [
        +(Math.sin(idx)).toFixed(2),
        +(Math.cos(idx)).toFixed(2),
        +(Math.sin(idx * 2)).toFixed(2),
        +(Math.cos(idx * 2)).toFixed(2)
      ];
      const finalVec = emb.map((v, i) => +(v + posEnc[i]).toFixed(2));
      return { word, pos: idx, embedding: emb, posEnc, finalVec };
    });
  });

  words = computed(() => {
    return ['How', 'LLM', 'works', '?'];
  });

  nextTokenCandidates = computed(() => {
    return [
      { word: 'by', logit: 8.4, prob: 64.2, selected: true },
      { word: 'using', logit: 6.8, prob: 21.5, selected: false },
      { word: 'through', logit: 5.1, prob: 10.3, selected: false },
      { word: 'via', logit: 3.5, prob: 4.0, selected: false }
    ];
  });

  selectStep(id: number) {
    this.activeStepId.set(id);
  }

  nextStep() {
    if (this.activeStepId() < 5) {
      this.activeStepId.update(id => id + 1);
    }
  }

  prevStep() {
    if (this.activeStepId() > 1) {
      this.activeStepId.update(id => id - 1);
    }
  }

  toggleAutoPlay() {
    if (this.isPlaying()) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }

  private startAutoPlay() {
    this.isPlaying.set(true);
    this.timerId = setInterval(() => {
      if (this.activeStepId() >= 5) {
        this.activeStepId.set(1);
      } else {
        this.activeStepId.update(id => id + 1);
      }
    }, 4000);
  }

  private stopAutoPlay() {
    this.isPlaying.set(false);
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  getAttentionScore(i: number, j: number): string {
    const head = this.selectedHead();
    const scoresHead1 = [
      ['0.85', '0.10', '0.03', '0.02'],
      ['0.12', '0.78', '0.08', '0.02'],
      ['0.05', '0.35', '0.55', '0.05'],
      ['0.01', '0.04', '0.15', '0.80']
    ];
    const scoresHead2 = [
      ['0.40', '0.45', '0.10', '0.05'],
      ['0.20', '0.50', '0.25', '0.05'],
      ['0.10', '0.40', '0.40', '0.10'],
      ['0.05', '0.15', '0.30', '0.50']
    ];
    const table = head === 1 ? scoresHead1 : scoresHead2;
    return table[i % 4][j % 4];
  }

  getAttentionBg(i: number, j: number): string {
    const score = parseFloat(this.getAttentionScore(i, j));
    const alpha = Math.min(1, Math.max(0.1, score * 1.1));
    return `rgba(168, 85, 247, ${alpha})`;
  }

  getAttentionTextColor(i: number, j: number): string {
    const score = parseFloat(this.getAttentionScore(i, j));
    return score > 0.4 ? '#ffffff' : '#e9d5ff';
  }

  generateNextTokenStep() {
    const options = [' effectively', ' with vectors', ' through attention', ' step by step', ' autoregressively'];
    const randomOption = options[Math.floor(Math.random() * options.length)];
    this.generatedText.update(text => text + randomOption);
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }
}
