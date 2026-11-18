import React, { useEffect, useState } from 'react';
import {
  Calendar,
  BookOpen,
  Clock,
  Edit2,
  Heart,
  MinusCircle,
  Plus,
  Search,
  ThumbsDown,
  Trash2,
  X,
} from 'lucide-react';
import {
  CONTINUE_USING_OPTIONS,
  deriveOverallExperience,
  formatFeedbackList,
  getCategoryFeedbackOptions,
  mapOverallToLegacy,
  OVERALL_EXPERIENCE_OPTIONS,
} from '../data/journalOptions';
import {
  ContinueUsingChoice,
  JournalEntry,
  OverallExperienceChoice,
  Product,
} from '../types/companion';
import {
  formatDateKeyToIndian,
  formatIstTime12h,
  formatJournalDayHeader,
  getJournalEntrySortTimestamp,
  getTodayIstDateKey,
  resolveJournalEntryIstDateKey,
} from '../utils/istDate';

interface ProgressJournalViewProps {
  products: Product[];
  entries: JournalEntry[];
  autoOpenForm?: boolean;
  preselectedProductId?: string;
  onConsumeAutoOpen?: () => void;
  onAddEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  onUpdateEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (entryId: string) => void;
}

const EXPERIENCE_BADGE_STYLE: Record<OverallExperienceChoice, string> = {
  'Loved it': 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'It was okay': 'border-blue-200 bg-blue-50 text-blue-800',
  "Didn't like it": 'border-amber-200 bg-amber-50 text-amber-800',
};

function ExperienceIcon({
  choice,
  active,
}: {
  choice: OverallExperienceChoice;
  active: boolean;
}) {
  if (choice === 'Loved it') {
    return (
      <Heart
        className={`h-5 w-5 ${
          active ? 'fill-emerald-600 text-emerald-600' : 'text-slate-400'
        }`}
      />
    );
  }
  if (choice === 'It was okay') {
    return (
      <MinusCircle
        className={`h-5 w-5 ${active ? 'text-blue-600' : 'text-slate-400'}`}
      />
    );
  }
  return (
    <ThumbsDown
      className={`h-5 w-5 ${active ? 'text-amber-600' : 'text-slate-400'}`}
    />
  );
}

