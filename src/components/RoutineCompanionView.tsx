import React, { useEffect, useState } from 'react';
import {
  CalendarCheck2,
  CheckCircle2,
  Circle,
  Edit2,
  Moon,
  Package,
  Plus,
  SkipForward,
  Sparkles,
  Sun,
  Trash2,
  X,
} from 'lucide-react';
import { formatLocalDate } from '../data/demoData';
import {
  Product,
  Routine,
  RoutineCompletion,
  RoutineTimeOfDay,
} from '../types/companion';
import { MyProductsView } from './MyProductsView';

interface RoutineCompanionViewProps {
  products: Product[];
  routines: Routine[];
  completions: RoutineCompletion[];
  autoOpenAddProductForm?: boolean;
  autoOpenProductMode?: 'choose' | 'manual';
  focusSection?: 'my-products' | 'my-routines' | null;
  onConsumeAutoOpenProduct?: () => void;
  onConsumeFocusSection?: () => void;
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product | void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onOpenProductDetail: (productId: string) => void;
  onAddRoutine: (routine: Omit<Routine, 'id' | 'createdAt'>) => void;
  onUpdateRoutine: (routine: Routine) => void;
  onDeleteRoutine: (routineId: string) => void;
  onToggleTodayProduct: (routineId: string, productId: string) => void;
  onToggleSkipTodayProduct: (routineId: string, productId: string) => void;
  onCompleteAllToday: (routineId: string) => void;
  onLogRoutineSkip: (routineId: string, barrierNote?: string) => void;
}

const TIME_SLOTS: RoutineTimeOfDay[] = ['Morning', 'Evening', 'Custom'];

function getRoutineIcon(timeOfDay: RoutineTimeOfDay) {
  if (timeOfDay === 'Morning') return Sun;
  if (timeOfDay === 'Evening') return Moon;
  return Sparkles;
}

