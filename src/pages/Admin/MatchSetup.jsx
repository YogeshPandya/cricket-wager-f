// src/pages/admin/MatchSetup.jsx
import React, { useState } from 'react';
import AdminLayout from './components/AdminLayout';

const countries = [
  { name: 'India', code: 'in' },
  { name: 'Australia', code: 'au' },
  { name: 'England', code: 'gb' },
  { name: 'Pakistan', code: 'pk' },
  { name: 'South Africa', code: 'za' },
  { name: 'New Zealand', code: 'nz' },
];

export default function MatchSetup() {
  const [form, setForm] = useState({
    teamA: '',
    teamB: '',
    date: '',
    time: '',
  });

  const [matches, setMatches] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMatch = {
      ...form,
      id: matches.length + 1,
      logoA: `https://flagcdn.com/w80/${form.teamA}.png`,
      logoB: `https://flagcdn.com/w80/${form.teamB}.png`,
    };
    setMatches([...matches, newMatch]);
    setForm({ teamA: '', teamB: '', date: '', time: '' });
  };

  const teamBOptions = countries.filter((c) => c.code !== form.teamA);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 text-green-700">Match Setup</h1>

      {/* Match Setup Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            name="teamA"
            value={form.teamA}
            onChange={handleChange}
            className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          >
            <option value="" disabled>Select Team A</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>

          <select
            name="teamB"
            value={form.teamB}
            onChange={handleChange}
            className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          >
            <option value="" disabled>Select Team B</option>
            {teamBOptions.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            name="date"
            type="date"
            className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={form.date}
            onChange={handleChange}
            required
          />

          <input
            name="time"
            type="time"
            className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={form.time}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn w-full bg-gradient-to-r from-green-500 to-yellow-400 text-white font-bold py-2 rounded-lg hover:from-green-600 hover:to-yellow-500 shadow-md"
        >
          Create Match
        </button>
      </form>

      {/* Match List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-green-600">Scheduled Matches</h2>
        {matches.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No matches scheduled yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {matches.map((match) => (
              <div key={match.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                <div className="text-sm text-gray-600 font-semibold mb-2">
                  {match.date} at {match.time}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center">
                    <img src={match.logoA} alt={match.teamA} className="w-10 h-10 rounded-full" />
                    <span className="text-xs mt-1 font-medium">
                      {countries.find(c => c.code === match.teamA)?.name}
                    </span>
                  </div>
                  <div className="text-yellow-600 font-bold text-lg">VS</div>
                  <div className="flex flex-col items-center">
                    <img src={match.logoB} alt={match.teamB} className="w-10 h-10 rounded-full" />
                    <span className="text-xs mt-1 font-medium">
                      {countries.find(c => c.code === match.teamB)?.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
