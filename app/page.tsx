"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "usehooks-ts";
import { Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactGA from "react-ga4"; // Import Google Analytics
import { useSwipeable } from "react-swipeable"; // Import swipeable hook

// Import the questions data directly
import questionsData from "@/data/questions.json";

export default function Home() {
  // Initialize state with imported data
  const [questions] = useState<string[]>(questionsData.questions || []);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [remainingQuestions, setRemainingQuestions] = useState<string[]>(
    questionsData.questions || [],
  );
  const [liked, setLiked] = useLocalStorage<string[]>("likedQuestions", []);
  const [questionHistory, setQuestionHistory] = useState<string[]>([]); // History of previous questions

  // State to handle the initial welcome message
  const [showIntro, setShowIntro] = useState<boolean>(true);

  useEffect(() => {
    if (!showIntro) {
      nextQuestion();

      // Attach keyboard event listener
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === " " || e.key === "ArrowRight") {
          e.preventDefault();
          nextQuestion();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          previousQuestion();
        }
      };

      // Ensure the event listener is attached to the window
      window.addEventListener("keydown", handleKeyDown);

      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [showIntro]);

  const nextQuestion = () => {
    let questionSet = remainingQuestions;
    if (questionSet.length === 0) {
      questionSet = questions.filter((q) => q !== currentQuestion);
      setRemainingQuestions(questionSet);
    }
    const randomIndex = Math.floor(Math.random() * questionSet.length);

    // Update history and current question
    if (currentQuestion) {
      setQuestionHistory((prevHistory) => [...prevHistory, currentQuestion]);
    }

    setCurrentQuestion(questionSet[randomIndex]);
    setRemainingQuestions(
      questionSet.filter((_, index) => index !== randomIndex),
    );

    // Track the next question click event
    ReactGA.event({
      category: "User",
      action: "Clicked Next Question",
    });
  };

  const previousQuestion = () => {
    if (questionHistory.length > 0) {
      const lastQuestion = questionHistory[questionHistory.length - 1];
      setQuestionHistory((prevHistory) => prevHistory.slice(0, -1));
      setRemainingQuestions((prevRemaining) => [
        currentQuestion,
        ...prevRemaining,
      ]);
      setCurrentQuestion(lastQuestion);
    }
  };

  const toggleLike = () => {
    if (liked.includes(currentQuestion)) {
      setLiked(liked.filter((q) => q !== currentQuestion));
    } else {
      setLiked([...liked, currentQuestion]);
    }
  };

  // Swipe handlers
  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => nextQuestion(),
    onSwipedRight: () => previousQuestion(),
    preventScrollOnSwipe: true, // Corrected property name
    trackMouse: true,
  });

  return (
    <div
      {...handlers}
      className="relative flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-200 bg-gray-100 dark:bg-gray-900"
      onClick={nextQuestion}
    >
      {/* Show Intro Message if First Visit */}
      {showIntro && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-800 p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Hey!!
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            This is a simple app to display random, but interesting questions.
            To show the next question, simply click anywhere on the screen or
            press the right arrow key. To go back to the previous question,
            press the left arrow key. If you are on a touch device, you can also
            swipe left or right. Have fun! 🎉
          </p>
          <Button
            onClick={() => setShowIntro(false)}
            className="text-lg border border-blue-500"
          >
            Start Game
          </Button>
        </div>
      )}

      {/* Question Display */}
      {!showIntro && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200 px-4"
          >
            {currentQuestion}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Fixed Position Buttons */}
      {!showIntro && (
        <div
          className="fixed bottom-4 flex space-x-4"
          onClick={(e) => e.stopPropagation()} // Prevent triggering nextQuestion
        >
          {/* Previous Question Button with Icon */}
          <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering nextQuestion
              previousQuestion();
            }}
            className="text-lg border border-blue-500"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>

          {/* Next Question Button with Icon */}
          <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering nextQuestion
              nextQuestion();
            }}
            className="text-lg border border-blue-500"
          >
            <ArrowRight className="h-6 w-6" />
          </Button>

          {/* Like Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering nextQuestion
              toggleLike();
            }}
            className={`transition-colors duration-200 ${
              liked.includes(currentQuestion)
                ? "text-red-500 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Heart className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}
