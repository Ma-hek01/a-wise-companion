import React, { useState } from 'react';
import {
  Activity,
  ArrowLeft,
  BookOpen,
  CalendarCheck2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Plus,
} from 'lucide-react';
import {
  deriveOverallExperience,
  formatFeedbackList,
} from '../data/journalOptions';
import {
  Product,
  ProductRealityReport,
  ProductRealitySection,
  Routine,
  RoutineCompletion,
  JournalEntry,
} from '../types/companion';
import { ConsistencyBarChart, SatisfactionTrendChart } from './Charts';
import {
  formatDateKeyToIndian,
  formatIstTime12h,
  resolveJournalEntryIstDateKey,
} from '../utils/istDate';

interface ProductDetailViewProps {
  product: Product;
  routines: Routine[];
  completions: RoutineCompletion[];
  journalEntries: JournalEntry[];
  productReport: ProductRealityReport | null;
  onBackToProducts: () => void;
  onLogObservationForProduct: (productId: string) => void;
  onOpenFullRealityCheck: (productId: string) => void;
}

const ALIGNMENT_STYLES = {
  aligned: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'partially-aligned': 'border-blue-200 bg-blue-50 text-blue-800',
  different: 'border-amber-200 bg-amber-50 text-amber-800',
  'insufficient-data': 'border-slate-200 bg-slate-100 text-slate-700',
} as const;

