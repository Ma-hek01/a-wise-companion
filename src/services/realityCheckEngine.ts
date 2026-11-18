import {
  deriveOverallExperience,
  formatFeedbackList,
} from '../data/journalOptions';
import {
  ExpectationAlignmentStatus,
  ExpectationComparisonItem,
  JournalEntry,
  Product,
  ProductRealityReport,
  RealityCheckInput,
  RealityCheckProvider,
  RealityNextStep,
  RealitySummaryHighlight,
  ReportEvidenceItem,
  Routine,
  RoutineCompletion,
} from '../types/companion';
import { formatDateKeyToIndian, getTodayIstDateKey } from '../utils/istDate';

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function daysBetween(startDateStr: string, endDateStr: string): number {
  const start = parseDate(startDateStr).getTime();
  const end = parseDate(endDateStr).getTime();
  return Math.max(0, Math.round((end - start) / 86400000));
}

function getTodayStr(referenceDate?: string): string {
  if (referenceDate) return referenceDate;
  return getTodayIstDateKey();
}

function countOccurrences(
  items: string[]
): Array<{ label: string; count: number }> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const normalized = item.trim();
    if (!normalized) continue;
    counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function extractActualDifficulties(entry: JournalEntry): string[] {
  return formatFeedbackList(
    (entry.barriers ?? []).filter(
      (b) => b.trim() && b.trim().toLowerCase() !== 'no difficulty'
    ),
    entry.barriersOther
  );
}

const NEGATED_DISCOMFORT_REGEX =
  /\b(?:no|without|zero|never|not|free of)\s+(?:any\s+)?(?:skin\s+|scalp\s+|stomach\s+)?(?:irritation|discomfort|stinging|burn(?:ing)?|itch(?:ing|y)?|rash(?:es)?|redness|breakout(?:s)?|swelling|pain|soreness|reaction)\b/gi;

const DISCOMFORT_SIGNAL_REGEX =
  /\b(irritat\w*|discomfort|sting(?:s|ing)?|burn(?:s|ing)?|itch(?:y|ing)?|rash(?:es)?|redness|inflamm\w*|breakout\w*|swell(?:ing)?|sore(?:ness)?|pain(?:ful)?|allergic|sensitiv(?:e|ity)\s+reaction|flare(?:-|\s)?up|upset\s+stomach|nausea)\b/i;

export interface DiscomfortDetectionResult {
  detected: boolean;
  entryCount: number;
  matchedLabels: string[];
  affectedProductIds: string[];
  summaryText: string;
}

export function detectDiscomfortSignals(
  entries: JournalEntry[]
): DiscomfortDetectionResult {
  const matchedEntries: JournalEntry[] = [];
  const matchedLabels = new Set<string>();
  const affectedProductIds = new Set<string>();

  for (const entry of entries) {
    const rawParts = [
      entry.notes || '',
      ...formatFeedbackList(entry.dislikes ?? [], entry.dislikesOther),
      ...extractActualDifficulties(entry),
    ];
    const sanitizedText = rawParts
      .join(' | ')
      .replace(NEGATED_DISCOMFORT_REGEX, ' ');

    const match = sanitizedText.match(DISCOMFORT_SIGNAL_REGEX);
    if (match) {
      matchedEntries.push(entry);
      matchedLabels.add(match[0].toLowerCase());
      if (entry.productId) {
        affectedProductIds.add(entry.productId);
      }
    }
  }

  const entryCount = matchedEntries.length;
  const labelsList = Array.from(matchedLabels);
  const summaryText =
    entryCount === 0
      ? ''
      : `${entryCount} ${entryCount === 1 ? 'journal entry' : 'journal entries'} mentioned discomfort or irritation signals (${labelsList.slice(0, 3).join(', ')}).`;

  return {
    detected: entryCount > 0,
    entryCount,
    matchedLabels: labelsList,
    affectedProductIds: Array.from(affectedProductIds),
    summaryText,
  };
}

function extractRecurringThemes(
  entries: JournalEntry[]
): Array<{ theme: string; count: number; totalEntries: number; sampleQuotes: string[] }> {
  if (entries.length < 2) return [];

  const themeMatchers: Array<{
    theme: string;
    test: (entry: JournalEntry, corpus: string) => boolean;
  }> = [
    {
      theme: 'Feel and residue on skin or hair',
      test: (_e, corpus) =>
        /\b(oily residue|greasy|sticky finish|sticky or heavy|sticky or damp|weighs hair down|white cast|feels too thick|heavy residue|pilling)\b/i.test(
          corpus
        ),
    },
    {
      theme: 'Drying or absorption time during routines',
      test: (_e, corpus) =>
        /\b(takes time to dry|takes time to absorb|takes time to rub in|air-dry|slow(?:er)? to absorb|felt damp)\b/i.test(
          corpus
        ),
    },
    {
      theme: 'Busy schedules and routine timing',
      test: (e, corpus) =>
        e.barriers.some((b) =>
          /took too much time|missed my routine|difficult to fit/i.test(b)
        ) ||
        /\b(rushed morning|busy night|busy weeknight|getting home late|skipped on two busy)\b/i.test(
          corpus
        ),
    },
    {
      theme: 'Applicator or packaging handling',
      test: (_e, corpus) =>
        /\b(bulky packaging|awkward packaging|tricky packaging|inconvenient packaging|messy applicator|hard to apply evenly|roll-on pressed|dropper|dispens)\b/i.test(
          corpus
        ),
    },
    {
      theme: 'Remembering the step consistently',
      test: (e, corpus) =>
        e.barriers.some((b) => /forgot to use it/i.test(b)) ||
        e.dislikes.some((d) => /easy to forget/i.test(d)) ||
        /\b(forgot twice|water glass|next to my|automatic routine step)\b/i.test(
          corpus
        ),
    },
    {
      theme: 'Scent or sensory comfort',
      test: (_e, corpus) =>
        /\b(strong scent|strong fragrance|unpleasant taste|gentle feel|gentle on stomach|mild scent)\b/i.test(
          corpus
        ),
    },
  ];

  const results: Array<{
    theme: string;
    count: number;
    totalEntries: number;
    sampleQuotes: string[];
  }> = [];

  for (const matcher of themeMatchers) {
    const matchedEntries = entries.filter((e) => {
      const combined = [
        e.notes || '',
        ...formatFeedbackList(e.likes ?? [], e.likesOther),
        ...formatFeedbackList(e.dislikes ?? [], e.dislikesOther),
        ...extractActualDifficulties(e),
      ].join(' ');
      return matcher.test(e, combined);
    });

    if (matchedEntries.length >= 2) {
      results.push({
        theme: matcher.theme,
        count: matchedEntries.length,
        totalEntries: entries.length,
        sampleQuotes: matchedEntries
          .filter((e) => e.notes.trim().length > 0)
          .slice(0, 2)
          .map(
            (e) =>
              `${formatDateKeyToIndian(e.date)}: "${e.notes.slice(0, 90)}${e.notes.length > 90 ? '…' : ''}"`
          ),
      });
    }
  }

  return results.sort((a, b) => b.count - a.count);
}

const CAUTIOUS_DISCOMFORT_SUGGESTION =
  'Because irritation or discomfort was noted in your log, avoid further experimentation with this product, check official product guidance, or consult a qualified healthcare or dermatology professional.';

function buildExpectationComparison(
  product: Product,
  productEntries: JournalEntry[]
): ExpectationComparisonItem {
  const sortedEntries = [...productEntries].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  const avgSat =
    sortedEntries.length > 0
      ? Number(
          (
            sortedEntries.reduce((sum, e) => sum + e.satisfaction, 0) /
            sortedEntries.length
          ).toFixed(1)
        )
      : null;

  const discomfort = detectDiscomfortSignals(sortedEntries);
  const trimmedExpectation = product.expectations.trim();

  // Safety check even when there is only 0 or 1 entry
  if (!trimmedExpectation) {
    return {
      productId: product.id,
      productName: product.name,
      category: product.category,
      dateStarted: product.dateStarted,
      isDemo: product.isDemo,
      originalExpectation: '',
      status: discomfort.detected ? 'different' : 'insufficient-data',
      statusLabel: discomfort.detected
        ? 'Discomfort noted'
        : 'Not enough information yet',
      journalCount: sortedEntries.length,
      averageSatisfaction: avgSat,
      recordedComparisonSummary:
        sortedEntries.length === 0
          ? 'No personal expectations or experience entries are saved for this product yet.'
          : `${sortedEntries.length} ${sortedEntries.length === 1 ? 'entry is' : 'entries are'} logged${discomfort.detected ? ` (${discomfort.summaryText})` : ''}, and no personal expectations were saved to compare against.`,
      identifiedPatterns:
        sortedEntries.length < 2
          ? [
              `Insufficient entries to identify a recurring pattern (${sortedEntries.length} of at least 2 entries recorded).`,
            ]
          : [],
      interpretation: discomfort.detected
        ? 'Your log mentions irritation or discomfort, which should be treated cautiously even before comparing against an expectation.'
        : 'Without a written expectation, the app cannot compare your experience against what you were hoping to notice.',
      suggestion: discomfort.detected
        ? CAUTIOUS_DISCOMFORT_SUGGESTION
        : 'Edit this product in Routine Companion · My Products to note what you are hoping for.',
      matchingSignals: [],
      gapSignals: discomfort.detected ? [discomfort.summaryText] : [],
      discomfortDetected: discomfort.detected,
    };
  }

  if (sortedEntries.length < 2) {
    return {
      productId: product.id,
      productName: product.name,
      category: product.category,
      dateStarted: product.dateStarted,
      isDemo: product.isDemo,
      originalExpectation: trimmedExpectation,
      status: discomfort.detected ? 'different' : 'insufficient-data',
      statusLabel: discomfort.detected
        ? 'Discomfort noted'
        : 'Not enough information yet',
      journalCount: sortedEntries.length,
      averageSatisfaction: avgSat,
      recordedComparisonSummary:
        sortedEntries.length === 0
          ? '0 experience entries logged for this product so far.'
          : `1 experience entry logged (${deriveOverallExperience(sortedEntries[0])})${discomfort.detected ? `; ${discomfort.summaryText}` : ''}.`,
      identifiedPatterns: [
        `Insufficient data for a pattern yet (${sortedEntries.length} ${sortedEntries.length === 1 ? 'entry' : 'entries'} recorded; at least 2 entries on different days are needed).`,
      ],
      interpretation: discomfort.detected
        ? 'A single entry recorded discomfort or irritation. Even one discomfort note warrants caution rather than testing further.'
        : 'One check-in (or none) is too early to tell whether your day-to-day experience matches what you hoped for.',
      suggestion: discomfort.detected
        ? CAUTIOUS_DISCOMFORT_SUGGESTION
        : 'Log at least 2 experiences on different days when something stands out before drawing a comparison.',
      matchingSignals: [],
      gapSignals: discomfort.detected ? [discomfort.summaryText] : [],
      discomfortDetected: discomfort.detected,
    };
  }

  const allLikesText = sortedEntries.flatMap((e) =>
    formatFeedbackList(e.likes, e.likesOther)
  );
  const allDislikesText = sortedEntries.flatMap((e) =>
    formatFeedbackList(e.dislikes, e.dislikesOther)
  );
  const allDifficulties = sortedEntries.flatMap(extractActualDifficulties);

  const uniqueLikes = countOccurrences(allLikesText);
  const uniqueDislikes = countOccurrences(allDislikesText);
  const uniqueDifficulties = countOccurrences(allDifficulties);

  const repeatedLikes = uniqueLikes.filter((l) => l.count >= 2);
  const repeatedDislikes = uniqueDislikes.filter((d) => d.count >= 2);
  const repeatedDifficulties = uniqueDifficulties.filter((b) => b.count >= 2);

  const identifiedPatterns: string[] = [];
  for (const item of repeatedLikes.slice(0, 2)) {
    identifiedPatterns.push(
      `"${item.label}" liked in ${item.count} of ${sortedEntries.length} journal entries.`
    );
  }
  for (const item of repeatedDislikes.slice(0, 2)) {
    identifiedPatterns.push(
      `"${item.label}" disliked in ${item.count} of ${sortedEntries.length} journal entries.`
    );
  }
  for (const item of repeatedDifficulties.slice(0, 2)) {
    identifiedPatterns.push(
      `"${item.label}" noted as a difficulty in ${item.count} of ${sortedEntries.length} journal entries.`
    );
  }
  if (discomfort.detected) {
    identifiedPatterns.push(discomfort.summaryText);
  }
  if (identifiedPatterns.length === 0) {
    identifiedPatterns.push(
      `No single like, dislike, or difficulty repeated across at least 2 of your ${sortedEntries.length} journal entries yet.`
    );
  }

  const matchingSignals: string[] = [];
  const gapSignals: string[] = [];

  if (repeatedLikes.length > 0) {
    matchingSignals.push(
      `Repeated likes: ${repeatedLikes
        .slice(0, 3)
        .map((l) => `${l.label} (${l.count}/${sortedEntries.length} entries)`)
        .join(', ')}.`
    );
  } else if (uniqueLikes.length > 0) {
    matchingSignals.push(
      `Single-entry likes recorded: ${uniqueLikes
        .slice(0, 3)
        .map((l) => l.label)
        .join(', ')}.`
    );
  }

  if (discomfort.detected) {
    gapSignals.push(discomfort.summaryText);
  }
  if (repeatedDislikes.length > 0) {
    gapSignals.push(
      `Repeated dislikes: ${repeatedDislikes
        .slice(0, 3)
        .map((d) => `${d.label} (${d.count}/${sortedEntries.length} entries)`)
        .join(', ')}.`
    );
  } else if (uniqueDislikes.length > 0) {
    gapSignals.push(
      `Single-entry dislikes recorded: ${uniqueDislikes
        .slice(0, 3)
        .map((d) => d.label)
        .join(', ')}.`
    );
  }

  if (repeatedDifficulties.length > 0) {
    gapSignals.push(
      `Repeated usage difficulties: ${repeatedDifficulties
        .slice(0, 3)
        .map((b) => `${b.label} (${b.count}/${sortedEntries.length} entries)`)
        .join(', ')}.`
    );
  } else if (uniqueDifficulties.length > 0) {
    gapSignals.push(
      `Single-entry difficulty recorded: ${uniqueDifficulties
        .slice(0, 3)
        .map((b) => b.label)
        .join(', ')}.`
    );
  }

  const lovedCount = sortedEntries.filter(
    (e) => deriveOverallExperience(e) === 'Loved it'
  ).length;
  const okayCount = sortedEntries.filter(
    (e) => deriveOverallExperience(e) === 'It was okay'
  ).length;
  const didntLikeCount = sortedEntries.filter(
    (e) => deriveOverallExperience(e) === "Didn't like it"
  ).length;
  const continueYesCount = sortedEntries.filter(
    (e) => e.continueUsing === 'Yes'
  ).length;
  const continueNoCount = sortedEntries.filter(
    (e) => e.continueUsing === 'No'
  ).length;

  const expSummaryCounts: string[] = [];
  if (lovedCount > 0) expSummaryCounts.push(`${lovedCount} Loved it`);
  if (okayCount > 0) expSummaryCounts.push(`${okayCount} It was okay`);
  if (didntLikeCount > 0) {
    expSummaryCounts.push(`${didntLikeCount} Didn't like it`);
  }

  let status: ExpectationAlignmentStatus;
  let statusLabel: string;
  let recordedComparisonSummary: string;
  let interpretation: string;
  let suggestion: string;

  if (discomfort.detected) {
    status = 'different';
    statusLabel = 'Discomfort noted';
    recordedComparisonSummary = `Across ${sortedEntries.length} logged experiences (${expSummaryCounts.join(', ')}), ${discomfort.summaryText}`;
    interpretation =
      'Your entries record irritation or discomfort signals, which conflict with a comfortable routine experience regardless of any positive notes.';
    suggestion = CAUTIOUS_DISCOMFORT_SUGGESTION;
  } else if (
    lovedCount >= Math.ceil(sortedEntries.length / 2) &&
    didntLikeCount === 0 &&
    continueNoCount === 0 &&
    (avgSat ?? 0) >= 3.8 &&
    repeatedDislikes.length === 0
  ) {
    status = 'aligned';
    statusLabel = 'Seems aligned';
    recordedComparisonSummary = `Across ${sortedEntries.length} logged experiences (${expSummaryCounts.join(', ')}), you recorded likes such as ${uniqueLikes.slice(0, 2).map((l) => l.label.toLowerCase()).join(' and ') || 'comfortable daily use'}${continueYesCount > 0 ? ` and selected "Yes" to continue (${continueYesCount}/${sortedEntries.length})` : ''}.`;
    interpretation =
      'Your saved notes so far align comfortably with the experience you wrote down when starting this product.';
    suggestion =
      repeatedDifficulties.length > 0
        ? `No product change looks needed; to make "${repeatedDifficulties[0].label.toLowerCase()}" easier, keep the product stored next to a daily habit you already do (without changing how often or how much you use).`
        : 'Keep your routine steady as-is and follow the product’s official guidance.';
  } else if (
    didntLikeCount > lovedCount ||
    continueNoCount >= 2 ||
    (avgSat ?? 0) < 3.0
  ) {
    status = 'different';
    statusLabel = 'Different from expectations';
    recordedComparisonSummary = `Across ${sortedEntries.length} logged experiences (${expSummaryCounts.join(', ')}), ${
      repeatedDislikes.length > 0
        ? `"${repeatedDislikes[0].label}" appeared in ${repeatedDislikes[0].count} of ${sortedEntries.length} entries`
        : uniqueDislikes.length > 0
        ? `dislikes included "${uniqueDislikes[0].label}"`
        : 'mixed or lower ratings appeared'
    }${continueNoCount > 0 ? ` and you selected "No" to continuing (${continueNoCount}/${sortedEntries.length})` : ''}.`;
    interpretation =
      'Based on your saved logs, day-to-day feel or routine fit has differed from what you originally wrote down as your expectation.';
    suggestion =
      continueNoCount > 0
        ? 'You noted not wanting to continue in multiple logs — consider pausing this item or reviewing whether it still fits your personal routine.'
        : 'Check whether routine placement or time of day (within official label directions) is driving the friction, or decide if you prefer to pause it.';
  } else {
    status = 'partially-aligned';
    statusLabel = 'Partly aligned';
    recordedComparisonSummary = `Across ${sortedEntries.length} logged experiences (${expSummaryCounts.join(', ')}), positive reactions appeared alongside ${
      repeatedDislikes[0]?.label.toLowerCase() ??
      uniqueDislikes[0]?.label.toLowerCase() ??
      uniqueDifficulties[0]?.label.toLowerCase() ??
      'minor practical friction'
    }.`;
    interpretation =
      'Your entries show a mixed experience — some aspects match what you hoped for, while practical feel or routine timing still gets in the way occasionally.';
    suggestion =
      repeatedDifficulties.length > 0
        ? `See if placing the product in a calmer part of your day (within official product directions, without changing dosage or frequency) eases "${repeatedDifficulties[0].label.toLowerCase()}".`
        : 'Watch over a couple more uses whether the recorded dislikes stay minor or begin outweighing what you enjoy.';
  }

  return {
    productId: product.id,
    productName: product.name,
    category: product.category,
    dateStarted: product.dateStarted,
    isDemo: product.isDemo,
    originalExpectation: trimmedExpectation,
    status,
    statusLabel,
    journalCount: sortedEntries.length,
    averageSatisfaction: avgSat,
    recordedComparisonSummary,
    identifiedPatterns,
    interpretation,
    suggestion,
    matchingSignals,
    gapSignals,
    discomfortDetected: discomfort.detected,
  };
}

export class LocalDeterministicRealityEngine implements RealityCheckProvider {
  public readonly id = 'local-deterministic-v1';
  public readonly mode = 'deterministic-local' as const;

  public async generateReport(
    input: RealityCheckInput
  ): Promise<ProductRealityReport> {
    const todayStr = getTodayStr(input.referenceDate);
    const {
      products,
      routines,
      completions,
      journalEntries,
      selectedProductId,
    } = input;

    const selectedProduct: Product | undefined =
      selectedProductId === 'all'
        ? undefined
        : products.find((p) => p.id === selectedProductId);

    const scopedProducts = selectedProduct ? [selectedProduct] : products;

    const scopedRoutines: Routine[] = routines.filter((r) =>
      selectedProduct ? r.productIds.includes(selectedProduct.id) : true
    );
    const scopedRoutineIds = new Set(scopedRoutines.map((r) => r.id));

    const scopedCompletions: RoutineCompletion[] = completions.filter((c) => {
      if (selectedProduct) {
        return (
          scopedRoutineIds.has(c.routineId) ||
          c.completedProductIds.includes(selectedProduct.id)
        );
      }
      return true;
    });

    const scopedEntries: JournalEntry[] = journalEntries
      .filter((e) =>
        selectedProduct ? e.productId === selectedProduct.id : true
      )
      .sort((a, b) => a.date.localeCompare(b.date));

    const scopeLabel = selectedProduct
      ? selectedProduct.name
      : 'All Tracked Products';

    const isEmpty =
      scopedProducts.length === 0 &&
      scopedCompletions.length === 0 &&
      scopedEntries.length === 0;

    // Discomfort / irritation check across scoped entries
    const discomfort = detectDiscomfortSignals(scopedEntries);

    // Observation span
    const allDates = [
      ...scopedProducts.map((p) => p.dateStarted),
      ...scopedCompletions.map((c) => c.date),
      ...scopedEntries.map((e) => e.date),
    ].filter(Boolean);
    const earliestDate = allDates.length > 0 ? allDates.sort()[0] : todayStr;
    const observationSpanDays =
      allDates.length > 0 ? Math.max(1, daysBetween(earliestDate, todayStr)) : 0;

    // Adherence metrics (skipped products never counted as completed)
    let totalChecks = 0;
    let completedChecks = 0;
    const timeOfDayBreakdown: Record<
      string,
      { total: number; completed: number }
    > = {};

    for (const comp of scopedCompletions) {
      const routine = routines.find((r) => r.id === comp.routineId);
      const slot = routine?.timeOfDay ?? 'Custom';
      if (!timeOfDayBreakdown[slot]) {
        timeOfDayBreakdown[slot] = { total: 0, completed: 0 };
      }

      if (selectedProduct) {
        totalChecks += 1;
        timeOfDayBreakdown[slot].total += 1;
        if (comp.completedProductIds.includes(selectedProduct.id)) {
          completedChecks += 1;
          timeOfDayBreakdown[slot].completed += 1;
        }
      } else {
        const expectedInRoutine = routine?.productIds.length || 1;
        totalChecks += expectedInRoutine;
        timeOfDayBreakdown[slot].total += expectedInRoutine;
        const activeIds = new Set(routine?.productIds ?? comp.completedProductIds);
        const doneCount =
          comp.status === 'skipped'
            ? 0
            : Math.min(
                expectedInRoutine,
                comp.completedProductIds.filter((id) => activeIds.has(id)).length
              );
        completedChecks += doneCount;
        timeOfDayBreakdown[slot].completed += doneCount;
      }
    }

    const overallAdherenceRate =
      totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : null;

    // Satisfaction metrics
    const averageSatisfaction =
      scopedEntries.length > 0
        ? Number(
            (
              scopedEntries.reduce((sum, e) => sum + e.satisfaction, 0) /
              scopedEntries.length
            ).toFixed(1)
          )
        : null;

    let satisfactionTrendDelta: number | null = null;
    if (scopedEntries.length >= 4) {
      const mid = Math.floor(scopedEntries.length / 2);
      const firstHalfAvg =
        scopedEntries.slice(0, mid).reduce((s, e) => s + e.satisfaction, 0) /
        mid;
      const secondHalfAvg =
        scopedEntries.slice(mid).reduce((s, e) => s + e.satisfaction, 0) /
        (scopedEntries.length - mid);
      satisfactionTrendDelta = Number((secondHalfAvg - firstHalfAvg).toFixed(1));
    }

    // Likes, dislikes, actual difficulties (excluding "No difficulty")
    const allLikes = scopedEntries.flatMap((e) =>
      formatFeedbackList(e.likes, e.likesOther)
    );
    const allDislikes = scopedEntries.flatMap((e) =>
      formatFeedbackList(e.dislikes, e.dislikesOther)
    );
    const allJournalDifficulties = scopedEntries.flatMap(
      extractActualDifficulties
    );
    const allCompletionBarriers = scopedCompletions
      .map((c) => c.barrierNote)
      .filter(
        (b): b is string =>
          Boolean(b && b.trim() && b.trim().toLowerCase() !== 'skipped today')
      );

    const likeCounts = countOccurrences(allLikes);
    const dislikeCounts = countOccurrences(allDislikes);
    const journalBarrierCounts = countOccurrences(allJournalDifficulties);
    const completionBarrierCounts = countOccurrences(allCompletionBarriers);
    const barrierCounts = countOccurrences([
      ...allJournalDifficulties,
      ...allCompletionBarriers,
    ]);

    const continueIntentSummary = {
      yes: scopedEntries.filter((e) => e.continueUsing === 'Yes').length,
      maybe: scopedEntries.filter((e) => e.continueUsing === 'Maybe').length,
      no: scopedEntries.filter((e) => e.continueUsing === 'No').length,
      notSure: scopedEntries.filter((e) => e.continueUsing === 'Not sure yet')
        .length,
      total: scopedEntries.filter((e) => Boolean(e.continueUsing)).length,
    };

    const expectationsVsReality: ExpectationComparisonItem[] = scopedProducts.map(
      (product) =>
        buildExpectationComparison(
          product,
          journalEntries.filter((e) => e.productId === product.id)
        )
    );

    const lovedEntries = scopedEntries.filter(
      (e) => deriveOverallExperience(e) === 'Loved it'
    );
    const didntLikeEntries = scopedEntries.filter(
      (e) => deriveOverallExperience(e) === "Didn't like it"
    );
    const repeatedLikes = likeCounts.filter((l) => l.count >= 2);
    const repeatedDislikes = dislikeCounts.filter((d) => d.count >= 2);
    const repeatedBarriers = barrierCounts.filter((b) => b.count >= 2);

    const alignedProducts = expectationsVsReality.filter(
      (e) => e.status === 'aligned'
    );
    const differentProducts = expectationsVsReality.filter(
      (e) => e.status === 'different'
    );

    // 1. What's going well?
    let whatsGoingWell: RealitySummaryHighlight;
    if (
      scopedEntries.length < 2 &&
      (overallAdherenceRate === null || scopedCompletions.length < 2)
    ) {
      whatsGoingWell = {
        headline: 'Still gathering early experiences',
        whatYouRecorded:
          scopedEntries.length === 0
            ? 'No experience check-ins are logged for this scope yet.'
            : `${scopedEntries.length} experience entry logged so far.`,
        patternIdentified:
          'Insufficient data to identify a positive pattern yet (at least 2 supporting entries needed).',
        interpretation:
          'Log at least 2 quick experiences on different days before looking for recurring comfort patterns.',
      };
    } else if (alignedProducts.length > 0 || lovedEntries.length >= 2) {
      const wellProductNames =
        alignedProducts.length > 0
          ? alignedProducts.map((p) => p.productName)
          : Array.from(
              new Set(
                lovedEntries
                  .map(
                    (e) => scopedProducts.find((p) => p.id === e.productId)?.name
                  )
                  .filter((n): n is string => Boolean(n))
              )
            );
      const repeatedLikeLabels = repeatedLikes
        .slice(0, 3)
        .map((l) => `${l.label} (${l.count} entries)`);

      whatsGoingWell = {
        headline:
          wellProductNames.length > 0
            ? `${wellProductNames.slice(0, 2).join(' and ')} ${wellProductNames.length === 1 ? 'shows' : 'show'} comfortable routine fit`
            : 'Steady positive experiences in your routine',
        whatYouRecorded: `You recorded "Loved it" in ${lovedEntries.length} of ${scopedEntries.length} journal ${scopedEntries.length === 1 ? 'entry' : 'entries'}${overallAdherenceRate !== null ? `, with ${overallAdherenceRate}% routine check-in completion across ${scopedCompletions.length} sessions` : ''}.`,
        patternIdentified:
          repeatedLikeLabels.length > 0
            ? `Repeated likes across entries: ${repeatedLikeLabels.join(', ')}.`
            : `"Loved it" appeared in ${lovedEntries.length} separate journal entries.`,
        interpretation:
          'Based on your saved logs, these items feel comfortable in daily use and align with what you recorded hoping for.',
      };
    } else if (overallAdherenceRate !== null && overallAdherenceRate >= 70) {
      whatsGoingWell = {
        headline: 'Steady routine check-ins recorded',
        whatYouRecorded: `Routine check-ins show ${overallAdherenceRate}% completion across ${scopedCompletions.length} logged sessions.`,
        patternIdentified: `Consistent check-ins across ${scopedCompletions.length} routine sessions; ${scopedEntries.length} journal ${scopedEntries.length === 1 ? 'entry' : 'entries'} saved so far.`,
        interpretation:
          'Routine consistency is steady in your logs, even while your written experience notes remain early or mixed.',
      };
    } else {
      whatsGoingWell = {
        headline: 'Early impressions are recorded, with mixed comfort so far',
        whatYouRecorded: `${scopedEntries.length} journal ${scopedEntries.length === 1 ? 'entry' : 'entries'} saved${likeCounts.length > 0 ? `, noting likes such as ${likeCounts.slice(0, 2).map((l) => l.label).join(', ')}` : ''}.`,
        patternIdentified:
          repeatedLikes.length > 0
            ? `Repeated likes: ${repeatedLikes.slice(0, 2).map((l) => `${l.label} (${l.count} entries)`).join(', ')}.`
            : 'No strong positive pattern repeats across multiple entries yet.',
        interpretation:
          'More check-ins on different days are needed to see whether positive comfort holds over time.',
      };
    }

    // 2. Something to reconsider
    let somethingToReconsider: RealitySummaryHighlight;
    if (discomfort.detected) {
      somethingToReconsider = {
        headline:
          discomfort.entryCount >= 2
            ? 'Discomfort or irritation noted across multiple entries'
            : 'Discomfort or irritation noted in an entry',
        whatYouRecorded: discomfort.summaryText,
        patternIdentified:
          discomfort.entryCount >= 2
            ? `Discomfort/irritation terms appeared in ${discomfort.entryCount} of ${scopedEntries.length} journal entries.`
            : 'Single observation recorded (1 entry — treated cautiously as a comfort notice, not a multi-entry pattern).',
        interpretation:
          'Any recorded irritation or discomfort should take priority over routine convenience and should not be tested further through trial-and-error.',
      };
    } else if (scopedEntries.length < 2) {
      somethingToReconsider = {
        headline: 'Nothing stands out to reconsider yet',
        whatYouRecorded: `${scopedEntries.length} experience ${scopedEntries.length === 1 ? 'entry' : 'entries'} logged so far.`,
        patternIdentified:
          'Insufficient data — at least 2 observations are required before flagging a recurring pattern.',
        interpretation:
          'A single entry is never treated as a recurring issue unless discomfort or irritation is recorded.',
      };
    } else if (
      differentProducts.length > 0 ||
      didntLikeEntries.length >= 2 ||
      repeatedDislikes.length > 0 ||
      continueIntentSummary.no >= 2
    ) {
      const targetNames =
        differentProducts.length > 0
          ? differentProducts.map((p) => p.productName)
          : Array.from(
              new Set(
                didntLikeEntries
                  .map(
                    (e) => scopedProducts.find((p) => p.id === e.productId)?.name
                  )
                  .filter((n): n is string => Boolean(n))
              )
            );
      const topDislikesList = (
        repeatedDislikes.length > 0 ? repeatedDislikes : dislikeCounts
      )
        .slice(0, 3)
        .map((d) => `${d.label} (${d.count} ${d.count === 1 ? 'entry' : 'entries'})`);

      const patternBits: string[] = [];
      if (repeatedDislikes.length > 0) {
        patternBits.push(
          `Repeated dislikes: ${repeatedDislikes
            .slice(0, 3)
            .map((d) => `${d.label} (${d.count} entries)`)
            .join(', ')}`
        );
      }
      if (didntLikeEntries.length >= 2) {
        patternBits.push(
          `"Didn't like it" logged in ${didntLikeEntries.length} entries`
        );
      }
      if (continueIntentSummary.no >= 2) {
        patternBits.push(
          `"No" to continuing selected in ${continueIntentSummary.no} entries`
        );
      }

      somethingToReconsider = {
        headline:
          targetNames.length > 0
            ? `${targetNames.slice(0, 2).join(' and ')} may need a second look`
            : 'Recurring feel or routine friction in your logs',
        whatYouRecorded: `${didntLikeEntries.length > 0 ? `"Didn't like it" logged in ${didntLikeEntries.length} of ${scopedEntries.length} entries` : `Mixed experiences across ${scopedEntries.length} entries`}${topDislikesList.length > 0 ? `, with dislikes: ${topDislikesList.join(', ')}` : ''}${continueIntentSummary.no > 0 ? `, and "No" to continuing (${continueIntentSummary.no}×)` : ''}.`,
        patternIdentified:
          patternBits.join(' · ') ||
          `Friction signals appeared across ${scopedEntries.length} journal entries.`,
        interpretation:
          'When the same dislike or "No" continue vote repeats across separate entries, that friction often makes steady routine use unappealing.',
      };
    } else if (dislikeCounts.length >= 1) {
      somethingToReconsider = {
        headline: 'Isolated dislike recorded — not a recurring pattern yet',
        whatYouRecorded: `Single-entry dislikes noted across ${scopedEntries.length} entries: ${dislikeCounts.slice(0, 2).map((d) => `"${d.label}" (${d.count}×)`).join(', ')}.`,
        patternIdentified:
          'No dislike repeated across 2 or more journal entries.',
        interpretation:
          'One-off dislikes are not enough to call a recurring pattern. Watch gently over future entries to see if they repeat.',
      };
    } else {
      somethingToReconsider = {
        headline: 'No recurring concerns in your current logs',
        whatYouRecorded: `Across ${scopedEntries.length} entries, no dislikes or "No" continue responses were recorded.`,
        patternIdentified: 'No negative pattern identified in your saved records.',
        interpretation:
          'Nothing in your saved journal notes currently suggests friction or discomfort.',
      };
    }

    // 3. A small suggestion
    let smallSuggestion: RealitySummaryHighlight;
    const topRepeatedBarrier = repeatedBarriers[0];
    if (scopedProducts.length === 0) {
      smallSuggestion = {
        headline: 'Start by adding one product you use today',
        whatYouRecorded: '0 products are currently tracked.',
        patternIdentified: 'Insufficient data — no tracked products yet.',
        interpretation:
          'Tracking even one everyday item connects your routine check-ins and experience notes automatically.',
        suggestion:
          'Add a product in Routine Companion · My Products or Explore Products.',
      };
    } else if (discomfort.detected) {
      smallSuggestion = {
        headline: 'Prioritize comfort and check official guidance',
        whatYouRecorded: discomfort.summaryText,
        patternIdentified:
          discomfort.entryCount >= 2
            ? `Discomfort recorded in ${discomfort.entryCount} entries.`
            : 'Discomfort recorded in 1 entry.',
        interpretation:
          'When skin, scalp, or digestive discomfort is noted, further routine experimentation is not recommended.',
        suggestion: CAUTIOUS_DISCOMFORT_SUGGESTION,
      };
    } else if (scopedEntries.length < 2) {
      smallSuggestion = {
        headline: 'Log one more reaction when something stands out',
        whatYouRecorded: `${scopedEntries.length} experience ${scopedEntries.length === 1 ? 'entry' : 'entries'} logged so far.`,
        patternIdentified:
          'Insufficient observations for pattern-based suggestions yet (needs at least 2 entries).',
        interpretation:
          'You never need to log daily — 2 or 3 check-ins on different days are enough for Reality Check to compare against your expectations.',
        suggestion:
          'Tap Log Experience next time you notice how a product feels.',
      };
    } else if (topRepeatedBarrier) {
      const bLower = topRepeatedBarrier.label.toLowerCase();
      let practicalTip =
        'Keep this item in a visible spot connected to an everyday habit you already keep, while following its official instructions.';
      if (bLower.includes('forgot')) {
        practicalTip =
          'Place it next to something automatic (such as your toothbrush or bedside water bottle) so recall takes less effort, without altering how often the product is meant to be used.';
      } else if (bLower.includes('time') || bLower.includes('took too much')) {
        practicalTip =
          'If official label directions allow flexibility in time of day, move this step into a calmer part of your schedule rather than rushed mornings.';
      } else if (bLower.includes('missed') || bLower.includes('fit')) {
        practicalTip =
          'Keep your routine view focused on 1–2 priority products on busy days while following each product’s official guidance.';
      } else if (bLower.includes('ran out')) {
        practicalTip =
          'Review your saved likes and dislikes in Reality Check before deciding whether to restock or replace it.';
      } else if (bLower.includes('texture') || bLower.includes('residue')) {
        practicalTip =
          'If label directions allow, leave a calmer buffer window before dressing or going to sleep, without changing dosage or application instructions.';
      }

      smallSuggestion = {
        headline: `Work around "${topRepeatedBarrier.label.toLowerCase()}"`,
        whatYouRecorded: `"${topRepeatedBarrier.label}" appeared ${topRepeatedBarrier.count} times across your difficulty logs and skip notes.`,
        patternIdentified: `Recurring difficulty (${topRepeatedBarrier.count} occurrences): ${topRepeatedBarrier.label}.`,
        interpretation:
          'Repeated missed uses in your logs point more to everyday timing or placement than the product’s purpose.',
        suggestion: practicalTip,
      };
    } else if (
      repeatedDislikes.some((d) =>
        /(sticky|residue|oily|drying|time to dry|heavy)/i.test(d.label)
      )
    ) {
      const feelDislike = repeatedDislikes.find((d) =>
        /(sticky|residue|oily|drying|time to dry|heavy)/i.test(d.label)
      )!;
      smallSuggestion = {
        headline: 'Give slower-absorbing steps a calmer buffer window',
        whatYouRecorded: `"${feelDislike.label}" was recorded in ${feelDislike.count} of ${scopedEntries.length} entries.`,
        patternIdentified: `Repeated feel/finish dislike (${feelDislike.count} entries): ${feelDislike.label}.`,
        interpretation:
          'Texture or drying friction often feels most noticeable right before dressing or going straight to bed.',
        suggestion:
          'Where official label directions permit, schedule this step when you have a slightly calmer window before dressing or sleep, without changing how much or how often you apply.',
      };
    } else {
      smallSuggestion = {
        headline: 'Keep things simple and log only when something changes',
        whatYouRecorded: `${scopedEntries.length} entries logged with no repeated usage barriers.`,
        patternIdentified:
          'No recurring barrier pattern detected across your saved entries.',
        interpretation:
          'Your saved logs do not show a repeated routine obstacle right now.',
        suggestion:
          'Open Progress Journal only when you notice something new worth remembering, and always follow official product directions.',
      };
    }

    // 4. Your product experience summary
    const alignedCount = expectationsVsReality.filter(
      (e) => e.status === 'aligned'
    ).length;
    const partlyCount = expectationsVsReality.filter(
      (e) => e.status === 'partially-aligned'
    ).length;
    const diffCount = expectationsVsReality.filter(
      (e) => e.status === 'different'
    ).length;
    const earlyCount = expectationsVsReality.filter(
      (e) => e.status === 'insufficient-data'
    ).length;

    const statusBits: string[] = [];
    if (alignedCount > 0) statusBits.push(`${alignedCount} aligned`);
    if (partlyCount > 0) statusBits.push(`${partlyCount} partly aligned`);
    if (diffCount > 0) statusBits.push(`${diffCount} different / caution`);
    if (earlyCount > 0) statusBits.push(`${earlyCount} still gathering notes`);

    const productExperience: RealitySummaryHighlight = {
      headline:
        scopedProducts.length === 0
          ? 'No products tracked yet'
          : statusBits.join(' · ') || `${scopedProducts.length} product(s) tracked`,
      whatYouRecorded:
        continueIntentSummary.total > 0
          ? `Continue-using responses across ${continueIntentSummary.total} entries: ${continueIntentSummary.yes} Yes, ${continueIntentSummary.maybe} Maybe, ${continueIntentSummary.no} No${continueIntentSummary.notSure > 0 ? `, ${continueIntentSummary.notSure} Not sure yet` : ''}.`
          : `Tracking ${scopedProducts.length} product(s) across ${scopedEntries.length} experience entry(ies).`,
      patternIdentified:
        scopedEntries.length < 2
          ? 'Insufficient entries across tracked products to summarize multi-entry patterns yet.'
          : `${alignedCount} product(s) show repeated alignment; ${diffCount} show divergence or caution signals.`,
      interpretation:
        earlyCount === scopedProducts.length && scopedProducts.length > 0
          ? 'Tracked items need at least 2 experience entries each before comparing expectations reliably.'
          : 'Product cards below separate what you wrote down, identified patterns, cautious interpretations, and next steps.',
    };

    // Detailed audit sections (placed behind expandable toggles in UI)
    const overviewFacts: ReportEvidenceItem[] = [];
    const overviewPatterns: string[] = [];
    const overviewInterpretations: string[] = [];
    const overviewActions: string[] = [];

    if (scopedProducts.length > 0) {
      const categories = Array.from(
        new Set(scopedProducts.map((p) => p.category))
      );
      overviewFacts.push({
        label: 'Products tracked',
        detail: `${scopedProducts.length} ${scopedProducts.length === 1 ? 'product' : 'products'} across ${categories.join(', ')} (earliest start ${formatDateKeyToIndian(earliestDate)}, ${observationSpanDays} days tracked).`,
      });
    } else {
      overviewFacts.push({
        label: 'Products tracked',
        detail: 'No products added to this view yet.',
      });
    }

    if (scopedEntries.length > 0) {
      const expCounts = countOccurrences(
        scopedEntries.map((e) => deriveOverallExperience(e))
      );
      overviewFacts.push({
        label: 'Experience logs',
        detail: `${scopedEntries.length} ${scopedEntries.length === 1 ? 'entry' : 'entries'} recorded: ${expCounts.map((t) => `${t.label} (${t.count})`).join(', ')}.`,
      });
    } else {
      overviewFacts.push({
        label: 'Experience logs',
        detail: 'No journal entries saved for this scope yet.',
      });
    }

    if (continueIntentSummary.total > 0) {
      overviewFacts.push({
        label: 'Would continue using',
        detail: `Yes (${continueIntentSummary.yes}), Maybe (${continueIntentSummary.maybe}), No (${continueIntentSummary.no}), Not sure yet (${continueIntentSummary.notSure}).`,
      });
    }

    if (selectedProduct && selectedProduct.expectations) {
      overviewFacts.push({
        label: 'Original expectation',
        detail: `"${selectedProduct.expectations}" (${selectedProduct.frequencyGoal}).`,
      });
    }

    if (scopedEntries.length < 2) {
      overviewPatterns.push(
        `Insufficient journal entries (${scopedEntries.length} saved) to establish a multi-entry experience pattern.`
      );
    } else {
      if (lovedEntries.length >= 2) {
        overviewPatterns.push(
          `"Loved it" recorded in ${lovedEntries.length} of ${scopedEntries.length} entries.`
        );
      }
      if (didntLikeEntries.length >= 2) {
        overviewPatterns.push(
          `"Didn't like it" recorded in ${didntLikeEntries.length} of ${scopedEntries.length} entries.`
        );
      }
      if (discomfort.detected) {
        overviewPatterns.push(discomfort.summaryText);
      }
      if (overviewPatterns.length === 0) {
        overviewPatterns.push(
          `Experiences across ${scopedEntries.length} entries are mixed without a single dominant rating.`
        );
      }
    }

    if (discomfort.detected) {
      overviewInterpretations.push(
        'Your notes include irritation or discomfort signals, which outweigh overall rating averages.'
      );
      overviewActions.push(CAUTIOUS_DISCOMFORT_SUGGESTION);
    } else if (scopedProducts.length > 0 && scopedEntries.length === 0) {
      overviewInterpretations.push(
        'Your products are listed, but without experience notes there is insufficient data to interpret daily comfort.'
      );
      overviewActions.push(
        'Log at least 2 quick check-ins in Progress Journal when you notice how a product feels.'
      );
    } else if (scopedEntries.length === 1) {
      overviewInterpretations.push(
        'Only 1 entry is saved so far, which is too early for a reliable takeaway.'
      );
      overviewActions.push(
        'Record 1 or 2 more observations on different days when something stands out.'
      );
    } else if (scopedEntries.length >= 2 && averageSatisfaction !== null) {
      if (averageSatisfaction >= 4) {
        overviewInterpretations.push(
          'Your logs point to a mostly comfortable day-to-day experience so far.'
        );
        overviewActions.push(
          'Keep logging occasional check-ins only when something changes.'
        );
      } else if (averageSatisfaction >= 3) {
        overviewInterpretations.push(
          'Your entries show a mixed experience, often shaped by feel or routine timing rather than one single issue.'
        );
        overviewActions.push(
          'Review the entries marked "It was okay" or "Didn\'t like it" to see whether feel or timing is getting in the way.'
        );
      } else {
        overviewInterpretations.push(
          'Repeated lower experiences indicate recurring day-to-day friction between how the product feels and what you expected.'
        );
        overviewActions.push(
          'Review your recurring dislikes and difficulties before deciding whether to pause this item.'
        );
      }
    }

    const overviewHeadline = discomfort.detected
      ? `Comfort or irritation notice recorded (${discomfort.entryCount} ${discomfort.entryCount === 1 ? 'entry' : 'entries'}).`
      : scopedEntries.length === 0
      ? 'Products are tracked, but experience notes are still needed.'
      : scopedEntries.length === 1
      ? '1 experience note recorded — too early for a pattern.'
      : averageSatisfaction !== null && averageSatisfaction >= 4
      ? `Generally comfortable experience across ${scopedEntries.length} logged notes.`
      : averageSatisfaction !== null && averageSatisfaction >= 3
      ? `Mixed day-to-day experience across ${scopedEntries.length} logged notes.`
      : `Recurring friction across ${scopedEntries.length} logged notes.`;

    // 2. Usage Consistency
    const consistencyFacts: ReportEvidenceItem[] = [];
    const consistencyPatterns: string[] = [];
    const consistencyInterpretations: string[] = [];
    const consistencyActions: string[] = [];

    if (scopedRoutines.length > 0) {
      consistencyFacts.push({
        label: 'Routines',
        detail: `${scopedRoutines.length} ${scopedRoutines.length === 1 ? 'routine' : 'routines'} (${scopedRoutines.map((r) => `${r.name} · ${r.timeOfDay}`).join('; ')}).`,
      });
    } else {
      consistencyFacts.push({
        label: 'Routines',
        detail: 'No routines are linked to this product scope yet.',
      });
    }

    if (overallAdherenceRate !== null) {
      const skippedCount = scopedCompletions.filter(
        (c) => c.status === 'skipped'
      ).length;
      const partialCount = scopedCompletions.filter(
        (c) => c.status === 'partial'
      ).length;
      consistencyFacts.push({
        label: 'Completion rate',
        detail: `${overallAdherenceRate}% completed across ${scopedCompletions.length} logged sessions (${partialCount} partial, ${skippedCount} skipped; skipped steps never count as completed).`,
      });

      const slotDetails = Object.entries(timeOfDayBreakdown)
        .filter(([, val]) => val.total > 0)
        .map(
          ([slot, val]) =>
            `${slot}: ${Math.round((val.completed / val.total) * 100)}%`
        );
      if (slotDetails.length > 0) {
        consistencyFacts.push({
          label: 'By time of day',
          detail: slotDetails.join(' · '),
        });
      }
    } else {
      consistencyFacts.push({
        label: 'Completion rate',
        detail: 'No routine check-ins saved yet.',
      });
    }

    if (scopedCompletions.length < 2 || overallAdherenceRate === null) {
      consistencyPatterns.push(
        `Insufficient routine check-ins (${scopedCompletions.length} logged) to identify a consistency pattern.`
      );
    } else {
      consistencyPatterns.push(
        `${overallAdherenceRate}% completion across ${scopedCompletions.length} logged routine sessions.`
      );
      const morning = timeOfDayBreakdown['Morning'];
      const evening = timeOfDayBreakdown['Evening'];
      if (morning && evening && morning.total >= 2 && evening.total >= 2) {
        const amRate = morning.completed / morning.total;
        const pmRate = evening.completed / evening.total;
        if (amRate - pmRate >= 0.15) {
          consistencyPatterns.push(
            `Morning completion (${Math.round(amRate * 100)}%) is higher than evening completion (${Math.round(pmRate * 100)}%).`
          );
          consistencyInterpretations.push(
            'Morning check-ins are steadier than evening ones in your logs, which may mean end-of-day tiredness gets in the way.'
          );
          if (!discomfort.detected) {
            consistencyActions.push(
              'Keep your evening checklist simpler or place evening products near something you never skip (within official product directions).'
            );
          }
        } else if (pmRate - amRate >= 0.15) {
          consistencyPatterns.push(
            `Evening completion (${Math.round(pmRate * 100)}%) is higher than morning completion (${Math.round(amRate * 100)}%).`
          );
          consistencyInterpretations.push(
            'Evening check-ins are steadier than morning ones, suggesting rushed mornings may limit extra routine steps.'
          );
          if (!discomfort.detected) {
            consistencyActions.push(
              'Keep morning steps minimal and schedule slower steps in a calmer routine window only if official label directions allow.'
            );
          }
        }
      }
      if (overallAdherenceRate < 65) {
        consistencyInterpretations.push(
          'Completion is below two-thirds of logged sessions, which often points to routine timing or too many steps in one slot.'
        );
        if (consistencyActions.length === 0 && !discomfort.detected) {
          consistencyActions.push(
            'Keep your daily checklist focused on 1–2 priority steps while following each product’s official directions.'
          );
        }
      } else if (overallAdherenceRate >= 80) {
        consistencyInterpretations.push(
          'Your routine check-ins are steady, giving clear context for your journal notes.'
        );
      }
    }

    if (discomfort.detected && consistencyActions.length === 0) {
      consistencyActions.push(CAUTIOUS_DISCOMFORT_SUGGESTION);
    } else if (overallAdherenceRate === null && scopedRoutines.length > 0) {
      consistencyInterpretations.push(
        'Routines are set up, so checking them off over a few days will show actual routine fit.'
      );
      consistencyActions.push(
        'Check off today’s steps in Routine Companion to build a baseline.'
      );
    }

    const consistencyHeadline =
      overallAdherenceRate === null
        ? 'No routine check-ins recorded yet.'
        : `${overallAdherenceRate}% routine completion across ${scopedCompletions.length} logged sessions.`;

    // 3. Experience Trends
    const satisfactionFacts: ReportEvidenceItem[] = [];
    const satisfactionPatterns: string[] = [];
    const satisfactionInterpretations: string[] = [];
    const satisfactionActions: string[] = [];

    if (averageSatisfaction !== null) {
      satisfactionFacts.push({
        label: 'Experience breakdown',
        detail: `${lovedEntries.length} Loved it · ${scopedEntries.filter((e) => deriveOverallExperience(e) === 'It was okay').length} It was okay · ${didntLikeEntries.length} Didn't like it (equivalent avg ${averageSatisfaction}/5 across ${scopedEntries.length} entries).`,
      });

      if (satisfactionTrendDelta !== null) {
        const direction =
          satisfactionTrendDelta > 0.2
            ? `trended upward (+${satisfactionTrendDelta})`
            : satisfactionTrendDelta < -0.2
            ? `trended downward (${satisfactionTrendDelta})`
            : 'stayed steady';
        satisfactionFacts.push({
          label: 'Change over time',
          detail: `Comparing earlier logs to recent ones across ${scopedEntries.length} entries, experience ${direction}.`,
        });
        satisfactionPatterns.push(
          `Across ${scopedEntries.length} entries, experience ${direction}.`
        );
      } else {
        satisfactionPatterns.push(
          `Insufficient entries for a multi-period trend (${scopedEntries.length} logged; at least 4 needed).`
        );
      }
    } else {
      satisfactionFacts.push({
        label: 'Experience breakdown',
        detail: 'No experience entries recorded yet.',
      });
      satisfactionPatterns.push(
        'Insufficient data — no journal entries recorded yet.'
      );
    }

    if (discomfort.detected) {
      satisfactionInterpretations.push(
        'Because discomfort or irritation was noted, trend averages alone do not reflect safety or comfort.'
      );
      satisfactionActions.push(CAUTIOUS_DISCOMFORT_SUGGESTION);
    } else if (averageSatisfaction !== null && satisfactionTrendDelta !== null) {
      if (satisfactionTrendDelta < -0.3) {
        satisfactionInterpretations.push(
          'Recent logs dipped compared to your first entries, which can happen when small feel or routine annoyances add up.'
        );
        satisfactionActions.push(
          'Compare your newest notes against your earliest ones to spot what changed.'
        );
      } else if (satisfactionTrendDelta > 0.3) {
        satisfactionInterpretations.push(
          'Experiences improved over your logged period, suggesting the routine step felt easier to live with over time.'
        );
      } else {
        satisfactionInterpretations.push(
          'Your logged experiences stayed steady without sharp ups or downs.'
        );
      }
    }

    const satisfactionHeadline =
      averageSatisfaction === null
        ? 'No experiences logged yet.'
        : `${lovedEntries.length} of ${scopedEntries.length} entries rated "Loved it" (equivalent avg ${averageSatisfaction}/5).`;

    // 4. Likes & Dislikes
    const likesDislikesFacts: ReportEvidenceItem[] = [];
    const likesDislikesPatterns: string[] = [];
    const likesDislikesInterpretations: string[] = [];
    const likesDislikesActions: string[] = [];

    likesDislikesFacts.push({
      label: 'Likes',
      detail:
        likeCounts.length > 0
          ? likeCounts
              .slice(0, 6)
              .map((l) => (l.count > 1 ? `${l.label} (×${l.count})` : l.label))
              .join(', ')
          : 'None selected yet.',
    });

    likesDislikesFacts.push({
      label: 'Dislikes',
      detail:
        dislikeCounts.length > 0
          ? dislikeCounts
              .slice(0, 6)
              .map((d) => (d.count > 1 ? `${d.label} (×${d.count})` : d.label))
              .join(', ')
          : 'No dislikes selected yet.',
    });

    if (repeatedLikes.length > 0) {
      likesDislikesPatterns.push(
        `Repeated likes (2+ entries): ${repeatedLikes
          .slice(0, 3)
          .map((l) => `${l.label} (${l.count} entries)`)
          .join(', ')}.`
      );
    }
    if (repeatedDislikes.length > 0) {
      likesDislikesPatterns.push(
        `Repeated dislikes (2+ entries): ${repeatedDislikes
          .slice(0, 3)
          .map((d) => `${d.label} (${d.count} entries)`)
          .join(', ')}.`
      );
    }
    if (likesDislikesPatterns.length === 0) {
      likesDislikesPatterns.push(
        likeCounts.length === 0 && dislikeCounts.length === 0
          ? 'No likes or dislikes recorded yet.'
          : 'No single like or dislike appeared in 2 or more entries yet.'
      );
    }

    if (discomfort.detected) {
      likesDislikesInterpretations.push(
        'Discomfort or irritation signals appear in your feedback and should be handled cautiously.'
      );
      likesDislikesActions.push(CAUTIOUS_DISCOMFORT_SUGGESTION);
    } else if (repeatedLikes.length > 0 && repeatedDislikes.length > 0) {
      likesDislikesInterpretations.push(
        'Even when a product feels comfortable in parts, repeated practical dislikes—like stickiness, drying time, or packaging—can make daily use less appealing.'
      );
      likesDislikesActions.push(
        `Review whether "${repeatedDislikes[0].label}" is tied to timing or packaging, without changing dosage, frequency, or official usage instructions.`
      );
    } else if (likeCounts.length > 0 && dislikeCounts.length > 0) {
      likesDislikesInterpretations.push(
        'You noted both positive and negative points, though isolated dislikes are not yet a repeated pattern.'
      );
    }

    const likesDislikesHeadline =
      likeCounts.length === 0 && dislikeCounts.length === 0
        ? 'No likes or dislikes selected yet.'
        : `${likeCounts.length} distinct likes and ${dislikeCounts.length} dislikes recorded.`;

    // 5. Repeating Observations
    const recurringFacts: ReportEvidenceItem[] = [];
    const recurringPatterns: string[] = [];
    const recurringInterpretations: string[] = [];
    const recurringActions: string[] = [];

    const recurringThemes = extractRecurringThemes(scopedEntries);
    if (recurringThemes.length > 0) {
      for (const theme of recurringThemes.slice(0, 3)) {
        recurringFacts.push({
          label: `${theme.theme} (${theme.count} of ${theme.totalEntries} entries)`,
          detail:
            theme.sampleQuotes.length > 0
              ? theme.sampleQuotes.join(' | ')
              : `Supported by ${theme.count} saved journal entries.`,
        });
        recurringPatterns.push(
          `${theme.theme} — recorded in ${theme.count} of ${theme.totalEntries} journal entries.`
        );
      }
      recurringInterpretations.push(
        `"${recurringThemes[0].theme}" appears across ${recurringThemes[0].count} separate entries, meaning it consistently shapes how this routine feels.`
      );
      if (discomfort.detected) {
        recurringActions.push(CAUTIOUS_DISCOMFORT_SUGGESTION);
      } else {
        recurringActions.push(
          `Use your notes on "${recurringThemes[0].theme.toLowerCase()}" to decide whether routine timing or storage needs a small adjustment (within official product directions).`
        );
      }
    } else {
      recurringFacts.push({
        label: 'Journal notes',
        detail:
          scopedEntries.length > 0
            ? `${scopedEntries.length} ${scopedEntries.length === 1 ? 'entry' : 'entries'} saved.`
            : 'No written notes saved yet.',
      });
      recurringPatterns.push(
        scopedEntries.length < 2
          ? `Insufficient entries (${scopedEntries.length} logged) — at least 2 entries are required to identify repeating themes.`
          : 'No written theme repeated across 2 or more journal entries.'
      );
    }

    const recurringHeadline =
      recurringThemes.length > 0
        ? `Top repeating theme: ${recurringThemes[0].theme} (${recurringThemes[0].count} of ${scopedEntries.length} entries).`
        : 'No theme repeats across multiple notes yet.';

    // 6. Usage Difficulties / Barriers
    const barriersFacts: ReportEvidenceItem[] = [];
    const barriersPatterns: string[] = [];
    const barriersInterpretations: string[] = [];
    const barriersActions: string[] = [];

    if (barrierCounts.length > 0) {
      barriersFacts.push({
        label: 'Logged difficulties & skip notes',
        detail: barrierCounts
          .map(
            (b) =>
              `${b.label} (${b.count} ${b.count === 1 ? 'time' : 'times'})`
          )
          .join(' · '),
      });

      if (repeatedBarriers.length > 0) {
        for (const rb of repeatedBarriers.slice(0, 3)) {
          const jCount =
            journalBarrierCounts.find((j) => j.label === rb.label)?.count ?? 0;
          const cCount =
            completionBarrierCounts.find((c) => c.label === rb.label)?.count ??
            0;
          const sourceBits: string[] = [];
          if (jCount > 0) {
            sourceBits.push(
              `${jCount} journal ${jCount === 1 ? 'entry' : 'entries'}`
            );
          }
          if (cCount > 0) {
            sourceBits.push(
              `${cCount} routine ${cCount === 1 ? 'note' : 'notes'}`
            );
          }
          barriersPatterns.push(
            `"${rb.label}" appeared ${rb.count} times (${sourceBits.join(' + ')}).`
          );
        }

        const topB = repeatedBarriers[0].label.toLowerCase();
        if (discomfort.detected) {
          barriersInterpretations.push(
            'Because discomfort signals were also logged, prioritize reviewing comfort and official guidance over habit tweaks.'
          );
          barriersActions.push(CAUTIOUS_DISCOMFORT_SUGGESTION);
        } else if (topB.includes('forgot')) {
          barriersInterpretations.push(
            'Forgetting—rather than disliking the product—explains several missed uses in your logs.'
          );
          barriersActions.push(
            'Place the item right next to something you already do every day.'
          );
        } else if (topB.includes('time') || topB.includes('missed')) {
          barriersInterpretations.push(
            'Busy windows and routine length make this step harder to fit in consistently.'
          );
          barriersActions.push(
            'Keep rushed routines shorter and move slower steps to a calmer time of day only if official label directions allow.'
          );
        } else {
          barriersInterpretations.push(
            `"${repeatedBarriers[0].label}" appeared ${repeatedBarriers[0].count} times as a practical obstacle in your routine.`
          );
          barriersActions.push(
            `Adjust where or when you keep this item handy to reduce friction around "${repeatedBarriers[0].label}", without altering dosage or frequency.`
          );
        }
      } else {
        barriersPatterns.push(
          `Only single occurrences logged so far (${barrierCounts[0].label}, 1 time) — not a recurring pattern yet.`
        );
        barriersInterpretations.push(
          'A single difficulty note is not enough to call a recurring barrier.'
        );
      }
    } else {
      barriersFacts.push({
        label: 'Logged difficulties',
        detail: 'No usage difficulties logged yet.',
      });
      barriersPatterns.push('No difficulty patterns recorded.');
    }

    const barriersHeadline =
      repeatedBarriers.length > 0
        ? `Most frequent difficulty: ${repeatedBarriers[0].label} (${repeatedBarriers[0].count}×).`
        : barrierCounts.length > 0
        ? `One difficulty noted once: ${barrierCounts[0].label}.`
        : 'No usage difficulties logged so far.';

    // 7. Suggested Next Steps
    const steps: RealityNextStep[] = [];
    if (scopedProducts.length === 0) {
      steps.push({
        action:
          'Add at least one product you use with your start date and what you hope for.',
        basis: 'No products are currently tracked in this report.',
        targetView: 'routines',
      });
    } else if (discomfort.detected) {
      steps.push({
        action: CAUTIOUS_DISCOMFORT_SUGGESTION,
        basis: discomfort.summaryText,
        targetView: 'journal',
      });
    } else if (scopedRoutines.length === 0) {
      steps.push({
        action:
          'Add your tracked products to a Morning, Evening, or Custom routine.',
        basis: `${scopedProducts.length} product(s) tracked, with 0 routines set up yet.`,
        targetView: 'routines',
      });
    }

    if (
      smallSuggestion.suggestion &&
      scopedProducts.length > 0 &&
      !discomfort.detected
    ) {
      steps.push({
        action: smallSuggestion.suggestion,
        basis: smallSuggestion.whatYouRecorded,
        targetView: scopedEntries.length < 2 ? 'journal' : 'routines',
      });
    }

    if (
      differentProducts.length > 0 &&
      selectedProduct === undefined &&
      !discomfort.detected
    ) {
      steps.push({
        action: `Review "${differentProducts[0].productName}" on its own to decide whether to pause using it or check routine fit.`,
        basis: differentProducts[0].recordedComparisonSummary,
        targetView: 'reality-check',
      });
    }

    return {
      generatedAt: new Date().toISOString(),
      engineMode: this.mode,
      scopeLabel,
      productId: selectedProductId,
      isEmpty,
      discomfortNotice: discomfort.detected
        ? {
            detected: true,
            entryCount: discomfort.entryCount,
            details: discomfort.summaryText,
          }
        : undefined,
      dataCoverage: {
        productsCount: scopedProducts.length,
        routinesCount: scopedRoutines.length,
        completionLogsCount: scopedCompletions.length,
        journalEntriesCount: scopedEntries.length,
        observationSpanDays,
      },
      metrics: {
        overallAdherenceRate,
        averageSatisfaction,
        satisfactionTrendDelta,
        totalLikesRecorded: allLikes.length,
        totalDislikesRecorded: allDislikes.length,
      },
      highlights: {
        whatsGoingWell,
        somethingToReconsider,
        smallSuggestion,
        productExperience,
      },
      continueIntentSummary,
      expectationsVsReality,
      sections: {
        experienceOverview: {
          id: 'overview',
          title: 'Overall Experience',
          headlineSummary: overviewHeadline,
          recordedFacts: overviewFacts,
          identifiedPatterns: overviewPatterns,
          possibleInterpretations: overviewInterpretations,
          suggestedActions: overviewActions,
        },
        usageConsistency: {
          id: 'consistency',
          title: 'Routine Consistency',
          headlineSummary: consistencyHeadline,
          recordedFacts: consistencyFacts,
          identifiedPatterns: consistencyPatterns,
          possibleInterpretations: consistencyInterpretations,
          suggestedActions: consistencyActions,
        },
        customerSatisfaction: {
          id: 'satisfaction',
          title: 'Experience Trends',
          headlineSummary: satisfactionHeadline,
          recordedFacts: satisfactionFacts,
          identifiedPatterns: satisfactionPatterns,
          possibleInterpretations: satisfactionInterpretations,
          suggestedActions: satisfactionActions,
        },
        likesAndDislikes: {
          id: 'likes-dislikes',
          title: 'Likes & Dislikes',
          headlineSummary: likesDislikesHeadline,
          recordedFacts: likesDislikesFacts,
          identifiedPatterns: likesDislikesPatterns,
          possibleInterpretations: likesDislikesInterpretations,
          suggestedActions: likesDislikesActions,
        },
        recurringObservations: {
          id: 'recurring',
          title: 'Repeating Observations',
          headlineSummary: recurringHeadline,
          recordedFacts: recurringFacts,
          identifiedPatterns: recurringPatterns,
          possibleInterpretations: recurringInterpretations,
          suggestedActions: recurringActions,
        },
        possibleBarriers: {
          id: 'barriers',
          title: 'Usage Difficulties',
          headlineSummary: barriersHeadline,
          recordedFacts: barriersFacts,
          identifiedPatterns: barriersPatterns,
          possibleInterpretations: barriersInterpretations,
          suggestedActions: barriersActions,
        },
        suggestedNextSteps: {
          recordedBasisSummary: `Every suggestion below traces directly to your ${scopedProducts.length} product record(s), ${scopedCompletions.length} routine check-in(s), and ${scopedEntries.length} experience note(s).`,
          steps,
        },
      },
      methodologyNote:
        'Built strictly from what you saved. Separates (1) recorded entries, (2) patterns backed by 2+ entries, (3) cautious interpretations, and (4) neutral next steps — never claims medical efficacy or alters dosage, frequency, or official label directions.',
    };
  }
}

