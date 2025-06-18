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

  // const navItems = [
  //   { label: 'Home', icon: <SportsCricketIcon />, path: '/home' },
  //   { label: 'My Match', icon: <SportsEsportsIcon />, path: '/my-match' },
  //   { label: 'Account', icon: <AccountCircleIcon />, path: '/account' },
  // ];
    const navItems = [
    { label: 'Home', path: '/home' },
    { label: 'My Match',path: '/my-match' },
    { label: 'Account', path: '/account' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white">
      <div className="flex-1 overflow-y-auto p-3 pb-28">

        {/* 🔥 Improved Header Section */}
        <div className="text-center mb-5">
         <h1 className="text-4xl font-extrabold drop-shadow-md tracking-wide">
  <span className="text-green-300">Cricket</span>{' '}
  <span className="text-yellow-400">Wager</span>
</h1>

          <p className="mt-1 text-sm text-gray-200 italic tracking-wide">
            Predict. Play. Win Big. 🏏
          </p>
          <h3 className="mt-4 text-xl font-bold text-yellow-400 animate-pulse drop-shadow-sm">
            🔴 Live Matches
          </h3>
        </div>

        {/* 🔽 Match Cards */}
        <div className="space-y-3">
          {timers.map((match) => (
            <div
              key={match.id}
              className="bg-white bg-opacity-10 p-2 rounded-md shadow hover:bg-opacity-20 transition"
            >
              {/* Series Name & Format */}
              <div className="text-center text-xs mb-1 leading-tight">
                <div className="text-white font-semibold">{match.seriesName}</div>
                <div className="text-yellow-400">{match.matchFormat}</div>
              </div>

              {/* Teams + VS */}
              <div className="flex justify-between items-center text-xs font-medium mb-1">
                <div className="flex flex-col items-center w-1/3">
                  <img src={match.logoA} alt={match.teamA} className="w-6 h-6 rounded-full mb-0.5" />
                  <span>{match.teamA}</span>
                </div>

                <div className="w-1/3 text-center text-yellow-300 text-sm font-bold">VS</div>

                <div className="flex flex-col items-center w-1/3">
                  <img src={match.logoB} alt={match.teamB} className="w-6 h-6 rounded-full mb-0.5" />
                  <span>{match.teamB}</span>
                </div>
              </div>

              {/* Time + Timer */}
              <div className="text-center text-xs">
                <span className="block text-yellow-300 mb-0.5">
                  {match.targetDate.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {match.remaining > 0 ? (
                  <span className="text-white font-mono text-[11px]">
                    Starts in: {formatTime(match.remaining)}
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold animate-pulse text-xs">Live</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white bg-opacity-10 backdrop-blur-md text-white py-2 px-4 flex justify-around border-t border-white border-opacity-20">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center text-xs ${
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
