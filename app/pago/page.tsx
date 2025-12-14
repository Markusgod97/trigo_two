'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Wallet, Building2, User, Mail, Phone, IdCard, CheckCircle } from 'lucide-react';
import { CartItem } from '@/types';

export default function PagoPage() {
  const router = useRouter();
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'tarjeta' | 'transferencia'>('efectivo');
  const [datosCliente, setDatosCliente] = useState({
    nombre: '',
    cedula: '',
    email: '',
    telefono: ''
  });
  const [datosTarjeta, setDatosTarjeta] = useState({
    numeroTarjeta: '',
    nombreTitular: '',
    fechaExpiracion: '',
    cvv: ''
  });
  const [procesando, setProcesando] = useState(false);
  const [terminosAceptados, setTerminosAceptados] = useState(false);

  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    } else {
      router.push('/menu');
    }

    // Cargar datos del usuario si existe
    const usuario = localStorage.getItem('user');
    if (usuario) {
      const user = JSON.parse(usuario);
      setDatosCliente({
        nombre: user.nombre || '',
        cedula: '',
        email: user.email || '',
        telefono: ''
      });
    }
  }, [router]);

  const calcularSubtotal = () => {
    return carrito.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
  };

  const calcularIVA = () => {
    return Math.round(calcularSubtotal() * 0.19);
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularIVA();
  };

  const procesarPago = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!datosCliente.nombre || !datosCliente.cedula || !datosCliente.email) {
      alert('Por favor complete todos los datos obligatorios del cliente');
      return;
    }

    if (!terminosAceptados) {
      alert('Debe aceptar los términos y condiciones');
      return;
    }

    if (metodoPago === 'tarjeta') {
      if (!datosTarjeta.numeroTarjeta || !datosTarjeta.nombreTitular || !datosTarjeta.fechaExpiracion || !datosTarjeta.cvv) {
        alert('Por favor complete todos los datos de la tarjeta');
        return;
      }
    }

    setProcesando(true);

    // Simulación de procesamiento de pago
    setTimeout(() => {
      const factura = {
        id: Date.now().toString(),
        numeroFactura: `F-${Date.now()}`,
        fecha: new Date().toISOString(),
        cliente: datosCliente,
        items: carrito,
        subtotal: calcularSubtotal(),
        iva: calcularIVA(),
        total: calcularTotal(),
        metodoPago
      };

      // Guardar factura
      localStorage.setItem('ultimaFactura', JSON.stringify(factura));
      
      // Guardar en historial
      const historial = JSON.parse(localStorage.getItem('historialCompras') || '[]');
      historial.push(factura);
      localStorage.setItem('historialCompras', JSON.stringify(historial));
      
      // Limpiar carrito
      localStorage.removeItem('carrito');
      
      router.push('/factura');
    }, 2000);
  };

  if (carrito.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-amber-800 mb-8">Proceso de Pago</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Columna Izquierda - Resumen del Pedido */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Resumen del Pedido</h2>
            
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
              {carrito.map(item => (
                <div key={item.producto.id} className="flex items-center gap-3 pb-3 border-b">
                  <div className="text-3xl">{item.producto.imagen}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.producto.nombre}</p>
                    <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                  </div>
                  <p className="font-bold text-amber-600">
                    ${(item.producto.precio * item.cantidad).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-semibold">${calcularSubtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>IVA (19%):</span>
                <span className="font-semibold">${calcularIVA().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-3">
                <span className="text-gray-800">Total:</span>
                <span className="text-amber-600">${calcularTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha - Formulario de Pago */}
      {/* Columna Derecha - Formulario de Pago */}
<div className="lg:col-span-3">
  <form onSubmit={procesarPago} className="space-y-6">
    {/* Datos del Cliente */}
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Datos del Cliente</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre Completo */}
        <div>
          <label 
            htmlFor="nombreCompleto"  // ← Agrega htmlFor
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Nombre Completo *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="nombreCompleto"  // ← Agrega id que coincida con htmlFor
              value={datosCliente.nombre}
              onChange={(e) => setDatosCliente({...datosCliente, nombre: e.target.value})}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
              aria-required="true"  // ← Para accesibilidad
              placeholder="Ingrese su nombre completo"  // ← Agrega placeholder
            />
          </div>
        </div>

        {/* Cédula */}
        <div>
          <label 
            htmlFor="cedulaCliente"  // ← Agrega htmlFor
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Cédula *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IdCard className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="cedulaCliente"  // ← Agrega id
              value={datosCliente.cedula}
              onChange={(e) => setDatosCliente({...datosCliente, cedula: e.target.value})}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
              aria-required="true"
              placeholder="Ej: 12345678"  // ← Agrega placeholder
              aria-label="Número de cédula de identidad"  // ← Opcional extra
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label 
            htmlFor="emailCliente"  // ← Agrega htmlFor
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Email *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="emailCliente"  // ← Agrega id
              value={datosCliente.email}
              onChange={(e) => setDatosCliente({...datosCliente, email: e.target.value})}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
              aria-required="true"
              placeholder="ejemplo@correo.com"  // ← Agrega placeholder
              aria-label="Dirección de correo electrónico"
            />
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <label 
            htmlFor="telefonoCliente"  // ← Agrega htmlFor
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Teléfono
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="telefonoCliente"  // ← Agrega id
              value={datosCliente.telefono}
              onChange={(e) => setDatosCliente({...datosCliente, telefono: e.target.value})}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="+58 412 1234567"  // ← Agrega placeholder
              aria-label="Número de teléfono de contacto"
            />
          </div>
        </div>
      </div>
    </div>
            {/* Método de Pago */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Método de Pago</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setMetodoPago('efectivo')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    metodoPago === 'efectivo'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Wallet className={`w-8 h-8 mx-auto mb-2 ${metodoPago === 'efectivo' ? 'text-green-600' : 'text-gray-600'}`} />
                  <p className="font-semibold text-center">Efectivo</p>
                </button>

                <button
                  type="button"
                  onClick={() => setMetodoPago('tarjeta')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    metodoPago === 'tarjeta'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <CreditCard className={`w-8 h-8 mx-auto mb-2 ${metodoPago === 'tarjeta' ? 'text-blue-600' : 'text-gray-600'}`} />
                  <p className="font-semibold text-center">Tarjeta</p>
                </button>

                <button
                  type="button"
                  onClick={() => setMetodoPago('transferencia')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    metodoPago === 'transferencia'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Building2 className={`w-8 h-8 mx-auto mb-2 ${metodoPago === 'transferencia' ? 'text-purple-600' : 'text-gray-600'}`} />
                  <p className="font-semibold text-center">Transferencia</p>
                </button>
              </div>

              {/* Datos de Tarjeta */}
              {metodoPago === 'tarjeta' && (
                <div className="space-y-4 mt-6 p-4 bg-blue-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Número de Tarjeta *
                    </label>
                    <input
                      type="text"
                      value={datosTarjeta.numeroTarjeta}
                      onChange={(e) => setDatosTarjeta({...datosTarjeta, numeroTarjeta: e.target.value})}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre del Titular *
                    </label>
                    <input
                      type="text"
                      value={datosTarjeta.nombreTitular}
                      onChange={(e) => setDatosTarjeta({...datosTarjeta, nombreTitular: e.target.value})}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="NOMBRE APELLIDO"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Fecha Exp. *
                      </label>
                      <input
                        type="text"
                        value={datosTarjeta.fechaExpiracion}
                        onChange={(e) => setDatosTarjeta({...datosTarjeta, fechaExpiracion: e.target.value})}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="MM/AA"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        value={datosTarjeta.cvv}
                        onChange={(e) => setDatosTarjeta({...datosTarjeta, cvv: e.target.value})}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              {metodoPago === 'transferencia' && (
                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Datos para transferencia:</strong>
                  </p>
                  <p className="text-sm text-gray-600">Banco: Banco Ejemplo</p>
                  <p className="text-sm text-gray-600">Cuenta: 1234-5678-9012</p>
                  <p className="text-sm text-gray-600">Titular: Trigo de Oro S.A.S</p>
                </div>
              )}
            </div>

            {/* Términos y Condiciones */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={terminosAceptados}
                  onChange={(e) => setTerminosAceptados(e.target.checked)}
                  className="mt-1 w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-700">
                  Acepto los términos y condiciones, y autorizo el procesamiento de mis datos personales
                </span>
              </label>
            </div>

            {/* Botón de Pago */}
            <button
              type="submit"
              disabled={procesando || !terminosAceptados}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {procesando ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando pago...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Confirmar Pago - ${calcularTotal().toLocaleString()}
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}