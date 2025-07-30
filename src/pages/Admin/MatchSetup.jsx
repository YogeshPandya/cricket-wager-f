// src/pages/admin/MatchSetup.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from './components/AdminLayout';
import { createMatch, getAllMatches, deleteMatch } from '../../services/service'; // Adjust path if needed
import TeamA from '../../assets/TeamA.png';
import TeamB from '../../assets/TeamB.png';


const leagueTeams = {
  International: [
    { name: 'India', code: 'IN' },
    { name: 'Australia', code: 'AU' },
    { name: 'England', code: 'GB' },
    { name: 'Pakistan', code: 'PK' },
    { name: 'South Africa', code: 'ZA' },
    { name: 'New Zealand', code: 'NZ' },
    { name: 'Sri Lanka', code: 'SL' },
    { name: 'Bangladesh', code: 'BD' },
    { name: 'Afghanistan', code: 'AF' },
    { name: 'Ireland', code: 'IE' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'Zimbabwe', code: 'ZW' },
    { name: 'UAE', code: 'AE' },
    { name: 'Scotland', code: 'SC' },
    { name: 'Namibia', code: 'NA' },
    { name: 'Nepal', code: 'NP' }
  ],
  IPL: [
    { name: 'Mumbai Indians', code: 'MI' },
    { name: 'Chennai Super Kings', code: 'CSK' },
    { name: 'Royal Challengers Bangalore', code: 'RCB' },
    { name: 'Kolkata Knight Riders', code: 'KKR' },
    { name: 'Sunrisers Hyderabad', code: 'SRH' },
    { name: 'Delhi Capitals', code: 'DC' },
    { name: 'Punjab Kings', code: 'PBKS' },
    { name: 'Rajasthan Royals', code: 'RR' },
    { name: 'Lucknow Super Giants', code: 'LSG' },
    { name: 'Gujarat Titans', code: 'GT' }
  ],
  PSL: [
    { name: 'Lahore Qalandars', code: 'LQ' },
    { name: 'Karachi Kings', code: 'KK' },
    { name: 'Peshawar Zalmi', code: 'PZ' },
    { name: 'Quetta Gladiators', code: 'QG' },
    { name: 'Islamabad United', code: 'IU' },
    { name: 'Multan Sultans', code: 'MS' }
  ],
  BBL: [
    { name: 'Sydney Sixers', code: 'SS' },
    { name: 'Sydney Thunder', code: 'ST' },
    { name: 'Melbourne Stars', code: 'MS' },
    { name: 'Melbourne Renegades', code: 'MR' },
    { name: 'Perth Scorchers', code: 'PS' },
    { name: 'Adelaide Strikers', code: 'AS' },
    { name: 'Brisbane Heat', code: 'BH' },
    { name: 'Hobart Hurricanes', code: 'HH' }
  ],
  SA20: [
    { name: 'Pretoria Capitals', code: 'PC' },
    { name: 'Joburg Super Kings', code: 'JSK' },
    { name: 'Durban Super Giants', code: 'DSG' },
    { name: 'MI Cape Town', code: 'MICT' },
    { name: 'Paarl Royals', code: 'PR' },
    { name: 'Sunrisers Eastern Cape', code: 'SEC' }
  ],
  CPL: [
    { name: 'Barbados Royals', code: 'BR' },
    { name: 'Guyana Amazon Warriors', code: 'GAW' },
    { name: 'Jamaica Tallawahs', code: 'JT' },
    { name: 'St Kitts & Nevis Patriots', code: 'SNP' },
    { name: 'St Lucia Kings', code: 'SLK' },
    { name: 'Trinbago Knight Riders', code: 'TKR' }
  ],
  'Abu Dhabi T10': [
    { name: 'Deccan Gladiators', code: 'DG' },
    { name: 'Delhi Bulls', code: 'DB' },
    { name: 'Bangla Tigers', code: 'BT' },
    { name: 'New York Strikers', code: 'NYS' },
    { name: 'Team Abu Dhabi', code: 'TAD' },
    { name: 'Morrisville Samp Army', code: 'MSA' }
  ],
  'The Hundred': [
    { name: 'Oval Invincibles', code: 'OI' },
    { name: 'Trent Rockets', code: 'TR' },
    { name: 'Manchester Originals', code: 'MO' },
    { name: 'London Spirit', code: 'LS' },
    { name: 'Welsh Fire', code: 'WF' },
    { name: 'Northern Superchargers', code: 'NS' },
    { name: 'Birmingham Phoenix', code: 'BP' },
    { name: 'Southern Brave', code: 'SB' }
  ]
};

