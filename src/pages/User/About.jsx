// src/pages/User/About.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/account')}
        className="text-yellow-300 mb-4 font-medium"
      >
        ← Back
      </button>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">About Us</h1>

      {/* About Content */}
      <div className="bg-white bg-opacity-10 p-4 rounded-xl text-sm text-white space-y-4">
        <p>
          <span className="text-yellow-300 font-semibold">Cricket Wager</span> is an exciting and dynamic cricket match prediction platform that allows users to place bets and test their cricket knowledge and instincts.
        </p>
        <p>
          Our mission is to make cricket even more engaging by letting fans participate in prediction-based betting in a fun and responsible manner.
        </p>
        <p>
          Whether you're a die-hard cricket fan or a casual follower, Cricket Wager gives you the chance to make each match even more thrilling by placing virtual bets on outcomes.
        </p>
        <p>
          Our platform is designed for user-friendly and secure usage. With features like recharge, withdrawal, match tracking, user profile management, and full transparency, we aim to provide a seamless betting experience.
        </p>
        <p>
          Join <span className="text-yellow-300 font-semibold">Cricket Wager</span> today and turn your cricket passion into exciting predictions!
        </p>
      </div>
    </div>
  );
}
