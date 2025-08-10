import React, { useState } from 'react';
import cricketLogo from '../../assets/cricket-logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../../services/service';

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    referralCode: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        referralCode: formData.referralCode || '',
        name: formData.username,
      };

      const res = await signupUser(payload);

      if (res.data.status) {
        alert('Signup successful!');
        navigate('/login');
      } else {
        alert('Signup failed: ' + res.data.message);
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message;

      if (typeof errorMessage === 'string') {
        alert(`Signup failed: ${errorMessage}`);
      } else if (Array.isArray(errorMessage)) {
        alert('Signup failed:\n' + errorMessage.join('\n'));
      } else {
        console.error(err);
        alert('Signup failed. Please check console.');
      }
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
          Create your account
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-2/4 -translate-y-2/4 text-yellow-300"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="text"
            name="referralCode"
            placeholder="Referral Code (Optional)"
            value={formData.referralCode}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-yellow-400 hover:from-green-600 hover:to-yellow-500 font-bold text-black transition"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="text-yellow-300 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
