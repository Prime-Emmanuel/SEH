import { GoogleGenAI } from "@google/genai";

// ⚠️ WARNING: EXPOSING THE API KEY CLIENT-SIDE IS A SECURITY RISK.
// ONLY DO THIS IF YOU UNDERSTAND THAT ANYONE VISITING YOUR SITE CAN EXTRACT YOUR KEY.
// DO NOT USE THIS IN PRODUCTION APPS WITH A PAID KEY UNLESS PROPERLY SECURED OR INTENDED.

export const getGeminiClient = () => {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) {
    throw new Error("Clé API Gemini non configurée ! Veuillez la définir dans le Panel Admin.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeImageWithAI = async (base64Image: string, mimeType: string): Promise<any> => {
  try {
    const client = getGeminiClient();
    
    // We remove the data:image/...;base64, prefix if it exists to pass pure base64 to Gemini
    const pureBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: pureBase64,
            }
          },
          {
            text: "Analyse cette image de propriété immobilière. Retourne un objet JSON stricte avec: 'type' (ex: Terrain, Maison, Appartement), 'title' (un titre court et accrocheur), 'description' (une description attractive), 'characteristics' (un tableau de 3-4 caractéristiques clés). Ne retourne QUE du JSON."
          }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Erreur lors de l'analyse d'image avec Gemini:", error);
    throw error;
  }
};
export const generateDescriptionWithAI = async (prompt: string): Promise<string> => {
  try {
    const client = getGeminiClient();
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Tu es un agent immobilier expert. Génère une description professionnelle et attractive pour cette propriété en français."
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Erreur lors de la génération avec Gemini:", error);
    throw error;
  }
};
