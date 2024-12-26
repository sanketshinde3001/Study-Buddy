'use client'
import { useState } from 'react';
import axios from 'axios';
import { QuizQuestion } from './types';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import QuizDisplay from './QuizDisplay';
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";

const QuizGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useCopilotReadable({
    description: "A info about quiz generation.",
    value: ' It generate the quiz on the specific topic given by the user.It have 4 options and also count time needed for it to complete.',
  })

  useCopilotAction({
    name: "generatequiz",
    description: "Topic of the quiz. ",
    parameters: [
      {
        name: "quiztopic",
        type: "string",
        required: true,
      }
    ],
    handler: async ({ quiztopic }) => {
      setInputText(quiztopic)
      try {
        await generateQuiz1(quiztopic)
        return "Quiz generated sucessfully on given topic , On which topic you want to make quiz next ?"
      } catch (error) {
        return "Failed to create quiz";
      }

    },
  });

  const generateQuiz1 = async (ip: string) => {
    setLoading(true);
    setShowQuiz(false);
    setError(null);
    try {
      const response = await axios.post('/api/quiz', { paragraph: ip });

      console.log(response.data); // Confirm response structure

      // Check if quizQuestions exists or use response data directly
      const generatedQuestions = Array.isArray(response.data.quizQuestions)
        ? response.data.quizQuestions
        : response.data;

      if (Array.isArray(generatedQuestions)) {
        setQuizQuestions(generatedQuestions);
        setShowQuiz(true);
      } else {
        setError("Invalid data format from API.Please try again.");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      setError("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async () => {
    setLoading(true);
    setShowQuiz(false);
    setError(null);
    try {
      console.log("here" + inputText)
      const response = await axios.post('/api/quiz', { paragraph: inputText });

      console.log(response.data); // Confirm response structure

      // Check if quizQuestions exists or use response data directly
      const generatedQuestions = Array.isArray(response.data.quizQuestions)
        ? response.data.quizQuestions
        : response.data;

      if (Array.isArray(generatedQuestions)) {
        setQuizQuestions(generatedQuestions);
        setShowQuiz(true);
      } else {
        setError("Invalid data format from API.Please try again.");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      setError("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Generate Quiz</h2>

      <Input
        type="text"
        placeholder="Paste your text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
      />

      <Button onClick={generateQuiz} disabled={loading}>
        {loading ? 'Generating Quiz...' : 'Generate Quiz'}
      </Button>

      {error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}

      {showQuiz && quizQuestions && quizQuestions.length > 0 ? (
        <div className="mt-6 space-y-4">
          <h3 className="text-xl font-semibold">Your Quiz</h3>
          <QuizDisplay questions={quizQuestions} />
        </div>
      ) : (
        showQuiz && !loading && (
          <p className="text-gray-500 mt-4">No questions generated. Please try again with different text.</p>
        )
      )}
      
    </div>
  );
};

export default QuizGenerator;
