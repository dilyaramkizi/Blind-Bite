import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/authReducer';


function ManageUsers() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userFormData, setUserFormData] = useState({ 
        name: "", 
        email: "", 
        role: "user" 
    });

    const userRoles = [
        { value: "client", label: "Regular User" },
        { value: "admin", label: "Administrator" },
        { value: "chef", label: "Chef" }
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const response = await fetch("http://localhost:8000/users");
        const data = await response.json();
        setUsers(data);
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setUserFormData({ 
            name: user.name, 
            email: user.email, 
            role: user.role 
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const updateUser = async () => {
        try {
            const response = await fetch(`http://localhost:8000/users/${selectedUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userFormData)
            });
    
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
    
            const updatedUser = await response.json();
            setUsers(users.map(u => (u.id === selectedUser.id ? updatedUser : u)));
            setSelectedUser(null);
            setUserFormData({ name: "", email: "", role: "user" });
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };
    
    const cancelUpdate = () => {
        setSelectedUser(null);
        setUserFormData({ name: "", email: "", role: "user" });
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
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4">Users</h3>
                {users.length === 0 ? (
                    <p className="text-gray-500">No users found</p>
                ) : (
                    <div className="space-y-4">
                        {users.map(user => (
                            <div key={user.id} className="border rounded-xl p-4 bg-white shadow-sm">
                                {selectedUser?.id === user.id ? (
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-medium">Edit User</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                                <input
                                                type="text"
                                                name="name"
                                                value={userFormData.name}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input
                                                type="email"
                                                name="email"
                                                value={userFormData.email}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                                <select
                                                    name="role"
                                                    value={userFormData.role}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border rounded"
                                                >
                                                {userRoles.map(role => (
                                                    <option key={role.value} value={role.value}>
                                                    {role.label}
                                                    </option>
                                                ))}
                                                </select>
                                            </div>
                                            </div>
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={updateUser}
                                                    className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600"
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={cancelUpdate}
                                                    className="bg-gray-500 text-black px-4 py-2 rounded hover:bg-gray-600"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
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
                                                    onClick={() => handleUserSelect(user)}
                                                    className="bg-gray-500 text-black px-4 py-2 rounded hover:bg-gray-600"
                                                >
                                                ✏️ Edit
                                                </button>
                                            </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );              
}

export default ManageUsers;