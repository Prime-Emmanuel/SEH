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

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeImageWithAI = async (base64Image: string, mimeType: string, retries = 2): Promise<any> => {
  try {
    const client = getGeminiClient();
    
    // We remove the data:image/...;base64, prefix if it exists to pass pure base64 to Gemini
    const pureBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

    const response = await client.models.generateContent({
      model: "gemini-1.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: pureBase64,
            }
          },
          {
            text: `Analyse cette image d'une offre de propriété immobilière. Extrait toutes les informations suivantes si elles sont présentes et retourne-les au format JSON stricte :
- 'type' (ex: Terrain, Maison, Appartement, etc. Laisse vide si non précisé)
- 'title' (Génère un titre court et accrocheur comme "Terrain à Douala", ou utilise une information clé)
- 'description' (Extrait tout le texte décrivant le bien. Formatte correctement)
- 'characteristics' (Un tableau de strings extraites de la description, ex: ["Quartier viabilisé", "Vue sur crique"])
- 'city' (Extrait uniquement le nom de la ville, ex: "Douala")
- 'quarter' (Extrait le quartier, ex: "Bonapriso", "Bonabéri", "Dikolo")
- 'surface' (Superficie sous forme de nombre entier, ex: 1100. N'inclut pas "m²")
- 'totalPrice' (Le prix en nombre entier, ex: 88000000. Supprime les espaces et "FCFA")
- 'ownerName' (Nom du créateur ou contact)
- 'ownerPhone' (Numéro de téléphone sans espaces)
- 'ownerEmail' (Email ou laisse vide si non trouvé)

Ne retourne QUE du JSON sans markdown, strictement. Laisse null ou une chaine vide si l'info n'est pas trouvée.`
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
  } catch (error: any) {
    if (retries > 0 && error?.status === 503) {
      console.warn("Gemini API overloaded, retrying in 2 seconds...");
      await sleep(2000);
      return analyzeImageWithAI(base64Image, mimeType, retries - 1);
    }
    console.error("Erreur lors de l'analyse d'image avec Gemini:", error);
    throw new Error(error?.status === 503 ? "L'IA est actuellement surchargée (forte demande). Veuillez réessayer dans quelques instants." : "Impossible d'analyser l'image. Vérifiez votre clé API.");
  }
};
export const generateDescriptionWithAI = async (prompt: string, retries = 2): Promise<string> => {
  try {
    const client = getGeminiClient();
    const response = await client.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Tu es un agent immobilier expert. Génère une description professionnelle et attractive pour cette propriété en français."
      }
    });

    return response.text || "";
  } catch (error: any) {
    if (retries > 0 && error?.status === 503) {
      console.warn("Gemini API overloaded, retrying in 2 seconds...");
      await sleep(2000);
      return generateDescriptionWithAI(prompt, retries - 1);
    }
    console.error("Erreur lors de la génération avec Gemini:", error);
    throw new Error(error?.status === 503 ? "L'IA est actuellement surchargée (forte demande). Veuillez réessayer dans quelques instants." : "Erreur de génération.");
  }
};
