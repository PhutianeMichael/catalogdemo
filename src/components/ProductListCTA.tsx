import React from 'react';

interface ProductListCTAProps {
    localSearch: string | undefined;
    sortField: string;
    sortOrder: string;
    categories: string[];
    selectedCategory?: string;
    setSortField: (searchTerm: string) => void;
    setSortOrder: (sortOrder: 'asc'|'desc') => void;
    setLocalSearch: (searchTerm: string) => void;
    updateFilter: (key: string, value: string|number|boolean|null) => void;
    setSearchTerm: (searchTerm: string | undefined) => void;
}

export const ProductListCTA: React.FC<ProductListCTAProps> = ({ categories, selectedCategory = '', localSearch, sortField, sortOrder, updateFilter, setSortField, setSortOrder, setLocalSearch, setSearchTerm}) => {
    return (
        <>
            <div className="col-12 col-md-6">
                <div className="input-group">
                    <input
                        type="search"
                        className="form-control"
                        placeholder="Search products..."
                        aria-label="Search products"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                setSearchTerm(localSearch);
                            }
                        }}
                    />
                    <button type="button" className="btn btn-primary" onClick={() => setSearchTerm(localSearch)}>Search</button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => { setLocalSearch(''); setSearchTerm(undefined); }}>Clear</button>
                </div>
            </div>

            <div className="col-6 col-md-3">
                <select className="form-select" aria-label="Filter by category" value={selectedCategory} onChange={(e) => updateFilter('category', e.target.value || null)}>
                    <option value="">All categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

            <div className="col-6 col-md-3 d-flex gap-2 justify-content-md-end">
                <select className="form-select" aria-label="Sort field" value={sortField} onChange={(e) => setSortField(e.target.value)}>
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                    <option value="reviewCount">Reviews</option>
                </select>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} aria-pressed={sortOrder === 'desc'}>{sortOrder === 'asc' ? 'Asc' : 'Desc'}</button>
            </div>
        </>
    )

}
