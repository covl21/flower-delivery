export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    shopId?: string;                
    shopLocation?: { lat: number; lng: number }; 
  }
  
  export interface Shop {
    id: string;
    name: string;
    products: Product[];
  }
  
  export interface Order {
    id: string;
    products: { product: Product; quantity: number }[];
    totalPrice: number;
    email: string;
    phone: string;
    address: string;
    createdAt: string;
  }
  
