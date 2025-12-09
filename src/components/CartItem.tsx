import React from 'react';
import type { CartItem as CartItemModel } from '../models/product.model';
import { ListItem } from './ListItem';
import { GrSubtract } from 'react-icons/gr';
import { BsPlusLg } from 'react-icons/bs';

interface CartItemProps {
    item: CartItemModel;
    increment?: (productId: number) => void;
    decrement?: (productId: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, increment, decrement }) => {
    return (
        <div className="list-group-item">
            <ListItem product={item.item}>
                <div className="d-flex align-items-center">
                    <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => decrement && decrement(item.item.id)} aria-label={`Decrease quantity of ${item.item.name}`}><GrSubtract /></button>
                    <span className="mx-2">{item.quantity}</span>
                    <button type="button" disabled={item.quantity >= item.item.stock} className="btn btn-sm btn-primary ms-2" onClick={() => increment && increment(item.item.id)} aria-label={`Increase quantity of ${item.item.name}`}><BsPlusLg/></button>
                </div>
            </ListItem>
        </div>
    );
};
