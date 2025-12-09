import React, { useEffect, useRef } from 'react';
import type { Product, Cart, Favorite, Saved, Wishlist } from '../models/product.model';
import { ProductListItem } from './ProductListItem';

interface ProductListProps {
    products: Product[];
    handleAddToCart: (product: Product) => void;
    favorite?: Favorite;
    save?: Saved;
    wishlist?: Wishlist;
    handleToggleFavorite?: (product: Product, value: boolean) => void;
    handleToggleSaved?: (product: Product, value: boolean) => void;
    handleToggleWishlist?: (product: Product, value: boolean) => void;
    cart?: Cart;
    incrementCartItem?: (productId: number) => void;
    decrementCartItem?: (productId: number) => void;
    // pagination / infinite scroll
    page?: number;
    setPage?: (n: number) => void;
    totalPages?: number | null;
    loading?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({ products, handleAddToCart, handleToggleSaved, handleToggleWishlist, favorite, save, wishlist, handleToggleFavorite, cart, incrementCartItem, decrementCartItem, page = 1, setPage, totalPages = null, loading = false }) => {
    const loadingRef = useRef<boolean>(loading);
    useEffect(() => { loadingRef.current = loading; }, [loading]);

    useEffect(() => {
        if (typeof setPage !== 'function') return;
        const onScroll = () => {
            // don't attempt to load more while currently loading
            if (loadingRef.current) return;
            // if totalPages known and we've reached it, do nothing
            if (typeof totalPages === 'number' && page >= (totalPages ?? 0)) return;
            const threshold = 300; // px from bottom
            const scrolledToBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - threshold);
            if (scrolledToBottom) {
                setPage(page + 1);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [page, setPage, totalPages, loading]);

    return (
        <>
            {products.map(product => (
                <ProductListItem
                    key={product.id}
                    product={product}
                    handleAddToCart={handleAddToCart}
                    favorite={favorite}
                    save={save}
                    wishlist={wishlist}
                    handleToggleFavorite={handleToggleFavorite}
                    handleToggleSaved={handleToggleSaved}
                    handleToggleWishlist={handleToggleWishlist}
                    cart={cart}
                    incrementCartItem={incrementCartItem}
                    decrementCartItem={decrementCartItem}

                />
            ))}

            <div className="w-100 d-flex justify-content-center" aria-live="polite">
                {loading && page > 1 ? (
                    <div className="my-3">
                        <div className="spinner-border" role="status" aria-hidden></div>
                        <span className="visually-hidden">Loading more products...</span>
                    </div>
                ) : (

                    (typeof setPage === 'function' && (totalPages === null || page < (totalPages ?? 0))) ? (
                        <div className="my-3">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setPage(page + 1)}
                                disabled={loading}
                                aria-label="Load more products"
                            >
                                Load more
                            </button>
                        </div>
                    ) : null
                )}
            </div>
        </>
    );
};

// Note: no default export, use named import { ProductList }
