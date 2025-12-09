import React, { useState, useRef, useEffect } from 'react';
import type { Cart } from '../models/product.model';
import type { CartItem as CartItemModel } from '../models/product.model';
import { CartItem } from './CartItem';
import { AlertMessage } from './AlertMessage.tsx';
import { EmptyPage } from './Empty.tsx';

interface CartProps {
    cart: Cart
    increment?: (productId: number) => void;
    decrement?: (productId: number) => void;
    clearCart?: () => void;
}

export const CartPage: React.FC<CartProps> = ({ cart, increment, decrement, clearCart }) => {
    // compute totals
    const totalQuantity = cart.items.reduce((acc, ci) => acc + (ci.quantity ?? 0), 0);
    const totalDue = cart.items.reduce((acc, ci) => acc + (ci.item.price * ci.quantity), 0);

    const [breadcrumbMessage, setBreadcrumbMessage] = useState<string | null>(null);
    const timeoutRef = useRef<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const confirmButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const showBreadcrumb = (msg: string) => {
        setBreadcrumbMessage(msg);
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        // hide after 4 seconds
        timeoutRef.current = window.setTimeout(() => setBreadcrumbMessage(null), 4000);
    };

    // focus confirm button when modal opens
    useEffect(() => {
        if (confirmOpen) {
            confirmButtonRef.current?.focus();
        }
    }, [confirmOpen]);

    const formatCurrency = (value: number, currency?: string) => {
        try {
            return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency ?? 'USD' }).format(value);
        } catch {
            return `${value.toFixed(2)} ${currency ?? 'USD'}`;
        }
    };

    return (
        <main className="container py-4">
            {
                breadcrumbMessage &&
                <AlertMessage message={breadcrumbMessage} setBreadcrumbMessage={setBreadcrumbMessage} />
            }

            {
                cart.items.length > 0 &&
                <div className='row my-5 justify-content-end gap-2'>
                    <button
                        type="button"
                        className="btn btn-primary col-12"
                        onClick={() => {
                            // scroll to summary when clicked
                            const el = document.getElementById('cart-summary');
                            if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                // set focus for accessibility
                                (el as HTMLElement).focus({ preventScroll: true });
                            }
                        }}
                    >
                        Proceed to checkout
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline-danger col-12"
                        onClick={() => {
                            if (cart.items.length === 0) return;
                            setConfirmOpen(true);
                        }}
                        disabled={cart.items.length === 0}
                    >
                        Clear cart
                    </button>

                </div>
            }

            {cart.items.length === 0 ? <EmptyPage title={'Cart'} />: (
                <>

                    <div className="list-group my-5">
                        {cart.items.map(ci => (
                            <CartItem key={ci.item.id} item={ci as CartItemModel} increment={increment} decrement={decrement} />
                        ))}
                    </div>

                    {/* Cart summary attached to the bottom of the list (right-aligned) */}
                    <div className="row d-flex justify-content-end mt-3" aria-live="polite">
                        {/* Right: summary - takes ~50% width on md+ */}
                        <div className='col-xs-12 col-sm-12 col-md-6' >
                            <div id="cart-summary" className="card p-3 shadow-sm">
                                <h3 className="h6 mb-3">Cart Summary</h3>
                                <div className="d-flex justify-content-between mb-1">
                                    <div>Total Items:</div>
                                    <div><strong>{totalQuantity}</strong></div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div>Total amount:</div>
                                    <div><strong>{formatCurrency(totalDue, cart.items[0]?.item.currency)}</strong></div>
                                </div>

                                <div className="mt-3 text-end">
                                    <button className="btn btn-success" type="button" aria-label="Proceed to checkout">Checkout</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Confirmation modal (simple Bootstrap markup, shown via conditional render) */}
            {confirmOpen ? (
                <>
                    <div className="modal fade show" role="dialog" style={{ display: 'block' }} aria-modal="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm clear cart</h5>
                                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setConfirmOpen(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to remove all items from your cart?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setConfirmOpen(false)}>Cancel</button>
                                    <button
                                        type="button"
                                        ref={confirmButtonRef}
                                        className="btn btn-danger"
                                        onClick={() => {
                                            if (!clearCart) return;
                                            clearCart();
                                            setConfirmOpen(false);
                                            showBreadcrumb('Cart cleared');
                                        }}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            ) : null}
        </main>
    );
};
