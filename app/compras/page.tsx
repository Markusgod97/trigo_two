'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Receipt, ShoppingBag, Calendar, CreditCard, Eye, Package } from 'lucide-react';

export default function ComprasPage() {
  const router = useRouter();
  const [facturas, setFacturas] = useState<any[]>([]);

  useEffect(() => {
    // Cargar historial de compras desde localStorage
    const historial = localStorage.getItem('historialCompras');
    if (historial) {
      setFacturas(JSON.parse(historial));
    }
  }, []);

  const verFactura = (factura: any) => {
    localStorage.setItem('ultimaFactura', JSON.stringify(factura));
    router.push('/factura');
  };

  const calcularTotalCompras = () => {
    return facturas.reduce((total, factura) => total + factura.total, 0);
  };

  const cantidadTotalProductos = () => {
    return facturas.reduce((total, factura) => {
      return total + factura.items.reduce((sum: number, item: any) => sum + item.cantidad, 0);
    }, 0);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-amber-800 mb-2">Mis Compras</h1>
        <p className="text-gray-600">Historial de todas tus compras realizadas</p>
      </div>

      {facturas.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="inline-block p-6 bg-amber-100 rounded-full mb-6">
            <ShoppingBag className="w-16 h-16 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No tienes compras registradas
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Explora nuestro menú y realiza tu primera compra para ver tu historial aquí
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            Ir al Menú
          </Link>
        </div>
      ) : (
        <>
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-semibold mb-1">Total Compras</p>
                  <p className="text-3xl font-bold">{facturas.length}</p>
                </div>
                <Receipt className="w-12 h-12 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-semibold mb-1">Total Gastado</p>
                  <p className="text-3xl font-bold">${calcularTotalCompras().toLocaleString()}</p>
                </div>
                <CreditCard className="w-12 h-12 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-semibold mb-1">Productos</p>
                  <p className="text-3xl font-bold">{cantidadTotalProductos()}</p>
                </div>
                <Package className="w-12 h-12 text-purple-200" />
              </div>
            </div>
          </div>

          {/* Lista de Facturas */}
          <div className="space-y-6">
            {facturas.map((factura, index) => {
              const fecha = new Date(factura.fecha);
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <Receipt className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-amber-800">
                            {factura.numeroFactura}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {fecha.toLocaleDateString('es-CO', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                            <span>
                              {fecha.toLocaleTimeString('es-CO', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Total Pagado</p>
                      <p className="text-3xl font-bold text-green-600">
                        ${factura.total.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Detalles */}
                  <div className="border-t pt-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">Cliente</p>
                        <p className="text-gray-800">{factura.cliente.nombre}</p>
                        <p className="text-sm text-gray-600">CC: {factura.cliente.cedula}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">Método de Pago</p>
                        <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold capitalize">
                          {factura.metodoPago}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-2">Productos Comprados:</p>
                      <div className="flex flex-wrap gap-2">
                        {factura.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                            <span className="text-xl">{item.producto.imagen}</span>
                            <span className="text-sm font-medium text-gray-700">
                              {item.producto.nombre}
                            </span>
                            <span className="text-sm text-gray-600">
                              x{item.cantidad}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    <button
                      onClick={() => verFactura(factura)}
                      className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Factura
                    </button>
                    
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      Completado
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}