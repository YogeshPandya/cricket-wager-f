import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function HomePage() {
  const location = useLocation();

  const matchesData = [
    {
      id: 1,
      teamA: 'India',
      teamB: 'Australia',
      time: '19:00',
      seriesName: 'World Cup',
      matchFormat: 'T20',
      logoA: 'https://flagcdn.com/w80/in.png',
      logoB: 'https://flagcdn.com/w80/au.png',
    },
    {
      id: 2,
      teamA: 'England',
      teamB: 'Pakistan',
      time: '21:00',
      seriesName: 'Champions Trophy',
      matchFormat: 'ODI',
      logoA: 'https://flagcdn.com/w80/gb.png',
      logoB: 'https://flagcdn.com/w80/pk.png',
    },
    {
      id: 3,
      teamA: 'South Africa',
      teamB: 'New Zealand',
      time: '23:30',
      seriesName: 'Tri Series',
      matchFormat: 'Test',
      logoA: 'https://flagcdn.com/w80/za.png',
      logoB: 'https://flagcdn.com/w80/nz.png',
    },
  ];

  const getTargetDate = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const now = new Date();
    const target = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      parseInt(hours),
      parseInt(minutes),
      0
    );
    if (target < now) {
      target.setDate(target.getDate() + 1);
    }
    return target;
  };

  const [timers, setTimers] = useState(
    matchesData.map((match) => {
      const targetDate = getTargetDate(match.time);
      return {
        ...match,
        targetDate,
        remaining: Math.max(0, Math.floor((targetDate - new Date()) / 1000)),
      };
    })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) =>
        prev.map((m) => {
          const remaining = Math.max(0, Math.floor((m.targetDate - new Date()) / 1000));
          return { ...m, remaining };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const navItems = [
    { label: 'Home', icon: <SportsCricketIcon />, path: '/home' },
    { label: 'My Match', icon: <SportsEsportsIcon />, path: '/my-match' },
    { label: 'Account', icon: <AccountCircleIcon />, path: '/account' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white font-sans">
      <div className="flex-1 overflow-y-auto p-4 pb-28">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-wide text-yellow-400 drop-shadow-xl">
            <span className="text-green-300">Cricket</span> Wager
          </h1>
          <p className="text-gray-300 text-sm italic mt-1">Predict. Play. Win Big. 🏏</p>
          <div className="mt-4 text-lg font-semibold text-white flex items-center justify-center gap-2">
            <span className="animate-ping inline-block w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="text-yellow-400">Live Matches</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {timers.map((match) => (
            <Link
              key={match.id}
              to={match.id === 1 ? '/match-details' : '#'}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 rounded-xl p-4 transition-all duration-300 border border-white/10 shadow-lg"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-sm text-gray-300 font-semibold">{match.seriesName}</p>
                  <p className="text-xs text-yellow-400">{match.matchFormat}</p>
                </div>
                <p className="text-sm text-yellow-300 font-bold">
                  {match.targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 w-1/2">
                  <img src={match.logoA} alt={match.teamA} className="w-8 h-8 rounded-full" />
                  <span className="text-sm font-medium">{match.teamA}</span>
                </div>
                <p className="text-yellow-300 font-bold text-sm">VS</p>
                <div className="flex items-center gap-2 w-1/2 justify-end">
                  <span className="text-sm font-medium">{match.teamB}</span>
                  <img src={match.logoB} alt={match.teamB} className="w-8 h-8 rounded-full" />
                </div>
              </div>

              <div className="text-center">
                {match.remaining > 0 ? (
                  <span className="text-white font-mono text-xs">Starts in: {formatTime(match.remaining)}</span>
                ) : (
                  <span className="text-red-500 font-semibold animate-pulse text-sm">Live</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 w-full bg-white bg-opacity-10 backdrop-blur-md text-white py-2 px-4 flex justify-around border-t border-white/20">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center text-xs font-semibold transition-colors duration-200 ${
              location.pathname === item.path ? 'text-yellow-300' : 'text-white'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </footer>
    </div>
  );
}