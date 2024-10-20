"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "usehooks-ts";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

// Import the questions data directly
import questionsData from "@/data/questions.json";

export default function Home() {
  // Initialize state with imported data
  const [questions, setQuestions] = useState<string[]>(
    questionsData.questions || [],
  );
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [remainingQuestions, setRemainingQuestions] = useState<string[]>(
    questionsData.questions || [],
  );
  const [liked, setLiked] = useLocalStorage<string[]>("likedQuestions", []);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    nextQuestion();
  }, []);

  const nextQuestion = () => {
    let questionSet = remainingQuestions;
    if (questionSet.length === 0) {
      questionSet = questions.filter((q) => q !== currentQuestion);
      setRemainingQuestions(questionSet);
    }
    const randomIndex = Math.floor(Math.random() * questionSet.length);
    setCurrentQuestion(questionSet[randomIndex]);
    setRemainingQuestions(
      questionSet.filter((_, index) => index !== randomIndex),
    );
  };

  const toggleLike = () => {
    if (liked.includes(currentQuestion)) {
      setLiked(liked.filter((q) => q !== currentQuestion));
    } else {
      setLiked([...liked, currentQuestion]);
    }
  };

  return (
    // Make the entire container clickable
    <div
      className="relative flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-200 bg-gray-100 dark:bg-gray-900"
      onClick={nextQuestion}
    >
      {/* Dark Mode Button */}
      {/* <Button */}
      {/*   className="absolute top-4 right-4" */}
      {/*   variant="outline" */}
      {/*   size="icon" */}
      {/*   onClick={(e) => { */}
      {/*     e.stopPropagation(); // Prevent triggering nextQuestion */}
      {/*     setTheme(theme === "dark" ? "light" : "dark"); */}
      {/*   }} */}
      {/* > */}
      {/*   {theme === "dark" ? "🌞" : "🌙"} */}
      {/* </Button> */}

      {/* Question Display */}
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

      {/* Fixed Position Buttons */}
      <div
        className="fixed bottom-4 flex space-x-4"
        onClick={(e) => e.stopPropagation()} // Prevent triggering nextQuestion
      >
        {/* Next Question Button with Border */}
        <Button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering nextQuestion
            nextQuestion();
          }}
          className="text-lg border border-blue-500"
        >
          Next Question
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
    </div>
  );
}
