import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BookOpen,
  CalendarCheck2,
  CheckCircle2,
  Circle,
  Compass,
  Heart,
  Lightbulb,
  Moon,
  Plus,
  RotateCcw,
  SkipForward,
  Sparkles,
  Sun,
} from 'lucide-react';
import { DEMO_CUSTOMER_PROFILE, formatLocalDate } from '../data/demoData';
import { deriveOverallExperience } from '../data/journalOptions';
import {
  AppView,
  CompanionState,
  Product,
  ProductRealityReport,
  RoutineTimeOfDay,
} from '../types/companion';
import {
  formatDateKeyToIndian,
  formatIstTime12h,
  getJournalEntrySortTimestamp,
  resolveJournalEntryIstDateKey,
} from '../utils/istDate';

interface HomeDashboardProps {
  state: CompanionState;
  report: ProductRealityReport;
  onNavigate: (view: AppView) => void;
  onQuickAddProduct: () => void;
  onQuickLogExperience: () => void;
  onToggleTodayRoutineProduct: (routineId: string, productId: string) => void;
  onResetDemoData: () => void;
}

function getFriendlyGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning! Let's make today a little easier.";
  if (hour < 17) return "Good afternoon! Let's keep today's routine simple.";
  return "Good evening! Time to wind down gently.";
}

function getRoutineIcon(timeOfDay: RoutineTimeOfDay) {
  if (timeOfDay === 'Morning') return Sun;
  if (timeOfDay === 'Evening') return Moon;
  return Sparkles;
}

