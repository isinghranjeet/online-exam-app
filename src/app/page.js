"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { v4 as uuidv4 } from "uuid";
import "bootstrap/dist/css/bootstrap.min.css";

// Import your components (make sure these paths are correct)
import CategoryCard from "../../components/CategoryCard";
import QuestionCard from "../../components/QuestionCard";
import ReviewSection from "../../components/ReviewSection";
import CameraAuth from "../../components/CameraAuth";
import TimerDisplay from "../../components/TimerDisplay";
import Navigation from "../../components/Navigation";

// Constants for better maintainability
const EXAM_DURATION = 600; // 10 minutes in seconds
const QUESTION_TIME_LIMIT = 30; // 30 seconds per question
const LOADER_DURATION = 4000;

// Predefined questions data (moved outside component to prevent recreation)
const QUESTIONS_DATA = {
  Math: [
    { id: uuidv4(), question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "4" },
    { id: uuidv4(), question: "What is 5 * 3?", options: ["15", "10", "20", "25"], answer: "15" },
    { id: uuidv4(), question: "What is 9 / 3?", options: ["1", "2", "3", "4"], answer: "3" },
    { id: uuidv4(), question: "What is 7 - 2?", options: ["3", "4", "5", "6"], answer: "5" },
    { id: uuidv4(), question: "What is 6 + 7?", options: ["11", "12", "13", "14"], answer: "13" },
    { id: uuidv4(), question: "What is 8 * 2?", options: ["14", "16", "18", "20"], answer: "16" },
  ],
  Science: [
    { id: uuidv4(), question: "What planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars" },
    { id: uuidv4(), question: "What is H2O?", options: ["Hydrogen", "Oxygen", "Water", "Helium"], answer: "Water" },
    { id: uuidv4(), question: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"], answer: "Carbon Dioxide" },
    { id: uuidv4(), question: "What force keeps us on the ground?", options: ["Magnetism", "Gravity", "Friction", "Inertia"], answer: "Gravity" },
    { id: uuidv4(), question: "What is the boiling point of water?", options: ["50°C", "100°C", "150°C", "200°C"], answer: "100°C" },
    { id: uuidv4(), question: "What is the chemical symbol for gold?", options: ["Au", "Ag", "Fe", "Cu"], answer: "Au" },
  ],
  History: [
    { id: uuidv4(), question: "Who was the first President of the United States?", options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"], answer: "George Washington" },
    { id: uuidv4(), question: "In what year did World War II end?", options: ["1943", "1944", "1945", "1946"], answer: "1945" },
    { id: uuidv4(), question: "Who wrote the Declaration of Independence?", options: ["Benjamin Franklin", "Thomas Jefferson", "John Adams", "James Madison"], answer: "Thomas Jefferson" },
    { id: uuidv4(), question: "Which ancient civilization built the pyramids?", options: ["Romans", "Greeks", "Egyptians", "Mayans"], answer: "Egyptians" },
    { id: uuidv4(), question: "What year did the American Civil War start?", options: ["1859", "1861", "1863", "1865"], answer: "1861" },
    { id: uuidv4(), question: "Who discovered America?", options: ["Christopher Columbus", "Vasco da Gama", "Ferdinand Magellan", "James Cook"], answer: "Christopher Columbus" },
  ],
  English: [
    { id: uuidv4(), question: "What is the antonym of 'happy'?", options: ["Sad", "Angry", "Excited", "Bored"], answer: "Sad" },
    { id: uuidv4(), question: "Which is a noun?", options: ["Run", "Jump", "House", "Quickly"], answer: "House" },
    { id: uuidv4(), question: "What is the plural of 'mouse'?", options: ["Mouses", "Mice", "Mousees", "Mousies"], answer: "Mice" },
    { id: uuidv4(), question: "Which word is an adjective?", options: ["Dog", "Beautiful", "Run", "Speak"], answer: "Beautiful" },
    { id: uuidv4(), question: "Which word is a verb?", options: ["Quickly", "Table", "Jump", "Soft"], answer: "Jump" },
    { id: uuidv4(), question: "What is the past tense of 'run'?", options: ["Ran", "Running", "Runs", "Runned"], answer: "Ran" },
  ],
  Coding: [
    { id: uuidv4(), question: "Which language is known as the backbone of web development?", options: ["Python", "JavaScript", "Java", "C++"], answer: "JavaScript" },
    { id: uuidv4(), question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], answer: "Hyper Text Markup Language" },
    { id: uuidv4(), question: "Which symbol is used for single line comments in JavaScript?", options:["/*", "//", "<!--", "#"], answer: "//" },
    { id: uuidv4(), question: "Which data structure uses LIFO (Last In First Out)?", options: ["Queue", "Stack", "Array", "Linked List"], answer: "Stack" },
    { id: uuidv4(), question: "What is the output of: console.log(typeof null) in JavaScript?", options: ["null", "undefined", "object", "string"], answer: "object" },
    { id: uuidv4(), question: "Which method is used to add an element at the end of an array?", options: ["push()", "pop()", "shift()", "unshift()"], answer: "push()" },
  ],
};

// Predefined positions to avoid random values that cause hydration mismatch
const FLOATING_SHAPE_POSITIONS = [
  { top: 13.64, left: 45.28 },
  { top: 17.09, left: 53.06 },
  { top: 59.46, left: 85.23 },
  { top: 70.27, left: 52.68 },
  { top: 61.51, left: 80.74 },
  { top: 34.67, left: 21.03 },
  { top: 71.09, left: 86.42 },
  { top: 30.83, left: 25.84 }
];

const PARTICLE_POSITIONS = [
  { top: 53.21, left: 21.29, size: '6.5px', delay: '0s', duration: 4.95 },
  { top: 31.56, left: 61.20, size: '2.31px', delay: '0.2s', duration: 3.65 },
  { top: 69.24, left: 17.28, size: '3.07px', delay: '0.4s', duration: 2.81 },
  { top: 68.99, left: 69.73, size: '2.34px', delay: '0.6s', duration: 2.45 },
  { top: 18.34, left: 83.69, size: '6.34px', delay: '0.8s', duration: 3.44 },
  { top: 30.38, left: 50.63, size: '4.77px', delay: '1s', duration: 4.38 },
  { top: 16.06, left: 36.80, size: '2.79px', delay: '1.2s', duration: 3.79 },
  { top: 33.16, left: 15.12, size: '6.97px', delay: '1.4s', duration: 4.94 },
  { top: 91.38, left: 25.96, size: '5.03px', delay: '1.6s', duration: 3.83 },
  { top: 3.86, left: 38.55, size: '4.22px', delay: '1.8s', duration: 3.81 },
  { top: 21.09, left: 57.86, size: '2.80px', delay: '2s', duration: 4.78 },
  { top: 54.83, left: 48.82, size: '2.21px', delay: '2.2s', duration: 3.93 },
  { top: 49.47, left: 40.74, size: '3.53px', delay: '2.4s', duration: 4.35 },
  { top: 45.51, left: 71.70, size: '3.69px', delay: '2.6s', duration: 3.73 },
  { top: 23.98, left: 23.13, size: '2.56px', delay: '2.8s', duration: 4.77 }
];

// CSS animations as a constant to avoid dynamic injection
const LOADER_ANIMATIONS = `
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-30px) rotate(180deg); }
  }
  @keyframes pulse {
    0% { transform: scale(0.5); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }
  @keyframes bounce {
    0% { transform: scaleY(1); }
    100% { transform: scaleY(1.5); }
  }
  @keyframes fadeIn {
    to { opacity: 1; }
  }
  @keyframes progressGlow {
    0% { left: -30px; }
    100% { left: calc(100% + 30px); }
  }
  @keyframes particleMove {
    0% { transform: translate(0, 0); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translate(var(--distance), var(--distance)); opacity: 0; }
  }
`;

// Custom hook for fullscreen management
const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const enterFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      return true;
    }
    
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      try {
        await elem.requestFullscreen();
        return true;
      } catch (error) {
        console.error("Failed to enter fullscreen mode:", error);
        return false;
      }
    }
    return false;
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return { isFullscreen, enterFullscreen, exitFullscreen };
};

