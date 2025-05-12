import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [jsonList, setJsonList] = useState([]);
  const [currentJson, setCurrentJson] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [learningIndex, setLearningIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');

  // Fetch available JSON ids on mount
  useEffect(() => {
    axios.get('/list-jsons').then(res => {
      setJsonList(res.data);
      if (res.data.length) {
        setActiveTab(res.data[0]);
      }
    });
  }, []);

  // Fetch JSON content when activeTab changes
  useEffect(() => {
    if (activeTab) {
      axios.get(`/json/${activeTab}`).then(res => {
        setCurrentJson(res.data);
        setLearningIndex(0);
        setUserInput('');
        setFeedback('');
      });
    }
  }, [activeTab]);

  const handleCheck = () => {
    const currentPair = currentJson[learningIndex];
    if (!currentPair) return;
    if (userInput.trim().toLowerCase() === currentPair.german.toLowerCase()) {
      setFeedback('Correct!');
    } else {
      setFeedback('Try again!');
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Tabbed Navigation */}
      <div className="tabs flex mb-4">
        {jsonList.map(id => (
          <button key={id}
            className={`mr-2 p-2 border ${activeTab === id ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setActiveTab(id)}>
            {`Page ${id.replace('json', '')}`}
          </button>
        ))}
      </div>

      {/* Vocabulary Table */}
      <div className="vocab-table mb-8">
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="p-2 border">French</th>
              <th className="p-2 border">German</th>
              <th className="p-2 border">Image</th>
            </tr>
          </thead>
          <tbody>
            {currentJson.map((pair, idx) => (
              <tr key={idx}>
                <td className="p-2 border">{pair.french}</td>
                <td className="p-2 border">{pair.german}</td>
                <td className="p-2 border">
                  {pair.image_url ? <img src={pair.image_url} alt="illustration" className="h-10" /> : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Learning Mode */}
      {currentJson.length > 0 && (
        <div className="learning-mode p-4 border rounded bg-gray-50">
          <h2 className="mb-4 text-xl">Learning Mode</h2>
          <p className="mb-2">
            Translate this French word:
            <strong className="ml-2">{currentJson[learningIndex].french}</strong>
          </p>
          {/* Optionally display image */}
          {currentJson[learningIndex].image_url && (
            <img src={currentJson[learningIndex].image_url} alt="illustration" className="h-20 mb-2"/>
          )}
          <div className="mb-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="border p-1"
            />
          </div>
          <button onClick={handleCheck} className="p-2 bg-green-500 text-white rounded">
            Check
          </button>
          {feedback && <p className="mt-2">{feedback}</p>}
        </div>
      )}
    </div>
  );
};

export default App;