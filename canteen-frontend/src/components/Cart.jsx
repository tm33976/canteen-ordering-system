import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import apiClient from '../services/api'; 
import { useNavigate } from 'react-router-dom'; 

function Cart() {
  //Get clearCart from context and initialize navigate
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  //Function to handle placing the order
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    const orderData = {
      items: cartItems.map(item => ({
        menuItemId: item._id,
        quantity: item.quantity,
      })),
    };

    try {
      // Send the order to the backend
      const response = await apiClient.post('/orders', orderData);
      const newOrder = response.data;
      
      // Clear the cart in the frontend state
      clearCart();
      
      // Redirect to the order status page
      navigate(`/order/${newOrder._id}`);
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. The kitchen might be out of stock. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item._id} className="flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold">{item.name}</p>
                <div className="flex items-center mt-1">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                  <p className="mx-2">{item.quantity}</p>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                </div>
              </div>
              <div className="text-right">
                <p>₹{item.price * item.quantity}</p>
                <button onClick={() => removeFromCart(item._id)} className="text-red-500 text-sm hover:underline">Remove</button>
              </div>
            </div>
          ))}
          <hr className="my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>₹{totalPrice}</span>
          </div>
          <button 
            onClick={handlePlaceOrder}
            disabled={cartItems.length === 0}
            className="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;