export const defaultRealityCheckEngine: RealityCheckProvider =
  new LocalDeterministicRealityEngine();

export function formatReportAsMarkdown(report: ProductRealityReport): string {
  const lines: string[] = [
    `# Reality Check — ${report.scopeLabel}`,
    `Generated: ${new Date(report.generatedAt).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })} IST`,
    '',
    `> ${report.methodologyNote}`,
    '',
    '## Summary',
    `### What's going well: ${report.highlights.whatsGoingWell.headline}`,
    `- What you recorded: ${report.highlights.whatsGoingWell.whatYouRecorded}`,
    `- Patterns identified: ${report.highlights.whatsGoingWell.patternIdentified}`,
    `- Possible interpretation: ${report.highlights.whatsGoingWell.interpretation}`,
    '',
    `### Something to reconsider: ${report.highlights.somethingToReconsider.headline}`,
    `- What you recorded: ${report.highlights.somethingToReconsider.whatYouRecorded}`,
    `- Patterns identified: ${report.highlights.somethingToReconsider.patternIdentified}`,
    `- Possible interpretation: ${report.highlights.somethingToReconsider.interpretation}`,
    '',
    `### A small suggestion: ${report.highlights.smallSuggestion.headline}`,
    `- What you recorded: ${report.highlights.smallSuggestion.whatYouRecorded}`,
    `- Patterns identified: ${report.highlights.smallSuggestion.patternIdentified}`,
    `- Possible interpretation: ${report.highlights.smallSuggestion.interpretation}`,
    `- Suggested next step: ${report.highlights.smallSuggestion.suggestion || report.highlights.smallSuggestion.interpretation}`,
    '',
    '## Expectations vs Reality',
  ];

  for (const item of report.expectationsVsReality) {
    lines.push(`### ${item.productName} — ${item.statusLabel}`);
    lines.push(
      `- **Expected:** ${item.originalExpectation || 'None saved'}`
    );
    lines.push(`- **What you recorded:** ${item.recordedComparisonSummary}`);
    lines.push(
      `- **Patterns identified:** ${item.identifiedPatterns.join(' ')}`
    );
    lines.push(`- **Possible interpretation:** ${item.interpretation}`);
    lines.push(`- **Suggested next step:** ${item.suggestion}`);
    lines.push('');
  }

  return lines.join('\n');
}
