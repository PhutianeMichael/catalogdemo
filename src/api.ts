import type { Product } from './models/product.model';

// Use Vite env variable if provided, fall back to localhost:4001
const DEFAULT_API_BASE = 'http://localhost:4001';
const API_BASE = (typeof import.meta !== 'undefined' && (import.meta as never)?.['env']?.['VITE_API_BASE']) ? (import.meta as never)?.['env']?.['VITE_API_BASE'] : DEFAULT_API_BASE;
const PRODUCTS_URL = `${API_BASE}/products`;
const CATEGORIES_URL = `${API_BASE}/categories`;

/**
 * Check a fetch Response and throw a helpful Error containing status and body (if any).
 * This is async because reading the response body may be necessary to surface server error details.
 */
const checkResponse = async (response: Response) => {
    if (!response.ok) {
        let bodyText = '';
        try {
            bodyText = await response.text();
        } catch (e) {
            // ignore
        }
        const message = bodyText ? `${response.status} ${response.statusText}: ${bodyText}` : `${response.status} ${response.statusText}`;
        throw new Error(message);
    }
};

/** Options for fetching products (pagination, search, filters) */
export type FetchOptions = {
    page?: number;
    limit?: number;
    searchTerm?: string; // maps to json-server `q`
    sort?: string; // field to sort by (maps to _sort)
    order?: 'asc' | 'desc';
    filters?: Record<string, string | number | boolean>;
};

/** Result returned when requesting a paginated product list */
export type PaginatedResult = {
    items: Product[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
};

// Overloads: no args -> raw Product[] (backwards compatible)
export async function fetchProducts(): Promise<Product[]>;
export async function fetchProducts(options: FetchOptions, init?: { signal?: AbortSignal }): Promise<PaginatedResult>;
export async function fetchProducts(options?: FetchOptions, init?: { signal?: AbortSignal }) {
    // Build URL and query params
    const url = new URL(PRODUCTS_URL);

    if (options) {
        const { page, limit, searchTerm, sort, order, filters } = options;
        if (typeof page === 'number' && page > 0) url.searchParams.set('_page', String(page));
        if (typeof limit === 'number' && limit > 0) url.searchParams.set('_limit', String(limit));
        if (searchTerm) url.searchParams.set('q', searchTerm);
        if (sort) url.searchParams.set('_sort', sort);
        if (order) url.searchParams.set('_order', order);
        if (filters) {
            Object.entries(filters).forEach(([k, v]) => {
                url.searchParams.set(k, String(v));
            });
        }
    }

    const response = await fetch(url.toString(), { signal: init?.signal });
    await checkResponse(response);

    const items: Product[] = await response.json();

    // If options were provided, always return a PaginatedResult (consistent runtime behavior)
    if (options) {
        const totalHeader = response.headers.get('x-total-count');
        const total = totalHeader ? Number(totalHeader) : items.length;
        const limitVal = options.limit && options.limit > 0 ? options.limit : items.length || 1;
        const pageVal = options.page && options.page > 0 ? options.page : 1;
        const totalPages = Math.max(1, Math.ceil(total / limitVal));

        const result: PaginatedResult = {
            items,
            total,
            totalPages,
            page: pageVal,
            limit: limitVal,
        };

        return result;
    }

    // Backwards-compatible return: raw array
    return items;
}

/**
 * Search products with optional paging. Returns PaginatedResult when page/limit provided (or when called via searchProducts).
 */
export const searchProducts = async (searchTerm: string, page?: number, limit?: number, init?: { signal?: AbortSignal }) => {
    const opts: FetchOptions = { searchTerm };
    if (typeof page === 'number') opts.page = page;
    if (typeof limit === 'number') opts.limit = limit;

    return fetchProducts(opts, init);
};

/**
 * Fetch a single product by id.
 * @param id resource id
 */
export const fetchProductById = async (id: string, init?: { signal?: AbortSignal }): Promise<Product> => {
    const response = await fetch(`${PRODUCTS_URL}/${id}`, { signal: init?.signal });
    await checkResponse(response);

    return response.json();
};

export const fetchProductCategories = async (init?: { signal?: AbortSignal }): Promise<string[]> => {
    const response = await fetch(CATEGORIES_URL, { signal: init?.signal });
    await checkResponse(response);
    const json = await response.json();
    // support either array of strings or array of objects
    if (!json) return [];
    if (Array.isArray(json) && json.every(i => typeof i === 'string')) {
        return json.map(s => String(s).trim()).filter(Boolean).sort((a,b)=>a.localeCompare(b));
    }
    if (Array.isArray(json) && json.every(i => typeof i === 'object' && i !== null)) {
        const names = json.map((o: any) => o.name ?? o.title ?? o.id).filter(Boolean).map(String).map(s => s.trim());
        return [...new Set(names)].sort((a,b)=>a.localeCompare(b));
    }

    // Fallback: try to coerce to array of strings
    try {
        const coerced = Array.from(json).map((x: any) => String(x).trim()).filter(Boolean);
        return [...new Set(coerced)].sort((a,b)=>a.localeCompare(b));
    } catch (e) {
        return [];
    }
}

/**
 * Create a new product. Returns the created Product from the server.
 */
export const createProduct = async (product: Partial<Product>, init?: { signal?: AbortSignal }): Promise<Product> => {
    const response = await fetch(PRODUCTS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
        signal: init?.signal,
    });
    await checkResponse(response);

    return response.json();
};

/**
 * Partially update a product (PATCH). Returns the updated Product from the server.
 */
export const updateProduct = async (id: string, product: Partial<Product>, init?: { signal?: AbortSignal }): Promise<Product> => {
    const response = await fetch(`${PRODUCTS_URL}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
        signal: init?.signal,
    });
    await checkResponse(response);

    return response.json();
};

/**
 * Delete a product by id. Returns true on success.
 */
export const deleteProduct = async (id: string, init?: { signal?: AbortSignal }): Promise<boolean> => {
    const response = await fetch(`${PRODUCTS_URL}/${id}`, {
        method: 'DELETE',
        signal: init?.signal,
    });
    await checkResponse(response);
    return response.status >= 200 && response.status < 300;
};
