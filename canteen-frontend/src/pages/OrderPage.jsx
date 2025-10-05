import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/api'; 

function OrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState('');

  // Effect to fetch the order details
  useEffect(() => {
    apiClient.get(`/orders/${orderId}`)
      .then(response => {
        setOrder(response.data);
      })
      .catch(err => {
        console.error("Error fetching order:", err);
        setError("Could not find your order.");
      });
  }, [orderId]);

  // Effect to set up the timer once the order is fetched
  useEffect(() => {
    if (!order) return;

    // Calculate the expiration time (15 minutes after creation)
    const expirationTime = new Date(order.createdAt).getTime() + 15 * 60 * 1000;

    const updateTimer = () => {
      const currentTime = new Date().getTime();
      const remainingTime = Math.round((expirationTime - currentTime) / 1000);
      setTimeLeft(Math.max(0, remainingTime));
    };
    
    updateTimer(); // Set the initial time immediately
    const timerInterval = setInterval(updateTimer, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(timerInterval);

  }, [order]); // This effect runs whenever the 'order' state changes

  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (timeLeft === null) return <p className="text-center">Loading order details...</p>;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-center bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Thank You For Your Order!</h1>
      <p className="text-gray-600 mb-2">Your Order ID is: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{orderId}</span></p>
      <p className="text-lg">Please pay and pick up your order at the counter within:</p>
      <div className={`text-6xl font-bold my-4 ${timeLeft < 300 ? 'text-red-500' : 'text-blue-600'}`}>
        {timeLeft > 0 ? `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}` : '00:00'}
      </div>
      {timeLeft > 0 ? (
        <p className="text-gray-500">If not collected, your order will be automatically cancelled.</p>
      ) : (
        <p className="text-red-600 font-semibold">The time limit for this order has expired. It may have been cancelled.</p>
      )}
    </div>
  );
}

export default OrderPage;