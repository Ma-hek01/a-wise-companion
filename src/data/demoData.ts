import { BE_BODYWISE_CATALOG } from './beBodywiseCatalog';
import {
  CompanionState,
  FrequencyGoal,
  JournalEntry,
  Product,
  Routine,
  RoutineCompletion,
} from '../types/companion';

export const DEMO_CUSTOMER_PROFILE = {
  personaLabel: 'Fictional Demo Customer: Ananya S.',
  disclaimer:
    'SYNTHETIC DEMO DATA — Created solely for product exploration. Does not represent genuine customer interviews, verified reviews, or actual Be Bodywise customer feedback.',
};

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function daysAgo(days: number, baseDate = new Date()): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() - days);
  return formatLocalDate(d);
}

interface DemoProductSpec {
  id: string;
  catalogId: string;
  variantIndex?: number;
  daysStartedAgo: number;
  frequencyGoal: FrequencyGoal;
  expectations: string;
}

function buildDemoProductFromCatalog(
  spec: DemoProductSpec,
  baseDate: Date
): Product {
  const entry = BE_BODYWISE_CATALOG.find((item) => item.id === spec.catalogId);
  if (!entry) {
    throw new Error(
      `Demo catalogue product "${spec.catalogId}" not found in BE_BODYWISE_CATALOG`
    );
  }
  const variant =
    entry.variants[spec.variantIndex ?? 0] ?? entry.variants[0] ?? null;

  return {
    id: spec.id,
    name: entry.name,
    category: entry.category,
    dateStarted: daysAgo(spec.daysStartedAgo, baseDate),
    frequencyGoal: spec.frequencyGoal,
    expectations: spec.expectations,
    isDemo: true,
    createdAt: new Date(
      baseDate.getTime() - spec.daysStartedAgo * 86400000
    ).toISOString(),
    imageUrl: entry.imageUrl || undefined,
    subcategory: entry.subcategory || undefined,
    selectedVariant: variant?.label || undefined,
    keyIngredients:
      entry.keyIngredients.length > 0 ? [...entry.keyIngredients] : undefined,
    officialUrl: variant?.url || entry.officialUrl || undefined,
    catalogProductId: entry.id,
  };
}

