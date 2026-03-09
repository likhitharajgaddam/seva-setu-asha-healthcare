import { GoogleGenAI, Type } from "@google/genai";

export const getASHATrainingContent = async (topic) => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY});

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      You are an expert Medical Trainer for ASHA workers in rural India.
      Provide a comprehensive training briefing specifically for the topic: "${topic}".

      The briefing must include:
      1. Priority Module
      2. Simulated Village Scenario
      3. Counseling Scripts
      4. Quick Quiz
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          priorityModule: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              rationale: { type: Type.STRING },
            },
            required: ["title", "keyPoints", "rationale"],
          },
          simulation: {
            type: Type.OBJECT,
            properties: {
              context: { type: Type.STRING },
              challenge: { type: Type.STRING },
              correctResponse: { type: Type.STRING },
            },
            required: ["context", "challenge", "correctResponse"],
          },
          counselingScripts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                scenario: { type: Type.STRING },
                script: { type: Type.STRING },
              },
            },
          },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                answer: { type: Type.STRING },
              },
            },
          },
        },
        required: ["priorityModule", "simulation", "quiz"],
      },
    },
  });

  return JSON.parse(response.text);
};

export const getHealthInsights = async (patients) => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY});

  const summary = patients.map((p) => ({
    name: p.name,
    category: p.category,
    lastVisit: p.lastVisitDate,
    riskLevel: p.riskLevel,
    village: p.village,
    latestVisitSummary:
      p.visits && p.visits.length > 0
        ? {
            bp: p.visits[0].bloodPressure,
            weight: p.visits[0].weight,
            symptoms: p.visits[0].symptoms,
          }
        : null,
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze these records and provide a high-priority action plan for an ASHA worker.
    Patient Data: ${JSON.stringify(summary)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          criticalCases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                patientName: { type: Type.STRING },
                reason: { type: Type.STRING },
                actionItem: { type: Type.STRING },
                urgency: { type: Type.STRING },
              },
            },
          },
          villageReport: { type: Type.STRING },
          trainingTip: { type: Type.STRING },
        },
        required: ["criticalCases", "villageReport", "trainingTip"],
      },
    },
  });

  return JSON.parse(response.text);
};

export const getSurveyAnalytics = async (surveys) => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

  const data = surveys.map((s) => ({
    title: s.templateTitle,
    village: s.village,
    answers: s.answers,
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze these community health survey results and provide strategic insights.
    Survey Data: ${JSON.stringify(data)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          trends: { type: Type.ARRAY, items: { type: Type.STRING } },
          priorities: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING },
        },
        required: ["trends", "priorities", "summary"],
      },
    },
  });

  return JSON.parse(response.text);
};

export const getNearbyMedicalSupport = async (location) => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
      I am an ASHA worker at coordinates 
      ${location.latitude}, ${location.longitude}.
      Find nearest PHC, CHC and Govt Hospitals.
    `,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        },
      },
    },
  });

  return {
    text: response.text,
    groundingChunks:
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
  };
};
