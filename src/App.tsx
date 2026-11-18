import { useEffect, useState } from 'react';
import { HomeDashboard } from './components/HomeDashboard';
import { Layout } from './components/Layout';
import { OnboardingWalkthrough } from './components/OnboardingWalkthrough';
import { ProductDetailView } from './components/ProductDetailView';
import { ProductDiscoveryView } from './components/ProductDiscoveryView';
import { ProgressJournalView } from './components/ProgressJournalView';
import { RealityCheckView } from './components/RealityCheckView';
import { RoutineCompanionView } from './components/RoutineCompanionView';
import { formatLocalDate } from './data/demoData';
import { defaultRealityCheckEngine } from './services/realityCheckEngine';
import {
  clearAllWorkspaceData,
  hasCompletedOnboarding,
  loadWorkspaceState,
  markOnboardingComplete,
  resetToDemoState,
  saveWorkspaceState,
} from './services/storageService';
import {
  AppView,
  CompanionState,
  JournalEntry,
  Product,
  ProductRealityReport,
  Routine,
} from './types/companion';

function generateId(prefix: string): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const TOUR_STEP_VIEWS: AppView[] = [
  'dashboard',
  'routines',
  'routines',
  'journal',
  'reality-check',
];

export default function App() {
  const [state, setState] = useState<CompanionState>(() =>
    loadWorkspaceState()
  );
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedReportProductId, setSelectedReportProductId] = useState<
    string | 'all'
  >('all');
  const [activeProductDetailId, setActiveProductDetailId] = useState<
    string | null
  >(null);

  const [report, setReport] = useState<ProductRealityReport | null>(null);
  const [detailReport, setDetailReport] = useState<ProductRealityReport | null>(
    null
  );

  // Interactive spotlight tour state
  const [showOnboarding, setShowOnboarding] = useState<boolean>(
    () => !hasCompletedOnboarding()
  );
  const [tourStep, setTourStep] = useState<number>(0);

  // Quick-action triggers from Dashboard / Product Detail / Explore Products
  const [autoOpenProductForm, setAutoOpenProductForm] = useState(false);
  const [productFormInitialMode, setProductFormInitialMode] = useState<
    'choose' | 'manual'
  >('choose');
  const [autoOpenJournalForm, setAutoOpenJournalForm] = useState(false);
  const [journalPreselectProductId, setJournalPreselectProductId] = useState<
    string | undefined
  >(undefined);
  const [routineFocusSection, setRoutineFocusSection] = useState<
    'my-products' | 'my-routines' | null
  >(null);

  // Persist workspace state
  useEffect(() => {
    saveWorkspaceState(state);
  }, [state]);

  // Keep selected product IDs valid if deleted
  useEffect(() => {
    if (
      selectedReportProductId !== 'all' &&
      !state.products.some((p) => p.id === selectedReportProductId)
    ) {
      setSelectedReportProductId('all');
    }
    if (
      activeProductDetailId &&
      !state.products.some((p) => p.id === activeProductDetailId)
    ) {
      setActiveProductDetailId(null);
      if (currentView === 'product-detail') {
        setRoutineFocusSection('my-products');
        setCurrentView('routines');
      }
    }
  }, [
    state.products,
    selectedReportProductId,
    activeProductDetailId,
    currentView,
  ]);

  // Recompute main Product Reality Report whenever state or scope changes
  useEffect(() => {
    let active = true;
    defaultRealityCheckEngine
      .generateReport({
        products: state.products,
        routines: state.routines,
        completions: state.completions,
        journalEntries: state.journalEntries,
        selectedProductId: selectedReportProductId,
      })
      .then((generated) => {
        if (active) {
          setReport(generated);
        }
      });
    return () => {
      active = false;
    };
  }, [
    state.products,
    state.routines,
    state.completions,
    state.journalEntries,
    selectedReportProductId,
  ]);

  // Recompute individual Product Detail Report when viewing a product page
  useEffect(() => {
    if (!activeProductDetailId) {
      setDetailReport(null);
      return;
    }
    let active = true;
    defaultRealityCheckEngine
      .generateReport({
        products: state.products,
        routines: state.routines,
        completions: state.completions,
        journalEntries: state.journalEntries,
        selectedProductId: activeProductDetailId,
      })
      .then((generated) => {
        if (active) {
          setDetailReport(generated);
        }
      });
    return () => {
      active = false;
    };
  }, [
    state.products,
    state.routines,
    state.completions,
    state.journalEntries,
    activeProductDetailId,
  ]);

  // Guided tour handlers
  const handleStartGuidedTour = () => {
    setTourStep(0);
    setCurrentView(TOUR_STEP_VIEWS[0]);
    setShowOnboarding(true);
  };

  const handleTourStepChange = (nextStep: number) => {
    const clamped = Math.max(0, Math.min(TOUR_STEP_VIEWS.length - 1, nextStep));
    setTourStep(clamped);
    setCurrentView(TOUR_STEP_VIEWS[clamped]);
  };

  const handleFinishOnboarding = () => {
    markOnboardingComplete();
    setShowOnboarding(false);
    setTourStep(0);
  };

  const handleSkipOnboarding = () => {
    markOnboardingComplete();
    setShowOnboarding(false);
    setTourStep(0);
  };

  // Product CRUD
  const handleAddProduct = (
    input: Omit<Product, 'id' | 'createdAt'>
  ): Product => {
    const newProduct: Product = {
      ...input,
      id: generateId('prod'),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      products: [newProduct, ...prev.products],
    }));
    return newProduct;
  };

  const handleUpdateProduct = (updated: Product) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === updated.id ? updated : p)),
    }));
  };

  const handleDeleteProduct = (productId: string) => {
    setState((prev) => {
      const nextRoutines = prev.routines.map((r) => ({
        ...r,
        productIds: r.productIds.filter((id) => id !== productId),
      }));

      const nextCompletions = prev.completions
        .map((comp) => {
          const hadNoIndividualItems =
            comp.completedProductIds.length === 0 &&
            (comp.skippedProductIds?.length ?? 0) === 0;
          const nextCompleted = comp.completedProductIds.filter(
            (id) => id !== productId
          );
          const nextSkipped = (comp.skippedProductIds ?? []).filter(
            (id) => id !== productId
          );
          const routine = nextRoutines.find((r) => r.id === comp.routineId);
          const totalExpected = routine?.productIds.length ?? 0;

          if (nextCompleted.length === 0 && nextSkipped.length === 0) {
            if (
              comp.status === 'skipped' &&
              hadNoIndividualItems &&
              totalExpected > 0
            ) {
              return {
                ...comp,
                completedProductIds: nextCompleted,
                skippedProductIds: nextSkipped,
                status: 'skipped' as const,
              };
            }
            return null;
          }

          const nextStatus: 'completed' | 'partial' | 'skipped' =
            totalExpected > 0 && nextCompleted.length >= totalExpected
              ? 'completed'
              : nextCompleted.length === 0 && nextSkipped.length > 0
              ? 'skipped'
              : 'partial';

          return {
            ...comp,
            completedProductIds: nextCompleted,
            skippedProductIds: nextSkipped,
            status: nextStatus,
          };
        })
        .filter((c): c is NonNullable<typeof c> => Boolean(c));

      return {
        ...prev,
        products: prev.products.filter((p) => p.id !== productId),
        routines: nextRoutines,
        completions: nextCompletions,
      };
    });
  };

  // Routine CRUD & Check-in Handlers
  const handleAddRoutine = (input: Omit<Routine, 'id' | 'createdAt'>) => {
    const newRoutine: Routine = {
      ...input,
      id: generateId('routine'),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      routines: [...prev.routines, newRoutine],
    }));
  };

  const handleUpdateRoutine = (updated: Routine) => {
    const todayStr = formatLocalDate(new Date());
    setState((prev) => {
      const validIds = new Set(updated.productIds);
      const nextCompletions = prev.completions
        .map((comp) => {
          if (comp.routineId !== updated.id || comp.date !== todayStr) {
            return comp;
          }
          const hadNoIndividualItems =
            comp.completedProductIds.length === 0 &&
            (comp.skippedProductIds?.length ?? 0) === 0;
          const nextCompleted = comp.completedProductIds.filter((id) =>
            validIds.has(id)
          );
          const nextSkipped = (comp.skippedProductIds ?? []).filter((id) =>
            validIds.has(id)
          );
          const totalExpected = updated.productIds.length;

          if (nextCompleted.length === 0 && nextSkipped.length === 0) {
            if (
              comp.status === 'skipped' &&
              hadNoIndividualItems &&
              totalExpected > 0
            ) {
              return comp;
            }
            return null;
          }

          const nextStatus: 'completed' | 'partial' | 'skipped' =
            totalExpected > 0 && nextCompleted.length >= totalExpected
              ? 'completed'
              : nextCompleted.length === 0 && nextSkipped.length > 0
              ? 'skipped'
              : 'partial';

          return {
            ...comp,
            completedProductIds: nextCompleted,
            skippedProductIds: nextSkipped,
            status: nextStatus,
          };
        })
        .filter((c): c is NonNullable<typeof c> => Boolean(c));

      return {
        ...prev,
        routines: prev.routines.map((r) => (r.id === updated.id ? updated : r)),
        completions: nextCompletions,
      };
    });
  };

  const handleDeleteRoutine = (routineId: string) => {
    setState((prev) => ({
      ...prev,
      routines: prev.routines.filter((r) => r.id !== routineId),
      completions: prev.completions.filter((c) => c.routineId !== routineId),
    }));
  };

  const handleToggleTodayRoutineProduct = (
    routineId: string,
    productId: string
  ) => {
    const todayStr = formatLocalDate(new Date());
    setState((prev) => {
      const routine = prev.routines.find((r) => r.id === routineId);
      const totalExpected = routine?.productIds.length ?? 0;
      const existingIndex = prev.completions.findIndex(
        (c) => c.routineId === routineId && c.date === todayStr
      );

      if (existingIndex === -1) {
        const nextIds = [productId];
        const status =
          totalExpected > 0 && nextIds.length >= totalExpected
            ? 'completed'
            : 'partial';
        return {
          ...prev,
          completions: [
            ...prev.completions,
            {
              id: generateId('comp'),
              routineId,
              date: todayStr,
              completedProductIds: nextIds,
              skippedProductIds: [],
              status,
              completedAt: new Date().toISOString(),
              isDemo: false,
            },
          ],
        };
      }

      const existing = prev.completions[existingIndex];
      const alreadyChecked = existing.completedProductIds.includes(productId);
      const nextIds = alreadyChecked
        ? existing.completedProductIds.filter((id) => id !== productId)
        : [...existing.completedProductIds, productId];
      const nextSkipped = (existing.skippedProductIds ?? []).filter(
        (id) => id !== productId
      );

      const nextCompletions = [...prev.completions];
      if (nextIds.length === 0 && nextSkipped.length === 0) {
        nextCompletions.splice(existingIndex, 1);
      } else {
        const status =
          totalExpected > 0 && nextIds.length >= totalExpected
            ? 'completed'
            : nextIds.length === 0 && nextSkipped.length > 0
            ? 'skipped'
            : 'partial';
        nextCompletions[existingIndex] = {
          ...existing,
          completedProductIds: nextIds,
          skippedProductIds: nextSkipped,
          status,
          barrierNote: undefined,
          completedAt: new Date().toISOString(),
          isDemo: false,
        };
      }
      return {
        ...prev,
        completions: nextCompletions,
      };
    });
  };

  const handleToggleSkipTodayProduct = (
    routineId: string,
    productId: string
  ) => {
    const todayStr = formatLocalDate(new Date());
    setState((prev) => {
      const routine = prev.routines.find((r) => r.id === routineId);
      const totalExpected = routine?.productIds.length ?? 0;
      const existingIndex = prev.completions.findIndex(
        (c) => c.routineId === routineId && c.date === todayStr
      );

      if (existingIndex === -1) {
        return {
          ...prev,
          completions: [
            ...prev.completions,
            {
              id: generateId('comp'),
              routineId,
              date: todayStr,
              completedProductIds: [],
              skippedProductIds: [productId],
              status: 'skipped',
              completedAt: new Date().toISOString(),
              isDemo: false,
            },
          ],
        };
      }

      const existing = prev.completions[existingIndex];
      const prevSkipped = existing.skippedProductIds ?? [];
      const alreadySkipped = prevSkipped.includes(productId);
      const nextSkipped = alreadySkipped
        ? prevSkipped.filter((id) => id !== productId)
        : [...prevSkipped, productId];
      const nextCompleted = existing.completedProductIds.filter(
        (id) => id !== productId
      );

      const nextCompletions = [...prev.completions];
      if (nextCompleted.length === 0 && nextSkipped.length === 0) {
        nextCompletions.splice(existingIndex, 1);
      } else {
        const status =
          totalExpected > 0 && nextCompleted.length >= totalExpected
            ? 'completed'
            : nextCompleted.length === 0 && nextSkipped.length > 0
            ? 'skipped'
            : 'partial';
        nextCompletions[existingIndex] = {
          ...existing,
          completedProductIds: nextCompleted,
          skippedProductIds: nextSkipped,
          status,
          completedAt: new Date().toISOString(),
          isDemo: false,
        };
      }

      return {
        ...prev,
        completions: nextCompletions,
      };
    });
  };

  const handleCompleteAllToday = (routineId: string) => {
    const todayStr = formatLocalDate(new Date());
    setState((prev) => {
      const routine = prev.routines.find((r) => r.id === routineId);
      if (!routine) return prev;
      const existingIndex = prev.completions.findIndex(
        (c) => c.routineId === routineId && c.date === todayStr
      );
      const entry = {
        id:
          existingIndex !== -1
            ? prev.completions[existingIndex].id
            : generateId('comp'),
        routineId,
        date: todayStr,
        completedProductIds: [...routine.productIds],
        skippedProductIds: [],
        status: 'completed' as const,
        completedAt: new Date().toISOString(),
        isDemo: false,
      };

      const nextCompletions = [...prev.completions];
      if (existingIndex !== -1) {
        nextCompletions[existingIndex] = entry;
      } else {
        nextCompletions.push(entry);
      }
      return {
        ...prev,
        completions: nextCompletions,
      };
    });
  };

  const handleLogRoutineSkip = (routineId: string, barrierNote = '') => {
    const todayStr = formatLocalDate(new Date());
    setState((prev) => {
      const existingIndex = prev.completions.findIndex(
        (c) => c.routineId === routineId && c.date === todayStr
      );

      if (
        existingIndex !== -1 &&
        prev.completions[existingIndex].status === 'skipped' &&
        prev.completions[existingIndex].completedProductIds.length === 0 &&
        (prev.completions[existingIndex].skippedProductIds?.length ?? 0) === 0
      ) {
        // Toggle off today's routine-level skip if already skipped
        const nextCompletions = [...prev.completions];
        nextCompletions.splice(existingIndex, 1);
        return {
          ...prev,
          completions: nextCompletions,
        };
      }

      const entry = {
        id:
          existingIndex !== -1
            ? prev.completions[existingIndex].id
            : generateId('comp'),
        routineId,
        date: todayStr,
        completedProductIds: [],
        skippedProductIds: [],
        status: 'skipped' as const,
        barrierNote: barrierNote.trim() || undefined,
        completedAt: new Date().toISOString(),
        isDemo: false,
      };
      const nextCompletions = [...prev.completions];
      if (existingIndex !== -1) {
        nextCompletions[existingIndex] = entry;
      } else {
        nextCompletions.push(entry);
      }
      return {
        ...prev,
        completions: nextCompletions,
      };
    });
  };

  // Journal CRUD
  const handleAddJournalEntry = (
    input: Omit<JournalEntry, 'id' | 'createdAt'>
  ) => {
    const newEntry: JournalEntry = {
      ...input,
      id: generateId('journal'),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      journalEntries: [newEntry, ...prev.journalEntries],
    }));
  };

  const handleUpdateJournalEntry = (updated: JournalEntry) => {
    setState((prev) => ({
      ...prev,
      journalEntries: prev.journalEntries.map((e) =>
        e.id === updated.id ? updated : e
      ),
    }));
  };

  const handleDeleteJournalEntry = (entryId: string) => {
    setState((prev) => ({
      ...prev,
      journalEntries: prev.journalEntries.filter((e) => e.id !== entryId),
    }));
  };

  // Workspace Data Reset / Clear
  const handleResetDemoData = () => {
    setSelectedReportProductId('all');
    setActiveProductDetailId(null);
    setState(resetToDemoState());
  };

  const handleClearPersonalData = () => {
    setSelectedReportProductId('all');
    setActiveProductDetailId(null);
    setState(clearAllWorkspaceData());
  };

  // Cross-view navigation helpers
  const handleOpenProductDetail = (productId: string) => {
    setActiveProductDetailId(productId);
    setCurrentView('product-detail');
  };

  const handleInspectProductReport = (productId: string) => {
    setSelectedReportProductId(productId);
    setCurrentView('reality-check');
  };

  const handleOpenMyProductsSection = () => {
    setRoutineFocusSection('my-products');
    setCurrentView('routines');
  };

  const handleQuickAddProduct = () => {
    setProductFormInitialMode('choose');
    setAutoOpenProductForm(true);
    setRoutineFocusSection('my-products');
    setCurrentView('routines');
  };

  const handleQuickAddManualProduct = () => {
    setProductFormInitialMode('manual');
    setAutoOpenProductForm(true);
    setRoutineFocusSection('my-products');
    setCurrentView('routines');
  };

  const handleQuickLogExperience = (productId?: string) => {
    setJournalPreselectProductId(productId);
    setAutoOpenJournalForm(true);
    setCurrentView('journal');
  };

  const activeDetailProduct = activeProductDetailId
    ? state.products.find((p) => p.id === activeProductDetailId) ?? null
    : null;

  return (
    <>
      <Layout
        currentView={currentView}
        onNavigate={setCurrentView}
        hasDemoData={state.hasDemoData}
        totalCounts={{
          products: state.products.length,
          routines: state.routines.length,
          journalEntries: state.journalEntries.length,
        }}
        onResetDemoData={handleResetDemoData}
        onClearPersonalData={handleClearPersonalData}
        onShowNavigationGuide={handleStartGuidedTour}
        forceMobileMenuOpen={showOnboarding && tourStep === 0}
      >
        {currentView === 'dashboard' && report && (
          <HomeDashboard
            state={state}
            report={report}
            onNavigate={setCurrentView}
            onQuickAddProduct={handleQuickAddProduct}
            onQuickLogExperience={() => handleQuickLogExperience()}
            onToggleTodayRoutineProduct={handleToggleTodayRoutineProduct}
            onResetDemoData={handleResetDemoData}
          />
        )}

        {currentView === 'reality-check' && report && (
          <RealityCheckView
            state={state}
            report={report}
            selectedProductId={selectedReportProductId}
            onSelectProductId={setSelectedReportProductId}
            onNavigate={setCurrentView}
            onOpenProductDetail={handleOpenProductDetail}
            onResetDemoData={handleResetDemoData}
          />
        )}

        {currentView === 'product-detail' && activeDetailProduct && (
          <ProductDetailView
            product={activeDetailProduct}
            routines={state.routines}
            completions={state.completions}
            journalEntries={state.journalEntries}
            productReport={detailReport}
            onBackToProducts={handleOpenMyProductsSection}
            onLogObservationForProduct={(pid) => handleQuickLogExperience(pid)}
            onOpenFullRealityCheck={handleInspectProductReport}
          />
        )}

        {currentView === 'routines' && (
          <RoutineCompanionView
            products={state.products}
            routines={state.routines}
            completions={state.completions}
            autoOpenAddProductForm={autoOpenProductForm}
            autoOpenProductMode={productFormInitialMode}
            focusSection={routineFocusSection}
            onConsumeAutoOpenProduct={() => setAutoOpenProductForm(false)}
            onConsumeFocusSection={() => setRoutineFocusSection(null)}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onOpenProductDetail={handleOpenProductDetail}
            onAddRoutine={handleAddRoutine}
            onUpdateRoutine={handleUpdateRoutine}
            onDeleteRoutine={handleDeleteRoutine}
            onToggleTodayProduct={handleToggleTodayRoutineProduct}
            onToggleSkipTodayProduct={handleToggleSkipTodayProduct}
            onCompleteAllToday={handleCompleteAllToday}
            onLogRoutineSkip={handleLogRoutineSkip}
          />
        )}

        {currentView === 'journal' && (
          <ProgressJournalView
            products={state.products}
            entries={state.journalEntries}
            autoOpenForm={autoOpenJournalForm}
            preselectedProductId={journalPreselectProductId}
            onConsumeAutoOpen={() => {
              setAutoOpenJournalForm(false);
              setJournalPreselectProductId(undefined);
            }}
            onAddEntry={handleAddJournalEntry}
            onUpdateEntry={handleUpdateJournalEntry}
            onDeleteEntry={handleDeleteJournalEntry}
          />
        )}

        {currentView === 'discovery' && (
          <ProductDiscoveryView
            trackedProducts={state.products}
            onAddCatalogProduct={handleAddProduct}
            onAddManualProduct={handleQuickAddManualProduct}
            onOpenMyProducts={handleOpenMyProductsSection}
          />
        )}
      </Layout>

      <OnboardingWalkthrough
        isOpen={showOnboarding}
        currentStep={tourStep}
        onStepChange={handleTourStepChange}
        onFinish={handleFinishOnboarding}
        onSkip={handleSkipOnboarding}
      />
    </>
  );
}