export const ProgressJournalView: React.FC<ProgressJournalViewProps> = ({
  products,
  entries,
  autoOpenForm = false,
  preselectedProductId,
  onConsumeAutoOpen,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [productFilter, setProductFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // A-G Form state
  const [productId, setProductId] = useState<string>('');
  const [overallExperience, setOverallExperience] =
    useState<OverallExperienceChoice>('Loved it');
  const [selectedLikes, setSelectedLikes] = useState<string[]>([]);
  const [likesOther, setLikesOther] = useState('');
  const [selectedDislikes, setSelectedDislikes] = useState<string[]>([]);
  const [dislikesOther, setDislikesOther] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(
    []
  );
  const [barriersOther, setBarriersOther] = useState('');
  const [continueUsing, setContinueUsing] =
    useState<ContinueUsingChoice>('Yes');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(getTodayIstDateKey());

  const selectedProduct = products.find((p) => p.id === productId);
  const categoryOptions = getCategoryFeedbackOptions(selectedProduct?.category);

  const openAddForm = (targetProductId?: string) => {
    setEditingEntry(null);
    setProductId(targetProductId ?? products[0]?.id ?? '');
    setOverallExperience('Loved it');
    setSelectedLikes([]);
    setLikesOther('');
    setSelectedDislikes([]);
    setDislikesOther('');
    setSelectedDifficulties([]);
    setBarriersOther('');
    setContinueUsing('Yes');
    setNotes('');
    setDate(getTodayIstDateKey());
    setIsFormOpen(true);
  };

  useEffect(() => {
    if (autoOpenForm) {
      openAddForm(preselectedProductId);
      onConsumeAutoOpen?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenForm, preselectedProductId]);

  const openEditForm = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setProductId(entry.productId ?? '');
    setOverallExperience(deriveOverallExperience(entry));
    setSelectedLikes(Array.isArray(entry.likes) ? entry.likes : []);
    setLikesOther(entry.likesOther ?? '');
    setSelectedDislikes(Array.isArray(entry.dislikes) ? entry.dislikes : []);
    setDislikesOther(entry.dislikesOther ?? '');
    setSelectedDifficulties(
      Array.isArray(entry.barriers) ? entry.barriers : []
    );
    setBarriersOther(entry.barriersOther ?? '');
    setContinueUsing(entry.continueUsing ?? 'Not sure yet');
    setNotes(entry.notes ?? '');
    setDate(resolveJournalEntryIstDateKey(entry));
    setIsFormOpen(true);
  };

  const handleProductChange = (nextProductId: string) => {
    const prevCat = getCategoryFeedbackOptions(selectedProduct?.category);
    const nextProd = products.find((p) => p.id === nextProductId);
    const nextCat = getCategoryFeedbackOptions(nextProd?.category);
    setProductId(nextProductId);
    // Keep only selections that still make sense for the newly selected category or were custom
    if (prevCat.groupLabel !== nextCat.groupLabel) {
      setSelectedLikes((prev) =>
        prev.filter((item) => nextCat.likes.includes(item))
      );
      setSelectedDislikes((prev) =>
        prev.filter((item) => nextCat.dislikes.includes(item))
      );
    }
  };

  const toggleChip = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleDifficultyChip = (value: string) => {
    setSelectedDifficulties((prev) => {
      if (value === 'No difficulty') {
        return prev.includes('No difficulty') ? [] : ['No difficulty'];
      }
      const withoutNone = prev.filter((v) => v !== 'No difficulty');
      return withoutNone.includes(value)
        ? withoutNone.filter((v) => v !== value)
        : [...withoutNone, value];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry && products.length > 0 && !productId) {
      return;
    }

    const legacyMapped = mapOverallToLegacy(overallExperience);
    const payload = {
      date,
      productId: productId || undefined,
      satisfaction: legacyMapped.satisfaction,
      experienceSummary: legacyMapped.experienceSummary,
      overallExperience,
      continueUsing,
      likes: selectedLikes,
      likesOther:
        selectedLikes.includes('Other') && likesOther.trim()
          ? likesOther.trim()
          : undefined,
      dislikes: selectedDislikes,
      dislikesOther:
        selectedDislikes.includes('Other') && dislikesOther.trim()
          ? dislikesOther.trim()
          : undefined,
      barriers: selectedDifficulties,
      barriersOther:
        selectedDifficulties.includes('Other') && barriersOther.trim()
          ? barriersOther.trim()
          : undefined,
      notes: notes.trim(),
      isDemo: false,
    };

    if (editingEntry) {
      onUpdateEntry({
        ...editingEntry,
        ...payload,
      });
    } else {
      onAddEntry(payload);
    }

    setIsFormOpen(false);
    setEditingEntry(null);
  };

  const availableDates = Array.from(
    new Set(entries.map((entry) => resolveJournalEntryIstDateKey(entry)))
  ).sort((a, b) => b.localeCompare(a));

  const sortedFiltered = [...entries]
    .filter((entry) => {
      const entryDateKey = resolveJournalEntryIstDateKey(entry);
      const matchesDate =
        dateFilter === 'all' ? true : entryDateKey === dateFilter;
      const matchesProduct =
        productFilter === 'all'
          ? true
          : productFilter === 'general'
          ? !entry.productId
          : entry.productId === productFilter;
      const q = searchQuery.trim().toLowerCase();
      const derivedExp = deriveOverallExperience(entry);
      const linkedProductName =
        products.find((p) => p.id === entry.productId)?.name ?? '';
      const matchesQuery =
        !q ||
        linkedProductName.toLowerCase().includes(q) ||
        entry.notes.toLowerCase().includes(q) ||
        derivedExp.toLowerCase().includes(q) ||
        formatDateKeyToIndian(entryDateKey).toLowerCase().includes(q) ||
        (entry.continueUsing?.toLowerCase().includes(q) ?? false) ||
        entry.likes.some((l) => l.toLowerCase().includes(q)) ||
        (entry.likesOther?.toLowerCase().includes(q) ?? false) ||
        entry.dislikes.some((d) => d.toLowerCase().includes(q)) ||
        (entry.dislikesOther?.toLowerCase().includes(q) ?? false) ||
        entry.barriers.some((b) => b.toLowerCase().includes(q)) ||
        (entry.barriersOther?.toLowerCase().includes(q) ?? false);
      return matchesDate && matchesProduct && matchesQuery;
    })
    .sort(
      (a, b) =>
        getJournalEntrySortTimestamp(b) - getJournalEntrySortTimestamp(a)
    );

  // Group sorted entries into calendar days in IST (reverse chronological order)
  const groupedByDate: Array<{
    dateKey: string;
    heading: string;
    items: JournalEntry[];
  }> = [];
  const groupMap = new Map<string, JournalEntry[]>();
  for (const entry of sortedFiltered) {
    const key = resolveJournalEntryIstDateKey(entry);
    const list = groupMap.get(key);
    if (list) {
      list.push(entry);
    } else {
      groupMap.set(key, [entry]);
    }
  }
  const sortedDateKeys = Array.from(groupMap.keys()).sort((a, b) =>
    b.localeCompare(a)
  );
  for (const key of sortedDateKeys) {
    groupedByDate.push({
      dateKey: key,
      heading: formatJournalDayHeader(key),
      items: groupMap.get(key) ?? [],
    });
  }

  // Preserve any custom/legacy chips already attached to an entry being edited
  const likeChipOptions = Array.from(
    new Set([...categoryOptions.likes, ...selectedLikes])
  );
  const dislikeChipOptions = Array.from(
    new Set([...categoryOptions.dislikes, ...selectedDislikes])
  );
  const difficultyChipOptions = Array.from(
    new Set([...categoryOptions.difficulties, ...selectedDifficulties])
  );

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Progress Journal
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            How was my experience? Log a quick check-in whenever something
            stands out — no daily logging required.
          </p>
        </div>
        <button
          type="button"
          data-tour="log-experience-btn"
          onClick={() => openAddForm()}
          className="scroll-mt-24 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Log Experience</span>
        </button>
      </section>

      {isFormOpen && (
        <section className="rounded-2xl border border-blue-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-display text-base font-semibold text-slate-900">
                {editingEntry ? 'Edit Experience' : 'How was my experience?'}
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Pick what feels true right now — everything except the product
                and overall feel is optional.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              aria-label="Close experience form"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {products.length === 0 && !editingEntry ? (
            <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <p className="text-sm text-slate-700">
                Add at least one product in{' '}
                <strong>Routine Companion · My Products</strong> before logging
                an experience.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-6">
              {/* A. Product (Required) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="journal-product"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    A. Product <span className="text-blue-600">*</span>
                  </label>
                  <select
                    id="journal-product"
                    required={!editingEntry}
                    value={productId}
                    onChange={(e) => handleProductChange(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {editingEntry && !editingEntry.productId && (
                      <option value="">General observation</option>
                    )}
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="journal-date"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Date{' '}
                    <span className="font-normal text-slate-400">
                      ({formatDateKeyToIndian(date)} IST)
                    </span>
                  </label>
                  <input
                    id="journal-date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 tabular-nums focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* B. Overall Experience (3 selectable cards) */}
              <div>
                <p className="text-xs font-semibold text-slate-700">
                  B. Overall experience
                </p>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {OVERALL_EXPERIENCE_OPTIONS.map((opt) => {
                    const active = overallExperience === opt.value;
                    const activeBorder =
                      opt.value === 'Loved it'
                        ? 'border-emerald-400 bg-emerald-50/60 ring-2 ring-emerald-100'
                        : opt.value === 'It was okay'
                        ? 'border-blue-400 bg-blue-50/60 ring-2 ring-blue-100'
                        : 'border-amber-400 bg-amber-50/60 ring-2 ring-amber-100';

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setOverallExperience(opt.value)}
                        aria-pressed={active}
                        className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
                          active
                            ? activeBorder
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                        }`}
                      >
                        <ExperienceIcon choice={opt.value} active={active} />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">
                            {opt.label}
                          </p>
                          <p className="text-xs text-slate-500">{opt.hint}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* C. What did you like? (Optional, multi-select, context-aware) */}
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-700">
                    C. What did you like?{' '}
                    <span className="font-normal text-slate-400">
                      (Optional · {categoryOptions.groupLabel})
                    </span>
                  </p>
                  {selectedLikes.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedLikes([])}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {likeChipOptions.map((chip) => {
                    const active = selectedLikes.includes(chip);
                    return (
                      <button
                        key={chip}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleChip(chip, setSelectedLikes)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                          active
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
                {selectedLikes.includes('Other') && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      value={likesOther}
                      onChange={(e) => setLikesOther(e.target.value)}
                      placeholder="Please specify..."
                      aria-label="Specify other likes"
                      className="w-full max-w-md rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                )}
              </div>

              {/* D. What didn't you like? (Optional, multi-select, context-aware) */}
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-700">
                    D. What didn’t you like?{' '}
                    <span className="font-normal text-slate-400">
                      (Optional · {categoryOptions.groupLabel})
                    </span>
                  </p>
                  {selectedDislikes.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedDislikes([])}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {dislikeChipOptions.map((chip) => {
                    const active = selectedDislikes.includes(chip);
                    return (
                      <button
                        key={chip}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleChip(chip, setSelectedDislikes)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                          active
                            ? 'border-amber-300 bg-amber-50 text-amber-800'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
                {selectedDislikes.includes('Other') && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      value={dislikesOther}
                      onChange={(e) => setDislikesOther(e.target.value)}
                      placeholder="Please specify..."
                      aria-label="Specify other dislikes"
                      className="w-full max-w-md rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                )}
              </div>

              {/* E. What made it difficult to use? (Optional, multi-select) */}
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-700">
                    E. What made it difficult to use?{' '}
                    <span className="font-normal text-slate-400">
                      (Optional)
                    </span>
                  </p>
                  {selectedDifficulties.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedDifficulties([])}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {difficultyChipOptions.map((chip) => {
                    const active = selectedDifficulties.includes(chip);
                    return (
                      <button
                        key={chip}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleDifficultyChip(chip)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                          active
                            ? chip === 'No difficulty'
                              ? 'border-blue-300 bg-blue-50 text-blue-800'
                              : 'border-slate-400 bg-slate-100 text-slate-900'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
                {selectedDifficulties.includes('Other') && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      value={barriersOther}
                      onChange={(e) => setBarriersOther(e.target.value)}
                      placeholder="Please specify..."
                      aria-label="Specify other usage difficulties"
                      className="w-full max-w-md rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                )}
              </div>

              {/* F. Would you continue using this product? */}
              <div>
                <p className="text-xs font-semibold text-slate-700">
                  F. Would you continue using this product?
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {CONTINUE_USING_OPTIONS.map((option) => {
                    const active = continueUsing === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setContinueUsing(option)}
                        className={`rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
                          active
                            ? 'border-blue-500 bg-blue-50 text-blue-800'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* G. Other notes (Optional) */}
              <div>
                <label
                  htmlFor="journal-notes"
                  className="block text-xs font-semibold text-slate-700"
                >
                  G. Other notes{' '}
                  <span className="font-normal text-slate-400">(Optional)</span>
                </label>
                <textarea
                  id="journal-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything else worth remembering about feel, timing, or packaging..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-xs"
                >
                  {editingEntry ? 'Save Changes' : 'Save Experience'}
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      {/* Filter Bar */}
      <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search experiences..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="journal-filter-date"
              className="text-xs font-medium text-slate-600 whitespace-nowrap"
            >
              Date:
            </label>
            <select
              id="journal-filter-date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Dates</option>
              {availableDates.map((dKey) => (
                <option key={dKey} value={dKey}>
                  {formatJournalDayHeader(dKey)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="journal-filter-product"
              className="text-xs font-medium text-slate-600 whitespace-nowrap"
            >
              Product:
            </label>
            <select
              id="journal-filter-product"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Products</option>
              <option value="general">General Notes</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Date-Grouped Personal Journal Timeline (IST Asia/Kolkata) */}
      {entries.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xs">
          <BookOpen className="mx-auto h-8 w-8 text-slate-400" />
          <h3 className="mt-3 font-display text-base font-semibold text-slate-900">
            No experiences logged yet
          </h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
            Log a quick reaction whenever you notice how a product feels — Reality
            Check pulls patterns together automatically.
          </p>
          <button
            type="button"
            onClick={() => openAddForm()}
            className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Log First Experience
          </button>
        </section>
      ) : groupedByDate.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-600">
            No entries match your filter.
          </p>
          {(dateFilter !== 'all' || productFilter !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setDateFilter('all');
                setProductFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </section>
      ) : (
        <div className="space-y-8">
          {groupedByDate.map((group, groupIndex) => (
            <section
              key={group.dateKey}
              aria-labelledby={`journal-date-heading-${group.dateKey}`}
              className={
                groupIndex > 0 ? 'border-t border-slate-200/80 pt-7' : ''
              }
            >
              {/* Single prominent date header directly above this day's entries */}
              <div className="mb-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Calendar className="h-3.5 w-3.5" />
                  </span>
                  <h3
                    id={`journal-date-heading-${group.dateKey}`}
                    className="font-display text-base font-bold tracking-tight text-slate-900 tabular-nums"
                  >
                    {group.heading}
                  </h3>
                </div>
                <span className="text-xs text-slate-500 tabular-nums">
                  {group.items.length}{' '}
                  {group.items.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>

              {/* Diary-style entry cards for this date */}
              <div className="space-y-3">
                {group.items.map((entry) => {
                  const linkedProduct = products.find(
                    (p) => p.id === entry.productId
                  );
                  const expLabel = deriveOverallExperience(entry);
                  const formattedTime = formatIstTime12h(entry.createdAt);

                  return (
                    <article
                      key={entry.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="font-display text-sm font-semibold text-slate-900">
                              {linkedProduct
                                ? linkedProduct.name
                                : 'General Note'}
                            </span>
                            <span
                              className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${EXPERIENCE_BADGE_STYLE[expLabel]}`}
                            >
                              {expLabel}
                            </span>
                            {formattedTime && (
                              <span className="inline-flex items-center gap-1 text-slate-500 tabular-nums">
                                <Clock className="h-3 w-3 text-slate-400" />
                                <span>{formattedTime}</span>
                              </span>
                            )}
                            {entry.continueUsing && (
                              <span className="text-slate-500">
                                · Continue:{' '}
                                <strong className="font-medium text-slate-700">
                                  {entry.continueUsing}
                                </strong>
                              </span>
                            )}
                            {entry.isDemo && (
                              <span className="text-slate-400">
                                · SYNTHETIC DEMO DATA
                              </span>
                            )}
                          </div>

                          {entry.notes && (
                            <p className="mt-2.5 text-sm leading-relaxed text-slate-800">
                              {entry.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => openEditForm(entry)}
                            aria-label="Edit entry"
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(entry.id)}
                            aria-label="Delete entry"
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {(entry.likes.length > 0 ||
                        entry.dislikes.length > 0 ||
                        entry.barriers.length > 0) && (
                        <div className="mt-3.5 flex flex-wrap gap-x-6 gap-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
                          {entry.likes.length > 0 && (
                            <span>
                              <strong className="font-medium text-emerald-700">
                                Liked:{' '}
                              </strong>
                              {formatFeedbackList(
                                entry.likes,
                                entry.likesOther
                              ).join(', ')}
                            </span>
                          )}
                          {entry.dislikes.length > 0 && (
                            <span>
                              <strong className="font-medium text-amber-700">
                                Didn’t like:{' '}
                              </strong>
                              {formatFeedbackList(
                                entry.dislikes,
                                entry.dislikesOther
                              ).join(', ')}
                            </span>
                          )}
                          {entry.barriers.length > 0 && (
                            <span>
                              <strong className="font-medium text-slate-700">
                                Usage difficulty:{' '}
                              </strong>
                              {formatFeedbackList(
                                entry.barriers,
                                entry.barriersOther
                              ).join(', ')}
                            </span>
                          )}
                        </div>
                      )}

                      {confirmDeleteId === entry.id && (
                        <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                          <span className="text-xs text-red-700">
                            Delete entry?
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteEntry(entry.id);
                              setConfirmDeleteId(null);
                            }}
                            className="rounded bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
