import React from 'react';

function Die(props) {
	console.log(props.rollCount);
	const styles = {
		backgroundColor: props.isHeld ? '#59E391' : 'white',
		cursor: props.rollCount === 0 ? 'not-allowed' : 'pointer',
	};
	return (
		<div className="die-face" style={styles} onClick={props.holdDice}>
			<h2 className="die-num">{props.value}</h2>
		</div>
	);
}

export default Die;
