import React, { type SyntheticEvent, useEffect, useState } from 'react';
import type { Cart, Favorite, Product, Saved, Wishlist } from '../models/product.model';
import { BsHeart, BsHeartFill, BsPlusLg } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { GrSubtract } from 'react-icons/gr';

interface ProductListItemProps {
    product: Product;
    handleAddToCart: (product: Product) => void;
    // optional: controlled favorite state and toggle handler
    favorite?: Favorite;
    save?: Saved;
    wishlist?: Wishlist;
    handleToggleFavorite?: (product: Product, value: boolean) => void;
    handleToggleSaved?: (product: Product, value: boolean) => void;
    handleToggleWishlist?: (product: Product, value: boolean) => void;
    // cart and handlers for inline quantity controls
    cart?: Cart;
    incrementCartItem?: (productId: number) => void;
    decrementCartItem?: (productId: number) => void;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({
                                                                    product,
                                                                    handleAddToCart,
                                                                    favorite,
                                                                    save,
                                                                    wishlist,
                                                                    handleToggleFavorite,
                                                                    handleToggleSaved,
                                                                    handleToggleWishlist,
                                                                    cart,
                                                                    incrementCartItem,
                                                                    decrementCartItem,
                                                                }) => {
    const navigate = useNavigate();
    // consider component "controlled" when an isFavorite prop (Favorite) is provided
    const isControlled = typeof favorite !== 'undefined';
    const isWishlistControlled = typeof wishlist !== 'undefined';
    const isSavedControlled = typeof save !== 'undefined';

    const [internalFavorited, setInternalFavorited] = useState<boolean>(() => Boolean(favorite?.items?.some(p => p.id === product.id)));
    const [internalSaved, setInternalSaved] = useState<boolean>(() => Boolean(save?.items?.some(p => p.id === product.id)));
    const [internalWishlisted, setInternalWishlisted] = useState<boolean>(() => Boolean(wishlist?.items?.some(p => p.id === product.id)));

    useEffect(() => {
        if (!isControlled) return;
        const shouldBe = Boolean(favorite?.items?.some(p => p.id === product.id));
        if (internalFavorited === shouldBe) return;
        setInternalFavorited(shouldBe);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [favorite]);

    useEffect(() => {
        if (!isWishlistControlled) return;
        const shouldBe = Boolean(wishlist?.items?.some(p => p.id === product.id));
        if (internalWishlisted === shouldBe) return;
        setInternalWishlisted(shouldBe);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wishlist]);

    useEffect(() => {
        if (!isSavedControlled) return;
        const shouldBe = Boolean(save?.items?.some(p => p.id === product.id));
        if (internalSaved === shouldBe) return;
        setInternalSaved(shouldBe);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [save]);

    const favorited = isControlled ? Boolean(favorite?.items?.some(p => p.id === product.id)) : internalFavorited;
    const saved = isSavedControlled ? Boolean(save?.items?.some(p => p.id === product.id)) : internalSaved;
    const wishlisted = isWishlistControlled ? Boolean(wishlist?.items?.some(p => p.id === product.id)) : internalWishlisted;

    const [animating, setAnimating] = useState(false);

    const toggleFavorite = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const next = !favorited;
        if (!isControlled) setInternalFavorited(next);
        if (handleToggleFavorite) {
            handleToggleFavorite(product, next);
        }
        setAnimating(true);
    };

    const toggleSaved = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const next = !saved;
        if (!isSavedControlled) setInternalSaved(next);
        if (handleToggleSaved) {
            handleToggleSaved(product, next);
        }
        setAnimating(true);
    };

    const toggleWishlist = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const next = !wishlisted;
        if (!isWishlistControlled) setInternalWishlisted(next);
        if (handleToggleWishlist) {
            handleToggleWishlist(product, next);
        }
        setAnimating(true);
    };

