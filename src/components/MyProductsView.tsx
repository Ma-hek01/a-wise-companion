import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Edit2,
  ExternalLink,
  Package,
  PenLine,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { BE_BODYWISE_CATALOG, CATALOG_CATEGORIES } from '../data/beBodywiseCatalog';
import { formatLocalDate } from '../data/demoData';
import {
  CatalogCategory,
  CatalogProduct,
  FrequencyGoal,
  LegacyProductCategory,
  Product,
  ProductCategory,
} from '../types/companion';

interface MyProductsViewProps {
  products: Product[];
  embedded?: boolean;
  autoOpenAddForm?: boolean;
  autoOpenMode?: 'choose' | 'manual';
  onConsumeAutoOpen?: () => void;
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product | void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onOpenProductDetail: (productId: string) => void;
}

type AddPanelMode =
  | 'closed'
  | 'choose'
  | 'catalog-browse'
  | 'catalog-confirm'
  | 'catalog-details'
  | 'manual'
  | 'edit';

const LEGACY_CATEGORIES: LegacyProductCategory[] = [
  'Skincare',
  'Hair & Scalp',
  'Supplements',
  'Oral & Wellness',
  'Other',
];

const FREQUENCIES: FrequencyGoal[] = [
  'Daily',
  'Twice Daily',
  '3x Weekly',
  'Weekly',
  'As Needed',
];

