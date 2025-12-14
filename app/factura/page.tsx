'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Printer, ShoppingBag, CheckCircle } from 'lucide-react';
import QRCodeFactura from '../components/QRCodeFactura';
import { Factura } from '@/types';

export default function FacturaPage() {
  const router = useRouter();
  const [factura, setFactura] = useState<Factura | null>(null);
  const [descargando, setDescargando] = useState(false);
  const facturaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const facturaGuardada = localStorage.getItem('ultimaFactura');
    if (facturaGuardada) {
      setFactura(JSON.parse(facturaGuardada));
    } else {
      router.push('/menu');
    }
  }, [router]);

  const descargarPDF = async () => {
    if (!facturaRef.current || descargando) return;

    setDescargando(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(facturaRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Factura-${factura?.numeroFactura}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor intente de nuevo.');
    } finally {
      setDescargando(false);
    }
  };

  const imprimirFactura = () => {
    window.print();
  };

  if (!factura) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando factura...</p>
        </div>
      </div>
    );
  }

  const fecha = new Date(factura.fecha);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Confirmación de Pago */}
      <div className="mb-8 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-500 rounded-xl p-6 print:hidden">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-1">
              ¡Pago Realizado con Éxito!
            </h2>
            <p className="text-green-700">
              Tu compra ha sido procesada correctamente. Factura N° {factura.numeroFactura}
            </p>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="mb-6 flex flex-wrap gap-4 print:hidden">
        <button
          onClick={descargarPDF}
          disabled={descargando}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          {descargando ? 'Descargando...' : 'Descargar PDF'}
        </button>
        
        <button
          onClick={imprimirFactura}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
        >
          <Printer className="w-5 h-5" />
          Imprimir
        </button>
        
        <button
          onClick={() => router.push('/menu')}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
        >
          <ShoppingBag className="w-5 h-5" />
          Nueva Compra
        </button>
      </div>

      {/* Factura */}
      <div ref={facturaRef} className="bg-white rounded-xl shadow-2xl p-8 print:shadow-none">
        {/* Encabezado */}
        <div className="border-b-4 border-amber-600 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">🍞</span>
                <div>
                  <h1 className="text-4xl font-bold text-amber-800">Trigo de Oro</h1>
                  <p className="text-gray-600 text-lg">Panadería Artesanal</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>NIT:</strong> 900.123.456-7</p>
                <p><strong>Dirección:</strong> Calle 123 #45-67, Bogotá</p>
                <p><strong>Teléfono:</strong> (601) 234-5678</p>
                <p><strong>Email:</strong> contacto@trigodeoro.com</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg mb-3 shadow-lg">
                <p className="font-bold text-lg">FACTURA ELECTRÓNICA</p>
                <p className="text-2xl font-bold">{factura.numeroFactura}</p>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Fecha:</strong> {fecha.toLocaleDateString('es-CO', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p><strong>Hora:</strong> {fecha.toLocaleTimeString('es-CO')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Datos del Cliente */}
        <div className="mb-6 bg-amber-50 p-5 rounded-lg border-2 border-amber-200">
          <h2 className="text-xl font-bold mb-3 text-amber-900">Datos del Cliente</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Nombre:</p>
              <p className="font-medium text-gray-800">{factura.cliente.nombre}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold">Cédula:</p>
              <p className="font-medium text-gray-800">{factura.cliente.cedula}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold">Email:</p>
              <p className="font-medium text-gray-800 break-all">{factura.cliente.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold">Método de Pago:</p>
              <p className="font-medium text-gray-800 capitalize">{factura.metodoPago}</p>
            </div>
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="mb-6">
          <table className="w-full">
            <thead>
              <tr className="bg-amber-600 text-white">
                <th className="text-left p-3 rounded-tl-lg">Producto</th>
                <th className="text-center p-3">Cantidad</th>
                <th className="text-right p-3">Precio Unit.</th>
                <th className="text-right p-3 rounded-tr-lg">Total</th>
              </tr>
            </thead>
            <tbody>
              {factura.items.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.producto.imagen}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{item.producto.nombre}</p>
                        <p className="text-sm text-gray-600">{item.producto.descripcion}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center p-3 font-semibold">{item.cantidad}</td>
                  <td className="text-right p-3 text-gray-700">
                    ${item.producto.precio.toLocaleString()}
                  </td>
                  <td className="text-right p-3 font-bold text-amber-600">
                    ${(item.producto.precio * item.cantidad).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totales y QR */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex-1">
            <QRCodeFactura factura={factura} />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex justify-between text-lg">
              <span className="text-gray-700 font-semibold">Subtotal:</span>
              <span className="font-bold">${factura.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-700 font-semibold">IVA (19%):</span>
              <span className="font-bold">${factura.iva.toLocaleString()}</span>
            </div>
            <div className="border-t-2 border-amber-600 pt-3 mt-3">
              <div className="flex justify-between text-2xl">
                <span className="font-bold text-gray-800">TOTAL:</span>
                <span className="font-bold text-amber-600">${factura.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pie de página */}
        <div className="mt-8 pt-6 border-t-2 border-gray-300 text-center space-y-2">
          <p className="text-lg font-semibold text-amber-800">¡Gracias por su compra!</p>
          <p className="text-sm text-gray-600">
            Esta es una factura electrónica válida según la normativa vigente
          </p>
          <p className="text-sm text-gray-600">
            Sistema de Facturación Electrónica - Resolución DIAN N° 123456789
          </p>
          <p className="text-sm text-amber-600 font-semibold mt-3">
            www.trigodeoro.com | contacto@trigodeoro.com
          </p>
        </div>
      </div>
    </div>
  );
}