// types/index.ts
export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
}

export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  stock: number;
  categoria: string;
}

export interface CartItem {
  producto: Product;
  cantidad: number;
}

export interface Factura {
  id: string;
  numeroFactura: string;
  fecha: Date;
  cliente: {
    nombre: string;
    email: string;
    cedula: string;
    telefono?: string;
  };
  items: CartItem[];
  subtotal: number;
  iva: number;
  total: number;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
}

export interface PaymentData {
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  numeroTarjeta?: string;
  nombreTitular?: string;
  fechaExpiracion?: string;
  cvv?: string;
}