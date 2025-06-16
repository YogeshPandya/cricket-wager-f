import React, { useState } from 'react';
import AuthLayout from '../../components/AuthLayout';

const UserSignup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Signup", form);
  };

  return (
    <AuthLayout title="User Signup">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          name="name"
          className="input input-bordered w-full"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          className="input input-bordered w-full"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="input input-bordered w-full"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="btn btn-primary w-full" type="submit">Signup</button>
      </form>
    </AuthLayout>
  );
};

export default UserSignup;
