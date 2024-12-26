'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Flashcard } from './typs';
import FlashcardItem from "@/app/flashcard/Flashcarditems";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";

const FlashcardGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);

  useCopilotReadable({
    description: "A info about cards generation.",
    value: ' It generate the cards on the specific topic given by the user.It have question and answer along with explanation.',
  })

  useCopilotAction({
    name: "generateflashcard",
    description: "Paragraph on which flashcards generate. ",
    parameters: [
      {
        name: "paragraph",
        type: "string",
        required: true,
      }
    ],
    handler: async ({ paragraph }) => {
      setInputText(paragraph)
      try {
        await generateFlashcards1(paragraph)
        return "Flashcard generated sucessfully on given topic , On which topic you want to make Flashcard next ?"
      } catch (error) {
        return "Failed to create flashcards.";
      }

    },
  });

  useEffect(() => {
    const words = inputText.trim().split(/\s+/).length;
    setWordCount(inputText.trim() === '' ? 0 : words);
  }, [inputText]);

  const generateFlashcards1 = async (ip:string) => {


    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/cards', { paragraph: ip });
      console.log(response.data);

      if (response.data && Array.isArray(response.data.flashcards)) {
        setFlashcards(response.data.flashcards);
      } else {
        setError("An error occurred while generating flashcards.");
      }
    } catch (error: any) {
      console.error("Error generating flashcards:", error);
      setError(error.response?.data?.error || "An error occurred while generating flashcards.");
    } finally {
      setLoading(false);
    }
  };
  const generateFlashcards = async () => {
    if (wordCount < 150) {
      setError("Please enter at least 150 words to generate flashcards.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/cards', { paragraph: inputText });
      console.log(response.data);

      if (response.data && Array.isArray(response.data.flashcards)) {
        setFlashcards(response.data.flashcards);
      } else {
        setError("An error occurred while generating flashcards.");
      }
    } catch (error: any) {
      console.error("Error generating flashcards:", error);
      setError(error.response?.data?.error || "An error occurred while generating flashcards.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateFlashcards();
    }
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto p-8">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            AI Flashcard Generator
          </h2>
          <p className="text-white mt-2">
            Transform your text into interactive flashcards for better learning
          </p>
        </div>

        <Card className="p-6 mb-8">
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Paste your text here (minimum 150 words)..."
                className="w-full min-h-[200px] p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
                style={{ height: `${Math.max(200, Math.min(600, inputText.length / 3))}px` }}
              />
              <div className="absolute bottom-3 right-3 text-sm text-gray-800">
                {wordCount} words {wordCount < 150 && wordCount > 0 &&
                  <span className="text-amber-500">
                    ({150 - wordCount} more words needed)
                  </span>
                }
                {wordCount > 1000 && wordCount > 0 &&
                  <span className="text-amber-500">
                    (You entered {wordCount - 1000} more words than limit.)
                  </span>
                }
                {wordCount >= 150 &&
                  <CheckCircle2 className="inline ml-2 text-green-500 w-4 h-4" />
                }
              </div>
            </div>

            <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-5">
              <p className="text-sm text-gray-800">
                <BookOpen className="inline mr-2 w-4 h-4" />
                Press Enter or click Generate to create flashcards
              </p>
              <Button
                onClick={generateFlashcards}
                disabled={loading || wordCount < 150}
                className="relative min-w-[180px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Flashcards'
                )}
              </Button>
            </div>
          </div>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
      <div className='pb-10'>
        {loading && (
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
            </div>
            <p className="text-white">Creating your flashcards...</p>
          </div>
        )}

        {flashcards.length > 0 && !loading && (
          <div className='px-10 '>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-white">
                  Generated Flashcards
                </h3>
                <p className="text-white">
                  {flashcards.length} cards created
                </p>
              </div>
              <div className="grid gap-4 px-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {flashcards.map((card, index) => (
                  <FlashcardItem key={index} flashcard={card} />
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>


  );
};

export default FlashcardGenerator;
