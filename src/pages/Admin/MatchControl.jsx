import React, { useState } from 'react';
import AdminLayout from './components/AdminLayout';

const matchList = ['India vs Australia', 'England vs Pakistan', 'New Zealand vs South Africa'];

export default function MatchControl() {
  const [selectedMatch, setSelectedMatch] = useState(matchList[0]);
  const [questionsMap, setQuestionsMap] = useState({
    'India vs Australia': [
      {
        id: 1,
        question: 'Who will win the match?',
        options: [
          { text: 'India', visible: true, ratio: 5 },
          { text: 'Australia', visible: true, ratio: 5 }
        ],
        visible: true,
        result: ''
      }
    ]
  });

  const questions = questionsMap[selectedMatch] || [];

  const handleAddQuestion = () => {
    const newId = questions.length + 1;
    const updated = [
      ...questions,
      {
        id: newId,
        question: '',
        options: [{ text: '', visible: true, ratio: 5 }],
        visible: true,
        result: ''
      }
    ];
    setQuestionsMap({ ...questionsMap, [selectedMatch]: updated });
  };

  const updateQuestion = (id, key, value) => {
    const updated = questions.map(q => (q.id === id ? { ...q, [key]: value } : q));
    setQuestionsMap({ ...questionsMap, [selectedMatch]: updated });
  };

  const updateOption = (qId, index, key, value) => {
    const updated = questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[index] = { ...newOptions[index], [key]: value };
        return { ...q, options: newOptions };
      }
      return q;
    });
    setQuestionsMap({ ...questionsMap, [selectedMatch]: updated });
  };

  const addOption = (qId) => {
    const updated = questions.map(q => {
      if (q.id === qId) {
        return { ...q, options: [...q.options, { text: '', visible: true, ratio: 5 }] };
      }
      return q;
    });
    setQuestionsMap({ ...questionsMap, [selectedMatch]: updated });
  };

  const deleteOption = (qId, index) => {
    const updated = questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions.splice(index, 1);
        return { ...q, options: newOptions };
      }
      return q;
    });
    setQuestionsMap({ ...questionsMap, [selectedMatch]: updated });
  };

  const deleteQuestion = (id) => {
    const updated = questions.filter(q => q.id !== id);
    setQuestionsMap({ ...questionsMap, [selectedMatch]: updated });
  };

  const saveToBackend = () => {
    localStorage.setItem('matchControlData', JSON.stringify(questionsMap));
    alert(`✅ Saved questions for ${selectedMatch}`);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 text-green-700">Match Control</h1>

      <div className="mb-6">
        <label className="text-sm text-gray-700 font-medium mr-2">Select Match:</label>
        <select
          value={selectedMatch}
          onChange={(e) => setSelectedMatch(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-400"
        >
          {matchList.map((match, i) => (
            <option key={i} value={match}>{match}</option>
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
                <div key={i} className="flex flex-wrap gap-2 items-center">
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
      updateOption(q.id, i, 'ratio', 5); // Reset to default if invalid
    } else {
      updateOption(q.id, i, 'ratio', val);
    }
  }}
  placeholder="Ratio (1-10)"
  min={1}
  max={10}
  className="w-1/4 px-3 py-2 border border-blue-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
/>

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
