import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import './BalloonGame.css';// Importing CSS styles
import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Balloon component, representing a single balloon
const Balloon = ({ id, popped, onClick, position, color }) => {
  return (
    <TouchableOpacity
      onPress={() => onClick(id)}// Handling click/touch event
      style={{
        position: 'absolute',
        left: position.x || 0,// Balloon's left position
        top: position.y || 0,// Balloon's top position
      }}
    >
      <Image
        source={popped ? require('../Assest/Popped.png') : require('../Assest/Balloon.png')}
        style={{
          width: 100,
          height: 100,
          tintColor: popped ? 'white' : undefined, // Tint color of the balloon
        }}
      />
    </TouchableOpacity>
  );
};

// Main BalloonGame component
const BalloonGame = () => {
  const [balloons, setBalloons] = useState([]); // Balloons array
  const [score, setScore] = useState(0);// Score
  const [time, setTime] = useState(120);  // Game time
  const [scoreColor, setScoreColor] = useState('white');// Color of the score
  const [gameOver, setGameOver] = useState(false); // Game over flag
  const [gameStarted, setGameStarted] = useState(false); // Game started flag
  const [minutes, setMinutes] = useState(0); // Minutes remaining
  const [seconds, setSeconds] = useState(0); // Seconds remaining

  // useEffect hook for generating new balloons at intervals
  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        const newBalloon = {
          id: Math.random().toString(36).substring(7), // Generating unique ID for each balloon
          popped: false, // Initially balloons are not popped
          position: {
            x: Math.random() * screenWidth - 10, // Random X position within screen width
            y: screenHeight, // Y position at the bottom of the screen
          },
          speed: Math.random() * 5 + 2, // Random speed for the balloon
        };
        setBalloons(prevBalloons => [...prevBalloons, newBalloon]); // Adding new balloon to the balloons array
      }, 1000); // Interval of 1 second
      return () => clearInterval(interval); // Cleanup function to clear the interval
    }
  }, [gameStarted]);

  // useEffect hook for updating balloon positions
  useEffect(() => {
    if (!gameOver && gameStarted) {
      const updateBalloonsPosition = () => {
        setBalloons(prevBalloons =>
          prevBalloons.map(balloon => {
            const newPosition = { ...balloon.position, y: balloon.position.y - balloon.speed }; // Calculating new position of the balloon
            if (newPosition.y < -50) {
              if (score === 0) {
                return null;
              }
              setScore(prevScore => Math.max(0, Number(prevScore - 1))); // Decrementing score
              setScoreColor('red'); // Setting score color to red
              setTimeout(() => {
                setScoreColor('white'); // Resetting score color after 1 second
              }, 1000);
              return null;
            }
            return { ...balloon, position: newPosition }; // Returning updated balloon position
          }).filter(balloon => balloon !== null) // Filtering out popped balloons
        );
      };

      const animationFrame = requestAnimationFrame(updateBalloonsPosition); // Requesting animation frame

      return () => cancelAnimationFrame(animationFrame); // Cleanup function to cancel animation frame
    }
  }, [balloons, gameOver, gameStarted, score]);

  // useEffect hook for updating game timer
  useEffect(() => {
    let timerInterval;
    if (!gameOver && gameStarted) {
      timerInterval = setInterval(() => {
        setTime(prevTime => {
          if (prevTime === 0) {
            clearInterval(timerInterval); // Clearing timer interval if time is up
            setGameOver(true); // Setting game over flag
            return 0;
          }
          return prevTime - 1; // Decrementing time
        });
      }, 1000); // Interval of 1 second
    }

    return () => clearInterval(timerInterval); // Cleanup function to clear timer interval
  }, [gameOver, gameStarted]);

  // useEffect hook for updating minutes and seconds
  useEffect(() => {
    setMinutes(Math.floor(time / 60)); // Calculating minutes
    setSeconds(time % 60); // Calculating seconds
  }, [time]);

  // Function to handle popping balloons
  const popBalloon = id => {
    if (!gameOver && gameStarted) {
      setBalloons(prevBalloons =>
        prevBalloons.map(balloon =>
          balloon.id === id ? { ...balloon, popped: true } : balloon // Marking the balloon as popped
        )
      );
      setScore(prevScore => {
        const newScore = prevScore + 2; // Incrementing score
        if (newScore > prevScore) {
          setScoreColor('green'); // Setting score color to green if score increases
          setTimeout(() => {
            setScoreColor('white'); // Resetting score color after 1 second
          }, 1000);
        } else {
          setScoreColor('white');
          setTimeout(() => {
            setScoreColor('white');
          }, 1000);
        }
        return newScore; // Returning new score
      });
      setTimeout(() => {
        setBalloons(prevBalloons =>
          prevBalloons.filter(balloon => balloon.id !== id) // Removing popped balloon from balloons array after a delay
        );
      }, 100);
    }
  };

  // Function to handle try again button click
  const handleTryAgain = () => {
    setBalloons([]); // Clearing balloons array
    setScore(0); // Resetting score
    setTime(120); // Resetting time
    setGameOver(false); // Resetting game over flag
    setGameStarted(true); // Setting game started flag
  };

  // Function to handle start game button click
  const handleStartGame = () => {
    setGameStarted(true); // Setting game started flag
  };

// Render different screens based on game state
if (!gameStarted) {
  // Render the initial screen when the game is not started
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00072d' }}>
      {/* Title */}
      <Text style={{ color: 'white', fontSize: 50 }}>Balloon Popper</Text>
      {/* Button to start the game */}
      <TouchableOpacity
        style={{
          backgroundColor: '#00072d',
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 5,
          marginTop: 20,
        }}
        onPress={handleStartGame}
      >
        <Text style={{ color: 'white', fontSize: 24 }}>Play</Text>
      </TouchableOpacity>
    </View>
  );
}

// Render different screens based on game state
return (
  <View style={{ flex: 1, backgroundColor: '#00072d' }}>
    {gameOver ? ( // If game over, render game over screen
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Game over message with score */}
        <Text style={{ color: 'white', justifyContent:'center',alignItems:'center', fontSize: 30 }}>
          Game Over! Your Score: {score}
        </Text>
        {/* Button to try again */}
        <TouchableOpacity
          style={{
            backgroundColor: '00072d',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 5,
            marginTop: 20,
          }}
          onPress={handleTryAgain}
        >
          <Text style={{ color: 'white', fontSize: 24 }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    ) : ( // If game is not over, render the game screen
      <>
        {/* Display score */}
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ color: scoreColor, fontSize: 50 }}>Score: {score}</Text>
        </View>
        {/* Display time remaining */}
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Text style={{ color: 'white', fontSize: 30 }}>
            Time Left: {minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}
          </Text>
        </View>
        {/* Render balloons */}
        {balloons.map(balloon => (
          <Balloon
            key={balloon.id}
            id={balloon.id}
            popped={balloon.popped}
            onClick={popBalloon}
            position={balloon.position}
            color={balloon.color}
          />
        ))}
      </>
    )}
  </View>
);
};

export default BalloonGame;