    const onCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    const onCardKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate(`/product/${product.id}`);
        }
    };

    const availabilityLabel = (() => {
        if (product.inStock === false) return {text: 'Out of stock', cls: 'badge bg-secondary'};
        if (product.stock !== undefined && product.stock !== null && product.stock <= 2) return {
            text: product.availabilityStatus ?? 'Low stock',
            cls: 'badge bg-warning text-dark',
        };
        return {text: product.availabilityStatus ?? 'In stock', cls: 'badge bg-success'};
    })();

    const cartItem = cart?.items?.find(ci => ci.item.id === product.id);
    const qty = cartItem?.quantity ?? 0;
    const isAtStock = product.stock !== undefined && product.stock !== null ? qty >= product.stock : false;

    return (
        <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch">
            <div
                className="card w-100 h-100"
                role="button"
                tabIndex={0}
                onClick={onCardClick}
                onKeyDown={onCardKeyDown}
                aria-label={`Open details for ${product.name}`}
            >
                <div className="position-relative">
                    <Link to={`/product/${product.id}`} aria-label={`View details for ${product.name}`}
                          onClick={(e) => e.stopPropagation()}>
                        <img
                            src={product.imageUrl ?? '/placeholder.png'}
                            onError={(e: SyntheticEvent<HTMLImageElement>) => {
                                const img = e.currentTarget;
                                img.src = '/placeholder.png';
                            }}
                            className="card-img-top img-fluid card-image"
                            alt={product.imageUrl ? product.name : `Image not available for ${product.name}`}
                            loading="lazy"
                        />
                    </Link>

                    <span className={`position-absolute top-0 start-0 m-2 ${availabilityLabel.cls}`}
                          aria-hidden>{availabilityLabel.text}</span>

                    <button
                        type="button"
                        className={`btn btn-sm favorite-btn ${favorited ? 'btn-outline-danger' : 'btn-light'} position-absolute top-0 end-0 m-2 shadow-sm d-flex align-items-center justify-content-center ${animating ? 'heart-anim' : ''}`}
                        aria-pressed={favorited}
                        aria-label={favorited ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
                        onClick={toggleFavorite}
                        onAnimationEnd={() => setAnimating(false)}
                    >
                        {favorited ? (
                            <BsHeartFill className="text-danger" size={16} aria-hidden/>
                        ) : (
                            <BsHeart size={16} aria-hidden/>
                        )}
                    </button>
                </div>

                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text text-truncate">{product.description}</p>
                    <ul className="list-group list-group-flush mt-auto">
                        <li className="list-group-item"><strong>Category:</strong> {product.category}</li>
                        {product.brand && <li className="list-group-item"><strong>Brand:</strong> {product.brand}</li>}
                        <li className="list-group-item"><strong>Price:</strong> {product.price} {product.currency}</li>
                    </ul>
                </div>
                <div
                    className="row card-footer bg-transparent border-top-0 d-flex justify-content-between align-items-center"
                >
                    {qty > 0 ? (
                        <div className="d-flex align-items-center justify-content-start" role="group"
                             aria-label="Cart quantity controls">
                            <button
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (decrementCartItem) decrementCartItem(product.id);
                                }}
                                type="button"
                                className="col-3 btn btn-primary"
                                aria-label={`Decrease quantity of ${product.name}`}
                            >
                                <GrSubtract />
                            </button>
                            <span className="mx-2 col-5 text-center">{qty}</span>
                            <button
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (incrementCartItem) incrementCartItem(product.id);
                                }}
                                type="button"
                                className="col-3 btn btn-primary"
                                aria-label={`Increase quantity of ${product.name}`}
                                disabled={isAtStock}
                            >
                                <BsPlusLg/>
                            </button>
                        </div>
                    ) : (
                        <button
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                            }}
                            type="button"
                            className="btn btn-outline-primary"
                            aria-label={`Add ${product.name} to cart`}
                            disabled={!product.inStock || (product.stock !== undefined && product.stock <= 0)}
                        >
                            Add to cart
                        </button>
                    )}
                    <button onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleWishlist(e)
                            }}
                            type="button"
                            className="btn btn-outline-success mt-2"
                            aria-pressed={wishlisted}
                            aria-label={wishlisted ? `Added ${product.name} to wishlist` : `Add ${product.name} to wishlist`}>{wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </button>

                    <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleSaved(e)
                        }}
                        type="button"
                        className="btn btn-outline-success mt-2"
                        aria-pressed={saved}
                        aria-label={saved ? `Saved ${product.name} to saved list`: `Save ${product.name}` }>{saved ? 'Saved' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}
