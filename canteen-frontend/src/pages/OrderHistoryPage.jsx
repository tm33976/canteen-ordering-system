import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { Link } from 'react-router-dom';

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient.get('/orders')
      .then(response => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch order history.');
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Awaiting Pickup':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <p>Loading history...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const OrderCardContent = ({ order }) => (
    <>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold">Order ID: {order._id}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>
      <div className="mt-4">
        {order.items.map(item => (
          <div key={item.menuItemId} className="flex justify-between text-sm">
            <span>{item.name} x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <hr className="my-2" />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            // If the order is awaiting pickup, wrap it in a Link. Otherwise, use a regular div.
            order.status === 'Awaiting Pickup' ? (
              <Link key={order._id} to={`/order/${order._id}`} className="block border p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                <OrderCardContent order={order} />
              </Link>
            ) : (
              <div key={order._id} className="border p-4 rounded-lg">
                <OrderCardContent order={order} />
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistoryPage;