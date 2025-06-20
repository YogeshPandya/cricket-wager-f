import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person'; // 👈 Icon import

export default function UserInfo({ setUser }) {
  const navigate = useNavigate();

  const savedUser = JSON.parse(localStorage.getItem('user')) || {
    name: 'Rahul Sharma',
    mobile: '9876543210',
    email: 'rahul@example.com'
  };

  const [name, setName] = useState(savedUser.name);
  const [mobile, setMobile] = useState(savedUser.mobile);
  const [email, setEmail] = useState(savedUser.email);

  const handleConfirm = () => {
    const updatedUser = { name, mobile, email };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    if (setUser) setUser(updatedUser);
    alert('User info updated!');
    navigate('/account');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/account')}
        className="text-yellow-300 mb-4 font-medium"
      >
        ← Back
      </button>

      {/* Heading with Icon */}
      <div className="flex items-center gap-2 mb-6">
        <PersonIcon className="text-yellow-300" fontSize="large" />
        <h1 className="text-2xl font-bold">User Information</h1>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Name Input */}
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

        {/* Mobile Input */}
        <div>
          <label className="block mb-1 text-sm font-medium">Mobile Number</label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full px-4 py-2 rounded-xl text-black font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter mobile number"
          />
        </div>

        {/* Email Input */}
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

        {/* Confirm Button */}
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
