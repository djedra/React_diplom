export interface ItemData {
    id: number,
    images: string[],
    title: string,
    price: number
}

export interface FullData {
    id: number,
    category: number,
    title: string,
    images: string[],
    sku: string,
    manufacturer: string,
    color: string,
    material: string,
    reason: string,
    season: string,
    price: number,
    sizes: { size: string, available: boolean }[],
}

export interface CartData {
    title: string,
    size: string,
    amount: number,
    price: number,
    id: number,
    totalPrice: number;
}

export interface OrderData {
    owner: {
        phone: string,
        address: string
    },
    items: { id: number, price: number, count: number }[],
}