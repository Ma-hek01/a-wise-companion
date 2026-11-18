import { createDemoState } from '../data/demoData';
import { deriveOverallExperience } from '../data/journalOptions';
import {
  CompanionState,
  JournalEntry,
  RoutineCompletion,
} from '../types/companion';

const STORAGE_KEY = 'wise_companion_workspace_v1';
const ONBOARDING_STORAGE_KEY = 'wise_companion_onboarding_v1';

export function normalizeJournalEntry(entry: JournalEntry): JournalEntry {
  return {
    ...entry,
    overallExperience: deriveOverallExperience(entry),
    likes: Array.isArray(entry.likes) ? entry.likes : [],
    likesOther:
      typeof entry.likesOther === 'string' && entry.likesOther.trim()
        ? entry.likesOther.trim()
        : undefined,
    dislikes: Array.isArray(entry.dislikes) ? entry.dislikes : [],
    dislikesOther:
      typeof entry.dislikesOther === 'string' && entry.dislikesOther.trim()
        ? entry.dislikesOther.trim()
        : undefined,
    barriers: Array.isArray(entry.barriers) ? entry.barriers : [],
    barriersOther:
      typeof entry.barriersOther === 'string' && entry.barriersOther.trim()
        ? entry.barriersOther.trim()
        : undefined,
    notes: typeof entry.notes === 'string' ? entry.notes : '',
  };
}

export function normalizeRoutineCompletion(
  comp: RoutineCompletion
): RoutineCompletion {
  return {
    ...comp,
    completedProductIds: Array.isArray(comp.completedProductIds)
      ? comp.completedProductIds
      : [],
    skippedProductIds: Array.isArray(comp.skippedProductIds)
      ? comp.skippedProductIds
      : [],
  };
}

export function createEmptyState(): CompanionState {
  return {
    products: [],
    routines: [],
    completions: [],
    journalEntries: [],
    hasDemoData: false,
    lastUpdated: new Date().toISOString(),
  };
}

export function loadWorkspaceState(): CompanionState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialDemo = createDemoState();
      saveWorkspaceState(initialDemo);
      return initialDemo;
    }
    const parsed = JSON.parse(raw) as Partial<CompanionState>;
    return {
      products: Array.isArray(parsed.products) ? parsed.products : [],
      routines: Array.isArray(parsed.routines) ? parsed.routines : [],
      completions: Array.isArray(parsed.completions)
        ? parsed.completions.map(normalizeRoutineCompletion)
        : [],
      journalEntries: Array.isArray(parsed.journalEntries)
        ? parsed.journalEntries.map(normalizeJournalEntry)
        : [],
      hasDemoData: Boolean(parsed.hasDemoData),
      lastUpdated:
        typeof parsed.lastUpdated === 'string'
          ? parsed.lastUpdated
          : new Date().toISOString(),
    };
  } catch {
    const fallback = createDemoState();
    saveWorkspaceState(fallback);
    return fallback;
  }
}

export function saveWorkspaceState(state: CompanionState): void {
  try {
    const payload: CompanionState = {
      ...state,
      lastUpdated: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage quota or privacy mode fallback: keep in-memory state responsive
  }
}

export function resetToDemoState(): CompanionState {
  const freshDemo = createDemoState();
  saveWorkspaceState(freshDemo);
  return freshDemo;
}

export function clearAllWorkspaceData(): CompanionState {
  const empty = createEmptyState();
  saveWorkspaceState(empty);
  return empty;
}

export function hasCompletedOnboarding(): boolean {
  try {
    return window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'done';
  } catch {
    return false;
  }
}

export function markOnboardingComplete(): void {
  try {
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, 'done');
  } catch {
    // Ignore storage restriction
  }
}
