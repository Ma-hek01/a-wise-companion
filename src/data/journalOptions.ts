import {
  ContinueUsingChoice,
  ExperienceTone,
  JournalEntry,
  OverallExperienceChoice,
  ProductCategory,
} from '../types/companion';

export interface CategoryFeedbackOptions {
  groupLabel: string;
  likes: string[];
  dislikes: string[];
  difficulties: string[];
}

export const OVERALL_EXPERIENCE_OPTIONS: Array<{
  value: OverallExperienceChoice;
  label: string;
  hint: string;
  mappedSatisfaction: 1 | 3 | 5;
  mappedTone: ExperienceTone;
}> = [
  {
    value: 'Loved it',
    label: 'Loved it',
    hint: 'Felt great and easy to use',
    mappedSatisfaction: 5,
    mappedTone: 'Positive',
  },
  {
    value: 'It was okay',
    label: 'It was okay',
    hint: 'Mixed or neutral so far',
    mappedSatisfaction: 3,
    mappedTone: 'Neutral',
  },
  {
    value: "Didn't like it",
    label: "Didn't like it",
    hint: 'Something felt off or frustrating',
    mappedSatisfaction: 1,
    mappedTone: 'Challenging',
  },
];

export const CONTINUE_USING_OPTIONS: ContinueUsingChoice[] = [
  'Yes',
  'Maybe',
  'No',
  'Not sure yet',
];

export const STANDARD_DIFFICULTY_OPTIONS: string[] = [
  'Forgot to use it',
  'Took too much time',
  'Missed my routine',
  'Product ran out',
  'Difficult to fit into my routine',
  'No difficulty',
  'Other',
];

export function mapOverallToLegacy(choice: OverallExperienceChoice): {
  satisfaction: 1 | 2 | 3 | 4 | 5;
  experienceSummary: ExperienceTone;
} {
  if (choice === 'Loved it') {
    return { satisfaction: 5, experienceSummary: 'Positive' };
  }
  if (choice === "Didn't like it") {
    return { satisfaction: 1, experienceSummary: 'Challenging' };
  }
  return { satisfaction: 3, experienceSummary: 'Neutral' };
}

export function deriveOverallExperience(
  entry: Pick<JournalEntry, 'overallExperience' | 'satisfaction' | 'experienceSummary'>
): OverallExperienceChoice {
  if (
    entry.overallExperience === 'Loved it' ||
    entry.overallExperience === 'It was okay' ||
    entry.overallExperience === "Didn't like it"
  ) {
    return entry.overallExperience;
  }
  if (entry.satisfaction >= 4 || entry.experienceSummary === 'Positive') {
    return 'Loved it';
  }
  if (entry.satisfaction <= 2 || entry.experienceSummary === 'Challenging') {
    return "Didn't like it";
  }
  return 'It was okay';
}

export function formatFeedbackList(
  items: string[],
  otherText?: string
): string[] {
  const trimmedOther = otherText?.trim();
  return items.map((item) =>
    item === 'Other' && trimmedOther ? `Other: ${trimmedOther}` : item
  );
}

export function getCategoryFeedbackOptions(
  category?: ProductCategory
): CategoryFeedbackOptions {
  if (category === 'Sun Protection') {
    return {
      groupLabel: 'Sun protection',
      likes: [
        'Light texture',
        'No white cast',
        'Absorbs well',
        'Easy to apply',
        'Comfortable under clothes',
        'Mild scent',
        'Other',
      ],
      dislikes: [
        'Sticky finish',
        'White cast',
        'Takes time to rub in',
        'Strong scent',
        'Feels heavy in humidity',
        'Other',
      ],
      difficulties: STANDARD_DIFFICULTY_OPTIONS,
    };
  }

  if (category === 'Face Care' || category === 'Skincare') {
    return {
      groupLabel: 'Face care',
      likes: [
        'Gentle feel',
        'Light texture',
        'Absorbs well',
        'Clean rinse',
        'Pleasant scent',
        'Easy to apply',
        'Other',
      ],
      dislikes: [
        'Sticky or heavy feel',
        'Takes time to absorb',
        'Strong scent',
        'Feels drying',
        'Tricky packaging',
        'Other',
      ],
      difficulties: STANDARD_DIFFICULTY_OPTIONS,
    };
  }

  if (category === 'Hair Care' || category === 'Hair & Scalp') {
    return {
      groupLabel: 'Hair care',
      likes: [
        'Easy application',
        'Light on hair',
        'No heavy residue',
        'Pleasant fragrance',
        'Comfortable scalp feel',
        'Easy to rinse',
        'Other',
      ],
      dislikes: [
        'Leaves oily residue',
        'Weighs hair down',
        'Hard to apply evenly',
        'Strong fragrance',
        'Messy applicator',
        'Other',
      ],
      difficulties: STANDARD_DIFFICULTY_OPTIONS,
    };
  }

  if (category === 'Body Care') {
    return {
      groupLabel: 'Body care',
      likes: [
        'Absorbs quickly',
        'Non-sticky feel',
        'Pleasant fragrance',
        'Smooth application',
        'Convenient packaging',
        'Gentle feel',
        'Other',
      ],
      dislikes: [
        'Sticky or damp finish',
        'Takes time to dry',
        'Strong fragrance',
        'Awkward packaging',
        'Feels too thick',
        'Other',
      ],
      difficulties: STANDARD_DIFFICULTY_OPTIONS,
    };
  }

  if (
    category === 'Supplements' ||
    category === 'Health & Fitness' ||
    category === "Women's Wellness" ||
    category === 'Sleep & Wellbeing' ||
    category === 'Oral & Wellness'
  ) {
    return {
      groupLabel: 'Wellness & supplements',
      likes: [
        'Pleasant taste',
        'Easy to take',
        'Convenient packaging',
        'Easy to remember',
        'Gentle on stomach',
        'Good value',
        'Other',
      ],
      dislikes: [
        'Unpleasant taste',
        'Hard to take',
        'Bulky packaging',
        'Easy to forget',
        'Other',
      ],
      difficulties: STANDARD_DIFFICULTY_OPTIONS,
    };
  }

  return {
    groupLabel: 'Everyday routine',
    likes: [
      'Easy to use',
      'Comfortable feel',
      'Good texture',
      'Pleasant scent',
      'Convenient packaging',
      'Good value',
      'Other',
    ],
    dislikes: [
      'Sticky or heavy feel',
      'Strong scent',
      'Inconvenient packaging',
      'Too many steps',
      "Didn't fit my routine",
      'Other',
    ],
    difficulties: STANDARD_DIFFICULTY_OPTIONS,
  };
}
