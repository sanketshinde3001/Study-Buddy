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
    console.log(paragraph)

    // Create a prompt to generate quiz questions in JSON format
    const prompt = `Generate 5+ quiz questions based on the following paragraph.Try to make some general knowledge questions. Each question should have the following structure:
    {
      "question": "Quiz question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": "Correct option from above"
    }
    Give me an array of objects in the above format.
    Do not generate yes/no type question.
    Ensure that there is no additional text outside this format.
    Paragraph:
    "${paragraph}"`;

    // Generate quiz questions based on the prompt
    const result = await model.generateContent(prompt);
   
    
    const response = result.response;
    let output = await response.text();
//  console.log(output);
    let generatedData;
    try {
      // Clean the output if it contains code block markers (e.g., ```json)
      output = output.replace(/```json/g, "").replace(/```/g, "");

      // Parse the response to JSON
      generatedData = JSON.parse(output);
    } catch (jsonError) {
      console.error("Failed to parse JSON from AI response:", jsonError);
      return NextResponse.json({
        error: "Failed to generate quiz questions in proper JSON format.",
      });
    }

    // Validate the generated data structure
    if (!Array.isArray(generatedData) || !generatedData.every(question =>
      typeof question.question === "string" &&
      Array.isArray(question.options) &&
      question.options.length === 4 &&
      typeof question.correctAnswer === "string"
    )) {
      return NextResponse.json({
        error: "Generated quiz questions did not have the required fields or structure.",
      });
    }

    // Send structured JSON response
    return NextResponse.json({
      quizQuestions: generatedData,
    });
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    return NextResponse.json({
      error: "An error occurred while generating quiz questions.",
    });
  }
}
