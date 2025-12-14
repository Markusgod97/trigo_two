'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Plus, Minus, X, ArrowRight } from 'lucide-react';
import { Product, CartItem } from '@/types';

const productos: Product[] = [
  { id: '1', nombre: 'Pan Francés', descripcion: 'Pan artesanal recién horneado', precio: 1500, imagen: '🥖', stock: 50, categoria: 'Panes' },
  { id: '2', nombre: 'Croissant', descripcion: 'Croissant de mantequilla francesa', precio: 2500, imagen: '🥐', stock: 30, categoria: 'Bollería' },
  { id: '3', nombre: 'Pan Integral', descripcion: 'Pan 100% integral con semillas', precio: 2000, imagen: '🍞', stock: 40, categoria: 'Panes' },
  { id: '4', nombre: 'Empanada', descripcion: 'Empanada de carne o pollo', precio: 3000, imagen: '🥟', stock: 25, categoria: 'Salados' },
  { id: '5', nombre: 'Donas', descripcion: 'Donas glaseadas variadas', precio: 1800, imagen: '🍩', stock: 35, categoria: 'Dulces' },
  { id: '6', nombre: 'Torta de Chocolate', descripcion: 'Torta casera de chocolate belga', precio: 25000, imagen: '🎂', stock: 10, categoria: 'Tortas' },
  { id: '7', nombre: 'Galletas', descripcion: 'Galletas de chispas de chocolate', precio: 4500, imagen: '🍪', stock: 45, categoria: 'Dulces' },
  { id: '8', nombre: 'Baguette', descripcion: 'Baguette estilo francés', precio: 3500, imagen: '🥖', stock: 20, categoria: 'Panes' },
];

export default function MenuPage() {
  const router = useRouter();
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  const agregarAlCarrito = (producto: Product) => {
    const itemExistente = carrito.find(item => item.producto.id === producto.id);
    
    if (itemExistente) {
      if (itemExistente.cantidad >= producto.stock) {
        alert('No hay más stock disponible');
        return;
      }
      setCarrito(carrito.map(item =>
        item.producto.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, { producto, cantidad: 1 }]);
    }
  };

  const eliminarDelCarrito = (productoId: string) => {
    setCarrito(carrito.filter(item => item.producto.id !== productoId));
  };

  const actualizarCantidad = (productoId: string, cantidad: number) => {
    const item = carrito.find(i => i.producto.id === productoId);
    if (item && cantidad > item.producto.stock) {
      alert('No hay suficiente stock');
      return;
    }
    
    if (cantidad <= 0) {
      eliminarDelCarrito(productoId);
      return;
    }
    
    setCarrito(carrito.map(item =>
      item.producto.id === productoId
        ? { ...item, cantidad }
        : item
    ));
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
  };

  const irAPagar = () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    router.push('/pago');
  };

  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header con carrito */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-amber-800">Nuestro Menú</h1>
          <p className="text-gray-600 mt-2">Selecciona tus productos favoritos</p>
        </div>
        
        <button
          onClick={() => setMostrarCarrito(!mostrarCarrito)}
          className="relative bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all transform hover:scale-105"
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <span>Carrito</span>
            {cantidadTotal > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {cantidadTotal}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Modal del Carrito */}
      {mostrarCarrito && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Carrito de Compras
                </h2>
                <button
                  onClick={() => setMostrarCarrito(false)}
                  arial-label="Cerrar carrito de compras0"
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                  <span className="sr-only">Cerrar carrito de compras</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              {carrito.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">El carrito está vacío</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {carrito.map(item => (
                      <div key={item.producto.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                        <div className="text-4xl">{item.producto.imagen}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{item.producto.nombre}</h3>
                          <p className="text-sm text-gray-600">${item.producto.precio.toLocaleString()} 
                        c/u</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                            aria-label={`Disminuir cantidad de ${item.producto.nombre}`}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                            <span className = "sr-only"> Disminuir cantidad </span>
                          </button>
                          <span className="font-bold w-8 text-center">{item.cantidad}</span>
                          <button
                            onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                            aria-label={`Aumentar cantidad de ${item.producto.nombre}`}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => eliminarDelCarrito(item.producto.id)}
                            aria-label={`Eliminar ${item.producto.nombre} del carrito`}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <p className="font-bold text-lg">
                            ${(item.producto.precio * item.cantidad).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-gray-800">Total:</span>
                      <span className="text-3xl font-bold text-amber-600">
                        ${calcularTotal().toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={irAPagar}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      Proceder al Pago
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productos.map(producto => (
          <div key={producto.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="text-center text-6xl py-8 bg-gradient-to-br from-amber-50 to-orange-50">
              {producto.imagen}
            </div>
            <div className="p-6">
              <div className="mb-2">
                <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                  {producto.categoria}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{producto.nombre}</h3>
              <p className="text-gray-600 text-sm mb-4">{producto.descripcion}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-amber-600">
                  ${producto.precio.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Stock: {producto.stock}
                </span>
              </div>
              <button
                onClick={() => agregarAlCarrito(producto)}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Agregar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}