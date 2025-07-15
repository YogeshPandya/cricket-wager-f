import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cricketLogo from '../../assets/cricket-logo.png';
import { loginUser } from '../../services/service'; // ✅ import login service

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Username and Password are required.');
      return;
    }

    setError('');

    try {
      const res = await loginUser({ username, password });

      if (res.data.status) {
        // ✅ Store token with correct key
        localStorage.setItem('access_token', res.data.data.access_token);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));

        alert('Login successful!');
        navigate('/home');
      } else {
        setError('Login failed: ' + res.data.message);
      }
    } catch (err) {
      console.error(err);
      setError('Login failed. Check console for more info.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-gray-900 text-white px-4">
      <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-xl text-center">
        <img src={cricketLogo} alt="Cricket Logo" className="w-32 h-32 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-2">
          <span className="text-green-400">Cricket</span>{' '}
          <span className="text-yellow-400">Wager</span>
        </h2>

        <h3 className="text-xl font-semibold text-yellow-300 mb-6">
          Login to your account
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-2/4 -translate-y-2/4 text-yellow-300"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {error && <div className="text-red-400 text-sm font-medium">{error}</div>}

          <div className="text-right text-sm">
            <Link to="/forgot-password" className="text-yellow-200 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-yellow-400 hover:from-green-600 hover:to-yellow-500 font-bold text-black transition"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-300 space-y-1">
          <div>
            Don't have an account?{' '}
            <Link to="/signup" className="text-yellow-300 hover:underline">
              Sign up
            </Link>
          </div>
          <div>
            <Link to="/admin/login" className="text-yellow-300 hover:underline">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
