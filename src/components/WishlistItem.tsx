import React from 'react';
import type { Product } from '../models/product.model';
import { ListItem } from './ListItem';

interface WishlistItemProps {
    product: Product;
    onRemove?: (product: Product) => void;
    onAddToCart?: (product: Product) => void;
}

export const WishlistItem: React.FC<WishlistItemProps> = ({ product, onRemove, onAddToCart }) => {
    return (
        <div className="col-12 col-xs-12 col-sm-12 col-md-10 col-lg-8 mx-auto">
            <div className="card p-2">
                <ListItem product={product}>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                                if (onAddToCart) onAddToCart(product);
                                // Remove from wishlist since we ready to buy it
                                if (onRemove) onRemove(product);
                            }}
                            aria-label={`Add ${product.name} to cart`}
                        >
                            Add to cart
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => onRemove && onRemove(product)} aria-label={`Remove ${product.name} from wishlist`}>Remove</button>
                    </div>
                </ListItem>
            </div>
        </div>
    );
};
