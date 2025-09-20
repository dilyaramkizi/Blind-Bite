// History.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const History = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
  
      try {
        const response = await fetch(`http://localhost:8000/orders/user/${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch orders');
  
        const data = await response.json();
  
        setOrders(data.map(order => ({
          ...order,
          created_at: new Date(order.created_at).toLocaleDateString('en-US', {
            timeZone: 'Asia/Almaty', // Ensure the date is in Almaty timezone
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          items: order.items.map(item => ({
            ...item,
            price: Number(item.price),
            image_path: item.image_path || '/default-food.jpg'
          }))
        })));
  
        // No need to dismiss loading toast here
        if (data.length === 0) {
          toast.info('No orders found - time to start your culinary journey!');
        }
  
      } catch (err) {
        toast.error(`Order history unavailable: ${err.message}`);
      }
    };
  
    if (user?.id) {
      fetchOrders();
    }
  }, [user]);  

  return (
    <div className="history-container">
      {/* Back Button */}
      <div className="d-flex justify-content-start mb-4">
        <button 
          className="btn btn-outline-primary"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </button>
      </div>

      <h2 className="history-title">Order History</h2>
      
      {orders.length > 0 && (
        <div className="history-orders">
          {orders.map((order) => (
            <div key={order.id} className="history-order-card">
              <div className="order-header">
                <div className="order-meta">
                  <h3 className="order-date">🗓️ {order.created_at}</h3>
                  <span className={`order-status order-status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-totals">
                  <span className="order-price">Total: ${order.total_price.toFixed(2)}</span>
                  <span className="order-calories">{order.total_calories} calories</span>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <div key={`${order.id}-${item.name}`} className="history-item">
                   <img 
                      src={`http://localhost:8000/${item.image_path}`} 
                      alt={item.name}
                      className="item-image"
                    />
                    <div className="item-info">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-description">{item.description}</p>
                      <div className="item-meta">
                        <span className="item-quantity">Quantity: {item.quantity}</span>
                        <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;