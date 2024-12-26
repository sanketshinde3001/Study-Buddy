'use client'
import { useState, useEffect,useRef } from 'react';
import { QuizQuestion } from './types';
import { Card } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Award, Timer, ArrowRight } from 'lucide-react';

interface QuizDisplayProps {
  questions: QuizQuestion[];
}

const QuizDisplay = ({ questions }: QuizDisplayProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    // Start timer interval
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => {
      // Clear interval when component unmounts or isQuizComplete updates
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isQuizComplete && timerRef.current) {
      clearInterval(timerRef.current); // Stop timer when quiz completes
    }
  }, [isQuizComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionClick = (option: string) => {
    if (showAnswer) return;
    setSelectedOption(option);
    setShowAnswer(true);

    if (option === currentQuestion.correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setIsQuizComplete(true); 
    } else {
      setShowAnswer(false);
      setSelectedOption(null);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  }
  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Perfect Score! Exceptional! 🌟";
    if (percentage >= 80) return "Great Job! Well Done! 🎉";
    if (percentage >= 60) return "Good Effort! Keep Learning! 📚";
    return "Keep Practicing! You'll Get Better! 💪";
  };

  if (isQuizComplete) {
    return (
      <Card className="p-8 max-w-2xl mx-auto">
        <div className="text-center space-y-6">
          <Award className="w-16 h-16 mx-auto text-yellow-500 animate-pulse" />
          <h2 className="text-2xl font-bold">Quiz Complete!</h2>
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">{score} / {questions.length}</p>
            <p className="text-gray-600 mt-2">{getScoreMessage()}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Time Taken</p>
              <p className="text-lg font-semibold">{formatTime(timer)}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Accuracy</p>
              <p className="text-lg font-semibold">
                {Math.round((score / questions.length) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4" />
            {formatTime(timer)}
          </div>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-600 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Score display */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Score: {score}
        </h4>
      </div>

      {/* Question */}
      <div className="mb-6">
        <p className="text-lg font-medium mb-4">{currentQuestion.question}</p>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isCorrect = option === currentQuestion.correctAnswer;
            const isSelected = option === selectedOption;
            let buttonClassName = "w-full text-left p-4 rounded-lg border transition-all duration-200 ";
            
            if (showAnswer) {
              if (isCorrect) {
                buttonClassName += "bg-green-50 border-green-200 text-green-700 ";
              } else if (isSelected && !isCorrect) {
                buttonClassName += "bg-red-50 border-red-200 text-red-700 ";
              } else {
                buttonClassName += "bg-gray-50 border-gray-200 text-gray-500 ";
              }
            } else {
              buttonClassName += "hover:bg-purple-50 hover:border-purple-200 ";
            }

            return (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleOptionClick(option)}
                disabled={showAnswer}
                className={buttonClassName}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{option}</span>
                  {showAnswer && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  {showAnswer && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Feedback and Next button */}
      {showAnswer && (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${
            selectedOption === currentQuestion.correctAnswer 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-md font-medium ${
              selectedOption === currentQuestion.correctAnswer ? 'text-green-700' : 'text-red-700'
            }`}>
              {selectedOption === currentQuestion.correctAnswer 
                ? 'Correct! Well done! ✨' 
                : `Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`
              }
            </p>
          </div>
          <Button
            onClick={handleNextQuestion}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {currentQuestionIndex === questions.length - 1 ? (
              'Finish Quiz'
            ) : (
              <span className="flex items-center justify-center gap-2">
                Next Question <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default QuizDisplay;