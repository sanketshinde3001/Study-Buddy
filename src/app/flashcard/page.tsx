'use client'

import { CopilotPopup } from "@copilotkit/react-ui";
import FlashcardGenerator from './FlashcardGenerator';

export default function Home() {
  return (
    <div className="min-h-screen checkered-background">
<FlashcardGenerator />
<CopilotPopup
        labels={{
          title: "Flashcards Assistant",
          initial: "Ask question ?",
        }}
      />
    </div>
  );
}