export function createDemoState(baseDate = new Date()): CompanionState {
  const productSpecs: DemoProductSpec[] = [
    {
      id: 'demo-prod-1',
      catalogId: 'bw-2-salicylic-face-wash',
      variantIndex: 0,
      daysStartedAgo: 26,
      frequencyGoal: 'Daily',
      expectations:
        'Gentle morning wash that leaves skin calm and balanced without tight dryness.',
    },
    {
      id: 'demo-prod-2',
      catalogId: 'bw-4-aha-bha-underarm-roll-on',
      variantIndex: 0,
      daysStartedAgo: 22,
      frequencyGoal: 'Daily',
      expectations:
        'Quick-drying daily roll-on with gentle comfort and no damp residue under clothes.',
    },
    {
      id: 'demo-prod-3',
      catalogId: 'bw-detan-body-sunscreen-lotion',
      variantIndex: 0,
      daysStartedAgo: 19,
      frequencyGoal: 'Daily',
      expectations:
        'Lightweight daytime absorption on arms with zero sticky residue before commuting.',
    },
    {
      id: 'demo-prod-4',
      catalogId: 'bw-1-salicylic-body-wash',
      variantIndex: 0,
      daysStartedAgo: 21,
      frequencyGoal: '3x Weekly',
      expectations:
        'Easy-to-remember post-workout shower wash that rinses clean and feels gentle.',
    },
    {
      id: 'demo-prod-5',
      catalogId: 'bw-advanced-hair-growth-serum',
      variantIndex: 0,
      daysStartedAgo: 16,
      frequencyGoal: 'Daily',
      expectations:
        'Lightweight overnight scalp step with zero oily residue on roots or pillowcase.',
    },
    {
      id: 'demo-prod-6',
      catalogId: 'bw-biotin-hair-gummies',
      variantIndex: 0,
      daysStartedAgo: 15,
      frequencyGoal: 'Daily',
      expectations:
        'Easy evening habit after dinner with mild taste and gentle digestion.',
    },
    {
      id: 'demo-prod-7',
      catalogId: 'bw-10-urea-lotion',
      variantIndex: 0,
      daysStartedAgo: 4,
      frequencyGoal: 'Daily',
      expectations:
        'Comforting hydration on dry elbows and calves before sleep without heavy stickiness.',
    },
  ];

  const products: Product[] = productSpecs.map((spec) =>
    buildDemoProductFromCatalog(spec, baseDate)
  );

  const routines: Routine[] = [
    {
      id: 'demo-routine-am',
      name: 'Morning Prep & Sun Care',
      timeOfDay: 'Morning',
      productIds: ['demo-prod-1', 'demo-prod-2', 'demo-prod-3'],
      notes: 'Quick morning sequence before leaving for work.',
      isDemo: true,
      createdAt: new Date(baseDate.getTime() - 26 * 86400000).toISOString(),
    },
    {
      id: 'demo-routine-pm',
      name: 'Evening Shower & Hair Care',
      timeOfDay: 'Evening',
      productIds: ['demo-prod-4', 'demo-prod-5', 'demo-prod-6'],
      notes: 'Keep hair roll-on on bathroom shelf and gummies near water bottle.',
      isDemo: true,
      createdAt: new Date(baseDate.getTime() - 21 * 86400000).toISOString(),
    },
    {
      id: 'demo-routine-dry',
      name: 'Night Dry-Patch Trial',
      timeOfDay: 'Custom',
      productIds: ['demo-prod-7'],
      notes: 'Newly added 4-day bedtime trial on dry elbows and lower legs.',
      isDemo: true,
      createdAt: new Date(baseDate.getTime() - 4 * 86400000).toISOString(),
    },
  ];

  const completions: RoutineCompletion[] = [];

  // Past 13 days for Morning & Evening routines (all 6 primary products started >= 15 days ago)
  for (let offset = 13; offset >= 1; offset--) {
    const dateStr = daysAgo(offset, baseDate);

    // Morning routine completions
    if (offset === 11 || offset === 4) {
      completions.push({
        id: `demo-comp-am-${offset}`,
        routineId: 'demo-routine-am',
        date: dateStr,
        completedProductIds: [],
        status: 'skipped',
        barrierNote: 'Time constraint before morning commute',
        completedAt: `${dateStr}T08:30:00.000Z`,
        isDemo: true,
      });
    } else if (offset === 9 || offset === 6 || offset === 2) {
      completions.push({
        id: `demo-comp-am-${offset}`,
        routineId: 'demo-routine-am',
        date: dateStr,
        completedProductIds: ['demo-prod-1', 'demo-prod-2'],
        status: 'partial',
        barrierNote: 'Rushed morning; skipped body sunscreen step',
        completedAt: `${dateStr}T08:15:00.000Z`,
        isDemo: true,
      });
    } else {
      completions.push({
        id: `demo-comp-am-${offset}`,
        routineId: 'demo-routine-am',
        date: dateStr,
        completedProductIds: ['demo-prod-1', 'demo-prod-2', 'demo-prod-3'],
        status: 'completed',
        completedAt: `${dateStr}T08:10:00.000Z`,
        isDemo: true,
      });
    }

    // Evening routine completions
    if (offset === 10 || offset === 3) {
      completions.push({
        id: `demo-comp-pm-${offset}`,
        routineId: 'demo-routine-pm',
        date: dateStr,
        completedProductIds: [],
        status: 'skipped',
        barrierNote: 'Forgetfulness after getting home late',
        completedAt: `${dateStr}T23:10:00.000Z`,
        isDemo: true,
      });
    } else if (offset === 12 || offset === 5) {
      completions.push({
        id: `demo-comp-pm-${offset}`,
        routineId: 'demo-routine-pm',
        date: dateStr,
        completedProductIds: ['demo-prod-4', 'demo-prod-6'],
        status: 'partial',
        barrierNote: 'Avoided scalp roll-on residue before early morning meeting',
        completedAt: `${dateStr}T22:25:00.000Z`,
        isDemo: true,
      });
    } else if (offset === 8 || offset === 2) {
      completions.push({
        id: `demo-comp-pm-${offset}`,
        routineId: 'demo-routine-pm',
        date: dateStr,
        completedProductIds: ['demo-prod-6'],
        status: 'partial',
        barrierNote: 'Too many routine steps when tired',
        completedAt: `${dateStr}T22:45:00.000Z`,
        isDemo: true,
      });
    } else {
      // Body wash is 3x weekly, so it's checked on alternating shower days
      const completedIds =
        offset % 2 === 1
          ? ['demo-prod-4', 'demo-prod-5', 'demo-prod-6']
          : ['demo-prod-5', 'demo-prod-6'];
      completions.push({
        id: `demo-comp-pm-${offset}`,
        routineId: 'demo-routine-pm',
        date: dateStr,
        completedProductIds: completedIds,
        status: completedIds.length === 3 ? 'completed' : 'partial',
        completedAt: `${dateStr}T22:15:00.000Z`,
        isDemo: true,
      });
    }
  }

  // Only 3 recent days for the 4-day-old 10% Urea Body Lotion trial (internally consistent with start date)
  for (let offset = 3; offset >= 1; offset--) {
    const dateStr = daysAgo(offset, baseDate);
    if (offset === 2) {
      completions.push({
        id: `demo-comp-dry-${offset}`,
        routineId: 'demo-routine-dry',
        date: dateStr,
        completedProductIds: [],
        status: 'skipped',
        barrierNote: 'Forgetfulness before sleeping',
        completedAt: `${dateStr}T23:00:00.000Z`,
        isDemo: true,
      });
    } else {
      completions.push({
        id: `demo-comp-dry-${offset}`,
        routineId: 'demo-routine-dry',
        date: dateStr,
        completedProductIds: ['demo-prod-7'],
        status: 'completed',
        completedAt: `${dateStr}T22:30:00.000Z`,
        isDemo: true,
      });
    }
  }

  const journalEntries: JournalEntry[] = [
    {
      id: 'demo-j-1',
      date: daysAgo(20, baseDate),
      productId: 'demo-prod-1',
      satisfaction: 4,
      experienceSummary: 'Positive',
      overallExperience: 'Loved it',
      continueUsing: 'Yes',
      likes: ['Gentle feel', 'Clean rinse'],
      dislikes: ['Strong scent'],
      barriers: ['No difficulty'],
      notes:
        'Gentle morning wash with comfortable hydration; rinsed cleanly before moisturizer.',
      isDemo: true,
      createdAt: new Date(baseDate.getTime() - 20 * 86400000).toISOString(),
    },
    {
      id: 'demo-j-2',
      date: daysAgo(17, baseDate),
      productId: 'demo-prod-2',
      satisfaction: 4,
      experienceSummary: 'Positive',
      overallExperience: 'Loved it',
      continueUsing: 'Yes',
      likes: ['Smooth application', 'Pleasant fragrance'],
      dislikes: [],
      barriers: ['No difficulty'],
      notes:
        'Glided evenly without stinging and felt comfortable through a warm workday.',
      isDemo: true,
      createdAt: new Date(baseDate.getTime() - 17 * 86400000).toISOString(),
    },
    {
      id: 'demo-j-3',
      date: daysAgo(16, baseDate),
      productId: 'demo-prod-4',
      satisfaction: 4,
      experienceSummary: 'Positive',
      overallExperience: 'Loved it',
      continueUsing: 'Yes',
      likes: ['Gentle feel', 'Smooth application'],
      dislikes: [],
      barriers: ['No difficulty'],
      notes:
        'Easy to remember right after evening workouts and felt gentle on shoulders.',
      isDemo: true,
      createdAt: new Date(baseDate.getTime() - 16 * 86400000).toISOString(),
    },
    {
      id: 'demo-j-4',
      date: daysAgo(15, baseDate),
      productId: 'demo-prod-3',
      satisfaction: 2,
      experienceSummary: 'Challenging',
      overallExperience: "Didn't like it",
      continueUsing: 'Maybe',
      likes: ['Mild scent'],
      dislikes: ['Sticky finish', 'Takes time to rub in'],
      barriers: ['Took too much time'],
      notes:
        'Applied a full layer right before leaving; felt noticeably sticky against shirt sleeves in humidity.',
      isDemo: true,
      createdAt: new Date(baseDate.getTime() - 15 * 86400000).toISOString(),
    },
    {
      id: 'demo-j-5',
      date: daysAgo(14, baseDate),
      productId: 'demo-prod-5',
      satisfaction: 3,
      experienceSummary: 'Mixed',
      overallExperience: 'It was okay',
      continueUsing: 'Maybe',
      likes: ['Comfortable scalp feel'],
      dislikes: ['Leaves oily residue', 'Hard to apply evenly'],
      barriers: ['Difficult to fit into my routine'],
      notes:
        'Roll-on pressed too much fluid onto the part line, leaving hair roots heavy overnight.',
      isDemo: true,
      createdAt: new Date(baseDate.getTime() - 14 * 86400000).toISOString(),
    },
    {
      id: 'demo-j-6',
      date: daysAgo(13, baseDate),
      productId: 'demo-prod-6',
      satisfaction: 3,
      experienceSummary: 'Neutral',
      overallExperience: 'It was okay',
      continueUsing: 'Yes',
      likes: ['Pleasant taste', 'Gentle on stomach'],
      dislikes: ['Bulky packaging'],
      barriers: ['Forgot to use it'],
      notes:
        'Easy to chew after dinner, though I forgot twice when eating out late.',
      isDemo: true,
      createdAt: new Date(baseDate.getTime() - 13 * 86400000).toISOString(),
    },
    {
      id: 'demo-j-7',
      date: daysAgo(11, baseDate),
      productId: 'demo-prod-1',
      satisfaction: 5,
      experienceSummary: 'Positive',
      overallExperience: 'Loved it',
      continueUsing: 'Yes',
      likes: ['Gentle feel', 'Easy to apply'],
      dislikes: [],
      barriers: ['No difficulty'],
      notes:
        'Balanced feel all morning with zero dryness; feels like an automatic routine step now.',
      isDemo: true,
      createdAt: new Date(baseDate.getTime() - 11 * 86400000).toISOString(),
    },
    {
      id: 'demo-j-8',
      date: daysAgo(9, baseDate),
      productId: 'demo-prod-2',
      satisfaction: 3,
      experienceSummary: 'Mixed',
      overallExperience: 'It was okay',
      continueUsing: 'Yes',
      likes: ['Pleasant fragrance'],
      dislikes: ['Takes time to dry', 'Sticky or damp finish'],
      barriers: ['Took too much time'],
      notes:
        'Needed three extra minutes to air-dry on a rushed morning; felt damp under a fitted shirt.',
      isDemo: true,
      createdAt: new Date(baseDate.getTime() - 9 * 86400000).toISOString(),
    },
    {
      id: 'demo-j-9',
      date: daysAgo(8, baseDate),
      productId: 'demo-prod-5',
      satisfaction: 2,
      experienceSummary: 'Challenging',
      overallExperience: "Didn't like it",
      continueUsing: 'No',
      likes: [],
      dislikes: ['Leaves oily residue', 'Weighs hair down'],
      barriers: ['Missed my routine', 'Difficult to fit into my routine'],
      notes:
        'Skipped on two busy nights because hair looked weighed down the next morning.',
      isDemo: true,
      createdAt: new Date(baseDate.getTime() - 8 * 86400000).toISOString(),
    },
    {
      id: 'demo-j-10',
      date: daysAgo(7, baseDate),
      productId: 'demo-prod-4',
      satisfaction: 4,
      experienceSummary: 'Positive',
      overallExperience: 'Loved it',
      continueUsing: 'Yes',
      likes: ['Gentle feel', 'Convenient packaging'],
      dislikes: [],
      barriers: ['Forgot to use it'],
      notes:
        'Kept on the main shower shelf so recall is easy; skipped one late night when tired.',
      isDemo: true,
      createdAt: new Date(baseDate.getTime() - 7 * 86400000).toISOString(),
    },
    {
      id: 'demo-j-11',
      date: daysAgo(6, baseDate),
      productId: 'demo-prod-3',
      satisfaction: 4,
      experienceSummary: 'Positive',
      overallExperience: 'It was okay',
      continueUsing: 'Maybe',
      likes: ['Light texture', 'No white cast'],
      dislikes: ['Sticky finish'],
      barriers: ['Took too much time'],
      notes:
        'Applying two thinner passes absorbed faster, though I still skip it on rushed mornings.',
      isDemo: true,
      createdAt: new Date(baseDate.getTime() - 6 * 86400000).toISOString(),
    },
    {
      id: 'demo-j-12',
      date: daysAgo(4, baseDate),
      productId: 'demo-prod-6',
      satisfaction: 4,
      experienceSummary: 'Positive',
      overallExperience: 'Loved it',
      continueUsing: 'Yes',
      likes: ['Easy to remember', 'Gentle on stomach'],
      dislikes: [],
      barriers: ['Forgot to use it'],
      notes:
        'Moving the jar next to my water glass helped recall on busy weeknights.',
      isDemo: true,
      createdAt: new Date(baseDate.getTime() - 4 * 86400000).toISOString(),
    },
    {
      id: 'demo-j-13',
      date: daysAgo(3, baseDate),
      productId: 'demo-prod-5',
      satisfaction: 2,
      experienceSummary: 'Challenging',
      overallExperience: "Didn't like it",
      continueUsing: 'No',
      likes: [],
      dislikes: ['Leaves oily residue', 'Hard to apply evenly'],
      barriers: ['Difficult to fit into my routine'],
      notes:
        'Satisfaction remains low on worknights; residue feels noticeably heavier than expected.',
      isDemo: true,
      createdAt: new Date(baseDate.getTime() - 3 * 86400000).toISOString(),
    },
    {
      id: 'demo-j-14',
      date: daysAgo(2, baseDate),
      productId: 'demo-prod-1',
      satisfaction: 5,
      experienceSummary: 'Positive',
      overallExperience: 'Loved it',
      continueUsing: 'Yes',
      likes: ['Gentle feel', 'Absorbs well'],
      dislikes: [],
      barriers: ['No difficulty'],
      notes:
        'Over three weeks in, morning cleansing stays comfortable and predictable.',
      isDemo: true,
      createdAt: new Date(baseDate.getTime() - 2 * 86400000).toISOString(),
    },
    {
      id: 'demo-j-15',
      date: daysAgo(1, baseDate),
      productId: 'demo-prod-7',
      satisfaction: 4,
      experienceSummary: 'Neutral',
      overallExperience: 'It was okay',
      continueUsing: 'Not sure yet',
      likes: ['Gentle feel'],
      dislikes: ['Feels too thick'],
      barriers: ['No difficulty'],
      notes:
        'First few nights using on dry patches; feels rich so rinsing hands afterward helps.',
      isDemo: true,
      createdAt: new Date(baseDate.getTime() - 1 * 86400000).toISOString(),
    },
  ];

  return {
    products,
    routines,
    completions,
    journalEntries,
    hasDemoData: true,
    lastUpdated: baseDate.toISOString(),
  };
}

export const COMMON_BARRIER_OPTIONS = [
  'Forgot to use it',
  'Took too much time',
  'Missed my routine',
  'Product ran out',
  'Difficult to fit into my routine',
  'No difficulty',
  'Other',
];
