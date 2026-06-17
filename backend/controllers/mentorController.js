const axios = require("axios");

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const prompt = `
You are an AI career mentor.

Student Question:
${message}

Provide:
1. Career Guidance
2. Learning Roadmap
3. Recommended Skills
`;

    const apiKey = process.env.GROQ_API_KEY;

    // Local Mock Fallback if key is missing or is placeholder
    if (!apiKey || apiKey === "your_groq_api_key_here") {
      console.log("Groq API key not set. Using local mock response fallback.");
      const reply = getMockMentorReply(message);
      return res.json({ reply });
    }

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
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`
          },
          timeout: 12000
        }
      );

      res.json({
        reply: response.data.choices[0].message.content
      });
    } catch (apiError) {
      console.error("Groq AI API request failed, falling back to mock reply:", apiError.message);
      const reply = getMockMentorReply(message);
      res.json({ reply });
    }
  } catch (err) {
    console.error("Mentor chat server error:", err);
    res.status(500).json({ message: "Server error processing mentor chat" });
  }
};

function getMockMentorReply(message) {
  const lowercaseMsg = message.toLowerCase();

  if (lowercaseMsg.includes("resume") || lowercaseMsg.includes("cv") || lowercaseMsg.includes("job")) {
    return `### AI Mentor Guidance: Resume & Job Preparedness
1. **Career Guidance**: Tailor your resume to each job description. Make sure it highlights metrics (e.g., "improved load time by 30%") and features your active GitHub link.
2. **Learning Roadmap**:
   - Master the STAR (Situation, Task, Action, Result) method for behavioral questions.
   - Refactor your top 2 portfolio projects so their codebases are well-commented and organized.
   - Build a clean personal portfolio website.
3. **Recommended Skills**: Technical Writing, Markdown, Git/GitHub, Presentation Skills.`;
  }

  if (lowercaseMsg.includes("react") || lowercaseMsg.includes("web") || lowercaseMsg.includes("frontend") || lowercaseMsg.includes("html") || lowercaseMsg.includes("css")) {
    return `### AI Mentor Guidance: Frontend Web Development
1. **Career Guidance**: Focus on deep JavaScript knowledge and structural HTML before relying heavily on React frameworks. Build high-quality responsive designs.
2. **Learning Roadmap**:
   - Master modern JS (ES6+, Async/Await, Fetch API).
   - Learn React core concepts (Hooks, State Management, Custom Hooks).
   - Build an application that consumes public APIs and features dynamic layouts.
3. **Recommended Skills**: HTML5/CSS3, Modern JavaScript, React.js, Tailwind CSS, API Integration.`;
  }

  if (lowercaseMsg.includes("python") || lowercaseMsg.includes("data") || lowercaseMsg.includes("ml") || lowercaseMsg.includes("ai") || lowercaseMsg.includes("machine")) {
    return `### AI Mentor Guidance: Data Science & AI Development
1. **Career Guidance**: Industry demands candidates who can solve real business problems, not just run ".fit()" on basic tutorials. Focus on data cleaning and engineering.
2. **Learning Roadmap**:
   - Master SQL for database operations and Python libraries like Pandas/NumPy.
   - Study classical machine learning models (Regression, Trees, Clustering).
   - Develop understanding of Deep Learning frameworks (PyTorch or TensorFlow) and LLM prompt engineering.
3. **Recommended Skills**: Python, SQL, Pandas, Scikit-Learn, PyTorch, Jupyter Notebooks.`;
  }

  if (lowercaseMsg.includes("dsa") || lowercaseMsg.includes("coding") || lowercaseMsg.includes("leetcode") || lowercaseMsg.includes("algorithm")) {
    return `### AI Mentor Guidance: Coding & Technical Interviews
1. **Career Guidance**: Consistency beats cramming. Solve 1-2 problems daily and focus on pattern recognition (e.g., Two Pointers, Sliding Window, DFS/BFS) rather than memorizing solutions.
2. **Learning Roadmap**:
   - Begin with basic structures: Arrays, Strings, Linked Lists, Stacks, Queues.
   - Progress to Trees, Graphs, Heap, and Dynamic Programming.
   - Conduct mock coding interviews where you explain your thoughts out loud.
3. **Recommended Skills**: Time/Space Complexity Analysis, Recursion, Dynamic Programming, Hash Maps.`;
  }

  return `### AI Mentor Guidance: Career Development & Roadmap
1. **Career Guidance**: To maximize your career readiness, maintain a high CGPA, build practical software engineering projects, and practice communication daily.
2. **Learning Roadmap**:
   - **Fundamentals**: Master Object-Oriented Programming (OOP), Databases (SQL/NoSQL), and operating system concepts.
   - **Practicality**: Build a complete fullstack application (like this one!) and deploy it.
   - **Networking**: Share your learnings on LinkedIn or Twitter to build visibility.
3. **Recommended Skills**: Git/GitHub, Full-Stack Architecture, Database Management, Problem Solving.`;
}
