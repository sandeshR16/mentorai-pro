const questions = require("../services/questionBank");
const MockInterview = require("../models/MockInterview");
const axios = require("axios");
const mongoose = require("mongoose");

exports.generateQuestion = async (req, res) => {
  try {
    const { type } = req.body;
    if (!type || !questions[type]) {
      return res.status(400).json({ message: "Invalid or missing interview type" });
    }

    const list = questions[type];
    const randomQuestion = list[Math.floor(Math.random() * list.length)];

    res.json({
      question: randomQuestion
    });
  } catch (err) {
    console.error("Generate question error:", err);
    res.status(500).json({ message: "Server error generating question" });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { type, question, answer } = req.body;

    if (!type || !question || !answer) {
      return res.status(400).json({ message: "Missing type, question, or answer" });
    }

    const prompt = `
You are an expert technical and HR interview evaluator.

Question:
${question}

Student Answer:
${answer}

Evaluate and return exactly a JSON object (no markdown, no backticks, just raw JSON) containing:
{
  "score": <score out of 10 as a number>,
  "strengths": "<brief explanation of what they did well>",
  "weaknesses": "<brief explanation of what they missed or failed to cover>",
  "improvementTips": "<specific actionable advice for improvement>"
}
`;

    const apiKey = process.env.GROQ_API_KEY;
    let evaluationResult;

    if (!apiKey || apiKey === "your_groq_api_key_here") {
      console.log("Groq API key not set. Using local mock evaluation.");
      evaluationResult = getMockEvaluation(question, answer);
    } else {
      try {
        const response = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.2
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`
            },
            timeout: 12000
          }
        );

        let content = response.data.choices[0].message.content.trim();
        // Remove code formatting if present
        if (content.startsWith("```")) {
          content = content
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/, "")
            .replace(/```$/, "")
            .trim();
        }

        try {
          evaluationResult = JSON.parse(content);
        } catch (jsonErr) {
          console.warn("Failed to parse LLM evaluation JSON directly. Scraping parameters.");
          evaluationResult = extractJsonFields(content, answer);
        }
      } catch (apiError) {
        console.error("Groq AI request failed, falling back to local evaluator:", apiError.message);
        evaluationResult = getMockEvaluation(question, answer);
      }
    }

    // Save to database
    let interview;
    const interviewData = {
      userId: req.user?.id || "66708dc2cb4e92bb3c8c7f99",
      type,
      question,
      answer,
      feedback: JSON.stringify(evaluationResult),
      score: evaluationResult.score || 7
    };

    if (mongoose.connection.readyState === 1) {
      interview = await MockInterview.create(interviewData);
    } else {
      console.log("Database offline. Generating mock interview response.");
      interview = {
        _id: "66708dc2cb4e92bb3c8c7f" + Math.floor(Math.random() * 100),
        ...interviewData,
        createdAt: new Date()
      };
    }

    res.json(interview);
  } catch (error) {
    console.error("Submit answer error:", error);
    res.status(500).json({ message: "Server error submitting answer evaluation" });
  }
};

function isGibberish(text) {
  const clean = text.toLowerCase().trim();
  if (clean.length < 5) return true;

  // Check for keyboard mashing
  if (clean.includes("asdf") || clean.includes("qwer") || clean.includes("zxcv") || clean.includes("fghj") || clean.includes("hjkl") || clean.includes("sdfg")) {
    return true;
  }

  const words = clean.split(/\s+/);
  if (words.length === 1 && clean.length > 18) {
    return true;
  }

  // Count letters
  let vowels = 0;
  let consonants = 0;
  for (let char of clean) {
    if (/[aeiou]/.test(char)) {
      vowels++;
    } else if (/[a-z]/.test(char)) {
      consonants++;
    }
  }

  if (consonants > 5 && vowels === 0) return true;
  const ratio = vowels / (vowels + consonants || 1);
  if (consonants > 8 && (ratio < 0.12 || ratio > 0.85)) return true;

  // Repetitive spam checks
  const uniqueWords = new Set(words);
  if (words.length > 4 && uniqueWords.size / words.length < 0.35) {
    return true;
  }

  return false;
}

function getMockEvaluation(question, answer) {
  if (!answer || isGibberish(answer)) {
    return {
      score: 1,
      strengths: "None. The answer appears to be gibberish or spam.",
      weaknesses: "The input does not form coherent English sentences or relevant professional content.",
      improvementTips: "Please provide a professional, coherent, and structured answer to the question."
    };
  }

  const answerLength = answer.trim().length;
  let score = 5;
  let strengths = "Your response has been registered and verified by our system.";
  let weaknesses = "The explanation is somewhat brief or lacks structured points.";
  let tips = "Try structuring your responses using the STAR format (Situation, Task, Action, Result) to add practical examples.";

  if (answerLength > 150) {
    score = 8;
    strengths = "Good detail with thorough coverage of the prompt. You exhibited good subject knowledge.";
    weaknesses = "Could benefit from incorporating technical metrics or explicit project names.";
    tips = "Explicitly outline your specific individual contribution and the final metrics of success.";
  } else if (answerLength > 60) {
    score = 7;
    strengths = "Direct response that clearly addresses the question.";
    weaknesses = "A bit abstract. Lacks structural examples or theoretical backing.";
    tips = "Provide a concrete scenario or use cases to ground your theoretical definitions.";
  } else if (answerLength > 10) {
    score = 6;
    strengths = "Gave a baseline definition.";
    weaknesses = "Very brief. Does not explore the nuances of the question.";
    tips = "Try expanding your answer to at least 3-4 sentences containing definitions, operations, and benefits.";
  }

  return {
    score,
    strengths,
    weaknesses,
    improvementTips: tips
  };
}

function extractJsonFields(content, answer) {
  // Simple regex parser fallback for LLMs that did not output strict JSON
  let scoreMatch = content.match(/"score":\s*(\d+)/) || content.match(/score.*?(\d+)/i);
  let score = scoreMatch ? parseInt(scoreMatch[1]) : 7;
  
  return {
    score,
    strengths: "The student provided a functional response.",
    weaknesses: "Raw feedback format returned from AI model.",
    improvementTips: "Review core definitions and practice mock interview structures."
  };
}
