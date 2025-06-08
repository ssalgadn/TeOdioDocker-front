'use client';

import { formatPriceCLP } from '@/utils/format';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { MessageCircle, Send, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ProductDetail({ product }) {
  const { isAuthenticated, user } = useAuth();
  const lowestPrice = Math.min(...product.stores.map(store => store.price));
  
  const chartData = {
    labels: product.priceHistory.map(item => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getFullYear()}`;
    }),
    datasets: [
      {
        label: 'Precio promedio',
        data: product.priceHistory.map(item => item.avgPrice),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Historial de Precios',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => formatPriceCLP(value),
        },
      },
    },
  };

  const comments = product.comments || [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow"
          />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Desde</p>
              <p className="text-2xl font-semibold text-green-600">
                {formatPriceCLP(lowestPrice)}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              {product.generalInfo.rarity}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-xl font-semibold mb-2">Información general</h2>
            <p className="text-gray-600 mb-4">{product.generalInfo.description}</p>
            
            <dl className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="font-medium text-gray-500">Set:</dt>
                <dd className="text-gray-900">{product.generalInfo.setName}</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="font-medium text-gray-500">Número:</dt>
                <dd className="text-gray-900">{product.generalInfo.cardNumber}</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="font-medium text-gray-500">Categoría:</dt>
                <dd className="text-gray-900">{product.generalInfo.category}</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="font-medium text-gray-500">Fecha de lanzamiento:</dt>
                <dd className="text-gray-900">{new Date(product.generalInfo.releaseDate).toLocaleDateString()}</dd>
              </div>
            </dl>

            {/* Botón Avísame cuando baje de precio */}
            <div className="mt-6">
              {isAuthenticated ? (
                <button
                  onClick={() => alert(`Se avisará al mail ${user?.email || 'registrado'} cuando este producto baje de precio.`)}
                  className="w-full px-6 py-3 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                >
                  Avísame cuando baje de precio
                </button>
              ) : (
                <div title="Debes iniciar sesión para esta opción" className="w-full">
                  <button
                    disabled
                    className="w-full px-6 py-3 bg-gray-300 text-gray-500 font-semibold rounded-md cursor-not-allowed"
                  >
                    Avísame cuando baje de precio
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Evolución de precios</h2>
        <div className="h-[300px]">
          <Line options={chartOptions} data={chartData} />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Disponible en tiendas</h2>
        <div className="grid grid-cols-1 gap-4">
          {product.stores.sort((a, b) => a.price - b.price).map(store => (
            <div key={store.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{store.name}</h3>
                  <p className="text-sm text-gray-500">Condición: {store.condition}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">{formatPriceCLP(store.price)}</p>
                  <p className="text-sm text-gray-500">{store.stock} disponibles</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-sm text-gray-600 ml-1">{store.rating}/5</span>
                </div>
                <a
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Ver en tienda →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-10 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
          <MessageCircle size={28} className="mr-3 text-blue-600" />
          Comentarios
        </h2>
        
        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Deja tu comentario</h3>
          <textarea 
            className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out ${!isAuthenticated ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
            rows="4" 
            placeholder={isAuthenticated ? "Escribe tu opinión sobre este producto..." : "Debes iniciar sesión para comentar"}
            disabled={!isAuthenticated}
          ></textarea>
          <button 
            type="button" 
            className={`mt-4 px-6 py-2 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out flex items-center ${isAuthenticated ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            disabled={!isAuthenticated}
          >
            <Send size={18} className="mr-2" />
            Enviar Comentario
          </button>
        </div>

        {/* List of Comments */}
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={comment.id || index} className="p-5 bg-white rounded-lg shadow border border-gray-100">
                <div className="flex items-center mb-3">
                  <UserCircle size={32} className="mr-3 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-800">{comment.user || 'Usuario Anónimo'}</p>
                    <p className="text-xs text-gray-500">{comment.date ? new Date(comment.date).toLocaleDateString() : 'Fecha desconocida'}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {comment.text}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">Aún no hay comentarios para este producto. ¡Sé el primero!</p>
          )}
        </div>
      </div>
    </div>
  );
}