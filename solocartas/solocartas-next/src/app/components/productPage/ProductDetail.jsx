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
import { MessageCircle, Send, UserCircle, Star } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import StarRating from '@/app/components/shared/StarRating';

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
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

  const [showPriceHistoryModal, setShowPriceHistoryModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [ratings, setRatings] = useState({});
  const { isAuthenticated, user } = useAuth();

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/comments/${product.id}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (e) {
        console.error('Error fetching comments', e);
      }
    };
    fetchComments();
  }, [BACKEND_URL, product.id]);

  // Fetch ratings for stores
  useEffect(() => {
    const fetchRatings = async () => {
      if (!product.prices) return;
      const entries = await Promise.all(
        product.prices.map(async (p) => {
          try {
            const res = await fetch(`${BACKEND_URL}/reviews/${p.store.id}`);
            if (!res.ok) return [p.store.id, null];
            const data = await res.json();
            if (Array.isArray(data) && data.length)
              return [p.store.id, data.reduce((acc, cur) => acc + cur.rating, 0) / data.length];
            return [p.store.id, null];
          } catch (e) {
            return [p.store.id, null];
          }
        })
      );
      setRatings(Object.fromEntries(entries));
    };
    fetchRatings();
  }, [BACKEND_URL, product.prices]);
  const { theme } = useTheme();

  // Mock price history data if not available
  const MOCK_PRICE_HISTORY_COUNT = 7;
  const getMockPriceHistory = () => {
    const history = [];
    const today = new Date();
    for (let i = MOCK_PRICE_HISTORY_COUNT - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i * 30); // roughly monthly intervals
      history.push({
        date: date.toISOString(),
        avgPrice: Math.floor(Math.random() * (30000 - 5000 + 1)) + 5000, // Random price between 5000 and 30000
      });
    }
    return history;
  };

  const priceHistory = (product.priceHistory && product.priceHistory.length > 0) 
    ? product.priceHistory 
    : getMockPriceHistory();

  const handleOverlayClick = (e) => {
    // If the click is on the overlay itself (not its children), close the modal.
    if (e.target === e.currentTarget) {
      setShowPriceHistoryModal(false);
    }
  };
  const lowestPrice = product.prices && product.prices.length > 0 ? Math.min(...product.prices.map(p => p.price)) : product.min_price || 0;
  
  const chartData = {
    labels: priceHistory ? priceHistory.map(item => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getFullYear()}`;
    }) : [],
    datasets: [
      {
        label: 'Precio promedio',
        data: priceHistory ? priceHistory.map(item => item.avgPrice) : [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme === 'dark' ? '#E5E7EB' : '#4B5563', // gray-200 dark, gray-600 light
        }
      },
      title: {
        display: true,
        text: 'Historial de Precios',
        color: theme === 'dark' ? '#F3F4F6' : '#1F2937', // gray-100 dark, gray-800 light
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => formatPriceCLP(value),
          color: theme === 'dark' ? '#D1D5DB' : '#6B7280', // gray-300 dark, gray-500 light
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        ticks: {
          color: theme === 'dark' ? '#D1D5DB' : '#6B7280', // gray-300 dark, gray-500 light
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }
      }
    },
  }), [theme]);




  // const comments = product.comments || []; // Comments are not part of ProductDetailData from API yet

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="relative">
          <img
            src={product.img_url}
            alt={product.name}
            className="w-full max-w-md max-h-96 object-contain mx-auto rounded-lg shadow"
          />
          {priceHistory && priceHistory.length > 0 && (
            <button
              onClick={() => setShowPriceHistoryModal(true)}
              className="mt-4 w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Ver historial de precios
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{product.name}</h1>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Desde</p>
              <p className="text-2xl font-semibold text-green-600">
                {formatPriceCLP(lowestPrice > 0 ? lowestPrice : (product.min_price || 0))}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
              {product.edition || product.rarity || 'N/A'}
            </span>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">Descripción</h2>
            <p className="text-gray-700 dark:text-gray-300 mt-2">{product.description || 'No hay descripción disponible.'}</p>
            
            <dl className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Juego:</dt>
                <dd className="text-gray-900 dark:text-gray-200">{product.game || 'N/A'}</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Edición:</dt>
                <dd className="text-gray-900 dark:text-gray-200">{product.edition || 'N/A'}</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Tipo:</dt>
                <dd className="text-gray-900 dark:text-gray-200">{product.product_type || 'N/A'}</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Idioma:</dt>
                <dd className="text-gray-900 dark:text-gray-200">{product.language || 'N/A'}</dd>
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

      {showPriceHistoryModal && priceHistory && priceHistory.length > 0 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
          onClick={handleOverlayClick} // Add click handler to overlay
        >
          <div className="bg-white dark:bg-slate-700 p-6 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold dark:text-gray-100">Evolución de precios</h2>
              <button 
                onClick={() => setShowPriceHistoryModal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="h-[300px] md:h-[400px]">
              <Line options={chartOptions} data={chartData} />
            </div>
            <button 
              onClick={() => setShowPriceHistoryModal(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition duration-150 ease-in-out"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-6 dark:text-gray-100">Disponible en tiendas</h2>
        <div className="grid grid-cols-1 gap-4">
          {product.prices && product.prices.length > 0 ? product.prices.sort((a, b) => a.price - b.price).map(priceEntry => (
            <div key={priceEntry.id || priceEntry.store.id} className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition bg-gray-50 dark:bg-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold dark:text-gray-100">{priceEntry.store.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Condición: {priceEntry.condition}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">{formatPriceCLP(priceEntry.price)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{priceEntry.stock > 0 ? `${priceEntry.stock} disponible(s)` : 'No disponible'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex flex-col items-start">
                  <StarRating 
                    initialRating={ratings[priceEntry.store.id] || 0} 
                    readonly={!isAuthenticated}
                    onRatingChange={async (newRating) => {
                      if (!isAuthenticated) return;
                      try {
                        await fetch(`${BACKEND_URL}/reviews/`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            user: user?.email || 'Anon',
                            store_id: priceEntry.store.id,
                            rating: newRating,
                          }),
                        });
                        setRatings((prev) => {
                          const current = prev[priceEntry.store.id] || 0;
                          const updated = current ? (current + newRating) / 2 : newRating;
                          return { ...prev, [priceEntry.store.id]: updated };
                        });
                      } catch (e) {
                        console.error('Error posting rating', e);
                      }
                    }} 
                    size={18} 
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {ratings[priceEntry.store.id] ? `Promedio: ${ratings[priceEntry.store.id].toFixed(1)}/5` : 'Sin calificación aún'}
                  </span>
                </div>
                <a
                  href={priceEntry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Ver en tienda →
                </a>
              </div>
            </div>
          ))
          : <p className="text-gray-500 dark:text-gray-400">No hay ofertas disponibles para este producto en este momento.</p>}
        </div>
      </div>
      
      <div className="mt-10 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 dark:text-gray-100">Comentarios</h2>
        
        <div className="mb-8 p-6 bg-gray-50 dark:bg-slate-700 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">Deja tu comentario</h3>
          <textarea 
            className={`w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out ${!isAuthenticated ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
            rows="4" 
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={isAuthenticated ? "Escribe tu opinión sobre este producto..." : "Debes iniciar sesión para comentar"}
            disabled={!isAuthenticated}
          ></textarea>
          <button 
            type="button" 
            onClick={async () => {
              if (!commentText.trim()) return;
              try {
                const res = await fetch(`${BACKEND_URL}/comments/`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    user: user?.email || 'Anon',
                    product_id: product.id,
                    text: commentText.trim(),
                  }),
                });
                if (res.ok) {
                  const saved = await res.json();
                  setComments((prev) => [...prev, saved]);
                  setCommentText('');
                }
              } catch (e) {
                console.error('Error posting comment', e);
              }
            }}
            className={`mt-4 px-6 py-2 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out flex items-center ${isAuthenticated ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            disabled={!isAuthenticated}
          >
            <Send size={18} className="mr-2" />
            Enviar Comentario
          </button>
        </div>

        {/* List of Comments */}
        <div className="space-y-6">
          {comments && comments.length > 0 ? (
            comments.map((comment, index) => (              <div key={comment.id || index} className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg mb-4">
                <div className="flex items-center mb-3">
                  <UserCircle size={32} className="mr-3 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{comment.user || 'Usuario Anónimo'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{comment.date ? new Date(comment.date).toLocaleDateString() : 'Fecha desconocida'}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed dark:text-gray-300">
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