import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMatchQuestions, getAllMatches } from '../../services/service';
import socket from "../../socket";

export default function MatchDetails() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [amount, setAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchDetails, setMatchDetails] = useState(null);

  // Helper function to parse ratio and return only the numerator
  const parseRatioDisplay = (ratio) => {
    if (typeof ratio === 'number') return ratio;
    if (typeof ratio === 'string' && ratio.includes('/')) {
      return ratio.split('/')[0];
    }
    return ratio || '5';
  };

  // Helper function to get full ratio for calculations
  const parseRatioForCalculation = (ratio) => {
    if (typeof ratio === 'string' && ratio.includes('/')) {
      return ratio;
    }
    return `${ratio}/10`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First get all matches to find our specific match
        const allMatches = await getAllMatches();
        const currentMatch = allMatches.find(match => match._id === matchId);
        
        if (currentMatch) {
          setMatchDetails({
            team1: currentMatch.teamA || currentMatch.team1 || 'Team 1',
            team2: currentMatch.teamB || currentMatch.team2 || 'Team 2'
          });
        } else {
          console.error('Match not found');
        }

        // Then get questions for this match
        const questionsData = await getMatchQuestions(matchId);
        
        // Process questions to ensure consistent ratio format
        const processedQuestions = questionsData.map(q => ({
          ...q,
          options: q.options?.map(opt => ({
            ...opt,
            label: opt.label || opt.text,
            ratio: opt.ratio, // Keep original ratio format for calculations
            displayRatio: parseRatioDisplay(opt.ratio), // Add display format
            visible: opt.visible
          })) || []
        }));
        
        setQuestions(processedQuestions);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleQuestionUpdate = ({ matchId: updatedMatchId, question }) => {
      if (updatedMatchId === matchId) {
        setQuestions((prev) => {
          const exists = prev.find(q => q._id === question._id || q.id === question._id);
          if (exists) {
          return prev.map(q =>
  q._id === question._id || q.id === question._id
    ? {
        ...question,
        options: question.options?.map(opt => ({
          ...opt,
          label: opt.label || opt.text,
          ratio: opt.ratio,
          displayRatio: parseRatioDisplay(opt.ratio),
          visible: opt.visible ?? true,
        })) || [],
      }
    : q
);

          } else {
            // Add new question
            const newQuestion = {
              ...question,
              options: question.options?.map(opt => ({
                ...opt,
                label: opt.label || opt.text,
                ratio: opt.ratio,
                displayRatio: parseRatioDisplay(opt.ratio),
                visible: opt.visible,
              })) || []
            };
            return [...prev, newQuestion];
          }
        });
      }
    };

    socket.on('questionUpdated', handleQuestionUpdate);

    return () => {
      socket.off('questionUpdated', handleQuestionUpdate);
    };
  }, [matchId]);

  useEffect(() => {
    const handleQuestionDelete = ({ matchId: deletedMatchId, questionId }) => {
      if (deletedMatchId === matchId) {
        setQuestions(prev => prev.filter(q => q._id !== questionId && q.id !== questionId));
      }
    };

    socket.on('questionDeleted', handleQuestionDelete);

    return () => {
      socket.off('questionDeleted', handleQuestionDelete);
    };
  }, [matchId]);

  const handleOptionClick = (question, option) => {
    setSelectedOption(option);
    setQuestionText(question.question);
    setAmount('');
    setErrorMsg('');
    setShowPopup(true);
  };

  const handleConfirm = () => {
    if (!amount || parseFloat(amount) < 10) {
      setErrorMsg('Minimum bet amount is ₹10');
      return;
    }
    alert(`You selected "${selectedOption.label}" for "${questionText}" with ₹${amount}`);
    setShowPopup(false);
  };

  const calculatePayout = () => {
    const amt = parseFloat(amount);
    if (!amt || !selectedOption?.ratio) return "";
    
    // Use the full ratio for calculation
    const fullRatio = parseRatioForCalculation(selectedOption.ratio);
    const [num, den] = fullRatio.split('/').map(Number);
    if (!num || !den) return "";
    
    const totalReturn = Math.round((amt * den) / num);
    const profit = totalReturn - amt;
    const commission = profit * 0.2;
    const finalAmount = totalReturn - commission;
    const multiplier = finalAmount / amt;

    return `You will get ₹${Math.round(finalAmount)} (${multiplier.toFixed(2)}x return)`;
  };

  const isMatchOver = false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-black text-white p-4 relative font-sans">
      <button onClick={() => navigate('/home')} className="text-yellow-300 mb-6 font-semibold text-lg hover:underline">
        ← Back
      </button>

      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide text-yellow-400 drop-shadow">
          {matchDetails ? `${matchDetails.team1} vs ${matchDetails.team2}` : 'Loading...'}
        </h1>
        <p className="text-gray-300 text-sm mt-1">Live Match - Place Your Predictions Now!</p>
        <div className="w-24 h-1 bg-yellow-400 mx-auto mt-3 rounded-full" />
      </div>
     
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white bg-opacity-10 p-6 rounded-2xl mb-8 shadow-lg border border-yellow-400">
        <div className="flex flex-row justify-between items-center w-full sm:gap-10 text-center">
          <div className="flex-1">
            <p className="text-yellow-300 text-xl font-bold">
              {matchDetails ? matchDetails.team1 : 'Team 1'}
            </p>
            <p className="text-white text-lg">5</p>
          </div>
          <div className="flex-1">
            <p className="text-yellow-300 text-xl font-bold">
              {matchDetails ? matchDetails.team2 : 'Team 2'}
            </p>
            <p className="text-white text-lg">5</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400">Loading questions...</div>
      ) : isMatchOver ? (
        <div className="bg-white bg-opacity-10 border border-red-400 p-6 rounded-2xl text-center text-red-300 font-semibold text-lg shadow-md">
          This match has ended. Stay tuned for results and exciting upcoming matches!
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center text-gray-400">No questions available for this match.</div>
      ) : (
        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q._id} className="bg-white bg-opacity-10 p-6 rounded-2xl shadow-md border border-white/20">
              <h3 className="text-yellow-300 text-lg font-semibold mb-4">{q.question}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {q.options?.map((opt) => (
                  <button
                    key={opt._id}
                    onClick={() => handleOptionClick(q, opt)}
                    className="bg-white bg-opacity-20 hover:bg-yellow-400 hover:text-black text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md flex justify-between items-center px-4"
                  >
                    <span>{opt.label}</span>
                    <span className="ml-3 inline-block bg-yellow-400 text-black text-sm font-bold px-3 py-1 rounded-full shadow-md">
                      {opt.displayRatio || parseRatioDisplay(opt.ratio)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 px-4">
          <div className="bg-gradient-to-br from-green-700 to-gray-900 text-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-yellow-300 mb-4">Confirm Your Bet</h2>
            <p className="mb-2 text-sm">Question: <span className="font-semibold">{questionText}</span></p>
            <p className="mb-4 text-sm">Selected Option: <span className="font-semibold">{selectedOption?.label}</span></p>
            <p className="mb-2 text-sm">
              Rate: <span className="font-semibold text-yellow-400">{selectedOption?.displayRatio || parseRatioDisplay(selectedOption?.ratio)}</span>
            </p>

            <label className="block mb-2 text-sm font-medium">Enter Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrorMsg('');
              }}
              className="w-full px-4 py-2 rounded-xl text-black font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter amount"
              min={10}
            />

            {errorMsg && <p className="text-red-400 text-sm mt-2">{errorMsg}</p>}

            {amount >= 10 && (
              <p className="text-green-300 font-bold mt-4 mb-2">{calculatePayout()}</p>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 rounded-xl bg-white bg-opacity-20 hover:bg-opacity-40 text-white font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}