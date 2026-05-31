export interface ProductModel {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}
