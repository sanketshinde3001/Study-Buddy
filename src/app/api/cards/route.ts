import { NextResponse, NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    // Initialize Google Generative AI with API key
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

    // Initialize the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Retrieve the paragraph from the request body
    const data = await req.json();
    const paragraph: string = data.paragraph;

    // Create prompt to generate flashcards in JSON format
    const prompt = `Generate multiple flashcards based on the following paragraph. Each flashcard should have the following structure:
    {
      "question": "Question text",
      "answer": "Answer text",
      "explanation": "Explanation of answer in 3-4 lines"
    }
    Give me array of above format objects.
    Make sure you dont give any other text other above format. 
    Paragraph:
    "${paragraph}"`;

    // Generate flashcards based on the prompt
    const result = await model.generateContent(prompt);

    const response = result.response;
    let output = await response.text();

    let generatedData;
    try {
      // Clean the output if it contains code block markers (e.g., ```json)
      output = output.replace(/```json/g, "").replace(/```/g, "");

      // Parse the response to JSON
      generatedData = JSON.parse(output);
    } catch (jsonError) {
      console.error("Failed to parse JSON from AI response:", jsonError);
      return NextResponse.json({
        error: "Failed to generate flashcards in proper JSON format.",
      });
    }

    // Validate the generated data structure
    if (!Array.isArray(generatedData) || !generatedData.every(card => 
        typeof card.question === "string" &&
        typeof card.answer === "string" &&
        typeof card.explanation === "string"
      )) {
      return NextResponse.json({
        error: "Generated flashcards did not have the required fields or structure.",
      });
    }

    // Send structured JSON response
    return NextResponse.json({
      flashcards: generatedData,
    });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json({
      error: "An error occurred while generating flashcards.",
    });
  }
}