const formats = ['T20', 'T10', 'ODI', 'Test', 'Hundred'];
const getLogoByCode = (code) => {
  switch (code) {
    case 'IN':
    case 'MI':
    case 'LQ':
    case 'SS':
    case 'PC':
    case 'BR':
    case 'DG':
    case 'OI':
      return TeamA;
    case 'AU':
    case 'CSK':
    case 'KK':
    case 'ST':
    case 'JSK':
    case 'GAW':
    case 'DB':
    case 'TR':
      return TeamB;
    default:
      return TeamB; // fallback
  }
};


export default function MatchSetup() {
  const [form, setForm] = useState({
    league: '',
    teamA: '',
    teamB: '',
    date: '',
    time: '',
    format: '',
    series: ''
  });

  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await getAllMatches();
        const processed = data.map((match) => {
          const teamA = Object.values(leagueTeams)
            .flat()
            .find(team => team.name === match.teamA);
          const teamB = Object.values(leagueTeams)
            .flat()
            .find(team => team.name === match.teamB);

          return {
            ...match,
            teamA: teamA?.code || match.teamA,
            teamB: teamB?.code || match.teamB,
            id: match._id,
          };
        });

        setMatches(processed);
      } catch (error) {
        console.error('Failed to fetch matches:', error);
      }
    };

    fetchMatches();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const teamAObj = leagueTeams[form.league]?.find(t => t.code === form.teamA);
    const teamBObj = leagueTeams[form.league]?.find(t => t.code === form.teamB);

    if (!teamAObj || !teamBObj) {
      alert('Invalid teams selected');
      return;
    }

    try {
      const matchData = {
        league: form.league,
        format: form.format,
        teamA: teamAObj.name,
        teamB: teamBObj.name,
        date: form.date,
        time: form.time,
        series: form.series,
      };

      const createdMatch = await createMatch(matchData);

      setMatches([...matches, {
        ...createdMatch,
        teamA: teamAObj.code,
        teamB: teamBObj.code,
        id: createdMatch._id,
      }]);

      setForm({ league: '', teamA: '', teamB: '', date: '', time: '', format: '', series: '' });
    } catch (error) {
      console.error('Match creation failed:', error);
      alert('Failed to create match.');
    }
  };

const handleDelete = async (id) => {
  try {
    await deleteMatch(id); // backend se delete
    setMatches(matches.filter(match => match._id !== id)); // frontend se hatao
  } catch (error) {
    console.error('Delete failed:', error);
    alert('Error deleting match');
  }
};


  const currentTeams = leagueTeams[form.league] || [];
  const teamBOptions = currentTeams.filter(team => team.code !== form.teamA);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 text-green-700">Match Setup</h1>

      {/* Match Setup Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="grid md:grid-cols-2 gap-4">
          <select
            name="league"
            value={form.league}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="" disabled>Select League</option>
            {Object.keys(leagueTeams).map((league) => (
              <option key={league} value={league}>{league}</option>
            ))}
          </select>
          <select
            name="format"
            value={form.format}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="" disabled>Select Format</option>
            {formats.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <select
            name="teamA"
            value={form.teamA}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="" disabled>Select Team A</option>
            {currentTeams.map(team => (
              <option key={team.code} value={team.code}>{team.name}</option>
            ))}
          </select>

          <select
            name="teamB"
            value={form.teamB}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="" disabled>Select Team B</option>
            {teamBOptions.map(team => (
              <option key={team.code} value={team.code}>{team.name}</option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="date"
            type="date"
            className="input input-bordered w-full"
            value={form.date}
            onChange={handleChange}
            required
          />

          <input
            name="time"
            type="time"
            className="input input-bordered w-full"
            value={form.time}
            onChange={handleChange}
            required
          />
        </div>

        <input
          name="series"
          type="text"
          placeholder="Enter Series Name"
          className="input input-bordered w-full"
          value={form.series}
          onChange={handleChange}
          required
        />

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
            {matches.map((match) => {
              const teamA = leagueTeams[match.league]?.find(t => t.code === match.teamA);
              const teamB = leagueTeams[match.league]?.find(t => t.code === match.teamB);
              return (
                <div key={match.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                  <div className="text-sm text-gray-600 font-semibold mb-2">
                    {match.date} at {match.time} | {match.format} | {match.series}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center">
                    <img src={getLogoByCode(teamA?.code)} alt={teamA?.name} className="w-10 h-10 rounded-full" />
                      <span className="text-xs mt-2 font-medium text-gray-800">{teamA?.name || 'Team A'}</span>
                    </div>
                    <div className="text-yellow-600 font-bold text-lg">VS</div>
                    <div className="flex flex-col items-center">
                 <img src={getLogoByCode(teamB?.code)} alt={teamB?.name} className="w-10 h-10 rounded-full" />
                      <span className="text-xs mt-2 font-medium text-gray-800">{teamB?.name || 'Team B'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(match.id)}
                    className="mt-4 text-sm text-red-500 font-semibold hover:underline"
                  >
                    ❌ Delete Match
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
