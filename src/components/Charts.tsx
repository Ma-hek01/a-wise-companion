import React, { useState } from 'react';
import { deriveOverallExperience } from '../data/journalOptions';
import { JournalEntry, Routine, RoutineCompletion } from '../types/companion';

interface ConsistencyChartProps {
  completions: RoutineCompletion[];
  routines: Routine[];
  selectedProductId?: string | 'all';
  days?: number;
}

function getLastNDays(n: number): string[] {
  const result: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    result.push(`${y}-${m}-${day}`);
  }
  return result;
}

function shortDate(dateStr: string): string {
  const [, m, d] = dateStr.split('-');
  return `${Number(m)}/${Number(d)}`;
}

export const ConsistencyBarChart: React.FC<ConsistencyChartProps> = ({
  completions,
  routines,
  selectedProductId = 'all',
  days = 14,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const dateList = getLastNDays(days);

  const dayStats = dateList.map((dateStr) => {
    const dayCompletions = completions.filter((c) => c.date === dateStr);
    if (dayCompletions.length === 0) {
      return { date: dateStr, rate: null as number | null, label: 'No log' };
    }

    let expected = 0;
    let done = 0;

    for (const comp of dayCompletions) {
      const routine = routines.find((r) => r.id === comp.routineId);
      if (selectedProductId !== 'all') {
        const includesProduct =
          routine?.productIds.includes(selectedProductId) ||
          comp.completedProductIds.includes(selectedProductId);
        if (!includesProduct) continue;
        expected += 1;
        if (comp.completedProductIds.includes(selectedProductId)) {
          done += 1;
        }
      } else {
        const count = routine?.productIds.length || 1;
        expected += count;
        done +=
          comp.status === 'skipped'
            ? 0
            : Math.min(count, comp.completedProductIds.length);
      }
    }

    if (expected === 0) {
      return { date: dateStr, rate: null as number | null, label: 'No log' };
    }

    const rate = Math.round((done / expected) * 100);
    return {
      date: dateStr,
      rate,
      label: `${done}/${expected} steps (${rate}%)`,
    };
  });

  const hasAnyLogs = dayStats.some((d) => d.rate !== null);

  if (!hasAnyLogs) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-4 text-center">
        <p className="max-w-xs text-sm text-slate-500">
          No routine completion logs recorded yet. Check off steps in Routine
          Companion to visualize daily consistency.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative flex h-44 items-end gap-1.5 pt-6 pb-2">
        {dayStats.map((item, idx) => {
          const isHovered = hoveredIndex === idx;
          const barHeight =
            item.rate === null ? 6 : Math.max(10, Math.round((item.rate / 100) * 100));

          const barColor =
            item.rate === null
              ? 'bg-slate-200'
              : item.rate >= 80
              ? 'bg-blue-600'
              : item.rate >= 40
              ? 'bg-sky-400'
              : 'bg-amber-400';

          return (
            <div
              key={item.date}
              className="group relative flex flex-1 flex-col items-center justify-end h-full"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {isHovered && (
                <div className="pointer-events-none absolute -top-2 z-10 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-800 shadow-sm tabular-nums">
                  {item.date}: {item.label}
                </div>
              )}
              <div className="flex h-full w-full items-end justify-center px-0.5">
                <div
                  className={`w-full max-w-[22px] rounded-t transition-opacity duration-150 ${barColor} ${
                    isHovered ? 'opacity-90 ring-2 ring-blue-200' : 'opacity-100'
                  }`}
                  style={{ height: `${barHeight}%` }}
                  aria-label={`${item.date}: ${item.label}`}
                />
              </div>
              <span className="mt-1.5 text-[10px] text-slate-400 tabular-nums">
                {idx % 2 === 0 || idx === dayStats.length - 1 ? shortDate(item.date) : ''}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-2.5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-xs bg-blue-600" />
          80–100% completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-xs bg-sky-400" />
          Partial session
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-xs bg-amber-400" />
          Skipped / Low
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-xs bg-slate-200" />
          No entry
        </span>
      </div>
    </div>
  );
};

interface SatisfactionChartProps {
  entries: JournalEntry[];
}

export const SatisfactionTrendChart: React.FC<SatisfactionChartProps> = ({
  entries,
}) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const sorted = [...entries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-12);

  if (sorted.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-4 text-center">
        <p className="max-w-xs text-sm text-slate-500">
          No Progress Journal satisfaction scores logged yet. Record entries to
          chart satisfaction over time.
        </p>
      </div>
    );
  }

  const width = 460;
  const height = 160;
  const padLeft = 28;
  const padRight = 18;
  const padTop = 16;
  const padBottom = 26;
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;

  const points = sorted.map((entry, idx) => {
    const x =
      sorted.length === 1
        ? padLeft + innerW / 2
        : padLeft + (idx / (sorted.length - 1)) * innerW;
    const y = padTop + ((5 - entry.satisfaction) / 4) * innerH;
    return { x, y, entry };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPoints =
    points.length > 1
      ? `${points[0].x},${padTop + innerH} ${polylinePoints} ${points[points.length - 1].x},${padTop + innerH}`
      : '';

  return (
    <div className="w-full">
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-44 w-full overflow-visible"
          role="img"
          aria-label="Satisfaction rating trend chart"
        >
          {[1, 2, 3, 4, 5].map((rating) => {
            const y = padTop + ((5 - rating) / 4) * innerH;
            return (
              <g key={rating}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={rating === 3 ? '3 3' : undefined}
                />
                <text
                  x={padLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="fill-slate-400 text-[10px] font-mono"
                >
                  {rating}
                </text>
              </g>
            );
          })}

          {areaPoints && (
            <polygon points={areaPoints} fill="rgba(37, 99, 235, 0.08)" />
          )}

          {points.length > 1 && (
            <polyline
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={polylinePoints}
            />
          )}

          {points.map((pt, idx) => {
            const isActive = activeIdx === idx;
            return (
              <g
                key={pt.entry.id}
                className="cursor-pointer"
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? 6 : 4.5}
                  fill="#ffffff"
                  stroke="#2563eb"
                  strokeWidth="2.2"
                />
                {(idx === 0 ||
                  idx === points.length - 1 ||
                  points.length <= 6 ||
                  idx % 2 === 0) && (
                  <text
                    x={pt.x}
                    y={height - 6}
                    textAnchor="middle"
                    className="fill-slate-400 text-[9.5px] font-mono"
                  >
                    {shortDate(pt.entry.date)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {activeIdx !== null && points[activeIdx] && (
          <div className="mt-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 tabular-nums">
            <span className="font-medium">{points[activeIdx].entry.date}</span>
            <span className="mx-1.5 text-slate-400">·</span>
            <span>{deriveOverallExperience(points[activeIdx].entry)}</span>
            <span className="mx-1.5 text-slate-400">·</span>
            <span>{points[activeIdx].entry.satisfaction}/5</span>
          </div>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500">
        <span>Scale: 1 (Low) to 5 (High)</span>
        <span className="tabular-nums">Showing {sorted.length} latest entries</span>
      </div>
    </div>
  );
};
