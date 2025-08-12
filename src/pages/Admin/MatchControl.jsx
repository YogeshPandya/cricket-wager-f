import React, { useState, useEffect } from 'react';
import AdminLayout from './components/AdminLayout';
import {
  getAllMatches,
  saveQuestionsForMatch,
  getMatchQuestions,
  deleteQuestion as deleteQuestionFromServer, 
  editQuestion, 
  updateOption
} from '../../services/service';
import socket from '../../socket';
import { setQuestionResult } from '../../services/service';

export default function MatchControl() {
  const [matchList, setMatchList] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [questionsMap, setQuestionsMap] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
   const [savedQuestionIds, setSavedQuestionIds] = useState([]); 

  const fetchMatchQuestions = async (matchId) => {
  try {
    const data = await getMatchQuestions(matchId);

    const formatted = data.map((q) => ({
      id: q._id,
      _id: q._id,
      question: q.question || '',
      options: q.options.map((opt) => ({
        _id: opt._id || `${Math.random()}`,
        text: opt.label || opt.text || '',
        ratio: Number(opt.ratio?.split?.('/')?.[0]) || 5,
        visible: opt.visible ?? true,
      })),
      visible: q.visible ?? true,
      result: q.result || '',
    }));

    setQuestionsMap((prev) => ({
      ...prev,
      [matchId]: formatted,
    }));

    // Update savedQuestionIds with actual server IDs
    const serverIds = formatted.map(q => q._id);
    setSavedQuestionIds(prev => {
      const updated = [...prev, ...serverIds].filter((id, index, arr) => arr.indexOf(id) === index);
      localStorage.setItem('savedQuestionIds', JSON.stringify(updated));
      return updated;
    });

  } catch (err) {
    console.error(`❌ Error loading questions for match ${matchId}:`, err);
  }
};

  useEffect(() => {
  const savedIds = JSON.parse(localStorage.getItem('savedQuestionIds') || '[]');
  setSavedQuestionIds(savedIds);
}, []);


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
  const handleQuestionUpdated = ({ matchId, question }) => {
    setQuestionsMap(prev => {
      const existing = prev[matchId] || [];
      
      // Check if this is our own update (from updateQuestionWithOptions)
      const isOurOwnUpdate = existing.some(q => 
        q.id === question._id && q._localUpdate === true
      );

      if (isOurOwnUpdate) {
        // For our own updates, just remove the _localUpdate flag
        const updated = existing.map(q => 
          q.id === question._id ? { ...q, _localUpdate: undefined } : q
        );
        return { ...prev, [matchId]: updated };
      } else {
        // For external updates, merge carefully without overwriting local changes
        const updated = existing.map(q => {
          if (q.id === question._id) {
            // Only update fields that haven't been changed locally
            const mergedQuestion = {
              ...q,
              question: q.question === '' ? (question.question || q.question) : q.question,
              visible: q.visible === true ? (question.visible ?? q.visible) : q.visible,
              result: q.result === '' ? (question.result || q.result) : q.result,
              options: q.options.map((opt, i) => {
                const serverOpt = question.options[i] || {};
                return {
                  ...opt,
                  text: opt.text === '' ? (serverOpt.label || serverOpt.text || opt.text) : opt.text,
                  ratio: opt.ratio === 5 ? (Number(serverOpt.ratio?.split?.('/')?.[0]) || opt.ratio) : opt.ratio,
                  visible: opt.visible === true ? (serverOpt.visible ?? opt.visible) : opt.visible
                };
              })
            };
            return mergedQuestion;
          }
          return q;
        });
        return { ...prev, [matchId]: updated };
      }
    });
  };

  const handleQuestionDeleted = ({ matchId, questionId }) => {
    setQuestionsMap(prev => {
      const existing = prev[matchId] || [];
      const updated = existing.filter(q => q.id !== questionId);
      return { ...prev, [matchId]: updated };
    });
  };

  socket.on('questionUpdated', handleQuestionUpdated);
  socket.on('questionDeleted', handleQuestionDeleted);

  return () => {
    socket.off('questionUpdated', handleQuestionUpdated);
    socket.off('questionDeleted', handleQuestionDeleted);
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
        options: [{ _id: `${Date.now()}-opt`, text: '', visible: true, ratio: 5 }],
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

  const updateOptionLocally = (qId, index, key, value) => {
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
          options: [...q.options, { _id: `${Date.now()}-opt`, text: '', visible: true, ratio: 5 }],
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

    const AddSingleQuestion = async (id) => {
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
    const response = await saveQuestionsForMatch(matchId, payload);
    console.log('Server response:', response);
    
    // Get the actual ID from server response
    const actualId = response._id || response.questionId || id;
    
    // After saving, fetch fresh data from server to get proper IDs
    setTimeout(async () => {
      try {
        await fetchMatchQuestions(matchId);
        console.log('✅ Questions refreshed with server IDs');
      } catch (err) {
        console.error('❌ Error refreshing questions:', err);
      }
    }, 500); // Small delay to ensure server has processed
    
    // Also update immediately for UI responsiveness
    const updatedQuestion = {
      ...q,
      _id: actualId,
      id: actualId,
      // Keep original options for now, server refresh will fix IDs
      options: q.options.map((opt, index) => ({
        ...opt,
        _id: response.options?.[index]?._id || actualId + '-opt-' + index
      }))
    };
    
    const updated = questions.map((question) => 
      question.id === id ? updatedQuestion : question
    );
    
    // Update questionsMap immediately
    setQuestionsMap(prev => ({ 
      ...prev, 
      [selectedMatch._id]: updated 
    }));

    // Emit socket event with proper structure
    socket.emit('questionUpdated', {
      matchId,
      question: {
        _id: actualId,
        question: payload.question,
        visible: payload.visible,
        result: payload.result,
        options: updatedQuestion.options.map((opt) => ({
          _id: opt._id,
          label: opt.text,
          ratio: `${opt.ratio}/10`,
          visible: opt.visible ?? true,
        })),
      },
    });

    // Save with actual server ID
    setSavedQuestionIds(prev => {
      const updated = [...prev.filter(savedId => savedId !== id), actualId];
      localStorage.setItem('savedQuestionIds', JSON.stringify(updated));
      return updated;
    });

    alert('✅ Question added successfully!');
  } catch (err) {
    console.error('❌ Error adding question:', err);
    alert('Failed to add question.');
  }
};

const updateQuestionWithOptions = async (matchId, q) => {
  // Check if question has proper server _id (not temporary ID)
  const isTemporaryId = !q._id || q._id.toString().length < 20 || q._id.toString().includes('-');
  
  if (isTemporaryId || isUpdating) {
    console.warn("❗ Skipped update: Invalid _id or already updating", {
      questionId: q._id,
      isTemporary: isTemporaryId,
      isUpdating
    });
    alert('❗ This question needs to be saved to server first before updating');
    return;
  }

  console.log('🔄 Starting update for question:', q._id);
  setIsUpdating(true);

  try {
    // Mark as local update first
    setQuestionsMap(prev => {
      const existing = prev[matchId] || [];
      const updated = existing.map(question =>
        question.id === q.id ? { ...q, _localUpdate: true } : question
      );
      return { ...prev, [matchId]: updated };
    });

    // Update question fields only if it has valid server ID
    console.log('🔄 Updating question fields for ID:', q._id);
    await editQuestion(matchId, q._id, {
      question: q.question,
      visible: q.visible,
      result: q.result || ''
    });

    // Update each option only if it has valid server ID
    for (const opt of q.options || []) {
      try {
        // Check if option has valid server ID (MongoDB ObjectId is 24 characters)
        const isValidOptionId = opt._id && 
                               opt._id.length >= 20 && 
                               !opt._id.includes('-opt') && 
                               !opt._id.includes('temp');
        
        if (isValidOptionId) {
          console.log('🔄 Updating option:', opt._id);
          await updateOption(matchId, q._id, opt._id, {
            label: opt.text,
            ratio: `${opt.ratio}/10`,
            visible: opt.visible ?? true
          });
        } else {
          console.log('⚠️ Skipping option update (temporary ID):', opt._id);
        }
      } catch (err) {
        console.error("❌ Error updating option:", opt._id, err);
        // Continue with other options even if one fails
      }
    }

    const payload = {
      _id: q._id,
      question: q.question,
      visible: q.visible,
      result: q.result || '',
      options: q.options.map(opt => ({
        _id: opt._id,
        label: opt.text,
        ratio: `${opt.ratio}/10`,
        visible: opt.visible ?? true
      }))
    };

    console.log('🟢 Emitting socket update:', payload);
    
    socket.emit('questionUpdated', {
      matchId,
      question: payload
    });

    // Remove the _localUpdate flag after successful update
    setQuestionsMap(prev => {
      const existing = prev[matchId] || [];
      const updated = existing.map(question =>
        question.id === q.id ? { ...question, _localUpdate: undefined } : question
      );
      return { ...prev, [matchId]: updated };
    });

    alert('✅ Question updated successfully!');
  } catch (error) {
    console.error('❌ Error updating question:', error);
    
    // Show more specific error message
    if (error.response?.status === 500) {
      alert('❌ Server error: Question might not exist in database. Try refreshing the page.');
    } else {
      alert('❌ Failed to update question: ' + (error.message || 'Unknown error'));
    }
    
    // Refresh from server on error
    await fetchMatchQuestions(matchId);
  } finally {
    setIsUpdating(false);
  }
};

//new
// Add this function inside your MatchControl component
const handleSetResult = async (question) => {
  if (!selectedMatch?._id || !question.result?.trim()) {
    alert('❗ Please enter a valid result');
    return;
  }

  // Check if question exists in database (has _id)
  if (!question._id) {
    alert('❗ Please save the question first before setting result');
    return;
  }

  try {
    console.log('🔄 Setting result for:', {
      matchId: selectedMatch._id,
      questionId: question._id,
      result: question.result.trim()
    });

    // Call the API to set result
    const response = await setQuestionResult(selectedMatch._id, question._id, question.result.trim());
    
    if (response.success) {
      // Update local state
      const updated = questions.map((q) => 
        q.id === question.id ? { ...q, result: question.result.trim() } : q
      );
      setQuestionsMap({ ...questionsMap, [selectedMatch._id]: updated });

      // Emit socket event (this will trigger updates in MyMatch page)
      socket.emit('questionUpdated', {
        matchId: selectedMatch._id,
        question: {
          _id: question._id,
          result: question.result.trim(),
          question: question.question,
          options: question.options
        }
      });

      alert('✅ Result set successfully! Bet statuses updated.');
    }
  } catch (error) {
    console.error('❌ Error setting result:', error);
    alert('Failed to set result. Make sure the question is saved to database first.');
  }
};
//end


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
            setSelectedMatch(selected || null);
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
        disabled={!selectedMatch}
        className="mb-6 px-4 py-2 bg-gradient-to-r from-green-500 to-yellow-400 text-white font-bold rounded hover:from-green-600 hover:to-yellow-500 shadow disabled:opacity-50"
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
                    onChange={(e) => updateOptionLocally(q.id, i, 'text', e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="w-1/3 px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />

                  <input
                    type="number"
                    value={opt.ratio}
                    onChange={(e) => updateOptionLocally(q.id, i, 'ratio', Number(e.target.value))}
                    onBlur={(e) => {
                      const val = Number(e.target.value);
                      if (isNaN(val) || val < 1 || val > 10) {
                        alert('❗ Ratio must be a number between 1 and 10');
                        updateOptionLocally(q.id, i, 'ratio', 5);
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
                      onChange={() => updateOptionLocally(q.id, i, 'visible', !opt.visible)}
                      className="accent-yellow-500"
                    />
                    Show
                  </label>

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


<div className="mt-4 p-4 bg-gray-50 rounded-lg border">
  <div className="flex items-center gap-2 mb-3">
    <label className="text-sm font-medium text-gray-700">Set Result:</label>
    
    {/* Dropdown for selecting result */}
    <select
      value={q.result}
      onChange={(e) => updateQuestion(q.id, 'result', e.target.value)}
      className="px-3 py-1 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-green-300"
    >
      <option value="">Select result...</option>
      {q.options.filter(opt => opt.visible).map((opt, index) => (
        <option key={index} value={opt.text}>
          {opt.text || `Option ${index + 1}`} ({opt.ratio}x)
        </option>
      ))}
      <option value="Draw">Draw</option>
    </select>
    
    <button
      onClick={() => handleSetResult(q)}
      disabled={!q.result?.trim() || !q._id}
      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      title={!q._id ? "Save question first" : !q.result?.trim() ? "Select result" : "Set result and update bet statuses"}
    >
      Set Result
    </button>
    {!q._id && (
      <span className="text-xs text-red-500">Save question first</span>
    )}
  </div>
  
  {/* Display Available Options (now redundant since we have dropdown, but keeping for visual reference) */}
  <div className="mt-3">
    <label className="text-sm font-medium text-gray-600 mb-2 block">Available Options:</label>
    <div className="flex flex-wrap gap-2">
      {q.options.map((opt, index) => (
        <div 
          key={index}
          className={`px-3 py-1 rounded-full text-sm border cursor-pointer transition-colors ${
            opt.visible 
              ? 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200' 
              : 'bg-gray-100 border-gray-300 text-gray-500'
          }`}
          onClick={() => {
            if (opt.visible && opt.text.trim()) {
              updateQuestion(q.id, 'result', opt.text.trim());
            }
          }}
          title={opt.visible ? "Click to set as result" : "Option is hidden"}
        >
          {opt.text || `Option ${index + 1}`}
          {!opt.visible && ' (Hidden)'}
          <span className="ml-1 text-xs text-blue-600">
            ({opt.ratio}x)
          </span>
        </div>
      ))}
    </div>
  </div>
</div>

            <div className="mt-4 flex flex-wrap gap-4">
              <button
  onClick={() => AddSingleQuestion(q.id)}
  className={`text-green-600 font-bold px-4 ${
    (savedQuestionIds.includes(q.id) || savedQuestionIds.includes(q._id) || q._id) 
      ? 'opacity-50 cursor-not-allowed' 
      : 'hover:underline'
  }`}
  disabled={savedQuestionIds.includes(q.id) || savedQuestionIds.includes(q._id) || q._id} // Check both temp ID and server ID
>
  {(savedQuestionIds.includes(q.id) || savedQuestionIds.includes(q._id) || q._id) ? '✅ Saved' : '💾 Save This Question'}
</button>


              <button
                onClick={() => deleteQuestion(q.id)}
                className="text-red-500 text-sm font-semibold hover:underline px-4"
              >
                ❌ Delete Question
              </button>

              {/* Update Button - Only show for questions with valid server ID */}
{/* Update Button - Show for questions with valid server ID or recently saved */}
{(q._id && (
    (q._id.length >= 20 && !q._id.toString().includes('-')) || // Valid MongoDB ID
    savedQuestionIds.includes(q._id) || // Recently saved
    savedQuestionIds.includes(q.id) // Check both temp and server ID
)) && (
  <button
    onClick={() => updateQuestionWithOptions(selectedMatch._id, q)}
    className="text-yellow-400 font-bold hover:underline px-4"
    disabled={isUpdating}
  >
    {isUpdating ? '⏳ Updating...' : '✏️ Update Question'}
  </button>
)}
            </div>
          </div>
        ))}
      </div>

      {questions.length > 0 && (
        <button
          onClick={saveToBackend}
          className="mt-8 w-full py-3 bg-gradient-to-r from-green-500 to-yellow-400 text-white font-bold rounded-lg hover:from-green-600 hover:to-yellow-500 shadow-md"
        >
          💾 Save All Changes
        </button>
      )}
    </AdminLayout>
  );
}