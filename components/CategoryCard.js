"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const CategoryCard = ({ category, activeCategory, quizInProgress, onClick, link }) => {
  const handleClick = (e) => {
    if (!quizInProgress) {
      // Prevent default if it's a button click to avoid any navigation issues
      if (e) e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div
      className="col-lg-3 col-md-6 mb-4"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={`card bg-light text-dark shadow-sm border-0 ${quizInProgress ? "opacity-50" : ""}`}
        style={{
          cursor: quizInProgress ? "not-allowed" : "pointer",
          border: activeCategory === category ? "2px solid #0d6efd" : "none",
        }}
        aria-disabled={quizInProgress}
      >
        <div className="card-body text-center">
          <h5 className="card-title">{category}</h5>
          {link ? (
            <Link href={link} passHref>
              <button 
                className="btn btn-primary btn-gradient" 
                disabled={quizInProgress}
                onClick={handleClick}
              >
                Start {category} Exam
              </button>
            </Link>
          ) : (
            <button 
              className="btn btn-primary btn-gradient" 
              disabled={quizInProgress}
              onClick={handleClick}
            >
              Start {category} Quiz
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;