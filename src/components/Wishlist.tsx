import type { Product, Wishlist } from '../models/product.model';
import React, { useState, useRef, useEffect } from 'react';
import { WishlistItem } from './WishlistItem';
import { AlertMessage } from './AlertMessage.tsx';
import { EmptyPage } from './Empty.tsx';
import { ConfirmationClear } from './Confirmation.tsx';

interface WishlistProps {
    wishlist: Wishlist;
    onRemove?: (product: Product) => void;
    onAddToCart?: (product: Product) => void;
    clearWishlist?: () => void;
}
export const WishlistPage: React.FC<WishlistProps> = ({ wishlist, onRemove, onAddToCart, clearWishlist }) => {
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
        {alertMessage && <AlertMessage message={alertMessage} setBreadcrumbMessage={setAlertMessage} />}

        {
            wishlist.items.length > 0 &&
            <div className='row my-5 justify-content-end gap-2 d-flex justify-content-center align-items-center px-3'>
                <button
                    className="btn btn-outline-danger col-12 col-xs-12 col-sm-12 col-md-10 col-lg-8 mx-auto"
                    onClick={() => { if (wishlist.items.length>0) setConfirmOpen(true); }} disabled={wishlist.items.length===0}
                >Clear wishlist</button>
            </div>
        }

        {wishlist.items.length === 0 ? <EmptyPage title='wishlist' /> : (
            <div className="row justify-content-center g-3 px-1">
                {wishlist.items.map(p => (
                    <WishlistItem key={p.id} product={p} onRemove={onRemove} onAddToCart={onAddToCart} />
                ))}
            </div>
        )}

        {confirmOpen && <ConfirmationClear title='wishlist' message='Wishlist cleared' clearItems={clearWishlist} setConfirmOpen={setConfirmOpen} showAlert={showAlert} />}
    </main>
    )
};
