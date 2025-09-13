"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const QuestionCard = ({
  question,
  userAnswers,
  submitted,
  handleAnswer,
  hintsUsed,
  handleHint, // ✅ Renamed from useHint
}) => {
  const [listening, setListening] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const speakQuestion = () => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = `${question.question}. Options: ${question.options.join(", ")}`;
    window.speechSynthesis.speak(speech);
  };

  const listenToAnswer = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const spokenAnswer = event.results[0][0].transcript.trim().toLowerCase();
      setListening(false);

      const matchedOption = question.options.find(
        (option) => option.toLowerCase() === spokenAnswer
      );

      if (matchedOption) {
        setSelectedOption(matchedOption);
      } else {
        alert("No matching option found. Please try again.");
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech") {
        console.warn("No speech detected. Please try speaking again.");
        alert("No speech detected. Please try again.");
      } else {
        console.error("Speech recognition error:", event.error);
        alert("Error recognizing speech. Please try again.");
      }
      setListening(false);
    };
  };

  const confirmAnswer = () => {
    if (selectedOption) {
      handleAnswer(question.id, selectedOption);
      setSelectedOption(null);
    } else {
      alert("Please select an option before marking the answer.");
    }
  };

  return (
    <motion.div
      className="col-lg-8 mb-4 mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="card p-4 bg-white text-dark shadow-sm border-0">
        <h5 className="mb-4">{question.question}</h5>

        {question.options.map((option, index) => (
          <div key={option} className="form-check mb-3">
            <input
              type="radio"
              className="form-check-input"
              name={`q-${question.id}`}
              value={option}
              disabled={submitted}
              onChange={() => setSelectedOption(option)}
              checked={selectedOption === option}
              aria-label={`Option: ${option}`}
            />
            <label className="form-check-label">
              <strong>{String.fromCharCode(65 + index)}.</strong> {option}
            </label>
          </div>
        ))}

        {submitted && (
          question.answer === userAnswers[question.id] ? (
            <p className="text-success">✔ Correct</p>
          ) : (
            <p className="text-danger">✖ Incorrect (Answer: {question.answer})</p>
          )
        )}

        <div className="d-flex gap-2 mt-4">
          <button
            className="btn btn-sm btn-info btn-gradient"
            onClick={() => handleHint(question.id)} // ✅ Renamed from useHint
            disabled={hintsUsed[question.id]}
          >
            Use Hint
          </button>

          <button
            className="btn btn-sm btn-secondary btn-gradient"
            onClick={speakQuestion}
            disabled={submitted}
          >
            Speak Question
          </button>

          <button
            className="btn btn-sm btn-warning btn-gradient"
            onClick={listenToAnswer}
            disabled={submitted || listening}
          >
            {listening ? "Listening..." : "Speak Answer"}
          </button>

          <button
            className="btn btn-sm btn-success btn-gradient"
            onClick={confirmAnswer}
            disabled={submitted || !selectedOption}
          >
            Mark Answer
          </button>
        </div>

        {hintsUsed[question.id] && (
          <p className="text-muted mt-2">Hint: {hintsUsed[question.id]} is incorrect.</p>
        )}
      </div>
    </motion.div>
  );
};

export default QuestionCard;
