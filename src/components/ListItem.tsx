import React from 'react';
import type { Product } from '../models/product.model';

interface ListItemProps {
    product: Product;
    // optional container class to allow layout differences
    className?: string;
    children?: React.ReactNode; // actions area
}

const formatCurrency = (value: number, currency?: string) => {
    try {
        return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency ?? 'USD' }).format(value);
    } catch {
        return `${value.toFixed(2)} ${currency ?? 'USD'}`;
    }
};

const computeOriginalPrice = (product: Product): number | null => {
    const d = product.discountPercentage ?? 0;
    if (!d) return null;
    // interpret discount: if between 0 and 1 -> fraction (e.g., 0.2 = 20%), otherwise >1 treat as percent (e.g., 20 = 20%)
    const fraction = d > 0 && d < 1 ? d : (d >= 1 && d <= 100 ? d / 100 : d);
    if (fraction <= 0 || fraction >= 1) return null;
    const original = product.price / (1 - fraction);
    return original > product.price ? original : null;
};

export const ListItem: React.FC<ListItemProps> = ({ product, className = '', children }) => {
    const originalPrice = computeOriginalPrice(product);

    return (
        <div className={className}>
            <div className="d-flex align-items-center">
                <img
                    src={product.imageUrl ?? '/placeholder.png'}
                    alt={product.name}
                    style={{ width: 72, height: 72, objectFit: 'cover', marginRight: 12, borderRadius: 6 }}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                />

                <div className="flex-grow-1">
                    <div className="fw-bold">{product.name}</div>
                    {product.brand && <div className="text-muted small">{product.brand}</div>}
                    <div className="mt-1">
                        {originalPrice ? (
                            <>
                                <span className="text-decoration-line-through me-2 d-block">{formatCurrency(originalPrice, product.currency)}</span>
                                <span className="text-success fw-bold">{formatCurrency(product.price, product.currency)}</span>
                            </>
                        ) : (
                            <span className="fw-bold">{formatCurrency(product.price, product.currency)}</span>
                        )}
                    </div>

                </div>

                <div className="ms-3">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Note: use named import { ListItem }
