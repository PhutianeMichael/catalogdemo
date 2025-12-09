import React, { useEffect, useRef, useState } from 'react';
import { AlertMessage } from './AlertMessage.tsx';
import { EmptyPage } from './Empty.tsx';
import type { Product, Saved } from '../models/product.model.ts';
import { ConfirmationClear } from './Confirmation.tsx';
import { SavedItem } from './SaveItem.tsx';

interface SavedProps {
    saved: Saved;
    onRemove?: (product: Product) => void;
    onClearSaved?: () => void;
    onAddToCart?: (product: Product) => void;
}

export const SavedPage: React.FC<SavedProps> = ({ saved, onRemove, onClearSaved, onAddToCart }) => {
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

    const handleAddToCart = (product: Product) => {
        if (onAddToCart) onAddToCart(product);
        setAlertMessage(`${product.name} has been added to cart successfully.`);
    }

    return (
        <main className="container py-4">
            {alertMessage &&
                <AlertMessage message={alertMessage} setBreadcrumbMessage={setAlertMessage} />
            }

            {
                saved.items.length > 0 &&
                <div className='row my-5 justify-content-end gap-2 d-flex justify-content-center align-items-center px-3'>

                    <button
                        type="button"
                        className="btn btn-outline-danger col-12 col-xs-12 col-sm-12 col-md-10 col-lg-8 mx-auto"
                        onClick={() => {
                            if (saved.items.length === 0) return;
                            setConfirmOpen(true);
                        }}
                        disabled={saved.items.length === 0}
                    >
                        Clear Saved
                    </button>

                </div>
            }

            {saved.items.length === 0 ? <EmptyPage title={'Saved items'} />: (
                <div className="row justify-content-center g-3 px-1">
                    {saved.items.map(p => (
                        <SavedItem key={p.id} product={p} onRemove={onRemove} onAddToCart={handleAddToCart} />
                    ))}
                </div>
            )}

            {/* Confirmation modal (simple Bootstrap markup, shown via conditional render) */}
            {confirmOpen && <ConfirmationClear title='Saved list' message='Saved List cleared' clearItems={onClearSaved} setConfirmOpen={setConfirmOpen} showAlert={showAlert} />}

        </main>
    )
}
