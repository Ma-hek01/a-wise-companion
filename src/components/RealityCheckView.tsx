import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Heart,
  Lightbulb,
  RotateCcw,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { formatReportAsMarkdown } from '../services/realityCheckEngine';
import {
  AppView,
  CompanionState,
  ExpectationAlignmentStatus,
  ProductRealityReport,
  ProductRealitySection,
} from '../types/companion';
import { ConsistencyBarChart, SatisfactionTrendChart } from './Charts';

interface RealityCheckViewProps {
  state: CompanionState;
  report: ProductRealityReport;
  selectedProductId: string | 'all';
  onSelectProductId: (id: string | 'all') => void;
  onNavigate: (view: AppView) => void;
  onOpenProductDetail: (productId: string) => void;
  onResetDemoData: () => void;
}

const ALIGNMENT_STYLE: Record<ExpectationAlignmentStatus, string> = {
  aligned: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'partially-aligned': 'border-blue-200 bg-blue-50 text-blue-800',
  different: 'border-amber-200 bg-amber-50 text-amber-800',
  'insufficient-data': 'border-slate-200 bg-slate-100 text-slate-700',
};

const ProgressiveReportCard: React.FC<{
  section: ProductRealitySection;
}> = ({ section }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">{section.title}</p>
          <h4 className="mt-0.5 font-display text-sm font-semibold text-slate-900">
            {section.headlineSummary}
          </h4>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex self-start sm:self-center shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
        >
          <span>{expanded ? 'Hide' : 'Details'}</span>
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-slate-500" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200/70 bg-slate-50/40 p-3.5">
            <p className="text-xs font-semibold text-slate-600">
              1. What you recorded
            </p>
            <dl className="mt-2 divide-y divide-slate-100">
              {section.recordedFacts.map((fact, idx) => (
                <div key={idx} className="py-2 first:pt-0 last:pb-0">
                  <dt className="text-xs font-medium text-slate-500">
                    {fact.label}
                  </dt>
                  <dd className="mt-0.5 text-xs leading-relaxed text-slate-800">
                    {fact.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-lg border border-slate-200/70 bg-white p-3.5">
            <p className="text-xs font-semibold text-slate-700">
              2. Patterns identified
            </p>
            {section.identifiedPatterns.length > 0 ? (
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-700">
                {section.identifiedPatterns.map((pat, idx) => (
                  <li key={idx}>{pat}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-slate-500">
                Insufficient entries to identify a repeating pattern yet.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50/45 p-3.5">
            <p className="text-xs font-semibold text-blue-800">
              3. Possible interpretation
            </p>
            {section.possibleInterpretations.length > 0 ? (
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-700">
                {section.possibleInterpretations.map((interp, idx) => (
                  <li key={idx}>{interp}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-slate-500">
                Not enough repeating observations yet to offer an interpretation.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5">
            <p className="text-xs font-semibold text-slate-700">
              4. Suggested next steps
            </p>
            {section.suggestedActions.length > 0 ? (
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-700">
                {section.suggestedActions.map((action, idx) => (
                  <li key={idx}>{action}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-slate-500">
                No changes needed based on your current logs.
              </p>
            )}
          </div>
        </div>
      )}
    </article>
  );
};

export const RealityCheckView: React.FC<RealityCheckViewProps> = ({
  state,
  report,
  selectedProductId,
  onSelectProductId,
  onNavigate,
  onOpenProductDetail,
  onResetDemoData,
}) => {
  const [copied, setCopied] = useState(false);

  // Optional deep-dive expandable toggles (collapsed by default for calm UX)
  const [showLikesDislikes, setShowLikesDislikes] = useState(false);
  const [showUsageAndTrends, setShowUsageAndTrends] = useState(false);
  const [showSupportingObservations, setShowSupportingObservations] =
    useState(false);

  const scopedCompletions = state.completions.filter((c) => {
    if (selectedProductId === 'all') return true;
    const routine = state.routines.find((r) => r.id === c.routineId);
    return (
      routine?.productIds.includes(selectedProductId) ||
      c.completedProductIds.includes(selectedProductId)
    );
  });

  const scopedEntries = state.journalEntries.filter((e) =>
    selectedProductId === 'all' ? true : e.productId === selectedProductId
  );

  const handleCopyMarkdown = async () => {
    const markdown = formatReportAsMarkdown(report);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const handleDownloadMarkdown = () => {
    const markdown = formatReportAsMarkdown(report);
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reality-check-${selectedProductId === 'all' ? 'all' : 'product'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header & Scope Filter */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-blue-700">
              <Activity className="h-4 w-4 text-blue-600" />
              <span>Reality Check</span>
              {state.hasDemoData && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500">SYNTHETIC DEMO DATA</span>
                </>
              )}
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900">
              What have I learned about my products?
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Automatically pulled together from what you track, use in your
              routines, and record in your journal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              disabled={report.isEmpty}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-blue-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownloadMarkdown}
              disabled={report.isEmpty}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor="reality-scope-select"
              className="text-xs font-medium text-slate-600"
            >
              Focus on:
            </label>
            <select
              id="reality-scope-select"
              value={selectedProductId}
              onChange={(e) => onSelectProductId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All Tracked Products ({state.products.length})
              </option>
              {state.products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-slate-500 tabular-nums">
            {report.dataCoverage.productsCount} products ·{' '}
            {report.dataCoverage.journalEntriesCount} experiences logged
          </p>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-2.5 text-xs text-slate-600">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <p>{report.methodologyNote}</p>
        </div>
      </section>

      {report.isEmpty ? (
        <section
          data-tour="reality-report-section"
          className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xs"
        >
          <h3 className="font-display text-lg font-semibold text-slate-900">
            Nothing recorded yet
          </h3>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600">
            Add a product you’re using and log a couple of quick experiences to
            see how things compare to what you expected.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('routines')}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Product
            </button>
            <button
              type="button"
              onClick={onResetDemoData}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4 text-slate-500" />
              <span>Load SYNTHETIC DEMO DATA</span>
            </button>
          </div>
        </section>
      ) : (
        <>
          {report.discomfortNotice?.detected && (
            <section
              role="status"
              className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50/80 p-4 text-xs leading-relaxed text-amber-950"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <div>
                <p className="font-semibold">
                  Irritation or discomfort noted ({report.discomfortNotice.entryCount}{' '}
                  {report.discomfortNotice.entryCount === 1 ? 'entry' : 'entries'})
                </p>
                <p className="mt-0.5 text-amber-900">
                  {report.discomfortNotice.details} Further routine experimentation
                  is paused in suggestions — consider checking official product
                  guidance or consulting an appropriate professional.
                </p>
              </div>
            </section>
          )}

          {/* Simplified 3-Card Insight Summary with Clear 4-Layer Separation */}
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* 1. What's going well? */}
            <article className="flex flex-col justify-between rounded-2xl border border-emerald-200/80 bg-white p-5 shadow-xs">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <Heart className="h-4 w-4" />
                  <span>What’s going well?</span>
                </div>
                <h3 className="mt-2 font-display text-base font-semibold text-slate-900">
                  {report.highlights.whatsGoingWell.headline}
                </h3>
                <div className="mt-2.5 space-y-1.5 text-xs leading-relaxed text-slate-600">
                  <p>
                    <strong className="font-medium text-slate-800">
                      What you recorded:{' '}
                    </strong>
                    {report.highlights.whatsGoingWell.whatYouRecorded}
                  </p>
                  <p>
                    <strong className="font-medium text-slate-800">
                      Patterns identified:{' '}
                    </strong>
                    {report.highlights.whatsGoingWell.patternIdentified}
                  </p>
                </div>
              </div>
              <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-600">
                <strong className="font-medium text-emerald-800">
                  Possible interpretation:{' '}
                </strong>
                {report.highlights.whatsGoingWell.interpretation}
              </p>
            </article>

            {/* 2. Something to reconsider */}
            <article className="flex flex-col justify-between rounded-2xl border border-amber-200/80 bg-white p-5 shadow-xs">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
                  <AlertCircle className="h-4 w-4" />
                  <span>Something to reconsider</span>
                </div>
                <h3 className="mt-2 font-display text-base font-semibold text-slate-900">
                  {report.highlights.somethingToReconsider.headline}
                </h3>
                <div className="mt-2.5 space-y-1.5 text-xs leading-relaxed text-slate-600">
                  <p>
                    <strong className="font-medium text-slate-800">
                      What you recorded:{' '}
                    </strong>
                    {report.highlights.somethingToReconsider.whatYouRecorded}
                  </p>
                  <p>
                    <strong className="font-medium text-slate-800">
                      Patterns identified:{' '}
                    </strong>
                    {report.highlights.somethingToReconsider.patternIdentified}
                  </p>
                </div>
              </div>
              <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-600">
                <strong className="font-medium text-amber-800">
                  Possible interpretation:{' '}
                </strong>
                {report.highlights.somethingToReconsider.interpretation}
              </p>
            </article>

            {/* 3. A small suggestion */}
            <article className="flex flex-col justify-between rounded-2xl border border-blue-200/80 bg-blue-50/30 p-5 shadow-xs">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
                  <Lightbulb className="h-4 w-4" />
                  <span>Suggested next step</span>
                </div>
                <h3 className="mt-2 font-display text-base font-semibold text-slate-900">
                  {report.highlights.smallSuggestion.headline}
                </h3>
                <div className="mt-2.5 space-y-1.5 text-xs leading-relaxed text-slate-600">
                  <p>
                    <strong className="font-medium text-slate-800">
                      What you recorded:{' '}
                    </strong>
                    {report.highlights.smallSuggestion.whatYouRecorded}
                  </p>
                  <p>
                    <strong className="font-medium text-slate-800">
                      Patterns identified:{' '}
                    </strong>
                    {report.highlights.smallSuggestion.patternIdentified}
                  </p>
                  <p>
                    <strong className="font-medium text-slate-800">
                      Possible interpretation:{' '}
                    </strong>
                    {report.highlights.smallSuggestion.interpretation}
                  </p>
                </div>
              </div>
              <p className="mt-3 border-t border-blue-100 pt-3 text-xs leading-relaxed text-slate-700">
                <strong className="font-medium text-blue-800">
                  Next step:{' '}
                </strong>
                {report.highlights.smallSuggestion.suggestion ||
                  report.highlights.smallSuggestion.interpretation}
              </p>
            </article>
          </section>

          {/* 4. Your product experience (Simplified Expectations vs Reality) */}
          <section
            data-tour="reality-report-section"
            className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
          >
            <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-blue-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Your product experience</span>
                </div>
                <h3 className="mt-0.5 font-display text-lg font-semibold text-slate-900">
                  Expectations vs Reality
                </h3>
                <p className="mt-0.5 text-xs text-slate-600">
                  {report.highlights.productExperience.headline} —{' '}
                  {report.highlights.productExperience.whatYouRecorded}
                </p>
              </div>
            </div>

            {report.expectationsVsReality.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                Add a product with what you hope for to see how your logged
                experiences compare.
              </p>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                {report.expectationsVsReality.map((item) => (
                  <article
                    key={item.productId}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/40 p-5"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => onOpenProductDetail(item.productId)}
                            className="text-left font-display text-base font-semibold text-slate-900 hover:text-blue-700"
                          >
                            {item.productName}
                          </button>
                          <p className="text-xs text-slate-500 tabular-nums">
                            {item.category} · {item.journalCount}{' '}
                            {item.journalCount === 1
                              ? 'experience'
                              : 'experiences'}
                            {item.isDemo ? ' · SYNTHETIC DEMO DATA' : ''}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
                            ALIGNMENT_STYLE[item.status]
                          }`}
                        >
                          {item.statusLabel}
                        </span>
                      </div>

                      <div className="mt-3.5 space-y-2 text-xs leading-relaxed">
                        <div>
                          <span className="font-semibold text-slate-600">
                            What you expected:{' '}
                          </span>
                          <span className="text-slate-700">
                            {item.originalExpectation || 'None written yet.'}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-600">
                            1. What you recorded:{' '}
                          </span>
                          <span className="text-slate-800">
                            {item.recordedComparisonSummary}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-600">
                            2. Patterns identified:{' '}
                          </span>
                          <span className="text-slate-800">
                            {item.identifiedPatterns.length > 0
                              ? item.identifiedPatterns.join(' ')
                              : 'No repeating pattern identified yet.'}
                          </span>
                        </div>
                        <div className="rounded-lg border border-blue-100/80 bg-white px-3 py-2">
                          <span className="font-semibold text-blue-800">
                            3. Possible interpretation:{' '}
                          </span>
                          <span className="text-slate-700">
                            {item.interpretation}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-600">
                            4. Suggested next step:{' '}
                          </span>
                          <span className="text-slate-700">
                            {item.suggestion}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end border-t border-slate-200/60 pt-3">
                      <button
                        type="button"
                        onClick={() => onOpenProductDetail(item.productId)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        <span>Open product page</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Optional Expandable Deep-Dive Sections (Collapsed by default) */}
          <section className="space-y-3">
            <p className="text-xs font-medium text-slate-500">
              Want to dig deeper into your saved details?
            </p>

            {/* Toggle 1: Explore recurring likes and dislikes */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setShowLikesDislikes((v) => !v)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50/70 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Explore recurring likes and dislikes
                  </p>
                  <p className="text-xs text-slate-500">
                    {report.sections.likesAndDislikes.headlineSummary}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 whitespace-nowrap">
                  <span>{showLikesDislikes ? 'Hide' : 'Explore'}</span>
                  {showLikesDislikes ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </span>
              </button>

              {showLikesDislikes && (
                <div className="border-t border-slate-100 p-5 space-y-4">
                  <ProgressiveReportCard
                    section={report.sections.likesAndDislikes}
                  />
                  <ProgressiveReportCard
                    section={report.sections.possibleBarriers}
                  />
                </div>
              )}
            </div>

            {/* Toggle 2: View usage history & satisfaction trends */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setShowUsageAndTrends((v) => !v)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-4 w-4 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      View usage history & satisfaction trends
                    </p>
                    <p className="text-xs text-slate-500">
                      {report.sections.usageConsistency.headlineSummary} ·{' '}
                      {report.sections.customerSatisfaction.headlineSummary}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 whitespace-nowrap">
                  <span>{showUsageAndTrends ? 'Hide' : 'View'}</span>
                  {showUsageAndTrends ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </span>
              </button>

              {showUsageAndTrends && (
                <div className="border-t border-slate-100 p-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-5">
                    <h4 className="mb-3 font-display text-sm font-semibold text-slate-900">
                      View usage history (14 days)
                    </h4>
                    <ConsistencyBarChart
                      completions={scopedCompletions}
                      routines={state.routines}
                      selectedProductId={selectedProductId}
                    />
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-5">
                    <h4 className="mb-3 font-display text-sm font-semibold text-slate-900">
                      View satisfaction trends
                    </h4>
                    <SatisfactionTrendChart entries={scopedEntries} />
                  </div>
                </div>
              )}
            </div>

            {/* Toggle 3: See supporting observations */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setShowSupportingObservations((v) => !v)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50/70 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    See supporting observations
                  </p>
                  <p className="text-xs text-slate-500">
                    Full breakdown of recorded facts, recurring themes, and
                    next steps
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 whitespace-nowrap">
                  <span>{showSupportingObservations ? 'Hide' : 'Show'}</span>
                  {showSupportingObservations ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </span>
              </button>

              {showSupportingObservations && (
                <div className="border-t border-slate-100 p-5 space-y-4">
                  <ProgressiveReportCard
                    section={report.sections.experienceOverview}
                  />
                  <ProgressiveReportCard
                    section={report.sections.usageConsistency}
                  />
                  <ProgressiveReportCard
                    section={report.sections.customerSatisfaction}
                  />
                  <ProgressiveReportCard
                    section={report.sections.recurringObservations}
                  />

                  <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-5">
                    <h4 className="font-display text-sm font-semibold text-slate-900">
                      Suggested Next Steps
                    </h4>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {report.sections.suggestedNextSteps.recordedBasisSummary}
                    </p>
                    <div className="mt-3 divide-y divide-slate-100 border-t border-slate-100">
                      {report.sections.suggestedNextSteps.steps.map(
                        (step, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col gap-2 py-3 first:pt-3 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div>
                              <p className="text-xs font-medium text-slate-900">
                                {step.action}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                Based on: {step.basis}
                              </p>
                            </div>
                            {step.targetView && (
                              <button
                                type="button"
                                onClick={() => onNavigate(step.targetView!)}
                                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 whitespace-nowrap"
                              >
                                <span>Go there</span>
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};
