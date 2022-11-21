import React, { useEffect, useState } from 'react';
import Die from './Components/Die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

function App() {
	const [dice, setDice] = useState(allNewDice());

	const [tenzies, setTenzies] = useState(false);

	const [rollCount, setRollCount] = useState(0);

	const [userTime, setUserTime] = useState(0);

	const userLocalTime = JSON.parse(localStorage.getItem('bestTime'));

	useEffect(() => {
		const allHeld = dice.every((die) => die.isHeld);
		const firstValue = dice[0].value;
		const allSameValue = dice.every((die) => die.value === firstValue);
		if (allHeld && allSameValue) {
			setTenzies(true);
		}
	}, [dice]);

	useEffect(() => {
		if (tenzies) {
			setUserTime((prevTime) => {
				return (Date.now() - prevTime) / 1000;
			});
		}
	}, [tenzies]);

	useEffect(() => {
		if (tenzies) {
			if (userLocalTime === 0.0) {
				localStorage.clear();
				localStorage.setItem('bestTime', userTime.toFixed(2));
			}
			if (userLocalTime >= userTime) {
				localStorage.clear();
				localStorage.setItem('bestTime', userTime.toFixed(2));
			}
		}
	});

	function generateNewDie() {
		return {
			value: Math.ceil(Math.random() * 6),
			isHeld: false,
			id: nanoid(),
		};
	}

	function allNewDice() {
		var newDice = [];
		for (var i = 0; i < 10; i++) {
			newDice.push(generateNewDie());
		}
		return newDice;
	}

	function holdDice(id) {
		if (rollCount === 0) {
		} else {
			setDice((prevDice) =>
				prevDice.map((die) => {
					return die.id === id ? { ...die, isHeld: !die.isHeld } : { ...die };
				})
			);
		}
	}

	function rollDice() {
		if (rollCount === 0) {
			setUserTime(Date.now());
		}

		setRollCount((prevCount) => prevCount + 1);

		if (tenzies) {
			setTenzies(false);
			setDice(allNewDice());
			setUserTime(Date.now());
			setRollCount(1);
		} else {
			setDice((prevDice) =>
				prevDice.map((die) => {
					return die.isHeld ? die : generateNewDie();
				})
			);
		}
	}

	const diceElements = dice.map((die) => (
		<Die
			key={die.id}
			value={die.value}
			isHeld={die.isHeld}
			rollCount={rollCount}
			holdDice={() => holdDice(die.id)}
		/>
	));

	function bestTime() {
		if (rollCount === 0) {
			if (userLocalTime === null) {
				localStorage.setItem('bestTime', '0.00');
				return userLocalTime.toFixed(2);
			} else {
				if (userTime > userLocalTime) {
					return userTime.toFixed(2);
				} else if (userLocalTime > userTime) {
					return userLocalTime.toFixed(2);
				} else {
					return userLocalTime.toFixed(2);
				}
			}
		} else if (tenzies) {
			if (userLocalTime === 0) {
				return userTime.toFixed(2);
			} else {
				if (userLocalTime > userTime) {
					return userTime.toFixed(2);
				} else if (userLocalTime < userTime) {
					return userLocalTime.toFixed(2);
				}
			}
		} else {
			return userLocalTime.toFixed(2);
		}
	}

	return (
		<main className="App">
			<div className="container">
				{tenzies && <Confetti />}
				<h1 className="title">Tenzies</h1>
				<div className="instruction-container">
					<p className="instructions">
						Roll until all dice are the same. Click each die to freeze it at its
						current value between rolls.
					</p>
					<p className="button-instructions--text">
						{rollCount === 0
							? 'Freezing Die and Timer will start on the first roll.'
							: ''}
						{tenzies ? 'Timer will start when new game is started' : ''}
					</p>
				</div>

				<div className="dice-container">{diceElements}</div>
				<button className="new-dice-btn" onClick={rollDice}>
					{tenzies ? 'New Game' : 'Roll'}
				</button>
			</div>
			<div className="results-container">
				<p className="best-time">
					<span className="accent">Best Time:</span> {bestTime()}
					{''} seconds
				</p>
				{userLocalTime === 0.0 && userTime === 0
					? 'Please play a game to get a best time'
					: ''}
				{tenzies && (
					<div className="user-results">
						<p className="user-results--after">
							<span className="accent">Time: </span> {userTime.toFixed(2) + ' '}
							seconds
						</p>
						<p className="user-results--after">
							<span className="accent">Rolls Taken: </span> {rollCount}
						</p>
					</div>
				)}
			</div>
		</main>
	);
}

export default App;
