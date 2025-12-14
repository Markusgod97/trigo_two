'use client';

import { useEffect, useRef } from 'react';
import { Factura } from '@/types';

interface QRCodeFacturaProps {
  factura: Factura;
}

export default function QRCodeFactura({ factura }: QRCodeFacturaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generarQR = async () => {
      if (!canvasRef.current) return;

      try {
        const QRCode = (await import('qrcode')).default;

        // Datos para el QR (información de la factura)
        const datosQR = JSON.stringify({
          numeroFactura: factura.numeroFactura,
          fecha: factura.fecha,
          cliente: factura.cliente.nombre,
          cedula: factura.cliente.cedula,
          total: factura.total,
          items: factura.items.length,
          metodoPago: factura.metodoPago
        });

        // Generar QR en el canvas
        await QRCode.toCanvas(canvasRef.current, datosQR, {
          width: 200,
          margin: 2,
          color: {
            dark: '#D97706',  // Color amber-600
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });
      } catch (error) {
        console.error('Error al generar código QR:', error);
      }
    };

    generarQR();
  }, [factura]);

  return (
    <div className="text-center">
      <canvas 
        ref={canvasRef} 
        className="mx-auto border-4 border-amber-600 rounded-lg shadow-lg" 
      />
      <p className="text-sm text-gray-600 mt-3 font-medium">
        📱 Escanea para verificar la factura
      </p>
    </div>
  );
}