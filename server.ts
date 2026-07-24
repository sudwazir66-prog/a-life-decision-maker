import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Please set it in Settings > Secrets.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    decision_summary: { type: Type.STRING },
    options: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          label: { type: Type.STRING },
        },
        required: ["id", "label"],
      },
    },
    comparison: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          criterion: { type: Type.STRING },
          option_a: { type: Type.STRING },
          option_b: { type: Type.STRING },
        },
        required: ["criterion", "option_a", "option_b"],
      },
    },
    pros_cons: {
      type: Type.OBJECT,
      properties: {
        A: {
          type: Type.OBJECT,
          properties: {
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["pros", "cons"],
        },
        B: {
          type: Type.OBJECT,
          properties: {
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["pros", "cons"],
        },
      },
      required: ["A", "B"],
    },
    risks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          risk: { type: Type.STRING },
          applies_to: { type: Type.STRING },
          severity: { type: Type.STRING },
        },
        required: ["risk", "applies_to", "severity"],
      },
    },
    outcomes: {
      type: Type.OBJECT,
      properties: {
        short_term: {
          type: Type.OBJECT,
          properties: {
            A: { type: Type.STRING },
            B: { type: Type.STRING },
          },
          required: ["A", "B"],
        },
        long_term: {
          type: Type.OBJECT,
          properties: {
            A: { type: Type.STRING },
            B: { type: Type.STRING },
          },
          required: ["A", "B"],
        },
      },
      required: ["short_term", "long_term"],
    },
    perspectives: {
      type: Type.OBJECT,
      properties: {
        financial_advisor: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING },
            reasoning: { type: Type.STRING },
          },
          required: ["verdict", "reasoning"],
        },
        teacher: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING },
            reasoning: { type: Type.STRING },
          },
          required: ["verdict", "reasoning"],
        },
        psychologist: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING },
            reasoning: { type: Type.STRING },
          },
          required: ["verdict", "reasoning"],
        },
        entrepreneur: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING },
            reasoning: { type: Type.STRING },
          },
          required: ["verdict", "reasoning"],
        },
        future_you: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING },
            reasoning: { type: Type.STRING },
          },
          required: ["verdict", "reasoning"],
        },
      },
      required: [
        "financial_advisor",
        "teacher",
        "psychologist",
        "entrepreneur",
        "future_you",
      ],
    },
    final_recommendation: {
      type: Type.OBJECT,
      properties: {
        choice: { type: Type.STRING },
        confidence_score: { type: Type.INTEGER },
        one_line_reason: { type: Type.STRING },
        caveat: { type: Type.STRING },
      },
      required: ["choice", "confidence_score", "one_line_reason", "caveat"],
    },
    is_safety_crisis: { type: Type.BOOLEAN },
    safety_message: { type: Type.STRING },
  },
  required: [
    "decision_summary",
    "options",
    "comparison",
    "pros_cons",
    "risks",
    "outcomes",
    "perspectives",
    "final_recommendation",
  ],
};

const SYSTEM_INSTRUCTION = `You are the reasoning engine behind "AI Life Decision Simulator," an app that helps people think through real, personal, high-stakes decisions (careers, degrees, relocation, business ideas, major purchases, relationships-adjacent life choices, etc.).

You never tell the user what to do as if you were certain. You reason like a panel of five distinct advisors, then synthesize their views into one balanced, honest recommendation with a calibrated confidence score.

## THE FIVE PERSPECTIVES
For every decision, evaluate it through all five lenses below. Each advisor has a distinct professional bias — do not let them all say the same thing. Make the disagreement between them visible when it exists; that disagreement is the most valuable part of the analysis.

1. financial_advisor — 👨‍💼 Weighs money: income, cost of living, opportunity cost, debt, savings runway, ROI over time. Skeptical of decisions that sound exciting but are financially fragile.
2. teacher — 👩‍🏫 Weighs learning, skill-building, and long-term growth trajectory. Cares whether the choice compounds the person's knowledge and optionality, not just their paycheck.
3. psychologist — 🧠 Weighs mental health, stress load, identity, relationships, burnout risk, and whether the choice fits the person's actual temperament (not just their stated goals).
4. entrepreneur — 🚀 Weighs risk-taking, upside, speed, and momentum. Biased toward bold moves, but must flag when a "bold move" is actually reckless.
5. future_you — 👴 Speaks in first person, five years after the decision was made, looking back. Concrete, a little wistful, references the specific details of BOTH options, not generic advice.

## REASONING RULES
- Ground every claim in specifics the user actually gave you. If a critical fact is missing (salary, city, timeline, risk tolerance), note the assumption you're making explicitly rather than inventing precise numbers.
- Never invent statistics, salary figures, or market data presented as fact. Use qualitative reasoning ("likely lower starting pay") unless the user supplied numbers.
- Surface real tradeoffs. If two advisors disagree, keep the disagreement — do not average it away in the individual perspective sections. Only resolve it in final_recommendation.
- The confidence_score reflects how one-sided the evidence is, NOT how important the decision is. A coin-flip decision should score low (40-60) even if it's high-stakes.
- Tone: direct, warm, respectful of the user's autonomy. Never moralizing. Never therapy-speak. This is a thinking partner, not a fortune teller.
- Safety: If the decision involves potential self-harm, abuse, illegal activity, or the user appears to be in crisis, set is_safety_crisis to true and provide a compassionate safety_message with helpline references (e.g. 988 Suicide & Crisis Lifeline in US / international helplines).

If the user describes a single option (not a comparison — e.g. "should I quit my job to start a business?"), treat option A as "do it" and option B as "don't / stay the course," and use the same schema.
`;

app.post("/api/evaluate", async (req, res) => {
  try {
    const {
      prompt,
      optionA_override,
      optionB_override,
      financial_runway,
      risk_tolerance,
      time_horizon,
      primary_priority,
    } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Decision prompt is required." });
    }

    const ai = getGeminiClient();

    let userPromptText = `User Decision Prompt:\n"${prompt.trim()}"\n`;

    if (optionA_override) {
      userPromptText += `\nExplicit Option A: "${optionA_override.trim()}"`;
    }
    if (optionB_override) {
      userPromptText += `\nExplicit Option B: "${optionB_override.trim()}"`;
    }
    if (financial_runway) {
      userPromptText += `\nStated Financial Runway / Buffer: ${financial_runway}`;
    }
    if (risk_tolerance) {
      userPromptText += `\nStated Risk Tolerance: Level ${risk_tolerance} out of 5`;
    }
    if (time_horizon) {
      userPromptText += `\nDecision Time Horizon: ${time_horizon}`;
    }
    if (primary_priority) {
      userPromptText += `\nUser's Primary Priority: ${primary_priority}`;
    }

    userPromptText += `\n\nEvaluate this decision systematically through all 5 advisor perspectives and synthesize into the JSON format specified in the response schema. Keep advisor verdicts sharp, distinct, and grounded in the input details!`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPromptText,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: evaluationSchema,
        temperature: 0.3,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Received empty response from Gemini model.");
    }

    const result = JSON.parse(text);
    return res.json(result);
  } catch (err: any) {
    console.error("Error during evaluation:", err);
    return res.status(500).json({
      error: err.message || "Failed to generate evaluation. Please try again.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
