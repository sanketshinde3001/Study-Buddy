'use client'
import QuizGenerator from './QuizGenerator';
import { CopilotPopup } from "@copilotkit/react-ui";

export default function page() {
  return (
    <div className="min-h-screen flex items-center justify-center checkered-background">
      <div className="max-w-lg w-full space-y-6 p-4 bg-white shadow-md rounded-lg">
        <QuizGenerator />
      </div>
      <CopilotPopup
        labels={{
          title: "Quiz Assistant",
          initial: "Give me topic of the quiz ?",
        }}
      />
    </div>
  );
}
