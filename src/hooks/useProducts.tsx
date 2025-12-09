import { useEffect, useState, useCallback, useMemo } from 'react';
import { fetchProducts, type PaginatedResult, type FetchOptions } from '../api';
import type { Product } from '../models/product.model';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [retryToken, setRetryToken] = useState(0);

    // Search / sort / filters / pagination state
    const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
    const [sortField, setSortField] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<'asc'|'desc'>('asc');
    const [filters, setFilters] = useState<Record<string,string|number|boolean>>({});
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(30);

    const [total, setTotal] = useState<number | null>(null);
    const [totalPages, setTotalPages] = useState<number | null>(null);

    const handleRetryWrapper = () => setRetryToken(t => t + 1);

    const handleSetProductWrapper = (product: Product) => {
        setProducts(prev => prev.some(p => p.id === product.id) ? prev : [product, ...prev]);
    };

    const setErrorWrapper = (err: string | null) => setError(err);

    const setEditProductWrapper = (product: Product) => {
        setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    };

    const setDeleteProductWrapper = (productId: number) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
    };

    const updateFilter = useCallback((key: string, value: string|number|boolean|null) => {
        setFilters(prev => {
            const next = { ...prev };
            if (value === null || value === undefined || value === '') delete next[key];
            else next[key] = value;
            return next;
        });
    }, []);

    const clearFilters = useCallback(() => setFilters({}), []);

    const filtersKey = useMemo(() => {
        const ordered: Record<string, string | number | boolean> = {};
        Object.keys(filters).sort().forEach((k) => { ordered[k] = filters[k]; });
        return JSON.stringify(ordered);
    }, [filters]);

    // reset page when search or filters change
    useEffect(() => { setPage(1); }, [searchTerm, filtersKey, sortField, sortOrder]);

    // The effect depends on `filters` (search/sort/filters changes should re-run the request).
    useEffect(() => {
        const ac = new AbortController();
        let mounted = true;
        setLoading(true);
        setError(null);

        const opts: FetchOptions = { page, limit, searchTerm, sort: sortField, order: sortOrder, filters };

        (async () => {
            try {
                const res = await fetchProducts(opts, { signal: ac.signal }) as PaginatedResult;
                if (!mounted) return;
                // If we're on the first page, replace products (new search/filters). If loading a later
                // page (infinite scroll), append the new items to the existing list so the UI can scroll back up.
                setProducts(prev => page && page > 1 ? [...prev, ...res.items] : res.items);
                setTotal(res.total);
                setTotalPages(res.totalPages);
            } catch (err: unknown) {
                if (!mounted) return;
                const maybe = err as { name?: string };
                if (maybe?.name === 'AbortError') return;
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; ac.abort(); };
    }, [retryToken, page, limit, searchTerm, sortField, sortOrder, filters]);

    return {
        products, loading, error,
        // pagination
        page, setPage, limit, setLimit, total, totalPages,
        // search/sort/filters
        searchTerm, setSearchTerm, sortField, setSortField, sortOrder, setSortOrder,
        filters, updateFilter, clearFilters,
        // wrappers
        handleRetryWrapper, handleSetProductWrapper, setErrorWrapper, setEditProductWrapper, setDeleteProductWrapper
    };
};
