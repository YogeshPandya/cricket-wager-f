// src/pages/HomePage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllMatches } from '../../services/service'; // ✅ your API call here
import TeamA from '../../assets/TeamA.png';
import TeamB from '../../assets/TeamB.png';


export default function HomePage() {
  const location = useLocation();
  const tickerRef = useRef(null);
  const [matches, setMatches] = useState([]);
  const [timers, setTimers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getTargetDate = (dateStr, timeStr) => {
  const [year, month, day] = dateStr.split('-').map(Number); // match.date = "2025-07-31"
  const [hours, minutes] = timeStr.split(':').map(Number);   // match.time = "19:30"
  return new Date(year, month - 1, day, hours, minutes, 0);
};


  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

 const getTeamLogo = (teamName = '') => {
  const name = teamName.trim().toLowerCase();

  switch (name) {
    case 'india':
    case 'mumbai indians':
    case 'lahore qalandars':
    case 'sydney sixers':
    case 'pretoria capitals':
    case 'birmingham rockets':
    case 'deccan gladiators':
    case 'oval invincibles':
      return TeamA;

    case 'australia':
    case 'chennai super kings':
    case 'kolkata knight riders':
    case 'sydney thunder':
    case 'joburg super kings':
    case 'guyana amazon warriors':
    case 'delhi bulls':
    case 'trinbago riders':
      return TeamB;

    default:
      return TeamB; // fallback
  }
};






  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await  getAllMatches();  // ✅ API call
        setMatches(data);

    const timersData = data.map((match) => {
console.log("Raw match data:", match);
console.log("getTeamLogo(teamA):", getTeamLogo(match.teamA));
console.log("getTeamLogo(teamB):", getTeamLogo(match.teamB));


 const targetDate = getTargetDate(match.date, match.time);

  return {
    ...match,
    targetDate,
    remaining: Math.max(0, Math.floor((targetDate - new Date()) / 1000)),
    logoA: getTeamLogo(match.teamA),
    logoB: getTeamLogo(match.teamB),
  };
});



        setTimers(timersData);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, []);

  useEffect(() => {
  if (timers.length === 0) return;

  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % timers.length);
  }, 4000);

  return () => clearInterval(interval);
}, [timers.length]);


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

  // ✅ Optional: WebSocket for live update
  useEffect(() => {
  if (window.socket) {
    window.socket.on('matchCreated', (newMatch) => {
      const newTimer = {
        ...newMatch,
       targetDate: getTargetDate(newMatch.date, newMatch.time),
remaining: Math.max(0, Math.floor((getTargetDate(newMatch.date, newMatch.time) - new Date()) / 1000)),

        logoA: getTeamLogo(newMatch.teamA),
        logoB: getTeamLogo(newMatch.teamB),
      };

      setTimers((prev) => [...prev, newTimer]);
    });
     window.socket.on('matchDeleted', (deletedId) => {
      setTimers((prev) => prev.filter((m) => m._id !== deletedId));
    });
  }

  return () => {
    window.socket?.off('matchCreated');
    window.socket?.off('matchDeleted');
  };
}, []);


  const navItems = [
    { label: 'Home', icon: <SportsCricketIcon />, path: '/home' },
    { label: 'My Match', icon: <SportsEsportsIcon />, path: '/my-match' },
    { label: 'Account', icon: <AccountCircleIcon />, path: '/account' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white font-sans">
      <div className="flex-1 overflow-y-auto p-4 pb-28">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-extrabold tracking-wide text-yellow-400 drop-shadow-xl">
            <span className="text-green-300">Cricket</span> Wager
          </h1>
          <p className="text-gray-300 text-sm italic mt-1">Predict. Play. Win Big. 🏏</p>
        </div>

        {/* Ticker */}
        {timers.length > 0 && (
          <div className="relative mb-6">
            <div
              ref={tickerRef}
              className="overflow-hidden rounded-xl bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 backdrop-blur-lg border border-yellow-400 shadow-lg mx-auto w-full max-w-xl"
            >
              <AnimatePresence mode="wait">
                <motion.div
                key={timers[currentIndex]?._id || currentIndex}

                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="p-3 flex items-center justify-between text-white cursor-pointer"
                onClick={() => {
  const matchSection = document.getElementById(`match-${timers[currentIndex]._id}`);
  matchSection?.scrollIntoView({ behavior: 'smooth' });
}}

                >
                  <div className="flex items-center gap-2">
                    <img src={timers[currentIndex].logoA} alt="" className="w-6 h-6 rounded-full" />
                    <span className="font-medium text-sm">{timers[currentIndex].teamA}</span>
                  </div>
                  <div className="text-yellow-300 text-xs font-bold px-2">VS</div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{timers[currentIndex].teamB}</span>
                    <img src={timers[currentIndex].logoB} alt="" className="w-6 h-6 rounded-full" />
                  </div>
                  <div className="ml-4 text-xs text-gray-200 text-right">
                 <div className="text-yellow-400">{timers[currentIndex].series}</div>
                 <div>{timers[currentIndex].format} • {timers[currentIndex].time}</div>
                </div>

                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        <div className="mt-2 mb-4 text-lg font-semibold text-white flex items-center justify-center gap-2">
          <span className="animate-ping inline-block w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="text-yellow-400">Live Matches</span>
        </div>

        <div className="flex flex-col gap-6">
          {timers.map((match) => (
            <Link
             key={match._id}
             id={`match-${match._id}`}

              to={match._id === 1 ? '/match-details' : '#'}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 rounded-xl p-4 transition-all duration-300 border border-white/10 shadow-lg"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
               <p className="text-sm text-gray-300 font-semibold">{match.series}</p>
               <p className="text-xs text-yellow-400">{match.format}</p>


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
  match.remaining > 86400 ? (
    <span className="text-gray-300 font-mono text-xs">
      Starts in: {Math.ceil(match.remaining / 86400)} days
    </span>
  ) : (
    <span className="text-white font-mono text-xs">Starts in: {formatTime(match.remaining)}</span>
  )
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
