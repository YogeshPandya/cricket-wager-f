import React, { useState } from 'react';
import AuthLayout from '../../components/AuthLayout';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Forgot Password", email);
  };

  return (
    <AuthLayout title="Forgot Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn btn-primary w-full" type="submit">Reset Password</button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
