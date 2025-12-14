import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trigo de Oro - Panadería Artesanal",
  description: "Sistema de ventas online para panadería Trigo de Oro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen">
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🍞</span>
                  <div>
                    <h1 className="text-3xl font-bold">Trigo de Oro</h1>
                    <p className="text-amber-100 text-sm">Panadería Artesanal</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-amber-900 text-white py-6 mt-auto">
            <div className="container mx-auto px-4 text-center">
              <p className="text-lg font-semibold mb-2">🍞 Trigo de Oro</p>
              <p className="text-amber-200 text-sm">
                © {new Date().getFullYear()} - Todos los derechos reservados
              </p>
              <p className="text-amber-300 text-xs mt-2">
                Sistema de Ventas v1.0
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}