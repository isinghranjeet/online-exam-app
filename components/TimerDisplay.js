"use client";

const TimerDisplay = ({ timeLeft, quizInProgress }) => {
  if (!quizInProgress) return null;
  
  return (
    <div className="timer-display">
      <h3 className="text-muted">Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</h3>
    </div>
  );
};

export default TimerDisplay;