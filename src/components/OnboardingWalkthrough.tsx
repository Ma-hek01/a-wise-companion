import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, X } from 'lucide-react';

interface OnboardingWalkthroughProps {
  isOpen: boolean;
  currentStep: number;
  onStepChange: (stepIndex: number) => void;
  onFinish: () => void;
  onSkip: () => void;
}

interface TourStepConfig {
  id: string;
  targetSelector: string;
  title: string;
  description: string;
  isTallSection?: boolean;
}

const TOUR_STEPS: TourStepConfig[] = [
  {
    id: 'routine-companion-nav',
    targetSelector: '[data-tour="nav-routines"]',
    title: 'Routine Companion',
    description:
      'Manage your products and organise your daily routines in one place.',
  },
  {
    id: 'add-product',
    targetSelector: '[data-tour="add-product-btn"]',
    title: 'Add a Product',
    description:
      'Add products from the catalogue or enter them manually in My Products.',
  },
  {
    id: 'my-routines',
    targetSelector: '[data-tour="routines-section"]',
    title: 'My Routines',
    description: 'Organise your products into simple Morning, Evening, or Custom routines.',
    isTallSection: true,
  },
  {
    id: 'progress-journal',
    targetSelector: '[data-tour="log-experience-btn"]',
    title: 'Log Your Experience',
    description: 'Record what you like, dislike or notice over time.',
  },
  {
    id: 'reality-check',
    targetSelector: '[data-tour="reality-report-section"]',
    title: 'Your Reality Check',
    description: 'See patterns in your recorded product experience.',
    isTallSection: true,
  },
];

interface SpotlightBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TooltipCoords {
  top: number;
  left: number;
}

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

function findVisibleTarget(selector: string): HTMLElement | null {
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>(selector)
  );
  return (
    candidates.find((el) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== 'none' &&
        style.visibility !== 'hidden'
      );
    }) ?? null
  );
}

