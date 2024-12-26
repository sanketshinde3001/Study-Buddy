import { useState } from 'react';
import { Flashcard } from './typs';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";

interface FlashcardItemProps {
  flashcard: Flashcard;
}

const FlashcardItem = ({ flashcard }: FlashcardItemProps) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <Card className="overflow-hidden w-500px max-sm:w-[90%]">
      <div 
        onClick={() => setShowAnswer(!showAnswer)} 
        className="relative p-6 cursor-pointer transition-all duration-300 ease-in-out min-h-[200px] flex flex-col justify-between"
      >
        {/* Content Container */}
        <div className="space-y-4">
          {/* Main Content */}
          <div className={`transform transition-all duration-500 ${showAnswer ? 'scale-0 absolute' : 'scale-100'}`}>
            <h3 className="text-xl font-semibold mb-2">Question</h3>
            <p className="text-lg">{flashcard.question}</p>
          </div>
          
          <div className={`transform transition-all duration-500 ${!showAnswer ? 'scale-0 absolute' : 'scale-100'}`}>
            <h3 className="text-xl font-semibold mb-2">Answer</h3>
            <p className="text-lg">{flashcard.answer}</p>
          </div>
        </div>

        {/* Flip Indicator */}
        <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
          {showAnswer ? (
            <ChevronUp className="w-5 h-5 animate-bounce" />
          ) : (
            <ChevronDown className="w-5 h-5 animate-bounce" />
          )}
          <span className="ml-2">
            {showAnswer ? "Tap to see question" : "Tap to see answer"}
          </span>
        </div>
      </div>

      {/* Explanation Section */}
      <div className="border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full p-4 flex items-center justify-center gap-2 hover:bg-gray-50"
          onClick={() => setShowExplanation(!showExplanation)}
        >
          <BookOpen className="w-4 h-4" />
          <span>Explanation</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showExplanation ? 'rotate-180' : ''}`} />
        </Button>
        
        <div className={`overflow-hidden transition-all duration-300 ${showExplanation ? 'max-h-48' : 'max-h-0'}`}>
          <div className="p-4 bg-gray-50">
            <p className="text-sm text-gray-600">
              {flashcard.explanation || "No explanation available for this flashcard."}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FlashcardItem;