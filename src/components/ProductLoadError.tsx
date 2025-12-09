import React from 'react';

interface ProductLoadErrorProps {
    error: string;
    handleRetryWrapper: () => void;
}

export const ProductLoadError: React.FC<ProductLoadErrorProps> = ({error, handleRetryWrapper}) => {
    return (
        <div className="container py-4">
            <div className="text-center text-danger">Error loading products: {error}</div>
            <div className="d-flex justify-content-center mt-2">
                <button className="btn btn-outline-secondary" onClick={handleRetryWrapper}>Retry</button>
            </div>
        </div>
    )
}
