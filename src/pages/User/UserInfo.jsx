import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';

export default function UserInfo({ setUser }) {
  const navigate = useNavigate();

  const savedUser = JSON.parse(localStorage.getItem('user')) || {
    username: '',
    email: '',
  };

  const token = localStorage.getItem('access_token');

  const [name, setName] = useState(savedUser.username);
  const [email, setEmail] = useState(savedUser.email);

  const handleConfirm = async () => {
    const updatedUser = { username: name, email };

    if (!token) {
      alert('Token not found. Please login again.');
      localStorage.removeItem('user');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/user/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json();

      if (response.status === 401 || data.message === 'Invalid token') {
        alert('Session expired. Please login again.');
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        navigate('/login');
        return;
      }

      if (response.ok) {
        const newUser = { ...savedUser, username: name, email };
        localStorage.setItem('user', JSON.stringify(newUser));
        if (setUser) setUser(newUser);
        alert('User info updated successfully!');
        navigate('/account');
      } else {
        alert(data.message || 'Failed to update user info.');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Something went wrong. Try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white p-4">
      <button
        onClick={() => navigate('/account')}
        className="text-yellow-300 mb-6 font-semibold text-lg hover:underline"
      >
        ← Back
      </button>

      <div className="flex items-center gap-2 mb-6">
        <PersonIcon className="text-yellow-300" fontSize="large" />
        <h1 className="text-2xl font-bold">User Information</h1>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-xl text-black font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-xl text-black font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter your email"
          />
        </div>

        <button
          onClick={handleConfirm}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl text-lg shadow transition"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
