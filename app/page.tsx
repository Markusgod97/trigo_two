import Link from 'next/link';
import { ShoppingBag, UserPlus, LogIn, Receipt } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-6xl font-bold text-amber-800 mb-4">
          Bienvenido a Trigo de Oro
        </h1>
        <p className="text-2xl text-gray-600 mb-2">
          La mejor panadería artesanal
        </p>
        <p className="text-lg text-gray-500">
          Pan fresco horneado todos los días 🥖
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Login Card */}
        <Link 
          href="/login"
          className="group bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 group-hover:bg-blue-200 p-4 rounded-full mb-4 transition-colors">
              <LogIn className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Iniciar Sesión
            </h3>
            <p className="text-gray-600 text-sm">
              Accede a tu cuenta
            </p>
          </div>
        </Link>

        {/* Registro Card */}
        <Link 
          href="/registro"
          className="group bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 group-hover:bg-green-200 p-4 rounded-full mb-4 transition-colors">
              <UserPlus className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Registrarse
            </h3>
            <p className="text-gray-600 text-sm">
              Crea una cuenta nueva
            </p>
          </div>
        </Link>

        {/* Menu Card */}
        <Link 
          href="/menu"
          className="group bg-white hover:bg-gradient-to-br hover:from-amber-50 hover:to-amber-100 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-amber-100 group-hover:bg-amber-200 p-4 rounded-full mb-4 transition-colors">
              <ShoppingBag className="w-12 h-12 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Ver Menú
            </h3>
            <p className="text-gray-600 text-sm">
              Explora nuestros productos
            </p>
          </div>
        </Link>

        {/* Compras Card */}
        <Link 
          href="/compras"
          className="group bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-100 group-hover:bg-purple-200 p-4 rounded-full mb-4 transition-colors">
              <Receipt className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Mis Compras
            </h3>
            <p className="text-gray-600 text-sm">
              Ver historial
            </p>
          </div>
        </Link>
      </div>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white rounded-xl shadow-md">
          <div className="text-4xl mb-3">🕐</div>
          <h3 className="font-bold text-lg mb-2">Horarios</h3>
          <p className="text-gray-600 text-sm">
            Lunes a Sábado<br />6:00 AM - 8:00 PM
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-xl shadow-md">
          <div className="text-4xl mb-3">🚚</div>
          <h3 className="font-bold text-lg mb-2">Envíos</h3>
          <p className="text-gray-600 text-sm">
            Domicilios gratis<br />Compras mayores a $50.000
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-xl shadow-md">
          <div className="text-4xl mb-3">⭐</div>
          <h3 className="font-bold text-lg mb-2">Calidad</h3>
          <p className="text-gray-600 text-sm">
            Ingredientes 100%<br />naturales y frescos
          </p>
        </div>
      </div>
    </div>
  );
}