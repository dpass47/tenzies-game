import React, { useEffect, useState } from 'react';
import Die from './Components/Die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

function App() {
	const [dice, setDice] = useState(allNewDice());

	const [tenzies, setTenzies] = useState(false);

	const [rollCount, setRollCount] = useState(0);

	const [userTime, setUserTime] = useState(0);

	const userLocalTime = localStorage.getItem('bestTime');

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
			const userStats = userLocalTime === null ? 10000 : userLocalTime;
			if (userStats >= userTime) {
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
		setDice((prevDice) =>
			prevDice.map((die) => {
				return die.id === id ? { ...die, isHeld: !die.isHeld } : { ...die };
			})
		);
	}

	function rollDice() {
		if (rollCount === 0) {
			setUserTime(Date.now());
		}

		setRollCount((prevCount) => prevCount + 1);

		if (tenzies) {
			setTenzies(false);
			setDice(allNewDice());
			setUserTime(0);
			setRollCount(0);
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
			holdDice={() => holdDice(die.id)}
		/>
	));

	return (
		<main className="App">
			{tenzies && <Confetti />}
			<h1 className="title">Tenzies</h1>
			<p className="instructions">
				Roll until all dice are the same. Click each die to freeze it at its
				current value between rolls.
			</p>
			<div className="dice-container">{diceElements}</div>
			{tenzies && (
				<div className="results-container">
					<p className="instructions">Time: {userTime.toFixed(2)} seconds</p>

					<p className="instructions">
						Best Time:{' '}
						{userLocalTime === null
							? userTime.toFixed(2)
							: userLocalTime < userTime
							? userLocalTime
							: userTime.toFixed(2)}{' '}
						seconds
					</p>

					<p className="instructions">Rolls Taken: {rollCount}</p>
				</div>
			)}
			<button className="new-dice-btn" onClick={rollDice}>
				{tenzies ? 'New Game' : 'Roll'}
			</button>
		</main>
	);
}

export default App;
