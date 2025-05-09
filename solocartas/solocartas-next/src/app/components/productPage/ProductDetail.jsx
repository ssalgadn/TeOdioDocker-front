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
  // Encontrar el precio más bajo entre todas las tiendas
  const lowestPrice = Math.min(...product.stores.map(store => store.price));
  
  // Configuración del gráfico
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Encabezado y imagen */}
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

          {/* Información general */}
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
          </div>
        </div>
      </div>

      {/* Gráfico de precios */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Evolución de precios</h2>
        <div className="h-[300px]">
          <Line options={chartOptions} data={chartData} />
        </div>
      </div>

      {/* Lista de tiendas */}
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
    </div>
  );
}