const ProductThumb: React.FC<{ product: Product }> = ({ product }) => {
  const [failed, setFailed] = useState(false);

  if (!product.imageUrl || failed) {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
        <Package className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-0.5">
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

export const RoutineCompanionView: React.FC<RoutineCompanionViewProps> = ({
  products,
  routines,
  completions,
  autoOpenAddProductForm = false,
  autoOpenProductMode = 'choose',
  focusSection = null,
  onConsumeAutoOpenProduct,
  onConsumeFocusSection,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onOpenProductDetail,
  onAddRoutine,
  onUpdateRoutine,
  onDeleteRoutine,
  onToggleTodayProduct,
  onToggleSkipTodayProduct,
  onCompleteAllToday,
  onLogRoutineSkip,
}) => {
  const todayStr = formatLocalDate(new Date());

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [name, setName] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<RoutineTimeOfDay>('Morning');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const scrollToSection = (sectionId: 'routine-my-products' | 'routine-my-routines') => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (!focusSection) return;
    const id =
      focusSection === 'my-products'
        ? 'routine-my-products'
        : 'routine-my-routines';
    const timer = window.setTimeout(() => {
      scrollToSection(id);
      onConsumeFocusSection?.();
    }, 60);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusSection]);

  const openCreateForm = () => {
    setEditingRoutine(null);
    setName('');
    setTimeOfDay('Morning');
    setSelectedProductIds([]);
    setNotes('');
    setIsFormOpen(true);
  };

  const openEditForm = (routine: Routine) => {
    setEditingRoutine(routine);
    setName(routine.name);
    setTimeOfDay(routine.timeOfDay);
    setSelectedProductIds(routine.productIds);
    setNotes(routine.notes);
    setIsFormOpen(true);
  };

  const toggleFormProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    if (editingRoutine) {
      onUpdateRoutine({
        ...editingRoutine,
        name: trimmed,
        timeOfDay,
        productIds: selectedProductIds,
        notes: notes.trim(),
        isDemo: false,
      });
    } else {
      onAddRoutine({
        name: trimmed,
        timeOfDay,
        productIds: selectedProductIds,
        notes: notes.trim(),
        isDemo: false,
      });
    }
    setIsFormOpen(false);
    setEditingRoutine(null);
  };

  return (
    <div className="min-w-0 space-y-8">
      {/* Page Header & Clear Section Jump Bar */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Routine Companion
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            First manage your products, then organise and check off how you use
            them every day.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scrollToSection('routine-my-products')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <Package className="h-3.5 w-3.5 text-blue-600" />
            <span>My Products ({products.length})</span>
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('routine-my-routines')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <CalendarCheck2 className="h-3.5 w-3.5 text-blue-600" />
            <span>My Routines ({routines.length})</span>
          </button>
        </div>
      </section>

      {/* SECTION 1: MY PRODUCTS */}
      <section
        id="routine-my-products"
        className="min-w-0 scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7"
      >
        <MyProductsView
          embedded={true}
          products={products}
          autoOpenAddForm={autoOpenAddProductForm}
          autoOpenMode={autoOpenProductMode}
          onConsumeAutoOpen={onConsumeAutoOpenProduct}
          onAddProduct={onAddProduct}
          onUpdateProduct={onUpdateProduct}
          onDeleteProduct={onDeleteProduct}
          onOpenProductDetail={onOpenProductDetail}
        />
      </section>

      {/* SECTION 2: MY ROUTINES */}
      <section
        id="routine-my-routines"
        data-tour="routines-section"
        className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7 space-y-6"
      >
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              Section 2 · {routines.length}{' '}
              {routines.length === 1 ? 'routine' : 'routines'}
            </p>
            <h3 className="mt-0.5 font-display text-xl font-bold tracking-tight text-slate-900">
              My Routines
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              What am I using today? Group products into Morning, Evening, or
              Custom routines and check them off as you go.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Create Routine</span>
          </button>
        </div>

        {isFormOpen && (
          <div className="rounded-xl border border-blue-200 bg-blue-50/20 p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h4 className="font-display text-base font-semibold text-slate-900">
                {editingRoutine ? 'Edit Routine' : 'New Routine'}
              </h4>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                aria-label="Close routine form"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="routine-name"
                    className="block text-xs font-medium text-slate-700"
                  >
                    Routine Name
                  </label>
                  <input
                    id="routine-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Morning Skincare"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Time of Day
                  </label>
                  <div className="mt-1.5 flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeOfDay(slot)}
                        className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          timeOfDay === slot
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-700">
                  Assign Products from My Products
                </p>
                {products.length === 0 ? (
                  <p className="mt-1.5 text-xs text-slate-500">
                    Add products in Section 1 (My Products) above to attach them
                    here.
                  </p>
                ) : (
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {products.map((prod) => {
                      const checked = selectedProductIds.includes(prod.id);
                      return (
                        <label
                          key={prod.id}
                          className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
                            checked
                              ? 'border-blue-300 bg-blue-50/70 text-slate-900'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleFormProduct(prod.id)}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="truncate">{prod.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="routine-notes"
                  className="block text-xs font-medium text-slate-700"
                >
                  Reminder Note (Optional)
                </label>
                <input
                  id="routine-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Keep next to toothbrush"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {editingRoutine ? 'Save Changes' : 'Save Routine'}
                </button>
              </div>
            </form>
          </div>
        )}

        {routines.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-10 text-center">
            <CalendarCheck2 className="mx-auto h-8 w-8 text-slate-400" />
            <h4 className="mt-3 font-display text-base font-semibold text-slate-900">
              No routines yet
            </h4>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
              Create a morning, evening, or custom routine to organize your
              products in one place.
            </p>
            <button
              type="button"
              onClick={openCreateForm}
              className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Routine
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {routines.map((routine) => {
              const Icon = getRoutineIcon(routine.timeOfDay);
              const routineProducts = routine.productIds
                .map((id) => products.find((p) => p.id === id))
                .filter((p): p is NonNullable<typeof p> => Boolean(p));

              const todayComp = completions.find(
                (c) => c.routineId === routine.id && c.date === todayStr
              );
              const completedTodayIds = todayComp?.completedProductIds ?? [];
              const skippedTodayIds = todayComp?.skippedProductIds ?? [];

              const totalCount = routineProducts.length;
              const doneCount = routineProducts.filter((p) =>
                completedTodayIds.includes(p.id)
              ).length;
              const isRoutineSkipped =
                todayComp?.status === 'skipped' &&
                completedTodayIds.length === 0 &&
                skippedTodayIds.length === 0;
              const skippedCount = isRoutineSkipped
                ? totalCount
                : routineProducts.filter(
                    (p) =>
                      !completedTodayIds.includes(p.id) &&
                      skippedTodayIds.includes(p.id)
                  ).length;
              const remainingCount = Math.max(
                0,
                totalCount - doneCount - skippedCount
              );
              // Skipped items are never counted as completed
              const progressPercent =
                totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

              const isAllCompleted =
                totalCount > 0 && doneCount === totalCount;
              const isPartiallyCompleted =
                !isAllCompleted &&
                !isRoutineSkipped &&
                totalCount > 0 &&
                doneCount > 0;
              const isAllHandledWithSkips =
                !isAllCompleted &&
                !isRoutineSkipped &&
                totalCount > 0 &&
                remainingCount === 0 &&
                skippedCount > 0;

              const summaryParts: string[] = [
                `${doneCount} of ${totalCount} completed`,
              ];
              if (skippedCount > 0) {
                summaryParts.push(`${skippedCount} skipped`);
              }
              if (remainingCount > 0) {
                summaryParts.push(`${remainingCount} remaining`);
              }

              const routineStatusBadge =
                totalCount === 0
                  ? null
                  : isAllCompleted
                  ? {
                      label: 'Completed',
                      cls: 'border-emerald-200 bg-emerald-50 text-emerald-800',
                    }
                  : isRoutineSkipped || (doneCount === 0 && remainingCount === 0)
                  ? {
                      label: 'Skipped today',
                      cls: 'border-amber-200 bg-amber-50 text-amber-800',
                    }
                  : isPartiallyCompleted
                  ? {
                      label: 'Partially completed',
                      cls: 'border-blue-200 bg-blue-50 text-blue-800',
                    }
                  : skippedCount > 0
                  ? {
                      label: 'In progress',
                      cls: 'border-slate-200 bg-slate-100 text-slate-700',
                    }
                  : {
                      label: 'Remaining today',
                      cls: 'border-slate-200 bg-white text-slate-600',
                    };

              return (
                <article
                  key={routine.id}
                  className={`flex flex-col justify-between rounded-xl border p-5 transition-colors ${
                    isAllCompleted
                      ? 'border-emerald-200 bg-emerald-50/25'
                      : isRoutineSkipped
                      ? 'border-slate-200 bg-slate-50/70'
                      : 'border-slate-200 bg-slate-50/40'
                  }`}
                >
                  <div>
                    <div className="flex flex-col gap-3 border-b border-slate-200/70 pb-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3 min-w-0">
                        <span
                          className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                            isAllCompleted
                              ? 'bg-emerald-100 text-emerald-700'
                              : isRoutineSkipped
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-blue-50 text-blue-600'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-xs text-slate-500 tabular-nums">
                              {routine.timeOfDay}
                              {totalCount > 0
                                ? ` · ${summaryParts.join(' · ')}`
                                : ' · 0 products assigned'}
                              {routine.isDemo ? ' · SYNTHETIC DEMO DATA' : ''}
                            </p>
                            {routineStatusBadge && (
                              <span
                                className={`rounded-md border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${routineStatusBadge.cls}`}
                              >
                                {routineStatusBadge.label}
                              </span>
                            )}
                          </div>
                          <h4 className="mt-1 font-display text-lg font-semibold text-slate-900">
                            {routine.name}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {routineProducts.length > 0 && !isAllCompleted && (
                          <button
                            type="button"
                            onClick={() => onCompleteAllToday(routine.id)}
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 whitespace-nowrap"
                          >
                            Done all
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onLogRoutineSkip(routine.id)}
                          className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                            isRoutineSkipped
                              ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100/70'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <SkipForward className="h-3.5 w-3.5" />
                          <span>
                            {isRoutineSkipped ? 'Undo skip' : 'Skip today'}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditForm(routine)}
                          aria-label={`Edit ${routine.name}`}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(routine.id)}
                          aria-label={`Delete ${routine.name}`}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {confirmDeleteId === routine.id && (
                      <div className="mt-3 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs">
                        <span className="text-red-800">
                          Delete this routine?
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteRoutine(routine.id);
                              setConfirmDeleteId(null);
                            }}
                            className="rounded bg-red-600 px-2.5 py-1 font-medium text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {totalCount > 0 && !isRoutineSkipped && (
                      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70">
                        <div
                          className={`h-full rounded-full transition-all duration-200 ${
                            isAllCompleted ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    )}

                    {routineProducts.length === 0 ? (
                      <p className="mt-4 text-sm text-slate-500">
                        No products in this routine yet. Click edit to assign
                        from My Products.
                      </p>
                    ) : (
                      <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white overflow-hidden">
                        {routineProducts.map((prod) => {
                          const checked = completedTodayIds.includes(prod.id);
                          const productSkipped =
                            isRoutineSkipped ||
                            (!checked && skippedTodayIds.includes(prod.id));

                          return (
                            <div
                              key={prod.id}
                              className={`flex items-center justify-between gap-2 px-3.5 py-3 transition-colors ${
                                checked
                                  ? 'bg-emerald-50/20'
                                  : productSkipped
                                  ? 'bg-slate-50/80'
                                  : 'hover:bg-slate-50/60'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  onToggleTodayProduct(routine.id, prod.id)
                                }
                                className="flex flex-1 items-center gap-3 text-left min-w-0"
                              >
                                {checked ? (
                                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                                ) : productSkipped ? (
                                  <SkipForward className="h-5 w-5 shrink-0 text-amber-600" />
                                ) : (
                                  <Circle className="h-5 w-5 shrink-0 text-slate-300" />
                                )}
                                <ProductThumb product={prod} />
                                <div className="min-w-0 flex-1">
                                  <p
                                    className={`text-sm font-medium truncate ${
                                      checked
                                        ? 'text-slate-500 line-through'
                                        : productSkipped
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
                                  </p>
                                </div>
                              </button>

                              <div className="flex items-center gap-2 shrink-0">
                                {checked ? (
                                  <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800 whitespace-nowrap">
                                    Completed
                                  </span>
                                ) : isRoutineSkipped ? (
                                  <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 whitespace-nowrap">
                                    Skipped
                                  </span>
                                ) : (
                                  <>
                                    {!productSkipped && (
                                      <span className="hidden sm:inline text-[11px] text-slate-400 whitespace-nowrap">
                                        Remaining
                                      </span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onToggleSkipTodayProduct(
                                          routine.id,
                                          prod.id
                                        )
                                      }
                                      className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                                        productSkipped
                                          ? 'border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100/70'
                                          : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                      }`}
                                    >
                                      {productSkipped ? 'Skipped' : 'Skip'}
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {routine.notes && (
                      <p className="mt-3 text-xs text-slate-500">
                        Note: {routine.notes}
                      </p>
                    )}
                  </div>

                  {isAllCompleted && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-800">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span>
                        Completed for today — {doneCount} of {totalCount}{' '}
                        completed.
                      </span>
                    </div>
                  )}

                  {isAllHandledWithSkips && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-blue-200/70 bg-blue-50/70 px-3.5 py-2.5 text-xs font-medium text-blue-800">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
                      <span>
                        Handled for today ({summaryParts.join(' · ')}) — skipped
                        items can wait until next time.
                      </span>
                    </div>
                  )}

                  {isPartiallyCompleted && remainingCount > 0 && (
                    <div className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-700">
                      <span>
                        Partially completed — {summaryParts.join(' · ')}.
                      </span>
                    </div>
                  )}

                  {isRoutineSkipped && (
                    <div className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-amber-200/70 bg-amber-50/70 px-3.5 py-2.5 text-xs text-amber-900">
                      <span>Skipped for today — no pressure at all.</span>
                      <button
                        type="button"
                        onClick={() => onLogRoutineSkip(routine.id)}
                        className="font-medium underline hover:text-amber-700"
                      >
                        Undo
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
