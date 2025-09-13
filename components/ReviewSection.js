"use client";

const ReviewSection = ({ questions, userAnswers, score, resetQuiz }) => {
  return (
    <div className="review-section">
      <h2 className="text-center mb-4">Quiz Review</h2>
      <div className="row">
        {questions.map((question, index) => (
          <div key={question.id} className="col-lg-8 mb-4 mx-auto">
            <div className="card p-4 bg-white text-dark shadow-sm border-0">
              <h5 className="mb-4">{question.question}</h5>
              {question.options.map((option, idx) => (
                <div key={option} className="form-check mb-3">
                  <input
                    type="radio"
                    className="form-check-input"
                    name={`q-${question.id}`}
                    value={option}
                    disabled
                    checked={userAnswers[question.id] === option}
                    aria-label={`Option: ${option}`}
                  />
                  <label className="form-check-label">
                    <strong>{String.fromCharCode(65 + idx)}.</strong> {option}
                  </label>
                </div>
              ))}
              {question.answer === userAnswers[question.id] ? (
                <p className="text-success">✔ Correct</p>
              ) : (
                <p className="text-danger">✖ Incorrect (Correct Answer: {question.answer})</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <h3 className="text-gradient">Your Score: {score}</h3>
        <button className="btn btn-warning btn-gradient mt-3" onClick={resetQuiz}>
          Back to Quiz
        </button>
      </div>
    </div>
  );
};

export default ReviewSection;