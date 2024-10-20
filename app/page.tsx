"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "usehooks-ts";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function Home() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [remainingQuestions, setRemainingQuestions] = useState<string[]>([]);
  const [liked, setLiked] = useLocalStorage<string[]>("likedQuestions", []);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/questions");
      const data = await response.json();
      if (data.questions) {
        setQuestions(data.questions);
        setRemainingQuestions(data.questions);
        nextQuestion(data.questions);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const nextQuestion = (questionSet: string[] = remainingQuestions) => {
    if (questionSet.length === 0) {
      setRemainingQuestions(questions.filter((q) => q !== currentQuestion));
      questionSet = questions.filter((q) => q !== currentQuestion);
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-200 bg-gray-100 dark:bg-gray-900">
      <Button
        className="absolute top-4 right-4"
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? "🌞" : "🌙"}
      </Button>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200"
        >
          {currentQuestion}
        </motion.div>
      </AnimatePresence>
      <div className="flex space-x-4">
        <Button onClick={() => nextQuestion()} className="text-lg">
          Next Question
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleLike}
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
