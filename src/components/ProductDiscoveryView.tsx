import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  ExternalLink,
  GitCompare,
  Package,
  Plus,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { BE_BODYWISE_CATALOG, CATALOG_CATEGORIES } from '../data/beBodywiseCatalog';
import { formatLocalDate } from '../data/demoData';
import {
  CatalogAvailabilityStatus,
  CatalogCategory,
  CatalogProduct,
  CatalogVariant,
  Product,
} from '../types/companion';

interface ProductDiscoveryViewProps {
  trackedProducts: Product[];
  onAddCatalogProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onAddManualProduct: () => void;
  onOpenMyProducts: () => void;
}

type SortOption =
  | 'featured'
  | 'name-asc'
  | 'name-desc'
  | 'variants-desc'
  | 'category';

type AvailabilityFilter = 'All' | CatalogAvailabilityStatus;

function getAvailabilityTextClass(status: CatalogAvailabilityStatus): string {
  if (status === 'In Stock') return 'font-medium text-emerald-700';
  if (status === 'Out of Stock') return 'font-medium text-amber-700';
  return 'font-medium text-slate-600';
}

function getAvailabilityBadgeClass(status: CatalogAvailabilityStatus): string {
  if (status === 'In Stock') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  }
  if (status === 'Out of Stock') {
    return 'border-amber-200 bg-amber-50 text-amber-800';
  }
  return 'border-slate-300 border-dashed bg-slate-50 text-slate-600';
}

function formatVariantSummary(variants: CatalogVariant[]): string {
  if (variants.length === 0) return 'Single listing';
  if (variants.length === 1) {
    return variants[0].sizeOrPack || variants[0].label;
  }
  const primary = variants[0].sizeOrPack || variants[0].label;
  return `${variants.length} variants · ${primary} + ${variants.length - 1} more`;
}

