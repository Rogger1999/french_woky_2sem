import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
	const [mode, setMode] = useState(null);
	const [fileList, setFileList] = useState([]);
	const [selectedFile, setSelectedFile] = useState(null);
	const [error, setError] = useState(null);
	const [data, setData] = useState({});
	// New state for testing mode:
	const [userAnswer, setUserAnswer] = useState("");
	const [feedback, setFeedback] = useState("");
	const [testItem, setTestItem] = useState(null);
	// New state for learning slowly mode:
	const [lsIndex, setLsIndex] = useState(0);
	const [lsPattern, setLsPattern] = useState([]);

	useEffect(() => {
		if (mode) {
			axios.get('/list-jsons')
				.then(response => {
					setFileList(response.data);
					setError(null);
				})
				.catch(() => {
					setError('Failed to fetch file list');
				});
		}
	}, [mode]);

	useEffect(() => {
		fetch('/api/data')
			.then(res => res.json())
			.then(setData)
			.catch(console.error);
	}, []);

	const handleModeChange = (newMode) => {
		setMode(newMode);
		setSelectedFile(null);
		setFileList([]);
		// Reset learning-slowly state when mode changes
		if(newMode !== "learning-slowly"){
			setLsIndex(0);
			setLsPattern([]);
		}
	};

	const handleFileClick = (fileId) => {
		axios.get(`/json/${fileId}`)
			.then(response => {
				const parsed = response.data;
				setSelectedFile({ name: fileId, content: JSON.stringify(parsed, null, 2), raw: parsed });
				setError(null);
				// For testing mode, pick a random word and reset answer/feedback
				if (mode === "testing" && Array.isArray(parsed) && parsed.length > 0) {
					const randomWord = parsed[Math.floor(Math.random() * parsed.length)];
					setTestItem(randomWord);
					setUserAnswer("");
					setFeedback("");
				} else {
					setTestItem(null);
					// For learning slowly mode, compute custom sequence
					if (mode === "learning-slowly" && Array.isArray(parsed) && parsed.length >= 4) {
						// For example, for 4 items, pattern: [0, 1, 0, 2, 1, 3, 2]
						const pattern = [0, 1, 0, 2, 1, 3, 2];
						setLsPattern(pattern);
						setLsIndex(0);
					} else if(mode === "learning-slowly") {
						// Fallback: cycle over indices normally
						setLsPattern(parsed.map((_, i) => i));
						setLsIndex(0);
					}
				}
			})
			.catch(() => {
				setError('Failed to fetch file content');
			});
	};

	// New function to advance in learning slowly mode
	const handleNextSlowly = () => {
		if(selectedFile && Array.isArray(selectedFile.raw) && lsPattern.length > 0) {
			// Advance lsIndex and wrap-around if needed
			const nextIndex = (lsIndex + 1) % lsPattern.length;
			setLsIndex(nextIndex);
		}
	};

	// New function to check answer in testing mode
	const handleSubmit = () => {
		if (!testItem) return;
		if (userAnswer.trim().toLowerCase() === testItem.german.toLowerCase()) {
			setFeedback("Correct!");
		} else {
			setFeedback(`Incorrect! Correct answer: ${testItem.german}`);
		}
	};

	return (
		<div className="container p-5" style={{ fontSize: "1.2rem" }}>
			{/* Always show a large HOME button when a mode is active */}
			{mode && (
				<div className="d-flex justify-content-end mb-3">
					<button 
						className="btn btn-warning btn-lg" 
						onClick={() => {
							setMode(null);
							setSelectedFile(null);
							setFileList([]);
							setTestItem(null);
							setFeedback("");
						}}
					>
						HOME
					</button>
				</div>
			)}

			{!mode ? (
				<div className="text-center">
					<button className="btn btn-primary btn-lg m-2" onClick={() => handleModeChange('learning')}>Learning</button>
					<button className="btn btn-primary btn-lg m-2" onClick={() => handleModeChange('learning-slowly')}>Learning Slowly</button>
					<button className="btn btn-primary btn-lg m-2" onClick={() => handleModeChange('testing')}>Testing</button>
				</div>
			) : (
				<div>
					<h2 className="text-center">{mode.charAt(0).toUpperCase() + mode.slice(1)} Mode</h2>
					<div className="d-flex flex-wrap justify-content-center">
						{fileList.map((fileId, idx) => (
							<button key={idx} className="btn btn-secondary m-1" onClick={() => handleFileClick(fileId)}>
								{fileId}
							</button>
						))}
					</div>
					{error && <div className="text-danger text-center">{error}</div>}
					{selectedFile && (
						<div className="mt-4">
							<h3 className="text-center">{selectedFile.name}</h3>
							{mode === 'learning' && selectedFile.raw && Array.isArray(selectedFile.raw) ? (
								// ...existing learning table...
								<table className="table table-bordered table-responsive">
									<thead className="thead-light">
										<tr>
											{Object.keys(selectedFile.raw[0]).map((key) => (
												<th key={key} className="text-capitalize">{key}</th>
											))}
										</tr>
									</thead>
									<tbody>
										{selectedFile.raw.map((item, index) => (
											<tr key={index} className={index % 2 === 0 ? "" : "bg-light"}>
												{Object.values(item).map((value, idx) => (
													<td key={idx}>{value}</td>
												))}
											</tr>
										))}
									</tbody>
								</table>
							) : mode === 'testing' ? (
								testItem ? (
									<div className="text-center">
										<p className="h5">{testItem.french} - </p>
										<input
											type="text"
											value={userAnswer}
											onChange={(e) => setUserAnswer(e.target.value)}
											placeholder="Type German word"
											className="form-control d-inline-block"
											style={{ maxWidth: '300px' }}
										/>
										<button className="btn btn-success ml-2 mt-2" onClick={handleSubmit}>Submit</button>
										{feedback && (
											<p className="mt-2" style={{ color: feedback === "Correct!" ? 'green' : 'red' }}>{feedback}</p>
										)}
									</div>
								) : (
									<p className="text-center">No test item available.</p>
								)
							) : mode === 'learning-slowly' ? (
								selectedFile.raw && Array.isArray(selectedFile.raw) ? (
									<div className="text-center">
										<p className="h5">
											French: {selectedFile.raw[lsPattern[lsIndex]]?.french} - German: {selectedFile.raw[lsPattern[lsIndex]]?.german}
										</p>
										<button className="btn btn-info mt-2" onClick={handleNextSlowly}>NEXT</button>
									</div>
								) : (
									<pre className="bg-light p-3">{selectedFile.content}</pre>
								)
							) : (
								<pre className="bg-light p-3">{selectedFile.content}</pre>
							)}
						</div>
					)}
				</div>
			)}
			{/* Removed the static vocabulary JSON data table for mobile clarity */}
		</div>
	);
}

export default App;
