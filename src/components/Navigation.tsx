import React from 'react';
import { BsCartFill } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import './Navigation.css'

interface NavigationProps {
    openCart: (isOpen: boolean) => void;
    cartItemCount: number;
    wishlistCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({openCart, cartItemCount}) => {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/" end>Store</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li onClick={() => openCart(false)} className="nav-item">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                                aria-current="page"
                            >
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/wishlist"
                                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                            >
                                Wishlist
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/saved"
                                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                            >
                                Saved
                            </NavLink>
                        </li>

                    </ul>
                    <div className="d-flex align-items-center">
                        <NavLink
                            to="/cart"
                            className={({ isActive }) => {
                                const base = 'btn btn-sm end-0 m-2 icon-container';
                                return isActive ? `${base} active` : base;
                            }}
                            aria-label="Open cart"
                        >
                            {cartItemCount >= 0 && <span className='cart-count-badge' aria-live="polite">{cartItemCount}</span>}
                            <BsCartFill className='cart-btn' size={16} aria-hidden />
                        </NavLink>

                    </div>
                </div>
            </div>
        </nav>
    )
}
