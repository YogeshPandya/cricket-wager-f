import React, { useState } from 'react';
import AuthLayout from '../../components/AuthLayout'; // Assuming you want to keep your existing layout wrapper

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Login", { username, password });
  };

  return (
    <AuthLayout title="User Login">
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Logo" className="h-12" /> 
            {/* replace /logo.png with your actual logo path */}
          </div>

          {/* Title */}
          <h2 className="text-center text-2xl font-bold mb-6 text-green-700">
            CRICKET<span className="text-orange-500">WAGER</span>
          </h2>

          {/* Tabs */}
          <div className="flex justify-between border-b mb-6">
            <button className="border-b-2 border-blue-500 pb-2 font-semibold text-blue-600 w-1/2">LOGIN</button>
            <button className="pb-2 font-semibold text-gray-400 w-1/2">SIGN UP</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="border rounded-md p-3 w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border rounded-md p-3 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-right">
              <a href="#" className="text-blue-500 text-sm">Forgot Password?</a>
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 w-full rounded shadow"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default UserLogin;