const ProductThumb: React.FC<{
  imageUrl?: string;
  name: string;
  sizeClass?: string;
}> = ({ imageUrl, name, sizeClass = 'h-14 w-14' }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [imageUrl]);

  if (!imageUrl || failed) {
    return (
      <div
        className={`${sizeClass} shrink-0 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400`}
      >
        <Package className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-1`}
    >
      <img
        src={imageUrl}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-full w-full object-contain"
      />
    </div>
  );
};

export const MyProductsView: React.FC<MyProductsViewProps> = ({
  products,
  embedded = false,
  autoOpenAddForm = false,
  autoOpenMode = 'choose',
  onConsumeAutoOpen,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onOpenProductDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [panelMode, setPanelMode] = useState<AddPanelMode>('closed');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Manual / Edit / Personal Details form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Face Care');
  const [dateStarted, setDateStarted] = useState(formatLocalDate(new Date()));
  const [frequencyGoal, setFrequencyGoal] = useState<FrequencyGoal>('Daily');
  const [expectations, setExpectations] = useState('');
  const [allowManualDuplicate, setAllowManualDuplicate] = useState(false);

  // Option 1: Catalogue picker state
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState<'All' | CatalogCategory>(
    'All'
  );
  const [selectedCatalogItem, setSelectedCatalogItem] =
    useState<CatalogProduct | null>(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [allowCatalogDuplicate, setAllowCatalogDuplicate] = useState(false);
  const [justAddedCatalogProduct, setJustAddedCatalogProduct] =
    useState<Product | null>(null);

  const resetFormFields = () => {
    setEditingProduct(null);
    setName('');
    setCategory('Face Care');
    setDateStarted(formatLocalDate(new Date()));
    setFrequencyGoal('Daily');
    setExpectations('');
    setAllowManualDuplicate(false);
  };

  const openAddOptions = () => {
    resetFormFields();
    setSelectedCatalogItem(null);
    setSelectedVariantIdx(0);
    setAllowCatalogDuplicate(false);
    setJustAddedCatalogProduct(null);
    setPanelMode('choose');
  };

  const openManualAdd = () => {
    resetFormFields();
    setPanelMode('manual');
  };

  const openCatalogBrowse = () => {
    setCatalogSearch('');
    setCatalogCategory('All');
    setSelectedCatalogItem(null);
    setSelectedVariantIdx(0);
    setAllowCatalogDuplicate(false);
    setJustAddedCatalogProduct(null);
    setPanelMode('catalog-browse');
  };

  useEffect(() => {
    if (autoOpenAddForm) {
      if (autoOpenMode === 'manual') {
        openManualAdd();
      } else {
        openAddOptions();
      }
      onConsumeAutoOpen?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenAddForm, autoOpenMode]);

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category);
    setDateStarted(product.dateStarted);
    setFrequencyGoal(product.frequencyGoal);
    setExpectations(product.expectations);
    setAllowManualDuplicate(false);
    setPanelMode('edit');
  };

  const findTrackedCatalogMatch = (item: CatalogProduct): Product | undefined =>
    products.find(
      (p) =>
        p.catalogProductId === item.id ||
        p.name.trim().toLowerCase() === item.name.trim().toLowerCase()
    );

  const manualDuplicateMatch = useMemo(() => {
    if (panelMode !== 'manual') return undefined;
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) return undefined;
    return products.find((p) => p.name.trim().toLowerCase() === trimmed);
  }, [panelMode, name, products]);

  const handleManualOrEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    if (panelMode === 'edit' && editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        name: trimmedName,
        category,
        dateStarted,
        frequencyGoal,
        expectations: expectations.trim(),
        isDemo: false,
      });
      setPanelMode('closed');
      setEditingProduct(null);
      return;
    }

    if (manualDuplicateMatch && !allowManualDuplicate) {
      return;
    }

    onAddProduct({
      name: trimmedName,
      category,
      dateStarted,
      frequencyGoal,
      expectations: expectations.trim(),
      isDemo: false,
    });
    setPanelMode('closed');
    resetFormFields();
  };

  const handleSelectCatalogProduct = (item: CatalogProduct) => {
    setSelectedCatalogItem(item);
    setSelectedVariantIdx(0);
    setAllowCatalogDuplicate(false);
    setPanelMode('catalog-confirm');
  };

  const handleConfirmCatalogProduct = () => {
    if (!selectedCatalogItem) return;
    const existingMatch = findTrackedCatalogMatch(selectedCatalogItem);
    if (existingMatch && !allowCatalogDuplicate) return;

    const chosenVariant =
      selectedCatalogItem.variants[selectedVariantIdx] ??
      selectedCatalogItem.variants[0];
    const todayStr = formatLocalDate(new Date());

    const payload: Omit<Product, 'id' | 'createdAt'> = {
      name: selectedCatalogItem.name,
      category: selectedCatalogItem.category,
      dateStarted: todayStr,
      frequencyGoal: 'Daily',
      expectations: '',
      isDemo: false,
      imageUrl: selectedCatalogItem.imageUrl || undefined,
      subcategory: selectedCatalogItem.subcategory || undefined,
      selectedVariant: chosenVariant?.label || undefined,
      keyIngredients:
        selectedCatalogItem.keyIngredients.length > 0
          ? [...selectedCatalogItem.keyIngredients]
          : undefined,
      officialUrl:
        chosenVariant?.url || selectedCatalogItem.officialUrl || undefined,
      catalogProductId: selectedCatalogItem.id,
    };

    const created = onAddProduct(payload);
    setDateStarted(todayStr);
    setFrequencyGoal('Daily');
    setExpectations('');
    setJustAddedCatalogProduct(
      created ?? {
        ...payload,
        id: 'pending',
        createdAt: new Date().toISOString(),
      }
    );
    setPanelMode('catalog-details');
  };

  const handleSaveCatalogPersonalDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (justAddedCatalogProduct && justAddedCatalogProduct.id !== 'pending') {
      onUpdateProduct({
        ...justAddedCatalogProduct,
        dateStarted,
        frequencyGoal,
        expectations: expectations.trim(),
        isDemo: false,
      });
    }
    setJustAddedCatalogProduct(null);
    setSelectedCatalogItem(null);
    setPanelMode('closed');
  };

  const filteredCatalogPicker = useMemo(() => {
    const q = catalogSearch.trim().toLowerCase();
    const avRank = (status: CatalogProduct['availabilityStatus']) =>
      status === 'In Stock' ? 0 : status === 'Out of Stock' ? 1 : 2;
    return BE_BODYWISE_CATALOG.filter((item) => {
      if (catalogCategory !== 'All' && item.category !== catalogCategory) {
        return false;
      }
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.subcategory.toLowerCase().includes(q) ||
        item.keyIngredients.some((ing) => ing.toLowerCase().includes(q)) ||
        item.variants.some((v) => v.label.toLowerCase().includes(q))
      );
    }).sort((a, b) => {
      const diff = avRank(a.availabilityStatus) - avRank(b.availabilityStatus);
      if (diff !== 0) return diff;
      return a.name.localeCompare(b.name);
    });
  }, [catalogSearch, catalogCategory]);

  const availableCategories = Array.from(
    new Set(products.map((p) => p.category))
  );

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      categoryFilter === 'All' || product.category === categoryFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.expectations.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.subcategory ?? '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateCarouselControls = useCallback(() => {
    const el = carouselRef.current;
    if (!el) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateCarouselControls();
    const el = carouselRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => updateCarouselControls());
    observer.observe(el);
    return () => observer.disconnect();
  }, [filteredProducts.length, categoryFilter, searchQuery, updateCarouselControls]);

  const scrollCarouselBy = (direction: 'prev' | 'next') => {
    const el = carouselRef.current;
    if (!el) return;
    const step = Math.max(260, Math.round(el.clientWidth * 0.72));
    el.scrollBy({
      left: direction === 'next' ? step : -step,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-w-0 space-y-5">
      <section className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {embedded && (
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              Section 1 · {products.length}{' '}
              {products.length === 1 ? 'product' : 'products'}
            </p>
          )}
          <h3
            className={`font-display font-bold tracking-tight text-slate-900 ${
              embedded ? 'mt-0.5 text-xl' : 'text-2xl'
            }`}
          >
            My Products
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            View and manage the products in your personal collection, or select
            one to open its experience page.
          </p>
        </div>
        <button
          type="button"
          data-tour="add-product-btn"
          onClick={openAddOptions}
          className="scroll-mt-24 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </section>

      {/* Step 0: Choose Option 1 (Catalogue) or Option 2 (Manual) */}
      {panelMode === 'choose' && (
        <section className="rounded-xl border border-blue-200 bg-white p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-display text-base font-semibold text-slate-900">
                Add a Product to My Products
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Choose how you would like to add your product.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPanelMode('closed')}
              aria-label="Close add product options"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={openCatalogBrowse}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-5 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                    <Compass className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-medium text-blue-700">
                    Option 1
                  </span>
                </div>
                <h4 className="mt-3 font-display text-base font-semibold text-slate-900">
                  Select from Catalogue
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Search and filter the Be Bodywise catalogue, pick a size or
                  variant, and carry over product image, ingredients, and URL.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:text-blue-700">
                <span>Browse catalogue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>

            <button
              type="button"
              onClick={openManualAdd}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-5 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-200/70 text-slate-700">
                    <PenLine className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    Option 2
                  </span>
                </div>
                <h4 className="mt-3 font-display text-base font-semibold text-slate-900">
                  Add Manually
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Track any personal-care or wellness product not in the
                  catalogue — no Be Bodywise product required.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-slate-700 group-hover:text-blue-700">
                <span>Enter product details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
          </div>
        </section>
      )}

      {/* Option 1 Step A: Browse & Select from Catalogue */}
      {panelMode === 'catalog-browse' && (
        <section className="rounded-xl border border-blue-200 bg-white p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPanelMode('choose')}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
              <div>
                <h3 className="font-display text-base font-semibold text-slate-900">
                  Select from Be Bodywise Catalogue
                </h3>
                <p className="text-xs text-slate-500">
                  Search or filter by category, then select a product to
                  confirm variant and add.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openManualAdd}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
              >
                Add Manually Instead
              </button>
              <button
                type="button"
                onClick={() => setPanelMode('closed')}
                aria-label="Close catalogue selector"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Search products, ingredients, or sizes..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(['All', ...CATALOG_CATEGORIES] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCatalogCategory(cat)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                  catalogCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredCatalogPicker.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-8 text-center">
              <p className="text-sm text-slate-600">
                No catalogue products match your search.
              </p>
              <button
                type="button"
                onClick={openManualAdd}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-blue-700"
              >
                <PenLine className="h-3.5 w-3.5" />
                <span>Add Manually Instead</span>
              </button>
            </div>
          ) : (
            <div className="grid max-h-[420px] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCatalogPicker.map((item) => {
                const tracked = Boolean(findTrackedCatalogMatch(item));
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectCatalogProduct(item)}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/30"
                  >
                    <ProductThumb
                      imageUrl={item.imageUrl}
                      name={item.name}
                      sizeClass="h-14 w-14"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-slate-500 truncate">
                        {item.category}
                        {item.subcategory && item.subcategory !== item.category
                          ? ` · ${item.subcategory}`
                          : ''}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-900 line-clamp-2">
                        {item.name}
                      </p>
                      <p className="mt-1 text-[11px] tabular-nums text-slate-500">
                        {item.availabilityStatus}
                        {item.variants.length > 1
                          ? ` · ${item.variants.length} variants`
                          : item.variants[0]?.sizeOrPack
                          ? ` · ${item.variants[0].sizeOrPack}`
                          : ''}
                      </p>
                      {tracked && (
                        <p className="mt-1 text-[11px] font-medium text-blue-700">
                          Already in My Products
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Option 1 Step B: Preview, Select Variant & Confirm */}
      {panelMode === 'catalog-confirm' && selectedCatalogItem && (() => {
        const chosenVariant =
          selectedCatalogItem.variants[selectedVariantIdx] ??
          selectedCatalogItem.variants[0];
        const existingMatch = findTrackedCatalogMatch(selectedCatalogItem);
        const blockedDuplicate = Boolean(existingMatch) && !allowCatalogDuplicate;

        return (
          <section className="rounded-xl border border-blue-200 bg-white p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPanelMode('catalog-browse')}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Choose another product</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setPanelMode('closed')}
                aria-label="Close confirmation"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <ProductThumb
                imageUrl={selectedCatalogItem.imageUrl}
                name={selectedCatalogItem.name}
                sizeClass="h-24 w-24"
              />
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-xs font-medium text-slate-500">
                  {selectedCatalogItem.category} ·{' '}
                  {selectedCatalogItem.subcategory}
                </p>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  {selectedCatalogItem.name}
                </h3>
                {selectedCatalogItem.shortDescription && (
                  <p className="text-sm text-slate-600">
                    {selectedCatalogItem.shortDescription}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>
                    {chosenVariant?.availabilityStatus ??
                      selectedCatalogItem.availabilityStatus}
                  </span>
                  {(chosenVariant?.url || selectedCatalogItem.officialUrl) && (
                    <a
                      href={
                        chosenVariant?.url || selectedCatalogItem.officialUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700"
                    >
                      <span>Official product URL</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                {selectedCatalogItem.keyIngredients.length > 0 && (
                  <p className="pt-1 text-xs text-slate-600">
                    <span className="font-medium text-slate-700">
                      Documented key ingredients:{' '}
                    </span>
                    {selectedCatalogItem.keyIngredients.join(', ')}
                  </p>
                )}
              </div>
            </div>

            {selectedCatalogItem.variants.length > 0 && (
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-medium text-slate-700">
                  Select Size / Variant ({selectedCatalogItem.variants.length})
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCatalogItem.variants.map((variant, idx) => {
                    const active = idx === selectedVariantIdx;
                    return (
                      <button
                        key={`${variant.label}-${idx}`}
                        type="button"
                        onClick={() => setSelectedVariantIdx(idx)}
                        className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                          active
                            ? 'border-blue-600 bg-blue-50 text-blue-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-medium">{variant.label}</div>
                        <div className="mt-0.5 text-[11px] text-slate-500">
                          {variant.availabilityStatus}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {existingMatch && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                  <div className="space-y-2">
                    <p className="font-semibold">
                      Already in My Products: {existingMatch.name}
                      {existingMatch.selectedVariant
                        ? ` (${existingMatch.selectedVariant})`
                        : ''}
                    </p>
                    <p>
                      You are already tracking this product. Open your existing
                      entry or confirm below if you intentionally want a
                      separate record.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setPanelMode('closed');
                          onOpenProductDetail(existingMatch.id);
                        }}
                        className="font-semibold text-blue-700 hover:text-blue-800 underline"
                      >
                        Open existing product
                      </button>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium text-amber-950">
                        <input
                          type="checkbox"
                          checked={allowCatalogDuplicate}
                          onChange={(e) =>
                            setAllowCatalogDuplicate(e.target.checked)
                          }
                          className="rounded border-amber-400 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Add as a separate entry anyway</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setPanelMode('catalog-browse')}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                disabled={blockedDuplicate}
                onClick={handleConfirmCatalogProduct}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Check className="h-4 w-4" />
                <span>Confirm & Add to My Products</span>
              </button>
            </div>
          </section>
        );
      })()}

      {/* Option 1 Step C: Post-Confirmation Personal Details */}
      {panelMode === 'catalog-details' && justAddedCatalogProduct && (
        <section className="rounded-xl border border-blue-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-start gap-3.5">
              <ProductThumb
                imageUrl={justAddedCatalogProduct.imageUrl}
                name={justAddedCatalogProduct.name}
                sizeClass="h-14 w-14"
              />
              <div>
                <p className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                  <Check className="h-3.5 w-3.5" />
                  <span>Added to My Products</span>
                </p>
                <h3 className="mt-0.5 font-display text-base font-semibold text-slate-900">
                  {justAddedCatalogProduct.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {justAddedCatalogProduct.category}
                  {justAddedCatalogProduct.selectedVariant
                    ? ` · ${justAddedCatalogProduct.selectedVariant}`
                    : ''}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPanelMode('closed')}
              aria-label="Done"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form
            onSubmit={handleSaveCatalogPersonalDetails}
            className="mt-5 space-y-4"
          >
            <p className="text-xs font-medium text-slate-600">
              Add your personal tracking details for this product:
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="catalog-date-started"
                  className="block text-xs font-medium text-slate-700"
                >
                  Date Started
                </label>
                <input
                  id="catalog-date-started"
                  type="date"
                  required
                  value={dateStarted}
                  onChange={(e) => setDateStarted(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 tabular-nums focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="catalog-frequency"
                  className="block text-xs font-medium text-slate-700"
                >
                  Intended Usage Frequency
                </label>
                <select
                  id="catalog-frequency"
                  value={frequencyGoal}
                  onChange={(e) =>
                    setFrequencyGoal(e.target.value as FrequencyGoal)
                  }
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  {FREQUENCIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="catalog-expectations"
                className="block text-xs font-medium text-slate-700"
              >
                Personal Expectations
              </label>
              <textarea
                id="catalog-expectations"
                rows={2}
                value={expectations}
                onChange={(e) => setExpectations(e.target.value)}
                placeholder="What are you hoping to notice or feel from using this?"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setJustAddedCatalogProduct(null);
                  setSelectedCatalogItem(null);
                  setPanelMode('closed');
                }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Done
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Save Personal Details
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Option 2: Manual Add Form OR Edit Existing Product Form */}
      {(panelMode === 'manual' || panelMode === 'edit') && (
        <section className="rounded-xl border border-blue-200 bg-white p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              {panelMode === 'manual' && (
                <button
                  type="button"
                  onClick={() => setPanelMode('choose')}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>
              )}
              <h3 className="font-display text-base font-semibold text-slate-900">
                {panelMode === 'edit'
                  ? 'Edit Product'
                  : 'Add Product Manually'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setPanelMode('closed')}
              aria-label="Close form"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleManualOrEditSubmit} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="product-name"
                  className="block text-xs font-medium text-slate-700"
                >
                  Product Name (any brand or item)
                </label>
                <input
                  id="product-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setAllowManualDuplicate(false);
                  }}
                  placeholder="e.g., Ceramide Night Moisturizer"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="product-category"
                  className="block text-xs font-medium text-slate-700"
                >
                  Category
                </label>
                <select
                  id="product-category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ProductCategory)
                  }
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <optgroup label="Catalogue Categories">
                    {CATALOG_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="General Categories">
                    {LEGACY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label
                  htmlFor="product-date-started"
                  className="block text-xs font-medium text-slate-700"
                >
                  Start Date
                </label>
                <input
                  id="product-date-started"
                  type="date"
                  required
                  value={dateStarted}
                  onChange={(e) => setDateStarted(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 tabular-nums focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="product-frequency"
                  className="block text-xs font-medium text-slate-700"
                >
                  Intended Usage Frequency
                </label>
                <select
                  id="product-frequency"
                  value={frequencyGoal}
                  onChange={(e) =>
                    setFrequencyGoal(e.target.value as FrequencyGoal)
                  }
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  {FREQUENCIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="product-expectations"
                className="block text-xs font-medium text-slate-700"
              >
                Personal Expectations
              </label>
              <textarea
                id="product-expectations"
                rows={2}
                value={expectations}
                onChange={(e) => setExpectations(e.target.value)}
                placeholder="What are you hoping to notice or feel from using this?"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {manualDuplicateMatch && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                  <div className="space-y-1.5">
                    <p className="font-semibold">
                      A product named &ldquo;{manualDuplicateMatch.name}&rdquo;
                      is already in My Products.
                    </p>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium text-amber-950">
                      <input
                        type="checkbox"
                        checked={allowManualDuplicate}
                        onChange={(e) =>
                          setAllowManualDuplicate(e.target.checked)
                        }
                        className="rounded border-amber-400 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Save as a separate entry anyway</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPanelMode('closed')}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={Boolean(manualDuplicateMatch) && !allowManualDuplicate}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {panelMode === 'edit' ? 'Save Changes' : 'Save Product'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Search & Category Filter */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your products..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1">
          {['All', ...availableCategories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Clean Product Cards */}
      {products.length === 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <Package className="mx-auto h-8 w-8 text-slate-400" />
          <h3 className="mt-3 font-display text-base font-semibold text-slate-900">
            No products added yet
          </h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
            Select a product from the Be Bodywise catalogue or add one manually
            to start tracking routines and experiences.
          </p>
          <button
            type="button"
            onClick={openAddOptions}
            className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add First Product
          </button>
        </section>
      ) : filteredProducts.length === 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-600">
            No products match your search or category filter.
          </p>
        </section>
      ) : (
        <section className="min-w-0 space-y-3">
          {filteredProducts.length > 1 && (
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500 tabular-nums">
                Showing {filteredProducts.length}{' '}
                {filteredProducts.length === 1 ? 'product' : 'products'} · Swipe
                or scroll horizontally
              </p>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => scrollCarouselBy('prev')}
                  disabled={!canScrollLeft}
                  aria-label="Scroll products left"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarouselBy('next')}
                  disabled={!canScrollRight}
                  aria-label="Scroll products right"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="relative min-w-0">
            <div
              ref={carouselRef}
              onScroll={updateCarouselControls}
              role="region"
              aria-label="My Products carousel"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  scrollCarouselBy('next');
                } else if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  scrollCarouselBy('prev');
                }
              }}
              className="flex gap-3.5 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory pb-1 touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
            >
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className={`snap-start shrink-0 flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-200 ${
                    filteredProducts.length === 1
                      ? 'w-full max-w-sm'
                      : 'w-[78%] sm:w-[46%] lg:w-[29.5%]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex min-w-0 items-start gap-3">
                        <ProductThumb
                          imageUrl={product.imageUrl}
                          name={product.name}
                          sizeClass="h-12 w-12"
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-slate-500 truncate">
                            {product.category}
                            {product.selectedVariant
                              ? ` · ${product.selectedVariant}`
                              : product.subcategory
                              ? ` · ${product.subcategory}`
                              : ''}
                          </p>
                          <button
                            type="button"
                            onClick={() => onOpenProductDetail(product.id)}
                            className="mt-0.5 text-left font-display text-sm font-semibold leading-snug text-slate-900 hover:text-blue-700 transition-colors line-clamp-2"
                          >
                            {product.name}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditForm(product)}
                          aria-label={`Edit ${product.name}`}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(product.id)}
                          aria-label={`Remove ${product.name}`}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="mt-2.5 text-[11px] text-slate-400 tabular-nums truncate">
                      Started {product.dateStarted} · {product.frequencyGoal}
                      {product.isDemo ? ' · SYNTHETIC DEMO DATA' : ''}
                    </p>

                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 line-clamp-2">
                      {product.expectations || 'No expectations added.'}
                    </p>
                  </div>

                  <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    {confirmDeleteId === product.id ? (
                      <div className="flex w-full items-center justify-end gap-2">
                        <span className="text-xs text-red-700">
                          Remove product?
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteProduct(product.id);
                            setConfirmDeleteId(null);
                          }}
                          className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        {product.subcategory ? (
                          <span className="text-[11px] text-slate-400 truncate">
                            {product.subcategory}
                          </span>
                        ) : (
                          <span />
                        )}
                        <button
                          type="button"
                          onClick={() => onOpenProductDetail(product.id)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
                        >
                          <span>View Details</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {canScrollRight && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-white/90 to-transparent"
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
};
