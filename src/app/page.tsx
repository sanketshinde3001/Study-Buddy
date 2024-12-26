"use client"
import Link from 'next/link';
import { Brain, BookOpen, Sparkles, GraduationCap } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopilotPopup } from "@copilotkit/react-ui";
import { useCopilotReadable } from "@copilotkit/react-core"; 
import { useCopilotAction } from "@copilotkit/react-core";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter(); // Call useRouter inside a component

  // Function to handle redirection
  const redirectToQuiz = () => {
    router.push('/quiz'); 
  };
  const redirectTocards = () => {
    router.push('/flashcard'); // Redirect to the /flashcard page
  };

  const data = 'The **"Smart Learning Hub"** is an interactive educational platform designed to enhance the learning experience through two main features: **Interactive Quizzes** and **Smart Flashcards**. Users can engage with adaptive quizzes that provide instant feedback, allowing them to test their knowledge and track their progress effectively. Additionally, the Smart Flashcards feature enables users to create and study personalized flashcards powered by AI, making memorization and quick reviews more efficient. Together, these features offer a dynamic and supportive environment for mastering subjects at ones own pace.'
  useCopilotReadable({
    description: "All info showen on the page.",
    value: data,
  });

  useCopilotAction({
    name: "quiz-generation",
    description: "Want to generate a quiz.",
    parameters: [
      {
        name: "generateQuiz",
        type: "boolean", 
        description: "If true, redirects to the /quiz page.",
        required: true,
      }
    ],
    handler: async ({ generateQuiz }) => {
      if (generateQuiz) {
        redirectToQuiz(); 
      } else {
        console.log("Quiz generation was not triggered.");
      }
    },
  });
  useCopilotAction({
    name: "cards-generation",
    description: "Want to generate Flashcards.",
    parameters: [
      {
        name: "generatecards",
        type: "boolean",
        description: "If true, redirects to the /flashcard page.",
        required: true,
      }
    ],
    handler: async ({ generatecards }) => {
      if (generatecards) {
        redirectTocards(); 
      } else {
        // Handle the case when generatecards is false (if necessary)
        console.log("Cards generation was not triggered.");
      }
    },
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-12 -right-12 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute w-96 h-96 -bottom-12 -left-12 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute w-96 h-96 top-1/2 left-1/2 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center mb-6">
            <Brain className="w-12 h-12 text-purple-300 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Welcome to
            <span className="block bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Smart Learning Hub
            </span>
          </h1>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Enhance your learning journey with interactive quizzes and flashcards.
            Master any subject at your own pace.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full px-4">
          <Card className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border-purple-300/20 hover:border-purple-300/40 transition-all duration-300">
            <Link href="/quiz" className="block p-6">
              <div className="absolute top-0 right-0 p-4">
                <Sparkles className="w-6 h-6 text-purple-300 group-hover:animate-spin" />
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-purple-500/20 rounded-lg w-fit">
                  <GraduationCap className="w-8 h-8 text-purple-300" />
                </div>
                <h2 className="text-2xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                  Interactive Quizzes
                </h2>
                <p className="text-purple-200">
                  Test your knowledge with our adaptive quizzes. Get instant feedback and track your progress.
                </p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Start Quiz
                </Button>
              </div>
            </Link>
          </Card>

          <Card className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border-purple-300/20 hover:border-purple-300/40 transition-all duration-300">
            <Link href="/flashcard" className="block p-6">
              <div className="absolute top-0 right-0 p-4">
                <Sparkles className="w-6 h-6 text-green-300 group-hover:animate-spin" />
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-green-500/20 rounded-lg w-fit">
                  <BookOpen className="w-8 h-8 text-green-300" />
                </div>
                <h2 className="text-2xl font-semibold text-white group-hover:text-green-300 transition-colors">
                  Smart Flashcards
                </h2>
                <p className="text-purple-200">
                  Create and study with AI-powered flashcards. Perfect for memorization and quick reviews.
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Create Flashcards
                </Button>
              </div>
            </Link>
          </Card>
        </div>

        {/* Features section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full px-4">
          {[
            { title: "AI-Powered", value: "Learning" },
            { title: "Interactive", value: "Experience" },
            { title: "Instant", value: "Feedback" },
            { title: "Progress", value: "Tracking" },
          ].map((feature, index) => (
            <div key={index} className="text-center space-y-1">
              <div className="text-purple-300 text-sm">{feature.title}</div>
              <div className="text-white font-semibold">{feature.value}</div>
            </div>
          ))}
        </div>
      </div>
      <CopilotPopup
        instructions={"You are assisting the user as best as you can. Answer in the best way possible given the data you have."}
        labels={{
          title: "Popup Assistant",
          initial: "Ask question ?",
        }}
      />
    </div>
  );
}

// Add these animations to your global CSS file
const styles = `
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
`;