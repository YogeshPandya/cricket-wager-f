import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConfirmReset() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-green-600 to-gray-900 flex flex-col justify-center items-center px-4">
      <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-4">Change Your Password?</h1>
        <p className="text-center text-gray-600 mb-8">
          If you choose <span className="font-semibold text-green-700">"Yes"</span>, you’ll be logged out and redirected to reset your password.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              localStorage.removeItem('token'); // Optional: clear token if you're using it
              navigate('/forgot-password');
            }}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2.5 px-6 rounded-xl shadow-md transition-all duration-200"
          >
            Yes, Reset
          </button>
          <button
            onClick={() => navigate('/account')}
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md transition-all duration-200"
          >
            No, Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
