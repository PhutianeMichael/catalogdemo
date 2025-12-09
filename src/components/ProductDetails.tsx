import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Product, Cart, Favorite, Saved, Wishlist } from '../models/product.model';
import { fetchProductById } from '../api';
import { BsArrowLeft, BsHeart, BsHeartFill } from 'react-icons/bs';

interface ProductDetailsProps {
    cart?: Cart;
    favorite?: Favorite;
    save?: Saved;
    wishlist?: Wishlist;
    addToCart?: (product: Product) => void;
    handleToggleFavorite?: (product: Product, value: boolean) => void;
    handleToggleSaved?: (product: Product, value: boolean) => void;
    handleToggleWishlist?: (product: Product, value: boolean) => void;
    incrementCartItem?: (productId: number) => void;
    decrementCartItem?: (productId: number) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ cart, addToCart, favorite,save, wishlist, incrementCartItem, handleToggleFavorite, handleToggleSaved, handleToggleWishlist, decrementCartItem }) => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    // main image shown in the large view and selected thumbnail index
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

    const isControlled = typeof favorite !== 'undefined';
    const isSaveControlled = typeof save !== 'undefined';
    const isWishlistControlled = typeof wishlist !== 'undefined';

    const [internalFavorited, setInternalFavorited] = useState<boolean>(() => Boolean(favorite?.items?.some(p => p.id === Number(id))));
    const [internalSaved, setInternalSaved] = useState<boolean>(() => Boolean(save?.items?.some(p => p.id === Number(id))));
    const [internalWishlist, setInternalWishlist] = useState<boolean>(() => Boolean(wishlist?.items?.some(p => p.id === Number(id))));

    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();
        const load = async () => {
            if (!id) {
                if (mounted) setError('No product id provided');
                if (mounted) setLoading(false);
                return;
            }

            if (mounted) setLoading(true);
            if (mounted) setError(null);

            try {
                const p = await fetchProductById(id, { signal: controller.signal });
                if (mounted) setProduct(p);
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                if (mounted) setError(msg ?? 'Failed to load product');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();

        return () => {
            mounted = false;
            controller.abort();
        };
    }, [id]);

    // initialize mainImage when product is loaded
    useEffect(() => {
        if (!product) return;
        const initial = product.imageUrl ?? (product.images && product.images.length > 0 ? product.images[0] : null);
        setMainImage(initial);
        setSelectedImageIndex(0);
    }, [product]);

    useEffect(() => {
        if (!isControlled) return;
        const shouldBe = Boolean(favorite?.items?.some(p => p.id === product?.id));
        if (internalFavorited === shouldBe) return;
        setInternalFavorited(shouldBe);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [favorite, product]);

    useEffect(() => {
        if (!isWishlistControlled) return;
        const shouldBe = Boolean(wishlist?.items?.some(p => p.id === product?.id));
        if (internalWishlist === shouldBe) return;
        setInternalWishlist(shouldBe);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wishlist, product]);

    const favorited = isControlled ? Boolean(favorite?.items?.some(p => p.id === product?.id)) : internalFavorited;
    const saved = isSaveControlled ? Boolean(save?.items?.some(p => p.id === product?.id)) : internalSaved;
    const wishlisted = isWishlistControlled ? Boolean(wishlist?.items?.some(p => p.id === product?.id)) : internalWishlist;

    const toggleFavorite = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const next = !favorited;
        if (!isControlled) setInternalFavorited(next);
        if (handleToggleFavorite) {
            handleToggleFavorite(product as Product, next);
        }
    };

    const toggleWishlist = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const next = !wishlisted;
        if (!isWishlistControlled) setInternalWishlist(next);
        if (handleToggleWishlist) {
            handleToggleWishlist(product as Product, next);
        }
    };

    const toggleSaved = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const next = !saved;
        if (!isSaveControlled) setInternalSaved(next);
        if(handleToggleSaved) {
            handleToggleSaved(product as Product, next);
        }
    };

    if (loading) return <div className="container py-4"><h3>Loading product...</h3></div>;
    if (error) return <div className="container py-4"><h3>Error</h3><p>{error}</p><p><Link to="/">Back to catalog</Link></p></div>;
    if (!product) return <div className="container py-4"><h3>Product not found</h3><p><Link to="/">Back to catalog</Link></p></div>;

    return (
        <main className="container py-4">
            <div className="row">
                <div className="col-md-6">
                    {/* Main image wrapper with fixed height to prevent layout shifts when switching images */}
                    <div style={{ width: '100%', height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', position: 'relative' }}>
                        {/* Back arrow top-left over image */}
                        <Link to="/" aria-label="Back to catalog" className="btn btn-sm btn-light position-absolute" style={{ top: 8, left: 8, zIndex: 5, boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
                            <BsArrowLeft size={18} aria-hidden />
                        </Link>

                        {/* Favorite button moved into main image wrapper and class toggling fixed */}
                        <button
                            type="button"
                            className={`btn btn-sm favorite-btn ${favorited ? 'btn-outline-danger' : 'btn-light'} position-absolute`}
                            style={{ top: 8, right: 8, zIndex: 5, boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
                            aria-pressed={favorited}
                            aria-label={favorited ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
                            onClick={toggleFavorite}
                        >
                            {favorited ? (
                                <BsHeartFill className='text-danger' size={16} aria-hidden />
                            ) : (
                                <BsHeart size={16} aria-hidden />
                            )}
                        </button>

                        <img
                            src={mainImage ?? '/placeholder.png'}
                            alt={product.name}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                    </div>
                    {product.images && product.images.length > 0 ? (
                        <div className="mt-3 d-flex gap-2 flex-wrap">
                            {product.images.map((src, idx) => (
                                <img
                                    key={src}
                                    src={src}
                                    alt={`${product.name} ${idx + 1}`}
                                    onClick={() => { setMainImage(src); setSelectedImageIndex(idx); }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setMainImage(src);
                                            setSelectedImageIndex(idx);
                                        }
                                    }}
                                    tabIndex={0}
                                    loading="lazy"
                                    role="button"
                                    aria-pressed={selectedImageIndex === idx}
                                    style={{ width: 80, height: 80, objectFit: 'cover', cursor: 'pointer', border: selectedImageIndex === idx ? '2px solid #0d6efd' : '1px solid #ddd' }}
                                />
                            ))}
                        </div>
                    ) : null}
                </div>

                <div className="col-md-6">
                    <h1>{product.name}</h1>
                    <p className="lead">{product.description}</p>
                    <p><strong>Price:</strong> {product.price} {product.currency}</p>
                    <p><strong>Category:</strong> {product.category}</p>
                    {product.brand && <p><strong>Brand:</strong> {product.brand}</p>}

                    <p>
                        <strong>Availability:</strong>{' '}
                        {product.inStock ? (product.availabilityStatus ?? 'In stock') : 'Out of stock'}
                        {product.stock !== undefined && product.stock !== null ? ` (stock: ${product.stock})` : ''}
                    </p>

                    {product.rating !== undefined && (
                        <p><strong>Rating:</strong> {product.rating} / 5 ({product.reviewCount ?? 0} reviews)</p>
                    )}

                    {product.warrantyInformation && <p><strong>Warranty:</strong> {product.warrantyInformation}</p>}
                    {product.shippingInformation && <p><strong>Shipping:</strong> {product.shippingInformation}</p>}

                    <div className="d-flex mt-3 gap-4 justify-content-space-between" onPointerDownCapture={(e) => e.stopPropagation()}>
                        {product && (() => {
                            const cartItem = cart?.items?.find(ci => ci.item.id === product.id);
                            const qty = cartItem?.quantity ?? 0;
                            if (qty > 0) {
                                const isAtStock = product.stock !== undefined && product.stock !== null ? qty >= product.stock : false;
                                return (
                                    <div className="d-flex align-items-center justify-content-center" role="group" aria-label="Cart quantity controls">
                                        <button
                                            type="button"
                                            className="btn btn-primary d-block"
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onClick={(e) => { e.stopPropagation(); if (decrementCartItem) decrementCartItem(product.id); }}
                                            aria-label={`Decrease quantity of ${product.name}`}
                                        >
                                            -
                                        </button>
                                        <span className="mx-2">{qty}</span>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onClick={(e) => { e.stopPropagation(); if (incrementCartItem) incrementCartItem(product.id); }}
                                            aria-label={`Increase quantity of ${product.name}`}
                                            disabled={isAtStock}
                                        >
                                            +
                                        </button>
                                    </div>
                                );
                            }

                            return (
                                <button
                                    type="button"
                                    className="btn btn-primary d-block"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => { e.stopPropagation(); if (addToCart && product) addToCart(product); }}
                                    aria-label={`Add ${product.name} to cart`}
                                    disabled={!product.inStock || (product.stock !== undefined && product.stock <= 0)}
                                >
                                    Add to cart
                                </button>
                            );
                        })()}

                        {/* Buttons: add to wishlist and save (favorite) - do not navigate away */}
                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary d-block"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={toggleWishlist}
                                aria-pressed={wishlisted}
                                aria-label={wishlisted ? `Added ${product?.name} to wishlist` : `Add ${product?.name} to wishlist`}
                            >
                                {wishlisted ? ' Remove from wishlist' : ' Add to wishlist'}
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary d-block"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={toggleSaved}
                                aria-pressed={saved}
                                aria-label={saved ? `Saved ${product?.name}` : `Save ${product?.name}`}
                            >
                                {saved ? 'Saved' : 'Save'}
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </main>
    );
};
