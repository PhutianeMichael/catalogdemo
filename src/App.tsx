import './App.css'
import type { Cart, CartItem, Favorite, Product, Saved, Wishlist } from './models/product.model';
import { useProducts } from './hooks/useProducts.tsx';
import { useEffect, useState } from 'react';
import { ProductListCTA } from './components/ProductListCTA.tsx';
import { ProductLoadError } from './components/ProductLoadError.tsx';
import { ProductList } from './components/ProductList.tsx';
import { Route, Routes } from 'react-router-dom';
import { ProductDetails } from './components/ProductDetails.tsx';
import { loadJSON, saveJSON } from './utils/storage';
import { fetchProductCategories } from './api';
import { Navigation } from './components/Navigation.tsx';
import { CartPage } from './components/Cart.tsx';
import { WishlistPage } from './components/Wishlist.tsx';

export const userId = 'sdf12312asdas';

function App() {
    const {
        products,
        loading,
        searchTerm,
        error,
        sortField,
        sortOrder,
        handleRetryWrapper,
        setSearchTerm,
        setSortField,
        setSortOrder,
        updateFilter,
        filters,
        page,
        setPage,
        totalPages,
    } = useProducts();
    const [localSearch, setLocalSearch] = useState<string | undefined>(searchTerm ?? '');
    const [favorite, setFavorite] = useState<Favorite>(() => loadJSON<Favorite>('favorites') ?? {userId: userId, items: []} as Favorite);
    const [wishlist, setWishlist] = useState<Wishlist>(() => loadJSON<Wishlist>('wishlist') ?? {userId: userId, items: []} as Wishlist);
    const [isOpenCart, setIsOpenCart] = useState<boolean>(false);
    const [cart, setCart] = useState<Cart>({userId: 'sdf12312asdas', items: [] as CartItem[], totalCount: 0} as Cart);
    const [save, setSave] = useState<Saved>(() => loadJSON<Saved>('saved') ?? {userId: userId, items: []} as Saved);
    const [categories, setCategories] = useState<string[]>([]);

    // load categories from API on mount; fallback to deriving from products is below
    useEffect(() => {
        let mounted = true;
        const ac = new AbortController();
        (async () => {
            try {
                const cats = await fetchProductCategories({ signal: ac.signal });
                if (mounted && cats && cats.length > 0) setCategories(cats);
            } catch (e) {
                // ignore — fallback below will derive categories from products
                // console.warn('Failed to load categories', e);
            }
        })();
        return () => { mounted = false; ac.abort(); };
    }, []);

    // persist favorites/wishlist/saved to localStorage
    useEffect(() => { saveJSON('favorites', favorite); }, [favorite]);
    useEffect(() => { saveJSON('wishlist', wishlist); }, [wishlist]);
    useEffect(() => { saveJSON('saved', save); }, [save]);

    const handleOpenCart = (isOpen: boolean) => {
        setIsOpenCart(isOpen);
    }
    const handleAddToCart = (product: Product) => {
        setCart((prevCart: Cart): Cart => {
            const items = prevCart.items ?? [];
            const exists = items.findIndex(i => i.item.id === product.id);
            const newItems = exists >= 0
                ? items.map(i => i.item.id === product.id ? {...i, quantity: i.quantity + 1} : i)
                : [...items, {item: product, quantity: 1}];

            const totalCount = newItems.reduce((acc, item) => acc + item.quantity, 0);

            return {
                ...prevCart,
                items: newItems,
                totalCount,
            };
        });
    }

    const incrementCartItem = (productId: number) => {
        setCart((prevCart: Cart): Cart => {
            const items = prevCart.items ?? [];
            const idx = items.findIndex(i => i.item.id === productId);
            if (idx === -1) return prevCart;
            const newItems = items.map((ci, i) => i === idx ? {...ci, quantity: ci.quantity + 1} : ci);
            const totalCount = newItems.reduce((acc, item) => acc + item.quantity, 0);
            return {...prevCart, items: newItems, totalCount};
        });
    };

    const decrementCartItem = (productId: number) => {
        setCart((prevCart: Cart): Cart => {
            const items = prevCart.items ?? [];
            const idx = items.findIndex(i => i.item.id === productId);
            if (idx === -1) return prevCart;
            const target = items[idx];
            let newItems: CartItem[];
            if (target.quantity > 1) {
                newItems = items.map((ci, i) => i === idx ? {...ci, quantity: ci.quantity - 1} : ci);
            } else {
                newItems = items.filter((_, i) => i !== idx);
            }
            const totalCount = newItems.reduce((acc, item) => acc + item.quantity, 0);
            return {...prevCart, items: newItems, totalCount};
        });
    };


    const handleClearCart = () => {
        setCart((prevCart: Cart): Cart => ({...prevCart, items: [], totalCount: 0}));
    };

    const handleRemoveFromWishlist = (product: Product) => {
        setWishlist((prevCart: Wishlist): Wishlist => {
            const exist = prevCart.items.indexOf(product);
            if (exist === -1) return {...prevCart as Wishlist}

            return ({
                ...prevCart,
                items: [...prevCart.items.filter(i => i.id !== product.id)]
            })
        });
    };

    const handleClearWishlist = () => {
        setWishlist((prevSaved): Saved => ({...prevSaved, items: []}));
    }

    const handleToggleFavorite = (product: Product, _value: boolean) => {
        console.log('isFavorite: ', _value);
        setFavorite((prevState): Favorite => {
            const items = prevState?.items ?? [];
            const newItems = _value
                ? (items.some(p => p.id === product.id) ? items : [...items, product])
                : items.filter(p => p.id !== product.id);
            return {
                items: newItems,
                userId: prevState?.userId ?? userId,
            };
        });
    }

    const handleToggleWishlist = (product: Product, _value: boolean) => {
        console.log('isWishlist: ', _value);
        setWishlist((prevState): Wishlist => {
            const items = prevState?.items ?? [];
            const newItems = _value
                ? (items.some(p => p.id === product.id) ? items : [...items, product])
                : items.filter(p => p.id !== product.id);
            return {
                items: newItems,
                userId: prevState?.userId ?? userId,
            };
        });
    }

    const handleToggleSaved = (product: Product, _value: boolean) => {
        console.log('isSaved: ', _value);
        setSave((prevState): Saved => {
            const items = prevState?.items ?? [];
            const newItems = _value
                ? (items.some(p => p.id === product.id) ? items : [...items, product])
                : items.filter(p => p.id !== product.id);
            return {
                items: newItems,
                userId: prevState?.userId ?? userId,
            };
        });
    }

    if (loading && products.length <= 0) {
        return <h3 className="text-center my-5">Loading...</h3>;
    }

    return (
        <>
            {error && products.length === 0 ? (
                <ProductLoadError error={error} handleRetryWrapper={handleRetryWrapper}/>
            ) : null}

            <Navigation openCart={handleOpenCart} cartItemCount={cart.totalCount ?? 0}
                        wishlistCount={save.items.length ?? 0}/>

            {isOpenCart && (
                <div>
                    <p>In Cart</p>
                </div>
            )}

            <Routes>
                <Route
                    path="/"
                    element={
                        <main className="container py-4">
                            {/* Header: search, category filter, sort */}
                            <div className="row mb-3 g-2 align-items-center">
                                <ProductListCTA
                                    categories={categories}
                                    selectedCategory={filters?.category == null ? '' : String(filters?.category)}
                                    localSearch={localSearch}
                                    sortField={sortField}
                                    sortOrder={sortOrder}
                                    setSearchTerm={setSearchTerm}
                                    setSortOrder={setSortOrder}
                                    setLocalSearch={setLocalSearch}
                                    updateFilter={updateFilter}
                                    setSortField={setSortField}
                                />
                            </div>

                            <div className="row justify-content-center g-3">
                                <ProductList
                                    products={products}
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
                                    page={page}
                                    setPage={setPage}
                                    totalPages={totalPages}
                                    loading={loading}
                                />
                            </div>
                        </main>
                    }
                />

                <Route
                    path="/product/:id"
                    element={<ProductDetails cart={cart} addToCart={handleAddToCart}
                                             incrementCartItem={incrementCartItem} decrementCartItem={decrementCartItem}
                                             save={save} handleToggleSaved={handleToggleSaved} favorite={favorite}
                                             handleToggleFavorite={handleToggleFavorite}
                                             handleToggleWishlist={handleToggleWishlist}/>}
                />

                <Route
                    path="/wishlist"
                    element={<WishlistPage wishlist={wishlist} onRemove={handleRemoveFromWishlist} onAddToCart={handleAddToCart}
                                           clearWishlist={handleClearWishlist}/>}
                />

                <Route
                    path="/cart"
                    element={<CartPage cart={cart} increment={incrementCartItem} decrement={decrementCartItem}
                                       clearCart={handleClearCart}/>}
                />
            </Routes>
        </>
    );
}

export default App
