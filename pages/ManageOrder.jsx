import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/authReducer';
import { toast } from 'react-toastify';
import { updateOrderStatus } from "../reducers/orderReducer";

function ManageOrder() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const orderStatuses = useSelector(state => state.orderStatus);

    const [orders, setOrders] = useState([]);
    const [showUserOrders, setShowUserOrders] = useState(false);
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [users, setUsers] = useState([]);
    const userRoles = [
        { value: "client", label: "Regular User" },
        { value: "admin", label: "Administrator" },
        { value: "chef", label: "Chef" }
    ];

    useEffect(() => {
        fetchUsers();
    }, []);
    
    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:8000/users");
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
            toast.error(`Error: ${err.message}`);
        }
    };
    

    const fetchOrdersByUserId = async (user) => {
        try {
            setShowUserOrders(true)
            setClient(user)
            const response = await fetch(`http://localhost:8000/orders/user/${user.id}`);
            if (!response.ok) throw new Error("Failed to fetch orders");
            const data = await response.json();
                setOrders({ [user.id]: data.map(order => ({
                    ...order,
                    created_at: new Date(order.created_at).toLocaleDateString('en-US', {
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
            }))});
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleStatusChange = async (orderId, newStatus) => {
        dispatch(updateOrderStatus(orderId, newStatus));
        toast.success(`Status updated to "${newStatus}"`);
        setOrders((prevOrders) => {
            const updated = { ...prevOrders };
            Object.keys(updated).forEach((userId) => {
                updated[userId] = updated[userId].map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
                );
            });
            return updated;
        });
    };



    return (
        <div className="p-6 space-y-8">
            <nav className="client-profile-navbar">
            <div className="client-profile-left-link">
                {user && <span className="client-profile-user-name">Hello, {user.name}!</span>}
            </div>
            <div className="client-profile-right-link">
                <button onClick={() => {navigate('/admin')}}
                className="client-profile-button"
                >
                Home
                </button>
                <button onClick={() => {
                dispatch(logout());
                navigate('/');
                }} 
                className="client-profile-button">
                Logout
                </button>
            </div>
            </nav>
            
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            {users.length === 0 ? (
                <p className="text-gray-500">No users found</p>
            ) : (
                <div>
                    {users.map(user => (
                        <div key={user.id} className="border rounded-xl p-4 bg-white shadow-sm">
                            {orders[user.id] ? (
                                    <div className="bg-gray-50 p-4 mt-6 rounded-xl shadow-inner">
                                        <h3 className="text-lg font-semibold mb-2">📋 Orders for {client.name}</h3>
                                        {orders[user.id].length === 0 ? (
                                        <p className="text-gray-500">No orders found for this user.</p>
                                        ) : (
                                        <div className="space-y-4">
                                            {orders[user.id].map(order => (
                                            <div key={order.id} className="border rounded p-4 m-2 bg-white shadow-sm">
                                                <p><strong>Order ID:</strong> {order.id}</p>
                                                <div className="mt-4">
                                                    <strong>Update Status:</strong>
                                                    <div className="grid grid-col space-y-2 mt-2">
                                                        {['pending', 'processing', 'completed', 'cancelled'].map((statusOption) => (
                                                            <label key={statusOption} className="flex items-center space-x-2">
                                                                <input
                                                                type="radio"
                                                                name={`status-${order.id}`}
                                                                value={statusOption}
                                                                checked={order.status === statusOption}
                                                                onChange={() => handleStatusChange(order.id, statusOption)}
                                                                />
                                                                <span className="capitalize">{statusOption}</span>
                                                            </label>
                                                        ))}
                                                    </div><br />
                                                </div>
                                                <p><strong>Total Price:</strong> ${order.total_price}</p>
                                                <p><strong>Total Calories:</strong> {order.total_calories}</p>
                                                <p><strong>Created At:</strong> {(order.created_at)}</p>
                                                <div className="mt-2">
                                                <strong>Items:</strong>
                                                <ul className="list-disc pl-5">
                                                    {order.items.map((item, index) => (
                                                        <li key={index}>
                                                            {item.name} – {item.quantity} pcs – ${item.price}
                                                        </li>
                                                    ))}
                                                </ul>
                                                </div>
                                            </div>
                                            ))}
                                        </div>
                                        )}
                                        <button 
                                        onClick={() => setOrders([])} 
                                        className="bg-gray-500 text-black px-4 py-2 rounded hover:bg-gray-600">
                                            Go Back
                                        </button>
                                    </div>
                            ) : (
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-lg font-medium">{user.name}</h4>
                                        <p className="text-gray-600">{user.email}</p>
                                        <div className="flex items-center mt-1 space-x-2">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                            user.role === 'chef' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                                            }`}>
                                            {userRoles.find(r => r.value === user.role)?.label || user.role}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => fetchOrdersByUserId(user)}
                                            className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            📦 View Orders
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ManageOrder;