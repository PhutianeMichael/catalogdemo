import './App.css'
import type { Cart, CartItem, Product } from './models/product.model';
import { useProducts } from './hooks/useProducts.tsx';
import { useState } from 'react';
import { ProductList } from './components/ProductList.tsx';

function App() {
    const {
        products,
    } = useProducts();

    const [cart, setCart] = useState<Cart>({userId: 'sdf12312asdas', items: [] as CartItem[], totalCount: 0} as Cart);

    const handleAddToCart = (product: Product) => {
        console.log(cart)
        setCart((prevCart: Cart): Cart => {
            const items = prevCart.items ?? [];
            const exists = items.findIndex(i => i.item.id === product.id);
            const newItems = exists >= 0
                ? items.map(i => i.item.id === product.id ? {...i, quantity: i.quantity + 1} : i)
                : [...items, {item: product, quantity: 1}];

            const totalCount = newItems.reduce((acc, item) => acc + item.quantity, 0);

            return {
                ...prevCart,
                items: newItems,
                totalCount,
            };
        });
    }

    return (
        <>
            <main className="container py-4">
                {/* Header: search, category filter, sort */}
                <div className="row justify-content-center g-3">
                    <ProductList
                        products={products}
                        handleAddToCart={handleAddToCart}

                    />
                </div>
            </main>
        </>
    );
}

export default App