export const OnboardingWalkthrough: React.FC<OnboardingWalkthroughProps> = ({
  isOpen,
  currentStep,
  onStepChange,
  onFinish,
  onSkip,
}) => {
  const step = TOUR_STEPS[currentStep] ?? TOUR_STEPS[0];
  const isFirst = currentStep === 0;
  const isLast = currentStep === TOUR_STEPS.length - 1;

  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [spotlight, setSpotlight] = useState<SpotlightBox | null>(null);
  const [tooltipCoords, setTooltipCoords] = useState<TooltipCoords>({
    top: 24,
    left: 24,
  });

  const measureTarget = useCallback(() => {
    if (!isOpen) return;
    const el = findVisibleTarget(step.targetSelector);
    if (!el) {
      setSpotlight(null);
      return;
    }

    const rect = el.getBoundingClientRect();
    const pad = 6;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const rawTop = rect.top - pad;
    const rawLeft = rect.left - pad;
    const rawBottom = rect.bottom + pad;
    const rawRight = rect.right + pad;

    const top = clamp(rawTop, 4, vh - 24);
    const left = clamp(rawLeft, 4, vw - 24);
    const bottom = clamp(rawBottom, top + 20, vh - 4);
    const right = clamp(rawRight, left + 20, vw - 4);

    setSpotlight({
      top,
      left,
      width: right - left,
      height: bottom - top,
    });
  }, [isOpen, step.targetSelector]);

  // Scroll target into view when step changes, then track resize & scroll
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    let targetObserver: ResizeObserver | null = null;

    const syncAfterRender = () => {
      if (cancelled) return;
      const el = findVisibleTarget(step.targetSelector);
      if (el) {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const needsScroll =
          rect.top < 72 ||
          rect.bottom > vh - 24 ||
          rect.left < 0 ||
          rect.right > window.innerWidth;

        if (needsScroll) {
          el.scrollIntoView({
            behavior: 'smooth',
            block: step.isTallSection && rect.height > vh * 0.55 ? 'start' : 'center',
            inline: 'nearest',
          });
        }

        if (typeof ResizeObserver !== 'undefined') {
          targetObserver = new ResizeObserver(() => measureTarget());
          targetObserver.observe(el);
        }
      }

      measureTarget();
    };

    const rafId = window.requestAnimationFrame(syncAfterRender);
    const settleTimer1 = window.setTimeout(measureTarget, 90);
    const settleTimer2 = window.setTimeout(measureTarget, 280);

    window.addEventListener('resize', measureTarget);
    window.addEventListener('scroll', measureTarget, true);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(settleTimer1);
      window.clearTimeout(settleTimer2);
      window.removeEventListener('resize', measureTarget);
      window.removeEventListener('scroll', measureTarget, true);
      targetObserver?.disconnect();
    };
  }, [isOpen, currentStep, step.targetSelector, step.isTallSection, measureTarget]);

  // Intelligently position floating tooltip so it never covers target or leaves viewport
  useLayoutEffect(() => {
    if (!isOpen) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 12;
    const gap = 14;
    const tooltipEl = tooltipRef.current;
    const tooltipW = tooltipEl?.offsetWidth || Math.min(340, vw - margin * 2);
    const tooltipH = tooltipEl?.offsetHeight || 220;

    if (!spotlight) {
      setTooltipCoords({
        top: clamp((vh - tooltipH) / 2, margin, vh - tooltipH - margin),
        left: clamp((vw - tooltipW) / 2, margin, vw - tooltipW - margin),
      });
      return;
    }

    const spaceRight = vw - (spotlight.left + spotlight.width) - margin;
    const spaceLeft = spotlight.left - margin;
    const spaceBottom = vh - (spotlight.top + spotlight.height) - margin;
    const spaceTop = spotlight.top - margin;

    let nextTop = margin;
    let nextLeft = margin;

    const fitsRight = spaceRight >= tooltipW + gap;
    const fitsLeft = spaceLeft >= tooltipW + gap;
    const fitsBottom = spaceBottom >= tooltipH + gap;
    const fitsTop = spaceTop >= tooltipH + gap;

    if (!step.isTallSection && fitsRight) {
      nextLeft = spotlight.left + spotlight.width + gap;
      nextTop = clamp(
        spotlight.top + spotlight.height / 2 - tooltipH / 2,
        margin,
        vh - tooltipH - margin
      );
    } else if (!step.isTallSection && fitsLeft) {
      nextLeft = spotlight.left - tooltipW - gap;
      nextTop = clamp(
        spotlight.top + spotlight.height / 2 - tooltipH / 2,
        margin,
        vh - tooltipH - margin
      );
    } else if (fitsBottom) {
      nextTop = spotlight.top + spotlight.height + gap;
      nextLeft = clamp(
        spotlight.left + spotlight.width / 2 - tooltipW / 2,
        margin,
        vw - tooltipW - margin
      );
    } else if (fitsTop) {
      nextTop = spotlight.top - tooltipH - gap;
      nextLeft = clamp(
        spotlight.left + spotlight.width / 2 - tooltipW / 2,
        margin,
        vw - tooltipW - margin
      );
    } else if (fitsRight) {
      nextLeft = spotlight.left + spotlight.width + gap;
      nextTop = clamp(spotlight.top, margin, vh - tooltipH - margin);
    } else if (fitsLeft) {
      nextLeft = spotlight.left - tooltipW - gap;
      nextTop = clamp(spotlight.top, margin, vh - tooltipH - margin);
    } else {
      // Compact viewport fallback: anchor cleanly at bottom or top edge with maximum clearance
      nextLeft = clamp((vw - tooltipW) / 2, margin, vw - tooltipW - margin);
      nextTop =
        spaceBottom >= spaceTop
          ? clamp(vh - tooltipH - margin, margin, vh - tooltipH - margin)
          : margin;
    }

    setTooltipCoords({ top: nextTop, left: nextLeft });
  }, [isOpen, spotlight, currentStep, step.isTallSection]);

  // Keyboard navigation (Escape to skip, Arrow keys to step)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT';
      if (isInput) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onSkip();
      } else if (e.key === 'ArrowRight' && !isLast) {
        e.preventDefault();
        onStepChange(currentStep + 1);
      } else if (e.key === 'ArrowLeft' && !isFirst) {
        e.preventDefault();
        onStepChange(currentStep - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep, isFirst, isLast, onStepChange, onSkip]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] pointer-events-none"
      aria-live="polite"
    >
      {/* 4-Panel Spotlight Backdrop so the highlighted DOM element remains crisp and un-dimmed */}
      {spotlight ? (
        <>
          <div
            className="pointer-events-auto fixed left-0 right-0 top-0 bg-slate-900/50 transition-all duration-200"
            style={{ height: spotlight.top }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-auto fixed bottom-0 left-0 right-0 bg-slate-900/50 transition-all duration-200"
            style={{ top: spotlight.top + spotlight.height }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-auto fixed left-0 bg-slate-900/50 transition-all duration-200"
            style={{
              top: spotlight.top,
              width: spotlight.left,
              height: spotlight.height,
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-auto fixed right-0 bg-slate-900/50 transition-all duration-200"
            style={{
              top: spotlight.top,
              left: spotlight.left + spotlight.width,
              height: spotlight.height,
            }}
            aria-hidden="true"
          />

          {/* Subtle Blue Spotlight Border & Glow */}
          <div
            className="pointer-events-none fixed z-[65] rounded-xl border-2 border-blue-500 shadow-[0_0_0_4px_rgba(37,99,235,0.22)] transition-all duration-200"
            style={{
              top: spotlight.top,
              left: spotlight.left,
              width: spotlight.width,
              height: spotlight.height,
            }}
            aria-hidden="true"
          />
        </>
      ) : (
        <div
          className="pointer-events-auto fixed inset-0 bg-slate-900/50"
          aria-hidden="true"
        />
      )}

      {/* Contextual Floating Tooltip */}
      <div
        ref={tooltipRef}
        role="dialog"
        aria-modal="false"
        aria-labelledby="tour-step-title"
        aria-describedby="tour-step-description"
        className="pointer-events-auto fixed z-[70] w-[calc(100vw-24px)] max-w-[340px] rounded-xl border border-slate-200 bg-white p-4 shadow-xl transition-all duration-200 sm:p-5"
        style={{
          top: tooltipCoords.top,
          left: tooltipCoords.left,
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-blue-700 tabular-nums">
            {currentStep + 1} of {TOUR_STEPS.length}
          </span>
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span>Skip Tour</span>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-200"
            style={{
              width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%`,
            }}
          />
        </div>

        <h2
          id="tour-step-title"
          className="mt-3.5 font-display text-base font-bold tracking-tight text-slate-900"
        >
          {step.title}
        </h2>
        <p
          id="tour-step-description"
          className="mt-1 text-sm leading-relaxed text-slate-600"
        >
          {step.description}
        </p>

        {isLast && (
          <div className="mt-3.5 flex items-start gap-2.5 rounded-lg border border-blue-100 bg-blue-50/70 p-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            <div>
              <p className="text-xs font-semibold text-slate-900">
                You're all set!
              </p>
              <p className="mt-0.5 text-xs text-slate-600">
                Start exploring your product experience.
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3.5">
          <div>
            {!isFirst && (
              <button
                type="button"
                onClick={() => onStepChange(Math.max(0, currentStep - 1))}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>

          {!isLast ? (
            <button
              type="button"
              onClick={() =>
                onStepChange(Math.min(TOUR_STEPS.length - 1, currentStep + 1))
              }
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span>Next</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onFinish}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span>Finish Tour</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
