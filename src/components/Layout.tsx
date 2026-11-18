import React, { useState } from 'react';
import {
  Activity,
  BookOpen,
  CalendarCheck2,
  CircleHelp,
  Compass,
  LayoutDashboard,
  Menu,
  RotateCcw,
  Settings,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { AppView } from '../types/companion';

interface LayoutProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  hasDemoData: boolean;
  totalCounts: {
    products: number;
    routines: number;
    journalEntries: number;
  };
  onResetDemoData: () => void;
  onClearPersonalData: () => void;
  onShowNavigationGuide: () => void;
  forceMobileMenuOpen?: boolean;
  children: React.ReactNode;
}

const NAV_ITEMS: Array<{
  id: AppView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'routines', label: 'Routine Companion', icon: CalendarCheck2 },
  { id: 'reality-check', label: 'Reality Check', icon: Activity },
  { id: 'journal', label: 'Progress Journal', icon: BookOpen },
  { id: 'discovery', label: 'Explore Products', icon: Compass },
];

const VIEW_TITLES: Record<AppView, string> = {
  dashboard: 'Home',
  routines: 'Routine Companion',
  'reality-check': 'Reality Check',
  journal: 'Progress Journal',
  discovery: 'Explore Products',
  'product-detail': 'Product Experience',
};

export const Layout: React.FC<LayoutProps> = ({
  currentView,
  onNavigate,
  hasDemoData,
  totalCounts,
  onResetDemoData,
  onClearPersonalData,
  onShowNavigationGuide,
  forceMobileMenuOpen = false,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    'reset-demo' | 'clear-all' | null
  >(null);

  const isMobileDrawerVisible = mobileMenuOpen || forceMobileMenuOpen;

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const handleConfirm = () => {
    if (confirmAction === 'reset-demo') {
      onResetDemoData();
    } else if (confirmAction === 'clear-all') {
      onClearPersonalData();
    }
    setConfirmAction(null);
    setSettingsOpen(false);
  };

  const isNavItemActive = (itemId: AppView) => {
    if (itemId === 'routines' && currentView === 'product-detail') return true;
    return currentView === itemId;
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between bg-white px-4 py-5">
      <div>
        <div className="px-2 pb-5 border-b border-slate-100">
          <button
            type="button"
            onClick={() => handleNavClick('dashboard')}
            className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
          >
            <span className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block">
              A Wise Companion
            </span>
          </button>
          <p className="mt-1 text-xs text-slate-500">
            Personal-care experience tracker
          </p>
        </div>

        <nav className="mt-5 space-y-1" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isNavItemActive(item.id);
            return (
              <button
                key={item.id}
                type="button"
                data-tour={item.id === 'routines' ? 'nav-routines' : undefined}
                onClick={() => handleNavClick(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    active ? 'text-blue-600' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-6 space-y-3 border-t border-slate-100 pt-4">
        <div className="px-2">
          <p className="text-xs font-medium text-slate-700">
            {hasDemoData ? 'SYNTHETIC DEMO DATA active' : 'Saved in browser'}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 tabular-nums">
            {totalCounts.products} products · {totalCounts.routines} routines ·{' '}
            {totalCounts.journalEntries} logs
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSettingsOpen(true);
            setMobileMenuOpen(false);
          }}
          className="flex w-full items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <Settings className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span>Settings</span>
        </button>

        <div className="px-2 pt-1 text-[11px] leading-relaxed text-slate-400">
          <div className="flex items-start gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-400" />
            <span>
              Independent prototype. Not an official Be Bodywise app.
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:w-64 lg:shrink-0 lg:border-r lg:border-slate-200 lg:bg-white lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {isMobileDrawerVisible && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/30"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-[85vw] border-r border-slate-200 bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-end px-4 pt-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xs sm:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm text-slate-500 whitespace-nowrap">
                <span className="hidden sm:inline font-medium text-slate-400">
                  A Wise Companion
                </span>
                <span className="hidden sm:inline text-slate-300">/</span>
                {currentView === 'product-detail' && (
                  <>
                    <button
                      type="button"
                      onClick={() => onNavigate('routines')}
                      className="hidden sm:inline font-medium text-slate-500 hover:text-blue-700 transition-colors"
                    >
                      Routine Companion
                    </button>
                    <span className="hidden sm:inline text-slate-300">/</span>
                  </>
                )}
                <h1 className="font-display text-base font-semibold text-slate-900 truncate">
                  {VIEW_TITLES[currentView]}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {currentView === 'dashboard' && (
              <div className="relative group">
                <button
                  type="button"
                  onClick={onShowNavigationGuide}
                  aria-label="Navigation Guide"
                  title="Navigation Guide"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  <CircleHelp className="h-4 w-4" />
                </button>
                <span
                  role="tooltip"
                  className="pointer-events-none absolute right-0 top-full z-40 mt-1.5 hidden whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white shadow-sm group-hover:block group-focus-within:block"
                >
                  Navigation Guide
                </span>
              </div>
            )}
            {currentView !== 'reality-check' ? (
              <button
                type="button"
                onClick={() => onNavigate('reality-check')}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 sm:px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <Activity className="h-3.5 w-3.5" />
                <span>View Reality Check</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('journal')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                <span>Log Experience</span>
              </button>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-8 sm:py-8">
          {children}
        </main>

        <footer className="border-t border-slate-200 bg-white px-4 py-4 text-xs text-slate-500 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              A Wise Companion · Independent customer-experience prototype (not an
              official Be Bodywise application).
            </p>
            <p className="text-slate-400">
              Non-medical self-tracking tool · Saved locally in your browser.
            </p>
          </div>
        </footer>
      </div>

      {/* Settings Modal */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2
                id="settings-title"
                className="font-display text-lg font-semibold text-slate-900"
              >
                Settings
              </h2>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close settings"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-lg border border-slate-200 p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Your Browser Data
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {hasDemoData
                      ? 'Sample SYNTHETIC DEMO DATA is currently active (not genuine customer reviews).'
                      : 'Only your personal browser data is stored.'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmAction('reset-demo')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                    <span>Reset Demo Data</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmAction('clear-all')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-red-700 hover:border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Clear Personal Data</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              {confirmAction === 'reset-demo'
                ? 'Reset to Demo Data?'
                : 'Clear All Personal Data?'}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {confirmAction === 'reset-demo'
                ? 'This replaces your current local records with the Be Bodywise SYNTHETIC DEMO DATA sample profile.'
                : 'This removes all products, routines, check-ins, and journal entries from your browser.'}
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                  confirmAction === 'reset-demo'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {confirmAction === 'reset-demo'
                  ? 'Reset Demo Data'
                  : 'Clear All Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
