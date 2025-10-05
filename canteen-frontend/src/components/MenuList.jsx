import React, { useState, useEffect, useContext } from 'react'; 
import apiClient from '../services/api';
import { CartContext } from '../context/CartContext'; 

function MenuList() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useContext(CartContext); // Get the addToCart function

  useEffect(() => {
    apiClient.get('/menu')
      .then(response => {
        setMenuItems(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching menu items:', error);
        setError('Failed to load menu. Is the backend server running?');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center">Loading menu...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {menuItems.map(item => (
        <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          <div className="p-6 flex-grow">
            <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
            <p className="text-gray-600 mb-4">{item.description}</p>
          </div>
          <div className="p-6 bg-gray-50 flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">₹{item.price}</span>
            <button
              onClick={() => addToCart(item)}
              disabled={item.stock === 0}
              className={`px-4 py-2 rounded font-semibold text-white ${
                item.stock === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {item.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuList;