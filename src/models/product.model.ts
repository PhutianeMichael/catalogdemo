
export interface Product {
    id: number
    name: string
    description: string
    category: string
    price: number
    discountPercentage: number
    currency: string
    reviewCount: number
    rating: number
    inStock: boolean
    stock: number
    tags: string[]
    brand: string
    sku: string
    weight: number
    dimensions: Dimensions
    warrantyInformation: string
    shippingInformation: string
    availabilityStatus: string
    reviews: Review[]
    returnPolicy: string
    minimumOrderQuantity: number
    meta: Meta
    images: string[]
    imageUrl: string
}

export interface Dimensions {
    width: number
    height: number
    depth: number
}

export interface Review {
    rating: number
    comment: string
    date: string
    reviewerName: string
    reviewerEmail: string
}

export interface Meta {
    createdAt: string
    updatedAt: string
    barcode: string
    qrCode: string
}

export interface CartItem {
    item: Product,
    quantity: number
}

export interface Cart {
    userId: string
    items: CartItem[],
    totalCount: number
}
