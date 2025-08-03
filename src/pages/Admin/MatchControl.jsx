import React, { useState, useEffect } from 'react';
import AdminLayout from './components/AdminLayout';
import {
  getAllMatches,
  saveQuestionsForMatch,
  getMatchQuestions,
  deleteQuestion as deleteQuestionFromServer
} from '../../services/service';
import socket from '../../socket';

export default function MatchControl() {
  const [matchList, setMatchList] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [questionsMap, setQuestionsMap] = useState({});

  const fetchMatchQuestions = async (matchId) => {
    try {
      const data = await getMatchQuestions(matchId);

      const formatted = data.map((q, index) => ({
        id: q._id,
        _id: q._id,
        question: q.question,
        options: q.options.map((opt) => ({
          _id: opt._id || `${Math.random()}`,
          text: opt.label || opt.text,
          ratio: parseInt(opt.ratio?.split?.('/')?.[0]) || 5,
          visible: opt.visible ?? true,
        })),
        visible: q.visible ?? true,
        result: q.result || '',
      }));

      setQuestionsMap((prev) => ({
        ...prev,
        [matchId]: formatted,
      }));
    } catch (err) {
      console.error(`❌ Error loading questions for match ${matchId}:`, err);
    }
  };

  useEffect(() => {
    const fetchMatches = async () => {
      const data = await getAllMatches();
      setMatchList(data);
      for (const match of data) {
        await fetchMatchQuestions(match._id);
      }
    };
    fetchMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch?._id && !questionsMap[selectedMatch._id]) {
      fetchMatchQuestions(selectedMatch._id);
    }
  }, [selectedMatch]);

  useEffect(() => {
    socket.on('questionUpdated', ({ matchId, question }) => {
      setQuestionsMap((prev) => {
        const existing = prev[matchId] || [];
        const updated = existing.map((q) =>
          q.id === question._id ? { ...q, ...question } : q
        );
        return { ...prev, [matchId]: updated };
      });
    });

    socket.on('questionDeleted', ({ matchId, questionId }) => {
      setQuestionsMap((prev) => {
        const existing = prev[matchId] || [];
        const updated = existing.filter((q) => q.id !== questionId);
        return { ...prev, [matchId]: updated };
      });
    });

    return () => {
      socket.off('questionUpdated');
      socket.off('questionDeleted');
    };
  }, []);

  const questions = questionsMap[selectedMatch?._id] || [];

  const handleAddQuestion = () => {
    const newId = `${Date.now()}`;
    const updated = [
      ...questions,
      {
        id: newId,
        question: '',
        options: [{ text: '', visible: true, ratio: 5 }],
        visible: true,
        result: '',
      },
    ];
    setQuestionsMap({ ...questionsMap, [selectedMatch._id]: updated });
  };

  const updateQuestion = (id, key, value) => {
    const updated = questions.map((q) => (q.id === id ? { ...q, [key]: value } : q));
    setQuestionsMap({ ...questionsMap, [selectedMatch._id]: updated });
  };

  const updateOption = (qId, index, key, value) => {
    const updated = questions.map((q) => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[index] = { ...newOptions[index], [key]: value };
        return { ...q, options: newOptions };
      }
      return q;
    });
    setQuestionsMap({ ...questionsMap, [selectedMatch._id]: updated });
  };

  const addOption = (qId) => {
    const updated = questions.map((q) => {
      if (q.id === qId) {
        return {
          ...q,
          options: [...q.options, { text: '', visible: true, ratio: 5 }],
        };
      }
      return q;
    });
    setQuestionsMap({ ...questionsMap, [selectedMatch._id]: updated });
  };

  const deleteOption = (qId, index) => {
    const updated = questions.map((q) => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions.splice(index, 1);
        return { ...q, options: newOptions };
      }
      return q;
    });
    setQuestionsMap({ ...questionsMap, [selectedMatch._id]: updated });
  };

  const deleteQuestion = async (id) => {
    const q = questions.find((q) => q.id === id);
    if (!q) return;

    try {
      await deleteQuestionFromServer(selectedMatch._id, q.id);
      const updated = questions.filter((q) => q.id !== id);
      setQuestionsMap({ ...questionsMap, [selectedMatch._id]: updated });

      socket.emit('questionDeleted', {
        matchId: selectedMatch._id,
        questionId: q.id,
      });

      alert('✅ Question deleted successfully!');
    } catch (err) {
      console.error('❌ Error deleting question:', err);
      alert('Failed to delete question from server.');
    }
  };

  const updateSingleQuestion = async (id) => {
    const matchId = selectedMatch._id;
    const q = questions.find((q) => q.id === id);
    if (!q) return;

    const payload = {
      question: q.question,
      options: q.options.map((opt) => ({
        label: opt.text,
        ratio: `${opt.ratio}/10`,
        visible: opt.visible ?? true,
      })),
      visible: q.visible,
      result: q.result || '',
    };

    try {
      await saveQuestionsForMatch(matchId, payload);
      socket.emit('questionUpdated', {
        matchId,
        question: {
          _id: q.id,
          ...payload,
          options: q.options.map((opt) => ({
            _id: opt._id || `${Math.random()}`,
            label: opt.text,
            ratio: `${opt.ratio}/10`,
            visible: opt.visible ?? true,
          })),
        },
      });
      alert('✅ Question updated successfully!');
    } catch (err) {
      console.error('❌ Error updating question:', err);
      alert('Failed to update question.');
    }
  };

  const saveToBackend = async () => {
    const matchId = selectedMatch?._id;
    const questions = questionsMap[matchId] || [];

    try {
      for (const q of questions) {
        const payload = {
          question: q.question,
          options: q.options.map((opt) => ({
            label: opt.text,
            ratio: `${opt.ratio}/10`,
            visible: opt.visible ?? true,
          })),
          visible: q.visible,
          result: q.result || '',
        };

        await saveQuestionsForMatch(matchId, payload);

        socket.emit('questionUpdated', {
          matchId,
          question: {
            _id: q.id,
            ...payload,
            options: q.options.map((opt) => ({
              _id: opt._id || `${Math.random()}`,
              label: opt.text,
              ratio: `${opt.ratio}/10`,
              visible: opt.visible ?? true,
            })),
          },
        });
      }

      localStorage.setItem('matchControlData', JSON.stringify(questionsMap));
      alert(`✅ Saved all questions for ${selectedMatch.teamA} vs ${selectedMatch.teamB}`);
    } catch (err) {
      console.error('❌ Error saving questions:', err);
      alert('Failed to save questions. Check console for error.');
    }
  };

  const getTotalBetForOption = (match, questionId, optionText) => {
    const raw = localStorage.getItem('bettingData');
    if (!raw) return 0;
    const allBets = JSON.parse(raw);
    return allBets
      .filter(
        (bet) =>
          bet.match === match?._id &&
          bet.questionId === questionId &&
          bet.optionText === optionText
      )
      .reduce((sum, bet) => sum + Number(bet.amount), 0);
  };

  const getPayoutIfOptionWins = (match, questionId, optionText, ratio) => {
    const raw = localStorage.getItem('bettingData');
    if (!raw) return 0;
    const allBets = JSON.parse(raw);
    return allBets
      .filter(
        (bet) =>
          bet.match === match?._id &&
          bet.questionId === questionId &&
          bet.optionText === optionText
      )
      .reduce((sum, bet) => sum + Number(bet.amount) * ratio, 0);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 text-green-700">Match Control</h1>

      <div className="mb-6">
        <label className="text-sm text-gray-700 font-medium mr-2">Select Match:</label>
       <select
  value={selectedMatch?._id || ''}
  onChange={(e) => {
    const selected = matchList.find((m) => m._id === e.target.value);
    setSelectedMatch(selected);
  }}
  className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-400"
>
  <option value="">Select a match</option>
  {matchList.map((match) => (
    <option key={match._id} value={match._id}>
      {match.teamA} vs {match.teamB}
    </option>
  ))}
</select>

      </div>

      <button
        onClick={handleAddQuestion}
        className="mb-6 px-4 py-2 bg-gradient-to-r from-green-500 to-yellow-400 text-white font-bold rounded hover:from-green-600 hover:to-yellow-500 shadow"
      >
        ➕ Add New Question
      </button>

      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                value={q.question}
                onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                placeholder="Enter question"
                className="w-3/4 px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <label className="ml-4 flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={q.visible}
                  onChange={() => updateQuestion(q.id, 'visible', !q.visible)}
                  className="accent-green-500"
                />
                Visible
              </label>
            </div>

            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <div key={i} className="flex flex-wrap gap-4 items-start w-full">
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => updateOption(q.id, i, 'text', e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="w-1/3 px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />

                  <input
                    type="number"
                    value={opt.ratio}
                    onChange={(e) => updateOption(q.id, i, 'ratio', e.target.value)}
                    onBlur={(e) => {
                      const val = Number(e.target.value);
                      if (isNaN(val) || val < 1 || val > 10) {
                        alert('❗ Ratio must be a number between 1 and 10');
                        updateOption(q.id, i, 'ratio', 5);
                      } else {
                        updateOption(q.id, i, 'ratio', val);
                      }
                    }}
                    placeholder="Ratio (1-10)"
                    min={1}
                    max={10}
                    className="w-1/6 px-3 py-2 border border-blue-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />

                  <div className="text-sm text-gray-700 space-y-1">
                    <div>💰 Total Bet: ₹{getTotalBetForOption(selectedMatch, q.id, opt.text)}</div>
                    <div>💸 Total Payout: ₹{getPayoutIfOptionWins(selectedMatch, q.id, opt.text, opt.ratio)}</div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={opt.visible}
                      onChange={() => updateOption(q.id, i, 'visible', !opt.visible)}
                      className="accent-yellow-500"
                    />
                    Show
                  </label>

                  <button
  onClick={() => updateSingleQuestion(q.id)}
  className="mt-4 mr-4 text-blue-600 text-sm font-semibold hover:underline"
>
  🛠 Update Question
</button>


                  <button
                    onClick={() => deleteOption(q.id, i)}
                    className="text-red-500 text-sm font-semibold hover:underline"
                  >
                    ❌ Delete
                  </button>
                </div>
              ))}

              <button
                onClick={() => addOption(q.id)}
                className="text-blue-600 text-sm mt-2 font-semibold"
              >
                ➕ Add Option
              </button>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">Set Result:</label>
              <input
                type="text"
                value={q.result}
                onChange={(e) => updateQuestion(q.id, 'result', e.target.value)}
                placeholder="e.g., India"
                className="ml-2 px-3 py-1 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            <button
              onClick={() => deleteQuestion(q.id)}
              className="mt-4 text-red-500 text-sm font-semibold hover:underline"
            >
              ❌ Delete Question
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={saveToBackend}
        className="mt-8 w-full py-3 bg-gradient-to-r from-green-500 to-yellow-400 text-white font-bold rounded-lg hover:from-green-600 hover:to-yellow-500 shadow-md"
      >
        💾 Save All Changes
      </button>


      
    </AdminLayout>
  );
  
}
