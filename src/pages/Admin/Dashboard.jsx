// src/pages/admin/Dashboard.jsx
import React from 'react';
import AdminLayout from './components/AdminLayout';

const users = [
  { id: 1, name: 'Yogesh Pandya', email: 'yogesh@example.com' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
];

export default function Dashboard() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-green-800 font-semibold">
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} className="border-t">
                <td className="py-2">{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
