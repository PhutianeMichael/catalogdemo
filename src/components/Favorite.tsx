import React, { useEffect, useRef, useState } from 'react';
import type { Favorite, Product } from '../models/product.model.ts';
import { AlertMessage } from './AlertMessage.tsx';
import { EmptyPage } from './Empty.tsx';
import { WishlistItem } from './WishlistItem.tsx';
import { ConfirmationClear } from './Confirmation.tsx';

interface FavoritePageProps {
    favorite: Favorite;
    onRemove?: (productId: number) => void;
    onAddToCart?: (product: Product) => void;
    clearWishlist?: () => void;
}
export const FavoritePage: React.FC<FavoritePageProps> = ({favorite, onRemove, onAddToCart, clearWishlist}: FavoritePageProps) => {
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); };
    }, []);

    const showAlert = (msg: string) => {
        setAlertMessage(msg);
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setAlertMessage(null), 4000);
    };

    return (
        <main className="container py-4">
            {alertMessage &&
                <AlertMessage message={alertMessage} setBreadcrumbMessage={setAlertMessage} />
            }
            {
                favorite.items.length > 0 && <EmptyPage title={'favorite'} />
            }

            {favorite.items.length === 0 ? <EmptyPage title={'favorites'} /> : (
                <div className="row justify-content-center g-3 px-1">
                    {favorite.items.map(p => (
                        <WishlistItem key={p.id} product={p} onRemove={onRemove} onAddToCart={onAddToCart} />
                    ))}
                </div>
            )}

            {confirmOpen && <ConfirmationClear title='favorite list summary' message='Favorite List cleared' clearItems={clearWishlist} setConfirmOpen={setConfirmOpen} showAlert={showAlert} />}
        </main>
    )
}