// Custom hook for timer management
const useTimer = (initialTime, onTimeUp, isActive) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft > 0 && isActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isActive) {
      onTimeUp && onTimeUp();
    }
  }, [timeLeft, isActive, onTimeUp]);

  const resetTimer = useCallback((newTime = initialTime) => {
    setTimeLeft(newTime);
  }, [initialTime]);

  return { timeLeft, resetTimer };
};

// AdvancedNetflixLoader component
const AdvancedNetflixLoader = ({ duration = 3000, onComplete, interactive = true }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Add CSS animations to document head
    const style = document.createElement('style');
    style.textContent = LOADER_ANIMATIONS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            onComplete && onComplete();
          }, 600);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  useEffect(() => {
    if (!interactive || !loaderRef.current || !isClient) return;

    const handleMouseMove = (e) => {
      const rect = loaderRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      loaderRef.current.style.setProperty('--mouse-x', `${x}%`);
      loaderRef.current.style.setProperty('--mouse-y', `${y}%`);
    };

    const currentRef = loaderRef.current;
    currentRef.addEventListener('mousemove', handleMouseMove);

    return () => {
      currentRef.removeEventListener('mousemove', handleMouseMove);
    };
  }, [interactive, isClient]);

  // Inline styles for the loader
  const loaderStyles = {
    loaderContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      overflow: 'hidden',
    },
    backgroundAnimation: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0
    },
    floatingShapes: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0
    },
    floatingShape: (delay, size, duration, color, top, left) => ({
      position: 'absolute',
      backgroundColor: color,
      borderRadius: '50%',
      width: size,
      height: size,
      opacity: 0.6,
      animation: `float ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      top: `${top}%`,
      left: `${left}%`,
    }),
    pulseWaves: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    pulseWave: (delay) => ({
      position: 'absolute',
      width: '200px',
      height: '200px',
      border: '2px solid rgba(13, 110, 253, 0.5)',
      borderRadius: '50%',
      animation: 'pulse 3s ease-out infinite',
      animationDelay: delay,
    }),
    content: {
      position: 'relative',
      zIndex: 2,
      textAlign: 'center',
      color: 'white'
    },
    logoContainer: {
      marginBottom: '2rem'
    },
    netflixIcon: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '1.5rem'
    },
    iconBar: (delay) => ({
      width: '15px',
      height: '50px',
      background: '#0d6efd',
      margin: '0 2px',
      animation: 'bounce 1.2s infinite alternate',
      animationDelay: delay,
    }),
    logoText: {
      display: 'flex',
      justifyContent: 'center',
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginTop: '1rem'
    },
    logoLetter: (delay) => ({
      opacity: 0,
      animation: 'fadeIn 0.5s forwards',
      animationDelay: `${delay}s`,
      color: '#0d6efd',
      textShadow: '0 0 10px rgba(13, 110, 253, 0.7)'
    }),
    progressSection: {
      margin: '2rem 0'
    },
    progressBar: {
      width: '300px',
      height: '8px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      overflow: 'hidden',
      margin: '0 auto'
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #0d6efd, #6610f2)',
      borderRadius: '4px',
      position: 'relative',
      transition: 'width 0.3s ease',
      width: `${progress}%`
    },
    progressGlow: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '30px',
      background: 'rgba(255, 255, 255, 0.6)',
      animation: 'progressGlow 2s infinite',
      filter: 'blur(5px)'
    },
    progressText: {
      marginTop: '1rem',
      fontSize: '1.2rem',
      color: '#fff'
    },
    loadingMessage: {
      marginTop: '1rem',
      fontSize: '1rem',
      color: 'rgba(255, 255, 255, 0.7)'
    },
    particles: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0
    },
    particle: (size, delay, duration, top, left) => ({
      position: 'absolute',
      background: 'rgba(13, 110, 253, 0.8)',
      borderRadius: '50%',
      width: size,
      height: size,
      animation: `particleMove ${duration}s linear infinite`,
      animationDelay: delay,
      top: `${top}%`,
      left: `${left}%`,
    }),
  };

  if (!isVisible || !isClient) return null;

  return (
    <div 
      ref={loaderRef}
      style={loaderStyles.loaderContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background elements */}
      <div style={loaderStyles.backgroundAnimation}>
        <div style={loaderStyles.floatingShapes}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={loaderStyles.floatingShape(
              i * 0.7, 
              `${20 + (i * 5)}px`, 
              3 + (i * 0.5), 
              i % 2 === 0 ? '#0d6efd' : '#6610f2',
              FLOATING_SHAPE_POSITIONS[i].top,
              FLOATING_SHAPE_POSITIONS[i].left
            )} />
          ))}
        </div>

        <div style={loaderStyles.pulseWaves}>
          <div style={loaderStyles.pulseWave('0s')}></div>
          <div style={loaderStyles.pulseWave('0.5s')}></div>
          <div style={loaderStyles.pulseWave('1s')}></div>
        </div>
      </div>

      {/* Main content */}
      <div style={loaderStyles.content}>
        <div style={loaderStyles.logoContainer}>
          <div style={loaderStyles.netflixIcon}>
            <div style={loaderStyles.iconBar('0s')}></div>
            <div style={loaderStyles.iconBar('0.2s')}></div>
            <div style={loaderStyles.iconBar('0.4s')}></div>
          </div>

          <div style={loaderStyles.logoText}>
            {['E', 'X', 'A', 'M', ' ', 'P', 'L', 'A', 'T', 'F', 'O', 'R', 'M'].map((letter, i) => (
              <span 
                key={i} 
                style={loaderStyles.logoLetter(i * 0.05)}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        <div style={loaderStyles.progressSection}>
          <div style={loaderStyles.progressBar}>
            <div style={loaderStyles.progressFill}>
              <div style={loaderStyles.progressGlow}></div>
            </div>
          </div>
          <div style={loaderStyles.progressText}>{progress}%</div>
        </div>

        <div style={loaderStyles.loadingMessage}>
          Preparing your exam environment...
        </div>
      </div>

      {/* Particle effects */}
      <div style={loaderStyles.particles}>
        {PARTICLE_POSITIONS.map((particle, i) => (
          <div 
            key={i}
            style={loaderStyles.particle(
              particle.size,
              particle.delay,
              particle.duration,
              particle.top,
              particle.left
            )}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default function OnlineExam() {
  const [showLoader, setShowLoader] = useState(true);
  const categories = useMemo(() => [
    { name: "Math", image: "/images/math.jpg", icon: "🧮" },
    { name: "Science", image: "/images/science.jpg", icon: "🔬" },
    { name: "History", image: "/images/history.jpg", icon: "📜" },
    { name: "English", image: "/images/english.jpg", icon: "📚" },
    { name: "Coding", image: "/images/coding.jpg", icon: "💻" }
  ], []);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [biometricAuthenticated, setBiometricAuthenticated] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [quizInProgress, setQuizInProgress] = useState(false);
  const [cameraStatus, setCameraStatus] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [hintsUsed, setHintsUsed] = useState({});
  const [isFacialRecognitionLoading, setIsFacialRecognitionLoading] = useState(false);
  const [reviewQuestionIndex, setReviewQuestionIndex] = useState(0);
  const [fullscreenError, setFullscreenError] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  
  // Define handleSubmit first to avoid reference errors
  const handleSubmit = useCallback(() => {
    let newScore = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.answer) {
        newScore += 10;
      }
    });
    setScore(newScore);
    setSubmitted(true);
    setQuizInProgress(false);
    setReviewMode(true);
    if (newScore === questions.length * 10) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [questions, userAnswers]);

  // Custom hooks
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen();
  const { timeLeft: examTimeLeft, resetTimer: resetExamTimer } = useTimer(
    EXAM_DURATION, 
    handleSubmit, 
    quizInProgress && !submitted && activeCategory
  );
  const { timeLeft: questionTimeLeft, resetTimer: resetQuestionTimer } = useTimer(
    QUESTION_TIME_LIMIT, 
    () => handleTimeUpQuestion(), 
    quizInProgress && !submitted && activeCategory
  );

  // Handle loader completion
  useEffect(() => {
    if (!showLoader) {
      // Initialize any resources after loader completes
    }
  }, [showLoader]);

  // Define resetQuiz
  const resetQuiz = useCallback(() => {
    setQuestions([]);
    setUserAnswers({});
    setSubmitted(false);
    resetExamTimer();
    setScore(0);
    setShowConfetti(false);
    setActiveCategory("");
    setQuizInProgress(false);
    setCurrentQuestionIndex(0);
    resetQuestionTimer();
    setReviewMode(false);
    setHintsUsed({});
    setReviewQuestionIndex(0);
    setFullscreenError(false);
    exitFullscreen();
  }, [resetExamTimer, resetQuestionTimer, exitFullscreen]);

  const handleAnswer = useCallback((questionId, answer) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      resetQuestionTimer();
    } else {
      handleSubmit();
    }
  }, [currentQuestionIndex, questions.length, handleSubmit, resetQuestionTimer]);

  const handleTimeUpQuestion = useCallback(() => {
    if (questions[currentQuestionIndex]?.id) {
      handleAnswer(questions[currentQuestionIndex].id, "");
    }
  }, [currentQuestionIndex, questions, handleAnswer]);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && quizInProgress) {
      alert("You have switched tabs. Please return to the quiz.");
      handleSubmit();
    }
  }, [quizInProgress, handleSubmit]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  // Quiz functions
  const fetchQuestions = useCallback(async (category) => {
    if (activeCategory === category || quizInProgress) return;

    if (activeCategory) {
      resetQuiz();
    }

    setLoading(true);
    setActiveCategory(category);
    setQuizInProgress(true);

    const fullscreenSuccess = await enterFullscreen();
    if (!fullscreenSuccess) {
      setFullscreenError(true);
    }

    setTimeout(() => {
      const categoryQuestions = QUESTIONS_DATA[category] || [];
      setQuestions(categoryQuestions);
      setLoading(false);
    }, 1000);
  }, [activeCategory, quizInProgress, enterFullscreen, resetQuiz]);

  const startCamera = useCallback(async () => {
    if (!window.isSecureContext) {
      alert("Camera access requires a secure context (HTTPS).");
      throw new Error("Insecure context");
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setCameraStatus("Camera started. Please look into the camera.");
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraStatus("Failed to access camera. Please allow camera permissions.");
      throw error;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      setCameraStatus("");
    }
  }, [cameraStream]);

  const authenticateWithCamera = useCallback(async () => {
    try {
      await startCamera();
      setBiometricAuthenticated(false);
      setCameraStatus("Looking for face...");
      setIsFacialRecognitionLoading(true);
      setTimeout(() => {
        const isAuthenticated = Math.random() > 0.5;
        if (isAuthenticated) {
          setBiometricAuthenticated(true);
          setCameraStatus("Facial recognition successful!");
        } else {
          setCameraStatus("Facial recognition failed. Please try again.");
        }
        stopCamera();
        setIsFacialRecognitionLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Facial recognition error:", error);
      setCameraStatus("Failed to access camera. Please allow permissions and try again.");
      stopCamera();
      setIsFacialRecognitionLoading(false);
    }
  }, [startCamera, stopCamera]);

  const useHint = useCallback((questionId) => {
    const question = questions.find((q) => q.id === questionId);
    if (question && !hintsUsed[questionId]) {
      const incorrectOptions = question.options.filter((opt) => opt !== question.answer);
      const randomIncorrectOption = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
      setHintsUsed((prev) => ({ ...prev, [questionId]: randomIncorrectOption }));
    }
  }, [questions, hintsUsed]);

  const handlePreviousQuestion = useCallback(() => {
    setReviewQuestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNextQuestion = useCallback(() => {
    setReviewQuestionIndex((prev) => (prev < questions.length - 1 ? prev + 1 : prev));
  }, [questions.length]);

  const requestFullscreenManual = useCallback(async () => {
    try {
      const success = await enterFullscreen();
      if (success) {
        setFullscreenError(false);
      }
    } catch (error) {
      console.log("Manual fullscreen request failed");
    }
  }, [enterFullscreen]);

  return (
    <>
      {showLoader && (
        <AdvancedNetflixLoader 
          duration={LOADER_DURATION} 
          onComplete={() => setShowLoader(false)} 
        />
      )}
      
      {!showLoader && (
        <>
          {showConfetti && <Confetti />}
          <Navigation />
          <TimerDisplay timeLeft={examTimeLeft} quizInProgress={quizInProgress} />

          <div className="container mt-5 pt-5">
            {fullscreenError && (
              <div className="alert alert-warning text-center">
                <p>Fullscreen mode is recommended for the best exam experience.</p>
                <button 
                  className="btn btn-primary btn-sm" 
                  onClick={requestFullscreenManual}
                >
                  Enable Fullscreen
                </button>
              </div>
            )}

            {!quizInProgress && !reviewMode && (
              <>
                <h1 className="fw-bold text-center my-4 text-gradient">Online Exam Platform</h1>
                <h3 className="text-center text-muted">Time Left: {Math.floor(examTimeLeft / 60)}:{(examTimeLeft % 60).toString().padStart(2, "0")}</h3>
               
              </>
            )}

            {!biometricAuthenticated && !quizInProgress && !reviewMode && (
              <CameraAuth
                cameraStream={cameraStream}
                cameraStatus={cameraStatus}
                isFacialRecognitionLoading={isFacialRecognitionLoading}
                authenticateWithCamera={authenticateWithCamera}
                stopCamera={stopCamera}
              />
            )}

            {biometricAuthenticated && !quizInProgress && !reviewMode && (
              <div className="category-section">
                <h2 className="text-center mb-4">Select a Subject</h2>
                <div className="row mt-4">
                  {categories.map((category, index) => (
                    <div 
                      key={index} 
                      className="col-md-4 col-sm-6 mb-4"
                      onMouseEnter={() => setHoveredCategory(category.name)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05, y: -10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="category-card-wrapper"
                      >
                        <CategoryCard
                          category={category.name}
                          icon={category.icon}
                          activeCategory={activeCategory}
                          quizInProgress={quizInProgress}
                          onClick={() => !quizInProgress && fetchQuestions(category.name)}
                          link={category.name === "Coding" ? "/coding" : null}
                          isHovered={hoveredCategory === category.name}
                        />
                      </motion.div>
                    </div>
                  ))}
                </div>
                
              </div>
            )}

            {quizInProgress && !reviewMode && (
              <div className="row mt-4">
                {loading ? (
                  <div className="text-center w-100 my-5">
                    <span className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }}></span>
                  </div>
                ) : questions.length > 0 ? (
                  !submitted ? (
                    <QuestionCard
                      key={questions[currentQuestionIndex].id}
                      question={questions[currentQuestionIndex]}
                      userAnswers={userAnswers}
                      submitted={submitted}
                      handleAnswer={handleAnswer}
                      hintsUsed={hintsUsed}
                      useHint={useHint}
                      questionTimeLeft={questionTimeLeft}
                      currentQuestionIndex={currentQuestionIndex}
                      totalQuestions={questions.length}
                    />
                  ) : (
                    <div className="col-lg-8 mb-4 mx-auto">
                      <div className="card p-4 bg-white text-dark shadow-sm border-0">
                        <h5 className="mb-4">{questions[reviewQuestionIndex].question}</h5>
                        {questions[reviewQuestionIndex].options.map((option, index) => (
                          <div key={option} className="form-check mb-3">
                            <input
                              type="radio"
                              className="form-check-input"
                              name={`q-${questions[reviewQuestionIndex].id}`}
                              value={option}
                              disabled
                              checked={userAnswers[questions[reviewQuestionIndex].id] === option}
                              aria-label={`Option: ${option}`}
                            />
                            <label className="form-check-label">
                              <strong>{String.fromCharCode(65 + index)}.</strong> {option}
                            </label>
                          </div>
                        ))}
                        {questions[reviewQuestionIndex].answer === userAnswers[questions[reviewQuestionIndex].id] ? (
                          <p className="text-success">✔ Correct</p>
                        ) : (
                          <p className="text-danger">✖ Incorrect (Answer: {questions[reviewQuestionIndex].answer})</p>
                        )}
                        <div className="d-flex gap-2 mt-4">
                          <button
                            className="btn btn-sm btn-secondary btn-gradient"
                            onClick={handlePreviousQuestion}
                            disabled={reviewQuestionIndex === 0}
                          >
                            Previous
                          </button>
                          <button
                            className="btn btn-sm btn-secondary btn-gradient"
                            onClick={handleNextQuestion}
                            disabled={reviewQuestionIndex === questions.length - 1}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <p className="text-center">No questions available.</p>
                )}
              </div>
            )}

            {reviewMode && (
              <ReviewSection
                questions={questions}
                userAnswers={userAnswers}
                score={score}
                resetQuiz={resetQuiz}
              />
            )}

            {biometricAuthenticated && !submitted && questions.length > 0 && !reviewMode && (
              <button className="btn btn-success btn-gradient w-100 my-4" onClick={handleSubmit}>
                Submit Answers
              </button>
            )}
          </div>

          <style jsx>{`
            .bg-gradient-primary {
              background: linear-gradient(45deg, #0d6efd, #6610f2);
            }
            .btn-gradient {
              background: linear-gradient(45deg, #0d6efd, #6610f2);
              border: none;
              color: white;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .btn-gradient:hover {
              background: linear-gradient(45deg, #6610f2, #0d6efd);
              transform: translateY(-2px);
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            .text-gradient {
              background: linear-gradient(45deg, #0d6efd, #6610f2);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .camera-preview {
              position: relative;
              width: 200px;
              height: 200px;
              margin: 0 auto;
              border-radius: 50%;
              overflow: hidden;
              border: 4px solid #0d6efd;
            }
            .camera-video {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .camera-loading {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: '100%';
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(0, 0, 0, 0.5);
            }
            .timer-display {
              position: fixed;
              top: 50px;
              right: 20px;
              background: rgba(255, 255, 255, 0.9);
              padding: 10px 20px;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              z-index: 1000;
            }
            .category-preview {
              background: linear-gradient(135deg, #f8f9fa, #e9ecef);
              border-left: 4px solid #0d6efd;
            }
            .image-placeholder {
              height: 150px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), 
                          url('/images/pattern.png');
              color: white;
              font-weight: bold;
              font-size: 1.2rem;
              text-shadow: 1px 1px 3px rgba(0,0,0,0.7);
            }
            .category-card-wrapper {
              cursor: pointer;
            }
          `}</style>
        </>
      )}
    </>
  );
}