export type AppView =
  | 'dashboard'
  | 'reality-check'
  | 'product-detail'
  | 'routines'
  | 'journal'
  | 'discovery';

export type CatalogCategory =
  | 'Face Care'
  | 'Body Care'
  | 'Hair Care'
  | 'Sun Protection'
  | 'Health & Fitness'
  | "Women's Wellness"
  | 'Sleep & Wellbeing'
  | 'Kits & Combos';

export type LegacyProductCategory =
  | 'Skincare'
  | 'Hair & Scalp'
  | 'Supplements'
  | 'Oral & Wellness'
  | 'Other';

export type ProductCategory = CatalogCategory | LegacyProductCategory;

export type RoutineTimeOfDay = 'Morning' | 'Evening' | 'Custom';

export type ExperienceTone = 'Positive' | 'Neutral' | 'Mixed' | 'Challenging';

export type OverallExperienceChoice = 'Loved it' | 'It was okay' | "Didn't like it";

export type ContinueUsingChoice = 'Yes' | 'Maybe' | 'No' | 'Not sure yet';

export type FrequencyGoal =
  | 'Daily'
  | 'Twice Daily'
  | '3x Weekly'
  | 'Weekly'
  | 'As Needed';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  dateStarted: string; // YYYY-MM-DD
  frequencyGoal: FrequencyGoal;
  expectations: string;
  isDemo?: boolean;
  createdAt: string;
  imageUrl?: string;
  subcategory?: string;
  selectedVariant?: string;
  keyIngredients?: string[];
  officialUrl?: string;
  catalogProductId?: string;
}

export interface Routine {
  id: string;
  name: string;
  timeOfDay: RoutineTimeOfDay;
  productIds: string[];
  notes: string;
  isDemo?: boolean;
  createdAt: string;
}

export interface RoutineCompletion {
  id: string;
  routineId: string;
  date: string; // YYYY-MM-DD
  completedProductIds: string[];
  skippedProductIds?: string[];
  status: 'completed' | 'partial' | 'skipped';
  barrierNote?: string;
  completedAt: string;
  isDemo?: boolean;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  productId?: string;
  satisfaction: 1 | 2 | 3 | 4 | 5;
  experienceSummary: ExperienceTone;
  overallExperience?: OverallExperienceChoice;
  continueUsing?: ContinueUsingChoice;
  likes: string[];
  likesOther?: string;
  dislikes: string[];
  dislikesOther?: string;
  barriers: string[];
  barriersOther?: string;
  notes: string;
  isDemo?: boolean;
  createdAt: string;
}

export type CatalogAvailabilityStatus =
  | 'In Stock'
  | 'Out of Stock'
  | 'Availability not verified';

export interface CatalogVariant {
  label: string;
  sizeOrPack: string;
  url: string;
  availabilityStatus: CatalogAvailabilityStatus;
  sku?: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  category: CatalogCategory;
  subcategory: string;
  imageUrl: string;
  shortDescription: string;
  keyIngredients: string[];
  variants: CatalogVariant[];
  officialUrl: string;
  availabilityStatus: CatalogAvailabilityStatus;
  verificationStatus: string;
  sourceOrigin: 'shop/all' | 'sitemap';
  tags: string[];
}

export interface CompanionState {
  products: Product[];
  routines: Routine[];
  completions: RoutineCompletion[];
  journalEntries: JournalEntry[];
  hasDemoData: boolean;
  lastUpdated: string;
}

export interface ReportEvidenceItem {
  label: string;
  detail: string;
}

export type ExpectationAlignmentStatus =
  | 'aligned'
  | 'partially-aligned'
  | 'different'
  | 'insufficient-data';

export interface ExpectationComparisonItem {
  productId: string;
  productName: string;
  category: ProductCategory;
  dateStarted: string;
  isDemo?: boolean;
  originalExpectation: string;
  status: ExpectationAlignmentStatus;
  statusLabel: string;
  journalCount: number;
  averageSatisfaction: number | null;
  recordedComparisonSummary: string;
  identifiedPatterns: string[];
  interpretation: string;
  suggestion: string;
  matchingSignals: string[];
  gapSignals: string[];
  discomfortDetected?: boolean;
}

export interface ProductRealitySection {
  id: string;
  title: string;
  headlineSummary: string;
  recordedFacts: ReportEvidenceItem[];
  identifiedPatterns: string[];
  possibleInterpretations: string[];
  suggestedActions: string[];
}

export interface RealityNextStep {
  action: string;
  basis: string;
  targetView?: AppView;
}

export interface RealitySummaryHighlight {
  headline: string;
  whatYouRecorded: string;
  patternIdentified: string;
  interpretation: string;
  suggestion?: string;
}

export interface ProductRealityReport {
  generatedAt: string;
  engineMode: 'deterministic-local' | 'ai-assisted';
  scopeLabel: string;
  productId: string | 'all';
  isEmpty: boolean;
  discomfortNotice?: {
    detected: boolean;
    entryCount: number;
    details: string;
  };
  dataCoverage: {
    productsCount: number;
    routinesCount: number;
    completionLogsCount: number;
    journalEntriesCount: number;
    observationSpanDays: number;
  };
  metrics: {
    overallAdherenceRate: number | null;
    averageSatisfaction: number | null;
    satisfactionTrendDelta: number | null;
    totalLikesRecorded: number;
    totalDislikesRecorded: number;
  };
  highlights: {
    whatsGoingWell: RealitySummaryHighlight;
    somethingToReconsider: RealitySummaryHighlight;
    smallSuggestion: RealitySummaryHighlight;
    productExperience: RealitySummaryHighlight;
  };
  continueIntentSummary: {
    yes: number;
    maybe: number;
    no: number;
    notSure: number;
    total: number;
  };
  expectationsVsReality: ExpectationComparisonItem[];
  sections: {
    experienceOverview: ProductRealitySection;
    usageConsistency: ProductRealitySection;
    customerSatisfaction: ProductRealitySection;
    likesAndDislikes: ProductRealitySection;
    recurringObservations: ProductRealitySection;
    possibleBarriers: ProductRealitySection;
    suggestedNextSteps: {
      recordedBasisSummary: string;
      steps: RealityNextStep[];
    };
  };
  methodologyNote: string;
}

export interface RealityCheckInput {
  products: Product[];
  routines: Routine[];
  completions: RoutineCompletion[];
  journalEntries: JournalEntry[];
  selectedProductId: string | 'all';
  referenceDate?: string;
}

export interface RealityCheckProvider {
  readonly id: string;
  readonly mode: 'deterministic-local' | 'ai-assisted';
  generateReport(input: RealityCheckInput): Promise<ProductRealityReport>;
}
