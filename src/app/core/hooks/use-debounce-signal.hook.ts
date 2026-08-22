import { Signal, signal, effect } from '@angular/core';

/**
 * Custom Angular Signal Hook: useDebounceSignal
 * Creates a debounced signal that delays updating its value until `delayMs` milliseconds
 * have elapsed since the last time the source signal value changed.
 */
export function useDebounceSignal<T>(source: Signal<T>, delayMs: number = 300): Signal<T> {
  const debounced = signal<T>(source());

  effect((onCleanup) => {
    const value = source();
    const timer = setTimeout(() => {
      debounced.set(value);
    }, delayMs);

    onCleanup(() => {
      clearTimeout(timer);
    });
  });

  return debounced.asReadonly();
}