const ExpandableSectionRow: React.FC<{ section: ProductRealitySection }> = ({
  section,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="py-3.5 first:pt-0 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">{section.title}</p>
          <p className="mt-0.5 text-sm font-medium text-slate-900">
            {section.headlineSummary}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 whitespace-nowrap"
        >
          <span>{expanded ? 'Hide details' : 'Details'}</span>
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 grid grid-cols-1 gap-4 rounded-lg border border-slate-100 bg-slate-50/70 p-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-slate-600">
              1. What you recorded
            </p>
            <ul className="mt-1.5 space-y-1.5 text-xs leading-relaxed text-slate-700">
              {section.recordedFacts.map((fact, idx) => (
                <li key={idx}>
                  <span className="font-medium text-slate-900">
                    {fact.label}:{' '}
                  </span>
                  {fact.detail}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-700">
              2. Patterns identified
            </p>
            {section.identifiedPatterns.length > 0 ? (
              <ul className="mt-1.5 space-y-1.5 text-xs leading-relaxed text-slate-700">
                {section.identifiedPatterns.map((pat, idx) => (
                  <li key={idx}>{pat}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1.5 text-xs text-slate-500">
                Insufficient entries to identify a repeating pattern yet.
              </p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-blue-800">
              3. Possible interpretations
            </p>
            {section.possibleInterpretations.length > 0 ? (
              <ul className="mt-1.5 space-y-1.5 text-xs leading-relaxed text-slate-700">
                {section.possibleInterpretations.map((interp, idx) => (
                  <li key={idx}>{interp}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1.5 text-xs text-slate-500">
                More notes needed before suggesting interpretations.
              </p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-700">
              4. Suggested next steps
            </p>
            {section.suggestedActions.length > 0 ? (
              <ul className="mt-1.5 space-y-1.5 text-xs leading-relaxed text-slate-700">
                {section.suggestedActions.map((act, idx) => (
                  <li key={idx}>{act}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1.5 text-xs text-slate-500">
                Keep logging check-ins as usual.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  routines,
  completions,
  journalEntries,
  productReport,
  onBackToProducts,
  onLogObservationForProduct,
  onOpenFullRealityCheck,
}) => {
  const productRoutines = routines.filter((r) =>
    r.productIds.includes(product.id)
  );
  const productCompletions = completions.filter(
    (c) =>
      productRoutines.some((r) => r.id === c.routineId) ||
      c.completedProductIds.includes(product.id)
  );
  const productEntries = [...journalEntries]
    .filter((e) => e.productId === product.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const recentUsageLogs = [...productCompletions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  const avgRating =
    productEntries.length > 0
      ? (
          productEntries.reduce((sum, e) => sum + e.satisfaction, 0) /
          productEntries.length
        ).toFixed(1)
      : null;

  const expectationItem = productReport?.expectationsVsReality[0];

  const daysTracked = (() => {
    const [y, m, d] = product.dateStarted.split('-').map(Number);
    const start = new Date(y, (m || 1) - 1, d || 1).getTime();
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    return Math.max(0, Math.round((today - start) / 86400000));
  })();

  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBackToProducts}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Routine Companion</span>
        </button>
        <span className="text-xs text-slate-400">
          Routine Companion · My Products
        </span>
      </div>

      {/* Product Header Card */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            {product.imageUrl && !imgFailed && (
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-1.5">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <div>
              <p className="text-xs text-slate-500 tabular-nums">
                {product.category}
                {product.subcategory ? ` · ${product.subcategory}` : ''}
                {product.selectedVariant ? ` · ${product.selectedVariant}` : ''}
                {' · '}Started {formatDateKeyToIndian(product.dateStarted)} (
                {daysTracked} days) · {product.frequencyGoal}
                {product.isDemo ? ' · SYNTHETIC DEMO DATA' : ''}
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900">
                {product.name}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onLogObservationForProduct(product.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 whitespace-nowrap"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Log Experience</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenFullRealityCheck(product.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
            >
              <Activity className="h-3.5 w-3.5 text-blue-600" />
              <span>Full Reality Report</span>
            </button>
          </div>
        </div>

        {/* Original Expectations & Key Summary */}
        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 md:grid-cols-3">
          <div className="md:col-span-2 space-y-3">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Original Personal Expectations
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-800">
                {product.expectations || 'No expectations recorded yet.'}
              </p>
            </div>

            {((product.keyIngredients && product.keyIngredients.length > 0) ||
              product.officialUrl) && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-600">
                {product.keyIngredients && product.keyIngredients.length > 0 && (
                  <p>
                    <span className="font-medium text-slate-700">
                      Documented ingredients:{' '}
                    </span>
                    {product.keyIngredients.join(', ')}
                  </p>
                )}
                {product.officialUrl && (
                  <a
                    href={product.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap"
                  >
                    <span>Official product page</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3.5 border border-slate-100">
            <div>
              <p className="text-xs text-slate-500">Average rating</p>
              <p className="mt-0.5 font-display text-lg font-bold text-slate-900 tabular-nums">
                {avgRating ? `${avgRating}/5` : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Consistency</p>
              <p className="mt-0.5 font-display text-lg font-bold text-slate-900 tabular-nums">
                {productReport?.metrics.overallAdherenceRate !== null &&
                productReport?.metrics.overallAdherenceRate !== undefined
                  ? `${productReport.metrics.overallAdherenceRate}%`
                  : '—'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expectations vs Reality Card */}
      {expectationItem && (
        <section className="rounded-xl border border-blue-200 bg-white p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-display text-base font-semibold text-slate-900">
              Expectations vs Reality
            </h3>
            <span
              className={`inline-flex items-center self-start rounded-md border px-2.5 py-1 text-xs font-medium ${
                ALIGNMENT_STYLES[expectationItem.status]
              }`}
            >
              {expectationItem.statusLabel}
            </span>
          </div>

          <p className="mt-2.5 text-sm leading-relaxed text-slate-700">
            <strong className="font-medium text-slate-900">
              1. What you recorded:{' '}
            </strong>
            {expectationItem.recordedComparisonSummary}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
            <strong className="font-medium text-slate-900">
              2. Patterns identified:{' '}
            </strong>
            {expectationItem.identifiedPatterns.length > 0
              ? expectationItem.identifiedPatterns.join(' ')
              : 'Insufficient observations to identify a pattern yet.'}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
            <strong className="font-medium text-blue-800">
              3. Possible interpretation:{' '}
            </strong>
            {expectationItem.interpretation}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            <strong className="font-medium text-slate-800">
              4. Suggested next step:{' '}
            </strong>
            {expectationItem.suggestion}
          </p>

          {(expectationItem.matchingSignals.length > 0 ||
            expectationItem.gapSignals.length > 0) && (
            <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 text-xs">
              <div>
                <p className="font-semibold text-slate-600">What aligns</p>
                <p className="mt-1 leading-relaxed text-slate-700">
                  {expectationItem.matchingSignals.length > 0
                    ? expectationItem.matchingSignals.join(' ')
                    : 'No clear matching notes recorded yet.'}
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-600">
                  Where it differs
                </p>
                <p className="mt-1 leading-relaxed text-slate-700">
                  {expectationItem.gapSignals.length > 0
                    ? expectationItem.gapSignals.join(' ')
                    : 'No conflicting dislikes or difficulties recorded.'}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Usage History & Satisfaction Charts */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-display text-base font-semibold text-slate-900">
            Usage Consistency (14 Days)
          </h3>
          <p className="mt-0.5 mb-3 text-xs text-slate-500">
            {productRoutines.length > 0
              ? `Included in ${productRoutines.map((r) => r.name).join(', ')}`
              : 'Not assigned to a routine yet'}
          </p>
          <ConsistencyBarChart
            completions={productCompletions}
            routines={routines}
            selectedProductId={product.id}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-display text-base font-semibold text-slate-900">
            Satisfaction Ratings
          </h3>
          <p className="mt-0.5 mb-3 text-xs text-slate-500 tabular-nums">
            {productEntries.length}{' '}
            {productEntries.length === 1 ? 'entry' : 'entries'} recorded
          </p>
          <SatisfactionTrendChart entries={productEntries} />
        </div>
      </section>

      {/* Usage History Log + Journal Entries */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <CalendarCheck2 className="h-4 w-4 text-blue-600" />
            <h3 className="font-display text-base font-semibold text-slate-900">
              Recent Usage History
            </h3>
          </div>

          {recentUsageLogs.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No routine check-ins recorded for this product yet.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {recentUsageLogs.map((log) => {
                const used = log.completedProductIds.includes(product.id);
                const skippedIndividual = (
                  log.skippedProductIds ?? []
                ).includes(product.id);
                const routine = routines.find((r) => r.id === log.routineId);
                return (
                  <li
                    key={log.id}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <span className="font-medium text-slate-900 tabular-nums">
                        {formatDateKeyToIndian(log.date)}
                      </span>
                      <span className="mx-1.5 text-slate-300">·</span>
                      <span className="text-slate-600 truncate">
                        {routine?.name ?? 'Routine'}
                      </span>
                      {log.barrierNote && !used && (
                        <p className="text-xs text-slate-500">
                          Note: {log.barrierNote}
                        </p>
                      )}
                    </div>
                    <span
                      className={`shrink-0 text-xs font-medium ${
                        used ? 'text-blue-700' : 'text-amber-700'
                      }`}
                    >
                      {used
                        ? 'Used'
                        : skippedIndividual || log.status === 'skipped'
                        ? 'Skipped'
                        : 'Not checked'}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <h3 className="font-display text-base font-semibold text-slate-900">
                Journal Entries
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onLogObservationForProduct(product.id)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Add Entry
            </button>
          </div>

          {productEntries.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No journal entries saved for this product yet.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {productEntries.map((entry) => {
                const entryIstDate = formatDateKeyToIndian(
                  resolveJournalEntryIstDateKey(entry)
                );
                const entryIstTime = formatIstTime12h(entry.createdAt);
                return (
                <div key={entry.id} className="py-3 first:pt-0 last:pb-0">
                  <p className="text-xs text-slate-500 tabular-nums">
                    {entryIstDate}
                    {entryIstTime ? ` · ${entryIstTime}` : ''} ·{' '}
                    {deriveOverallExperience(entry)}
                    {entry.continueUsing
                      ? ` · Continue: ${entry.continueUsing}`
                      : ''}
                    {entry.isDemo ? ' · SYNTHETIC DEMO DATA' : ''}
                  </p>
                  {entry.notes && (
                    <p className="mt-1 text-sm leading-relaxed text-slate-800">
                      {entry.notes}
                    </p>
                  )}
                  {(entry.likes.length > 0 ||
                    entry.dislikes.length > 0 ||
                    entry.barriers.length > 0) && (
                    <p className="mt-1.5 text-xs text-slate-500">
                      {entry.likes.length > 0 &&
                        `Liked: ${formatFeedbackList(entry.likes, entry.likesOther).join(', ')}. `}
                      {entry.dislikes.length > 0 &&
                        `Didn't like: ${formatFeedbackList(entry.dislikes, entry.dislikesOther).join(', ')}. `}
                      {entry.barriers.length > 0 &&
                        `Difficulty: ${formatFeedbackList(entry.barriers, entry.barriersOther).join(', ')}.`}
                    </p>
                  )}
                </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Individual Product Reality Report */}
      {productReport && (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-display text-base font-semibold text-slate-900">
              Individual Product Reality Report
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Summary based strictly on this product’s saved logs. Expand any
              area for facts, interpretations, and suggested actions.
            </p>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            <ExpandableSectionRow
              section={productReport.sections.experienceOverview}
            />
            <ExpandableSectionRow
              section={productReport.sections.usageConsistency}
            />
            <ExpandableSectionRow
              section={productReport.sections.customerSatisfaction}
            />
            <ExpandableSectionRow
              section={productReport.sections.likesAndDislikes}
            />
            <ExpandableSectionRow
              section={productReport.sections.possibleBarriers}
            />
          </div>
        </section>
      )}
    </div>
  );
};