const CatalogImage: React.FC<{
  imageUrl: string;
  name: string;
  category: string;
  size?: 'card' | 'detail' | 'thumb';
}> = ({ imageUrl, name, category, size = 'card' }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [imageUrl]);

  const containerClass =
    size === 'detail'
      ? 'aspect-square w-full flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6'
      : size === 'thumb'
      ? 'h-10 w-10 shrink-0 flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1'
      : 'aspect-[4/3] w-full flex flex-col items-center justify-center bg-white p-4';

  if (failed || !imageUrl) {
    if (size === 'thumb') {
      return (
        <div
          className={`${containerClass} !bg-slate-50 text-slate-400`}
          title="No official image available"
        >
          <Package className="h-4 w-4" />
        </div>
      );
    }
    return (
      <div className={`${containerClass} !bg-slate-50 text-slate-400`}>
        <Package className={size === 'detail' ? 'h-12 w-12' : 'h-8 w-8'} />
        <span className="mt-2 text-xs font-medium text-slate-600">
          {category}
        </span>
        <span className="mt-0.5 text-[11px] text-slate-400">
          No official image available
        </span>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <img
        src={imageUrl}
        alt={size === 'thumb' ? '' : `${name} — ${category}`}
        referrerPolicy="no-referrer"
        loading={size === 'card' ? 'lazy' : 'eager'}
        onError={() => setFailed(true)}
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
};

export const ProductDiscoveryView: React.FC<ProductDiscoveryViewProps> = ({
  trackedProducts,
  onAddCatalogProduct,
  onAddManualProduct,
  onOpenMyProducts,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | CatalogCategory>(
    'All'
  );
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilter>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(
    null
  );
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);

  const selectedProduct = useMemo(
    () =>
      selectedCatalogId
        ? BE_BODYWISE_CATALOG.find((item) => item.id === selectedCatalogId) ??
          null
        : null,
    [selectedCatalogId]
  );

  useEffect(() => {
    setSelectedVariantIndex(0);
    if (selectedCatalogId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedCatalogId]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const isAlreadyTracked = (item: CatalogProduct) =>
    trackedProducts.some(
      (p) =>
        p.catalogProductId === item.id ||
        p.name.trim().toLowerCase() === item.name.trim().toLowerCase()
    );

  const handleTrackProduct = (item: CatalogProduct, variantIndex = 0) => {
    if (isAlreadyTracked(item)) return;
    const chosenVariant = item.variants[variantIndex] ?? item.variants[0];

    onAddCatalogProduct({
      name: item.name,
      category: item.category,
      dateStarted: formatLocalDate(new Date()),
      frequencyGoal: 'Daily',
      expectations: item.shortDescription || '',
      isDemo: false,
      imageUrl: item.imageUrl || undefined,
      subcategory: item.subcategory || undefined,
      selectedVariant: chosenVariant?.label || undefined,
      keyIngredients:
        item.keyIngredients.length > 0 ? item.keyIngredients : undefined,
      officialUrl: chosenVariant?.url || item.officialUrl || undefined,
      catalogProductId: item.id,
    });
  };

  const searchAndAvailabilityMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BE_BODYWISE_CATALOG.filter((item) => {
      if (
        availabilityFilter !== 'All' &&
        item.availabilityStatus !== availabilityFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.subcategory.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q) ||
        item.keyIngredients.some((ing) => ing.toLowerCase().includes(q)) ||
        item.variants.some((v) => v.label.toLowerCase().includes(q)) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, availabilityFilter]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: searchAndAvailabilityMatches.length,
    };
    for (const cat of CATALOG_CATEGORIES) {
      counts[cat] = 0;
    }
    for (const item of searchAndAvailabilityMatches) {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
    }
    return counts;
  }, [searchAndAvailabilityMatches]);

  const filteredAndSortedCatalog = useMemo(() => {
    const filtered = searchAndAvailabilityMatches.filter(
      (item) => categoryFilter === 'All' || item.category === categoryFilter
    );

    const categoryRank = (cat: CatalogCategory) =>
      CATALOG_CATEGORIES.indexOf(cat);

    const availabilityRank = (status: CatalogAvailabilityStatus) =>
      status === 'In Stock' ? 0 : status === 'Out of Stock' ? 1 : 2;

    return [...filtered].sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === 'variants-desc') {
        if (b.variants.length !== a.variants.length) {
          return b.variants.length - a.variants.length;
        }
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'category') {
        const diff = categoryRank(a.category) - categoryRank(b.category);
        if (diff !== 0) return diff;
        const avDiff =
          availabilityRank(a.availabilityStatus) -
          availabilityRank(b.availabilityStatus);
        if (avDiff !== 0) return avDiff;
        return a.name.localeCompare(b.name);
      }
      // 'featured': In Stock first, then Out of Stock, then Availability not verified
      const avDiff =
        availabilityRank(a.availabilityStatus) -
        availabilityRank(b.availabilityStatus);
      if (avDiff !== 0) return avDiff;
      return a.name.localeCompare(b.name);
    });
  }, [searchAndAvailabilityMatches, categoryFilter, sortBy]);

  const comparedItems: CatalogProduct[] = useMemo(
    () =>
      compareIds
        .map((id) => BE_BODYWISE_CATALOG.find((c) => c.id === id))
        .filter((c): c is CatalogProduct => Boolean(c)),
    [compareIds]
  );

  // Individual Catalogue Product Detail View
  if (selectedProduct) {
    const activeVariant =
      selectedProduct.variants[selectedVariantIndex] ??
      selectedProduct.variants[0];
    const tracked = isAlreadyTracked(selectedProduct);
    const isCompared = compareIds.includes(selectedProduct.id);
    const currentAvailability =
      activeVariant?.availabilityStatus ?? selectedProduct.availabilityStatus;
    const currentUrl = activeVariant?.url || selectedProduct.officialUrl;
    const isUnverified = currentAvailability === 'Availability not verified';

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setSelectedCatalogId(null)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Explore Products</span>
          </button>

          <button
            type="button"
            onClick={onAddManualProduct}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Add a different product manually
          </button>
        </div>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Product Image & Availability Note */}
          <div className="space-y-4 lg:col-span-5">
            <CatalogImage
              imageUrl={selectedProduct.imageUrl}
              name={selectedProduct.name}
              category={selectedProduct.category}
              size="detail"
            />

            <div
              className={`rounded-xl border p-4 text-xs leading-relaxed ${
                isUnverified
                  ? 'border-slate-200 bg-slate-50 text-slate-600'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {isUnverified ? (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                ) : (
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                )}
                <div>
                  <p className="font-semibold text-slate-900">
                    {selectedProduct.verificationStatus}
                  </p>
                  <p className="mt-1">
                    {isUnverified
                      ? 'Official stock status could not be verified on bebodywise.com for this listing. You can still add and track this product in My Products if you already own it.'
                      : currentAvailability === 'Out of Stock'
                      ? 'Currently marked Out of Stock on bebodywise.com. You can still add it to My Products to track a bottle you already own.'
                      : 'Stock status and product details verified on bebodywise.com.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details, Variants, Ingredients, Actions */}
          <div className="space-y-5 lg:col-span-7">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-medium text-slate-500">
                {selectedProduct.category} · {selectedProduct.subcategory}
              </p>
              <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-slate-900">
                {selectedProduct.name}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-medium ${getAvailabilityBadgeClass(
                    currentAvailability
                  )}`}
                >
                  {isUnverified ? (
                    <AlertCircle className="h-3 w-3" />
                  ) : (
                    <ShieldCheck className="h-3 w-3" />
                  )}
                  <span>{currentAvailability}</span>
                </span>
                <span className="text-slate-500">
                  {selectedProduct.verificationStatus}
                </span>
                {activeVariant?.sku && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500 tabular-nums">
                      SKU: {activeVariant.sku}
                    </span>
                  </>
                )}
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-xs font-medium text-slate-500">
                  Official Product Summary
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">
                  {selectedProduct.shortDescription ||
                    'No short description documented on the official listing.'}
                </p>
              </div>

              {/* Variants / Sizes */}
              {selectedProduct.variants.length > 0 && (
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-xs font-medium text-slate-500">
                    Documented Sizes & Variants ({selectedProduct.variants.length})
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {selectedProduct.variants.map((variant, idx) => {
                      const active = idx === selectedVariantIndex;
                      const showPack =
                        variant.sizeOrPack &&
                        variant.sizeOrPack.toLowerCase() !==
                          variant.label.toLowerCase();
                      return (
                        <button
                          key={`${variant.label}-${idx}`}
                          type="button"
                          onClick={() => setSelectedVariantIndex(idx)}
                          className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                            active
                              ? 'border-blue-600 bg-blue-50 text-blue-900'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="font-medium">
                            {variant.label}
                            {showPack ? ` (${variant.sizeOrPack})` : ''}
                          </div>
                          <div
                            className={`mt-0.5 text-[11px] ${getAvailabilityTextClass(
                              variant.availabilityStatus
                            )}`}
                          >
                            {variant.availabilityStatus}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Key Ingredients */}
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-xs font-medium text-slate-500">
                  Key Ingredients (Officially Documented)
                </p>
                {selectedProduct.keyIngredients.length > 0 ? (
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-800">
                    {selectedProduct.keyIngredients.join(' · ')}
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-slate-500">
                    Key ingredients are not officially documented on this store
                    entry.
                  </p>
                )}
              </div>

              {/* Action Bar */}
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
                {tracked ? (
                  <>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                      <Check className="h-4 w-4 text-blue-600" />
                      <span>Added to My Products</span>
                    </span>
                    <button
                      type="button"
                      onClick={onOpenMyProducts}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      <span>View in Routine Companion</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      handleTrackProduct(selectedProduct, selectedVariantIndex)
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add to My Products</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => toggleCompare(selectedProduct.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                    isCompared
                      ? 'border-blue-300 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <GitCompare className="h-4 w-4" />
                  <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                </button>

                {currentUrl && (
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
                  >
                    <span>Official Page</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Be Bodywise Product Catalogue · {BE_BODYWISE_CATALOG.length} items
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900">
            Explore Products
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Browse Be Bodywise products across all categories, compare up to 3
            side by side, or add any item you already own to My Products in
            Routine Companion.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddManualProduct}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="h-3.5 w-3.5 text-blue-600" />
          <span>Can’t find it? Add Manually</span>
        </button>
      </section>

      {/* Category Filter Tabs (8 Required Categories + All) */}
      <section className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2">
        {(['All', ...CATALOG_CATEGORIES] as const).map((cat) => {
          const active = categoryFilter === cat;
          const count = categoryCounts[cat] ?? 0;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap tabular-nums ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </section>

      {/* Search, Availability Filter & Sort */}
      <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, ingredient, or size..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="catalog-availability"
              className="text-xs font-medium text-slate-500 whitespace-nowrap"
            >
              Availability
            </label>
            <select
              id="catalog-availability"
              value={availabilityFilter}
              onChange={(e) =>
                setAvailabilityFilter(e.target.value as AvailabilityFilter)
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Products</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Availability not verified">
                Availability not verified
              </option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="catalog-sort"
              className="text-xs font-medium text-slate-500 whitespace-nowrap"
            >
              Sort by
            </label>
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="featured">In Stock First</option>
              <option value="name-asc">Name (A–Z)</option>
              <option value="name-desc">Name (Z–A)</option>
              <option value="variants-desc">Most Variants</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
      </section>

      {/* Side-by-Side Comparison Matrix */}
      {comparedItems.length > 0 && (
        <section className="rounded-xl border border-blue-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <GitCompare className="h-4 w-4 text-blue-600" />
              <h3 className="font-display text-base font-semibold text-slate-900">
                Compare ({comparedItems.length}/3)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setCompareIds([])}
              className="text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              Clear
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="w-36 py-2.5 pr-4 text-xs font-medium text-slate-500">
                    Detail
                  </th>
                  {comparedItems.map((item) => (
                    <th
                      key={item.id}
                      className="py-2.5 px-3 font-display text-sm font-semibold text-slate-900"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CatalogImage
                            imageUrl={item.imageUrl}
                            name={item.name}
                            category={item.category}
                            size="thumb"
                          />
                          <button
                            type="button"
                            onClick={() => setSelectedCatalogId(item.id)}
                            className="text-left hover:text-blue-700 truncate"
                          >
                            {item.name}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleCompare(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 shrink-0"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-slate-500">
                    Category
                  </td>
                  {comparedItems.map((item) => (
                    <td key={item.id} className="py-2.5 px-3">
                      {item.category} · {item.subcategory}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-slate-500">
                    Availability & Verification
                  </td>
                  {comparedItems.map((item) => {
                    const isVerifiedListing =
                      item.availabilityStatus !== 'Availability not verified';
                    return (
                      <td key={item.id} className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium ${getAvailabilityBadgeClass(
                            item.availabilityStatus
                          )}`}
                        >
                          {isVerifiedListing ? (
                            <ShieldCheck className="h-3 w-3" />
                          ) : (
                            <AlertCircle className="h-3 w-3" />
                          )}
                          <span>{item.availabilityStatus}</span>
                        </span>
                        <p className="mt-1 text-[11px] text-slate-500">
                          {item.verificationStatus}
                        </p>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-slate-500">
                    Variants
                  </td>
                  {comparedItems.map((item) => (
                    <td key={item.id} className="py-2.5 px-3">
                      {item.variants
                        .map((v) => `${v.label} (${v.availabilityStatus})`)
                        .join(', ')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-slate-500">
                    Ingredients
                  </td>
                  {comparedItems.map((item) => (
                    <td key={item.id} className="py-2.5 px-3">
                      {item.keyIngredients.length > 0
                        ? item.keyIngredients.join(', ')
                        : 'Not officially documented'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-slate-500">
                    Summary
                  </td>
                  {comparedItems.map((item) => (
                    <td key={item.id} className="py-2.5 px-3">
                      {item.shortDescription || 'Not officially documented'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 tabular-nums">
        <span>
          Showing {filteredAndSortedCatalog.length}{' '}
          {filteredAndSortedCatalog.length === 1 ? 'product' : 'products'}
          {categoryFilter !== 'All' ? ` in ${categoryFilter}` : ''}
        </span>
        {(searchQuery ||
          categoryFilter !== 'All' ||
          availabilityFilter !== 'All') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('All');
              setAvailabilityFilter('All');
            }}
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredAndSortedCatalog.length === 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <Compass className="mx-auto h-7 w-7 text-slate-400" />
          <h3 className="mt-3 font-display text-base font-semibold text-slate-900">
            No catalogue products match your filters
          </h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
            Try clearing your filters or add the product manually to track it in
            My Products right away.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('All');
                setAvailabilityFilter('All');
              }}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={onAddManualProduct}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Product Manually</span>
            </button>
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedCatalog.map((item) => {
            const isCompared = compareIds.includes(item.id);
            const tracked = isAlreadyTracked(item);
            const variantMeta = formatVariantSummary(item.variants);
            const isVerifiedListing =
              item.availabilityStatus !== 'Availability not verified';

            return (
              <article
                key={item.id}
                className="flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-slate-300"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setSelectedCatalogId(item.id)}
                    className="block w-full border-b border-slate-100 bg-white text-left focus:outline-none"
                  >
                    <CatalogImage
                      imageUrl={item.imageUrl}
                      name={item.name}
                      category={item.category}
                    />
                  </button>

                  <div className="p-5">
                    <p className="text-xs text-slate-500">
                      {item.category}
                      {item.subcategory && item.subcategory !== item.category
                        ? ` · ${item.subcategory}`
                        : ''}
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelectedCatalogId(item.id)}
                      className="mt-1 block text-left font-display text-base font-semibold text-slate-900 hover:text-blue-700 transition-colors"
                    >
                      {item.name}
                    </button>

                    <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs tabular-nums text-slate-500">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium ${getAvailabilityBadgeClass(
                          item.availabilityStatus
                        )}`}
                      >
                        {isVerifiedListing ? (
                          <ShieldCheck className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        <span>{item.availabilityStatus}</span>
                      </span>
                      <span className="text-slate-500">{variantMeta}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-5 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedCatalogId(item.id)}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleCompare(item.id)}
                      className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                        isCompared
                          ? 'border-blue-300 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {isCompared ? 'Comparing' : 'Compare'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTrackProduct(item)}
                    disabled={tracked}
                    className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      tracked
                        ? 'border border-slate-200 bg-slate-50 text-slate-500 cursor-default'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {tracked ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-blue-600" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add to My Products</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};