const RoutineProductThumb: React.FC<{ product: Product }> = ({ product }) => {
  const [failed, setFailed] = useState(false);

  if (!product.imageUrl || failed) {
    return null;
  }

  return (
    <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-stone-200/80 bg-white p-0.5">
      <img
        src={product.imageUrl}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-full w-full object-contain"
      />
    </div>
  );
};

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  state,
  report,
  onNavigate,
  onQuickAddProduct,
  onQuickLogExperience,
  onToggleTodayRoutineProduct,
  onResetDemoData,
}) => {
  const todayStr = formatLocalDate(new Date());
  const { products, routines, completions, journalEntries, hasDemoData } = state;

  const recentJournal = [...journalEntries]
    .sort(
      (a, b) =>
        getJournalEntrySortTimestamp(b) - getJournalEntrySortTimestamp(a)
    )
    .slice(0, 4);

  const isEmptyWorkspace =
    products.length === 0 &&
    routines.length === 0 &&
    journalEntries.length === 0;

  return (
    <div className="space-y-8">
      {/* A. Friendly, Personalised Welcome with Clear Purpose */}
      <section className="rounded-2xl border border-stone-200/80 bg-gradient-to-br from-stone-50/70 via-white to-blue-50/40 p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            {hasDemoData && (
              <p className="mb-1.5 text-xs font-medium text-blue-700/90">
                {DEMO_CUSTOMER_PROFILE.personaLabel} · SYNTHETIC DEMO DATA
              </p>
            )}
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance">
              {getFriendlyGreeting()}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Track your products, record your experience and understand what
              you notice over time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onQuickLogExperience}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-medium text-white shadow-xs hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Log Experience</span>
            </button>
            <button
              type="button"
              onClick={onQuickAddProduct}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-stone-50 transition-colors whitespace-nowrap"
            >
              <Plus className="h-3.5 w-3.5 text-blue-600" />
              <span>Add Product</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('discovery')}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-stone-50 transition-colors whitespace-nowrap"
            >
              <Compass className="h-3.5 w-3.5 text-slate-500" />
              <span>Explore Products</span>
            </button>
          </div>
        </div>
      </section>

      {isEmptyWorkspace ? (
        <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="font-display text-lg font-semibold text-slate-900 sm:text-xl">
              How A Wise Companion works
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              Start with one item you use today — the app connects your notes
              into a calm Reality Check automatically.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-stone-200/80 bg-stone-50/50 p-5 text-left">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                1
              </span>
              <h4 className="mt-3 font-display text-sm font-semibold text-slate-900">
                Add a product you’re currently using.
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Pick from the Be Bodywise catalogue or enter any product
                manually with what you hope to notice.
              </p>
            </div>

            <div className="rounded-xl border border-stone-200/80 bg-stone-50/50 p-5 text-left">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                2
              </span>
              <h4 className="mt-3 font-display text-sm font-semibold text-slate-900">
                Record your experience whenever something stands out.
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                No daily logging required — capture quick reactions, likes,
                dislikes, or difficulties as they come up.
              </p>
            </div>

            <div className="rounded-xl border border-blue-200/80 bg-blue-50/40 p-5 text-left">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                3
              </span>
              <h4 className="mt-3 font-display text-sm font-semibold text-slate-900">
                Review your Reality Check to understand your observations.
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Compare what you expected against what you actually recorded,
                with clear patterns and cautious next steps.
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onQuickAddProduct}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Add First Product
            </button>
            <button
              type="button"
              onClick={onResetDemoData}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-stone-50 transition-colors"
            >
              <RotateCcw className="h-4 w-4 text-slate-500" />
              <span>Restore SYNTHETIC DEMO DATA</span>
            </button>
          </div>
        </section>
      ) : (
        <>
          {/* B. Product Reality Check — Most Prominent Feature Centerpiece */}
          <section className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/85 via-white to-stone-50/80 p-6 shadow-xs sm:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700">
                  <Activity className="h-4 w-4" />
                  <span>Product Reality Check</span>
                  <span className="text-blue-200">·</span>
                  <span className="font-normal text-slate-600 tabular-nums">
                    {report.dataCoverage.productsCount} products ·{' '}
                    {report.dataCoverage.journalEntriesCount} observations
                  </span>
                </div>
                <h3 className="mt-1.5 font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  What your observations are showing right now
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  Compare what you expected against what you actually recorded,
                  see patterns backed by multiple entries, and get calm next
                  steps.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('reality-check')}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-xs hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                <span>Open Product Reality Check</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {report.discomfortNotice?.detected && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50/90 px-4 py-3 text-xs text-amber-950">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                <p>
                  <strong>Irritation or discomfort noted:</strong>{' '}
                  {report.discomfortNotice.details} Open Reality Check for
                  cautious next steps.
                </p>
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 gap-3.5 md:grid-cols-3">
              <div className="rounded-xl border border-emerald-200/70 bg-white/90 p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <Heart className="h-3.5 w-3.5" />
                  <span>What’s going well</span>
                </div>
                <p className="mt-1.5 text-sm font-semibold text-slate-900">
                  {report.highlights.whatsGoingWell.headline}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {report.highlights.whatsGoingWell.patternIdentified}
                </p>
              </div>

              <div className="rounded-xl border border-amber-200/70 bg-white/90 p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Something to reconsider</span>
                </div>
                <p className="mt-1.5 text-sm font-semibold text-slate-900">
                  {report.highlights.somethingToReconsider.headline}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {report.highlights.somethingToReconsider.patternIdentified}
                </p>
              </div>

              <div className="rounded-xl border border-blue-200/70 bg-white/90 p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>Suggested next step</span>
                </div>
                <p className="mt-1.5 text-sm font-semibold text-slate-900">
                  {report.highlights.smallSuggestion.headline}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {report.highlights.smallSuggestion.suggestion ||
                    report.highlights.smallSuggestion.interpretation}
                </p>
              </div>
            </div>
          </section>
          {/* B. Today's Routine — Prominent Centerpiece */}
          <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-7">
            <div className="flex flex-col gap-2 border-b border-stone-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Today’s Routine
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Check off products as you use them today.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('routines')}
                className="inline-flex items-center gap-1 self-start sm:self-center text-xs font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap"
              >
                <span>Open Routine Companion</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {routines.length === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-stone-200 bg-stone-50/70 p-8 text-center">
                <CalendarCheck2 className="mx-auto h-6 w-6 text-slate-400" />
                <p className="mt-2 text-sm text-slate-600">
                  No daily routines set up yet.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('routines')}
                  className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
                >
                  Create a Routine
                </button>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                {routines.map((routine) => {
                  const Icon = getRoutineIcon(routine.timeOfDay);
                  const todayComp = completions.find(
                    (c) => c.routineId === routine.id && c.date === todayStr
                  );
                  const completedIds = todayComp?.completedProductIds ?? [];
                  const skippedIds = todayComp?.skippedProductIds ?? [];
                  const routineProducts = routine.productIds
                    .map((id) => products.find((p) => p.id === id))
                    .filter((p): p is Product => Boolean(p));

                  const totalSteps = routineProducts.length;
                  const doneSteps = routineProducts.filter((p) =>
                    completedIds.includes(p.id)
                  ).length;
                  const isRoutineSkipped =
                    todayComp?.status === 'skipped' &&
                    completedIds.length === 0 &&
                    skippedIds.length === 0;
                  const skippedSteps = isRoutineSkipped
                    ? totalSteps
                    : routineProducts.filter(
                        (p) =>
                          !completedIds.includes(p.id) &&
                          skippedIds.includes(p.id)
                      ).length;
                  const remainingSteps = Math.max(
                    0,
                    totalSteps - doneSteps - skippedSteps
                  );
                  const isComplete = totalSteps > 0 && doneSteps === totalSteps;
                  const progressFraction =
                    totalSteps > 0 ? (doneSteps / totalSteps) * 100 : 0;

                  const summaryParts = [
                    `${doneSteps} of ${totalSteps} completed`,
                  ];
                  if (skippedSteps > 0) {
                    summaryParts.push(`${skippedSteps} skipped`);
                  } else if (remainingSteps > 0 && doneSteps > 0) {
                    summaryParts.push(`${remainingSteps} remaining`);
                  }

                  return (
                    <div
                      key={routine.id}
                      className={`flex flex-col justify-between rounded-xl border p-5 transition-colors ${
                        isComplete
                          ? 'border-emerald-200/80 bg-emerald-50/35'
                          : 'border-stone-200/80 bg-stone-50/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                isComplete
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-blue-50 text-blue-600'
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <div>
                              <h4 className="font-display text-base font-semibold text-slate-900">
                                {routine.name}
                              </h4>
                              <p className="text-xs text-slate-500 tabular-nums">
                                {routine.timeOfDay} · {summaryParts.join(' · ')}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Friendly Progress Bar */}
                        {totalSteps > 0 && !isRoutineSkipped && (
                          <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-200/70">
                            <div
                              className={`h-full rounded-full transition-all duration-200 ${
                                isComplete ? 'bg-emerald-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${progressFraction}%` }}
                            />
                          </div>
                        )}

                        {routineProducts.length === 0 ? (
                          <p className="mt-4 text-xs text-slate-500">
                            No products added to this routine yet.
                          </p>
                        ) : (
                          <div className="mt-4 space-y-2">
                            {routineProducts.map((prod) => {
                              const checked = completedIds.includes(prod.id);
                              const itemSkipped =
                                isRoutineSkipped ||
                                (!checked && skippedIds.includes(prod.id));
                              return (
                                <button
                                  key={prod.id}
                                  type="button"
                                  onClick={() =>
                                    onToggleTodayRoutineProduct(
                                      routine.id,
                                      prod.id
                                    )
                                  }
                                  className={`flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-colors ${
                                    itemSkipped
                                      ? 'bg-stone-100/80 hover:border-blue-200 hover:bg-white'
                                      : 'bg-white/90 hover:border-blue-200 hover:bg-white'
                                  }`}
                                >
                                  {checked ? (
                                    <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" />
                                  ) : itemSkipped ? (
                                    <SkipForward className="h-5 w-5 shrink-0 text-amber-600" />
                                  ) : (
                                    <Circle className="h-5 w-5 shrink-0 text-slate-300" />
                                  )}
                                  <RoutineProductThumb product={prod} />
                                  <div className="min-w-0 flex-1">
                                    <p
                                      className={`text-sm font-medium truncate ${
                                        checked
                                          ? 'text-slate-400 line-through'
                                          : itemSkipped
                                          ? 'text-slate-500'
                                          : 'text-slate-800'
                                      }`}
                                    >
                                      {prod.name}
                                    </p>
                                    <p className="text-[11px] text-slate-400 truncate">
                                      {prod.category}
                                      {prod.selectedVariant
                                        ? ` · ${prod.selectedVariant}`
                                        : ''}
                                      {itemSkipped ? ' · Skipped today' : ''}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {isComplete && (
                        <p className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-100/70 px-3 py-2 text-xs font-medium text-emerald-800">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                          <span>
                            All set for this routine — {doneSteps} of{' '}
                            {totalSteps} completed today.
                          </span>
                        </p>
                      )}
                      {!isComplete &&
                        !isRoutineSkipped &&
                        remainingSteps === 0 &&
                        totalSteps > 0 && (
                          <p className="mt-4 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800">
                            Handled for today — {summaryParts.join(' · ')}.
                          </p>
                        )}
                      {isRoutineSkipped && (
                        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                          Skipped for today — pick back up whenever you’re
                          ready.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* D. Recent Experiences */}
          <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Recent Experiences
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Your latest notes on how products feel day to day.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onQuickLogExperience}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/70 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100/70 transition-colors whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Log Experience</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('journal')}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 whitespace-nowrap"
                >
                  All notes
                </button>
              </div>
            </div>

            {recentJournal.length === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-stone-200 bg-stone-50/70 p-8 text-center">
                <BookOpen className="mx-auto h-6 w-6 text-slate-400" />
                <p className="mt-2 text-sm text-slate-600">
                  No observations logged yet.
                </p>
                <button
                  type="button"
                  onClick={onQuickLogExperience}
                  className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
                >
                  Log Your First Note
                </button>
              </div>
            ) : (
              <ol className="mt-5 space-y-4">
                {recentJournal.map((entry) => {
                  const product = products.find(
                    (p) => p.id === entry.productId
                  );
                  const entryDateIndian = formatDateKeyToIndian(
                    resolveJournalEntryIstDateKey(entry)
                  );
                  const entryTime = formatIstTime12h(entry.createdAt);

                  return (
                    <li
                      key={entry.id}
                      className="relative flex gap-3.5 border-b border-stone-100 pb-4 last:border-b-0 last:pb-0"
                    >
                      <span
                        className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-400 ring-4 ring-blue-50"
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                          <span className="font-semibold text-slate-800">
                            {product ? product.name : 'General observation'}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="tabular-nums">
                            {entryDateIndian}
                            {entryTime ? ` · ${entryTime}` : ''}
                          </span>
                          {entry.isDemo && (
                            <>
                              <span className="text-slate-300">·</span>
                              <span className="text-slate-400">
                                SYNTHETIC DEMO DATA
                              </span>
                            </>
                          )}
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-slate-700">
                          {entry.notes ||
                            `Overall experience: ${deriveOverallExperience(entry)}.`}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        </>
      )}
    </div>
  );
};
